# Backend - Sistema de Pagamento Mercado Pago

Backend Node.js para integração completa com Mercado Pago Checkout Pro.

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp .env.example .env
```

Edite `.env` e adicione suas credenciais do Mercado Pago.

### 3. Iniciar Servidor

```bash
# Produção
npm start

# Desenvolvimento (com auto-reload)
npm run dev
```

## 📋 Dependências

- **express** - Framework web
- **cors** - Configuração CORS
- **dotenv** - Variáveis de ambiente
- **mercadopago** - SDK oficial do Mercado Pago
- **body-parser** - Parse de requisições
- **nodemon** - Auto-reload (dev)

## 🔧 Endpoints

### Pagamento

- `GET /api/payment/public-key` - Obter Public Key
- `POST /api/payment/create-preference` - Criar preferência
- `GET /api/payment/order/:orderId` - Consultar pedido
- `GET /api/payment/orders` - Listar pedidos

### Webhook

- `POST /api/webhook` - Receber notificações do Mercado Pago

## 📁 Estrutura

```
backend/
├── config/
│   ├── mercadopago.js    # Configuração MP
│   └── database.js       # Banco de dados
├── routes/
│   ├── payment.js        # Rotas de pagamento
│   └── webhook.js        # Rotas de webhook
├── data/
│   └── orders.json       # Pedidos armazenados
├── .env                  # Variáveis de ambiente
├── .gitignore           # Arquivos ignorados
├── package.json         # Dependências
└── server.js           # Servidor principal
```

## 🔐 Segurança

- Access Token mantido no backend
- CORS configurado
- Validação de dados
- Variáveis de ambiente protegidas

## 📖 Documentação Completa

Veja [GUIA_COMPLETO_MERCADOPAGO.md](../GUIA_COMPLETO_MERCADOPAGO.md) para documentação detalhada.
