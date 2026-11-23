@echo off
setlocal
cd /d "%~dp0"

set "PORTA=8765"

where powershell.exe >nul 2>nul
if errorlevel 1 (
    echo O Windows PowerShell nao foi encontrado.
    echo Abra a pasta pelo VS Code e use a extensao Live Server.
    pause
    exit /b 1
)

start "AgendaFacil - Servidor" powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1" -Porta %PORTA%

echo Iniciando o AgendaFacil...
powershell.exe -NoLogo -NoProfile -Command "$fim=(Get-Date).AddSeconds(15); do { try { $cliente=[System.Net.Sockets.TcpClient]::new(); $cliente.Connect('127.0.0.1',%PORTA%); $cliente.Close(); exit 0 } catch { Start-Sleep -Milliseconds 300 } } while ((Get-Date) -lt $fim); exit 1"
if errorlevel 1 (
    echo.
    echo Nao foi possivel iniciar o servidor na porta %PORTA%.
    echo Verifique a janela 'AgendaFacil - Servidor' para ver o erro.
    pause
    exit /b 1
)

start "" "http://127.0.0.1:%PORTA%/index.html"
echo.
echo O AgendaFacil esta aberto no navegador.
echo Para encerrar, feche a janela do servidor.
exit /b 0
