# Etapa 04 — Interatividade com JavaScript

## Funcionalidades
- Cadastro de tarefas com validação dos campos obrigatórios.
- Marcação de tarefa como concluída.
- Exclusão de tarefa com confirmação.
- Atualização dinâmica do calendário e troca de meses.

## Arquivos
`script.js` concentra a lógica. `cadastro.html`, `index.html` e `detalhes.html` usam as funcionalidades. `style.css` mantém a aparência e os estados visuais.

## Conceitos
Foram usados DOM, eventos, funções, arrays, `forEach`, `filter`, `find`, `localStorage` e atualização dinâmica da interface.

## Validações
O cadastro é bloqueado se título, data, horário ou categoria estiverem vazios. A exclusão pede confirmação. Também há tratamento quando uma tarefa não é encontrada.

## Como testar
1. Abra `index.html`.
2. Troque os meses pelos botões.
3. Entre em `Nova tarefa`.
4. Tente cadastrar sem preencher os campos obrigatórios.
5. Cadastre uma tarefa e veja-a no calendário.
6. Abra a tarefa e teste concluir e excluir.

## Matriz de evidências

| Requisito | Funcionalidade | Arquivo(s) | Evidência |
|---|---|---|---|
| Manipulação do DOM | Calendário e detalhes | `script.js` | `createElement`, `textContent` |
| Tratamento de eventos | Botões e formulário | `script.js` | `onclick` e `onsubmit` |
| Validação de formulário | Cadastro | `script.js` | Verificação dos campos |
| Alteração dinâmica | Calendário/status | `script.js` | `mostrarCalendario()` |
| Funções | Todas | `script.js` | Funções do sistema |
| Arrays | Tarefas e meses | `script.js` | `tarefas`, `meses` |
| Iteração | Exibição das tarefas | `script.js` | `forEach()` e `filter()` |
| Situações inválidas | Cadastro/exclusão | `script.js` | Mensagens e confirmação |

## Tag
`etapa-04`
