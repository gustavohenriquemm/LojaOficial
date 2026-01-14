# 🎯 GUIA RÁPIDO: Deploy no Render em 10 Minutos

## ⏱️ Tempo estimado: 10-15 minutos

---

## PASSO 1: Preparar o Projeto (2 min)

### 1.1 Abrir PowerShell na pasta do projeto
```powershell
cd "C:\Users\GHMeira\Projeto pronto\LojaOficial"
```

### 1.2 Verificar se Git está instalado
```powershell
git --version
```
Se não tiver, baixe em: https://git-scm.com/download/win

### 1.3 Inicializar Git (se ainda não foi feito)
```powershell
git init
git add .
git commit -m "Primeiro commit - Deploy Render"
```

---

## PASSO 2: Criar Repositório no GitHub (3 min)

### 2.1 Acessar GitHub
- Vá para: https://github.com
- Faça login

### 2.2 Criar novo repositório
- Clique no **+** (canto superior direito)
- Clique em **"New repository"**
- Nome: `LojaOficial` (ou outro nome)
- Descrição: `E-commerce com Mercado Pago`
- Público ou Privado (escolha)
- **NÃO** marque "Add README"
- Clique em **"Create repository"**

### 2.3 Conectar e enviar código
```powershell
git remote add origin https://github.com/SEU-USUARIO/LojaOficial.git
git branch -M main
git push -u origin main
```

✅ **Checkpoint:** Código agora está no GitHub!

---

## PASSO 3: Deploy no Render (5 min)

### 3.1 Criar conta no Render
- Vá para: https://render.com
- Clique em **"Get Started for Free"**
- Faça login com GitHub (recomendado)

### 3.2 Criar novo Blueprint
1. No dashboard, clique em **"New +"**
2. Selecione **"Blueprint"**
3. Conecte seu repositório GitHub
   - Se primeira vez, autorize o Render a acessar GitHub
   - Selecione o repositório `LojaOficial`
4. Clique em **"Connect"**

### 3.3 Configurar Variáveis de Ambiente

O Render detectará o arquivo `render.yaml` e criará 2 serviços automaticamente:
- Backend (Web Service)
- Frontend (Static Site)

**No serviço BACKEND**, adicione as variáveis:

| Chave | Valor |
|-------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MERCADOPAGO_ACCESS_TOKEN` | Seu token do Mercado Pago |
| `MERCADOPAGO_PUBLIC_KEY` | Sua chave pública |

**Como obter credenciais do Mercado Pago:**
1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Escolha **"Credenciais de teste"** (para testar) ou **"Credenciais de produção"**
3. Copie **Access Token** e **Public Key**

### 3.4 Iniciar Deploy
- Clique em **"Apply"**
- Aguarde o build (pode levar 3-5 minutos)
- Observe os logs (se aparecer erro, verifique variáveis)

✅ **Checkpoint:** Serviços sendo deployados!

---

## PASSO 4: Configurar URLs (2 min)

### 4.1 Anotar URLs
Após deploy concluído, você terá URLs como:
```
Backend:  https://loja-oficial-backend-xxxx.onrender.com
Frontend: https://loja-oficial-frontend-xxxx.onrender.com
```

### 4.2 Atualizar config.js
Abra o arquivo `frontend/js/config.js` e edite:

```javascript
production: 'https://loja-oficial-backend-xxxx.onrender.com/api/products'
```

Substitua `xxxx` pela sua URL real do Render.

### 4.3 Commitar e enviar novamente
```powershell
git add frontend/js/config.js
git commit -m "Atualizar URL da API para produção"
git push origin main
```

O Render fará deploy automaticamente! (1-2 min)

✅ **Checkpoint:** Frontend atualizado com URL correta!

---

## PASSO 5: Configurar Webhook do Mercado Pago (2 min)

### 5.1 Acessar painel do Mercado Pago
- Vá para: https://www.mercadopago.com.br/developers/panel/webhooks

### 5.2 Criar novo webhook
1. Clique em **"Criar Webhook"**
2. **URL:** `https://loja-oficial-backend-xxxx.onrender.com/api/webhook`
3. **Eventos:** Marque todos relacionados a **payments** e **merchant_orders**
4. Clique em **"Salvar"**

✅ **Checkpoint:** Webhook configurado!

---

## PASSO 6: Testar o Site (3 min)

### 6.1 Abrir site
Acesse: `https://loja-oficial-frontend-xxxx.onrender.com`

### 6.2 Checklist de testes
- [ ] Site carrega
- [ ] Logo aparece
- [ ] Produtos aparecem
- [ ] Busca funciona
- [ ] Carrinho funciona
- [ ] Checkout abre
- [ ] Mercado Pago redireciona

### 6.3 Se algo não funcionar:

**Produtos não aparecem:**
```powershell
# Testar API diretamente
curl https://loja-oficial-backend-xxxx.onrender.com/api/products
```

**Imagens não aparecem:**
- Verifique se pasta `img/` está no GitHub
- Confirme paths em `products.json` estão corretos

**Erro CORS:**
- Verifique variáveis de ambiente no Render
- Veja logs do backend

---

## 🎉 PRONTO! Seu site está no ar!

### 📱 URLs Finais:
- **Loja:** https://loja-oficial-frontend-xxxx.onrender.com
- **API:** https://loja-oficial-backend-xxxx.onrender.com/api/products
- **Health:** https://loja-oficial-backend-xxxx.onrender.com/health

### 🔄 Sistema Anti-Hibernação
Já está ativo! Seu backend envia ping a cada 14 minutos.

### 📊 Monitorar
- Logs do Backend: Painel do Render → Backend Service → Logs
- Logs do Frontend: Console do navegador (F12)

---

## 💡 Próximos Passos

1. **Testar pagamentos** com cartões de teste
2. **Adicionar produtos** pelo painel admin
3. **Compartilhar** o link com clientes
4. **Monitorar** vendas no painel do Mercado Pago

---

## ❓ Problemas Comuns

### "Service Unavailable" no primeiro acesso
**Normal!** O plano gratuito hiberna após inatividade.
Aguarde 30 segundos e recarregue.

### Backend não responde
**Verifique:**
- Variáveis de ambiente estão corretas?
- Build concluiu sem erros?
- Logs mostram algum erro?

### Pagamento não funciona
**Verifique:**
- Credenciais do Mercado Pago corretas?
- Webhook configurado?
- Usando cartões de teste?

Cartões de teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards

---

## 🆘 Precisa de Ajuda?

1. **Logs:** Sempre verifique os logs primeiro
2. **Documentação:** 
   - Render: https://render.com/docs
   - Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs
3. **Suporte:** Abra issue no GitHub do projeto

---

## ✅ Checklist Final

- [ ] Site abre normalmente
- [ ] Produtos carregam
- [ ] Busca funciona
- [ ] Carrinho funciona
- [ ] Checkout funciona
- [ ] Webhook configurado
- [ ] Pagamento teste realizado
- [ ] URLs anotadas
- [ ] Backup do .env feito

**Tudo certo? Parabéns! 🎊 Seu e-commerce está online!**

---

*Última atualização: $(date)*
