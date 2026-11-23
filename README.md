# AgendaFácil — Etapa 07

Agenda de tarefas com front-end em HTML, CSS e JavaScript, API REST em Node.js e persistência em banco de dados SQLite.

## Requisitos

- Node.js 22.5.0 ou superior (a versão 22 LTS, 24 LTS ou 26 também pode ser utilizada).
- Navegador atualizado.
- Não é necessário instalar Python, Visual Studio Build Tools ou pacotes npm para o banco.

## Como executar no Windows

1. Instale o Node.js 22.5 ou superior: https://nodejs.org/.
2. Extraia a pasta do projeto.
3. Dê dois cliques em `iniciar.bat`.
4. Aguarde o servidor iniciar e o navegador abrir em `http://127.0.0.1:3000`.
5. Mantenha a janela do servidor aberta enquanto usar o sistema.

Também é possível abrir o terminal na pasta do projeto e executar:

```bash
npm start
```

Não é necessário executar `npm install`: o acesso ao SQLite utiliza o módulo `node:sqlite`, que já acompanha o Node.js nas versões exigidas.

## Banco de dados

O SQLite é criado automaticamente em `dados/agendafacil.db`. As tabelas e categorias iniciais são criadas na primeira execução. Não apague esse arquivo para manter os registros.

## API

- `GET /api/tarefas`
- `GET /api/tarefas/:id`
- `POST /api/tarefas`
- `PUT /api/tarefas/:id`
- `PATCH /api/tarefas/:id`
- `DELETE /api/tarefas/:id`
- `GET /api/categorias`

A documentação completa está em `docs/etapa-07.md`.
