// Servidor de teste mínimo
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

console.log('=== TESTE DE SERVIDOR ===');
console.log('Node.js:', process.version);
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor de teste funcionando!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
