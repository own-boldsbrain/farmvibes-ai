# PRD — tests

## 1. Nome do Módulo

**tests** — Suíte de testes integrados e unitários para a plataforma FarmVibes AI.

## 2. JTBDs (Jobs To Be Done)

- Validar a API REST do servidor (criação, execução, consulta de workflows)
- Testar construção e validação de grafos de operações
- Verificar execução correta do cliente subprocesso
- Garantir consistência de metadados em notebooks
- Validar integração com cluster remoto via testes de cluster
- Fornecer fixtures e configuração compartilhada para todos os testes

## 3. Casos de Uso

| Caso de Uso | Descrição |
|---|---|
| Teste de criação de workflow via REST | Envia POST /workflows e verifica resposta 201 com ID |
| Teste de validação de workflow subprocesso | Executa workflow com `SubprocessClient` e valida outputs |
| Teste de grafo de operações | Constrói `WorkflowGraph` programaticamente e valida conexões |
| Teste de metadados de notebook | Verifica se notebooks exportados têm metadados corretos (tool, duration) |
| Teste de cluster remoto | Conecta a cluster real (Kubernetes) e executa workflow completo |
| Teste de operação isolada | Usa `op_tester` para testar operação individual com inputs controlados |
| Teste de storage fixtures | Testa diferentes configurações de storage (local, Cosmos, Blob) |

## 4. Faz / Não Faz

**Faz:**

- Testa endpoints REST do vibe_server via `httpx.AsyncClient`
- Testa execução de workflows via `SubprocessClient`
- Testa construção e validação de grafos de operações
- Testa metadados de notebooks exportados
- Fornece fixtures parametrizadas para storage, clientes e operações
- Executa testes de integração contra cluster Kubernetes real

**Não Faz:**

- Não testa bibliotecas de terceiros (Airbus, COMET, etc.)
- Não cobre interface de usuário
- Não gera relatórios de cobertura (delegado ao pytest)
- Não executa testes de performance (apenas funcionais)

## 5. Users Inputs / Outputs

**Inputs:**

- `StorageConfig` fixture — configuração de storage (local ou remoto)
- `SubprocessClient` fixture — cliente subprocesso configurado
- YAMLs de operações — especificações para construção de grafos
- Payloads JSON — requisições para API REST
- Notebooks `.ipynb` — arquivos para validação de metadados

**Outputs:**

- Resultados `assert` do pytest — pass/fail
- Logs de execução — debug de workflows
- WorkflowRuns com status e outputs — validação de execução

## 6. System Outputs

- Relatório pytest exit code (0 = sucesso, !=0 = falha)
- Fixtures compartilhadas entre módulos de teste
- Workflows executados e limpos (teardown via fixtures)
- Metadados extraídos de arquivos `.ipynb`

## 7. Outcomes Esperados

- Confiança na API REST antes de deploy
- Regressão detectada automaticamente em CI/CD
- Cobertura de fluxos críticos (criação, execução, consulta, deleção)
- Onboarding rápido de novos contribuidores via testes como documentação viva

## 8. APIs / Endpoints

Os testes exercem todas as rotas do vibe_server:

| Método | Rota | Testado em |
|---|---|---|
| GET | /health | `test_rest_api::test_health` |
| POST | /workflows | `test_rest_api::test_create_workflow` |
| GET | /workflows/{id} | `test_rest_api::test_get_workflow` |
| GET | /workflows/{id}/status | `test_rest_api::test_workflow_status` |
| DELETE | /workflows/{id} | `test_rest_api::test_delete_workflow` |
| GET | /operations | `test_rest_api::test_list_operations` |
| GET | /workflows/{id}/outputs/{node_id} | `test_rest_api::test_get_output` |

Além disso, testa internamente:

- `WorkflowGraph.add_node()`, `add_edge()`, `validate()` — `test_ops_building`
- `SubprocessClient.run()`, `list_workflows()` — `test_subprocess_client`
- `nbconvert` metadata extraction — `test_notebooks`

## 9. CRUD

| Operação | Entidade | Teste |
|---|---|---|
| Create | Workflow via REST | `test_create_workflow` |
| Read | Workflow list | `test_list_workflows` |
| Read | Workflow details | `test_get_workflow` |
| Read | Workflow status | `test_workflow_status` |
| Read | Workflow outputs | `test_get_output` |
| Read | Operations catalog | `test_list_operations` |
| Delete | Workflow | `test_delete_workflow` |
| Create | Workflow via subprocess | `test_subprocess_client` |
| Create | Workflow graph | `test_ops_building` |

## 10. Schemas de Dados

| Schema / Tipo | Uso em testes |
|---|---|
| `StorageConfig` | Fixture parametrizada (`local`, `cosmos`, `blob`) |
| `WorkflowCreate` | Payload de criação de workflow |
| `WorkflowResponse` | Resposta esperada da API |
| `WorkflowStatus` | Enum de estados validados |
| `WorkflowGraph` | Grafo construído e validado em `test_ops_building` |
| `NotebookMetadata` | Metadados extraídos de `.ipynb` |

## 11. Datasets / Tipos

- Geometrias de teste (GeoJSON simplificado)
- Períodos de teste (intervalos curtos para velocidade)
- Operações de teste (`test_op` simples com `SimpleStrDataType`)
- Dados mockados para subprocesso (`FakeStorage`, `MockRequest`)
- Notebooks de exemplo para validação de metadados

## 12. Lógicas e Cálculos

- **Validação de status**: Asserts comparam status retornado com enum `WorkflowStatus.PENDING / RUNNING / SUCCESS`
- **Validação de metadados**: Parsing de notebook JSON para extrair `tool`, `duration` e metadados do executor
- **Fan-out em testes**: Testes constroem grafos com paralelismo para verificar `OpParallelism.fan_out()`
- **Cobertura de transições**: Testes verificam corrida completa de estados (pending → running → success)
- **Teardown**: Fixtures pytest limpam workflows e arquivos temporários pós-teste
- **Testes parametrizados**: `@pytest.mark.parametrize` varia storage config, operações e geometrias

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Módulo | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | Teste de API de workflows de irradiância | Garantia de disponibilidade de endpoints |
| Geração Eólica | Onshore, Offshore | Teste de subprocess client para forecasts | Validação offline de pipelines |
| Geração Hidrelétrica | UHE, PCH, CGH | Teste de grafos de operações de reservatório | Correção de chains multi-etapa |
| Biomassa / Bioenergia | Cana, Floresta, Resíduos, Biogás | Teste de operações de NDVI/biomassa | Assertividade de operações agronômicas |
| Distribuição de Energia | Concessionárias, Permissionárias | Teste de cluster remoto | Confiabilidade de deployment distribuído |
| Comercialização | Comercializadores, Autoprodutores | Teste de DELETE e lifecycle de workflows | Governança de pipelines comercial |
| Eficiência Energética | Irrigação, Estufas | Teste de metadata de notebooks | Reprodutibilidade de análises |
| Óleo e Gás | Exploração, Transporte | Teste de integração REST + subprocess | Resiliência de pipelines geoespaciais |
| Mercado de Carbono | REDD+, Agricultura baixo carbono | Teste de validação de especificações | Conformidade de chains de MRV |
