// Comunicação do front-end com a API REST do AgendaFácil.
const ENDERECO_API = '/api/tarefas';

async function requisitar(url, opcoes = {}) {
    const resposta = await fetch(url, {
        ...opcoes,
        headers: {
            'Content-Type': 'application/json',
            ...(opcoes.headers || {})
        }
    });

    let resultado;
    try {
        resultado = await resposta.json();
    } catch {
        throw new Error('O servidor retornou uma resposta inválida.');
    }

    if (!resposta.ok) {
        const mensagem = resultado?.erro?.mensagem || 'Não foi possível concluir a operação.';
        const detalhes = resultado?.erro?.detalhes || [];
        throw new Error(detalhes.length ? `${mensagem} ${detalhes.join(' ')}` : mensagem);
    }

    return resultado;
}

export async function consultarTarefas() {
    const resposta = await requisitar(ENDERECO_API);
    return resposta.dados;
}

export async function consultarTarefa(id) {
    const resposta = await requisitar(`${ENDERECO_API}/${id}`);
    return resposta.dados;
}

export async function enviarTarefa(novaTarefa) {
    const resposta = await requisitar(ENDERECO_API, {
        method: 'POST',
        body: JSON.stringify(novaTarefa)
    });
    return resposta.dados;
}

export async function atualizarTarefa(id, alteracoes) {
    const resposta = await requisitar(`${ENDERECO_API}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(alteracoes)
    });
    return resposta.dados;
}

export async function substituirTarefa(id, tarefa) {
    const resposta = await requisitar(`${ENDERECO_API}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(tarefa)
    });
    return resposta.dados;
}

export async function excluirTarefa(id) {
    const resposta = await requisitar(`${ENDERECO_API}/${id}`, { method: 'DELETE' });
    return resposta.dados;
}
