# 🎁 Presentes Especiais - Loja Virtual

Site completo de loja virtual de presentes com painel administrativo e **integração completa com Mercado Pago para pagamentos online**.

## 🆕 NOVO: Sistema de Pagamento Mercado Pago 💳

### Pagamento 100% Online e Integrado

O site agora possui um sistema completo de pagamento com Mercado Pago Checkout Pro:

✅ **PIX** - Pagamento instantâneo  
✅ **Cartão de Crédito** - Parcelamento disponível  
✅ **Cartão de Débito** - Débito em conta  
✅ **Backend Seguro** - Node.js com Express  
✅ **Webhooks Automáticos** - Notificações em tempo real  
✅ **Sem Redirecionamento** - Checkout integrado no site  

### 🚀 Início Rápido - Pagamento

**Veja o guia completo:** [INICIO_RAPIDO.md](INICIO_RAPIDO.md)

1. **Instalar backend:**
```bash
cd backend
npm install
```

2. **Configurar credenciais** no arquivo `backend\.env`

3. **Iniciar servidor:**
```bash
npm start
```

4. **Abrir frontend** em um servidor local

**📖 Documentação Completa:** [GUIA_COMPLETO_MERCADOPAGO.md](GUIA_COMPLETO_MERCADOPAGO.md)

---

## 🆕 Estrutura de Categorias

### Mudanças Implementadas

O site foi reorganizado com uma nova estrutura de categorias profissional:

**Categorias Principais:**
- 🌸 **Cosmético Feminino** - Produtos de beleza para ela
- 👔 **Cosmético Masculino** - Produtos de cuidados para ele

**Subcategorias (em ambas as categorias):**
- Perfumes
- Cremes
- Sabonetes
- Body Splash
- Esfoliantes
- Outros Cuidados

### Como Funciona

#### Para Visitantes:
1. Acesse a página inicial (`index.html`)
2. Clique em **Cosmético Feminino** ou **Cosmético Masculino** no menu
3. Use os filtros de subcategoria para navegar pelos produtos
4. Clique em qualquer produto para ver detalhes completos
5. Adicione ao carrinho e finalize a compra normalmente

#### Para Administradores:
1. Acesse o painel admin (`admin.html`)
2. Login: `admin` / Senha: `admin123`
3. Ao adicionar/editar produtos:
   - Selecione a **Categoria Principal** (Cosmético Feminino ou Masculino)
   - Depois selecione a **Subcategoria** (Perfumes, Cremes, etc.)
   - Preencha os demais campos normalmente
4. Os produtos aparecerão automaticamente nas páginas corretas

### ⚠️ IMPORTANTE: Migração de Produtos Antigos

Os produtos antigos foram **substituídos** por novos produtos de exemplo seguindo a nova estrutura. Se você tinha produtos cadastrados anteriormente:

1. Eles foram salvos mas não aparecem mais no site
2. Para restaurá-los, você precisará:
   - Acessar o admin
   - Recadastrar cada produto
   - Selecionar a nova categoria e subcategoria apropriadas

### Arquivos Atualizados

**Novos Arquivos:**
- `cosmetico-feminino.html` - Página de produtos femininos com filtros
- `cosmetico-masculino.html` - Página de produtos masculinos com filtros

**Arquivos Modificados:**
- `script.js` - Novos produtos com categoria e subcategoria
- `admin.html` - Formulário com seleção de categoria e subcategoria
- `admin-script.js` - Lógica para categorias e subcategorias dinâmicas
- `styles.css` - Estilos para filtros e mensagens
- `index.html` - Menu e categorias atualizados
- `produto.html` - Menu atualizado
- `ofertas.html` - Menu atualizado
- `contato.html` - Menu atualizado

**Arquivos Não Utilizados (podem ser removidos):**
- `produtos.html` - Substituído pelas páginas de categoria
- `categorias.html` - Substituído pelas páginas de categoria

## 📋 Funcionalidades Mantidas

### ✨ Site Público

#### Página Inicial (`index.html`)
- Hero section com chamada para ação
- Categorias de produtos em destaque
- Produtos em destaque (primeiros 6)
- Banners promocionais
- Footer completo com informações

#### Página de Produtos (`produtos.html`)
- Catálogo completo de produtos
- Filtros por categoria (Perfumes, Tupperware, Chocolates, Kits)
- Cards de produtos clicáveis
- Botão de adicionar ao carrinho

#### Página Individual do Produto (`produto.html`)
- Imagem em destaque do produto
- Informações detalhadas (nome, categoria, preço, descrição)
- Seletor de quantidade
- Botão de adicionar ao carrinho
- Produtos relacionados da mesma categoria
- Características do produto (qualidade, entrega, embalagem)

#### Página de Categorias (`categorias.html`)
- Detalhamento de cada categoria
- Descrições completas
- Links para produtos de cada categoria

#### Página de Ofertas (`ofertas.html`)
- Produtos com desconto em destaque
- Badge de porcentagem de desconto
- Banner promocional

#### Página de Contato (`contato.html`)
- Formulário de contato completo
- Informações da loja (email, telefone, endereço)
- Horário de atendimento

#### Carrinho de Compras
- Modal lateral com produtos adicionados
- Controle de quantidade (+/-)
- Remoção de produtos
- Cálculo de total em tempo real
- Persistência em localStorage

#### Checkout (`checkout.html`)
- **Etapa 1:** Revisão do carrinho
  - Lista completa de produtos
  - Quantidades e preços
  - Opção de remover itens
  - Total do pedido

- **Etapa 2:** Dados Pessoais
  - Nome completo
  - Telefone/WhatsApp
  - E-mail (opcional)

- **Etapa 3:** Endereço de Entrega
  - Rua e número
  - Bairro e cidade
  - Complemento (opcional)

- **Etapa 4:** Confirmação
  - Resumo completo dos dados
  - Lista de produtos
  - Valor total
  - Botão de finalização

#### Integração com WhatsApp
- Geração automática de mensagem formatada
- Inclui todos os dados do pedido:
  - Informações do cliente
  - Endereço de entrega
  - Lista de produtos com quantidades e preços
  - Valor total
- Redirecionamento automático para WhatsApp Web/App
- Número configurável no código

### 🔐 Painel Administrativo (`admin.html`)

#### Sistema de Login
- **Usuário:** `admin`
- **Senha:** `admin123`
- Proteção de acesso ao painel
- Persistência de sessão

#### Dashboard
- Total de produtos cadastrados
- Pedidos do mês atual
- Faturamento mensal
- Lista de pedidos recentes

#### Gerenciamento de Produtos
- **Adicionar** novos produtos
- **Editar** produtos existentes
- **Excluir** produtos
- Campos:
  - Nome do produto
  - Categoria (Perfumes, Tupperware, Chocolates, Kits)
  - Preço atual
  - Preço anterior (para promoções)
  - Descrição
  - URL da imagem
- Listagem em tabela com busca visual
- Sincronização automática com o site público

#### Controle de Vendas
- Filtro por período (mês atual, mês anterior, todo período)
- **Estatísticas:**
  - Total de vendas em R$
  - Quantidade de pedidos
  - Ticket médio
- Tabela detalhada de vendas com:
  - Data do pedido
  - Nome do cliente
  - Quantidade de produtos
  - Valor total

#### Visualização de Pedidos
- Cards com informações completas:
  - Dados do cliente
  - Endereço de entrega
  - Lista de produtos
  - Valor total
- Organização por data (mais recentes primeiro)

## 🎨 Design e Estilo

### Paleta de Cores
- **Principal:** Rosa pastel `#ffbdbd`
- **Fundo:** Branco `#ffffff`
- **Secundário:** Tons neutros suaves
- **Texto:** Cinza escuro para contraste

### Tipografia
- **Fonte:** Poppins (Google Fonts)
- Hierarquia clara entre títulos e textos
- Tamanhos responsivos

### Layout
- Design clean e minimalista
- Espaçamento generoso (espaços em branco)
- Cards com bordas arredondadas
- Sombras suaves
- Animações discretas em hover

### Responsividade
- **Mobile-first:** Otimizado para celulares
- **Tablet:** Layout adaptado
- **Desktop:** Experiência completa
- Menu hamburger em mobile
- Grid responsivo em todas as páginas

## 📂 Estrutura de Arquivos

```
├── index.html              # Página inicial
├── produtos.html           # Catálogo de produtos
├── produto.html            # Detalhes do produto
├── categorias.html         # Página de categorias
├── ofertas.html            # Produtos em promoção
├── contato.html            # Formulário de contato
├── checkout.html           # Finalização de compra
├── admin.html              # Painel administrativo
├── styles.css              # Estilos principais
├── admin-styles.css        # Estilos do admin
├── checkout-styles.css     # Estilos do checkout
├── script.js               # JavaScript principal
├── produto-detail.js       # Script da página de produto
├── checkout-script.js      # Script do checkout
├── admin-script.js         # Script do admin
└── README.md               # Documentação
```

## 🚀 Como Usar

### Para Clientes

1. **Navegação:**
   - Acesse `index.html` no navegador
   - Explore produtos por categorias ou pela página de produtos
   - Clique em qualquer produto para ver detalhes

2. **Compra:**
   - Adicione produtos ao carrinho
   - Clique no ícone do carrinho para revisar
   - Clique em "Finalizar Compra"
   - Preencha seus dados pessoais
   - Informe o endereço de entrega
   - Revise e confirme o pedido
   - Será redirecionado para WhatsApp com mensagem pronta

### Para Administradores

1. **Acesso:**
   - Acesse `admin.html`
   - Usuário: `admin`
   - Senha: `admin123`

2. **Gerenciar Produtos:**
   - Clique em "Produtos" no menu
   - Use "Novo Produto" para adicionar
   - Preencha todos os campos obrigatórios
   - Cole URL de imagem (opcional)
   - Edite ou exclua produtos conforme necessário

3. **Visualizar Vendas:**
   - Acesse "Vendas" no menu
   - Selecione o período desejado
   - Visualize estatísticas e detalhes

4. **Verificar Pedidos:**
   - Clique em "Pedidos" no menu
   - Veja todos os pedidos realizados
   - Dados completos de cada cliente

## ⚙️ Configurações

### Alterar Número do WhatsApp

No arquivo `checkout-script.js`, localize a linha:

```javascript
const whatsappNumber = '5511987654321';
```

Substitua pelo seu número no formato: **código do país + DDD + número**

Exemplo para Brasil:
- `5511987654321` (Brasil, SP, WhatsApp)
- `5521987654321` (Brasil, RJ, WhatsApp)

### Alterar Credenciais do Admin

No arquivo `admin-script.js`, localize:

```javascript
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};
```

Altere para suas credenciais desejadas.

## 💾 Armazenamento de Dados

Todos os dados são armazenados no **localStorage** do navegador:

- **`products`**: Lista de produtos cadastrados
- **`cart`**: Produtos no carrinho
- **`orders`**: Pedidos finalizados
- **`adminLoggedIn`**: Estado de login do admin

**Nota:** Os dados são salvos localmente no navegador. Para uso em produção, considere implementar um backend com banco de dados.

## 🔄 Sincronização

- Produtos adicionados/editados no admin aparecem automaticamente no site
- Carrinho sincroniza entre páginas
- Pedidos são salvos e aparecem no dashboard do admin

## 📱 Compatibilidade

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile (iOS/Android)

## 🎯 Recursos Adicionais

- **SEO Friendly:** Meta tags em todas as páginas
- **Acessibilidade:** Estrutura semântica HTML5
- **Performance:** CSS e JS otimizados
- **UX:** Animações suaves e feedback visual
- **Validação:** Formulários com validação HTML5

## 📝 Observações

- Site totalmente funcional sem necessidade de servidor
- Ideal para pequenos negócios e empreendedores
- Fácil personalização de cores e textos
- Adicione imagens reais dos produtos via URL
- WhatsApp permite negociação direta com cliente

## 🛠️ Melhorias Futuras Sugeridas

- Integração com gateway de pagamento
- Sistema de cupons de desconto
- Cálculo de frete automático
- Galeria de imagens nos produtos
- Sistema de avaliações
- Newsletter
- Chat ao vivo
- Backend com banco de dados

---

**Desenvolvido com ❤️ para Presentes Especiais**

*Site pronto para uso! Boas vendas! 🎉*
