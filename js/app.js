// Este arquivo controla os eventos e atualiza as páginas.
import {
    listarTarefas,
    buscarTarefa,
    cadastrarTarefa,
    concluirTarefa,
    removerTarefa
} from "./tarefas.js";

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const hoje = new Date();
let mes = hoje.getMonth();
let ano = hoje.getFullYear();
let listaTarefas = [];

function dataBR(data) {
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function categoriaNome(categoria) {
    return {
        estudos: "Estudos",
        trabalho: "Trabalho",
        pessoal: "Pessoal"
    }[categoria] || categoria;
}

function mostrarEstado(elemento, texto, tipo = "") {
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.className = `mensagem ${tipo}`.trim();
}

function mostrarCalendario() {
    const area = document.getElementById("calendario");
    if (!area) return;

    area.innerHTML = "";

    ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach(dia => {
        const elemento = document.createElement("div");
        elemento.className = "diaSemana";
        elemento.textContent = dia;
        area.appendChild(elemento);
    });

    const inicio = new Date(ano, mes, 1).getDay();
    const total = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < inicio; i++) {
        const vazio = document.createElement("div");
        vazio.className = "dia vazio";
        area.appendChild(vazio);
    }

    for (let numero = 1; numero <= total; numero++) {
        const dia = document.createElement("div");
        dia.className = "dia";

        const titulo = document.createElement("strong");
        titulo.textContent = numero;
        dia.appendChild(titulo);

        const data = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(numero).padStart(2, "0")}`;

        listaTarefas.filter(tarefa => tarefa.data === data).forEach(tarefa => {
            const link = document.createElement("a");
            link.className = `tarefa ${tarefa.categoria}${tarefa.concluida ? " concluida-tarefa" : ""}`;
            link.href = `detalhes.html?id=${tarefa.id}`;
            link.textContent = tarefa.titulo;
            dia.appendChild(link);
        });

        area.appendChild(dia);
    }

    document.getElementById("nomeMes").textContent = `${meses[mes]} ${ano}`;
}

async function carregarCalendario() {
    const mensagem = document.getElementById("mensagemGeral");
    const tentar = document.getElementById("tentarNovamente");
    const area = document.getElementById("calendario");

    if (!area) return;

    mostrarEstado(mensagem, "Carregando tarefas...");
    tentar.hidden = true;
    area.innerHTML = "";

    try {
        listaTarefas = await listarTarefas();
        mostrarCalendario();
        mostrarEstado(mensagem, "Tarefas carregadas com sucesso!", "sucesso");
    } catch (erro) {
        mostrarEstado(mensagem, `Erro ao carregar: ${erro.message}`, "erro");
        tentar.hidden = false;
    }
}

function configurarCalendario() {
    const anterior = document.getElementById("anterior");
    const proximo = document.getElementById("proximo");

    if (!anterior || !proximo) return;

    anterior.addEventListener("click", () => {
        mes--;
        if (mes < 0) {
            mes = 11;
            ano--;
        }
        mostrarCalendario();
    });

    proximo.addEventListener("click", () => {
        mes++;
        if (mes > 11) {
            mes = 0;
            ano++;
        }
        mostrarCalendario();
    });
}

function configurarFormulario() {
    const form = document.getElementById("formTarefa");
    if (!form) return;

    form.addEventListener("submit", async evento => {
        evento.preventDefault();

        const titulo = document.getElementById("titulo").value.trim();
        const descricao = document.getElementById("descricao").value.trim();
        const data = document.getElementById("data").value;
        const horario = document.getElementById("horario").value;
        const categoria = document.getElementById("categoria").value;
        const mensagem = document.getElementById("mensagem");
        const botao = form.querySelector('button[type="submit"]');

        if (!titulo || !data || !horario || !categoria) {
            mostrarEstado(mensagem, "Preencha título, data, horário e categoria.", "erro");
            return;
        }

        botao.disabled = true;
        botao.textContent = "Enviando...";
        mostrarEstado(mensagem, "Enviando tarefa para o serviço...");

        try {
            await cadastrarTarefa({ titulo, descricao, data, horario, categoria });
            mostrarEstado(mensagem, "Tarefa cadastrada com sucesso!", "sucesso");
            form.reset();
            setTimeout(() => window.location.href = "index.html", 900);
        } catch (erro) {
            mostrarEstado(mensagem, `Erro ao cadastrar: ${erro.message}`, "erro");
            botao.disabled = false;
            botao.textContent = "Cadastrar";
        }
    });
}

async function carregarDetalhes() {
    const titulo = document.getElementById("tituloDetalhes");
    if (!titulo) return;

    const mensagem = document.getElementById("mensagemDetalhes");
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const concluir = document.getElementById("concluir");
    const excluir = document.getElementById("excluir");

    mostrarEstado(mensagem, "Carregando dados da tarefa...");
    concluir.disabled = true;
    excluir.disabled = true;

    try {
        const tarefa = await buscarTarefa(id);

        if (!tarefa) {
            throw new Error("Tarefa não encontrada.");
        }

        titulo.textContent = tarefa.titulo;
        document.getElementById("categoriaDetalhes").textContent = categoriaNome(tarefa.categoria);
        document.getElementById("categoriaDetalhes").className = `categoria ${tarefa.categoria}`;
        document.getElementById("dataDetalhes").textContent = dataBR(tarefa.data);
        document.getElementById("horarioDetalhes").textContent = tarefa.horario;
        document.getElementById("descricaoDetalhes").textContent = tarefa.descricao || "Sem descrição.";

        mostrarEstado(mensagem, "Tarefa carregada com sucesso!", "sucesso");
        concluir.disabled = tarefa.concluida;
        concluir.textContent = tarefa.concluida ? "Tarefa concluída" : "Marcar como concluída";
        excluir.disabled = false;

        concluir.onclick = async () => {
            concluir.disabled = true;
            mostrarEstado(mensagem, "Atualizando tarefa...");

            try {
                await concluirTarefa(tarefa.id);
                concluir.textContent = "Tarefa concluída";
                mostrarEstado(mensagem, "Tarefa marcada como concluída!", "sucesso");
            } catch (erro) {
                concluir.disabled = false;
                mostrarEstado(mensagem, `Erro ao atualizar: ${erro.message}`, "erro");
            }
        };

        excluir.onclick = async () => {
            if (!confirm("Deseja excluir esta tarefa?")) return;

            excluir.disabled = true;
            mostrarEstado(mensagem, "Excluindo tarefa...");

            try {
                await removerTarefa(tarefa.id);
                mostrarEstado(mensagem, "Tarefa excluída com sucesso!", "sucesso");
                setTimeout(() => window.location.href = "index.html", 700);
            } catch (erro) {
                excluir.disabled = false;
                mostrarEstado(mensagem, `Erro ao excluir: ${erro.message}`, "erro");
            }
        };
    } catch (erro) {
        mostrarEstado(mensagem, `Erro ao carregar: ${erro.message}`, "erro");
        titulo.textContent = "Não foi possível abrir a tarefa";
    }
}

configurarCalendario();
configurarFormulario();
const botaoTentar = document.getElementById("tentarNovamente");
if (botaoTentar) botaoTentar.addEventListener("click", carregarCalendario);
carregarCalendario();
carregarDetalhes();
