# ================================================
# SCRIPT PARA PARAR SERVIDORES
# ================================================

Write-Host "`n🛑 Parando servidores..." -ForegroundColor Yellow

# Parar Node.js (Backend)
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✅ Backend parado" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Backend já estava parado" -ForegroundColor Cyan
}

# Parar http-server (Frontend)
$httpProcesses = Get-Process | Where-Object {$_.ProcessName -like "*http-server*" -or $_.CommandLine -like "*http-server*"}
if ($httpProcesses) {
    $httpProcesses | Stop-Process -Force
    Write-Host "✅ Frontend parado" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Frontend já estava parado" -ForegroundColor Cyan
}

Write-Host "`n✅ Servidores parados com sucesso!`n" -ForegroundColor Green

# Manter terminal aberto
Read-Host "Pressione ENTER para fechar"
