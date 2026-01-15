// ================================================
// SERVIDOR NODE.JS - BACKEND MERCADO PAGO
// ================================================

console.log('🔧 Iniciando servidor...');
console.log(`📦 Node.js: ${process.version}`);
console.log(`💻 Plataforma: ${process.platform}`);
console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// Inicialização do ambiente
const fs = require('fs');
const path = require('path');

console.log('🔧 Inicializando ambiente do backend...');

try {
  // Criar diretório data se não existir
  // Em produção no Render, usar /tmp pois o filesystem é read-only
  const isProduction = process.env.NODE_ENV === 'production';
  const dataDir = isProduction && process.platform === 'linux'
    ? '/tmp/data'
    : path.join(__dirname, 'data');
    
  console.log(`💾 Diretório de dados: ${dataDir}`);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Diretório data/ criado');
  } else {
    console.log('✓ Diretório data/ já existe');
  }

  // Inicializar orders.json se não existir
  const ordersPath = path.join(dataDir, 'orders.json');
  if (!fs.existsSync(ordersPath)) {
    fs.writeFileSync(ordersPath, JSON.stringify({ orders: [] }, null, 2));
    console.log('✅ Arquivo orders.json inicializado');
  } else {
    console.log('✓ Arquivo orders.json já existe');
  }

  // Inicializar products.json se não existir
  const productsPath = path.join(dataDir, 'products.json');
  if (!fs.existsSync(productsPath)) {
    fs.writeFileSync(productsPath, JSON.stringify([], null, 2));
    console.log('✅ Arquivo products.json inicializado');
  } else {
    console.log('✓ Arquivo products.json já existe');
  }

  console.log('✅ Inicialização concluída!\n');
} catch (error) {
  console.error('❌ Erro na inicialização:', error.message);
  console.error('Stack:', error.stack);
  // Continuar mesmo com erro na inicialização
  console.log('⚠️ Continuando sem inicialização completa...\n');
}

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar configuração do Mercado Pago para verificar se está configurado
const { configured } = require('./config/mercadopago');

// Importar rotas com tratamento de erro
let paymentRoutes, webhookRoutes, productsRoutes;

try {
  console.log('📦 Carregando módulos de rotas...');
  paymentRoutes = require('./routes/payment');
  console.log('   ✓ routes/payment.js');
  webhookRoutes = require('./routes/webhook');
  console.log('   ✓ routes/webhook.js');
  productsRoutes = require('./routes/products');
  console.log('   ✓ routes/products.js');
  console.log('✅ Todas as rotas carregadas\n');
} catch (error) {
  console.error('❌ ERRO CRÍTICO ao carregar rotas:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Inicializar aplicação
const app = express();
const PORT = process.env.PORT || 3000;

console.log(`🔌 Porta configurada: ${PORT}`);

// ================================================
// MIDDLEWARES
// ================================================

// CORS - Permitir requisições do frontend
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5500',
  'http://localhost:5503',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5503',
  'http://localhost:5151',
  'https://lojaropresentes.onrender.com'
  'https://lojaoficial-3.onrender.com'
];

// Adicionar URLs do Render e outras origens de produção
if (process.env.NODE_ENV === 'production') {
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
    // Adicionar variações com e sem trailing slash e http/https
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
    allowedOrigins.push(process.env.FRONTEND_URL.replace('http://', 'https://'));
    allowedOrigins.push(process.env.FRONTEND_URL.replace('https://', 'http://'));
  }
  
  // Aceitar CORS_ORIGIN se configurado
  if (process.env.CORS_ORIGIN) {
    const origins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
    allowedOrigins.push(...origins);
  }
}

console.log('🔐 Origens CORS permitidas:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, postman, curl, etc)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar se a origem está na lista permitida
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin || origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app');
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('⚠️ CORS requisição de origem não listada:', origin);
      // Em produção, permitir mesmo assim para evitar bloqueios
      callback(null, process.env.NODE_ENV === 'production');
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// ================================================
// ROTAS
// ================================================

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend Mercado Pago - Loja Oficial',
    version: '1.0.0',
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      payment: '/api/payment',
      webhook: '/api/webhook',
      products: '/api/products',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas de pagamento
app.use('/api/payment', paymentRoutes);

// Rotas de webhook
app.use('/api/webhook', webhookRoutes);

// Rotas de produtos
app.use('/api/products', productsRoutes);

// ================================================
// TRATAMENTO DE ERROS
// ================================================

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.path
  });
});

// Erro geral
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// ================================================
// INICIAR SERVIDOR
// ================================================

const HOST = '0.0.0.0'; // Necessário para Render e Docker

// Adicionar tratamento de erro no listen
const server = app.listen(PORT, HOST, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SERVIDOR BACKEND INICIADO');
  console.log('='.repeat(50));
  console.log(`📍 Host: ${HOST}:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💳 Mercado Pago: ${configured ? 'Configurado' : 'Não configurado'}`);
  console.log('='.repeat(50) + '\n');
});

// Tratamento de erro ao iniciar servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso`);
    console.error('💡 Tente usar outra porta ou encerre o processo que está usando esta porta');
  } else {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    console.error('Stack:', error.stack);
  }
  process.exit(1);
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️ SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

module.exports = app;
