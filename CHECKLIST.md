# ✅ Checklist de Deploy - Render.com

## 📋 Antes do Deploy

### Código
- [ ] Todos os arquivos commitados no Git
- [ ] `.gitignore` configurado (não commitar `.env`)
- [ ] `render.yaml` criado
- [ ] Sistema de ping implementado no backend
- [ ] CORS configurado para aceitar domínios do Render

### Configurações
- [ ] `frontend/js/config.js` atualizado com URL de produção
- [ ] Credenciais do Mercado Pago prontas
- [ ] Webhook URL anotada (será: `https://SEU-BACKEND.onrender.com/api/webhook`)

## 🚀 Durante o Deploy

### GitHub
- [ ] Repositório criado no GitHub
- [ ] Código enviado (`git push origin main`)
- [ ] Repositório público ou privado (Render aceita ambos)

### Render - Backend
- [ ] Serviço criado (Web Service ou Blueprint)
- [ ] Variáveis de ambiente adicionadas:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `MERCADOPAGO_ACCESS_TOKEN=seu_token`
  - [ ] `MERCADOPAGO_PUBLIC_KEY=sua_chave`
- [ ] Build executado com sucesso
- [ ] Health check funcionando (`/health`)
- [ ] Logs verificados (sem erros)

### Render - Frontend
- [ ] Static Site criado
- [ ] Deploy executado com sucesso
- [ ] Site acessível pelo navegador

## ⚙️ Após o Deploy

### Configurações Finais
- [ ] URL do backend anotada (ex: `https://loja-oficial-backend.onrender.com`)
- [ ] URL do frontend anotada (ex: `https://loja-oficial-frontend.onrender.com`)
- [ ] `config.js` atualizado com URL real do backend
- [ ] Frontend re-deployado após atualização

### Mercado Pago
- [ ] Webhook configurado no painel do Mercado Pago
- [ ] URL: `https://SEU-BACKEND.onrender.com/api/webhook`
- [ ] Eventos selecionados: `payment`, `merchant_order`
- [ ] Webhook testado e ativo

### Testes
- [ ] Site abre corretamente
- [ ] Logo aparece em todas as páginas
- [ ] Produtos carregam da API
- [ ] Imagens dos produtos aparecem
- [ ] Busca funciona
- [ ] Carrinho funciona
- [ ] Adicionar ao carrinho funciona
- [ ] Checkout abre
- [ ] Pagamento redireciona para Mercado Pago
- [ ] Webhook recebe notificações

## 🔍 Troubleshooting

### Backend não inicia
- [ ] Verificar logs no Render
- [ ] Conferir variáveis de ambiente
- [ ] Testar localmente: `cd backend && npm start`
- [ ] Verificar `package.json` tem script `start`

### Frontend não carrega produtos
- [ ] Verificar console do navegador (F12)
- [ ] Conferir URL da API em `config.js`
- [ ] Testar endpoint da API: `https://SEU-BACKEND.onrender.com/api/products`
- [ ] Verificar CORS no backend

### Imagens não aparecem
- [ ] Verificar caminhos em `products.json` (devem ser absolutos: `/img/...`)
- [ ] Verificar se pasta `img/` foi commitada no Git
- [ ] Conferir URLs das imagens no navegador

### Pagamento não funciona
- [ ] Credenciais corretas do Mercado Pago
- [ ] Testar com cartões de teste primeiro
- [ ] Verificar logs do webhook
- [ ] Confirmar webhook está cadastrado

## 📊 Monitoramento

### Logs para Verificar
- [ ] Backend: Ver logs no painel do Render
- [ ] Frontend: Console do navegador (F12)
- [ ] Webhook: Painel do Mercado Pago
- [ ] Ping: Logs mostram "✅ Ping enviado"

### Performance
- [ ] Primeiro carregamento < 3 segundos
- [ ] Produtos carregam < 2 segundos
- [ ] Busca responde instantaneamente
- [ ] Imagens otimizadas

## 🎉 Deploy Completo!

Quando todos os itens estiverem marcados:

✅ **Seu site está no ar!**

🔗 **URLs:**
- Frontend: `https://_____________________.onrender.com`
- Backend: `https://_____________________.onrender.com`
- API: `https://_____________________.onrender.com/api/products`

📱 **Compartilhe:**
- [ ] Adicionar ao README
- [ ] Compartilhar com equipe
- [ ] Testar em diferentes dispositivos
- [ ] Adicionar analytics (Google Analytics, etc.)

## 🔄 Atualizações Futuras

Para atualizar o site:

```bash
# 1. Fazer alterações no código
# 2. Commitar
git add .
git commit -m "Descrição da atualização"

# 3. Push
git push origin main

# 4. Render fará deploy automaticamente!
```

## 📞 Suporte

Se precisar de ajuda:
- Render: https://render.com/docs
- Mercado Pago: https://www.mercadopago.com.br/developers/pt/support
- GitHub: Issues no repositório
