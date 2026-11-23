# Etapa 05 — Modularização e comunicação assíncrona

## Organização

O código JavaScript foi dividido em três arquivos para separar as responsabilidades:

- `js/api.js`: contém o serviço simulado e as operações com os dados.
- `js/tarefas.js`: organiza as funções utilizadas pelas páginas.
- `js/app.js`: controla os eventos e atualiza a interface.

## Comunicação assíncrona

O serviço simulado utiliza `Promise`, `async/await` e um pequeno atraso para representar o tempo de resposta. Ele permite consultar tarefas, enviar uma nova tarefa, atualizar sua situação e excluir registros. Os dados são mantidos no `localStorage` do navegador.

## Tratamento das operações

- **Carregamento:** a interface informa quando está consultando ou enviando dados.
- **Sucesso:** apresenta uma mensagem quando a operação termina corretamente.
- **Erro:** utiliza `try/catch` para apresentar uma mensagem quando a operação falha.

## Como testar

1. Inicie pelo arquivo `iniciar.bat` (Windows PowerShell) ou por um servidor local. Acesse o endereço HTTP mostrado no navegador; não abra o HTML diretamente pelo endereço `file:///`, pois os módulos JavaScript precisam ser servidos por HTTP.
2. No calendário, observe o carregamento e a exibição das tarefas.
3. Cadastre uma tarefa e confira a mensagem de sucesso.
4. Abra a tarefa no calendário e teste a consulta dos detalhes, a conclusão e a exclusão.
5. Para simular uma falha, acesse `http://localhost:8000/index.html?falha=1`. Para testar o cadastro com erro, use `http://localhost:8000/cadastro.html?falha=1`.

## Relação com os requisitos

| Requisito | Implementação |
|---|---|
| Separação em módulos | `api.js`, `tarefas.js` e `app.js` |
| Chamadas assíncronas | Funções `async` nos módulos |
| Fetch/Axios ou mecanismo equivalente | Serviço simulado baseado em Promises |
| Promises e async/await | Operações de consulta, cadastro, atualização e exclusão |
| Estado de carregamento | Mensagens e bloqueio temporário do botão durante o envio |
| Tratamento de erros | `try/catch` e mensagens na interface |
| Dados externos ou serviço simulado | Serviço simulado com armazenamento no navegador |

## Observação

O serviço é simulado no próprio navegador; não existe conexão com uma API remota. O `localStorage` é utilizado para manter os dados entre acessos.
