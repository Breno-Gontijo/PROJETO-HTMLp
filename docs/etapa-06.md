# Etapa 06 — API REST do AgendaFácil

## 1. Descrição

Nesta etapa, o serviço simulado utilizado anteriormente foi substituído por uma API REST executada em um servidor Node.js. O navegador faz requisições HTTP usando a Fetch API. A API recebe e responde os dados em JSON.

O recurso principal é `tarefas`. Os dados são persistidos no arquivo `dados/tarefas.json`, então não ficam limitados ao armazenamento de uma única aba do navegador.

## 2. Execução

1. Instale Node.js 18 ou superior.
2. Abra a pasta do projeto.
3. Execute `iniciar.bat` no Windows ou rode `node server.js` no terminal.
4. Acesse `http://127.0.0.1:3000`.

Não é necessário executar `npm install`, pois o servidor utiliza o módulo HTTP nativo do Node.js.

## 3. Endpoints

Endereço base: `http://127.0.0.1:3000/api/tarefas`

| Método | Rota | Finalidade | Resposta de sucesso |
|---|---|---|---|
| GET | `/api/tarefas` | Consultar todas as tarefas | 200 OK |
| GET | `/api/tarefas/:id` | Consultar uma tarefa | 200 OK |
| POST | `/api/tarefas` | Criar uma tarefa | 201 Created |
| PUT | `/api/tarefas/:id` | Substituir os dados editáveis da tarefa | 200 OK |
| PATCH | `/api/tarefas/:id` | Alterar parcialmente uma tarefa | 200 OK |
| DELETE | `/api/tarefas/:id` | Excluir uma tarefa | 200 OK |

### Campos de uma tarefa

| Campo | Tipo | Regra |
|---|---|---|
| `id` | number | Gerado pelo servidor |
| `titulo` | string | Obrigatório, até 100 caracteres |
| `descricao` | string | Opcional, até 500 caracteres |
| `data` | string | Obrigatório, formato `AAAA-MM-DD` e data válida |
| `horario` | string | Obrigatório, formato `HH:MM` |
| `categoria` | string | Obrigatório: `estudos`, `trabalho` ou `pessoal` |
| `concluida` | boolean | Controlado pela aplicação; começa como `false` |

## 4. Exemplos de requisições

### GET — listar tarefas

```http
GET /api/tarefas HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
```

Resposta `200 OK`:

```json
{
  "sucesso": true,
  "dados": [
    {
      "id": 1,
      "titulo": "Prova de Cálculo",
      "descricao": "Prova referente ao conteúdo da primeira unidade.",
      "data": "2026-11-25",
      "horario": "19:00",
      "categoria": "estudos",
      "concluida": false
    }
  ]
}
```

### GET — consultar uma tarefa

```http
GET /api/tarefas/1 HTTP/1.1
Host: 127.0.0.1:3000
```

Resposta `200 OK`: objeto da tarefa dentro de `dados`, seguindo o mesmo formato acima.

### POST — criar tarefa

```http
POST /api/tarefas HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
```

Corpo:

```json
{
  "titulo": "Entregar atividade",
  "descricao": "Finalizar a atividade de programação.",
  "data": "2026-12-02",
  "horario": "20:00",
  "categoria": "estudos"
}
```

Resposta `201 Created`:

```json
{
  "sucesso": true,
  "mensagem": "Tarefa cadastrada com sucesso.",
  "dados": {
    "id": 3,
    "titulo": "Entregar atividade",
    "descricao": "Finalizar a atividade de programação.",
    "data": "2026-12-02",
    "horario": "20:00",
    "categoria": "estudos",
    "concluida": false
  }
}
```

O ID do exemplo depende dos registros existentes no arquivo de dados.

### PUT — substituir tarefa

```http
PUT /api/tarefas/3 HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
```

Corpo: envie `titulo`, `data`, `horario` e `categoria`; `descricao` pode ser uma string vazia e `concluida` é opcional.

```json
{
  "titulo": "Entregar atividade revisada",
  "descricao": "Versão final da atividade.",
  "data": "2026-12-03",
  "horario": "18:30",
  "categoria": "estudos",
  "concluida": false
}
```

Resposta: `200 OK`, com a tarefa atualizada em `dados`.

### PATCH — alterar parcialmente

```http
PATCH /api/tarefas/3 HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
```

Corpo:

```json
{
  "concluida": true
}
```

Resposta: `200 OK`, com a tarefa atualizada em `dados`.

### DELETE — excluir tarefa

```http
DELETE /api/tarefas/3 HTTP/1.1
Host: 127.0.0.1:3000
```

Resposta `200 OK`:

```json
{
  "sucesso": true,
  "mensagem": "Tarefa excluída com sucesso.",
  "dados": {
    "id": 3,
    "titulo": "Entregar atividade revisada",
    "descricao": "Versão final da atividade.",
    "data": "2026-12-03",
    "horario": "18:30",
    "categoria": "estudos",
    "concluida": false
  }
}
```

## 5. Códigos HTTP e erros

- `200 OK`: consulta, alteração ou exclusão realizada.
- `201 Created`: tarefa criada.
- `400 Bad Request`: JSON inválido ou campos incorretos.
- `404 Not Found`: rota ou tarefa não encontrada.
- `405 Method Not Allowed`: método não permitido na rota.
- `500 Internal Server Error`: falha inesperada no servidor.

Formato de erro:

```json
{
  "sucesso": false,
  "erro": {
    "mensagem": "Não foi possível cadastrar a tarefa.",
    "detalhes": [
      "O campo titulo é obrigatório."
    ]
  }
}
```

## 6. Testes com curl

Com o servidor ligado, execute os comandos abaixo em outro terminal.

Listar:

```bash
curl http://127.0.0.1:3000/api/tarefas
```

Consultar pelo ID:

```bash
curl http://127.0.0.1:3000/api/tarefas/1
```

Criar:

```bash
curl -X POST http://127.0.0.1:3000/api/tarefas -H "Content-Type: application/json" -d "{\"titulo\":\"Teste da API\",\"descricao\":\"Tarefa criada pelo curl\",\"data\":\"2026-12-10\",\"horario\":\"15:00\",\"categoria\":\"estudos\"}"
```

Alterar parcialmente:

```bash
curl -X PATCH http://127.0.0.1:3000/api/tarefas/1 -H "Content-Type: application/json" -d "{\"concluida\":true}"
```

Excluir:

```bash
curl -X DELETE http://127.0.0.1:3000/api/tarefas/1
```

Para testar validação, envie um POST sem título ou com categoria fora das opções permitidas. A API deve responder `400` e informar o motivo.

## 7. Postman

A coleção `postman/AgendaFacil-Etapa-06.postman_collection.json` contém exemplos de GET, GET individual, POST, PUT, PATCH e DELETE. Importe o arquivo no Postman e mantenha o servidor em execução antes de enviar as requisições.

## 8. Organização do código

- `server.js`: inicialização do servidor e entrega dos arquivos do site.
- `rotas/tarefas.js`: organização dos endpoints do recurso tarefas.
- `utilitarios/validacao.js`: regras de validação dos campos.
- `utilitarios/respostas.js`: respostas JSON e erros padronizados.
- `js/api.js`: comunicação com a API usando `fetch` e `async/await`.
- `js/tarefas.js`: camada com as operações usadas pelo restante do front-end.
- `js/app.js`: comportamento das páginas.

## 9. Observação sobre armazenamento

Para esta etapa, os registros são salvos em `dados/tarefas.json`. É uma persistência simples em arquivo, adequada para demonstrar a API sem configurar um banco de dados. O servidor deve estar ligado para o site e as requisições funcionarem.
