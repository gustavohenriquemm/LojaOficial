# 🚀 Guia Completo de Deploy no Render

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Repositório](#configuração-do-repositório)
3. [Deploy do Backend](#deploy-do-backend)
4. [Deploy do Frontend](#deploy-do-frontend)
5. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
6. [Verificação de Funcionamento](#verificação-de-funcionamento)
7. [Resolução de Problemas](#resolução-de-problemas)

---

## 🔧 Pré-requisitos

- [ ] Conta no [Render](https://render.com) (gratuita)
- [ ] Repositório Git (GitHub, GitLab ou Bitbucket)
- [ ] Credenciais do Mercado Pago (Access Token e Public Key)
- [ ] Código do backend já corrigido e funcionando localmente

---

## 📦 Configuração do Repositório

### 1. Commit e Push das Alterações

```powershell
# Adicionar todas as alterações
git add .

# Fazer commit
git commit -m "fix: preparar backend para deploy no Render"

# Enviar para o repositório remoto
git push origin main
```

### 2. Estrutura Esperada

```
LojaOficial/
├── backend/
│   ├── init.js              # ✅ Script de inicialização
│   ├── server.js            # ✅ Servidor principal
│   ├── package.json         # ✅ Com scripts corretos
│   ├── config/
│   ├── routes/
│   └── data/
│       └── .gitkeep         # ✅ Preservar diretório no git
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
└── render.yaml              # ✅ Configuração do Render
```

---

## 🖥️ Deploy do Backend

### Passo 1: Criar Web Service no Render

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório Git
4. Selecione o repositório **LojaOficial**

### Passo 2: Configurar o Serviço

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `loja-oficial-backend` |
| **Region** | `Oregon (US West)` ou mais próximo |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run init` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Passo 3: Configurar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

```bash
# Obrigatórias
NODE_ENV=production
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui

# Opcionais (serão definidas após deploy do frontend)
FRONTEND_URL=https://loja-oficial-frontend.onrender.com
CORS_ORIGIN=https://loja-oficial-frontend.onrender.com
```

> ⚠️ **IMPORTANTE**: Você obterá suas credenciais do Mercado Pago em:
> https://www.mercadopago.com.br/developers/panel/credentials

### Passo 4: Configurar Health Check

- **Health Check Path**: `/health`

### Passo 5: Deploy

1. Clique em **"Create Web Service"**
2. O Render iniciará o build automaticamente
3. Aguarde a conclusão (pode levar 2-5 minutos)

### Passo 6: Anotar URL do Backend

Após o deploy, você verá uma URL como:
```
https://loja-oficial-backend.onrender.com
```

**Anote essa URL!** Será necessária para configurar o frontend.

---

## 🌐 Deploy do Frontend

### Opção 1: Deploy como Static Site no Render

1. No Dashboard, clique em **"New +"** → **"Static Site"**
2. Selecione o mesmo repositório
3. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `loja-oficial-frontend` |
| **Branch** | `main` |
| **Root Directory** | `.` (raiz) |
| **Build Command** | `echo "No build needed"` |
| **Publish Directory** | `.` |

4. Adicione variável de ambiente:
   - `API_URL`: URL do backend anotada no passo anterior

### Opção 2: Deploy em Outro Serviço

Você pode usar:
- **Vercel**: Ideal para sites estáticos
- **Netlify**: Ótima interface e fácil configuração
- **GitHub Pages**: Gratuito e integrado ao GitHub

---

## 🔐 Configuração de Variáveis de Ambiente

### No Backend (Render)

Vá em **Dashboard** → **loja-oficial-backend** → **Environment**

Adicione/Atualize:

```bash
# Essenciais
NODE_ENV=production
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxx

# URLs (substitua pelos valores reais)
FRONTEND_URL=https://loja-oficial-frontend.onrender.com
BACKEND_URL=https://loja-oficial-backend.onrender.com
CORS_ORIGIN=https://loja-oficial-frontend.onrender.com

# URLs de retorno do Mercado Pago (opcional)
SUCCESS_URL=https://seu-frontend.com/checkout.html?status=success
FAILURE_URL=https://seu-frontend.com/checkout.html?status=failure
PENDING_URL=https://seu-frontend.com/checkout.html?status=pending
```

### No Frontend

Atualize `frontend/js/config.js`:

```javascript
const config = {
  apiUrl: 'https://loja-oficial-backend.onrender.com',
  // ... outras configurações
};
```

---

## ✅ Verificação de Funcionamento

### 1. Testar Backend

Acesse no navegador:
```
https://loja-oficial-backend.onrender.com/health
```

Resposta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-14T...",
  "uptime": 123.456
}
```

### 2. Testar Rota Raiz

```
https://loja-oficial-backend.onrender.com/
```

Deve retornar:
```json
{
  "message": "🚀 Backend Mercado Pago - Loja Oficial",
  "version": "1.0.0",
  "status": "online",
  "environment": "production",
  "endpoints": {
    "payment": "/api/payment",
    "webhook": "/api/webhook",
    "products": "/api/products",
    "health": "/health"
  }
}
```

### 3. Testar Public Key

```
https://loja-oficial-backend.onrender.com/api/payment/public-key
```

Deve retornar sua chave pública do Mercado Pago.

### 4. Testar Frontend

Acesse seu frontend e:
- [ ] Navegue pelas páginas
- [ ] Adicione produtos ao carrinho
- [ ] Inicie um checkout
- [ ] Verifique se abre o Mercado Pago

---

## 🐛 Resolução de Problemas

### Problema: Serviço não inicia

**Sintomas**: Build falha ou servidor não responde

**Soluções**:
1. Verifique os logs: Dashboard → seu serviço → **Logs**
2. Confirme que `package.json` tem os scripts corretos
3. Verifique se `init.js` existe
4. Confirme Node.js versão >=18

### Problema: CORS bloqueando requisições

**Sintomas**: Erro no console do navegador sobre CORS

**Soluções**:
1. Adicione variável `FRONTEND_URL` no backend
2. Adicione variável `CORS_ORIGIN` com URL do frontend
3. Reinicie o serviço (Manual Deploy)

### Problema: Mercado Pago não configurado

**Sintomas**: Erro 503 ao criar pagamento

**Soluções**:
1. Confirme que `MERCADOPAGO_ACCESS_TOKEN` está definido
2. Confirme que `MERCADOPAGO_PUBLIC_KEY` está definido
3. Verifique se as credenciais são de produção (não teste)
4. Reinicie o serviço

### Problema: Porta não dinâmica

**Sintomas**: Erro "EADDRINUSE" ou porta já em uso

**Solução**: O código já usa `process.env.PORT` corretamente. O Render define automaticamente.

### Problema: Diretório data/ não existe

**Sintomas**: Erro ao salvar pedidos

**Solução**: O script `init.js` cria automaticamente. Verifique:
```powershell
cd backend
node init.js
```

### Problema: Deploy lento ou timeout

**Sintomas**: Build demora mais de 10 minutos

**Soluções**:
1. No plano Free, o Render pode ser mais lento
2. Verifique se não há dependências desnecessárias
3. Considere fazer cache do node_modules

---

## 📊 Monitoramento

### Logs em Tempo Real

```
Dashboard → loja-oficial-backend → Logs
```

Você verá:
```
🔧 Iniciando servidor...
📦 Node.js: v18.x.x
🌍 NODE_ENV: production
✅ Inicialização concluída!
🚀 SERVIDOR BACKEND INICIADO
📍 Host: 0.0.0.0:10000
```

### Métricas

O Render oferece:
- CPU usage
- Memory usage
- Request count
- Response time

Acesse em: Dashboard → Metrics

---

## 🔄 Atualização do Deploy

### Deploy Automático

O Render está configurado com `autoDeploy: true`, então:

```powershell
# Faça alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

O deploy acontece automaticamente!

### Deploy Manual

1. Acesse o Dashboard
2. Clique em **"Manual Deploy"**
3. Selecione o branch
4. Clique em **"Deploy"**

---

## 📝 Checklist Final

Antes de considerar o deploy concluído:

- [ ] Backend responde em `/health`
- [ ] Backend retorna dados em `/`
- [ ] Public Key está disponível
- [ ] CORS permite requisições do frontend
- [ ] Frontend carrega corretamente
- [ ] Produtos aparecem no frontend
- [ ] Checkout abre tela do Mercado Pago
- [ ] Webhooks estão configurados (opcional)
- [ ] Variáveis de ambiente estão todas definidas
- [ ] Logs não mostram erros críticos

---

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. **Configure Domínio Personalizado** (opcional)
   - Settings → Custom Domains
   - Adicione seu domínio

2. **Configure Webhook no Mercado Pago**
   - Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
   - URL: `https://loja-oficial-backend.onrender.com/api/webhook`

3. **Monitore Performance**
   - Acompanhe logs regularmente
   - Configure alertas se necessário

4. **Backup de Dados**
   - Considere migrar de JSON para banco de dados real
   - MongoDB Atlas, PostgreSQL (Render Database), etc.

---

## 🆘 Suporte

### Documentação Oficial

- [Render Docs](https://render.com/docs)
- [Mercado Pago Docs](https://www.mercadopago.com.br/developers)
- [Node.js Docs](https://nodejs.org/docs)

### Comandos Úteis

```powershell
# Testar localmente antes do deploy
cd backend
npm install
npm start

# Verificar variáveis de ambiente localmente
$env:NODE_ENV='production'
$env:PORT='3000'

# Limpar cache npm
npm cache clean --force
```

---

## ✨ Melhorias Implementadas

Este guia contempla as seguintes correções:

✅ Porta dinâmica com `process.env.PORT`  
✅ Scripts corretos no `package.json`  
✅ Inicialização automática de diretórios  
✅ CORS configurado para produção  
✅ URLs dinâmicas sem localhost hardcoded  
✅ Tratamento gracioso de SIGTERM/SIGINT  
✅ Health check endpoint  
✅ Build e start commands apropriados  

---

**Data de Criação**: 14 de janeiro de 2026  
**Versão**: 1.0.0  
**Mantido por**: GitHub Copilot
