# 🚀 Deploy Rápido - Render

## ⚡ Setup Rápido (5 minutos)

### 1️⃣ Commit e Push
```powershell
git add .
git commit -m "fix: backend pronto para Render"
git push origin main
```

### 2️⃣ Criar Web Service no Render
1. Acesse: https://dashboard.render.com/
2. **New +** → **Web Service**
3. Conecte o repositório **LojaOficial**

### 3️⃣ Configuração do Serviço

| Campo | Valor |
|-------|-------|
| Name | `loja-oficial-backend` |
| Root Directory | `backend` |
| Build Command | `npm install && npm run init` |
| Start Command | `npm start` |
| Instance Type | `Free` |

### 4️⃣ Variáveis de Ambiente

Adicione no Render:

```bash
NODE_ENV=production
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
MERCADOPAGO_PUBLIC_KEY=sua_chave_aqui
FRONTEND_URL=https://seu-frontend.onrender.com
CORS_ORIGIN=https://seu-frontend.onrender.com
```

> 🔑 Obtenha as credenciais em: https://www.mercadopago.com.br/developers/panel/credentials

### 5️⃣ Deploy
- Clique em **"Create Web Service"**
- Aguarde 2-5 minutos

---

## ✅ Testar Backend

Após deploy, teste:

```
https://seu-backend.onrender.com/health
```

Deve retornar:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": ...
}
```

---

## 📚 Documentação Completa

- **`backend/INSTRUCOES_DEPLOY.md`** - Guia detalhado
- **`backend/RESUMO_CORRECOES.md`** - Lista de correções
- **`backend/validate.js`** - Validação pré-deploy

---

## 🔧 Validar Antes do Deploy

```powershell
cd backend
node validate.js
```

Deve mostrar: `✅ TODOS OS TESTES PASSARAM!`

---

## 📊 Build & Start Commands

**Build Command:**
```bash
npm install && npm run init
```

**Start Command:**
```bash
npm start
```

---

## ⚠️ Importante

- ✅ Porta dinâmica: `process.env.PORT` (automático no Render)
- ✅ Host: `0.0.0.0` (aceita conexões externas)
- ✅ CORS: Configurado para `.onrender.com` e `.vercel.app`
- ✅ URLs: Sem localhost hardcoded
- ✅ Diretórios: Criados automaticamente por `init.js`

---

## 🐛 Problemas?

Consulte seção "Resolução de Problemas" em `backend/INSTRUCOES_DEPLOY.md`

---

**Backend está 100% pronto para produção!** 🎉
