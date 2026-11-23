const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const PASTA_DADOS = path.join(__dirname, '..', 'dados');
const ARQUIVO_BANCO = path.join(PASTA_DADOS, 'agendafacil.db');
const ARQUIVO_LEGADO = path.join(PASTA_DADOS, 'tarefas-etapa-06.json');

fs.mkdirSync(PASTA_DADOS, { recursive: true });
const bancoJaExistia = fs.existsSync(ARQUIVO_BANCO);
const db = new DatabaseSync(ARQUIVO_BANCO);

db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

// O SQLite já vem junto com o Node.js. Assim, não é necessário compilar
// módulos nativos nem instalar Python ou ferramentas do Visual Studio.
function executarTransacao(funcao) {
    db.exec('BEGIN IMMEDIATE;');
    try {
        const resultado = funcao();
        db.exec('COMMIT;');
        return resultado;
    } catch (erro) {
        try { db.exec('ROLLBACK;'); } catch (_) {}
        throw erro;
    }
}

const inserirCategoria = db.prepare(
    'INSERT OR IGNORE INTO categorias (nome, descricao) VALUES (?, ?)'
);
const categoriasIniciais = [
    ['estudos', 'Atividades acadêmicas e estudos'],
    ['trabalho', 'Compromissos profissionais'],
    ['pessoal', 'Compromissos pessoais']
];

executarTransacao(() => {
    for (const categoria of categoriasIniciais) {
        inserirCategoria.run(...categoria);
    }
});

// Na primeira abertura, importa os registros que vieram da Etapa 06.
if (!bancoJaExistia && fs.existsSync(ARQUIVO_LEGADO)) {
    try {
        const antigas = JSON.parse(fs.readFileSync(ARQUIVO_LEGADO, 'utf8'));
        const buscarCategoria = db.prepare('SELECT id FROM categorias WHERE nome = ?');
        const inserirTarefa = db.prepare(`
            INSERT INTO tarefas
                (id, titulo, descricao, data, horario, categoria_id, concluida)
            VALUES (@id, @titulo, @descricao, @data, @horario, @categoria_id, @concluida)
        `);

        if (Array.isArray(antigas)) {
            executarTransacao(() => {
                for (const tarefa of antigas) {
                    const categoria = buscarCategoria.get(tarefa.categoria);
                    const id = Number(tarefa.id);
                    if (!categoria || !Number.isSafeInteger(id) || id < 1 || !tarefa.data || !tarefa.horario) {
                        continue;
                    }
                    inserirTarefa.run({
                        id,
                        titulo: String(tarefa.titulo || 'Tarefa sem título').slice(0, 100),
                        descricao: String(tarefa.descricao || '').slice(0, 500),
                        data: String(tarefa.data),
                        horario: String(tarefa.horario),
                        categoria_id: categoria.id,
                        concluida: tarefa.concluida ? 1 : 0
                    });
                }
            });
            console.log('Dados anteriores importados para o SQLite.');
        }
    } catch (erro) {
        console.error('Não foi possível importar os dados antigos:', erro.message);
    }
}

module.exports = db;
