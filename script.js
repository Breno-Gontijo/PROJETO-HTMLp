const CHAVE = "agendaFacilTarefas";

const padrao = [
    {
        id: 1,
        titulo: "Prova de Cálculo",
        descricao: "Prova referente ao conteúdo da primeira unidade.",
        data: "2026-09-10",
        horario: "19:00",
        categoria: "estudos",
        concluida: false
    },
    {
        id: 2,
        titulo: "Reunião",
        descricao: "Reunião de trabalho.",
        data: "2026-09-12",
        horario: "14:00",
        categoria: "trabalho",
        concluida: false
    }
];

function tarefas() {
    return JSON.parse(localStorage.getItem(CHAVE) || "null") || padrao;
}

function salvar(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
}

function dataBR(data) {
    const p = data.split("-");
    return `${p[2]}/${p[1]}/${p[0]}`;
}

function categoriaNome(c) {
    return {
        estudos: "Estudos",
        trabalho: "Trabalho",
        pessoal: "Pessoal"
    }[c] || c;
}

const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

let mes = 8;
let ano = 2026;

function mostrarCalendario() {
    const area = document.getElementById("calendario");

    if (!area) return;

    area.innerHTML = "";

    ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach(d => {
        const e = document.createElement("div");
        e.className = "diaSemana";
        e.textContent = d;
        area.appendChild(e);
    });

    const inicio = new Date(ano, mes, 1).getDay();
    const total = new Date(ano, mes + 1, 0).getDate();
    const lista = tarefas();

    for (let i = 0; i < inicio; i++) {
        const e = document.createElement("div");
        e.className = "dia vazio";
        area.appendChild(e);
    }

    for (let n = 1; n <= total; n++) {
        const dia = document.createElement("div");
        dia.className = "dia";

        const num = document.createElement("strong");
        num.textContent = n;
        dia.appendChild(num);

        const data = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;

        lista.filter(t => t.data === data).forEach(t => {
            const a = document.createElement("a");
            a.className = `tarefa ${t.categoria}${t.concluida ? " concluida-tarefa" : ""}`;
            a.href = `detalhes.html?id=${t.id}`;
            a.textContent = t.titulo;
            dia.appendChild(a);
        });

        area.appendChild(dia);
    }

    document.getElementById("nomeMes").textContent = `${meses[mes]} ${ano}`;
}

function configurarCalendario() {
    const ant = document.getElementById("anterior");
    const pro = document.getElementById("proximo");

    if (!ant || !pro) return;

    ant.onclick = () => {
        mes--;

        if (mes < 0) {
            mes = 11;
            ano--;
        }

        mostrarCalendario();
    };

    pro.onclick = () => {
        mes++;

        if (mes > 11) {
            mes = 0;
            ano++;
        }

        mostrarCalendario();
    };
}

function configurarFormulario() {
    const form = document.getElementById("formTarefa");

    if (!form) return;

    form.onsubmit = e => {
        e.preventDefault();

        const titulo = document.getElementById("titulo").value.trim();
        const desc = document.getElementById("descricao").value.trim();
        const data = document.getElementById("data").value;
        const horario = document.getElementById("horario").value;
        const categoria = document.getElementById("categoria").value;
        const msg = document.getElementById("mensagem");

        if (!titulo || !data || !horario || !categoria) {
            msg.textContent = "Preencha título, data, horário e categoria.";
            return;
        }

        const lista = tarefas();

        lista.push({
            id: Date.now(),
            titulo,
            descricao: desc,
            data,
            horario,
            categoria,
            concluida: false
        });

        salvar(lista);
        msg.style.color = "#16845c";
        msg.textContent = "Tarefa cadastrada com sucesso!";

        setTimeout(() => location.href = "index.html", 700);
    };
}

function detalhes() {
    const titulo = document.getElementById("tituloDetalhes");

    if (!titulo) return;

    const id = Number(new URLSearchParams(location.search).get("id"));
    const lista = tarefas();
    const t = lista.find(x => x.id === id) || lista[0];

    if (!t) {
        document.getElementById("mensagemDetalhes").textContent = "Tarefa não encontrada.";
        return;
    }

    titulo.textContent = t.titulo;
    document.getElementById("categoriaDetalhes").textContent = categoriaNome(t.categoria);
    document.getElementById("categoriaDetalhes").className = `categoria ${t.categoria}`;
    document.getElementById("dataDetalhes").textContent = dataBR(t.data);
    document.getElementById("horarioDetalhes").textContent = t.horario;
    document.getElementById("descricaoDetalhes").textContent = t.descricao || "Sem descrição.";

    const concluir = document.getElementById("concluir");
    const excluir = document.getElementById("excluir");
    const msg = document.getElementById("mensagemDetalhes");

    if (t.concluida) {
        concluir.textContent = "Tarefa concluída";
        concluir.disabled = true;
    }

    concluir.onclick = () => {
        const l = tarefas();
        const x = l.find(a => a.id === t.id);

        if (x) {
            x.concluida = true;
            salvar(l);
            msg.style.color = "#16845c";
            msg.textContent = "Tarefa marcada como concluída.";
            concluir.textContent = "Tarefa concluída";
            concluir.disabled = true;
        }
    };

    excluir.onclick = () => {
        if (confirm("Deseja excluir esta tarefa?")) {
            salvar(tarefas().filter(x => x.id !== t.id));
            location.href = "index.html";
        }
    };
}

configurarCalendario();
mostrarCalendario();
configurarFormulario();
detalhes();
