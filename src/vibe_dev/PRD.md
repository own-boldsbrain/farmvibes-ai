# PRD — vibe_dev

## 1. Nome do Módulo

**vibe_dev** — Pacote de desenvolvimento e testes para a plataforma FarmVibes AI.

## 2. JTBDs (Jobs To Be Done)

- Executar workflows localmente sem dependência de cluster Kubernetes
- Testar operações e workflows unitariamente com storage fake
- Criar fixtures reutilizáveis para suítes de teste
- Simular execução subprocesso para desenvolvimento offline
- Conectar-se a ambientes remotos (PPE) para validação

## 3. Casos de Uso

| Caso de Uso | Descrição |
|---|---|
| Execução local de workflow | Desenvolvedor executa um workflow YAML via `LocalWorkflowRunner` |
| Teste de operação isolada | Usa `OpTester` para instanciar e chamar `Operation.callback()` |
| Teste de workflow completo | Usa `WorkflowTestHelper` para construir e executar workflows |
| Cliente subprocesso | `SubprocessClient` executa workflow sem servidor REST |
| Cliente remoto PPE | `get_ppe_vibe_client()` conecta ao ambiente de staging |
| Fixtures de storage | Configura storage local ou Cosmos/Blob para testes parametrizados |
| Salvamento de referência | `ReferenceSaver` persiste inputs/outputs para testes de regressão |

## 4. Faz / Não Faz

**Faz:**
- Executa workflows em subprocesso ou thread local
- Fornece storage fake (`FakeStorage`) para testes
- Gera fixtures pytest para workflows, operações e storage
- Salva e recupera dados de referência para testes de regressão

**Não Faz:**
- Não substitui o cluster Kubernetes para produção
- Não implementa escalonamento horizontal
- Não persiste estado entre execuções (exceto referências)

## 5. Users Inputs / Outputs

| Input | Output |
|---|---|
| Caminho de YAML de operação | `BaseVibeDict` com resultados da operação |
| Nome do workflow + geometria + período | `SubprocessWorkflowRun` com status e output |
| Configuração de storage (local/remote) | `StorageConfig` pronto para injeção |
| Fixtures pytest | Objetos `SimpleStrDataType`, `OperationSpec`, etc. |

## 6. System Outputs

- `LocalWorkflowRunner` — resultado `OpIOType` após executar grafo
- `OpTester.run()` — `BaseVibeDict` com dados convertidos
- `SubprocessClient.run()` — `WorkflowRun` com status e outputs deserializados
- Arquivos JSON de referência no diretório de saída

## 7. Outcomes Esperados

- Curva de aprendizado reduzida para novos desenvolvedores
- Testes unitários mais rápidos (sem dependência de cluster)
- Cobertura de regressão com dados de referência versionados
- Ambiente de desenvolvimento reproduzível

## 8. APIs / Endpoints

Não expõe API HTTP. As interfaces públicas são:

- `LocalWorkflowRunner.build()` + `.run()`
- `SubprocessClient.run()` + `.list_workflows()`
- `OpTester.run()` + `.update_parameters()`
- `WorkflowTestHelper.gen_workflow()` + `.verify_workflow_result()`
- `get_ppe_vibe_client(url) -> FarmvibesAiClient`
- `get_default_subprocess_client(cache_dir) -> SubprocessClient`

## 9. CRUD

| Operação | Entidade | Função |
|---|---|---|
| Create | Execução de workflow | `SubprocessClient.run()` / `LocalWorkflowRunner.run()` |
| Read | Lista de workflows | `SubprocessClient.list_workflows()` |
| Read | Dados de referência | `ReferenceRetriever.retrieve()` |

## 10. Schemas de Dados

| Schema | Descrição |
|---|---|
| `SimpleStrDataType` | DataVibe com campo `data: str` para testes |
| `Request` | Mock Pydantic para simular respostas HTTP |
| `SubprocessWorkflowRun` | Implementação local de `WorkflowRun` |
| `ReferenceSaver` | Operation que salva inputs/outputs + assets |

## 11. Datasets / Tipos

- `DataVibe`, `BaseVibe`, `TypeDictVibe` (do `vibe_core`)
- STAC Items serializados/deserializados
- `Sentinel1Raster`, `Sentinel2Raster` (usados em fixtures)

## 12. Lógicas e Cálculos

- **Resolução de dependências**: `OperationDependencyResolver.resolve()` analisa grafo de dependências entre operações
- **Fan-out de input**: `OpParallelism.fan_out()` alinha listas de inputs de diferentes fontes
- **Combinação de status**: `WorkflowStateUpdate._combine_children_status()` propaga status de subtarefas para tarefas/workflow

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Módulo | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | Teste de operações de irradiância/chaveamento | Pipeline de validação contínua de novos operadores |
| Geração Eólica | Onshore, Offshore | Teste de operações meteorológicas | Garantia de qualidade em forecasts eólicos |
| Geração Hidrelétrica | UHE, PCH, CGH | Teste de chains de sensoriamento remoto | Assertividade em séries históricas de vazão |
| Biomassa / Bioenergia | Cana, Floresta, Resíduos, Biogás | `OpTester` + `ReferenceSaver` para operações agronômicas | Rastreabilidade de versões de modelos |
| Distribuição de Energia | Concessionárias, Permissionárias | Teste de integração de workflows distribuídos | Confiabilidade em pipelines de dados geoespaciais |
| Comercialização | Comercializadores, Autoprodutores | Simulação local de execução de workflows | Redução de custos de homologação |
| Eficiência Energética | Irrigação, Estufas | `SubprocessClient` para testes offline | Agilidade no desenvolvimento de novos sensores |
| Óleo e Gás | Exploração, Transporte | Teste de operações de radar e óptico | Precisão em pipelines de monitoramento |
| Mercado de Carbono | REDD+, Agricultura baixo carbono | `ReferenceSaver` para validação de offsets | Auditoria de resultados com dados de referência |
