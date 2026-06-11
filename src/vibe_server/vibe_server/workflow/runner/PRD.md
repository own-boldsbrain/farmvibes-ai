# PRD — Workflow Execution Engine (Runner, Remote Runner, Task I/O)

## JTBDs (Jobs To Be Done)

1. **Executar workflows como DAG assíncrono com paralelismo entre níveis** — O `WorkflowRunner._run_graph_impl()` itera os níveis do DAG (ordem topológica) e executa todas as tasks de cada nível concorrentemente via `asyncio.gather`, respeitando as dependências entre níveis.

2. **Gerenciar fan-out/fan-in de dados entre operações** — O `OpParallelism` coordena a distribuição (fan-out) de uma entrada de operação em múltiplos subtasks paralelos quando há arestas `scatter`/`parallel`, e a coleta (fan-in) dos resultados de volta em uma única saída consolidada.

3. **Roteamento e cache de I/O entre nós do workflow** — O `TaskIOHandler` mantém maps de entrada/saída para cada nó, adiciona sources no início, recupera inputs de cada operação, armazena resultados, e coleta outputs dos sinks ao final, garantindo que cada porta seja escrita exatamente uma vez.

4. **Executar operações remotamente via mensageria Dapr/pubsub** — O `RemoteWorkflowRunner` substitui a execução local por envio de mensagens `ExecuteRequestMessage` para workers remotos, utilizando `MessageRouter` para rotear respostas de volta ao chamador, com suporte a mensagens ACK, reply e error.

5. **Reportar mudanças de estado do workflow em tempo real** — Ambos os runners aceitam um `WorkflowCallback` que é invocado para cada transição de estado (`WORKFLOW_STARTED`, `TASK_STARTED`, `SUBTASK_QUEUED`, `SUBTASK_RUNNING`, `SUBTASK_FINISHED`, `SUBTASK_FAILED`, `WORKFLOW_FINISHED`, `WORKFLOW_FAILED`, `WORKFLOW_CANCELLED`).

6. **Suportar cancelamento seguro de workflows em execução** — O runner define `is_cancelled = True` e todas as operações em andamento (`_submit_op`, `_wait_for_reply`) verificam esta flag, levantando `CancelledOpError` para interromper a execução gracefulmente.

7. **Mapear inputs/outputs externos para o formato interno do workflow** — `WorkflowIOHandler.map_input()` traduz as chaves do `user_input` (nomes das sources externas) para o formato interno (nó.porta), e `map_output()` faz o caminho inverso para os sinks, permitindo que o workflow seja acionado com uma interface simplificada.

## Descrição do Módulo

Motor de execução de workflows: `WorkflowRunner` (base abstrata com execução assíncona de DAG, paralelismo e callbacks), `RemoteWorkflowRunner` (execução distribuída via mensageria Dapr com `MessageRouter` para roteamento de replies), e `TaskIOHandler`/`WorkflowIOHandler` (gerenciamento de I/O entre nós do grafo, incluindo sources, sinks e cache de resultados intermediários).

## Inputs

| Classe/Função | Parâmetros Principais |
|---|---|
| `WorkflowRunner.__init__()` | `workflow: Workflow`, `io_mapper: WorkflowIOHandler`, `update_state_callback: WorkflowCallback` |
| `WorkflowRunner.run()` | `input_items: OpIOType`, `run_id: UUID` |
| `RemoteWorkflowRunner.__init__()` | `message_router: MessageRouter`, `workflow: Workflow`, `traceid: str`, `pubsubname`, `source`, `topic` |
| `OpParallelism.__init__()` | `in_edges: List[EdgeLabel]`, `op: GraphNodeType`, `run_task: Callable`, `update_state_callback` |
| `TaskIOHandler.__init__()` | `workflow: Workflow` |
| `WorkflowIOHandler.__init__()` | `workflow: Workflow` |
| `MessageRouter.__init__()` | `inqueue: asyncio.Queue[WorkMessage]` |
| `TaskIOHandler.add_sources()` | `values: OpIOType` |
| `TaskIOHandler.add_result()` | `task: GraphNodeType`, `value: OpIOType` |

## Outputs

| Classe/Função | Retorno |
|---|---|
| `WorkflowRunner.run()` | `OpIOType` — dicionário com outputs mapeados pelos sinks |
| `WorkflowRunner.cancel()` | `None` — marca `is_cancelled = True` e reporta `WORKFLOW_CANCELLED` |
| `OpParallelism.run()` | `List[OpIOType]` — lista de outputs de cada subtask |
| `OpParallelism.fan_in()` | `OpIOType` — consolida lista de outputs em um único dict |
| `TaskIOHandler.retrieve_input()` | `OpIOType` — input consolidado para uma task |
| `TaskIOHandler.retrieve_sinks()` | `OpIOType` — outputs finais mapeados para sinks |
| `WorkflowIOHandler.map_input()` | `OpIOType` — inputs mapeados para formato interno `nó.porta` |
| `WorkflowIOHandler.map_output()` | `OpIOType` — outputs mapeados de volta para nomes de sinks |
| `MessageRouter.route_messages()` | `None` (roda como task asyncio contínua) |
| `RemoteWorkflowRunner._run_op_impl()` | `OpIOType` — output da operação remota |

## Lógicas e Cálculos

- **Execução do DAG**: `_run_graph_impl()` percorre `self.workflow` (que implementa `__iter__` retornando níveis topológicos). Para cada nível, `_run_ops()` cria um `OpParallelism` por operação, dispara `asyncio.create_task` para cada uma, e `_monitor_futures()` aguarda todas via `asyncio.gather`. Se alguma falha, cancela as demais e reporta `WORKFLOW_FAILED`. Ao final de cada nível, `gc.collect()` é chamado para liberar memória.

- **Fan-out**: `OpParallelism.fan_out()` identifica portas paralelas (aquelas conectadas por arestas `parallel` ou `scatter`). Usa `align()` para garantir que listas de diferentes portas tenham o mesmo tamanho (ou tamanho 1 para replicação). Cada combinação alinhada gera um conjunto de inputs para um subtask. Se uma porta paralela tem 5 elementos e outra tem 1, o elemento único é replicado 5 vezes.

- **Fan-in**: `OpParallelism.fan_in()` coleta os outputs de todos os subtasks. Se alguma aresta de entrada for paralela, consolida os outputs em listas (um item de cada subtask por chave). Senão, retorna o único output diretamente.

- **Execução local**: O método abstrato `_run_op_impl()` deve ser implementado por subclasses. No caso local, executa a operação inline. No caso remoto, constrói e envia uma mensagem.

- **Execução remota**: `RemoteWorkflowRunner._build_and_process_request()` constrói um `ExecuteRequestMessage` com `op_spec` e `input`, envia via Dapr pubsub (`send_async`), e entra em loop aguardando reply. Mensagens `ack` atualizam o estado (`SUBTASK_RUNNING`). Mensagens `execute_reply` ou `error` finalizam o ciclo. O loop verifica `is_cancelled` a cada iteração.

- **MessageRouter**: Roteia mensagens de uma `inqueue` compartilhada para filas específicas por `parent_id` (ID da requisição). Uma task asyncio contínua (`route_messages`) consume a `inqueue` com timeout de 0.2s e distribui para `self.message_map[msg.parent_id]`. `get()` bloqueia até a mensagem chegar na fila apropriada.

- **I/O Handler**: `TaskIOHandler._parse_workflow()` percorre todas as arestas do workflow: para cada origem-destino, adiciona a lista de I/O como referência compartilhada (mesmo objeto `list` é compartilhado entre output de origem e input de destino, permitindo que escrita e leitura operem sobre a mesma estrutura). Sources são populados via `add_sources()`. Sinks são coletados via `retrieve_sinks()`. O `__del__` faz cleanup chamando `pop()` em cada lista para evitar vazamento de memória.

- **Mapeamento de I/O externo**: `WorkflowIOHandler.map_input()` usa `workflow.source_mappings` para traduzir chaves do input do usuário (ex.: `"weather_data"`) para o formato interno (`"task1.input_port"`). `map_output()` faz o inverso usando `sink_mappings`.

- **Tratamento de erros**: `_fail_workflow()` loga a exceção e dispara `WORKFLOW_FAILED`. `CancelledOpError` é propagado silenciosamente. `_monitor_futures()` usa `return_exceptions=True` no `gather` e inspeciona cada resultado; se for exceção (exceto `CancelledOpError`), cancela o gather e relança.
