// ================================================
// SCRIPT DE INICIALIZAÇÃO DO BACKEND
// ================================================
// Garante que diretórios necessários existam antes do servidor iniciar

const fs = require('fs');
const path = require('path');

console.log('🔧 Inicializando ambiente do backend...');

// Diretórios necessários
const directories = [
  path.join(__dirname, 'data')
];

// Criar diretórios se não existirem
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Diretório criado: ${path.basename(dir)}/`);
  } else {
    console.log(`✓ Diretório existe: ${path.basename(dir)}/`);
  }
});

// Criar arquivo .gitkeep em data/ para preservar no git
const gitkeepPath = path.join(__dirname, 'data', '.gitkeep');
if (!fs.existsSync(gitkeepPath)) {
  fs.writeFileSync(gitkeepPath, '');
  console.log('✅ Arquivo .gitkeep criado em data/');
}

// Inicializar orders.json se não existir
const ordersPath = path.join(__dirname, 'data', 'orders.json');
if (!fs.existsSync(ordersPath)) {
  fs.writeFileSync(ordersPath, JSON.stringify({ orders: [] }, null, 2));
  console.log('✅ Arquivo orders.json inicializado');
}

// Inicializar products.json se não existir
const productsPath = path.join(__dirname, 'data', 'products.json');
if (!fs.existsSync(productsPath)) {
  fs.writeFileSync(productsPath, JSON.stringify([], null, 2));
  console.log('✅ Arquivo products.json inicializado');
}

console.log('✅ Inicialização concluída!\n');
