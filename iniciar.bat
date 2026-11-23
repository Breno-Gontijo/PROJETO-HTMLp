@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo          AGENDAFACIL - ETAPA 07
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo ERRO: Node.js nao foi encontrado.
    echo Instale o Node.js 22.5 ou superior em https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1" %%v in ('node -p "process.versions.node"') do set NODE_VERSION=%%v
echo Node.js encontrado: %NODE_VERSION%

node -e "require('node:sqlite').DatabaseSync" >nul 2>nul
if errorlevel 1 (
    echo.
    echo ERRO: Esta versao do Node.js nao possui o modulo SQLite necessario.
    echo Instale o Node.js 22.5 ou superior e tente novamente.
    pause
    exit /b 1
)

echo Banco SQLite integrado ao Node.js disponivel.
echo Iniciando o servidor...
start "AgendaFacil - Servidor" /D "%~dp0" cmd /k "node server.js"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$limite=(Get-Date).AddSeconds(30); do { Start-Sleep -Milliseconds 500; try { $r=Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/api/tarefas -TimeoutSec 2; if ($r.StatusCode -eq 200) { Start-Process 'http://127.0.0.1:3000'; exit 0 } } catch {} } while ((Get-Date) -lt $limite); exit 1"
if errorlevel 1 (
    echo.
    echo Nao foi possivel iniciar o servidor na porta 3000.
    echo Confira a mensagem na janela do servidor.
    pause
    exit /b 1
)

echo.
echo AgendaFacil aberto no navegador.
echo Mantenha a janela do servidor aberta enquanto estiver usando o sistema.
pause
