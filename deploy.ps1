# ==================================
# SCRIPT DE DEPLOY RÁPIDO - RENDER (Windows)
# ==================================

Write-Host "🚀 Preparando projeto para deploy no Render..." -ForegroundColor Green

# 1. Verificar se está em um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "📦 Inicializando Git..." -ForegroundColor Yellow
    git init
}

# 2. Adicionar todos os arquivos
Write-Host "📝 Adicionando arquivos..." -ForegroundColor Cyan
git add .

# 3. Fazer commit
$commitMsg = "Deploy para Render - $(Get-Date -Format 'yyyy-MM-dd_HH:mm:ss')"
Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m $commitMsg

# 4. Verificar se remote existe
$remoteExists = git remote | Select-String "origin"
if (-not $remoteExists) {
    Write-Host ""
    Write-Host "❓ Configure o remote do GitHub:" -ForegroundColor Red
    Write-Host "   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# 5. Push para GitHub
Write-Host "⬆️ Enviando para GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "✅ Projeto pronto para deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Acesse: https://dashboard.render.com/"
Write-Host "2. Clique em 'New' → 'Blueprint'"
Write-Host "3. Conecte seu repositório GitHub"
Write-Host "4. Configure as variáveis de ambiente:"
Write-Host "   - MERCADOPAGO_ACCESS_TOKEN"
Write-Host "   - MERCADOPAGO_PUBLIC_KEY"
Write-Host "5. Clique em 'Apply'"
Write-Host ""
Write-Host "🔗 Após deploy, atualize a URL em:" -ForegroundColor Cyan
Write-Host "   frontend/js/config.js"
Write-Host ""
Write-Host "📱 Suas URLs serão algo como:" -ForegroundColor Magenta
Write-Host "   Frontend: https://loja-oficial-frontend.onrender.com"
Write-Host "   Backend:  https://loja-oficial-backend.onrender.com"
Write-Host ""
