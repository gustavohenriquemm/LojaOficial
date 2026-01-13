# 🎯 Fluxo Completo de Pagamento - Mercado Pago

## 📋 Visão Geral

Este documento descreve o fluxo completo de pagamento implementado no sistema, desde o checkout até a confirmação final.

---

## 🔄 Fluxo do Pagamento

### 1️⃣ **Cliente Inicia Checkout**
- Cliente adiciona produtos ao carrinho
- Preenche dados pessoais (Passo 2)
- Preenche endereço de entrega (Passo 3)
- Clica em **"Finalizar Pagamento"** (Passo 4)

### 2️⃣ **Sistema Abre Modal do Mercado Pago**
- Frontend valida dados do cliente
- Envia requisição para backend criar preferência
- Backend cria preferência no Mercado Pago com:
  - ✅ Itens do pedido
  - ✅ Dados do comprador
  - ✅ Back URLs (success, failure, pending)
  - ✅ Notification URL (webhook)
  - ✅ Metadata com ID do pedido
- Frontend abre **Checkout Pro Modal** do Mercado Pago

### 3️⃣ **Cliente Realiza Pagamento**
O cliente pode pagar através de:
- 💳 **Cartão de Crédito/Débito**
- 📱 **PIX** (QR Code ou Pix Copia e Cola)
- 🧾 **Boleto Bancário**

### 4️⃣ **Mercado Pago Processa Pagamento**
- Mercado Pago valida o pagamento
- **Fecha automaticamente o modal** após conclusão
- Envia notificação via webhook para o backend

### 5️⃣ **Sistema Verifica Status (Dupla Verificação)**

#### 🔍 **Verificação Automática (Polling)**
- Sistema verifica status a cada **5 segundos**
- Máximo de **10 minutos** (120 tentativas)
- Consulta endpoint: `GET /api/payment/order/:orderId`
- **Quando detecta status "approved":**
  - ✅ Para verificação
  - ✅ Fecha todos os elementos do Mercado Pago
  - ✅ Exibe mensagem de sucesso
  - ✅ Limpa carrinho
  - ✅ Atualiza interface

#### 🪝 **Webhook (Confirmação Oficial)**
- Backend recebe notificação do Mercado Pago
- Busca detalhes do pagamento via API do MP
- Atualiza pedido com:
  - ID do pagamento
  - Status (approved/pending/rejected)
  - Método de pagamento
  - Valor da transação
  - Data de aprovação
  - Detalhes completos do pagamento

### 6️⃣ **Sistema Exibe Feedback ao Usuário**

Dependendo do status do pagamento, o sistema exibe:

#### ✅ **Pagamento Aprovado**
```
┌─────────────────────────────────────┐
│   ✅ Pagamento Aprovado!           │
│                                     │
│   Seu pagamento foi processado     │
│   com sucesso.                      │
│                                     │
│   📦 Pedido: #12345                │
│   💳 Pagamento: #67890              │
│   💰 Valor: R$ 150,00               │
│   ✅ Status: Aprovado               │
│                                     │
│   [Voltar ao Início] [Ver Produtos]│
└─────────────────────────────────────┘
```

#### ⏳ **Pagamento Pendente**
```
┌─────────────────────────────────────┐
│   ⏳ Pagamento Pendente            │
│                                     │
│   Seu pagamento está sendo          │
│   processado.                       │
│                                     │
│   📦 Pedido: #12345                │
│   💳 Pagamento: #67890              │
│   💰 Valor: R$ 150,00               │
│   ⏳ Status: Em Processamento      │
│                                     │
│   ℹ️ Você receberá uma notificação │
│   quando o pagamento for confirmado.│
│                                     │
│   [Voltar ao Início]                │
└─────────────────────────────────────┘
```

#### ❌ **Pagamento Rejeitado**
```
┌─────────────────────────────────────┐
│   ❌ Pagamento Não Aprovado        │
│                                     │
│   Saldo insuficiente                │
│                                     │
│   📦 Pedido: #12345                │
│   ❌ Status: Rejeitado              │
│                                     │
│   💡 Tente novamente com outro      │
│   método de pagamento ou entre em   │
│   contato com seu banco.            │
│                                     │
│   [Tentar Novamente] [Voltar]       │
└─────────────────────────────────────┘
```

---

## 🎭 Callbacks do Checkout Pro

O sistema utiliza callbacks do SDK do Mercado Pago:

```javascript
callbacks: {
  onReady: () => {
    // Modal está pronto e visível
    console.log('🎯 Modal do Mercado Pago pronto');
  },
  
  onClose: () => {
    // Usuário fechou o modal
    // Sistema verifica status do pagamento
    console.log('🚪 Modal fechado pelo usuário');
    checkPaymentStatusOnClose(orderId);
  },
  
  onError: (error) => {
    // Erro ao processar pagamento
    console.error('❌ Erro no Checkout Pro:', error);
    alert('Erro ao processar pagamento. Tente novamente.');
  }
}
```

---

## 🔗 Back URLs

URLs de retorno configuradas no backend:

| Status | URL |
|--------|-----|
| ✅ Sucesso | `http://127.0.0.1:5500/checkout.html?status=success` |
| ❌ Falha | `http://127.0.0.1:5500/checkout.html?status=failure` |
| ⏳ Pendente | `http://127.0.0.1:5500/checkout.html?status=pending` |

---

## 🪝 Webhook

### Endpoint
```
POST http://localhost:3000/api/webhook
```

### Como Funciona

1. **Mercado Pago envia notificação:**
```json
{
  "id": "123456789",
  "topic": "payment"
}
```

2. **Backend busca detalhes do pagamento:**
```javascript
const paymentData = await payment.get({ id: paymentId });
```

3. **Backend atualiza pedido:**
```javascript
{
  paymentId: "123456789",
  status: "approved",
  paymentStatus: "approved",
  paymentMethod: "pix",
  transactionAmount: 150.00,
  paidAt: "2026-01-09T10:30:00Z",
  payment: { /* dados completos */ }
}
```

4. **Backend executa ações baseadas no status:**
- ✅ **approved**: `onPaymentApproved()` - Envia email, libera produto, etc.
- ⏳ **pending**: `onPaymentPending()` - Notifica que está pendente
- ❌ **rejected**: `onPaymentRejected()` - Notifica rejeição

---

## 📊 Status de Pagamento

| Status MP | Status Interno | Descrição |
|-----------|---------------|-----------|
| `approved` | `approved` | ✅ Pagamento aprovado e processado |
| `pending` | `pending` | ⏳ Aguardando processamento |
| `in_process` | `pending` | ⏳ Em análise |
| `in_mediation` | `pending` | ⏳ Em mediação |
| `rejected` | `rejected` | ❌ Pagamento rejeitado |
| `cancelled` | `cancelled` | ❌ Pagamento cancelado |
| `refunded` | `refunded` | 💸 Pagamento estornado |
| `charged_back` | `refunded` | 💸 Chargeback |

---

## 🔍 Verificação Automática

### Configuração
```javascript
const MAX_CHECK_ATTEMPTS = 120;  // 10 minutos
const CHECK_INTERVAL = 5000;     // 5 segundos
```

### Lógica
```javascript
setInterval(async () => {
  // Buscar status do pedido
  const response = await fetch(`/api/payment/order/${orderId}`);
  const { order } = await response.json();
  
  // Verificar status
  if (order.payment.status === 'approved') {
    // Fechar modal e exibir sucesso
    closeAllMercadoPagoModals();
    showPaymentSuccessMessage(order);
    clearInterval(paymentCheckInterval);
  }
}, 5000);
```

---

## 🎨 Mensagens Visuais

Todas as mensagens são exibidas como **overlay full-screen** com:
- ✅ Ícones coloridos (verde/laranja/vermelho)
- ✅ Informações detalhadas do pedido
- ✅ Botões de ação claros
- ✅ Design responsivo
- ✅ Animações suaves

---

## 🧪 Testando o Sistema

### 1. Acesse o Checkout
```
http://127.0.0.1:5500/checkout.html
```

### 2. Adicione Produtos
- Navegue para produtos e adicione ao carrinho

### 3. Preencha os Dados
- **Passo 2**: Nome, email, telefone
- **Passo 3**: Endereço completo

### 4. Finalize o Pagamento
- Clique em "Finalizar Pagamento"
- Modal do Mercado Pago abrirá

### 5. Pague (Modo Produção)
- Use dados reais de cartão ou PIX

### 6. Observe o Fluxo
- Console (F12) mostrará logs detalhados
- Modal fechará automaticamente após pagamento
- Mensagem de sucesso aparecerá com detalhes

---

## 🛠️ Arquivos Modificados

| Arquivo | Mudanças |
|---------|----------|
| `mercadopago-integration.js` | ✅ Callbacks do Checkout Pro<br>✅ Funções de mensagem<br>✅ Verificação melhorada |
| `backend/routes/webhook.js` | ✅ Processamento completo de status<br>✅ Registro de data de pagamento |
| `backend/routes/payment.js` | ✅ Back URLs configuradas<br>✅ Notification URL |

---

## 📞 Suporte

Se tiver dúvidas ou problemas:

1. **Verifique o Console (F12)** - Logs detalhados disponíveis
2. **Verifique os Servidores** - Backend (3000) e Frontend (5500)
3. **Verifique o Webhook** - Notificações chegando no backend

---

## 🎉 Conclusão

O sistema agora oferece:
- ✅ Fluxo completo de pagamento
- ✅ Feedback claro ao usuário
- ✅ Fechamento automático do modal
- ✅ Verificação dupla (polling + webhook)
- ✅ Mensagens para todos os status
- ✅ Integração completa com Mercado Pago

**O cliente sempre saberá o status do seu pagamento!** 🚀
