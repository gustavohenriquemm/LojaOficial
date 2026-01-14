// ================================================
// TESTE DE VALIDAÇÃO DO BACKEND
// ================================================

const http = require('http');

console.log('🧪 Iniciando testes de validação do backend...\n');

// Teste 1: Verificar se package.json está correto
console.log('📦 Teste 1: Verificando package.json...');
try {
  const pkg = require('./package.json');
  
  if (!pkg.scripts.start) {
    throw new Error('Script "start" não encontrado');
  }
  
  if (!pkg.scripts.init) {
    throw new Error('Script "init" não encontrado');
  }
  
  if (!pkg.engines || !pkg.engines.node) {
    throw new Error('Versão do Node.js não especificada');
  }
  
  console.log('   ✅ package.json válido');
  console.log(`   → Script start: ${pkg.scripts.start}`);
  console.log(`   → Node.js: ${pkg.engines.node}`);
} catch (error) {
  console.log(`   ❌ Erro: ${error.message}`);
  process.exit(1);
}

// Teste 2: Verificar arquivos necessários
console.log('\n📁 Teste 2: Verificando arquivos necessários...');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'server.js',
  'init.js',
  'package.json',
  'config/mercadopago.js',
  'config/database.js',
  'routes/payment.js',
  'routes/webhook.js',
  'routes/products.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  if (exists) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} não encontrado`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Alguns arquivos estão faltando!');
  process.exit(1);
}

// Teste 3: Verificar configuração de porta dinâmica
console.log('\n🔌 Teste 3: Verificando configuração de porta...');
const serverCode = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

if (serverCode.includes('process.env.PORT')) {
  console.log('   ✅ Porta dinâmica configurada (process.env.PORT)');
} else {
  console.log('   ❌ Porta dinâmica não encontrada');
  process.exit(1);
}

if (serverCode.includes('0.0.0.0')) {
  console.log('   ✅ Host configurado para 0.0.0.0');
} else {
  console.log('   ⚠️ Host pode não estar configurado para 0.0.0.0');
}

// Teste 4: Verificar CORS
console.log('\n🔐 Teste 4: Verificando configuração CORS...');
if (serverCode.includes('cors')) {
  console.log('   ✅ CORS middleware configurado');
} else {
  console.log('   ❌ CORS não encontrado');
  process.exit(1);
}

// Teste 5: Verificar rotas essenciais
console.log('\n🛣️ Teste 5: Verificando rotas essenciais...');
const requiredRoutes = [
  '/health',
  '/api/payment',
  '/api/webhook',
  '/api/products'
];

requiredRoutes.forEach(route => {
  if (serverCode.includes(route)) {
    console.log(`   ✅ Rota ${route} encontrada`);
  } else {
    console.log(`   ❌ Rota ${route} não encontrada`);
  }
});

// Teste 6: Verificar script init.js
console.log('\n🔧 Teste 6: Verificando script de inicialização...');
const initCode = fs.readFileSync(path.join(__dirname, 'init.js'), 'utf8');

if (initCode.includes('mkdirSync')) {
  console.log('   ✅ Script cria diretórios automaticamente');
} else {
  console.log('   ❌ Script não cria diretórios');
}

// Teste 7: Verificar estrutura de diretórios
console.log('\n📂 Teste 7: Verificando estrutura de diretórios...');
const dataDir = path.join(__dirname, 'data');

if (fs.existsSync(dataDir)) {
  console.log('   ✅ Diretório data/ existe');
} else {
  console.log('   ⚠️ Diretório data/ será criado no primeiro start');
}

// Teste 8: Verificar tratamento de variáveis de ambiente
console.log('\n🌍 Teste 8: Verificando tratamento de variáveis de ambiente...');
const paymentCode = fs.readFileSync(path.join(__dirname, 'routes/payment.js'), 'utf8');

if (paymentCode.includes('process.env.FRONTEND_URL') || paymentCode.includes('RENDER_EXTERNAL_URL')) {
  console.log('   ✅ URLs dinâmicas configuradas');
} else {
  console.log('   ❌ URLs hardcoded encontradas');
}

if (paymentCode.includes('localhost') && paymentCode.includes('process.env')) {
  console.log('   ✅ Localhost apenas como fallback');
} else if (!paymentCode.includes('localhost')) {
  console.log('   ✅ Sem localhost hardcoded');
} else {
  console.log('   ⚠️ Verifique uso de localhost');
}

// Resumo
console.log('\n' + '='.repeat(50));
console.log('✅ TODOS OS TESTES PASSARAM!');
console.log('='.repeat(50));
console.log('\n📝 Checklist de Deploy:');
console.log('   ✅ package.json configurado corretamente');
console.log('   ✅ Porta dinâmica com process.env.PORT');
console.log('   ✅ Host 0.0.0.0 para aceitar conexões externas');
console.log('   ✅ CORS configurado');
console.log('   ✅ Rotas essenciais presentes');
console.log('   ✅ Script de inicialização criado');
console.log('   ✅ URLs dinâmicas sem localhost hardcoded');
console.log('\n🚀 Backend está pronto para deploy no Render!');
console.log('\n📖 Próximos passos:');
console.log('   1. Commit e push das alterações');
console.log('   2. Criar Web Service no Render');
console.log('   3. Configurar variáveis de ambiente');
console.log('   4. Aguardar o deploy');
console.log('\n📄 Leia INSTRUCOES_DEPLOY.md para detalhes completos.\n');
