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
  console.error('❌ ERRO: Access Token do Mercado Pago não configurado!');
  console.error('💡 Configure uma destas variáveis de ambiente:');
  console.error('   - MERCADOPAGO_ACCESS_TOKEN (Render/produção)');
  console.error('   - MP_ACCESS_TOKEN_TEST (desenvolvimento)');
  console.error('   - MP_ACCESS_TOKEN_PROD (produção local)');
  process.exit(1);
}

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
  isProduction
};
