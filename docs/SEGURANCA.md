# 🔐 Guia de Segurança - Sistema de Pagamento

## ⚠️ ANTES DE COLOCAR EM PRODUÇÃO

### Checklist de Segurança Obrigatório

- [ ] **Credenciais de Produção** - Nunca use credenciais de teste em produção
- [ ] **HTTPS Ativo** - SSL/TLS configurado no domínio
- [ ] **Variáveis de Ambiente** - Access Token NUNCA no frontend
- [ ] **.gitignore Configurado** - Arquivo .env não vai para o GitHub
- [ ] **CORS Restrito** - Apenas domínios autorizados
- [ ] **Webhook Seguro** - URL pública e validação de origem
- [ ] **Validação de Dados** - Todos os inputs validados
- [ ] **Rate Limiting** - Proteção contra ataques
- [ ] **Logs Seguros** - Não logar dados sensíveis
- [ ] **Backup Configurado** - Backup automático do banco

---

## 🚫 O QUE NUNCA FAZER

### ❌ Expor Access Token no Frontend

**ERRADO:**
```javascript
// frontend/script.js
const ACCESS_TOKEN = 'APP_USR-1234567890...'; // ❌ NUNCA FAÇA ISSO!
```

**CORRETO:**
```javascript
// backend/config/mercadopago.js
const accessToken = process.env.MP_ACCESS_TOKEN; // ✅ Sempre no backend
```

### ❌ Commitar Credenciais no Git

**ERRADO:**
```bash
git add backend/.env  # ❌ NUNCA!
git commit -m "adicionando configurações"
```

**CORRETO:**
```bash
# backend/.gitignore
.env  # ✅ Sempre ignorar
```

### ❌ Usar Produção em Desenvolvimento

**ERRADO:**
```env
NODE_ENV=development
MP_ACCESS_TOKEN_TEST=APP_USR-production-token... # ❌ Token de produção em desenvolvimento!
```

**CORRETO:**
```env
NODE_ENV=development
MP_ACCESS_TOKEN_TEST=TEST-1234... # ✅ Token de teste em desenvolvimento
```

---

## ✅ BOAS PRÁTICAS

### 1. Separação de Ambientes

```env
# .env.development
NODE_ENV=development
MP_ACCESS_TOKEN_TEST=TEST-...
FRONTEND_URL=http://localhost:5500

# .env.production
NODE_ENV=production
MP_ACCESS_TOKEN_PROD=APP_USR-...
FRONTEND_URL=https://www.seusite.com.br
```

### 2. Validação de Dados

```javascript
// ✅ Sempre validar no backend
function validatePaymentData(data) {
  if (!data.items || data.items.length === 0) {
    throw new Error('Items obrigatórios');
  }
  
  // Validar valores
  for (const item of data.items) {
    if (item.unit_price <= 0) {
      throw new Error('Preço inválido');
    }
  }
  
  return true;
}
```

### 3. Logs Seguros

```javascript
// ❌ ERRADO - Expõe dados sensíveis
console.log('Token:', accessToken);
console.log('Pagamento:', fullPaymentData);

// ✅ CORRETO - Log seguro
console.log('Pagamento criado:', paymentData.id);
console.log('Status:', paymentData.status);
```

### 4. Tratamento de Erros

```javascript
// ✅ Não expor detalhes internos ao cliente
try {
  const result = await createPayment(data);
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Erro interno:', error); // Log completo no servidor
  res.status(500).json({
    error: 'Erro ao processar pagamento' // Mensagem genérica ao cliente
  });
}
```

---

## 🔒 Configuração de Produção

### Backend

1. **Variáveis de Ambiente**
```bash
# No servidor, configure via painel ou CLI
export NODE_ENV=production
export MP_ACCESS_TOKEN_PROD=APP_USR-...
export MP_PUBLIC_KEY_PROD=APP_USR-...
```

2. **CORS Restrito**
```javascript
app.use(cors({
  origin: 'https://www.seusite.com.br', // Apenas seu domínio
  credentials: true
}));
```

3. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo de 100 requisições
});

app.use('/api/', limiter);
```

### Frontend

1. **URL do Backend**
```javascript
// Usar variável de ambiente ou detectar automaticamente
const BACKEND_URL = process.env.BACKEND_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://api.seusite.com.br');
```

2. **Validação no Cliente**
```javascript
// Validar antes de enviar ao backend
function validateCustomerData(data) {
  if (!data.email || !data.email.includes('@')) {
    alert('Email inválido');
    return false;
  }
  return true;
}
```

---

## 🔍 Auditoria de Segurança

### Ferramentas Recomendadas

1. **npm audit** - Verificar vulnerabilidades
```bash
cd backend
npm audit
npm audit fix
```

2. **Snyk** - Monitoramento contínuo
```bash
npm install -g snyk
snyk test
```

3. **SonarQube** - Análise de código

### Checklist Mensal

- [ ] Atualizar dependências (`npm update`)
- [ ] Verificar vulnerabilidades (`npm audit`)
- [ ] Revisar logs de erro
- [ ] Testar fluxo completo de pagamento
- [ ] Verificar webhooks funcionando
- [ ] Backup do banco de dados

---

## 📞 Contatos de Emergência

### Se algo der errado:

1. **Desabilitar Checkout** - Remover botão de pagamento
2. **Redirecionar para WhatsApp** - Fallback temporário
3. **Verificar Logs** - Identificar problema
4. **Contatar Mercado Pago** - Suporte técnico

### Suporte Mercado Pago

- Portal: https://www.mercadopago.com.br/developers/pt/support
- Forum: https://www.mercadopago.com.br/developers/pt/support/forum

---

## 🎓 Recursos de Aprendizado

### Segurança Web

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### Mercado Pago

- [Security Best Practices](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/security)
- [PCI Compliance](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/pci-dss)

---

## ⚖️ Compliance e Regulamentação

### LGPD (Lei Geral de Proteção de Dados)

- Colete apenas dados necessários
- Tenha política de privacidade clara
- Permita exclusão de dados
- Criptografe dados sensíveis
- Notifique vazamentos em até 72h

### PCI DSS (Payment Card Industry)

- Não armazene dados de cartão completos
- Use tokenização (Mercado Pago faz isso)
- Mantenha logs de transações
- Audite regularmente

---

## ✅ Conclusão

A segurança é responsabilidade de todos. Siga estas práticas e mantenha seu sistema sempre atualizado e monitorado.

**Lembre-se:**
- 🔐 Credenciais sempre no backend
- 🔒 HTTPS em produção
- 🚫 Nunca commitar .env
- ✅ Validar todos os inputs
- 📊 Monitorar logs e erros
- 🔄 Manter atualizado

---

**🛡️ Segurança é prioridade! Proteja seus clientes e seu negócio!**
