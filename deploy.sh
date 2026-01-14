#!/bin/bash

# ==================================
# SCRIPT DE DEPLOY RÁPIDO - RENDER
# ==================================

echo "🚀 Preparando projeto para deploy no Render..."

# 1. Verificar se está em um repositório Git
if [ ! -d ".git" ]; then
    echo "📦 Inicializando Git..."
    git init
fi

# 2. Adicionar todos os arquivos
echo "📝 Adicionando arquivos..."
git add .

# 3. Fazer commit
echo "💾 Fazendo commit..."
git commit -m "Deploy para Render - $(date +%Y-%m-%d_%H:%M:%S)"

# 4. Verificar se remote existe
if ! git remote | grep -q "origin"; then
    echo "❓ Configure o remote do GitHub:"
    echo "   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git"
    exit 1
fi

# 5. Push para GitHub
echo "⬆️ Enviando para GitHub..."
git push origin main

echo ""
echo "✅ Projeto pronto para deploy!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse: https://dashboard.render.com/"
echo "2. Clique em 'New' → 'Blueprint'"
echo "3. Conecte seu repositório GitHub"
echo "4. Configure as variáveis de ambiente:"
echo "   - MERCADOPAGO_ACCESS_TOKEN"
echo "   - MERCADOPAGO_PUBLIC_KEY"
echo "5. Clique em 'Apply'"
echo ""
echo "🔗 Após deploy, atualize a URL em:"
echo "   frontend/js/config.js"
echo ""
