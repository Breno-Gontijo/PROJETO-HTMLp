function validarTarefa(dados, parcial = false) {
    const erros = [];
    const campos = ['titulo', 'descricao', 'data', 'horario', 'categoria'];

    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        return ['Envie um objeto JSON com os dados da tarefa.'];
    }

    if (!parcial) {
        for (const campo of ['titulo', 'data', 'horario', 'categoria']) {
            if (dados[campo] === undefined || dados[campo] === null || dados[campo] === '') {
                erros.push(`O campo ${campo} é obrigatório.`);
            }
        }
    }

    if (dados.titulo !== undefined && (typeof dados.titulo !== 'string' || !dados.titulo.trim())) {
        erros.push('O título deve ser um texto e não pode ficar vazio.');
    }
    if (typeof dados.titulo === 'string' && dados.titulo.trim().length > 100) {
        erros.push('O título deve ter no máximo 100 caracteres.');
    }
    if (dados.descricao !== undefined && typeof dados.descricao !== 'string') {
        erros.push('A descrição deve ser um texto.');
    }
    if (typeof dados.descricao === 'string' && dados.descricao.length > 500) {
        erros.push('A descrição deve ter no máximo 500 caracteres.');
    }
    if (dados.data !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(dados.data)) {
        erros.push('A data deve estar no formato AAAA-MM-DD.');
    } else if (dados.data !== undefined) {
        const data = new Date(`${dados.data}T00:00:00`);
        if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== dados.data) {
            erros.push('Informe uma data válida.');
        }
    }
    if (dados.horario !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(dados.horario)) {
        erros.push('O horário deve estar no formato HH:MM.');
    }
    if (dados.categoria !== undefined && !['estudos', 'trabalho', 'pessoal'].includes(dados.categoria)) {
        erros.push('A categoria deve ser estudos, trabalho ou pessoal.');
    }
    if (dados.concluida !== undefined && typeof dados.concluida !== 'boolean') {
        erros.push('O campo concluida deve ser verdadeiro ou falso.');
    }

    for (const campo of Object.keys(dados)) {
        if (![...campos, 'concluida'].includes(campo)) {
            erros.push(`O campo ${campo} não é permitido.`);
        }
    }
    return erros;
}

module.exports = { validarTarefa };
