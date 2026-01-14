// ================================================
// WEBHOOK PARA NOTIFICAÇÕES DO MERCADO PAGO
// ================================================

const express = require('express');
const router = express.Router();
const { payment, configured } = require('../config/mercadopago');
const Database = require('../config/database');

// Middleware para verificar se Mercado Pago está configurado
const checkMercadoPagoConfig = (req, res, next) => {
  if (!configured) {
    console.warn('⚠️ Webhook recebido mas Mercado Pago não configurado');
    return res.status(200).send('OK'); // Responder OK para não bloquear Mercado Pago
  }
  next();
};

// ================================================
// POST: Receber notificações do Mercado Pago
// ================================================
router.post('/', checkMercadoPagoConfig, async (req, res) => {
  try {
    // Mercado Pago envia notificações neste formato:
    // { id: "123456", topic: "payment" } ou { id: "123456", topic: "merchant_order" }
    
    const { id, topic, type } = req.body;
    const notificationType = topic || type;

    console.log(`📬 Webhook recebido: ${notificationType} | ID: ${id}`);

    // Responder imediatamente ao Mercado Pago (importante!)
    res.status(200).send('OK');

    // Processar notificação de forma assíncrona
    if (notificationType === 'payment') {
      await processPaymentNotification(id);
    } else if (notificationType === 'merchant_order') {
      await processMerchantOrderNotification(id);
    }

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).send('Error');
  }
});

// ================================================
// Processar notificação de pagamento
// ================================================
async function processPaymentNotification(paymentId) {
  try {
    console.log(`🔍 Buscando informações do pagamento ${paymentId}...`);
    
    // Buscar informações do pagamento no Mercado Pago
    const paymentResponse = await payment.get({ id: paymentId });
    const paymentData = paymentResponse;

    console.log(`💳 Pagamento ${paymentId} | Status: ${paymentData.status}`);

    // Extrair informações relevantes
    const externalReference = paymentData.external_reference;
    const status = paymentData.status;
    const statusDetail = paymentData.status_detail;
    const transactionAmount = paymentData.transaction_amount;
    const paymentMethod = paymentData.payment_method_id;

    // Buscar pedido pelo external_reference
    const orders = Database.readOrders();
    const order = orders.find(o => 
      o.metadata?.orderId === externalReference || 
      o.preferenceId === paymentData.metadata?.preference_id ||
      o.id === externalReference
    );

    if (!order) {
      console.log(`⚠️ Pedido não encontrado para o pagamento ${paymentId} (ref: ${externalReference})`);
      return;
    }

    console.log(`📦 Pedido encontrado: ${order.id}`);

    // Atualizar pedido com dados do pagamento
    const updateData = {
      paymentId: paymentId,
      status: mapPaymentStatus(status),
      paymentStatus: status,
      paymentStatusDetail: statusDetail,
      paymentMethod: paymentMethod,
      transactionAmount: transactionAmount,
      payment: {
        id: paymentId,
        status: status,
        statusDetail: statusDetail,
        paymentMethod: paymentMethod,
        transactionAmount: transactionAmount,
        dateApproved: paymentData.date_approved,
        dateCreated: paymentData.date_created
      },
      paymentData: {
        id: paymentId,
        status: status,
        statusDetail: statusDetail,
        paymentMethod: paymentMethod,
        transactionAmount: transactionAmount,
        dateApproved: paymentData.date_approved,
        dateCreated: paymentData.date_created
      },
      updatedAt: new Date().toISOString()
    };

    // Se aprovado, adicionar data de pagamento
    if (status === 'approved') {
      updateData.paidAt = paymentData.date_approved || new Date().toISOString();
    }

    Database.updateOrder(order.id, updateData);

    console.log(`✅ Pedido ${order.id} atualizado: ${status}`);

    // Ações baseadas no status
    if (status === 'approved') {
      await onPaymentApproved(order, paymentData);
    } else if (status === 'rejected') {
      await onPaymentRejected(order, paymentData);
    } else if (status === 'pending' || status === 'in_process') {
      await onPaymentPending(order, paymentData);
    }

  } catch (error) {
    console.error(`❌ Erro ao processar pagamento ${paymentId}:`, error);
    console.error('Stack:', error.stack);
  }
}

// ================================================
// Processar notificação de merchant_order
// ================================================
async function processMerchantOrderNotification(merchantOrderId) {
  try {
    const merchantOrder = await mercadopago.merchant_orders.findById(merchantOrderId);
    const orderData = merchantOrder.body;

    console.log(`📦 Merchant Order ${merchantOrderId} | Status: ${orderData.order_status}`);

    // Processar os pagamentos associados
    if (orderData.payments && orderData.payments.length > 0) {
      for (const payment of orderData.payments) {
        if (payment.id) {
          await processPaymentNotification(payment.id);
        }
      }
    }

  } catch (error) {
    console.error(`❌ Erro ao processar merchant_order ${merchantOrderId}:`, error);
  }
}

// ================================================
// Mapear status do Mercado Pago para status interno
// ================================================
function mapPaymentStatus(mpStatus) {
  const statusMap = {
    'approved': 'approved',
    'pending': 'pending',
    'in_process': 'pending',
    'in_mediation': 'pending',
    'rejected': 'rejected',
    'cancelled': 'cancelled',
    'refunded': 'refunded',
    'charged_back': 'refunded'
  };

  return statusMap[mpStatus] || 'unknown';
}

// ================================================
// Ações quando pagamento é aprovado
// ================================================
async function onPaymentApproved(order, paymentData) {
  console.log(`✅ PAGAMENTO APROVADO | Pedido: ${order.id}`);
  
  // AQUI VOCÊ PODE:
  // - Enviar email de confirmação
  // - Liberar produto digital
  // - Atualizar estoque
  // - Enviar notificação
  // - Integrar com sistema de entrega
  // - etc.

  // Exemplo: Log dos dados
  console.log(`   Cliente: ${order.payer?.name || 'N/A'}`);
  console.log(`   Email: ${order.payer?.email || 'N/A'}`);
  console.log(`   Valor: R$ ${paymentData.transaction_amount}`);
  console.log(`   Método: ${paymentData.payment_method_id}`);
}

// ================================================
// Ações quando pagamento é rejeitado
// ================================================
async function onPaymentRejected(order, paymentData) {
  console.log(`❌ PAGAMENTO REJEITADO | Pedido: ${order.id}`);
  console.log(`   Motivo: ${paymentData.status_detail}`);
  
  // AQUI VOCÊ PODE:
  // - Enviar email notificando rejeição
  // - Sugerir outro método de pagamento
  // - etc.
}

// ================================================
// Ações quando pagamento está pendente
// ================================================
async function onPaymentPending(order, paymentData) {
  console.log(`⏳ PAGAMENTO PENDENTE | Pedido: ${order.id}`);
  console.log(`   Detalhe: ${paymentData.status_detail}`);
  
  // AQUI VOCÊ PODE:
  // - Enviar email informando que pagamento está pendente
  // - Para boleto: enviar link do boleto
  // - Para Pix: lembrar de fazer o pagamento
  // - etc.
}

// ================================================
// GET: Testar webhook (desenvolvimento)
// ================================================
router.get('/test', (req, res) => {
  res.json({
    message: 'Webhook endpoint ativo',
    url: `${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
});

module.exports = router;
