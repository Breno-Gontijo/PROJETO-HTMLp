const { responder, erro } = require('../utilitarios/respostas');
const { validarTarefa } = require('../utilitarios/validacao');
const repositorio = require('../repositories/tarefaRepository');

async function lerCorpo(req) {
    return new Promise((resolve, reject) => {
        let corpo = '';
        req.on('data', parte => {
            corpo += parte;
            if (corpo.length > 100000) reject(new Error('O corpo da requisição é muito grande.'));
        });
        req.on('end', () => {
            if (!corpo) return resolve({});
            try { resolve(JSON.parse(corpo)); }
            catch { reject(new Error('O corpo da requisição precisa conter um JSON válido.')); }
        });
        req.on('error', reject);
    });
}

async function tratarRotasTarefas(req, res, url) {
    const caminho = url.pathname.replace(/\/$/, '') || '/';

    if (caminho === '/api/categorias') {
        if (req.method !== 'GET') {
            res.setHeader('Allow', 'GET');
            return erro(res, 405, 'Método não permitido para este recurso.');
        }
        return responder(res, 200, { sucesso: true, dados: repositorio.listarCategorias() });
    }

    if (caminho === '/api' || caminho === '/api/tarefas') {
        if (req.method === 'GET') {
            return responder(res, 200, { sucesso: true, dados: repositorio.listar() });
        }
        if (req.method === 'POST') {
            let corpo;
            try { corpo = await lerCorpo(req); }
            catch (e) { return erro(res, 400, e.message); }
            const problemas = validarTarefa(corpo);
            if (problemas.length) return erro(res, 400, 'Não foi possível cadastrar a tarefa.', problemas);
            const nova = repositorio.criar(corpo);
            return responder(res, 201, {
                sucesso: true,
                mensagem: 'Tarefa cadastrada com sucesso.',
                dados: nova
            });
        }
        res.setHeader('Allow', 'GET, POST');
        return erro(res, 405, 'Método não permitido para este recurso.');
    }

    const correspondencia = caminho.match(/^\/api\/tarefas\/(\d+)$/);
    if (!correspondencia) return erro(res, 404, 'Rota da API não encontrada.');

    const id = Number(correspondencia[1]);
    if (!Number.isSafeInteger(id) || id < 1) return erro(res, 400, 'Identificador inválido.');

    if (req.method === 'GET') {
        const tarefa = repositorio.buscarPorId(id);
        if (!tarefa) return erro(res, 404, 'Tarefa não encontrada.');
        return responder(res, 200, { sucesso: true, dados: tarefa });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
        if (!repositorio.buscarPorId(id)) return erro(res, 404, 'Tarefa não encontrada.');
        let corpo;
        try { corpo = await lerCorpo(req); }
        catch (e) { return erro(res, 400, e.message); }
        const problemas = validarTarefa(corpo, req.method === 'PATCH');
        if (problemas.length) return erro(res, 400, 'Não foi possível alterar a tarefa.', problemas);
        if (req.method === 'PUT') {
            const obrigatorios = ['titulo', 'data', 'horario', 'categoria'];
            const faltantes = obrigatorios.filter(campo => corpo[campo] === undefined || corpo[campo] === '');
            if (faltantes.length) return erro(res, 400, 'Envie todos os campos obrigatórios para substituir a tarefa.', faltantes.map(c => `O campo ${c} é obrigatório.`));
        }
        const atualizada = repositorio.atualizar(id, corpo);
        return responder(res, 200, { sucesso: true, mensagem: 'Tarefa alterada com sucesso.', dados: atualizada });
    }

    if (req.method === 'DELETE') {
        const removida = repositorio.excluir(id);
        if (!removida) return erro(res, 404, 'Tarefa não encontrada.');
        return responder(res, 200, { sucesso: true, mensagem: 'Tarefa excluída com sucesso.', dados: removida });
    }

    res.setHeader('Allow', 'GET, PUT, PATCH, DELETE');
    return erro(res, 405, 'Método não permitido para este recurso.');
}

module.exports = { tratarRotasTarefas };
