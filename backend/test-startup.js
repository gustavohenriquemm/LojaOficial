// ================================================
// TESTE DE INICIALIZAÇÃO - DIAGNÓSTICO
// ================================================
// Este script testa se o servidor pode iniciar corretamente

console.log('🔍 Iniciando diagnóstico...\n');

// 1. Testar versão do Node.js
console.log('📦 Node.js:', process.version);
console.log('💻 Plataforma:', process.platform);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('');

// 2. Testar módulos básicos
try {
  console.log('✅ Testando módulos básicos...');
  require('fs');
  require('path');
  console.log('   ✓ fs, path');
} catch (error) {
  console.error('❌ Erro nos módulos básicos:', error.message);
  process.exit(1);
}

// 3. Testar dependências
try {
  console.log('✅ Testando dependências npm...');
  require('express');
  require('cors');
  require('body-parser');
  require('dotenv');
  console.log('   ✓ express, cors, body-parser, dotenv');
} catch (error) {
  console.error('❌ Erro nas dependências:', error.message);
  console.error('💡 Execute: npm install');
  process.exit(1);
}

// 4. Testar Mercado Pago SDK
try {
  console.log('✅ Testando Mercado Pago SDK...');
  const { MercadoPagoConfig } = require('mercadopago');
  console.log('   ✓ mercadopago');
} catch (error) {
  console.error('❌ Erro no Mercado Pago SDK:', error.message);
  process.exit(1);
}

// 5. Testar criação de diretórios
try {
  console.log('✅ Testando criação de diretórios...');
  const fs = require('fs');
  const path = require('path');
  
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('   ✓ Diretório data/ criado');
  } else {
    console.log('   ✓ Diretório data/ já existe');
  }
} catch (error) {
  console.error('❌ Erro ao criar diretórios:', error.message);
  process.exit(1);
}

// 6. Testar importação de configurações
try {
  console.log('✅ Testando importação de configurações...');
  const mercadopago = require('./config/mercadopago');
  console.log('   ✓ config/mercadopago.js');
  console.log('   ✓ Mercado Pago configurado:', mercadopago.configured);
  
  const Database = require('./config/database');
  console.log('   ✓ config/database.js');
} catch (error) {
  console.error('❌ Erro nas configurações:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// 7. Testar importação de rotas
try {
  console.log('✅ Testando importação de rotas...');
  require('./routes/payment');
  console.log('   ✓ routes/payment.js');
  require('./routes/webhook');
  console.log('   ✓ routes/webhook.js');
  require('./routes/products');
  console.log('   ✓ routes/products.js');
} catch (error) {
  console.error('❌ Erro nas rotas:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// 8. Testar inicialização do Express
try {
  console.log('✅ Testando inicialização do Express...');
  const express = require('express');
  const app = express();
  console.log('   ✓ Express inicializado');
} catch (error) {
  console.error('❌ Erro no Express:', error.message);
  process.exit(1);
}

console.log('\n' + '='.repeat(50));
console.log('✅ TODOS OS TESTES PASSARAM!');
console.log('='.repeat(50));
console.log('💡 O servidor deve iniciar corretamente.');
console.log('\nExecute: npm start');
console.log('');

process.exit(0);
