@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo          AGENDAFACIL - ETAPA 06
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo ERRO: Node.js nao foi encontrado.
    echo Instale a versao LTS em https://nodejs.org/
    echo Depois feche e abra esta janela novamente.
    pause
    exit /b 1
)

start "AgendaFacil - Servidor" /D "%~dp0" cmd /k "node server.js"

echo Iniciando o servidor...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$limite=(Get-Date).AddSeconds(15); do { Start-Sleep -Milliseconds 500; try { $r=Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/api/tarefas -TimeoutSec 1; if ($r.StatusCode -eq 200) { Start-Process 'http://127.0.0.1:3000'; exit 0 } } catch {} } while ((Get-Date) -lt $limite); exit 1"
if errorlevel 1 (
    echo.
    echo Nao foi possivel iniciar o servidor na porta 3000.
    echo Verifique se a porta ja esta sendo usada.
    pause
    exit /b 1
)
echo.
echo AgendaFacil aberto no navegador.
echo Mantenha a janela do servidor aberta enquanto estiver usando o sistema.
pause
