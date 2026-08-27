# AgendaFácil

## 1. Nome da aplicação

**AgendaFácil**

## 2. Descrição do problema que pretende resolver

Muitas pessoas têm dificuldade para organizar suas tarefas, compromissos, provas, trabalhos e outros eventos do dia a dia. A aplicação busca centralizar essas informações em um calendário simples e fácil de utilizar, permitindo visualizar e organizar as atividades por data.

## 3. Público-alvo

Estudantes, trabalhadores e qualquer pessoa que precise organizar tarefas e compromissos pessoais.

## 4. Objetivo principal da aplicação

Permitir que o usuário organize seus compromissos e tarefas através de um calendário, facilitando o planejamento e evitando o esquecimento de atividades importantes.

## 5. Funcionalidades

- Visualizar calendário por mês.
- Adicionar tarefas e compromissos em uma determinada data.
- Editar tarefas existentes.
- Excluir tarefas.
- Marcar tarefas como concluídas.
- Visualizar os detalhes de uma tarefa.
- Navegar entre meses.
- Diferenciar tarefas por categorias ou cores.

## 6. Entidades ou conceitos importantes do domínio

- **Usuário:** pessoa que utiliza a agenda.
- **Tarefa:** atividade que precisa ser realizada.
- **Evento/Compromisso:** atividade associada a uma data e, opcionalmente, horário.
- **Categoria:** classificação das tarefas, como estudos, trabalho ou pessoal.
- **Data:** dia em que uma tarefa ou compromisso está marcado.

## 7. Telas ou interfaces

### Tela principal — Calendário

Apresenta o calendário mensal e as tarefas cadastradas em cada dia.

### Tela de cadastro de tarefa

Permite informar título, descrição, data, horário e categoria da tarefa.

### Tela de detalhes da tarefa

Apresenta as informações de uma tarefa e permite editá-la, concluí-la ou excluí-la.

## 8. Operações

- Cadastrar uma tarefa.
- Consultar tarefas por data.
- Editar uma tarefa.
- Excluir uma tarefa.
- Marcar uma tarefa como concluída.
- Alterar a data de uma tarefa.
- Filtrar tarefas por categoria.

## 9. Tecnologias que pretende utilizar no cliente

- **HTML5**
- **CSS3**
- **JavaScript**

## 10. Tecnologias que pretende utilizar no servidor

- **Node.js**
- **Express.js**

## 11. Tecnologia de persistência

- **MySQL**

## 12. Diagrama geral da solução

```text
              ┌──────────────────┐
              │      Usuário     │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │    Front-end     │
              │ HTML + CSS + JS  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │     Back-end     │
              │ Node.js + Express│
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │    Banco de     │
              │     Dados       │
              │      MySQL      │
              └──────────────────┘
