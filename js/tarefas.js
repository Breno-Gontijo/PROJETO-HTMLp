// Este módulo reúne as operações usadas pelas telas do AgendaFácil.
import {
    consultarTarefas,
    consultarTarefa,
    enviarTarefa,
    atualizarTarefa,
    excluirTarefa
} from "./api.js";

export async function listarTarefas() {
    return await consultarTarefas();
}

export async function buscarTarefa(id) {
    return await consultarTarefa(id);
}

export async function cadastrarTarefa(dados) {
    return await enviarTarefa(dados);
}

export async function concluirTarefa(id) {
    return await atualizarTarefa(id, { concluida: true });
}

export async function removerTarefa(id) {
    return await excluirTarefa(id);
}
