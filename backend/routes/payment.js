// ================================================
// ROTAS DE PAGAMENTO - MERCADO PAGO
// ================================================

const express = require('express');
const router = express.Router();
const { preference, publicKey, payment, configured } = require('../config/mercadopago');
const Database = require('../config/database');

// Middleware para verificar se Mercado Pago está configurado
const checkMercadoPagoConfig = (req, res, next) => {
  if (!configured) {
    return res.status(503).json({ 
      error: 'Mercado Pago não configurado',
      message: 'As credenciais do Mercado Pago não foram configuradas. Configure MERCADOPAGO_ACCESS_TOKEN e MERCADOPAGO_PUBLIC_KEY.'
    });
  }
  next();
};

// ================================================
// GET: Retornar Public Key para o frontend
// ================================================
router.get('/public-key', checkMercadoPagoConfig, (req, res) => {
  res.json({ publicKey });
});

// ================================================
// POST: Criar Preferência de Pagamento
// ================================================
router.post('/create-preference', checkMercadoPagoConfig, async (req, res) => {
  try {
    const { items, payer, back_urls, metadata } = req.body;

    // Validação básica
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'Items são obrigatórios e devem ser um array não vazio' 
      });
    }

    // Validar estrutura dos items
    for (const item of items) {
      if (!item.title || !item.unit_price || !item.quantity) {
        return res.status(400).json({ 
          error: 'Cada item deve ter title, unit_price e quantity' 
        });
      }
    }

    // Configurar URLs de retorno padrão se não fornecidas
    const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5503';
    const defaultBackUrls = {
      success: process.env.SUCCESS_URL || `${frontendUrl}/checkout.html?status=success`,
      failure: process.env.FAILURE_URL || `${frontendUrl}/checkout.html?status=failure`,
      pending: process.env.PENDING_URL || `${frontendUrl}/checkout.html?status=pending`
    };

    // Garantir que back_urls sempre tenha valores válidos
    const backUrls = back_urls && back_urls.success && back_urls.failure && back_urls.pending 
      ? back_urls 
      : defaultBackUrls;

    console.log('📋 Back URLs configuradas:', backUrls);

    // Criar preferência no Mercado Pago
    const preferenceData = {
      items: items.map(item => ({
        title: item.title,
        unit_price: parseFloat(item.unit_price),
        quantity: parseInt(item.quantity),
        currency_id: 'BRL',
        description: item.description || item.title
      })),
      payer: payer || {},
      back_urls: {
        success: backUrls.success,
        failure: backUrls.failure,
        pending: backUrls.pending
      },
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/webhook`,
      statement_descriptor: 'Presentes Especiais',
      external_reference: metadata?.orderId || `order_${Date.now()}`,
      metadata: metadata || {}
    };

    console.log('📦 Dados da preferência:', JSON.stringify(preferenceData, null, 2));

    // Criar preferência via SDK v2
    const response = await preference.create({ body: preferenceData });

    console.log('📥 Resposta do Mercado Pago:', JSON.stringify(response, null, 2));

    // Salvar pedido no banco de dados
    const order = Database.createOrder({
      preferenceId: response.id,
      items: items,
      payer: payer,
      total: items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0),
      status: 'pending',
      paymentStatus: 'pending',
      metadata: metadata || {}
    });

    console.log(`✅ Preferência criada: ${response.id} | Pedido: ${order.id}`);

    // Retornar resposta para o frontend
    res.json({
      success: true,
      preferenceId: response.id,
      orderId: order.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point
    });

  } catch (error) {
    console.error('❌ Erro ao criar preferência:', error);
    res.status(500).json({ 
      error: 'Erro ao criar preferência de pagamento',
      message: error.message 
    });
  }
});

// ================================================
// GET: Consultar status de um pedido
// ================================================
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = Database.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    console.log(`🔍 Consultando pedido ${orderId}...`);

    // Se já tem dados de pagamento, verificar se precisa atualizar
    if (order.preferenceId && (!order.payment || order.paymentStatus === 'pending')) {
      try {
        console.log(`🔄 Buscando pagamentos da preferência ${order.preferenceId} no Mercado Pago...`);
        
        // Buscar pagamentos da preferência no Mercado Pago
        const searchResponse = await payment.search({
          options: {
            criteria: 'desc',
            external_reference: order.metadata?.orderId || order.id,
            sort: 'date_created'
          }
        });

        console.log(`📦 Encontrados ${searchResponse.results?.length || 0} pagamentos`);

        if (searchResponse.results && searchResponse.results.length > 0) {
          // Pegar o pagamento mais recente
          const latestPayment = searchResponse.results[0];
          console.log(`💳 Status no MP: ${latestPayment.status} (ID: ${latestPayment.id})`);

          // Atualizar pedido se status mudou
          if (latestPayment.status !== order.paymentStatus) {
            console.log(`✅ Atualizando pedido com status: ${latestPayment.status}`);
            
            const updateData = {
              paymentId: latestPayment.id,
              paymentStatus: latestPayment.status,
              status: latestPayment.status === 'approved' ? 'approved' : latestPayment.status,
              payment: {
                id: latestPayment.id,
                status: latestPayment.status,
                statusDetail: latestPayment.status_detail,
                paymentMethod: latestPayment.payment_method_id,
                transactionAmount: latestPayment.transaction_amount,
                dateApproved: latestPayment.date_approved,
                dateCreated: latestPayment.date_created
              },
              paymentData: {
                id: latestPayment.id,
                status: latestPayment.status,
                statusDetail: latestPayment.status_detail,
                paymentMethod: latestPayment.payment_method_id,
                transactionAmount: latestPayment.transaction_amount,
                dateApproved: latestPayment.date_approved,
                dateCreated: latestPayment.date_created
              }
            };

            if (latestPayment.status === 'approved') {
              updateData.paidAt = latestPayment.date_approved || new Date().toISOString();
            }

            Database.updateOrder(order.id, updateData);
            
            // Retornar dados atualizados
            const updatedOrder = Database.getOrderById(orderId);
            return res.json({
              success: true,
              order: updatedOrder
            });
          }
        }
      } catch (mpError) {
        console.error('⚠️ Erro ao buscar no Mercado Pago:', mpError.message);
        // Continuar com dados do banco
      }
    }

    res.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        items: order.items,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        payment: order.payment,
        paymentData: order.paymentData,
        metadata: order.metadata
      }
    });

  } catch (error) {
    console.error('❌ Erro ao consultar pedido:', error);
    res.status(500).json({ 
      error: 'Erro ao consultar pedido',
      message: error.message 
    });
  }
});

// ================================================
// GET: Verificar status do pagamento por preference ID
// ================================================
router.get('/status/:preferenceId', async (req, res) => {
  try {
    const { preferenceId } = req.params;
    
    console.log('🔍 Verificando status do pagamento:', preferenceId);
    
    // Buscar pedido pelo preference ID
    const order = Database.getOrderByPreferenceId(preferenceId);
    
    if (!order) {
      return res.json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    // Se já tem informações de pagamento, retornar
    if (order.payment || order.paymentData) {
      const paymentInfo = order.payment || order.paymentData || {};
      console.log('✅ Pagamento encontrado no DB:', paymentInfo.status || order.paymentStatus);
      return res.json({
        success: true,
        payment: {
          status: paymentInfo.status || order.paymentStatus || 'pending',
          id: paymentInfo.id || order.paymentId || null,
          ...paymentInfo
        },
        order: order
      });
    }
    
    // Caso contrário, retornar status pendente
    res.json({
      success: true,
      payment: {
        status: order.paymentStatus || 'pending',
        id: null
      },
      order: order
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================================
// GET: Listar todos os pedidos (Admin)
// ================================================
router.get('/orders', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const orders = Database.listOrders(limit);

    res.json({
      success: true,
      count: orders.length,
      orders: orders.map(order => ({
        id: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        paidAt: order.paidAt
      }))
    });

  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error);
    res.status(500).json({ 
      error: 'Erro ao listar pedidos',
      message: error.message 
    });
  }
});

module.exports = router;
