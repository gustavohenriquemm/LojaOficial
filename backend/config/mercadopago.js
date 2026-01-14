// ================================================
// CONFIGURAÇÃO DO MERCADO PAGO
// ================================================

require('dotenv').config();
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Determinar qual credencial usar baseado no ambiente
const isProduction = process.env.NODE_ENV === 'production';

// Aceitar tanto formato MERCADOPAGO_* (Render) quanto MP_* (local)
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN 
  || (isProduction 
    ? process.env.MP_ACCESS_TOKEN_PROD 
    : process.env.MP_ACCESS_TOKEN_TEST);

const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY 
  || (isProduction 
    ? process.env.MP_PUBLIC_KEY_PROD 
    : process.env.MP_PUBLIC_KEY_TEST);

// Validar se as credenciais existem
if (!accessToken) {
  console.warn('⚠️ AVISO: Access Token do Mercado Pago não configurado!');
  console.warn('💡 Configure uma destas variáveis de ambiente:');
  console.warn('   - MERCADOPAGO_ACCESS_TOKEN (Render/produção)');
  console.warn('   - MP_ACCESS_TOKEN_TEST (desenvolvimento)');
  console.warn('   - MP_ACCESS_TOKEN_PROD (produção local)');
  console.warn('🔒 Funcionalidades de pagamento desabilitadas até configuração.');
  
  // Exportar módulo com funcionalidades desabilitadas
  module.exports = {
    client: null,
    preference: null,
    payment: null,
    publicKey: null,
    accessToken: null,
    isProduction,
    configured: false
  };
} else {
  // Configurar o SDK do Mercado Pago (v2)
  const client = new MercadoPagoConfig({ 
    accessToken: accessToken,
    options: { timeout: 5000 }
  });

  const preference = new Preference(client);
  const payment = new Payment(client);

  console.log(`✅ Mercado Pago configurado em modo: ${isProduction ? 'PRODUÇÃO' : 'TESTE'}`);

  module.exports = {
    client,
    preference,
    payment,
    publicKey,
    accessToken,
    isProduction,
    configured: true
  };
}
