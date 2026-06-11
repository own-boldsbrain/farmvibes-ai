# PRD — `vibe_dev.client`

## 1. JTBD (Jobs To Be Done)

| # | Job | Ator | Motivação | Critério de sucesso |
|---|-----|------|-----------|---------------------|
| 1 | **Conectar a um cluster FarmVibes remoto via SSH/HTTPS** | Engenheiro de ML / DevOps | Executar workflows em infraestrutura compartilhada sem acesso local ao cluster | `get_ppe_vibe_client()` retorna `FarmvibesAiClient` apontando para a URL do PPE |
| 2 | **Executar workflows localmente em subprocesso sem dependência de cluster** | Desenvolvedor de operações | Testar e debugar operações localmente durante o desenvolvimento | `SubprocessClient.run()` executa workflow e retorna `WorkflowRun` com outputs |
| 3 | **Fallback automático entre workflow registrado e arquivo YAML local** | Desenvolvedor de testes | Trabalhar com workflows em desenvolvimento que ainda não foram registrados no servidor | Se `workflow_name` não está em `list_workflows()`, carrega como caminho de arquivo YAML |
| 4 | **Monitorar status de execução local (pending → running → done/failed)** | Desenvolvedor de pipelines | Saber em tempo real se o workflow está executando, concluiu ou falhou | `SubprocessWorkflowRun.status` reflete `RunStatus` com mensagem de erro em caso de falha |
| 5 | **Deserializar outputs do workflow de volta para `DataVibe`** | Desenvolvedor de operações | Consumir resultados tipados do FarmVibes (geometrias, time_ranges, assets) | `_deserialize_to_datavibe` converte STAC items em `BaseVibeDict` via `StacConverter` |
| 6 | **Configurar storage local temporário para execução subprocesso** | Desenvolvedor de testes | Isolar execuções de teste sem poluir storage compartilhado | `get_default_subprocess_client` cria `LocalStorageConfig` com diretório cache + `LocalFileAssetManager` |
| 7 | **Propagar exceções ou engoli-las conforme necessidade do caller** | Desenvolvedor de pipelines | Decidir se falhas internas devem interromper o teste ou serem registradas | Parâmetro `raise_exception` controla se exceções são relançadas após callback de falha |

## 2. Descrição do Módulo

Implementações alternativas do cliente FarmVibes para ambientes de desenvolvimento e teste. Expõe `RemoteClient` (conexão SSH/HTTPS ao cluster PPE) e `SubprocessClient` (execução local em subprocesso via `LocalWorkflowRunner`).

## 3. Inputs

| Classe / Função | Parâmetros |
|----------------|-----------|
| `get_ppe_vibe_client` | `url: str = "https://ppe-terravibes-api.57fb76945e6d4b66a912.eastus.aksapp.io/"` |
| `SubprocessClient.__init__` | `factory_spec: OperationFactoryConfig`, `raise_exception: bool` |
| `SubprocessClient.run` | `workflow_name: str`, `geometry: BaseGeometry`, `time_range: Tuple[datetime, datetime]` |
| `get_default_subprocess_client` | `cache_dir: str` |

## 4. Outputs

| Classe / Função | Retorno |
|----------------|---------|
| `get_ppe_vibe_client` | `FarmvibesAiClient` |
| `SubprocessClient.run` | `SubprocessWorkflowRun` (implementa `WorkflowRun`) |
| `SubprocessWorkflowRun.status` | `str` — ex.: `"done"`, `"failed: <reason>"` |
| `SubprocessWorkflowRun.output` | `BaseVibeDict` — dicionário de `DataVibe` |
| `SubprocessClient.list_workflows` | `List[str]` |

## 5. Lógicas e Cálculos

**`SubprocessClient.run`:**
1. Cria uma instância `SubprocessWorkflowRun` com callbacks assíncronos.
2. Verifica se `workflow_name` está registrado em `list_workflows()`:
   - Sim: carrega com `load_workflow_by_name`.
   - Não: assume que é caminho de arquivo YAML e faz `Workflow.build(workflow_name)`.
3. Constrói `LocalWorkflowRunner` com workflow, `WorkflowIOHandler`, `factory_spec` e callback de estado.
4. Gera STAC item a partir da geometria e time_range via `gen_stac_item_from_bounds`.
5. Cria `input_spec` mapeando todas as entradas do workflow para o mesmo STAC item.
6. Executa `runner.run(input_spec)` — chamada assíncrona.
7. Em caso de sucesso: deserializa output via `_deserialize_to_datavibe` e dispara callback `WORKFLOW_FINISHED`.
8. Em caso de exceção: dispara callback `WORKFLOW_FAILED` com a mensagem de erro; relança se `raise_exception=True`.

**`SubprocessWorkflowRun._workflow_callback`:**
- Retorna closure assíncrono que mapeia `WorkflowChange` para `RunStatus` (`pending → running → done/failed`).
- Em caso de falha, armazena `reason` para exposição via `status`.

**`get_default_subprocess_client`:**
- Cria `LocalStorageConfig` com `local_path=cache_dir` e `LocalFileAssetManager` em subdiretório `assets/`.
- Monta `OperationFactoryConfig` com storage local + `AzureSecretProviderConfig`.
- Retorna `SubprocessClient` com `raise_exception=False`.
