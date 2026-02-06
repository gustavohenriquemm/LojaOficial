# 🗄️ MIGRAÇÃO PARA MONGODB ATLAS

Este guia explica como configurar e migrar sua aplicação para usar MongoDB Atlas como banco de dados em nuvem, garantindo persistência real dos dados.

---

## 📋 Índice

1. [Por que migrar?](#por-que-migrar)
2. [Criar conta no MongoDB Atlas](#criar-conta-no-mongodb-atlas)
3. [Configurar o banco de dados](#configurar-o-banco-de-dados)
4. [Configurar variáveis de ambiente](#configurar-variáveis-de-ambiente)
5. [Migrar dados existentes](#migrar-dados-existentes)
6. [Testar localmente](#testar-localmente)
7. [Deploy em produção](#deploy-em-produção)
8. [Verificar persistência](#verificar-persistência)

---

## 🎯 Por que migrar?

**Problema anterior:**
- Produtos armazenados em arquivos JSON locais
- Dados resetados a cada novo deploy
- Impossível manter dados entre atualizações
- Não adequado para produção

**Solução com MongoDB Atlas:**
- ✅ Dados persistentes em nuvem
- ✅ Sobrevivem a novos deploys
- ✅ Escalável e profissional
- ✅ Backup automático
- ✅ Plano gratuito disponível

---

## 1️⃣ Criar conta no MongoDB Atlas

### Passo 1: Criar conta gratuita

1. Acesse: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Crie uma conta (pode usar Google/GitHub)
3. Após login, clique em **"Build a Database"**

### Passo 2: Escolher plano FREE

1. Selecione o plano **M0 FREE** (512 MB de armazenamento gratuito)
2. Escolha o provedor (AWS, Google Cloud ou Azure)
3. Selecione a região mais próxima do Brasil:
   - AWS: `São Paulo (sa-east-1)`
   - ou `US East (us-east-1)` como alternativa
4. Clique em **"Create Cluster"**

---

## 2️⃣ Configurar o banco de dados

### Passo 1: Criar usuário do banco

1. Na tela **"Security Quickstart"**:
   - **Username**: escolha um nome (ex: `lojaadmin`)
   - **Password**: gere uma senha forte (clique em "Autogenerate Secure Password")
   - ⚠️ **IMPORTANTE**: Copie e salve essa senha em local seguro!
2. Clique em **"Create User"**

### Passo 2: Configurar IP de acesso

1. Em **"Where would you like to connect from?"**
2. Clique em **"Add My Current IP Address"**
3. Para ambiente de produção, adicione também:
   - Clique em **"Add IP Address"**
   - Digite: `0.0.0.0/0` (permite acesso de qualquer lugar)
   - ⚠️ Isso é necessário para o Render/Vercel acessarem
4. Clique em **"Finish and Close"**

### Passo 3: Obter string de conexão

1. Clique em **"Connect"** no seu cluster
2. Escolha **"Connect your application"**
3. Selecione:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
4. Copie a **connection string**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Edite a string:**
   - Substitua `<username>` pelo seu usuário
   - Substitua `<password>` pela senha que você copiou
   - Adicione o nome do banco após `.net/`: `.net/lojaoficial?`
   
   **Exemplo final:**
   ```
   mongodb+srv://lojaadmin:SuaSenhaForte123@cluster0.abc123.mongodb.net/lojaoficial?retryWrites=true&w=majority
   ```

---

## 3️⃣ Configurar variáveis de ambiente

### Desenvolvimento local (`.env`)

1. Navegue até `backend/`
2. Crie ou edite o arquivo `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```
3. Adicione a variável `MONGODB_URI`:
   ```env
   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://lojaadmin:SuaSenhaForte123@cluster0.abc123.mongodb.net/lojaoficial?retryWrites=true&w=majority
   
   # Outras variáveis...
   PORT=3000
   NODE_ENV=development
   ```

### Produção (Render/Vercel)

**No Render:**
1. Acesse o dashboard do seu serviço
2. Vá em **"Environment"**
3. Adicione a variável:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://lojaadmin:SuaSenhaForte123@cluster0.abc123.mongodb.net/lojaoficial?retryWrites=true&w=majority`
4. Clique em **"Save Changes"**

**No Vercel:**
1. Acesse **Settings** > **Environment Variables**
2. Adicione:
   - **Name**: `MONGODB_URI`
   - **Value**: sua connection string
   - **Environments**: Production, Preview, Development
3. Clique em **"Save"**

---

## 4️⃣ Migrar dados existentes

Se você já tem produtos no arquivo `products.json`, migre-os para o MongoDB:

### Executar script de migração

```bash
cd backend
node migrate-to-mongodb.js
```

### O que o script faz:

1. ✅ Conecta ao MongoDB Atlas
2. ✅ Lê produtos do `products.json`
3. ✅ Limpa produtos existentes no MongoDB (se houver)
4. ✅ Insere todos os produtos no banco
5. ✅ Exibe relatório de migração

### Resultado esperado:

```
🚀 Iniciando migração de produtos...

✅ MongoDB conectado com sucesso!
📦 Database: lojaoficial

📖 Lendo produtos do arquivo JSON...
📦 150 produtos encontrados no arquivo JSON

💾 Inserindo produtos no MongoDB...
   ✓ Chocolate ao Leite Premium 500g (ID: choc-1)
   ✓ Trufas Sortidas 250g (ID: choc-2)
   ...

============================================================
📊 RESULTADO DA MIGRAÇÃO
============================================================
✅ Produtos migrados com sucesso: 150
❌ Erros durante migração: 0
📦 Total de produtos no MongoDB: 150
============================================================

✅ Migração concluída com sucesso!
```

---

## 5️⃣ Testar localmente

### Instalar dependências

```bash
cd backend
npm install
```

### Iniciar servidor

```bash
npm start
```

### Verificar logs

Você deve ver:
```
🔌 Conectando ao MongoDB Atlas...
✅ MongoDB conectado com sucesso!
📦 Database: lojaoficial

🚀 SERVIDOR BACKEND INICIADO
==================================================
📍 Host: 0.0.0.0:3000
🌍 Ambiente: development
💳 Mercado Pago: Configurado
🗄️ MongoDB: Conectado
==================================================
```

### Testar endpoints

**Listar produtos:**
```bash
curl http://localhost:3000/api/products
```

**Criar produto:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste",
    "category": "Teste",
    "price": 29.90,
    "description": "Produto de teste"
  }'
```

**Atualizar produto:**
```bash
curl -X PUT http://localhost:3000/api/products/prod-123 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 39.90
  }'
```

**Deletar produto:**
```bash
curl -X DELETE http://localhost:3000/api/products/prod-123
```

---

## 6️⃣ Deploy em produção

### Preparar para deploy

1. **Commit das alterações:**
   ```bash
   git add .
   git commit -m "feat: Migração para MongoDB Atlas - persistência real de dados"
   git push origin main
   ```

2. **Verificar arquivos:**
   - ✅ `.env` está no `.gitignore` (nunca fazer commit)
   - ✅ `.env.example` foi atualizado
   - ✅ `package.json` contém `mongoose`

### Deploy automático

O Render detectará as mudanças e fará deploy automaticamente.

**Acompanhe os logs:**
- Procure por: `✅ MongoDB conectado com sucesso!`
- Se houver erro, verifique a variável `MONGODB_URI` no Render

---

## 7️⃣ Verificar persistência

### Teste 1: Criar produto

1. Acesse o painel admin
2. Crie um novo produto
3. Verifique se aparece na lista

### Teste 2: Fazer novo deploy

1. Faça uma pequena alteração no código
2. Commit e push
3. Aguarde o deploy
4. **Verifique se o produto criado ainda existe** ✅

### Teste 3: Editar e deletar

1. Edite um produto
2. Delete outro produto
3. Faça novo deploy
4. **Verifique se as alterações persistiram** ✅

---

## 🎉 Pronto!

Sua aplicação agora tem:
- ✅ Persistência real de dados
- ✅ Banco de dados em nuvem profissional
- ✅ Dados sobrevivem a deploys
- ✅ Escalabilidade
- ✅ Backup automático (MongoDB Atlas)

---

## 🔍 Troubleshooting

### Erro: "MongoDB não conectado"

**Causa:** String de conexão inválida ou variável não configurada

**Solução:**
1. Verifique se `MONGODB_URI` está no `.env`
2. Confirme que a senha está correta
3. Teste a conexão no MongoDB Compass

### Erro: "IP não autorizado"

**Causa:** IP do servidor não está na whitelist

**Solução:**
1. Acesse MongoDB Atlas
2. Network Access > Add IP Address
3. Adicione `0.0.0.0/0`

### Produtos não aparecem

**Causa:** Migração não foi executada

**Solução:**
```bash
node migrate-to-mongodb.js
```

### Produtos duplicados

**Causa:** Migração executada múltiplas vezes

**Solução:**
1. O script já limpa produtos antes de migrar
2. Ou delete manualmente no MongoDB Atlas:
   - Collections > products > Delete all documents

---

## 📚 Recursos adicionais

- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [MongoDB University (cursos gratuitos)](https://university.mongodb.com/)

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor
2. Confirme a string de conexão
3. Teste a conexão com MongoDB Compass
4. Verifique se o cluster está ativo no Atlas

---

**Última atualização:** Fevereiro 2026
