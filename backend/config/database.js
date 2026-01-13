// ================================================
// DATABASE SIMPLES PARA ARMAZENAR PEDIDOS
// ================================================
// Em produção, use um banco de dados real (MongoDB, PostgreSQL, etc.)

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/orders.json');
const DB_DIR = path.join(__dirname, '../data');

// Criar diretório se não existir
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Inicializar arquivo se não existir
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ orders: [] }, null, 2));
}

class Database {
  // Ler todos os pedidos
  static readOrders() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data).orders;
    } catch (error) {
      console.error('Erro ao ler banco de dados:', error);
      return [];
    }
  }

  // Salvar pedidos
  static saveOrders(orders) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify({ orders }, null, 2));
      return true;
    } catch (error) {
      console.error('Erro ao salvar no banco de dados:', error);
      return false;
    }
  }

  // Criar novo pedido
  static createOrder(orderData) {
    const orders = this.readOrders();
    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  // Buscar pedido por ID
  static getOrderById(orderId) {
    const orders = this.readOrders();
    return orders.find(order => order.id === orderId);
  }

  // Buscar pedido por Preference ID do Mercado Pago
  static getOrderByPreferenceId(preferenceId) {
    const orders = this.readOrders();
    return orders.find(order => order.preferenceId === preferenceId);
  }

  // Buscar pedido por Payment ID do Mercado Pago
  static getOrderByPaymentId(paymentId) {
    const orders = this.readOrders();
    return orders.find(order => order.paymentId === paymentId);
  }

  // Atualizar pedido
  static updateOrder(orderId, updateData) {
    const orders = this.readOrders();
    const index = orders.findIndex(order => order.id === orderId);
    
    if (index !== -1) {
      orders[index] = {
        ...orders[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveOrders(orders);
      return orders[index];
    }
    
    return null;
  }

  // Atualizar status do pedido
  static updateOrderStatus(orderId, status, paymentData = {}) {
    return this.updateOrder(orderId, {
      status,
      paymentStatus: status,
      payment: paymentData,
      paymentData,
      paymentId: paymentData.id || null,
      paidAt: status === 'approved' ? new Date().toISOString() : null
    });
  }

  // Listar todos os pedidos
  static listOrders(limit = 50) {
    const orders = this.readOrders();
    return orders.slice(-limit).reverse(); // Retorna os mais recentes primeiro
  }
}

module.exports = Database;
