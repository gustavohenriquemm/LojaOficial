// ================================================
// CONFIGURAÇÃO DO FRONTEND
// ================================================

// Configure aqui as URLs da sua aplicação

const CONFIG = {
  // URL da API do Backend
  API: {
    // Desenvolvimento (local)
    development: 'http://localhost:3000/api/products',
    
    // Produção (Render.com) - SUBSTITUA PELA SUA URL REAL
    production: 'https://SEU-BACKEND.onrender.com/api/products',
    // Exemplo: 'https://loja-oficial-backend.onrender.com/api/products'
  },
  
  // Mercado Pago
  MERCADOPAGO: {
    // Chave pública (será configurada no backend)
    publicKey: '' // Deixe vazio, virá da API
  },
  
  // Outras configurações
  SETTINGS: {
    productsPerPage: 12,
    searchMinChars: 2,
    searchDebounce: 300, // ms
    cartUpdateInterval: 5000, // ms
  }
};

// Detectar ambiente automaticamente
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// Exportar configuração
window.APP_CONFIG = {
  ...CONFIG,
  currentEnv: isDevelopment ? 'development' : 'production',
  apiUrl: isDevelopment ? CONFIG.API.development : CONFIG.API.production
};

console.log('⚙️ Configuração carregada:', {
  ambiente: window.APP_CONFIG.currentEnv,
  apiUrl: window.APP_CONFIG.apiUrl
});
