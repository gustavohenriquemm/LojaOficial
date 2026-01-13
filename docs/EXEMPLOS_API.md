# 📚 Exemplos de Uso da API

## Exemplos práticos de integração com o backend

---

## 🔑 Obter Public Key

```javascript
// GET /api/payment/public-key

fetch('http://localhost:3000/api/payment/public-key')
  .then(response => response.json())
  .then(data => {
    console.log('Public Key:', data.publicKey);
  });
```

**Resposta:**
```json
{
  "publicKey": "TEST-1234567890-123456-1234567890abcdef-123456789"
}
```

---

## 💳 Criar Preferência de Pagamento

```javascript
// POST /api/payment/create-preference

const orderData = {
  items: [
    {
      title: "Perfume Importado",
      description: "Perfume Feminino 100ml",
      unit_price: 150.00,
      quantity: 1
    },
    {
      title: "Sabonete Artesanal",
      description: "Sabonete de Lavanda",
      unit_price: 25.00,
      quantity: 2
    }
  ],
  payer: {
    name: "Maria Silva",
    email: "maria@email.com",
    phone: {
      area_code: "11",
      number: "987654321"
    }
  },
  metadata: {
    orderId: `order_${Date.now()}`,
    customerName: "Maria Silva",
    shippingAddress: "Rua Exemplo, 123 - São Paulo/SP"
  }
};

fetch('http://localhost:3000/api/payment/create-preference', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
})
  .then(response => response.json())
  .then(data => {
    console.log('Preferência criada:', data);
    console.log('Preference ID:', data.preferenceId);
    console.log('Order ID:', data.orderId);
  })
  .catch(error => {
    console.error('Erro:', error);
  });
```

**Resposta:**
```json
{
  "success": true,
  "preferenceId": "123456789-abcdef-123456789",
  "orderId": "order_1736400000000",
  "initPoint": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "sandboxInitPoint": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}
```

---

## 🔍 Consultar Status do Pedido

```javascript
// GET /api/payment/order/:orderId

const orderId = 'order_1736400000000';

fetch(`http://localhost:3000/api/payment/order/${orderId}`)
  .then(response => response.json())
  .then(data => {
    console.log('Status do pedido:', data.order.status);
    console.log('Status do pagamento:', data.order.paymentStatus);
    console.log('Total:', data.order.total);
  });
```

**Resposta:**
```json
{
  "success": true,
  "order": {
    "id": "order_1736400000000",
    "status": "approved",
    "paymentStatus": "approved",
    "total": 200.00,
    "items": [...],
    "createdAt": "2026-01-09T12:00:00.000Z",
    "paidAt": "2026-01-09T12:05:00.000Z"
  }
}
```

---

## 📋 Listar Todos os Pedidos

```javascript
// GET /api/payment/orders?limit=50

fetch('http://localhost:3000/api/payment/orders?limit=20')
  .then(response => response.json())
  .then(data => {
    console.log('Total de pedidos:', data.count);
    data.orders.forEach(order => {
      console.log(`Pedido ${order.id}: ${order.status} - R$ ${order.total}`);
    });
  });
```

**Resposta:**
```json
{
  "success": true,
  "count": 15,
  "orders": [
    {
      "id": "order_1736400000000",
      "status": "approved",
      "total": 200.00,
      "createdAt": "2026-01-09T12:00:00.000Z",
      "paidAt": "2026-01-09T12:05:00.000Z"
    },
    {
      "id": "order_1736300000000",
      "status": "pending",
      "total": 150.00,
      "createdAt": "2026-01-08T15:00:00.000Z",
      "paidAt": null
    }
  ]
}
```

---

## 🎯 Exemplo Completo - Fluxo de Pagamento

```javascript
// 1. Inicializar Mercado Pago
async function initMercadoPago() {
  const response = await fetch('http://localhost:3000/api/payment/public-key');
  const { publicKey } = await response.json();
  
  const mp = new MercadoPago(publicKey);
  return mp;
}

// 2. Criar e processar pagamento
async function processPayment(cartItems, customerData) {
  // Preparar dados
  const items = cartItems.map(item => ({
    title: item.name,
    unit_price: parseFloat(item.price),
    quantity: parseInt(item.quantity)
  }));

  const payer = {
    name: customerData.name,
    email: customerData.email,
    phone: {
      area_code: customerData.phone.substring(0, 2),
      number: customerData.phone.substring(2)
    }
  };

  const metadata = {
    orderId: `order_${Date.now()}`,
    customerName: customerData.name,
    customerEmail: customerData.email
  };

  // Criar preferência
  const response = await fetch('http://localhost:3000/api/payment/create-preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, payer, metadata })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  // Salvar IDs
  sessionStorage.setItem('currentOrderId', data.orderId);
  sessionStorage.setItem('currentPreferenceId', data.preferenceId);

  // Inicializar checkout
  const mp = await initMercadoPago();
  
  mp.checkout({
    preference: {
      id: data.preferenceId
    },
    autoOpen: true
  });

  return data;
}

// 3. Verificar status após pagamento
async function checkPaymentStatus(orderId) {
  const response = await fetch(`http://localhost:3000/api/payment/order/${orderId}`);
  const data = await response.json();
  
  return data.order;
}

// 4. Usar as funções
const cartItems = [
  { name: 'Produto 1', price: 100.00, quantity: 1 },
  { name: 'Produto 2', price: 50.00, quantity: 2 }
];

const customerData = {
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '11987654321'
};

// Processar pagamento
processPayment(cartItems, customerData)
  .then(result => {
    console.log('Checkout aberto!', result);
  })
  .catch(error => {
    console.error('Erro:', error);
  });
```

---

## 🔔 Webhook - Receber Notificações

O webhook é chamado automaticamente pelo Mercado Pago quando o status do pagamento muda.

**Endpoint:** `POST /api/webhook`

**Corpo da requisição enviado pelo Mercado Pago:**
```json
{
  "id": "123456789",
  "topic": "payment"
}
```

**Seu backend vai:**
1. Responder imediatamente com status 200
2. Buscar detalhes do pagamento na API do Mercado Pago
3. Atualizar o status do pedido no banco de dados
4. Executar ações baseadas no status (email, liberação, etc.)

---

## 🧪 Testando com cURL

### Obter Public Key
```bash
curl http://localhost:3000/api/payment/public-key
```

### Criar Preferência
```bash
curl -X POST http://localhost:3000/api/payment/create-preference \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "title": "Produto Teste",
      "unit_price": 100.00,
      "quantity": 1
    }],
    "payer": {
      "name": "Teste",
      "email": "teste@email.com"
    }
  }'
```

### Consultar Pedido
```bash
curl http://localhost:3000/api/payment/order/order_1736400000000
```

---

## 📱 Testando com Postman

1. **Importar Collection:**
   - Crie uma nova collection no Postman
   - Adicione os requests acima
   - Salve para reutilizar

2. **Variáveis de Ambiente:**
   ```
   BASE_URL = http://localhost:3000
   ORDER_ID = order_1736400000000
   ```

3. **Testes Automatizados:**
   ```javascript
   // No Postman, na aba "Tests"
   pm.test("Status code is 200", function () {
     pm.response.to.have.status(200);
   });
   
   pm.test("Response has preferenceId", function () {
     var jsonData = pm.response.json();
     pm.expect(jsonData).to.have.property('preferenceId');
   });
   ```

---

## 🎯 Casos de Uso Comuns

### 1. Pagamento Simples
- Cliente seleciona produto
- Preenche dados
- Paga e pronto

### 2. Assinatura/Recorrência
- Use Mercado Pago Subscriptions
- Cobrança automática mensal

### 3. Marketplace
- Use Split de Pagamento
- Divide entre vendedores

### 4. Produto Digital
- Libera imediatamente após pagamento aprovado
- No webhook, envie email com link de download

### 5. Produto Físico
- Aguarde confirmação de pagamento
- Integre com sistema de entrega
- Envie código de rastreamento

---

## 💡 Dicas Avançadas

### Retry Logic
```javascript
async function createPreferenceWithRetry(data, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('http://localhost:3000/api/payment/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Validação de Email
```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### Formatação de Preço
```javascript
function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}
```

---

**📖 Mais exemplos na documentação oficial do Mercado Pago:**
https://www.mercadopago.com.br/developers/pt/docs
