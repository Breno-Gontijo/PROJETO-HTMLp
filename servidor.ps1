param(
    [int]$Porta = 8765
)

$ErrorActionPreference = 'Stop'
$raiz = [System.IO.Path]::GetFullPath($PSScriptRoot)
$prefixoRaiz = $raiz.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Porta)

try {
    $listener.Start()
    Write-Host "AgendaFacil disponivel em http://127.0.0.1:$Porta/index.html" -ForegroundColor Green
    Write-Host 'Mantenha esta janela aberta enquanto estiver usando o projeto.'
    Write-Host 'Pressione Ctrl+C para encerrar.'

    while ($true) {
        $cliente = $listener.AcceptTcpClient()
        try {
            $fluxo = $cliente.GetStream()
            $leitor = [System.IO.StreamReader]::new($fluxo, [System.Text.Encoding]::ASCII, $false, 1024, $true)
            $linhaPedido = $leitor.ReadLine()

            while ($null -ne ($linha = $leitor.ReadLine()) -and $linha -ne '') { }

            if ([string]::IsNullOrWhiteSpace($linhaPedido)) {
                $cliente.Close()
                continue
            }

            $partes = $linhaPedido.Split(' ')
            $metodo = $partes[0]
            $caminhoUrl = $partes[1].Split('?')[0]
            $caminhoUrl = [System.Uri]::UnescapeDataString($caminhoUrl)

            if ($caminhoUrl -eq '/') {
                $caminhoUrl = '/index.html'
            }

            $relativo = $caminhoUrl.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $arquivo = [System.IO.Path]::GetFullPath((Join-Path $raiz $relativo))

            if (-not $arquivo.StartsWith($prefixoRaiz, [System.StringComparison]::OrdinalIgnoreCase) -and $arquivo -ne (Join-Path $raiz 'index.html')) {
                $status = '403 Forbidden'
                $conteudo = [System.Text.Encoding]::UTF8.GetBytes('Acesso negado.')
                $tipo = 'text/plain; charset=utf-8'
            }
            elseif (-not (Test-Path -LiteralPath $arquivo -PathType Leaf)) {
                $status = '404 Not Found'
                $conteudo = [System.Text.Encoding]::UTF8.GetBytes('Arquivo nao encontrado.')
                $tipo = 'text/plain; charset=utf-8'
            }
            elseif ($metodo -ne 'GET' -and $metodo -ne 'HEAD') {
                $status = '405 Method Not Allowed'
                $conteudo = [System.Text.Encoding]::UTF8.GetBytes('Metodo nao permitido.')
                $tipo = 'text/plain; charset=utf-8'
            }
            else {
                $status = '200 OK'
                $conteudo = [System.IO.File]::ReadAllBytes($arquivo)
                $extensao = [System.IO.Path]::GetExtension($arquivo).ToLowerInvariant()
                $tipos = @{
                    '.html' = 'text/html; charset=utf-8'
                    '.js'   = 'text/javascript; charset=utf-8'
                    '.css'  = 'text/css; charset=utf-8'
                    '.json' = 'application/json; charset=utf-8'
                    '.txt'  = 'text/plain; charset=utf-8'
                    '.md'   = 'text/plain; charset=utf-8'
                    '.jpg'  = 'image/jpeg'
                    '.jpeg' = 'image/jpeg'
                    '.png'  = 'image/png'
                    '.svg'  = 'image/svg+xml'
                    '.ico'  = 'image/x-icon'
                }
                $tipo = $tipos[$extensao]
                if (-not $tipo) { $tipo = 'application/octet-stream' }
            }

            $cabecalho = "HTTP/1.1 $status`r`nContent-Type: $tipo`r`nContent-Length: $($conteudo.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
            $bytesCabecalho = [System.Text.Encoding]::ASCII.GetBytes($cabecalho)
            $fluxo.Write($bytesCabecalho, 0, $bytesCabecalho.Length)
            if ($metodo -ne 'HEAD') {
                $fluxo.Write($conteudo, 0, $conteudo.Length)
            }
            $fluxo.Flush()
            $leitor.Dispose()
        }
        catch {
            Write-Host "Falha ao atender requisicao: $($_.Exception.Message)" -ForegroundColor Yellow
        }
        finally {
            $cliente.Close()
        }
    }
}
catch {
    Write-Host "Nao foi possivel iniciar o servidor: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Talvez a porta $Porta ja esteja em uso. Feche outro servidor local e tente novamente."
    Read-Host 'Pressione Enter para fechar'
}
finally {
    if ($listener) { $listener.Stop() }
}
