# ⚡ INÍCIO RÁPIDO - 5 Passos

## 🚀 Como Começar em 5 Minutos

### 1️⃣ Instalar Dependências

Abra o PowerShell na pasta do projeto e execute:

```powershell
.\setup.ps1
```

**OU manualmente:**

```bash
cd backend
npm install
```

### 2️⃣ Obter Credenciais do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login
3. Vá em **"Credenciais"**
4. Copie suas credenciais de **TESTE**

### 3️⃣ Configurar Credenciais

Edite o arquivo `backend\.env` e cole suas credenciais:

```env
MP_ACCESS_TOKEN_TEST=TEST-1234567890-123456-abc...
MP_PUBLIC_KEY_TEST=TEST-1234567890-123456-abc...
```

### 4️⃣ Iniciar Backend

```bash
cd backend
npm start
```

Você deve ver:
```
🚀 SERVIDOR BACKEND INICIADO
📍 URL: http://localhost:3000
```

### 5️⃣ Abrir Frontend

- Use **Live Server** no VS Code, ou
- Use qualquer servidor HTTP local
- Abra: `http://localhost:5500/index.html`

## ✅ Testar o Sistema

1. Adicione produtos ao carrinho
2. Preencha dados pessoais
3. Clique em "Finalizar Pagamento"
4. Use cartão de teste:

```
Número: 5031 4332 1540 6351
CVV: 123
Vencimento: 11/25
Nome: APRO
```

## 📚 Próximos Passos

- Leia [GUIA_COMPLETO_MERCADOPAGO.md](GUIA_COMPLETO_MERCADOPAGO.md) para documentação completa
- Configure webhook para produção
- Migre para banco de dados real
- Deploy em servidor de produção

## 🆘 Problemas?

### Backend não inicia
- Verifique se Node.js está instalado: `node --version`
- Verifique se dependências foram instaladas: `npm install`
- Veja se arquivo `.env` está configurado

### Checkout não abre
- Verifique se backend está rodando
- Abra console do navegador (F12) para ver erros
- Confirme que credenciais estão corretas

### Mais Ajuda

Veja seção **Troubleshooting** em [GUIA_COMPLETO_MERCADOPAGO.md](GUIA_COMPLETO_MERCADOPAGO.md)

---

**🎉 Pronto! Seu sistema de pagamento está funcionando!**
