function responder(res, status, dados) {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    res.end(JSON.stringify(dados));
}

function erro(res, status, mensagem, detalhes = []) {
    responder(res, status, {
        sucesso: false,
        erro: { mensagem, detalhes }
    });
}

module.exports = { responder, erro };
