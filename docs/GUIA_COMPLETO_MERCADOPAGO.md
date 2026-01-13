# 🚀 Sistema de Pagamento Mercado Pago - Checkout Pro

## 📋 Documentação Completa

Sistema completo de pagamento integrado com Mercado Pago Checkout Pro, incluindo backend Node.js, frontend responsivo e webhooks automáticos para notificações de pagamento.

---

## 🎯 Características

✅ **Pagamento 100% Online** - Integração completa sem redirecionamentos externos  
✅ **Múltiplos Métodos** - PIX, Cartão de Crédito, Cartão de Débito  
✅ **Backend Seguro** - Node.js com Express para proteger credenciais  
✅ **Webhooks Automáticos** - Notificações em tempo real do status do pagamento  
✅ **Ambiente de Teste** - Suporte para testes com credenciais sandbox  
✅ **Fácil Migração** - Troca simples entre teste e produção  
✅ **Banco de Dados** - Sistema simples de armazenamento de pedidos  
✅ **Profissional** - Código limpo, organizado e documentado  

---

## 📁 Estrutura do Projeto

```
LojaOficial/
│
├── backend/                          # Backend Node.js
│   ├── config/
│   │   ├── mercadopago.js           # Configuração do Mercado Pago
│   │   └── database.js              # Sistema de banco de dados
│   ├── routes/
│   │   ├── payment.js               # Rotas de pagamento
│   │   └── webhook.js               # Rotas de webhook
│   ├── data/
│   │   └── orders.json              # Pedidos armazenados
│   ├── .env.example                 # Exemplo de variáveis de ambiente
│   ├── .gitignore                   # Arquivos ignorados pelo git
│   ├── package.json                 # Dependências do Node.js
│   └── server.js                    # Servidor principal
│
├── mercadopago-integration.js       # Integração frontend com backend
├── mercadopago-styles.css           # Estilos para pagamento
├── checkout.html                    # Página de checkout
├── checkout-script.js               # Script do checkout
└── GUIA_COMPLETO_MERCADOPAGO.md    # Esta documentação

```

---

## 🔧 Instalação e Configuração

### 1️⃣ Instalar Dependências do Backend

```bash
cd backend
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
# AMBIENTE DE TESTE (Sandbox)
MP_ACCESS_TOKEN_TEST=TEST-1234567890-123456-1234567890abcdef-123456789
MP_PUBLIC_KEY_TEST=TEST-1234567890-123456-1234567890abcdef-123456789

# AMBIENTE DE PRODUÇÃO
MP_ACCESS_TOKEN_PROD=APP_USR-1234567890-123456-1234567890abcdef-123456789
MP_PUBLIC_KEY_PROD=APP_USR-1234567890-123456-1234567890abcdef-123456789

# Escolha o ambiente (development ou production)
NODE_ENV=development

# Configurações do Servidor
PORT=3000
FRONTEND_URL=http://localhost:5500

# URLs de retorno
SUCCESS_URL=http://localhost:5500/checkout.html?status=success
FAILURE_URL=http://localhost:5500/checkout.html?status=failure
PENDING_URL=http://localhost:5500/checkout.html?status=pending
```

### 3️⃣ Obter Credenciais do Mercado Pago

1. Acesse: [https://www.mercadopago.com.br/developers/panel](https://www.mercadopago.com.br/developers/panel)
2. Faça login com sua conta
3. Vá em **"Suas integrações"** → **"Credenciais"**
4. Copie as credenciais de **TESTE** (começa com `TEST-`)
5. Depois de testar, use as de **PRODUÇÃO** (começa com `APP_USR-`)

### 4️⃣ Iniciar o Backend

```bash
cd backend
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

Você deve ver:

```
==================================================
🚀 SERVIDOR BACKEND INICIADO
==================================================
📍 URL: http://localhost:3000
🌍 Ambiente: development
💳 Mercado Pago: Configurado
==================================================
```

### 5️⃣ Iniciar o Frontend

Abra o projeto em um servidor local (Live Server, http-server, etc.)

---

## 🔄 Fluxo de Pagamento

### 1. Cliente acessa o checkout
- Cliente adiciona produtos ao carrinho
- Preenche dados pessoais e endereço

### 2. Frontend solicita criação de pagamento
```javascript
createPaymentAndCheckout() // Função no mercadopago-integration.js
```

### 3. Backend cria preferência no Mercado Pago
- Valida dados recebidos
- Cria preferência de pagamento
- Retorna ID da preferência

### 4. Checkout Pro é aberto
- Modal do Mercado Pago abre no site
- Cliente escolhe método de pagamento (PIX, Cartão, etc.)
- Cliente finaliza o pagamento

### 5. Mercado Pago notifica via Webhook
- Webhook recebe notificação automática
- Backend consulta status do pagamento
- Atualiza pedido no banco de dados

### 6. Cliente vê confirmação
- Página de sucesso/pendente/erro
- Carrinho é limpo automaticamente

---

## 📡 Endpoints da API

### GET `/`
Informações do servidor

**Resposta:**
```json
{
  "message": "🚀 Backend Mercado Pago - Loja Oficial",
  "version": "1.0.0",
  "status": "online",
  "environment": "development"
}
```

### GET `/api/payment/public-key`
Retorna a Public Key do Mercado Pago

**Resposta:**
```json
{
  "publicKey": "TEST-1234567890-123456-..."
}
```

### POST `/api/payment/create-preference`
Cria uma preferência de pagamento

**Request Body:**
```json
{
  "items": [
    {
      "title": "Produto Exemplo",
      "unit_price": 100.00,
      "quantity": 1
    }
  ],
  "payer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": {
      "area_code": "11",
      "number": "987654321"
    }
  },
  "metadata": {
    "orderId": "order_123456",
    "customerName": "João Silva"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "preferenceId": "123456789-abcdef",
  "orderId": "order_123456",
  "initPoint": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}
```

### GET `/api/payment/order/:orderId`
Consulta status de um pedido

**Resposta:**
```json
{
  "success": true,
  "order": {
    "id": "order_123456",
    "status": "approved",
    "paymentStatus": "approved",
    "total": 100.00,
    "createdAt": "2026-01-09T...",
    "paidAt": "2026-01-09T..."
  }
}
```

### POST `/api/webhook`
Recebe notificações do Mercado Pago (automático)

**Request Body:**
```json
{
  "id": "123456789",
  "topic": "payment"
}
```

---

## 🔐 Segurança

### ✅ Boas Práticas Implementadas

1. **Access Token no Backend** - Nunca exposto no frontend
2. **Public Key no Frontend** - Apenas chave pública é enviada
3. **Validação de Dados** - Todos os inputs são validados
4. **CORS Configurado** - Apenas origem autorizada
5. **Variáveis de Ambiente** - Credenciais em arquivo .env
6. **Git Ignore** - .env não vai para o repositório

### ⚠️ IMPORTANTE

❌ **NUNCA** faça isso:
- Colocar Access Token no frontend
- Commitar arquivo `.env` no git
- Usar credenciais de produção em desenvolvimento
- Expor credenciais publicamente

✅ **SEMPRE** faça isso:
- Mantenha credenciais no backend
- Use `.env` para configurações
- Adicione `.env` no `.gitignore`
- Use credenciais de teste durante desenvolvimento

---

## 🧪 Testando o Sistema

### Modo Teste (Sandbox)

1. Configure `NODE_ENV=development` no `.env`
2. Use credenciais que começam com `TEST-`
3. Use cartões de teste do Mercado Pago:

**Cartão de Crédito Aprovado:**
```
Número: 5031 4332 1540 6351
CVV: 123
Vencimento: 11/25
Nome: APRO
```

**PIX de Teste:**
- Basta escolher PIX no checkout
- Simule aprovação/rejeição

[Lista completa de cartões de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards)

### Modo Produção

1. Configure `NODE_ENV=production` no `.env`
2. Use credenciais que começam com `APP_USR-`
3. Configure webhook público (veja seção Webhooks)
4. Teste com valores baixos primeiro

---

## 🔔 Configurando Webhooks

### Para Desenvolvimento Local (ngrok)

1. Instale o [ngrok](https://ngrok.com/)
2. Rode o ngrok:
```bash
ngrok http 3000
```
3. Copie a URL gerada (ex: `https://abc123.ngrok.io`)
4. Configure no painel do Mercado Pago:
   - URL: `https://abc123.ngrok.io/api/webhook`

### Para Produção

1. Deploy seu backend em um servidor (Heroku, AWS, etc.)
2. Configure a URL do webhook no Mercado Pago:
   - URL: `https://seudominio.com/api/webhook`

### Configurar no Mercado Pago

1. Acesse [Painel de Desenvolvedores](https://www.mercadopago.com.br/developers/panel)
2. Vá em **"Webhooks"**
3. Adicione nova URL de notificação
4. Escolha eventos: **Pagamentos** e **Merchant Orders**
5. Salve a configuração

---

## 📊 Banco de Dados

O sistema usa um arquivo JSON simples para armazenar pedidos (`backend/data/orders.json`).

### Estrutura de um Pedido

```json
{
  "id": "1736400000000",
  "preferenceId": "123456789-abcdef",
  "paymentId": "987654321",
  "items": [...],
  "payer": {...},
  "total": 100.00,
  "status": "approved",
  "paymentStatus": "approved",
  "paymentMethod": "pix",
  "createdAt": "2026-01-09T...",
  "updatedAt": "2026-01-09T...",
  "paidAt": "2026-01-09T..."
}
```

### Migrar para Banco Real (Recomendado para Produção)

Para produção, substitua `config/database.js` por integração com:
- **MongoDB** - Banco NoSQL
- **PostgreSQL** - Banco SQL
- **MySQL** - Banco SQL
- **Firebase** - Banco em nuvem

---

## 🚀 Deploy em Produção

### Backend (Node.js)

**Opções de hospedagem:**
- [Heroku](https://www.heroku.com/) - Fácil e gratuito
- [Railway](https://railway.app/) - Moderno e simples
- [Render](https://render.com/) - Gratuito com SSL
- [AWS EC2](https://aws.amazon.com/ec2/) - Mais controle
- [DigitalOcean](https://www.digitalocean.com/) - VPS econômico

**Passos básicos:**
1. Faça push do código para GitHub
2. Conecte repositório ao serviço de hospedagem
3. Configure variáveis de ambiente no painel
4. Deploy automático

### Frontend

**Opções de hospedagem:**
- [Vercel](https://vercel.com/) - Otimizado para frontend
- [Netlify](https://www.netlify.com/) - Deploy automático
- [GitHub Pages](https://pages.github.com/) - Gratuito
- [Hostinger](https://www.hostinger.com.br/) - Hospedagem tradicional

### Configurações Pós-Deploy

1. Atualize `FRONTEND_URL` no backend `.env`
2. Atualize `BACKEND_URL` no frontend
3. Configure webhook com URL pública
4. Teste todo o fluxo em produção
5. Monitore logs e erros

---

## 🐛 Troubleshooting

### Erro: "Access Token não configurado"

**Solução:** Verifique se o arquivo `.env` existe e está configurado corretamente.

### Erro: "CORS blocked"

**Solução:** Ajuste `FRONTEND_URL` no `.env` para corresponder à URL do seu frontend.

### Webhook não recebe notificações

**Soluções:**
- Verifique se a URL está acessível publicamente
- Use ngrok para desenvolvimento local
- Confirme configuração no painel do Mercado Pago
- Veja logs do backend para verificar se recebeu algo

### Checkout não abre

**Soluções:**
- Verifique se SDK do Mercado Pago está carregado
- Veja console do navegador (F12) para erros
- Confirme que Public Key está correta
- Teste se backend está rodando

### Pagamento não atualiza no sistema

**Soluções:**
- Verifique se webhook está configurado
- Veja logs do backend quando webhook é chamado
- Confirme que Access Token tem permissões corretas

---

## 📞 Suporte

### Documentação Oficial

- [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- [Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing)
- [API Reference](https://www.mercadopago.com.br/developers/pt/reference)

### Comunidade

- [Forum Mercado Pago](https://www.mercadopago.com.br/developers/pt/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/mercadopago)

---

## 📝 Próximos Passos

### Melhorias Recomendadas

1. **Banco de Dados Real** - Migrar para MongoDB/PostgreSQL
2. **Autenticação** - Sistema de login para clientes
3. **Painel Admin** - Visualizar pedidos e estatísticas
4. **Email Notifications** - Enviar confirmação por email
5. **Gestão de Estoque** - Controlar produtos disponíveis
6. **Cupons de Desconto** - Sistema de promoções
7. **Rastreamento** - Integrar com correios/transportadoras
8. **Relatórios** - Dashboard com métricas de vendas

### Recursos Adicionais do Mercado Pago

- **Assinaturas** - Pagamentos recorrentes
- **Split de Pagamento** - Dividir pagamento entre sellers
- **Link de Pagamento** - Criar links para compartilhar
- **QR Code Estático** - Para pagamentos presenciais

---

## ✅ Checklist de Produção

Antes de colocar no ar:

- [ ] Credenciais de PRODUÇÃO configuradas
- [ ] Webhook público configurado e testado
- [ ] SSL/HTTPS ativo no domínio
- [ ] Banco de dados configurado
- [ ] Backup automático ativado
- [ ] Logs e monitoramento implementados
- [ ] Testes de pagamento realizados
- [ ] URLs de retorno corretas
- [ ] Política de privacidade e termos
- [ ] Email de confirmação funcionando

---

## 📄 Licença

Este projeto é fornecido como está para fins educacionais e comerciais.

---

## 👤 Autor

Desenvolvido com ❤️ para integração profissional com Mercado Pago

---

**🎉 Pronto! Seu sistema de pagamento está completo e funcional!**

Para começar:
1. Configure as credenciais no `.env`
2. Inicie o backend: `npm start`
3. Abra o frontend no navegador
4. Teste com credenciais de sandbox
5. Deploy em produção quando estiver pronto!
