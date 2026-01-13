# ================================================
# INICIAR AMBOS SERVIDORES NO MESMO TERMINAL
# ================================================

Write-Host "`nIniciando servidores em background..." -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

# Parar processos anteriores
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Iniciar Backend
Write-Host "Iniciando Backend (porta 3000)..." -ForegroundColor Yellow
$backendPath = "c:\Users\gusta\.vscode\LojaOficial\backend"
$backendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    node server.js
} -ArgumentList $backendPath

Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "Iniciando Frontend (porta 5500)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "c:\Users\gusta\.vscode\LojaOficial"
    http-server -p 5500 -c-1 --cors
}

Start-Sleep -Seconds 3

# Verificar
Write-Host "`nVerificando..." -ForegroundColor Cyan
$f = Test-NetConnection -ComputerName 127.0.0.1 -Port 5500 -WarningAction SilentlyContinue
$b = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue

Write-Host ""
if($f.TcpTestSucceeded) {
    Write-Host "FRONTEND: ONLINE" -ForegroundColor Green
} else {
    Write-Host "FRONTEND: OFFLINE" -ForegroundColor Red
}

if($b.TcpTestSucceeded) {
    Write-Host "BACKEND: ONLINE" -ForegroundColor Green
} else {
    Write-Host "BACKEND: OFFLINE" -ForegroundColor Red
}

if($f.TcpTestSucceeded -and $b.TcpTestSucceeded) {
    Write-Host "`nSucesso! Servidores rodando." -ForegroundColor Green
    Write-Host "`nACESSE:" -ForegroundColor Cyan
    Write-Host "  http://127.0.0.1:5500/index.html" -ForegroundColor White
    Write-Host "  http://127.0.0.1:5500/checkout.html" -ForegroundColor White
    Write-Host "`nPara parar: .\parar-servidores.ps1`n" -ForegroundColor Yellow
} else {
    Write-Host "`nFalha ao iniciar. Tentando de outra forma...`n" -ForegroundColor Red
    
    # Parar jobs
    Stop-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    
    # Iniciar com Start-Process
    Write-Host "Iniciando com janelas minimizadas..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node server.js" -WindowStyle Minimized
    Start-Sleep -Seconds 2
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "http-server -p 5500 -c-1 --cors" -WindowStyle Minimized
    Start-Sleep -Seconds 3
    
    Write-Host "Pronto! 2 janelas minimizadas foram abertas.`n" -ForegroundColor Green
}
