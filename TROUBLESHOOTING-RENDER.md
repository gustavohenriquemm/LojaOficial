# 🔧 SOLUÇÃO DE PROBLEMAS - DEPLOY RENDER

## ✅ Correções Implementadas (Commit be0be87)

### 1. **Melhor Tratamento de Erros**
- Adicionado try-catch na inicialização de diretórios
- Logs mais detalhados para debug
- Tratamento de erros ao carregar rotas
- Tratamento de erros ao iniciar o servidor

### 2. **Diagnóstico Automático**
- Novo script `npm run diagnose` para verificar se tudo está funcionando
- Testa módulos, dependências, configurações e rotas

### 3. **Logs Aprimorados**
- Logs claros de cada etapa de inicialização
- Status do Mercado Pago (configurado ou não)
- Informações sobre a porta e ambiente

## 🎯 Passos para Resolver o Erro "Exited with status 1"

### Etapa 1: Verificar Logs do Render

1. Acesse o Dashboard do Render
2. Clique no seu serviço `loja-oficial-backend`
3. Vá para a aba **Logs**
4. Procure por mensagens de erro como:
   - `❌ ERRO CRÍTICO`
   - `Error:`
   - `Cannot find module`
   - `EADDRINUSE`

### Etapa 2: Verificar Variáveis de Ambiente

No Render Dashboard → Environment, certifique-se de ter:

```
✅ NODE_ENV = production
✅ MERCADOPAGO_ACCESS_TOKEN = (seu token real)
✅ MERCADOPAGO_PUBLIC_KEY = (sua chave real)
✅ FRONTEND_URL = https://loja-oficial-frontend.onrender.com
✅ CORS_ORIGIN = https://loja-oficial-frontend.onrender.com
```

**IMPORTANTE:** Verifique se o Access Token e Public Key são válidos e do mesmo ambiente (ambos de teste OU ambos de produção).

### Etapa 3: Verificar Plano do Render

O plano **Free** tem limitações:
- Pode entrar em "sleep" após 15 minutos de inatividade
- Pode demorar até 30 segundos para "acordar"
- Build deve completar em menos de 15 minutos

### Etapa 4: Testar Localmente Primeiro

Antes de fazer deploy, teste localmente:

```powershell
cd backend
npm install
npm run diagnose    # Executa diagnóstico
npm start           # Inicia servidor
```

Se funcionar localmente, o problema está na configuração do Render.

### Etapa 5: Deploy Manual (Se Necessário)

Se o auto-deploy continuar falhando:

1. Faça commit das alterações:
```powershell
git add .
git commit -m "fix: Melhora tratamento de erros e logs"
git push origin main
```

2. No Render Dashboard:
   - Clique em "Manual Deploy"
   - Selecione a branch `main`
   - Clique em "Deploy latest commit"

## 🔍 Problemas Comuns e Soluções

### Problema 1: "Cannot find module"
**Solução:** Certifique-se de que todas as dependências estão no `package.json`:
```json
"dependencies": {
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "mercadopago": "^2.0.9",
  "body-parser": "^1.20.2"
}
```

### Problema 2: "Port already in use"
**Solução:** O Render define automaticamente a variável `PORT`. Não force uma porta específica.

### Problema 3: "Mercado Pago not configured"
**Solução:** Isso é apenas um aviso. O servidor deve iniciar mesmo sem as credenciais do Mercado Pago, mas as funcionalidades de pagamento estarão desabilitadas.

### Problema 4: "Permission denied"
**Solução:** No Render, o diretório `/opt/render/project/src` é read-only. Os arquivos de dados devem ser salvos em `/tmp` ou usar um banco de dados externo.

## 💡 Solução Alternativa: Usar /tmp para Data

Se o problema persistir, modifique o `database.js` para usar `/tmp`:

```javascript
const DB_DIR = process.env.NODE_ENV === 'production' 
  ? '/tmp/data' 
  : path.join(__dirname, '../data');
```

## 📊 O Que os Logs Devem Mostrar (Sucesso)

```
🔧 Iniciando servidor...
📦 Node.js: v18.x.x
💻 Plataforma: linux
🌍 NODE_ENV: production
🔧 Inicializando ambiente do backend...
✅ Diretório data/ criado
✅ Arquivo orders.json inicializado
✅ Arquivo products.json inicializado
✅ Inicialização concluída!

📦 Carregando módulos de rotas...
   ✓ routes/payment.js
   ✓ routes/webhook.js
   ✓ routes/products.js
✅ Todas as rotas carregadas

🔌 Porta configurada: 10000
🔐 Origens CORS permitidas: [...]

==================================================
🚀 SERVIDOR BACKEND INICIADO
==================================================
📍 Host: 0.0.0.0:10000
🌍 Ambiente: production
💳 Mercado Pago: Configurado
==================================================
```

## 🆘 Ainda Não Funciona?

1. **Compartilhe os logs completos** do Render
2. **Verifique se as credenciais** do Mercado Pago são válidas
3. **Considere usar um serviço alternativo** como:
   - Railway
   - Heroku
   - Vercel (para serverless)
   - Railway

## 📞 Suporte

Se o problema persistir após todas essas verificações, o erro pode estar relacionado a:
- Limitações do plano Free do Render
- Região do servidor (Oregon pode ter latência)
- Configuração de rede do Render

Considere abrir um ticket no suporte do Render com os logs completos.

---

**Última Atualização:** 14 de Janeiro de 2026  
**Status:** ✅ Correções aplicadas - Pronto para novo deploy
