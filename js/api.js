// Este arquivo representa um serviço simulado.
// A espera imita o tempo de resposta de uma API e o localStorage guarda os dados.

const CHAVE = "agendaFacilTarefas";
const TEMPO_RESPOSTA = 800;

const tarefasIniciais = [
    {
        id: 1,
        titulo: "Prova de Cálculo",
        descricao: "Prova referente ao conteúdo da primeira unidade.",
        data: "2026-11-25",
        horario: "19:00",
        categoria: "estudos",
        concluida: false
    },
    {
        id: 2,
        titulo: "Reunião",
        descricao: "Reunião de trabalho.",
        data: "2026-11-27",
        horario: "14:00",
        categoria: "trabalho",
        concluida: false
    }
];

function esperar() {
    return new Promise(resolve => setTimeout(resolve, TEMPO_RESPOSTA));
}

function verificarFalha() {
    const parametros = new URLSearchParams(window.location.search);

    if (parametros.get("falha") === "1") {
        throw new Error("Não foi possível comunicar com o serviço simulado.");
    }
}

function lerDados() {
    const dados = localStorage.getItem(CHAVE);

    if (dados === null) {
        localStorage.setItem(CHAVE, JSON.stringify(tarefasIniciais));
        return [...tarefasIniciais];
    }

    return JSON.parse(dados);
}

function guardarDados(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
}

// Operação de consulta: simula um GET.
export async function consultarTarefas() {
    await esperar();
    verificarFalha();
    return lerDados();
}

// Consulta uma tarefa pelo identificador.
export async function consultarTarefa(id) {
    await esperar();
    verificarFalha();

    const lista = lerDados();
    return lista.find(tarefa => tarefa.id === id) || null;
}

// Operação de envio: simula um POST.
export async function enviarTarefa(novaTarefa) {
    await esperar();
    verificarFalha();

    const lista = lerDados();
    const tarefa = {
        ...novaTarefa,
        id: Date.now(),
        concluida: false
    };

    lista.push(tarefa);
    guardarDados(lista);
    return tarefa;
}

// Atualiza uma tarefa existente (simula um PUT).
export async function atualizarTarefa(id, alteracoes) {
    await esperar();
    verificarFalha();

    const lista = lerDados();
    const indice = lista.findIndex(tarefa => tarefa.id === id);

    if (indice === -1) {
        throw new Error("Tarefa não encontrada.");
    }

    lista[indice] = { ...lista[indice], ...alteracoes };
    guardarDados(lista);
    return lista[indice];
}

// Exclui uma tarefa (simula um DELETE).
export async function excluirTarefa(id) {
    await esperar();
    verificarFalha();

    const lista = lerDados();
    const novaLista = lista.filter(tarefa => tarefa.id !== id);

    if (novaLista.length === lista.length) {
        throw new Error("Tarefa não encontrada.");
    }

    guardarDados(novaLista);
}
