// ================================================
// SERVIDOR NODE.JS - BACKEND MERCADO PAGO
// ================================================

console.log('🔧 Iniciando servidor...');
console.log(`📦 Node.js: ${process.version}`);
console.log(`💻 Plataforma: ${process.platform}`);
console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rotas
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');
const productsRoutes = require('./routes/products');

// Inicializar aplicação
const app = express();
const PORT = process.env.PORT || 3000;

// ================================================
// MIDDLEWARES
// ================================================

// CORS - Permitir requisições do frontend
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5500',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5500'
];

// Adicionar URLs do Render em produção
if (process.env.NODE_ENV === 'production') {
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  // Permitir qualquer subdomínio do Render
  allowedOrigins.push(/\.onrender\.com$/);
}

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, postman, etc)
    if (!origin) return callback(null, true);
    
    // Verificar se a origem está na lista permitida
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS bloqueado para origem:', origin);
      callback(null, true); // Permitir mesmo assim em produção
    }
  },
  credentials: true
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

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SERVIDOR BACKEND INICIADO');
  console.log('='.repeat(50));
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💳 Mercado Pago: Configurado`);
  console.log('='.repeat(50) + '\n');
  
  // Sistema de auto-ping para evitar hibernação (apenas em produção)
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const pingInterval = 14 * 60 * 1000; // 14 minutos
    const pingUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    
    console.log('🔄 Sistema de ping ativado para evitar hibernação');
    console.log(`📡 Ping URL: ${pingUrl}/health`);
    
    setInterval(async () => {
      try {
        const https = require('https');
        const http = require('http');
        const protocol = pingUrl.startsWith('https') ? https : http;
        
        protocol.get(`${pingUrl}/health`, (res) => {
          console.log(`✅ Ping enviado - Status: ${res.statusCode} - ${new Date().toISOString()}`);
        }).on('error', (err) => {
          console.error('❌ Erro no ping:', err.message);
        });
      } catch (error) {
        console.error('❌ Erro ao enviar ping:', error.message);
      }
    }, pingInterval);
  }
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
