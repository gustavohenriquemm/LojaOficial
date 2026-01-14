# Guia de Deploy no Render.com

## 📋 Pré-requisitos

1. Conta no GitHub
2. Conta no Render.com (gratuita)
3. Credenciais do Mercado Pago

## 🚀 Passo a Passo

### 1. Preparar o Repositório GitHub

```bash
# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Preparar projeto para deploy no Render"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git branch -M main
git push -u origin main
```

### 2. Deploy no Render

#### Opção A: Deploy com render.yaml (Recomendado)

1. Acesse https://dashboard.render.com/
2. Clique em "New" → "Blueprint"
3. Conecte seu repositório GitHub
4. O Render detectará automaticamente o arquivo `render.yaml`
5. Configure as variáveis de ambiente:
   - `MERCADOPAGO_ACCESS_TOKEN`: Seu token do Mercado Pago
   - `MERCADOPAGO_PUBLIC_KEY`: Sua chave pública do Mercado Pago
6. Clique em "Apply"

#### Opção B: Deploy Manual

**Backend:**
1. New → Web Service
2. Conecte o repositório
3. Configurações:
   - **Name:** loja-oficial-backend
   - **Region:** Oregon (US West)
   - **Branch:** main
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Adicione as variáveis de ambiente
5. Clique em "Create Web Service"

**Frontend:**
1. New → Static Site
2. Conecte o repositório
3. Configurações:
   - **Name:** loja-oficial-frontend
   - **Region:** Oregon (US West)
   - **Branch:** main
   - **Root Directory:** (deixe vazio ou "/")
   - **Build Command:** (deixe vazio)
   - **Publish Directory:** ./
4. Clique em "Create Static Site"

### 3. Configurar Variáveis de Ambiente

No painel do backend no Render, adicione:

```
NODE_ENV=production
PORT=10000
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
MERCADOPAGO_PUBLIC_KEY=sua_chave_aqui
RENDER_EXTERNAL_URL=https://seu-backend.onrender.com
```

### 4. Atualizar Frontend para usar API em Produção

No arquivo `frontend/js/script.js`, atualize a URL da API:

```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/products'
  : 'https://seu-backend.onrender.com/api/products';
```

### 5. Configurar Webhook do Mercado Pago

1. Acesse https://www.mercadopago.com.br/developers/panel/webhooks
2. Configure a URL: `https://seu-backend.onrender.com/api/webhook`
3. Selecione os eventos que deseja receber

## 🔄 Sistema de Ping (Anti-Hibernação)

O backend já está configurado com um sistema automático de ping que:
- Envia um ping a cada 14 minutos
- Mantém o servidor ativo no plano gratuito do Render
- Só funciona em produção (NODE_ENV=production)

## 📱 URLs de Produção

Após o deploy, suas URLs serão:

- **Frontend:** https://loja-oficial-frontend.onrender.com
- **Backend:** https://loja-oficial-backend.onrender.com
- **API:** https://loja-oficial-backend.onrender.com/api/products

## ⚠️ Importante

1. O plano gratuito do Render hiberna após 15 minutos de inatividade
2. O primeiro acesso após hibernação pode demorar ~30 segundos
3. O sistema de ping ajuda a manter ativo, mas tem limites
4. Para produção real, considere o plano pago

## 🐛 Troubleshooting

### Backend não inicia
- Verifique os logs no Render
- Confirme que as variáveis de ambiente estão corretas
- Verifique se o `package.json` tem o script `start`

### Frontend não carrega produtos
- Verifique se a URL da API está correta
- Confirme CORS no backend
- Verifique logs de rede no navegador (F12)

### Pagamentos não funcionam
- Verifique credenciais do Mercado Pago
- Configure webhook no painel do Mercado Pago
- Teste em modo sandbox primeiro

## 📞 Suporte

- Documentação Render: https://render.com/docs
- Documentação Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs
