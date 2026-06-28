# PRD — vibe_common

## Visão Geral

O pacote `vibe_common` é a biblioteca compartilhada do FarmVibes.AI que fornece componentes reutilizáveis para todos os microsserviços (Cache, DataOps, Worker, Orchestrator). Inclui definições de mensagens pub/sub, schemas de dados, integração com Dapr (state store, service invocation, pub/sub secrets), telemetria OpenTelemetry, gerenciamento de tokens SAS para Azure Blob, processamento de inputs geoespaciais e constantes centralizadas.

---

## 1. Constants

### Nome do Módulo

`Constants` (`constants.py`)

### Descrição

Centraliza todas as constantes de configuração do sistema: paths de armazenamento, nomes de tópicos pub/sub, templates de URL do Dapr, configurações de telemetria e limites operacionais.

### JTBDs

- Evitar hardcoding de valores de configuração
- Centralizar nomes de tópicos e serviços Dapr
- Definir timeouts, limites e paths padrão

### Casos de Uso

1. Referência a tópicos pub/sub (control-pubsub, cache-commands, updates)
2. Construção de URLs de state store e service invocation
3. Configuração de paths de catálogo e assets
4. Definição de CORS allowed origins

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Definir constantes imutáveis (Final) | Conter lógica de negócio |
| Fornecer templates de URL | Gerenciar estado |
| Configurar defaults de ambiente | Processar dados |

### Users Inputs / Outputs

N/A — constantes importadas por outros módulos.

### APIs / Endpoints

N/A

### CRUD

N/A

### Schemas de Dados

- `DEFAULT_STORE_PATH`, `DEFAULT_CATALOG_PATH`, `DEFAULT_ASSET_PATH`
- `CONTROL_STATUS_PUBSUB`, `CACHE_PUBSUB_TOPIC`, `STATUS_PUBSUB_TOPIC`, `CONTROL_PUBSUB_TOPIC`
- `STATE_URL_TEMPLATE`, `PUBSUB_URL_TEMPLATE`, `DATA_OPS_INVOKE_URL_TEMPLATE`
- `TRACEPARENT_HEADER_KEY`, `TRACEPARENT_STRING`
- `ALLOWED_ORIGINS`, `MAX_PARALLEL_REQUESTS`

### Datasets / Tipos

N/A

### Lógicas e Cálculos

- Templates de URL com formatação dinâmica usando `DAPR_RUNTIME_HOST` e `DAPR_HTTP_PORT`
- Parse de variáveis de ambiente com fallback
- Construção de string traceparent no formato W3C

---

## 2. Dapr / DropDapr / VibeDaprClient

### Nome do Módulo

`Dapr` (`dapr.py`, `dropdapr.py`, `vibe_dapr_client.py`)

### Descrição

Camada de integração com o Dapr runtime. `dapr.py` fornece decorators para aguardar Dapr ficar pronto e processamento de respostas. `dropdapr.py` é um substituto drop-in para `dapr-ext-grpc` usando FastAPI + uvicorn (para DataOps que usa HTTP async). `vibe_dapr_client.py` implementa um cliente HTTP Dapr com retry, tratamento de timeouts e serialização especial para floats.

### JTBDs

- Aguardar disponibilidade do Dapr sidecar antes de iniciar serviços
- Processar e tratar respostas de state store e service invocation
- Fornecer implementação HTTP de subscribe/pub para ambientes async
- Garantir resiliência em chamadas Dapr com retry exponencial
- Preservar precisão de floats em serialização JSON Dapr

### Casos de Uso

1. Decorator `@dapr_ready` para bloques até Dapr estar pronto
2. DropDapr: serviço FastAPI que substitui gRPC para DataOps (subscribe async, service invocation)
3. VibeDaprClient: chamadas HTTP GET/POST para state store e service invocation com retry
4. Serialização especial: floats → strings (evita truncamento no sidecar Dapr)

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Aguardar readiness do Dapr | Gerenciar ciclo de vida do sidecar |
| Processar respostas de erro Dapr | Implementar protocolo gRPC |
| Fornecer subscribe/pub via HTTP | Gerenciar secrets |
| Implementar retry exponencial em chamadas HTTP | Fazer caching de dados |
| Serializar floats como strings | Executar operações de negócio |

### Users Inputs / Outputs

- **Input (VibeDaprClient)**: URLs, payloads JSON, traceparent headers
- **Output (VibeDaprClient)**: respostas JSON processadas (ClientResponse)
- **Input (DropDapr)**: CloudEvents HTTP POST, inscrições Dapr
- **Output (DropDapr)**: TopicEventResponse (SUCCESS, RETRY, DROP)

### System Outputs

- Chamadas HTTP para state store, service invocation e pub/sub Dapr
- Respostas de erro estruturadas (400, 403, 404, 500)

### APIs / Endpoints

- **DropDapr App**: GET `/` (info), GET `/dapr/subscribe` (inscrições), POST `/events/{pubsub}/{topic}` (event handlers), endpoints via `@app.method(name)`
- **Service invocation**: POST `http://{dapr}:{port}/v1.0/invoke/{app-id}/method/{method}`
- **State**: GET/POST `http://{dapr}:{port}/v1.0/state/{store}/{key}`
- **Bulk state**: POST `http://{dapr}:{port}/v1.0/state/{store}/bulk`
- **Transaction**: POST `http://{dapr}:{port}/v1.0/state/{store}/transaction`

### CRUD

N/A — client HTTP genérico.

### Schemas de Dados

- `TopicEventResponse`: Dict[str, str] com status (SUCCESS, RETRY, DROP)
- `DaprSubscription`: TypedDict com pubsubname, topic, route, metadata
- RetryOptions: ExponentialRetry (attempts=10, max_timeout=30s, statuses={400, 500, 502, 503, 504})
- Metadata padrão: `{"partitionKey": "eywa"}`

### Datasets / Tipos

N/A

### Lógicas e Cálculos

- `dapr_ready_decorator`: cria DaprClient, chama `client.wait(timeout)` com timeout de 90s
- `handle_aiohttp_timeout`: retry até 3 tentativas com `asyncio.TimeoutError`
- `process_dapr_response`: roteia para state ou service invocation handler baseado no path da URL
- `VibeDaprClient.post`: retry até 3 tentativas para `ERR_DIRECT_INVOKE`
- `obj_json`: JSON com `parse_float=lambda f_as_s: f_as_s` (preserva floats como strings)
- `response_json`: decode com `object_hook=_decode` que converte strings parseáveis como float de volta para float
- `_dumps`: usa `dump_to_json` de `vibe_core` (encoding especial para float precision)

---

## 3. Messaging

### Nome do Módulo

`Messaging` (`messaging.py`)

### Descrição

Sistema de mensageria baseado em CloudEvents 1.0 para comunicação pub/sub entre os microsserviços via Dapr. Define todos os tipos de mensagem, builders, serializadores e funções de envio síncrono/assíncrono.

### JTBDs

- Definir protocolo de comunicação entre serviços (Cache, Worker, DataOps)
- Garantir serialização consistente de mensagens incluindo tipos complexos (OperationSpec, OpIOType)
- Fornecer mecanismo de accept/fail para processamento de eventos
- Rastrear tracing distribuído via header traceparent

### Casos de Uso

1. Cache envia ExecuteRequestMessage para Worker
2. Worker envia ExecuteReplyMessage para DataOps
3. Orchestrator envia WorkflowExecutionMessage
4. Qualquer serviço envia ErrorMessage em caso de falha
5. DataOps recebe WorkflowDeletionMessage

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Definir tipos de mensagem (9 tipos) | Gerenciar filas ou brokers |
| Construir mensagens com MessageBuilder | Processar mensagens |
| Serializar/deserializar CloudEvents | Garantir entrega |
| Validar conteúdo vs tipo de mensagem | Fazer routing além do tópico |

### Users Inputs / Outputs

- **Input**: CloudEvent recebido pelo subscribe Dapr
- **Output**: CloudEvent JSON publicado no tópico Dapr

### System Outputs

- Mensagens publicadas no pub/sub Dapr via HTTP POST
- Logs de aviso para mensagens > 256KB (limite seguro)

### APIs / Endpoints

N/A — módulo de definição, sem endpoints próprios.

### CRUD

N/A

### Schemas de Dados

- `MessageHeader`: type (MessageType), run_id (UUID), id, parent_id, current_trace_parent, version, created_at
- `ExecuteRequestContent`: input (OpIOType), operation_spec (OperationSpec)
- `CacheInfoExecuteRequestContent`: input, operation_spec, cache_info (CacheInfo)
- `ExecuteReplyContent`: cache_info, status (OpStatusType), output (OpIOType)
- `ErrorContent`: status, ename, evalue, traceback (List[str])
- `WorkflowExecutionContent`: input, workflow (Dict), parameters
- `WorkflowDeletionContent`, `WorkflowCancellationContent`, `AckContent`, `EvictedReplyContent`: vazios
- `AckMessage`, `CacheInfoExecuteRequestMessage`, `ExecuteRequestMessage`, `ExecuteReplyMessage`, `ErrorMessage`, `WorkflowExecutionMessage`, `WorkflowCancellationMessage`, `WorkflowDeletionMessage`
- `WorkMessage`: Union de todos os tipos de mensagem
- `MessageType`: 9 tipos (ack, cache_info_execute_request, error, execute_request, execute_reply, evicted_reply, workflow_execution_request, workflow_cancellation_request, workflow_deletion_request)
- `OpStatusType`: done, failed

### Datasets / Tipos

N/A — mensagens transitórias.

### Lógicas e Cálculos

- `MessageHeader.set_id`: gera traceparent W3C a partir do run_id se id vazio
- `BaseMessage.validate_content`: valida que content type corresponde ao MessageType
- `to_cloud_event`: constrói dict CloudEvents 1.0 com `encode(json)` como data (compressed encoding via vibe_core)
- `build_work_message`: itera sobre subtipos de WorkMessage, tenta construir até sucesso
- `event_to_work_message`: extrai dados do evento → MessageHeader → content → build_work_message
- `gen_traceparent(run_id)`: trace_id = int(run_id.hex, 16), parent_id = getrandbits(64), formato W3C
- `run_id_from_traceparent`: extrai UUID da posição 1 do traceparent
- `accept_or_fail_event`: try/except com callbacks de sucesso e falha
- `operation_spec_serializer`: converte TypeDictVibe para representação string (ex: `List[DataVibe]`)
- `send`/`send_async`: POST para PUBSUB_URL_TEMPLATE com headers Content-Type e traceparent
- Warning para payloads > MAXIMUM_MESSAGE_SIZE (256KB)

---

## 4. Schemas

### Nome do Módulo

`Schemas` (`schemas.py`)

### Descrição

Define schemas de dados fundamentais: especificação de operações (`OperationSpec`), informações de cache (`CacheInfo`), identificadores de run de operação (`OpRunId`) e parser de definições YAML (`OperationParser`).

### JTBDs

- Definir estrutura de especificação de operações
- Computar hash de cache para evitar recomputação
- Parsear definições YAML de operações
- Serializar/deserializar metadados de cache entre serviços

### Casos de Uso

1. OperationSpec: transmitir especificação completa de op entre Cache, Worker e DataOps
2. CacheInfo: computar hash único de (inputs + parâmetros + versão)
3. OpRunId: identificar unicamente uma execução de operação
4. OperationParser: carregar definição YAML em OperationSpec

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Definir schemas Pydantic/dataclass | Executar operações |
| Computar hash SHA256 para cache | Gerenciar storage |
| Parsear YAML de definições | Fazer logging |
| Validar campos obrigatórios | Interagir com Dapr |

### Users Inputs / Outputs

N/A — schemas importados por todos os serviços.

### APIs / Endpoints

N/A

### CRUD

N/A

### Schemas de Dados

- `OperationSpec` (Pydantic dataclass): name, root_folder, inputs_spec (TypeDictVibe), output_spec (TypeDictVibe), entrypoint (EntryPointDict), description (TaskDescription), dependencies, parameters, default_parameters, version, image_name
- `OpRunId` (frozen dataclass): name, hash
- `OpRunIdDict` (TypedDict): name, hash
- `CacheInfo` (dataclass, init=False): name, version, hash (SHA256), parameters, ids
- `EntryPointDict` (TypedDict): file, callback_builder
- `OpDependencies`: Dict[str, List[str]]
- `OpResolvedDependencies`: Dict[str, Dict[str, Any]]
- `ItemDict`: Dict[str, Union[Item, List[Item]]]
- `CacheIdDict`: Dict[str, Union[str, List[str]]]

### Datasets / Tipos

- Definições YAML de operações no filesystem

### Lógicas e Cálculos

- `CacheInfo.__init__`: se sources recebido, computa ids via `_populate_ids`. Se hash não fornecido, computa via `SHA256(join_mapping(ids) + join_mapping(parameters) + version)`
- `_compute_or_extract_id`: retorna `thing.hash_id` (BaseVibe) ou `thing.id` (Item), ou lista recursiva
- `_join_mapping`: itera sorted keys, concatena chave + valor (recursivo para dicts)
- `OperationParser.parse`: carrega YAML, valida 5 campos obrigatórios (name, inputs, output, parameters, entrypoint), parse inputs/output como TypeDictVibe, merge parâmetros com override, renomeia description.output → outputs para TaskDescription
- `update_parameters`: merge recursivo de override em parameters, valida que chave existe
- `as_storage_dict`: mapeia nomes de campo para nomes de storage via FIELD_TO_STORAGE (ex: `vibe_op_hash`, `vibe_source_items`)

---

## 5. SecretProvider

### Nome do Módulo

`SecretProvider` (`secret_provider.py`)

### Descrição

Provedor de secrets para resolução de valores sensíveis em parâmetros de operações. Suporta Dapr Secret Store (Kubernetes) e Azure Key Vault. Implementa padrão de retry com backoff para indisponibilidade do sidecar Dapr.

### JTBDs

- Resolver secrets em parâmetros de operação no formato `@SECRET(store, name)`
- Permitir troca de provedor de secrets sem alterar código cliente
- Garantir resiliência contra indisponibilidade temporária do Dapr

### Casos de Uso

1. Resolver segredo de conexão com banco de dados em parâmetro de operação
2. Obter chave de API de serviço externo via Azure Key Vault
3. Fallback automático com retry em caso de connection refused do Dapr

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Resolver secrets no formato @SECRET(store, name) | Gerenciar ciclo de vida de secrets |
| Suportar Dapr e Azure Key Vault | Criptografar/descriptografar dados |
| Implementar retry com backoff | Armazenar secrets em cache |

### Users Inputs / Outputs

- **Input**: string contendo `@SECRET(store_name, secret_name)` ou valor comum
- **Output**: valor do secret resolvido ou valor original (se não for secret)

### APIs / Endpoints

N/A

### CRUD

N/A

### Schemas de Dados

- `SecretProvider`: classe abstrata com método resolve(value) e regex `^@SECRET\(([^,]*?), ([^,]*?)\)`
- `DaprSecretProvider`: resolve via `retrieve_dapr_secret("kubernetes", secret_name, secret_name)`
- `AzureSecretProvider`: resolve via `SecretClient.get_secret(keyvault_name, secret_name)`
- `DaprSecretConfig`, `KeyVaultSecretConfig`, `SecretProviderConfig`, `DaprSecretProviderConfig`, `AzureSecretProviderConfig`

### Datasets / Tipos

N/A

### Lógicas e Cálculos

- Regex: `^@SECRET\(([^,]*?), ([^,]*?)\)` — captura store (ou keyvault) e secret name
- `DaprSecretProvider._resolve_impl`: loop infinito com sleep de 30s em caso de `connection refused`
- `retrieve_dapr_secret`: decorada com `@dapr_ready(dapr_wait_time_s=30)`, usa `DaprClient.get_secret()`

---

## 6. StateStore

### Nome do Módulo

`StateStore` (`statestore.py`)

### Descrição

Cliente para o Dapr State Store (componente `statestore`). Fornece operações CRUD assíncronas: retrieve, retrieve_bulk, store e transaction. Usa `VibeDaprClient` para comunicação HTTP com o sidecar Dapr.

### JTBDs

- Persistir estado de execução de workflows (RunConfig)
- Recuperar estado de runs para validação (ex: workflow já finalizado?)
- Suportar bulk retrieval para UI de listagem de workflows
- Suportar transações multi-operação

### Casos de Uso

1. Worker consulta se workflow foi cancelado antes de executar
2. DataOps atualiza status do workflow (→ deleting → deleted)
3. Orchestrator salva RunConfig ao iniciar workflow
4. UI recupera lista de runs com detalhes

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Implementar StateStoreProtocol | Gerenciar cache de dados |
| Operações CRUD via Dapr HTTP | Validar schemas |
| Suportar bulk retrieval (paralelismo=8) | Fazer logging de negócio |
| Suportar transações | Interagir com storage de assets |

### Users Inputs / Outputs

- **Input**: key (string), obj (any), operations (TransactionOperation list)
- **Output**: dados recuperados (any), confirmação de store

### APIs / Endpoints

- GET `http://{dapr}:{port}/v1.0/state/statestore/{key}`
- POST `http://{dapr}:{port}/v1.0/state/statestore/` (store)
- POST `http://{dapr}:{port}/v1.0/state/statestore/bulk` (bulk retrieve)
- POST `http://{dapr}:{port}/v1.0/state/statestore/transaction` (multi-op)

### CRUD

| Entidade | Create | Read | Update | Delete |
|---|---|---|---|---|
| State entries | ✓ (store) | ✓ (retrieve) | ✓ (store) | ✗ (statestore base) |

### Schemas de Dados

- `StateStoreProtocol`: Protocol com retrieve, retrieve_bulk, store, transaction
- `TransactionOperation`: TypedDict com key, operation ("upsert" / "delete"), value
- Partition key: `"eywa"`

### Datasets / Tipos

- Dados de estado: `RunConfig` (serializado como JSON)

### Lógicas e Cálculos

- `retrieve_bulk`: POST com lista de keys + parallelism, retorna lista de estados, valida que todos keys foram retornados
- `store`: POST com array de objetos `[{key, value, metadata: {partitionKey}}]`, assert response.ok
- `transaction`: POST com `{operations: [{operation, request: {key, value}}], metadata: {partitionKey}}`
- `obj_json` herdado de VibeDaprClient: encode de floats como strings

---

## 7. Telemetry

### Nome do Módulo

`Telemetry` (`telemetry.py`)

### Descrição

Configuração e utilitários para tracing distribuído via OpenTelemetry com exportação OTLP para um collector. Inclui decorators para adicionar spans automaticamente, atualização de contexto de tracing via header traceparent, e geração de span attributes.

### JTBDs

- Rastrear execução de operações através dos microsserviços
- Propagar contexto de tracing entre serviços via header traceparent
- Exportar traces para sistema de observabilidade (OTLP)

### Casos de Uso

1. Cache cria span ao processar fetch_work
2. Worker inicia span ao executar operação
3. Contexto traceparent propagado via pub/sub e service invocation

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Configurar tracer OTLP | Gerenciar métricas |
| Adicionar spans com decorator `@add_trace` | Exportar logs |
| Atualizar contexto via traceparent | Coletar traces de sistema |
| Extrair e propagar traceparent W3C | Fazer sampling |

### Users Inputs / Outputs

N/A — módulo de infraestrutura.

### APIs / Endpoints

N/A

### CRUD

N/A

### Schemas de Dados

- `OTLPSpanExporter`: endpoint OTLP gRPC, insecure=True
- `BatchSpanProcessor`: exportação em lote
- `Resource`: service.name

### Datasets / Tipos

N/A

### Lógicas e Cálculos

- `setup_telemetry(service_name, exporter_endpoint)`: cria TracerProvider → OTLPSpanExporter(insecure) → BatchSpanProcessor → set global
- `get_current_trace_parent()`: formata trace_id (032x), span_id (016x), flags (02x) no formato W3C `00-{trace_id}-{parent_id}-{flags}`
- `update_telemetry_context(trace_parent)`: `attach(extract({"traceparent": trace_parent}))`
- `add_trace`: decorator que cria span automático para sync e async functions
- `add_span_attributes`: set_attribute para cada par chave/valor

---

## 8. Tokens

### Nome do Módulo

`Tokens` (`tokens.py`)

### Descrição

Gerenciamento de tokens SAS (Shared Access Signature) para acesso seguro a arquivos no Azure Blob Storage. Suporta autenticação via Azure AD (UserDelegationKey) e connection string (account key).

### JTBDs

- Gerar URLs assinadas SAS para acesso temporário a assets
- Gerenciar renovação automática de chaves de delegação antes da expiração
- Cache de chaves de usuário por conta de storage

### Casos de Uso

1. BlobAssetManager.retrieve gera URL assinada SAS para download de asset
2. BlobTokenManager mantém chave de delegação renovada automaticamente

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Gerar SAS tokens para Blob Storage | Gerenciar permissões de usuário |
| Cachear chaves de delegação (UserDelegationKey) | Interagir com Dapr |
| Renovar chaves antes da expiração | Fazer upload/download |
| Suportar credential e connection string | Validar tokens gerados |

### Users Inputs / Outputs

- **Input**: blob URL
- **Output**: blob URL com assinatura SAS (query string)

### System Outputs

- URLs assinadas SAS com expiração configurável

### APIs / Endpoints

N/A

### CRUD

N/A

### Schemas de Dados

- `BlobTokenManager`: ABC com sas_expiration_days (default 1), lease_time_ratio (default 2), user_key_cache
- `StorageUserKeyCredentialed`: delegação via Azure AD, UserDelegationKey com key_lease_time e sas_expiration
- `StorageUserKeyConnectionString`: account key via connection string
- `BlobTokenManagerCredentialed`, `BlobTokenManagerConnectionString`

### Datasets / Tipos

N/A

### Lógicas e Cálculos

- `StorageUserKeyCredentialed._generate`: `client.get_user_delegation_key(start, key_expiration)` onde key_expiration = now + key_lease_time
- `is_valid`: `now + sas_expiration < key_expiration` (renova se expirando)
- `StorageUserKeyConnectionString`: sempre válido (is_valid = True), account_key do client credential
- `BlobTokenManager._get_user_key`: cache por account_name, cria StorageUserKey se não existir
- `BlobTokenManagerCredentialed._get_token`: `generate_blob_sas(account_name, container_name, user_delegation_key, blob_name, permission=BlobSasPermissions(read=True), start, expiry)`
- `BlobTokenManagerConnectionString._get_token`: `generate_blob_sas(account_name, container_name, account_key, blob_name, permission=BlobSasPermissions(read=True), start, expiry)`
- `sign_url(url)`: `urljoin(url, path) + "?" + sas_token`
- `key_lease_time = lease_time_ratio * sas_expiration` (default: 2 * 1dia = 2dias de lease)

---

## 9. InputHandlers

### Nome do Módulo

`InputHandlers` (`input_handlers.py`)

### Descrição

Utilitários para converter inputs geoespaciais do usuário (GeoJSON) em itens STAC prontos para processamento. Suporta Feature, Polygon, MultiPolygon e FeatureCollection.

### JTBDs

- Homogeneizar inputs geoespaciais (GeoJSON) em itens STAC
- Validar geometrias suportadas (Polygon, MultiPolygon)
- Gerar hash ID único baseado em geometria + time range

### Casos de Uso

1. Usuário submete workflow com área de interesse em GeoJSON → convertido para DataVibe → STAC Item
2. Validação de geometria (rejeita Point, LineString, etc.)

### Faz / Não Faz

| Faz | Não Faz |
|---|---|
| Converter GeoJSON → STAC Item | Validar CRS ou projeção |
| Validar tipos de geometria | Processar múltiplas features |
| Gerar hash ID determinístico | Fazer download de dados |

### Users Inputs / Outputs

- **Input**: GeoJSON dict, start_date, end_date
- **Output**: STAC Item dict (com DataVibe)

### APIs / Endpoints

N/A

### CRUD

N/A

### Schemas de Dados

- `VALID_GEOMETRIES`: ["Polygon", "MultiPolygon"]
- `INVALID_GEOMETRIES`: ["Point", "LineString", "MultiPoint", "MultiLineString", "GeometryCollection"]
- `DataVibe`: id, time_range, geometry, assets

### Datasets / Tipos

N/A

### Lógicas e Cálculos

- `gen_stac_item_from_bounds`: se FeatureCollection → extrai primeira feature e delega para `handle_non_collection`
- `handle_non_collection`: verifica geotype, extrai geometry, cria DataVibe com hash determinístico (`gen_hash_id("input", geometry, time_range)`), converte via StacConverter
- Geração de hash: `gen_hash_id("input", geometry, time_range)` — deterministico baseado no conteúdo

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Módulo | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | Messaging define protocolo de comunicação entre orquestrador e workers de previsão; StateStore persiste status de runs de simulação solar | Rastreabilidade de execuções e tolerância a falhas |
| Geração Eólica | Onshore, Offshore | Telemetry rastreia spans de execução; VibeDaprClient garante resiliência em chamadas; InputHandlers converte áreas de parque eólico | Observabilidade ponta a ponta e resiliência operacional |
| Geração Hidrelétrica | Fio d'água, Reservatório | StateStore persiste estados de simulação; Schemas definem CacheInfo para cenários hidrológicos; SecretProvider gerencia credenciais de ANA/ONS | Gestão segura de credenciais e auditoria de execuções |
| Geração Térmica | Gás, Carvão, Biomassa | Messaging orquestra filas de execução; Telemetry rastreia falhas; Dapr provider garante entrega de mensagens | Resiliência em missão crítica e compliance |
| Geração Nuclear | Angra I, II, III | Não aplicável diretamente | — |
| Armazenamento | Baterias, Hidrelétrica reversível | StateStore versiona otimizações; Schemas gerenciam CacheInfo para cenários repetidos | Execução determinística e reprodutível |
| Transmissão | Linhas, Subestações | Messaging distribui simulações de fluxo; Telemetry rastreia pipeline completo; Tokens protege acesso a mapas de rede | Observabilidade e segurança de dados críticos |
| Distribuição | Redes MT/BT | InputHandlers processa áreas de concessão em GeoJSON; StateStore gerencia runs de análise de mercado | Automação de inputs geográficos e rastreabilidade |
| Comercialização | Varejista, Agente | Schemas definem parâmetros de precificação; SecretProvider gerencia API keys de mercado; Telemetry audita execuções | Segurança de dados financeiros e audit trail |
| Eficiência Energética | Indústria, Comércio | VibeDaprClient coordena chamadas entre microsserviços; StateStore persiste benchmarks; Constants centraliza limites | Arquitetura resiliente e manutenível |
| Biogás / Biometano | Aterro, Agricultura | InputHandlers processa polígonos de aterro; Telemetry rastreia pipeline MRV; Tokens protege imagens de satélite | Conformidade MRV e segurança de dados geoespaciais |
| Hidrogênio Verde | Eletrólise | Messaging coordena simulações de planta; StateStore gerencia versões de estudo; Constants define limites de paralelismo | Escalabilidade e reprodutibilidade de simulações |
| Mobilidade Elétrica | VEs, Frotas | InputHandlers processa rotas em GeoJSON; Telemetry rastreia análises; Dapr garante entrega de mensagens | Rastreabilidade de decisões e escalabilidade |
| Carbono | Créditos, MRV | Telemetry audita pipeline MRV completo; Tokens gera URLs seguras para relatórios; SecretProvider gerencia credenciais de registry | Audit trail completo e segurança de relatórios de carbono |
