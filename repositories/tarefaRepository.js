const db = require('../db/conexao');

const SELECT_TAREFA = `
    SELECT t.id, t.titulo, t.descricao, t.data, t.horario,
           c.nome AS categoria, t.concluida,
           t.criada_em AS criadaEm, t.atualizada_em AS atualizadaEm
    FROM tarefas t
    INNER JOIN categorias c ON c.id = t.categoria_id
`;

function formatar(registro) {
    if (!registro) return null;
    return { ...registro, concluida: Boolean(registro.concluida) };
}

function listar() {
    return db.prepare(`${SELECT_TAREFA} ORDER BY t.data, t.horario, t.id`)
        .all().map(formatar);
}

function buscarPorId(id) {
    return formatar(db.prepare(`${SELECT_TAREFA} WHERE t.id = ?`).get(id));
}

function obterCategoriaId(nome) {
    const categoria = db.prepare('SELECT id FROM categorias WHERE nome = ?').get(nome);
    return categoria ? categoria.id : null;
}

function criar(dados) {
    const categoriaId = obterCategoriaId(dados.categoria);
    const resultado = db.prepare(`
        INSERT INTO tarefas (titulo, descricao, data, horario, categoria_id, concluida)
        VALUES (?, ?, ?, ?, ?, 0)
    `).run(dados.titulo.trim(), (dados.descricao || '').trim(), dados.data,
        dados.horario, categoriaId);
    return buscarPorId(Number(resultado.lastInsertRowid));
}

function atualizar(id, dados) {
    const atual = buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    const categoriaId = obterCategoriaId(novo.categoria);
    db.prepare(`
        UPDATE tarefas
        SET titulo = ?, descricao = ?, data = ?, horario = ?, categoria_id = ?,
            concluida = ?, atualizada_em = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(novo.titulo.trim(), (novo.descricao || '').trim(), novo.data,
        novo.horario, categoriaId, novo.concluida ? 1 : 0, id);
    return buscarPorId(id);
}

function excluir(id) {
    const tarefa = buscarPorId(id);
    if (!tarefa) return null;
    db.prepare('DELETE FROM tarefas WHERE id = ?').run(id);
    return tarefa;
}

function listarCategorias() {
    return db.prepare('SELECT id, nome, descricao FROM categorias ORDER BY id').all();
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, listarCategorias };
