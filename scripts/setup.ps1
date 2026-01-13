# ========================================
# SCRIPT DE INICIALIZAÇÃO RÁPIDA
# Sistema de Pagamento Mercado Pago
# ========================================

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  SISTEMA DE PAGAMENTO MERCADO PAGO - SETUP  " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($?) {
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   Instale em: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar se npm está instalado
$npmVersion = npm --version 2>$null
if ($?) {
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  CONFIGURANDO BACKEND  " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para pasta backend
Set-Location backend

# Verificar se package.json existe
if (Test-Path "package.json") {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    npm install
    
    if ($?) {
        Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ package.json não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar se .env existe
if (Test-Path ".env") {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  Arquivo .env não encontrado" -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Write-Host "📝 Criando arquivo .env a partir do exemplo..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANTE: Configure suas credenciais no arquivo .env" -ForegroundColor Red
        Write-Host "   Caminho: backend\.env" -ForegroundColor Yellow
    } else {
        Write-Host "❌ .env.example não encontrado!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  CONFIGURAÇÃO CONCLUÍDA  " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos Passos:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Configure suas credenciais do Mercado Pago:" -ForegroundColor Yellow
Write-Host "   - Edite o arquivo: backend\.env" -ForegroundColor White
Write-Host "   - Adicione seu ACCESS_TOKEN e PUBLIC_KEY" -ForegroundColor White
Write-Host ""
Write-Host "2. Obtenha suas credenciais em:" -ForegroundColor Yellow
Write-Host "   - https://www.mercadopago.com.br/developers/panel" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Para iniciar o servidor backend:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "4. Para iniciar em modo desenvolvimento:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "5. Abra o frontend em um servidor local" -ForegroundColor Yellow
Write-Host "   (Live Server, http-server, etc.)" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentação completa em: GUIA_COMPLETO_MERCADOPAGO.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Perguntar se quer abrir o .env para edição
$response = Read-Host "Deseja abrir o arquivo .env para configuração agora? (s/n)"
if ($response -eq "s" -or $response -eq "S") {
    notepad .env
}

Write-Host ""
Write-Host "✅ Setup concluído! Boa sorte com seu sistema de pagamento! 🚀" -ForegroundColor Green
Write-Host ""

# Voltar para diretório raiz
Set-Location ..
