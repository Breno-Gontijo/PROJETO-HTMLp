# AgendaFácil — Etapa 06

Projeto de agenda de tarefas com front-end em HTML, CSS e JavaScript e uma API REST feita em Node.js, utilizando apenas módulos nativos do Node.

## Requisitos

- Node.js 18 ou superior.
- Navegador atualizado.
- Postman (opcional, para testar a API).

Não é necessário instalar dependências com npm. O servidor utiliza o módulo `http` nativo do Node.js.

## Como executar no Windows

1. Instale o Node.js LTS: https://nodejs.org/ (caso ainda não esteja instalado).
2. Extraia a pasta do projeto.
3. Dê dois cliques em `iniciar.bat`.
4. Aguarde o navegador abrir em `http://127.0.0.1:3000`.
5. Não feche a janela chamada **AgendaFacil - Servidor** enquanto estiver usando o sistema.

Também é possível iniciar pelo terminal, dentro da pasta do projeto:

```bash
node server.js
```

Depois acesse `http://127.0.0.1:3000`.

## Organização

- `server.js`: inicialização do servidor HTTP e entrega dos arquivos do site.
- `rotas/tarefas.js`: endpoints REST do recurso de tarefas.
- `utilitarios/validacao.js`: validação dos dados recebidos.
- `utilitarios/respostas.js`: formato padronizado das respostas e erros.
- `js/api.js`: chamadas HTTP feitas pelo front-end usando Fetch API.
- `js/tarefas.js`: funções de acesso às tarefas utilizadas pelas telas.
- `js/app.js`: eventos e atualização da interface.
- `dados/tarefas.json`: arquivo usado para persistir as tarefas.
- `docs/etapa-06.md`: documentação dos endpoints e exemplos.
- `postman/AgendaFacil-Etapa-06.postman_collection.json`: coleção para importar no Postman.

## Endereço da API

`http://127.0.0.1:3000/api/tarefas`

A API e o front-end são servidos pela mesma aplicação. Os dados ficam no arquivo `dados/tarefas.json` e continuam disponíveis depois de reiniciar o servidor.
