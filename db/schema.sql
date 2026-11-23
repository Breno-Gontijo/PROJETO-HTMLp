PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL CHECK(length(trim(titulo)) BETWEEN 1 AND 100),
    descricao TEXT NOT NULL DEFAULT '' CHECK(length(descricao) <= 500),
    data TEXT NOT NULL,
    horario TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    concluida INTEGER NOT NULL DEFAULT 0 CHECK(concluida IN (0, 1)),
    criada_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizada_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tarefas_data ON tarefas(data);
CREATE INDEX IF NOT EXISTS idx_tarefas_categoria ON tarefas(categoria_id);
