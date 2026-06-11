# PRD — `vibe_dev.testing`

## 1. JTBD (Jobs To Be Done)

| # | Job | Ator | Motivação | Critério de sucesso |
|---|-----|------|-----------|---------------------|
| 1 | **Executar uma operação isolada (fora de workflow) com storage fake** | Desenvolvedor de operações | Testar o callback de uma operação sem depender de cluster, CosmosDB ou Blob Storage | `OpTester.run()` constrói a operação via `OperationFactory` com `FakeStorage` (store/retrieve = no-op) e executa o callback |
| 2 | **Salvar inputs e outputs de uma operação como referência para testes de regressão** | Desenvolvedor de testes | Gerar baseline de dados reais de uma operação para comparar em execuções futuras | `ReferenceSaver` copia assets para disco e serializa pares STAC (input, output) em `reference.json` |
| 3 | **Recuperar referências salvas e convertê-las de volta para `DataVibe`** | Desenvolvedor de testes de regressão | Reexecutar operações com mesmos inputs e comparar outputs contra baseline | `ReferenceRetriever.retrieve()` lê `reference.json`, conserta caminhos de assets e converte para `BaseVibeDict` via `StacConverter` |
| 4 | **Executar workflows completos localmente com runner configurável** | Desenvolvedor de integração | Validar orquestração de operações antes de submeter ao cluster | `WorkflowTestHelper.gen_workflow()` builda workflow YAML + `LocalWorkflowRunner` com storage spec |
| 5 | **Verificar que o output de um workflow contém os sinks esperados** | Desenvolvedor de integração | Garantir que o workflow produziu todas as saídas declaradas no YAML | `verify_workflow_result` confere que as chaves do output batem com a lista `sinks` do YAML |
| 6 | **Dispor de fixtures parametrizáveis de storage (local e remoto) para testes** | QA / DevOps | Rodar mesma suíte de testes contra storage local (rápido) e remoto (fidelidade) | `storage_spec` fixture com parametrização `"local"` / `"remote"`, criando `LocalStorageConfig` ou `CosmosStorageConfig` |
| 7 | **Criar tipos fictícios (`SimpleStrDataType`), operações fake e workflows YAML falsos** | Desenvolvedor de testes de unidade | Testar mecanismos de orquestração (gather, fan-out, herança) sem operações reais | `fake_workflow_path`, `fake_ops_dir`, `fake_workflows_dir` com 35+ YAMLs de topologias distintas |
| 8 | **Simular mensagens de execução de workflow (`WorkMessage`) para testar o message broker** | Desenvolvedor de infraestrutura | Validar serialização/deserialização de mensagens entre serviços | `workflow_execution_message` fixture builda `WorkMessage` com header, conteúdo e workflow YAML embutido |

## 2. Descrição do Módulo

Framework de testes para operações e workflows FarmVibes. Inclui `OpTester` para teste isolado de operações com storage fake, `ReferenceSaver`/`ReferenceRetriever` para baseline de regressão, `WorkflowTestHelper` para execução de workflows locais, e dezenas de fixtures pytest para workflows falsos, tipos fictícios e storage parametrizável.

## 3. Inputs

| Classe / Função | Parâmetros |
|----------------|-----------|
| `OpTester.__init__` | `path_to_config: str` (caminho para config YAML da operação) |
| `OpTester.run` | `**input_dict: Union[BaseVibe, List[BaseVibe]]` |
| `OpTester.update_parameters` | `parameters: Dict[str, Any]` |
| `ReferenceSaver.__init__` | `name`, `callback`, `storage`, `converter`, `inputs_spec`, `output_spec`, `version`, `dependencies`, `save_dir` |
| `ReferenceSaverFactory.__init__` | `storage: Storage`, `secret_provider: SecretProvider`, `save_dir: str` |
| `ReferenceRetriever.__init__` | `root_dir: str` |
| `ReferenceRetriever.retrieve` | `op_name: str` |
| `WorkflowTestHelper.gen_workflow` | `workflow_path: str`, `storage_spec: StorageConfig` |
| `WorkflowTestHelper.verify_workflow_result` | `workflow_path: str`, `result: OpIOType` |
| `get_fake_workflow_path` | `workflow_name: str` |
| `simple_op_spec` (fixture) | `SimpleStrData`, `tmp_path` |
| `storage_spec` (fixture) | `request` (param: `"local"` / `"remote"`), `tmp_path_factory`, `stac_container`, `asset_container` |

## 4. Outputs

| Classe / Função | Retorno |
|----------------|---------|
| `OpTester.run` | `BaseVibeDict` — output da operação |
| `ReferenceSaver.run` | `OpIOType` — STAC items serializados |
| `ReferenceRetriever.retrieve` | `List[List[BaseVibeDict]]` — pares `[input, output]` |
| `FakeStorage.store` / `retrieve` | `List[Item]` — pass-through (no-op) |
| `WorkflowTestHelper.get_groundtruth_for_workflow` | `List[str]` — nomes dos sinks |
| `WorkflowTestHelper.gen_workflow` | `WorkflowRunner` |

## 5. Lógicas e Cálculos

**`OpTester`:**
1. Construtor: cria `TemporaryDirectory`, `LocalFileAssetManager`, `FakeStorage` e parseia o spec da operação via `OperationParser.parse`.
2. `run(**input_dict)`: instancia `OperationFactory(storage_fake, AzureSecretProvider)`, builda `Operation` e chama `op.callback(**input_dict)` — execução síncrona direta.

**`FakeStorage`:**
- `store(items)`: retorna `items` sem side effects.
- `retrieve(input_item_dicts)`: retorna `input_item_dicts` sem side effects.
- `retrieve_output_from_input_if_exists(input_item)`: retorna o próprio `input_item` (simula cache hit).
- `remove(op_run_id)`: no-op.

**`ReferenceSaver`:**
1. Herda de `Operation` e intercepta `run()`.
2. No `run`: deserializa inputs, chama `super().run()` (execução real), depois serializa outputs.
3. Salva assets copiando arquivos para `save_dir/<op_name>/<asset_key>/` via `shutil.copy`.
4. Atualiza `reference.json` em `save_dir/<op_name>/` com pares `[{input_stac}, {output_stac}]` serializados.

**`ReferenceSaverFactory`:**
- Extende `OperationFactory` adicionando `save_dir`.
- `_build_impl`: resolve secrets, dependências e callable como factory normal, mas instancia `ReferenceSaver` em vez de `Operation`.

**`ReferenceRetriever`:**
1. `retrieve(op_name)`: lê `reference.json` de `root_dir/<op_name>/`.
2. Para cada par: `retrieve_op_io` deserializa STAC e conserta `asset.href` prefixando com `root_dir`.
3. `to_terravibes`: converte STAC items para `BaseVibeDict` via `StacConverter`.

**`WorkflowTestHelper`:**
1. `get_groundtruth_for_workflow`: lê YAML e retorna lista `sinks`.
2. `verify_workflow_result`: compara chaves do resultado com sinks usando `assertCountEqual` e valida que valores são dicts ou lists não vazios.
3. `gen_workflow`: builda `Workflow` do YAML, `WorkflowIOHandler`, `LocalWorkflowRunner` com `OperationFactoryConfig` e `storage_spec`, e seta `runner.is_workflow = lambda: False` para simular execução.

**Fixtures de storage (`storage_spec`):**
- Parametrizada por `request.param`: `"local"` ou `"remote"`.
- `"local"`: cria `LocalStorageConfig` com `tmp_path` + `LocalFileAssetManager`.
- `"remote"`: cria `CosmosStorageConfig` com `BlobAssetManagerConfig`, testa conexão via `CosmosStorage.container_proxy`, e agenda cleanup dos containers no final da sessão.

**Fixtures de fake workflows:**
- `fake_workflow_path`: fixture parametrizada (ex.: `"item_gather"`) que retorna caminho absoluto para YAML em `fake_workflows/`.
- `fake_ops_dir` / `fake_workflows_dir`: retornam caminhos absolutos para diretórios com ops e workflows falsos.
- `workflow_execution_message`: constrói `WorkMessage` com header aleatório, `SimpleStrData` como input e workflow YAML embutido.

**`SimpleStrDataType`:**
- Dataclass que estende `BaseVibe` com campo `data: str` — tipo fictício para testes de operações que manipulam strings.
