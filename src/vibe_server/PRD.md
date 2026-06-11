# PRD — vibe_server

## 1. Nome do Módulo

**vibe_server** — Servidor REST e orquestrador de workflows para a plataforma FarmVibes AI.

## 2. JTBDs (Jobs To Be Done)

- Receber requisições HTTP para criação e gerenciamento de workflows
- Orquestrar execução distribuída de operações via mensageria (Dapr)
- Validar especificações de operações e workflows (parsing, tipos, descrições)
- Gerenciar inputs e parâmetros de execução
- Executar workflows localmente ou remotamente com suporte a retry
- Persistir e servir resultados de execução via href handlers (local/blob)
- Monitorar execução via sniffer de mensagens

## 3. Casos de Uso

| Caso de Uso | Descrição |
|---|---|
| Criar workflow | Cliente POST /workflows com payload especificando operações e conexões |
| Executar workflow | Servidor dispara execução via runner local ou remoto |
| Consultar status | Cliente GET /workflows/{id}/status para acompanhamento |
| Listar operações | GET /operations devolve catálogo de operações disponíveis |
| Validar especificação | Parsing + validação de tipos + validação de descrição |
| Execução com Dapr | Orquestrador publica eventos em pub/sub e coordena workers |
| Sniffer de mensagens | Monitoramento e log de todas as mensagens do sistema |
| Input handling | Resolução de inputs inline, uri, data:// e heredado |

## 4. Faz / Não Faz

**Faz:**

- Expõe API REST (FastAPI) para criação e monitoramento de workflows
- Orquestra execução com estado transicional (pending → running → success/failure)
- Valida especificações de operações (sintaxe, tipos, descrições)
- Suporta runners local (subprocesso) e remoto (Dapr/Kubernetes)
- Gerencia hrefs de assets (local file system e Azure Blob Storage)

**Não Faz:**

- Não processa dados geoespaciais diretamente (delega às operações)
- Não implementa interface de usuário web
- Não gerencia autenticação/autorização de usuários
- Não faz escalonamento automático de workers

## 5. Users Inputs / Outputs

| Input | Output |
|---|---|
| POST /workflows → `WorkflowCreate` (payload JSON) | `WorkflowResponse` com ID e status |
| GET /workflows/{id}/status | `WorkflowStatusResponse` com estado atual |
| GET /operations | Lista de operações disponíveis (`OperationDescription`) |
| GET /workflows/{id}/outputs/{node_id} | Resultado da operação (JSON ou href) |
| Sniffer config (namespace, pubsub) | Stream de mensagens logadas |

## 6. System Outputs

- `WorkflowRun` — objeto com ID, status, grafos, outputs e metadados
- `OperationDescription` — schema, inputs, outputs, parâmetros de cada operação
- Mensagens Dapr pub/sub — eventos de transição de estado do workflow
- Logs do sniffer — mensagens formatadas do barramento
- Assets servidos via href — arquivos locais ou blobs

## 7. Outcomes Esperados

- API consistente para todos os clientes (CLI, Web, Notebook)
- Execução confiável de workflows longos com estado rastreável
- Validação prévia de especificações antes da execução
- Flexibilidade de deployment (local, Dapr, Kubernetes)
- Observabilidade via sniffer de mensagens

## 8. APIs / Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | / | Health check |
| GET | /workflows | Lista workflows existentes |
| POST | /workflows | Cria novo workflow |
| GET | /workflows/{id} | Detalhes do workflow |
| GET | /workflows/{id}/status | Status atual do workflow |
| DELETE | /workflows/{id} | Cancela/deleta workflow |
| GET | /workflows/{id}/outputs/{node_id} | Outputs de um nó específico |
| GET | /operations | Lista operações disponíveis |
| POST | /operations/validate | Valida especificação de operação |
| POST | /register | Registra nova operação |
| GET | /workflows/{id}/resources | Recursos alocados do workflow |

## 9. CRUD

| Operação | Entidade | Rota/Função |
|---|---|---|
| Create | Workflow | `POST /workflows` |
| Read | Workflow list | `GET /workflows` |
| Read | Workflow details | `GET /workflows/{id}` |
| Read | Workflow status | `GET /workflows/{id}/status` |
| Read | Workflow outputs | `GET /workflows/{id}/outputs/{node_id}` |
| Read | Operation catalog | `GET /operations` |
| Delete | Workflow | `DELETE /workflows/{id}` |
| Create | Operation (register) | `POST /register` |

## 10. Schemas de Dados

| Schema | Descrição |
|---|---|
| `WorkflowCreate` | Payload de criação (operação ID, inputs, parâmetros, geometria, período) |
| `WorkflowResponse` | Resposta com ID, status, criação, grafos |
| `WorkflowStatusResponse` | Status atual + histórico de transições |
| `OperationDescription` | Schema da operação (inputs, outputs, parâmetros, descrição) |
| `WorkflowGraph` | Grafo direcionado de operações (nodes + edges) |
| `Parameter` | Parâmetros tipados de operações |
| `WorkflowStateUpdate` | Mensagem de transição de estado (workflow_id, node_id, novo status) |

## 11. Datasets / Tipos

- `Geometry` — GeoJSON para delimitação espacial
- `TimeRange` — período de interesse (início/fim)
- `DataVibe` / `TypeDictVibe` — tipos de dados do core da plataforma
- `Raster` / `GeoJSON` — tipos de output comuns
- `InlineData` / `UriData` — encapsulamento de inputs (inline ou por URI)
- `DataFrame` — outputs tabulares de operações de estatística

## 12. Lógicas e Cálculos

- **Resolução de inputs**: `InputResolver` lida com `data:` URIs, referências a outros nós, valores inline e herança (`InheritedValue`)
- **Validação de workflow**: `SpecParser.validade_spec()` checa tipagem, dependências e ciclos no grafo
- **Transição de estados**: Orquestrador atualiza estado via máquina de estados: `PENDING → RUNNING → SUCCESS / FAILURE`; estados filhos propagam para o pai
- **Sniffer**: Conecta-se a pub/sub component do Dapr, filtra mensagens por namespace e faz log com timestamp
- **Href handlers**: `LocalHrefHandler` resolve paths locais; `BlobHrefHandler` faz upload/download de Azure Blob Storage
- **Runner dispatch**: `WorkflowRunner.run()` decide entre `LocalRunner` (subprocesso) ou `DaprOrchestrator` (distribuído)
- **Resolução de parâmetros**: `ParameterResolver` aplica defaults, coerção de tipos e validação de constraints
- **Tratamento de fan-out**: `OpParallelism` cria nós paralelos para listas de inputs

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Módulo | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | API para workflows de previsão solar; orquestração de chains de irradiância | Automação de pipelines de forecast |
| Geração Eólica | Onshore, Offshore | Criação remota de workflows de vento; consulta de outputs | Infraestrutura para previsão operacional |
| Geração Hidrelétrica | UHE, PCH, CGH | Workflows de monitoramento de reservatório com validação de spec | Confiabilidade em chains de sensoriamento |
| Biomassa / Bioenergia | Cana, Floresta, Resíduos, Biogás | API para workflows sazonais de biomassa; deleção de workflows antigos | Ciclo de vida de pipelines agrícolas |
| Distribuição de Energia | Concessionárias, Permissionárias | Runners locais para inspeção de ativos; orquestração distribuída | Flexibilidade de deployment por região |
| Comercialização | Comercializadores, Autoprodutores | API de consulta de status para SLA de previsão | Transparência em execução de contratos |
| Eficiência Energética | Irrigação, Estufas | Sniffer para auditoria de execução; href handlers para assets | Rastreabilidade de dados de sensores |
| Óleo e Gás | Exploração, Transporte | Orquestração Dapr para workflows geoespaciais complexos | Escalabilidade em monitoramento de áreas |
| Mercado de Carbono | REDD+, Agricultura baixo carbono | Endpoints de validação de operações; deleta workflows (descomissionamento) | Governança de pipelines de MRV |
