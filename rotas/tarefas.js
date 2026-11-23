const fs = require('fs');
const path = require('path');
const { responder, erro } = require('../utilitarios/respostas');
const { validarTarefa } = require('../utilitarios/validacao');

const ARQUIVO_DADOS = path.join(__dirname, '..', 'dados', 'tarefas.json');

function lerTarefas() {
    return JSON.parse(fs.readFileSync(ARQUIVO_DADOS, 'utf8'));
}

function salvarTarefas(tarefas) {
    fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(tarefas, null, 4));
}

function lerCorpo(req) {
    return new Promise((resolve, reject) => {
        let corpo = '';
        req.on('data', parte => {
            corpo += parte;
            if (corpo.length > 1_000_000) {
                reject(new Error('O corpo da requisição é muito grande.'));
                req.destroy();
            }
        });
        req.on('end', () => {
            if (!corpo) return resolve({});
            try {
                resolve(JSON.parse(corpo));
            } catch {
                reject(new Error('O corpo da requisição precisa conter um JSON válido.'));
            }
        });
        req.on('error', reject);
    });
}

async function tratarRotasTarefas(req, res, url) {
    const caminho = url.pathname.replace(/\/$/, '') || '/';

    if (caminho === '/api' || caminho === '/api/tarefas') {
        if (req.method === 'GET') {
            return responder(res, 200, { sucesso: true, dados: lerTarefas() });
        }

        if (req.method === 'POST') {
            let corpo;
            try {
                corpo = await lerCorpo(req);
            } catch (e) {
                return erro(res, 400, e.message);
            }

            const problemas = validarTarefa(corpo);
            if (problemas.length) {
                return erro(res, 400, 'Não foi possível cadastrar a tarefa.', problemas);
            }

            const tarefas = lerTarefas();
            const nova = {
                id: tarefas.reduce((maior, item) => Math.max(maior, item.id), 0) + 1,
                titulo: corpo.titulo.trim(),
                descricao: (corpo.descricao || '').trim(),
                data: corpo.data,
                horario: corpo.horario,
                categoria: corpo.categoria,
                concluida: false
            };
            tarefas.push(nova);
            salvarTarefas(tarefas);
            return responder(res, 201, { sucesso: true, mensagem: 'Tarefa cadastrada com sucesso.', dados: nova });
        }

        res.setHeader('Allow', 'GET, POST');
        return erro(res, 405, 'Método não permitido para este recurso.');
    }

    const rotaTarefa = caminho.match(/^\/api\/tarefas\/(\d+)$/);
    if (rotaTarefa) {
        const id = Number(rotaTarefa[1]);
        if (!Number.isSafeInteger(id) || id < 1) return erro(res, 400, 'Identificador inválido.');

        const tarefas = lerTarefas();
        const indice = tarefas.findIndex(tarefa => tarefa.id === id);

        if (req.method === 'GET') {
            if (indice === -1) return erro(res, 404, 'Tarefa não encontrada.');
            return responder(res, 200, { sucesso: true, dados: tarefas[indice] });
        }

        if (req.method === 'PUT' || req.method === 'PATCH') {
            if (indice === -1) return erro(res, 404, 'Tarefa não encontrada.');
            let corpo;
            try {
                corpo = await lerCorpo(req);
            } catch (e) {
                return erro(res, 400, e.message);
            }

            const problemas = validarTarefa(corpo, req.method === 'PATCH');
            if (problemas.length) {
                return erro(res, 400, 'Não foi possível alterar a tarefa.', problemas);
            }

            const atual = req.method === 'PUT'
                ? {
                    id,
                    titulo: corpo.titulo.trim(),
                    descricao: (corpo.descricao || '').trim(),
                    data: corpo.data,
                    horario: corpo.horario,
                    categoria: corpo.categoria,
                    concluida: corpo.concluida ?? tarefas[indice].concluida
                }
                : { ...tarefas[indice], ...corpo };

            if (atual.titulo) atual.titulo = atual.titulo.trim();
            tarefas[indice] = atual;
            salvarTarefas(tarefas);
            return responder(res, 200, { sucesso: true, mensagem: 'Tarefa alterada com sucesso.', dados: atual });
        }

        if (req.method === 'DELETE') {
            if (indice === -1) return erro(res, 404, 'Tarefa não encontrada.');
            const removida = tarefas.splice(indice, 1)[0];
            salvarTarefas(tarefas);
            return responder(res, 200, { sucesso: true, mensagem: 'Tarefa excluída com sucesso.', dados: removida });
        }

        res.setHeader('Allow', 'GET, PUT, PATCH, DELETE');
        return erro(res, 405, 'Método não permitido para este recurso.');
    }

    return erro(res, 404, 'Rota da API não encontrada.');
}

module.exports = { tratarRotasTarefas };
