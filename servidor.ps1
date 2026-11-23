const http = require('http');
const fs = require('fs');
const path = require('path');
const { tratarRotasTarefas } = require('./rotas/tarefas');

const PORTA = Number(process.env.PORT || 3000);
const PASTA_PUBLICA = path.join(__dirname);

const tipos = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

function servirArquivo(req, res, url) {
    let caminho = decodeURIComponent(url.pathname);
    if (caminho === '/') caminho = '/index.html';
    const arquivo = path.resolve(PASTA_PUBLICA, `.${caminho}`);
    if (!arquivo.startsWith(PASTA_PUBLICA + path.sep) && arquivo !== PASTA_PUBLICA) {
        res.writeHead(403); return res.end('Acesso negado.');
    }
    fs.readFile(arquivo, (falha, conteudo) => {
        if (falha) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Arquivo não encontrado.');
        }
        res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo).toLowerCase()] || 'application/octet-stream' });
        res.end(conteudo);
    });
}

const servidor = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    try {
        if (url.pathname.startsWith('/api')) {
            return await tratarRotasTarefas(req, res, url);
        }
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.writeHead(405, { Allow: 'GET, HEAD' });
            return res.end('Método não permitido.');
        }
        return servirArquivo(req, res, url);
    } catch (e) {
        console.error(e);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ sucesso: false, erro: { mensagem: 'Ocorreu um erro interno no servidor.', detalhes: [] } }));
        } else {
            res.end();
        }
    }
});

servidor.listen(PORTA, '127.0.0.1', () => {
    console.log(`AgendaFácil iniciado em http://127.0.0.1:${PORTA}`);
    console.log('API disponível em http://127.0.0.1:' + PORTA + '/api/tarefas');
    console.log('Para encerrar, pressione Ctrl + C.');
});
