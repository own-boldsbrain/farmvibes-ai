# PRD — vibe_agent

## Visão Geral

O pacote `vibe_agent` implementa a camada de execução distribuída do FarmVibes.AI. Ele gerencia o ciclo de vida completo de operações (ops) de processamento geoespacial: recebimento de mensagens via pub/sub Dapr, resolução de cache, execução em processos filhos, armazenamento de resultados em catálogos STAC, e gerenciamento de metadados de execução. Opera em três serviços distintos — Cache, DataOps e Worker — que se comunicam via Dapr.

---

## 1. Cache

### Nome do Módulo

`Cache` (`cache.py`, `cache_metadata_store.py`, `cache_metadata_store_client.py`, `launch_cache.py`)

### Descrição

Serviço responsável por interceptar requisições de execução de operações, verificar se o resultado já existe em cache (através de um hash dos inputs + parâmetros), e evitar recomputação desnecessária. Mantém metadados de relacionamento entre workflows, ops executadas e assets em um Redis.

### JTBDs

- Evitar recomputação de operações cujo resultado já foi armazenado
- Rastrear quais operações foram executadas em cada workflow
- Rastrear quais assets foram produzidos por cada execução de operação
- Fornecer dados de cache para o DataOps Manager realizar limpeza

### Casos de Uso

1. Cache hit: resultado existe → envia reply de sucesso imediato
2. Cache miss: resultado não existe → encaminha mensagem ao Worker para execução
3. Gerenciamento de referências: associa run_id → op_run_id → assets
4. Recuperação de assets e runs associados a uma operação

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Verificar existência de resultados via hash | Executar operações diretamente |
| Gerenciar referências no Redis | Armazenar dados binários de assets |
| Encaminhar mensagens ao Worker via pub/sub | Gerenciar estado de workflow |
| Fornecer API de consulta de metadados para DataOps | Expor interfaces HTTP públicas |

### Users Inputs / Outputs

- **Input**: Mensagem `ExecuteRequestMessage` via tópico `cache-commands`
- **Output**: Mensagem `ExecuteReplyMessage` (cache hit) ou `CacheInfoExecuteRequestMessage` (cache miss → worker)

### System Outputs

- Confirmação de cache hit publicada no tópico `updates`
- Mensagem de execução publicada no tópico `commands` para o Worker
- Referências armazenadas no Redis via DataOps (chamada de serviço `add_refs/{run_id}`)

### Outcomes Esperados

- Redução de tempo de processamento evitando recomputação
- Consistência entre cache e metadados de execução
- Rastreabilidade completa de workflow → ops → assets

### APIs / Endpoints

- **Pub/Sub**: inscrito em `control-pubsub` / `cache-commands`
- **Service Invocation (Dapr)**: `add_refs/{run_id}` — delega ao DataOpsManager

### CRUD

| Entidade | Create | Read | Update | Delete |
|---|---|---|---|---|
| CacheInfo | ✓ (hash) | ✓ (consulta por hash) | ✗ | Indireto via DataOps |
| OpRunId refs | ✓ (store_references) | ✓ (get_run_ops, get_op_workflow_runs, get_op_assets) | ✗ | ✓ (remove_workflow_op_refs, remove_op_asset_refs) |

### Schemas de Dados

- `CacheInfo`: name, version, hash (SHA256), parameters, ids
- `OpRunId`: name, hash
- `OpRunIdDict`: name, hash (TypedDict para serialização)
- Chaves Redis: `run:{run_id}:ops`, `op:{op_name}:{op_hash}:runs`, `op:{op_name}:{op_hash}:assets`, `asset:{asset_id}:ops`

### Datasets / Tipos

- Metadados estruturados armazenados em Redis (conjuntos)
- Identificadores de assets (strings UUID)
- Referências a operações (op_name + hash)

### Lógicas e Cálculos

- Geração de hash: `SHA256(ids_sorted + parameters_sorted + version)`
- Resolução de dependências de operação via `OperationDependencyResolver`
- Estratégia de pool: `ProcessPoolExecutor` (local) ou `ThreadPoolExecutor` (Azure)
- Leases de escrita no Redis para consistência

---

## 2. CacheMetadataStore

### Nome do Módulo

`CacheMetadataStore` (`cache_metadata_store.py`, `cache_metadata_store_client.py`)

### Descrição

Protocolo e implementação Redis para armazenar relacionamentos entre workflows, operações e assets. O client (`CacheMetadataStoreClient`) invoca remotamente o DataOpsManager via Dapr para persistir referências.

### JTBDs

- Rastrear quais operações pertencem a um workflow
- Rastrear quais assets pertencem a uma operação
- Permitir deleção em cascata de workflow → op → asset

### Casos de Uso

1. Associar operação executada a um workflow run
2. Recuperar assets de uma operação para deleção
3. Verificar se um asset é referenciado por múltiplas operações

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Armazenar relacionamentos run ↔ op ↔ asset | Armazenar dados binários |
| Suportar consultas bulk | Executar cache logic |
| Oferecer implementação Redis e protocolo abstrato | Gerenciar concorrência além de locks Redis |

### Users Inputs / Outputs

- **Input**: run_id, OpRunId, asset_ids, output OpIOType
- **Output**: conjuntos de op refs, asset refs, workflow refs

### APIs / Endpoints

- `add_refs/{run_id}` (Dapr service invocation via cliente)
- Métodos do protocolo: store_references, get_run_ops, get_op_workflow_runs, get_op_assets, get_assets_refs, remove_workflow_op_refs, remove_op_asset_refs

### CRUD

| Entidade | Create | Read | Update | Delete |
|---|---|---|---|---|
| Run→Op | ✓ (SADD) | ✓ (SMEMBERS) | ✗ | ✓ (SREM) |
| Op→Assets | ✓ (SADD) | ✓ (SMEMBERS) | ✗ | ✓ (SREM) |
| Asset→Op | ✓ (SADD) | ✓ (SMEMBERS) | ✗ | ✓ (SREM) |

### Schemas de Dados

- Formato de chave: `run:{uuid}:ops`, `op:{name}:{hash}:runs`, `op:{name}:{hash}:assets`, `asset:{uuid}:ops`
- Formato de valor: conjuntos de strings (`{op_name}:{op_hash}` ou UUIDs)

### Datasets / Tipos

- Redis strings, sets, pipelines transacionais

### Lógicas e Cálculos

- Uso de Redis pipelines com transaction=True para atomicidade
- ExponentialBackoff para reconexão Redis
- Cache de listagem de blobs com LRU (size=100)

---

## 3. DataOpsManager

### Nome do Módulo

`DataOpsManager` (`data_ops.py`, `launch_data_ops.py`)

### Descrição

Serviço central de gerenciamento de metadados e operações de dados. Processa mensagens de reply de execução (para adicionar referências) e requisições de deleção de workflows, orquestrando a remoção segura de metadados e assets.

### JTBDs

- Registrar metadados de execução de operações (referências)
- Gerenciar deleção completa de workflows (metadados + assets)
- Garantir consistência transacional em operações de deleção
- Evitar deleção de workflows em execução

### Casos de Uso

1. Processar execute_reply: extrair output, computar asset_ids, armazenar referências
2. Processar deleção de workflow: verificar status, deletar ops não compartilhadas, atualizar statestore
3. Deleção seletiva de operações e assets não referenciados por outros workflows

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Gerenciar metadados de cache e referências | Executar operações de processamento |
| Orquestrar deleção segura de workflows | Gerenciar workers ou cache |
| Usar RWLock para serializar escritas vs leituras | Expor API pública |
| Interagir com statestore via Dapr | Gerenciar ciclo de vida de deployments |

### Users Inputs / Outputs

- **Input (pub/sub)**: `ExecuteReplyMessage` (tópico `updates`), `WorkflowDeletionMessage` (tópico `workflow_execution_request`)
- **Input (service invocation)**: `add_refs/{run_id}` via Dapr
- **Output**: Referências armazenadas no Redis, metadados atualizados no statestore, assets removidos do storage

### System Outputs

- RunConfig atualizado no statestore com status `deleting` → `deleted`
- Assets removidos do Azure Blob Storage ou sistema de arquivos local
- Catálogos STAC removidos do storage

### APIs / Endpoints

- **Pub/Sub (async)**: `control-pubsub` / `updates`, `control-pubsub` / `workflow_execution_request`
- **Service Invocation (FastAPI)**: `add_refs/{run_id}` (POST) — recebe `OpRunIdDict` + `OpIOType`
- **Startup**: inicialização de locks (RWLock, asyncio.Lock)

### CRUD

| Entidade | Create | Read | Update | Delete |
|---|---|---|---|---|
| RunConfig (status) | ✗ | ✓ | ✓ (deleting → deleted) | ✗ |
| Referências Run→Op | ✓ | ✗ | ✗ | ✓ |
| Assets em Storage | ✗ | ✗ | ✗ | ✓ |
| Catálogos STAC | ✗ | ✗ | ✗ | ✓ |

### Schemas de Dados

- `RunConfig`: id, details (status, reason), output (dict)
- `RunStatus`: finished, deleting, deleted, failed, cancelled
- `RWLock`: reader/writer lock para acesso concorrente
- `OpRunId`: name, hash

### Datasets / Tipos

- Metadados de execução no statestore (Dapr state store)
- Referências no Redis (conjuntos)
- Assets binários no Blob Storage / filesystem

### Lógicas e Cálculos

- Extração de asset_ids de OpIOType (percorre output values → items → assets keys)
- `_can_delete`: verifica `RunStatus.finished()`, rejeita se já deletando/deletado
- `delete_op_run`: get_op_assets → get_assets_refs → se len(asset_ops)==1 → remove asset do storage
- Lock hierárquico: `statestore_lock` (asyncio) para serializar inícios de deleção; `metadata_store_lock` (RWLock) para permitir leituras concorrentes e escritas exclusivas

---

## 4. Worker

### Nome do Módulo

`Worker` (`worker.py`, `launch_worker.py`)

### Descrição

Serviço responsável por executar operações em processos filhos isolados (via `pebble`). Gerencia ciclo de vida de execução, retry, timeout, graceful shutdown e relatórios de status.

### JTBDs

- Executar operações geoespaciais isoladamente em subprocessos
- Garantir finalização com retry em caso de falha
- Reportar resultados (sucesso/erro) ao DataOpsManager
- Suportar shut down graceful sem perder mensagens

### Casos de Uso

1. Receber mensagem `CacheInfoExecuteRequestMessage`
2. Verificar se o workflow já não foi finalizado (evita work orfão)
3. Executar op em processo filho com timeout de 3h
4. Retentar até 5 vezes em caso de falha
5. Responder com sucesso ou erro via pub/sub
6. Shutdown graceful: terminar processo filho, rejeitar novas mensagens

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Executar ops em subprocessos isolados | Gerenciar cache (delega ao Cache) |
| Implementar retry com backoff | Armazenar resultados finais |
| Reportar erros completos com traceback | Gerenciar metadados de workflow |
| Suportar shutdown graceful | Interagir diretamente com storage |
| Monitorar conclusão de workflow para cancelar op | Gerenciar deployment ou scaling |

### Users Inputs / Outputs

- **Input**: `CacheInfoExecuteRequestMessage` via Dapr pub/sub (tópico `commands`)
- **Output**: `AckMessage`, `ExecuteReplyMessage`, `ErrorMessage` via pub/sub (tópico `updates`)

### System Outputs

- ACK enviado imediatamente ao receber mensagem
- Success reply com output ao finalizar
- Error reply com nome da exceção, mensagem e traceback
- Logs de uso de recursos (CPU, memória, I/O) pós-execução

### APIs / Endpoints

- **Pub/Sub**: inscrito em `control-pubsub` / `commands`
- **Service Invocation (Dapr)**: `shutdown` — inicia shutdown graceful
- **Endpoint de health/readness**: via decorator `@dapr_ready`

### CRUD

N/A — Worker não persiste dados diretamente.

### Schemas de Dados

- `CacheInfoExecuteRequestContent`: input, operation_spec, cache_info
- `OperationSpec`: name, root_folder, inputs_spec, output_spec, entrypoint, parameters, etc.
- `OpStatusType`: done, failed

### Datasets / Tipos

N/A — processa mensagens, não mantém datasets.

### Lógicas e Cálculos

- Pool de processos: `ForkServerContext` para isolamento
- `run_op_with_retry`: até `max_tries` (5) tentativas, com timeout decrescente
- `get_future_result`: loop de polling a cada 10s, verifica se workflow foi cancelado
- `pre_stop_hook`: sinal SIGTERM → termina filho, para servidor HTTP
- `MESSAGING_RETRY_INTERVAL_S`: 1s entre retries de envio de mensagem
- `MAX_OP_EXECUTION_TIME_S`: 3h (10800s)

---

## 5. Operation / OperationFactory

### Nome do Módulo

`Operation` / `OperationFactory` (`ops.py`, `ops_helper.py`)

### Descrição

Fábrica de operações que constrói instâncias de `Operation` a partir de especificações YAML. Cada `Operation` encapsula um callback Python, um conversor STAC e regras de input/output. `CallableBuilder` carrega dinamicamente módulos Python para construir callbacks.

### JTBDs

- Construir operações a partir de definições YAML
- Validar inputs/outputs contra especificações de tipo
- Gerenciar cache local da operação (evitar duplicação)
- Resolver dependências de parâmetros e secrets

### Casos de Uso

1. Parse de definição de operação em YAML → `OperationSpec`
2. Construção dinâmica de callback Python a partir de entrypoint
3. Execução de operação: carregar inputs do storage → executar callback → armazenar outputs
4. Resolução de secrets via `SecretProvider`

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Parsear specs YAML de operações | Gerenciar deployment de workers |
| Construir callbacks dinamicamente | Gerenciar mensageria pub/sub |
| Validar tipos de input/output | Gerenciar estado de workflow |
| Integrar com storage (store/retrieve) | Rastrear telemetria |
| Resolver dependências e secrets | Expor interfaces de rede |

### Users Inputs / Outputs

- **Input**: caminho de definição YAML, parâmetros override, input data OpIOType
- **Output**: output data OpIOType processado e armazenado

### System Outputs

- Catálogos STAC armazenados no storage (local ou remoto)
- Assets (arquivos) copiados para o asset manager

### APIs / Endpoints

N/A — módulo interno, sem interfaces de rede.

### CRUD

N/A — operações são construídas por factory, não expõem CRUD.

### Schemas de Dados

- `OperationSpec`: name, root_folder, inputs_spec, output_spec, entrypoint (EntryPointDict), description (TaskDescription), dependencies, parameters, version, image_name
- `EntryPointDict`: file, callback_builder
- `OpResolvedDependencies`: Dict[str, Dict[str, Any]]
- `ItemDict`: Dict[str, Item | List[Item]]

### Datasets / Tipos

- Definições YAML em filesystem
- Dados STAC (itens, coleções, catálogos)
- Assets geoespaciais (GeoTIFF, etc.)

### Lógicas e Cálculos

- `OperationParser.parse`: carrega YAML, valida campos obrigatórios (name, inputs, output, parameters, entrypoint), parse de TypeDictVibe via TypeParser
- `CallableBuilder.build`: `importlib.util.spec_from_file_location` → `exec_module` → `getattr(callback_builder)`
- `Operation.run`: deserialize → fetch do cache → retrieve do storage → converter STAC → callback → validate → store → serialize
- Validação: interseção de chaves input/output deve ser vazia; output keys devem corresponder a output_spec

---

## 6. Storage

### Nome do Módulo

`Storage` (`storage/storage.py`, `storage/local_storage.py`, `storage/remote_storage.py`, `storage/asset_management.py`, `storage/file_upload.py`)

### Descrição

Camada de abstração de armazenamento para dados STAC e assets binários. Suporta duas implementações: `LocalStorage` (catálogos STAC em disco) e `CosmosStorage` (Azure Cosmos DB + Blob Storage). O `AssetManager` gerencia assets individuais (arquivos) localmente ou no Azure Blob Storage.

### JTBDs

- Armazenar e recuperar resultados de operações em formato STAC
- Gerenciar assets binários (GeoTIFF, etc.) associados a itens STAC
- Fornecer cache de resultados baseado em hash (input + op)
- Suportar deleção segura de catálogos e assets

### Casos de Uso

1. Store: salvar output de op como catálogo STAC + copiar assets
2. Retrieve: carregar itens STAC do storage e resolver hrefs de assets
3. Cache lookup: verificar se resultado já existe pelo hash
4. Delete: remover catálogo e assets não referenciados
5. Upload de assets para Azure Blob (local ou remoto)

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Abstrair storage local e Azure Cosmos/Blob | Processar dados geoespaciais |
| Manter consistência atômica em store | Gerenciar metadados de execução |
| Suportar copy de assets entre storage locations | Orquestrar workers |
| Implementar cache lookup por hash | Fornecer autenticação de usuário |
| Upload eficiente com concorrência (6 threads) | Gerenciar versionamento de dados |

### Users Inputs / Outputs

- **Input**: `ItemDict` (dados STAC), `CacheInfo` (hash), `run_id`, `OpRunId`
- **Output**: `ItemDict`, URLs de assets, paths de arquivos

### System Outputs

- Catálogos STAC salvos em disco (JSON) ou CosmosDB (documentos)
- Assets copiados para diretório local ou blob container
- URLs assinadas (SAS) para acesso a assets no Blob Storage

### APIs / Endpoints

N/A — módulo interno acessado por Cache, Worker e DataOps.

### CRUD

| Entidade | Create | Read | Update | Delete |
|---|---|---|---|---|
| Catálogo STAC | ✓ (store) | ✓ (retrieve) | ✗ | ✓ (remove) |
| Asset | ✓ (copy_assets) | ✓ (retrieve asset) | ✗ | ✓ (remove asset) |
| ItemList (Cosmos) | ✓ | ✓ | ✗ | ✓ |

### Schemas de Dados

- `StorageConfig`, `LocalStorageConfig`, `CosmosStorageConfig`
- `AssetManagerConfig`, `LocalFileAssetManagerConfig`, `BlobAssetManagerConfig`
- `ItemDict`: Dict[str, Item | List[Item]]
- `CosmosData`: id, op_name
- `ItemList`: id, op_name, output_name, items (List[Dict]), type
- `RunInfo`: id, op_name, run_id, cache_info, items, singular_items, type
- `AssetCopyHandler`: gerencia cópia de assets entre storage managers

### Datasets / Tipos

- Catálogos STAC (Catalogs, Collections, Items)
- Assets (arquivos binários: GeoTIFF, PNG, JSON, etc.)
- Documentos Cosmos DB particionados por `/op_name`

### Lógicas e Cálculos

- **Store (LocalStorage)**: cria diretório `{path}/{op_name}/{hash}`, copia assets, normaliza hrefs relativas, salva JSON. Se já existe → raise `LocalResourceExistsError`
- **Store (CosmosStorage)**: converte items para dict, particiona em listas de tamanho `list_max_size` (1024), com retry reduzindo tamanho em caso de `EntityTooLarge (413)`. Rolling back em caso de erro parcial
- **Asset copy**: percorre todos os items e assets, chama `asset_manager.store(guid, file_path)` que copia/download + upload. Rollback em caso de falha
- **Hash de cache**: `SHA256(ids + parameters + version)`
- **Token SAS**: delegação de chave de usuário (Azure AD) ou connection string, geração de SAS token com permissão de leitura e expiração configurável (default 1 dia)
- **Upload concorrente**: `max_upload_concurrency=6` para BlobAssetManager
- **Cache LRU**: `cached_blob_list_by_prefix` com `maxsize=100`, invalidado em write/delete

---

## 7. AssetManager

### Nome do Módulo

`AssetManager` (`storage/asset_management.py`)

### Descrição

Interface abstrata e implementações para gerenciamento de assets individuais. `LocalFileAssetManager` opera no sistema de arquivos local. `BlobAssetManager` opera no Azure Blob Storage com autenticação via credenciais Azure AD ou connection string.

### JTBDs

- Armazenar assets com ID único (guid)
- Recuperar path/URL de asset por guid
- Verificar existência de asset
- Remover asset

### Casos de Uso

1. Store: copiar/download asset para diretório ou blob container
2. Retrieve: retornar path local ou URL assinada SAS
3. Exists: verificar se asset já foi armazenado
4. Remove: deletar asset do filesystem ou blob

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Gerenciar ciclo de vida de assets | Processar conteúdo de assets |
| Suportar fontes locais e remotas (download) | Indexar ou catalogar assets |
| Gerar URLs assinadas SAS | Gerenciar permissões de acesso |

### APIs / Endpoints

N/A — interface interna.

### Schemas de Dados

- `AssetManager`: classe abstrata com métodos store, retrieve, exists, remove
- `BlobServiceProviderWithCredentials`, `BlobServiceProviderWithConnectionString`

### Lógicas e Cálculos

- `LocalFileAssetManager._gen_path`: `{root_path}/{guid}`
- `BlobAssetManager._list`: usa LRU cache para listar blobs por prefixo, invalida cache em write/delete
- Geração de SAS token via `BlobTokenManager` (UserDelegationKey ou account key)
- Upload: local (open + upload_blob) ou remoto (upload_blob_from_url)

---

## 8. Config / Launch

### Nome do Módulo

`Config` / `Launch` (`agent_config.py`, `launch_cache.py`, `launch_data_ops.py`, `launch_worker.py`)

### Descrição

Configurações dos serviços usando Hydra + hydra-zen. Define configurações para ambientes local (filesystem) e AKS (Azure + Cosmos + Blob). Registra schemas de configuração no ConfigStore do Hydra.

### JTBDs

- Permitir deploy em múltiplos ambientes (local, AKS)
- Gerenciar secrets via Dapr Secret Store (Azure Key Vault)
- Configurar debug remoto via debugpy

### Casos de Uso

1. Iniciar Cache com storage local ou AKS
2. Iniciar DataOps com Redis + storage local ou AKS
3. Iniciar Worker com storage local ou AKS + secret provider

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Configurar storage e dependências | Gerenciar deployment Kubernetes |
| Registrar configs no Hydra ConfigStore | Monitorar saúde dos serviços |
| Resolver secrets via Dapr | Fazer logging/telemetria |

### Users Inputs / Outputs

N/A — módulo de configuração.

### APIs / Endpoints

N/A

### CRUD

N/A

### Schemas de Dados

- `DebugConfig`: activate (bool), port (int)
- `DaprSecretConfig`: store_name, secret_name, key_name
- `LocalStorageConfig`, `CosmosStorageConfig`, `WorkerConfig`, `CacheConfig`, `DataOpsConfig`

---

## 9. OpIOConverter / OpsHelper

### Nome do Módulo

`OpIOConverter` (`ops_helper.py`)

### Descrição

Utilitário para serialização/deserialização entre `OpIOType` (dict serializável) e `ItemDict` (STAC Item objects).

### JTBDs

- Converter itens STAC para formato serializável (pub/sub)
- Converter dados serializados de volta para objetos STAC

### Casos de Uso

1. Serializar output de operação para envio via pub/sub
2. Deserializar input recebido via pub/sub para uso na operação

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Serializar/deserializar itens STAC | Executar operações |
| Usar serialize_stac/deserialize_stac (vibe_core) | Gerenciar storage |

### Lógicas e Cálculos

- `serialize_output`: `{k: serialize_stac(v) for k, v in output.items()}`
- `deserialize_input`: `{k: deserialize_stac(v) for k, v in input_items.items()}`

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Módulo | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | Worker executa ops de previsão solar; Storage armazena resultados em STAC; Cache evita recomputação de séries históricas | Otimização de despacho e redução de incerteza na previsão |
| Geração Eólica | Onshore, Offshore | Worker executa ops de forecast eólico; DataOps gerencia deleção de runs antigas; AssetManager armazena mapas de vento | Previsão de geração mais precisa, manutenção preditiva |
| Geração Hidrelétrica | Fio d'água, Reservatório | Worker processa dados de precipitação e vazão; Cache acelera reexecução de safras históricas | Planejamento de vertimento e otimização de reservatórios |
| Geração Térmica | Gás, Carvão, Biomassa | Worker executa simulações termodinâmicas; Storage mantém séries temporais de eficiência | Redução de custo operacional via previsão de demanda |
| Geração Nuclear | Angra I, II, III | Não aplicável diretamente | — |
| Armazenamento | Baterias, Hidrelétrica reversível | Worker processa otimização de carga/descarga; Cache evita recalcular cenários repetidos | Maximização de arbitragem de preço |
| Transmissão | Linhas, Subestações | Worker executa análise de perdas e fluxo de carga; DataOps gerencia versionamento de estudos | Redução de perdas técnicas e otimização de fluxo |
| Distribuição | Redes MT/BT | Worker processa dados de smart meters; Storage cataloga perfis de consumo | Detecção de fraudes e balanceamento de carga |
| Comercialização | Varejista, Agente | Worker executa modelos de precificação; Cache acelera simulações de portfolio | Previsão de preços e hedge energético |
| Eficiência Energética | Indústria, Comércio | Worker analisa padrões de consumo; Storage armazena benchmarks setoriais | Identificação de oportunidades de redução de consumo |
| Biogás / Biometano | Aterro, Agricultura | Worker processa dados de emissão e potencial; AssetManager armazena imagens de satélite | Mapeamento de potencial energético e créditos de carbono |
| Hidrogênio Verde | Eletrólise | Worker simula produção integrada com renováveis; Cache acelera análise de viabilidade | Otimização de CAPEX/OPEX de plantas de H2V |
| Mobilidade Elétrica | VEs, Frotas | Worker analisa padrões de recarga; Storage cataloga séries de demanda | Planejamento de infraestrutura de recarga |
| Carbono | Créditos, MRV | Worker processa MRV (monitoramento, relato, verificação); DataOps audita rastreabilidade de deleções | Integridade e transparência no mercado de carbono |
