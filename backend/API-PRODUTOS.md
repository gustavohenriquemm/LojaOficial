# 📦 API de Produtos - Documentação MongoDB

## Endpoints Disponíveis

Base URL: `http://localhost:3000/api/products` (desenvolvimento)
Base URL: `https://seu-app.onrender.com/api/products` (produção)

---

## 📋 Listar todos os produtos

**GET** `/api/products`

### Query Parameters (opcionais):

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `category` | string | Filtrar por categoria | `?category=Chocolates` |
| `featured` | boolean | Apenas produtos em destaque | `?featured=true` |
| `active` | boolean | Apenas produtos ativos | `?active=true` |
| `search` | string | Busca por nome ou descrição | `?search=chocolate` |
| `sort` | string | Ordenação | `?sort=-price` (desc) ou `?sort=name` (asc) |
| `page` | number | Página (paginação) | `?page=2` |
| `limit` | number | Itens por página | `?limit=20` |

### Exemplos:

```bash
# Listar todos os produtos
curl http://localhost:3000/api/products

# Produtos da categoria Chocolates
curl http://localhost:3000/api/products?category=Chocolates

# Produtos em destaque
curl http://localhost:3000/api/products?featured=true

# Buscar produtos
curl http://localhost:3000/api/products?search=trufa

# Ordenar por preço (mais caro primeiro)
curl http://localhost:3000/api/products?sort=-price

# Paginação (página 2, 10 itens)
curl http://localhost:3000/api/products?page=2&limit=10
```

### Resposta de sucesso (200):

```json
{
  "products": [
    {
      "_id": "65abc123def456789",
      "id": "prod-1234567890-abc123",
      "name": "Chocolate ao Leite Premium 500g",
      "category": "Chocolates",
      "subcategory": "Chocolate ao Leite",
      "price": 45.90,
      "oldPrice": 55.90,
      "description": "Chocolate ao leite cremoso...",
      "image": "url-da-imagem.jpg",
      "featured": true,
      "stock": 50,
      "active": true,
      "discount": 18,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 150,
    "pages": 2
  }
}
```

---

## 🔍 Buscar produto por ID

**GET** `/api/products/:id`

### Parâmetros:

- `id` - ID do produto (pode ser o ID customizado ou MongoDB _id)

### Exemplos:

```bash
# Por ID customizado
curl http://localhost:3000/api/products/prod-1234567890-abc123

# Por MongoDB _id
curl http://localhost:3000/api/products/65abc123def456789
```

### Resposta de sucesso (200):

```json
{
  "_id": "65abc123def456789",
  "id": "prod-1234567890-abc123",
  "name": "Chocolate ao Leite Premium 500g",
  "category": "Chocolates",
  "subcategory": "Chocolate ao Leite",
  "price": 45.90,
  "oldPrice": 55.90,
  "description": "Chocolate ao leite cremoso...",
  "image": "url-da-imagem.jpg",
  "featured": true,
  "stock": 50,
  "active": true,
  "discount": 18,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Resposta de erro (404):

```json
{
  "error": "Produto não encontrado"
}
```

---

## ➕ Criar novo produto

**POST** `/api/products`

### Headers:

```
Content-Type: application/json
```

### Body (JSON):

```json
{
  "name": "Trufas Gourmet Sortidas 300g",
  "category": "Chocolates",
  "subcategory": "Trufas",
  "price": 42.90,
  "oldPrice": 52.90,
  "description": "Deliciosas trufas artesanais com diversos recheios",
  "image": "https://exemplo.com/imagem.jpg",
  "featured": true,
  "stock": 100,
  "active": true
}
```

### Campos obrigatórios:

- ✅ `name` (string) - Nome do produto
- ✅ `category` (string) - Categoria
- ✅ `price` (number) - Preço

### Campos opcionais:

- `id` (string) - ID customizado (gerado automaticamente se omitido)
- `subcategory` (string)
- `oldPrice` (number) - Preço anterior (para desconto)
- `description` (string)
- `image` (string) - URL da imagem
- `featured` (boolean) - Produto em destaque
- `stock` (number) - Quantidade em estoque
- `active` (boolean) - Produto ativo

### Exemplo:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trufas Gourmet Sortidas 300g",
    "category": "Chocolates",
    "price": 42.90,
    "oldPrice": 52.90,
    "featured": true,
    "stock": 100
  }'
```

### Resposta de sucesso (201):

```json
{
  "_id": "65abc456def789012",
  "id": "prod-1705320000-xyz789",
  "name": "Trufas Gourmet Sortidas 300g",
  "category": "Chocolates",
  "price": 42.90,
  "oldPrice": 52.90,
  "featured": true,
  "stock": 100,
  "active": true,
  "discount": 19,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### Resposta de erro (400):

```json
{
  "error": "Dados incompletos. Nome, categoria e preço são obrigatórios."
}
```

ou

```json
{
  "error": "Erro de validação",
  "details": [
    "Preço não pode ser negativo",
    "Nome do produto é obrigatório"
  ]
}
```

---

## ✏️ Atualizar produto

**PUT** `/api/products/:id`

### Headers:

```
Content-Type: application/json
```

### Body (JSON):

Envie apenas os campos que deseja atualizar:

```json
{
  "price": 39.90,
  "stock": 75,
  "featured": false
}
```

### Exemplo:

```bash
curl -X PUT http://localhost:3000/api/products/prod-1234567890-abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 39.90,
    "stock": 75
  }'
```

### Resposta de sucesso (200):

```json
{
  "_id": "65abc123def456789",
  "id": "prod-1234567890-abc123",
  "name": "Chocolate ao Leite Premium 500g",
  "category": "Chocolates",
  "price": 39.90,
  "stock": 75,
  "featured": false,
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### Resposta de erro (404):

```json
{
  "error": "Produto não encontrado"
}
```

---

## 🗑️ Excluir produto

**DELETE** `/api/products/:id`

### Exemplo:

```bash
curl -X DELETE http://localhost:3000/api/products/prod-1234567890-abc123
```

### Resposta de sucesso (200):

```json
{
  "message": "Produto excluído com sucesso",
  "product": {
    "_id": "65abc123def456789",
    "id": "prod-1234567890-abc123",
    "name": "Chocolate ao Leite Premium 500g"
  }
}
```

### Resposta de erro (404):

```json
{
  "error": "Produto não encontrado"
}
```

---

## 🔄 Ativar/Desativar produto (Soft Delete)

**PATCH** `/api/products/:id/toggle-active`

Alterna o status do produto entre ativo e inativo sem deletá-lo.

### Exemplo:

```bash
curl -X PATCH http://localhost:3000/api/products/prod-1234567890-abc123/toggle-active
```

### Resposta de sucesso (200):

```json
{
  "_id": "65abc123def456789",
  "id": "prod-1234567890-abc123",
  "name": "Chocolate ao Leite Premium 500g",
  "active": false,
  "updatedAt": "2024-01-15T13:00:00.000Z"
}
```

---

## ❌ Códigos de erro

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Requisição inválida / Dados incompletos |
| `404` | Produto não encontrado |
| `409` | Conflito (ID duplicado) |
| `500` | Erro interno do servidor |
| `503` | Banco de dados não disponível |

---

## 📊 Estrutura do Produto (Schema)

```javascript
{
  _id: ObjectId,              // ID do MongoDB (gerado automaticamente)
  id: String,                 // ID customizado (gerado se não fornecido)
  name: String,               // Nome do produto (obrigatório)
  category: String,           // Categoria (obrigatório)
  subcategory: String,        // Subcategoria (opcional)
  price: Number,              // Preço atual (obrigatório, >= 0)
  oldPrice: Number,           // Preço anterior (opcional, >= 0)
  description: String,        // Descrição (opcional)
  image: String,              // URL da imagem (opcional)
  featured: Boolean,          // Produto em destaque (padrão: false)
  stock: Number,              // Quantidade em estoque (padrão: 0, >= 0)
  active: Boolean,            // Produto ativo (padrão: true)
  discount: Number,           // % de desconto (calculado automaticamente)
  createdAt: Date,            // Data de criação (automático)
  updatedAt: Date             // Data de atualização (automático)
}
```

---

## 🧪 Testando com JavaScript (Frontend)

### Listar produtos:

```javascript
async function getProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    console.log(data.products);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

### Criar produto:

```javascript
async function createProduct() {
  try {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Novo Produto',
        category: 'Teste',
        price: 29.90
      })
    });
    const product = await response.json();
    console.log('Produto criado:', product);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

### Atualizar produto:

```javascript
async function updateProduct(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price: 39.90
      })
    });
    const product = await response.json();
    console.log('Produto atualizado:', product);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

### Deletar produto:

```javascript
async function deleteProduct(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## 📝 Notas Importantes

1. **Persistência:** Todos os dados são armazenados no MongoDB Atlas e persistem entre deploys
2. **Validação:** O servidor valida todos os dados antes de salvar
3. **IDs:** Você pode usar tanto o ID customizado quanto o _id do MongoDB
4. **Timestamps:** `createdAt` e `updatedAt` são gerenciados automaticamente
5. **Desconto:** O campo `discount` é calculado automaticamente baseado em `price` e `oldPrice`
6. **Soft Delete:** Use `toggle-active` para desativar sem deletar permanentemente

---

**Última atualização:** Fevereiro 2026
