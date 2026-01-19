# 🔒 Guia de Segurança

## ✅ Status de Segurança

### 1. Token do Mercado Pago
**Status:** ✅ **SEGURO**

O token do Mercado Pago está protegido corretamente:
- ✅ Armazenado em variáveis de ambiente (.env)
- ✅ Arquivo .env está no .gitignore
- ✅ Nunca exposto no código frontend
- ✅ Usado apenas no backend (Node.js)

**Como configurar:**
1. Crie arquivo `.env` na raiz do projeto
2. Adicione suas credenciais:
```env
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
MERCADOPAGO_PUBLIC_KEY=sua_chave_publica_aqui
```
3. **NUNCA faça commit do arquivo .env**

### 2. Senha do Admin
**Status:** ✅ **MELHORADO** (mas ainda básico)

A senha agora está protegida com hash SHA-256:
- ✅ Senha não está visível em texto plano
- ✅ Usa criptografia SHA-256
- ⚠️ Ainda é autenticação frontend (não é 100% segura)

**Senha padrão:** `admin123`

**Como mudar a senha:**

1. Acesse este site: https://emn178.github.io/online-tools/sha256.html
2. Digite sua nova senha
3. Copie o hash gerado
4. Edite `frontend/js/admin-script.js`:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'admin', // Mude o usuário se quiser
    passwordHash: 'COLE_O_HASH_AQUI'
};
```

**Exemplo:**
- Nova senha: `minhasenha123`
- Hash SHA-256: `a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3`

### 3. Dados Sensíveis

**Arquivos protegidos pelo .gitignore:**
- ✅ `.env` (credenciais)
- ✅ `backend/config/config.js` (configurações)
- ✅ `node_modules/` (dependências)
- ✅ Logs do sistema

## 🚨 Recomendações de Segurança

### Para Produção (IMPORTANTE):

1. **Autenticação Backend:**
   - Implemente autenticação com JWT no backend
   - Use bcrypt para hash de senhas
   - Adicione rate limiting para prevenir ataques

2. **HTTPS:**
   - Use sempre HTTPS em produção
   - Render.com já fornece HTTPS automático

3. **Variáveis de Ambiente:**
   - Configure todas as credenciais no painel do Render
   - Nunca faça commit de arquivos .env

4. **Validação:**
   - Valide todas as entradas no backend
   - Sanitize dados antes de salvar

5. **Monitoramento:**
   - Monitore tentativas de login suspeitas
   - Configure alertas para erros críticos

## 📋 Checklist de Segurança

Antes de fazer deploy em produção:

- [ ] Arquivo .env não está no git
- [ ] Credenciais configuradas no Render
- [ ] Senha do admin foi alterada
- [ ] HTTPS está ativado
- [ ] Backup dos dados está configurado
- [ ] Logs estão sendo monitorados

## 🆘 Em Caso de Comprometimento

Se você achar que suas credenciais foram expostas:

1. **Mercado Pago:**
   - Acesse: https://www.mercadopago.com.br/developers/panel/credentials
   - Revogue o token comprometido
   - Gere novas credenciais
   - Atualize no Render

2. **Admin:**
   - Mude a senha imediatamente
   - Verifique logs de acesso
   - Limpe o localStorage dos usuários

## 📚 Recursos

- [Mercado Pago Security](https://www.mercadopago.com.br/developers/pt/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Render Security](https://render.com/docs/security)
