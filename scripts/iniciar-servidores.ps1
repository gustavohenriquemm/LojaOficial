# ================================================
# SCRIPT PARA INICIAR SERVIDORES SEM JANELAS EXTRAS
# ================================================

Write-Host "`nIniciando servidores..." -ForegroundColor Cyan

# Parar processos existentes
Write-Host "Limpando processos antigos..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node" -or $_.ProcessName -eq "http-server"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Iniciar Backend em background (sem janela)
Write-Host "Iniciando Backend (porta 3000)..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $backendPath -WindowStyle Hidden
Start-Sleep -Seconds 3

# Iniciar Frontend em background (sem janela)
Write-Host "Iniciando Frontend (porta 5500)..." -ForegroundColor Yellow
Start-Process -FilePath "http-server" -ArgumentList "-p", "5500", "-c-1", "--cors" -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
Start-Sleep -Seconds 3

# Verificar se servidores iniciaram
Write-Host "`nVerificando servidores..." -ForegroundColor Cyan
$frontend = Test-NetConnection -ComputerName 127.0.0.1 -Port 5500 -WarningAction SilentlyContinue
$backend = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue

Write-Host ""

if($frontend.TcpTestSucceeded) {
    Write-Host "FRONTEND: ONLINE" -ForegroundColor Green
} else {
    Write-Host "FRONTEND: OFFLINE" -ForegroundColor Red
}

if($backend.TcpTestSucceeded) {
    Write-Host "BACKEND: ONLINE" -ForegroundColor Green
} else {
    Write-Host "BACKEND: OFFLINE" -ForegroundColor Red
}

Write-Host ""

if($frontend.TcpTestSucceeded -and $backend.TcpTestSucceeded) {
    Write-Host "Tudo pronto! Servidores rodando em background.`n" -ForegroundColor Green
    
    Write-Host "ACESSE:" -ForegroundColor Cyan
    Write-Host "  http://127.0.0.1:5500/index.html" -ForegroundColor White
    Write-Host "  http://127.0.0.1:5500/produtos.html" -ForegroundColor White
    Write-Host "  http://127.0.0.1:5500/checkout.html" -ForegroundColor White
    Write-Host "  http://127.0.0.1:5500/admin.html`n" -ForegroundColor White
    
    Write-Host "MODO PRODUCAO ATIVO - Pagamentos reais!`n" -ForegroundColor Yellow
    
    Write-Host "Para parar os servidores:" -ForegroundColor Cyan
    Write-Host "  .\parar-servidores.ps1`n" -ForegroundColor White
    
} else {
    Write-Host "Erro ao iniciar servidores.`n" -ForegroundColor Red
}

