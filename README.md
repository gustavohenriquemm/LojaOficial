# Loja Oficial - E-commerce com Mercado Pago

Sistema completo de e-commerce com integração ao Mercado Pago para processamento de pagamentos.

## 📁 Estrutura do Projeto

```
LojaOficial/
├── frontend/           # Interface do usuário
│   ├── pages/         # Páginas HTML
│   ├── css/           # Estilos CSS
│   └── js/            # Scripts JavaScript
├── backend/           # Servidor Node.js
│   ├── config/        # Configurações
│   ├── data/          # Dados (pedidos)
│   └── routes/        # Rotas da API
├── docs/              # Documentação
├── scripts/           # Scripts PowerShell
└── index.html         # Página principal
```

## 🚀 Como Iniciar

### Backend
```bash
cd backend
npm install
npm start
```

O servidor iniciará em: `http://localhost:3000`

### Frontend
Abra o arquivo `index.html` em um navegador ou use um servidor local.

## 📚 Documentação

Toda a documentação está disponível na pasta `/docs`:
- Guias de uso
- Exemplos de API
- Fluxo de pagamento
- Segurança

## 🔧 Scripts Disponíveis

Na pasta `/scripts`:
- `iniciar-servidores.ps1` - Inicia todos os servidores
- `parar-servidores.ps1` - Para todos os servidores
- `setup.ps1` - Configuração inicial

## 💳 Integração Mercado Pago

Este projeto utiliza o Mercado Pago para processamento de pagamentos. Configure suas credenciais em `backend/config/mercadopago.js`.

## 📄 Licença

MIT
