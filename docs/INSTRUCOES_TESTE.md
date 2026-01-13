# 🎯 Instruções para Testar o Checkout do Mercado Pago

## ✅ O que foi corrigido:

1. **✅ SDK do Mercado Pago agora é inicializado** antes de abrir o checkout
2. **✅ Checkout Pro Modal** agora abre corretamente (em vez de redirecionar)
3. **✅ Botão "Finalizar Pagamento"** agora tem `type="button"` e `return false` para prevenir submit
4. **✅ Servidor backend** está rodando na porta 3000
5. **✅ Fluxo completo** validado e logs adicionados para debug

## 🧪 Como testar:

### 1. Verificar se o servidor está rodando:
```
http://localhost:3000
```
Você deve ver uma mensagem JSON indicando que o backend está online.

### 2. Abrir o site no navegador:
Abra `checkout.html` usando Live Server ou outro servidor web local.

### 3. Testar o fluxo completo:

1. **Adicionar produtos ao carrinho** na página de produtos
2. **Ir para checkout** (checkout.html)
3. **Preencher Passo 1**: Revisar carrinho → Clicar "Próximo"
4. **Preencher Passo 2**: Dados pessoais (nome, telefone, email) → Clicar "Próximo"
5. **Preencher Passo 3**: Endereço completo → Clicar "Próximo"
6. **Passo 4**: Revisar pedido → Clicar "**Finalizar Pagamento**"

### ✨ O que deve acontecer:

- Uma tela modal do Mercado Pago deve aparecer **sobre a página**
- A modal mostra opções de pagamento: **Pix, Cartão de Crédito, Parcelamento**
- O usuário **permanece no seu site** (não sai da página)
- Funciona como Shopee, Mercado Livre, etc.

## 🐛 Verificar no Console (F12):

Abra o Console do navegador (F12 → Console) e procure por:

### ✅ Mensagens esperadas:
```
🚀 Iniciando processo de pagamento...
🛒 Carrinho: [...]
📋 Validando dados do cliente...
✅ Dados do cliente validados: {...}
🔧 Inicializando SDK do Mercado Pago...
✅ Mercado Pago inicializado
📤 Criando preferência no backend...
✅ Preferência criada: [ID]
🎯 Abrindo Checkout Pro do Mercado Pago...
✅ Checkout Pro modal iniciado
```

### ❌ Se aparecer erros:

**Erro: "SDK do Mercado Pago não carregado"**
- Solução: Verifique se a internet está funcionando
- O script `https://sdk.mercadopago.com/js/v2` precisa carregar

**Erro: "Failed to fetch" ou "Network error"**
- Solução: Certifique-se que o backend está rodando na porta 3000
- Execute: `cd backend && node server.js`

**Erro: "Dados do cliente não encontrados"**
- Solução: Volte e preencha os formulários nos passos 2 e 3

## 🔑 Credenciais de Teste do Mercado Pago

Para testar pagamentos, você precisa de credenciais **REAIS** do Mercado Pago:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Crie uma aplicação
3. Copie as credenciais de **TESTE** (começam com `TEST-`)
4. Cole no arquivo `backend/.env`:
   ```
   MP_ACCESS_TOKEN_TEST=TEST-seu-token-aqui
   MP_PUBLIC_KEY_TEST=TEST-sua-chave-aqui
   ```
5. Reinicie o servidor backend

### 📱 Cartões de Teste do Mercado Pago:

Para simular pagamentos aprovados:
- **Mastercard**: 5031 4332 1540 6351
- **Visa**: 4509 9535 6623 3704
- **CVV**: Qualquer 3 dígitos
- **Vencimento**: Qualquer data futura
- **Nome**: APRO (para aprovar) ou OTHE (para recusar)

## 📊 Diferenças do fluxo anterior:

### ❌ Antes (ERRADO):
```javascript
// Redirecionava para outra página
window.location.href = data.initPoint;
```

### ✅ Agora (CORRETO):
```javascript
// Abre modal sobre a página atual
const mp = await initMercadoPago();
const checkout = mp.checkout({
  preference: { id: data.preferenceId },
  autoOpen: true
});
```

## 🎉 Resultado esperado:

Ao clicar em "Finalizar Pagamento":
1. Loading aparece brevemente
2. Modal do Mercado Pago abre **sobre a página**
3. Usuário vê tela de pagamento profissional
4. Pode pagar com Pix, Cartão, etc.
5. Após pagamento, retorna para `checkout.html?status=success`

---

## 💡 Dicas:

- Use as **Ferramentas de Desenvolvedor** (F12) para ver logs
- Teste primeiro com credenciais de **TESTE**
- Só use credenciais de **PRODUÇÃO** quando estiver tudo funcionando
- O modal pode demorar 1-2 segundos para carregar (é normal)

## 📞 Troubleshooting:

Se o modal não abrir, verifique:
1. ✅ Backend rodando? → `http://localhost:3000`
2. ✅ Console sem erros? → F12
3. ✅ Credenciais válidas? → `backend/.env`
4. ✅ Internet funcionando? → SDK precisa carregar
5. ✅ Dados preenchidos? → Passos 2 e 3 completos

---

**Última atualização**: 9 de janeiro de 2026
