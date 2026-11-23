# Etapa 07 — Persistência e CRUD com banco de dados

## 1. O que foi feito

Nesta etapa, o armazenamento em arquivo JSON usado na Etapa 06 foi substituído por um banco de dados SQLite. A API continua recebendo e enviando JSON, mas as operações agora são executadas por um repositório que acessa o banco.

O banco é criado automaticamente na primeira inicialização em `dados/agendafacil.db`. O arquivo é mantido entre as execuções do sistema.

## 2. Escolha do banco

Foi escolhido o SQLite por ser um banco relacional, leve e adequado ao tamanho do AgendaFácil. Ele não exige instalar ou configurar um servidor de banco separado. O banco fica em um arquivo local e permite usar chaves primárias, chaves estrangeiras, restrições e consultas SQL.

A aplicação utiliza o módulo nativo `node:sqlite`, disponível no próprio Node.js a partir da versão 22.5.0. Essa escolha evita dependências nativas externas e a necessidade de compilar módulos durante a instalação.

## 3. Modelo do banco

### Entidade `categorias`

| Campo | Tipo | Regra |
|---|---|---|
| id | INTEGER | Chave primária, incremento automático |
| nome | TEXT | Obrigatório e único |
| descricao | TEXT | Descrição da categoria |

### Entidade `tarefas`

| Campo | Tipo | Regra |
|---|---|---|
| id | INTEGER | Chave primária, incremento automático |
| titulo | TEXT | Obrigatório, até 100 caracteres |
| descricao | TEXT | Opcional, até 500 caracteres |
| data | TEXT | Data no formato AAAA-MM-DD |
| horario | TEXT | Horário no formato HH:MM |
| categoria_id | INTEGER | Chave estrangeira para categorias.id |
| concluida | INTEGER | 0 para não concluída e 1 para concluída |
| criada_em | TEXT | Data e hora de criação |
| atualizada_em | TEXT | Data e hora da última alteração |

### Relacionamento

Uma categoria pode estar associada a várias tarefas. Cada tarefa pertence a uma categoria. Portanto, o relacionamento é de **um para muitos (1:N)** entre `categorias` e `tarefas`.

A chave estrangeira `tarefas.categoria_id` garante que uma tarefa não seja cadastrada com uma categoria inexistente. As categorias iniciais são Estudos, Trabalho e Pessoal.

## 4. Organização do acesso aos dados

- `db/conexao.js`: abre o banco pelo módulo nativo `node:sqlite`, cria as tabelas e cadastra as categorias iniciais.
- `db/schema.sql`: define as tabelas, restrições e índices.
- `repositories/tarefaRepository.js`: concentra os comandos SQL de consulta, inclusão, alteração e exclusão.
- `rotas/tarefas.js`: recebe as requisições HTTP e chama o repositório.
- `utilitarios/validacao.js`: valida os dados recebidos pela API.

As rotas não executam comandos SQL diretamente. Essa separação evita deixar a API dependente dos detalhes do banco de dados.

## 5. Criação e execução do banco

1. Instale o Node.js 22.5.0 ou superior.
2. Extraia o projeto.
3. Abra o terminal dentro da pasta `PROJETO-HTMLp-etapa-07`.
4. Execute `npm start` ou dê dois cliques em `iniciar.bat`. Não é necessário executar `npm install`, pois o SQLite é acessado pelo módulo nativo do Node.js.
5. Acesse `http://127.0.0.1:3000`.

Na primeira execução, a aplicação cria `dados/agendafacil.db`, monta as tabelas e insere as categorias. Se o arquivo `dados/tarefas.json` da etapa anterior existir e o banco ainda não existir, as tarefas antigas são importadas automaticamente.

Não apague `dados/agendafacil.db` se quiser manter os registros cadastrados.

## 6. Endpoints CRUD

Base: `http://127.0.0.1:3000/api`

| Método | Endpoint | Operação |
|---|---|---|
| GET | `/tarefas` | Lista as tarefas |
| GET | `/tarefas/:id` | Consulta uma tarefa |
| POST | `/tarefas` | Cria uma tarefa |
| PUT | `/tarefas/:id` | Substitui os dados da tarefa |
| PATCH | `/tarefas/:id` | Altera parte dos dados |
| DELETE | `/tarefas/:id` | Exclui uma tarefa |
| GET | `/categorias` | Lista as categorias disponíveis |

### Exemplo de POST

Requisição `POST /api/tarefas`, com `Content-Type: application/json`:

```json
{
  "titulo": "Estudar banco de dados",
  "descricao": "Revisar chaves primárias e estrangeiras",
  "data": "2026-12-02",
  "horario": "19:00",
  "categoria": "estudos"
}
```

Resposta esperada: `201 Created`, com o registro criado em `dados` e um identificador gerado pelo banco.

### Exemplo de GET

`GET /api/tarefas` retorna `200 OK` e uma lista JSON. A consulta relaciona as tabelas `tarefas` e `categorias`, retornando o nome da categoria para manter compatibilidade com o front-end.

### Exemplo de PATCH

`PATCH /api/tarefas/1`:

```json
{ "concluida": true }
```

Resposta: `200 OK` com a tarefa atualizada.

### Exemplo de DELETE

`DELETE /api/tarefas/1` remove o registro e retorna `200 OK`. Se o ID não existir, retorna `404 Not Found`.

## 7. Validação e erros

A API valida os campos antes de enviar os dados ao repositório. O banco também possui restrições para título, descrição, conclusão e chave estrangeira. As operações SQL usam parâmetros, evitando montar comandos com valores recebidos diretamente do usuário.

- `400`: JSON inválido ou dados incorretos.
- `404`: tarefa ou rota não encontrada.
- `405`: método não permitido.
- `500`: erro inesperado de persistência ou servidor.

As respostas de erro seguem o formato JSON padronizado da etapa anterior.

## 8. Exemplos de testes com curl

Listar tarefas:

```bash
curl http://127.0.0.1:3000/api/tarefas
```

Listar categorias:

```bash
curl http://127.0.0.1:3000/api/categorias
```

Criar uma tarefa:

```bash
curl -X POST http://127.0.0.1:3000/api/tarefas -H "Content-Type: application/json" -d "{"titulo":"Estudar SQL","descricao":"Revisar SELECT","data":"2026-12-02","horario":"19:00","categoria":"estudos"}"
```

Consultar pelo ID:

```bash
curl http://127.0.0.1:3000/api/tarefas/1
```

Atualizar:

```bash
curl -X PATCH http://127.0.0.1:3000/api/tarefas/1 -H "Content-Type: application/json" -d "{"concluida":true}"
```

Excluir:

```bash
curl -X DELETE http://127.0.0.1:3000/api/tarefas/1
```

## 9. Persistência

Para conferir a persistência, cadastre uma tarefa, encerre o servidor e inicie novamente. A tarefa continuará aparecendo porque os dados ficam gravados em `dados/agendafacil.db`, e não apenas na memória do servidor.
