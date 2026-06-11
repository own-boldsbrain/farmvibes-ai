# PRD — `vibe_core` (FarmVibes.AI Core Package)

---

## 1. Visão Geral

O pacote `vibe_core` é o **núcleo de dados, modelos, cliente REST, CLI e infraestrutura Terraform** da plataforma FarmVibes.AI. Ele fornece:

- Modelo de dados agronômicos/geoespaciais com tipagem forte (Pydantic + STAC)
- Cliente HTTP para submissão e gerenciamento de workflows remotos
- CLI (`farmvibes-ai`) para deploy local (k3d/Docker) e remoto (AKS)
- Infraestrutura como código (Terraform) para provisioning de clusters
- Conversão STAC ↔ tipos nativos FarmVibes
- Monitoramento de execução de workflows com terminal interativo (Rich)

---

## 2. Datamodel (`datamodel.py`)

### Nome do Módulo
`vibe_core.datamodel`

### Descrição
Define as classes de transporte de dados entre cliente e servidor REST, incluindo payloads de execução, status de runs, métricas do sistema e codificação/decodificação zlib+base64.

### JTBDs (Jobs To Be Done)
- **J1** — Serializar/deserializar payloads de workflows entre cliente Python e API REST
- **J2** — Representar estados de execução (pending, queued, running, failed, done, cancelled, deleting, deleted)
- **J3** — Codificar saídas de workflows (zlib + base64) para transmissão eficiente
- **J4** — Modelar entradas espaço-temporais (região + intervalo de datas) para workflows

### Casos de Uso
- Envio de `RunConfigInput` para POST `/v0/runs`
- Leitura de `RunConfigUser` ao descrever uma execução via GET `/v0/runs/{id}`
- Monitoramento de status via `RunStatus` e `MonitoredWorkflowRun`
- Decodificação de saída comprimida ao consultar resultado de workflow

### Faz
- Define `SpatioTemporalJson`, `RunConfigInput`, `RunConfig`, `RunConfigUser`, `RunDetails`, `TaskDescription`
- Oferece `encode()` / `decode()` (zlib + base64)
- Interface abstrata `WorkflowRun` para runs monitoráveis
- Função `RunStatus.finished()` para verificar estados terminais

### Não Faz
- Não executa lógica de negócio de workflows
- Não gerencia autenticação/autorização
- Não lida com armazenamento persistente

### Users Inputs (classes de entrada)
- `SpatioTemporalJson(start_date, end_date, geojson)`
- `RunConfigInput(name, workflow, parameters, user_input)`
- `MetricsDict` (TypedDict) para métricas do sistema

### System Outputs (classes de saída)
- `RunConfig` / `RunConfigUser`: resultado de `describe_run`
- `RunDetails(start_time, submission_time, end_time, reason, status, subtasks)`
- `Message(message, id, location)` para respostas da API
- `MonitoredWorkflowRun(workflow, name, id, status, task_details)`

### Outcomes Esperados
- Cliente e servidor trocam dados com schema consistente
- Payloads grandes de saída são comprimidos sem perda
- Status de execução é rastreável em tempo real

### APIs / Endpoints
| Endpoint | Método | Classe Envolvida |
|---|---|---|
| `v0/workflows` | GET | `list_workflows()` |
| `v0/workflows/{name}?return_format=description` | GET | `describe_workflow()` |
| `v0/workflows/{name}?return_format=yaml` | GET | `get_workflow_yaml()` |
| `v0/runs` | GET | `list_runs()` |
| `v0/runs` | POST | `run()` |
| `v0/runs/{id}` | GET | `describe_run()` |
| `v0/runs/{id}` | DELETE | `delete_run()` |
| `v0/runs/{id}/cancel` | POST | `cancel_run()` |
| `v0/runs/{id}/resubmit` | POST | `resubmit_run()` |
| `v0/system-metrics` | GET | `get_system_metrics()` |

### CRUD (via `FarmvibesAiClient` / `VibeWorkflowRun`)
| Operação | Método | Descrição |
|---|---|---|
| **C** (Create) | `run()` | Submete workflow → retorna `VibeWorkflowRun` |
| **R** (Read) | `list_workflows()` / `list_runs()` / `describe_run()` / `describe_workflow()` | Consulta catálogo ou run específica |
| **U** (Update) | `resubmit_run()` / `cancel_run()` | Reexecuta ou cancela uma run |
| **D** (Delete) | `delete_run()` | Remove run e dados de cache |

### Schemas de Dados
| Classe | Campos Principais |
|---|---|
| `SpatioTemporalJson` | `start_date: datetime`, `end_date: datetime`, `geojson: Dict` |
| `RunConfigInput` | `name`, `workflow`, `parameters`, `user_input` |
| `RunConfig` | `id: UUID`, `details: RunDetails`, `task_details`, `spatio_temporal_json`, `output` |
| `RunConfigUser` | `output: OpIOType` (decodificado) |
| `RunStatus` | Enum: pending, queued, running, failed, done, cancelled, deleting, deleted |
| `RunDetails` | `start_time`, `submission_time`, `end_time`, `reason`, `status`, `subtasks` |
| `TaskDescription` | `inputs`, `outputs`, `parameters`, `task_descriptions`, `short_description`, `long_description` |
| `MonitoredWorkflowRun` | `workflow`, `name`, `id`, `status`, `task_details` |
| `MetricsDict` | `load_avg`, `cpu_usage`, `free_mem`, `used_mem`, `total_mem`, `disk_free` |

### Lógicas e Cálculos
- `encode(data)`: `zlib.compress` → `base64` → string
- `decode(data)`: `base64` → `zlib.decompress` → string
- `RunConfig.set_output()`: serializa e comprime a saída
- `RunConfigUser.from_runconfig()`: decodifica e hidrata o dataclass

---

## 3. Core Data Types (`data/core_types.py`)

### Nome do Módulo
`vibe_core.data.core_types`

### Descrição
Define a hierarquia de tipos base do FarmVibes.AI: `BaseVibe` → `DataVibe` → `TimeSeries`, `RasterPixelCount`, `DataSummaryStatistics`, `OrdinalTrendTest`, `DataSequence`, `GHGFlux`, `GHGProtocolVibe`, `FoodVibe`, `CarbonOffsetInfo`, etc.

### JTBDs
- **J1** — Modelar qualquer dado geoespacial com carimbo temporal, geometria e assets
- **J2** — Registrar automaticamente novos subtipos no `data_registry`
- **J3** — Gerar IDs hash (SHA-256) para desduplicação de dados
- **J4** — Validar tipos de portas (inputs/outputs) de workflows via `TypeParser`

### Casos de Uso
- Um workflow de NDVI produz `Raster` com bandas; o output é modelado como `DataVibe` com assets
- Um workflow de Food recebe `FoodFeatures` e produz `FoodVibe` com perfil nutricional
- GEEG (Greenhouse Gas) recebe `GHGProtocolVibe` com parâmetros de manejo

### Faz / Não Faz
- Faz: Geração automática de schema JSON e Pydantic Model para cada subtipo via `__init_subclass__`
- Não Faz: Não executa workflows; apenas modela entrada/saída

### Users Inputs / System Outputs
| Classe | Tipo | Descrição |
|---|---|---|
| `AssetVibe` | Asset | Referência a arquivo local/remoto com MIME type |
| `BaseVibe` | Base | Classe raiz, possui `schema()` e `pydantic_model()` |
| `DataVibe` | Dado geo | `id`, `time_range`, `bbox`, `geometry`, `assets` |
| `TimeSeries` | Dado geo | Série temporal (herda `DataVibe`) |
| `DataSequence` | Dado geo | Sequência ordenada de assets com `asset_order` |
| `GHGProtocolVibe` | Dado geo | 30+ campos de emissão (cultivo, fertilizantes, combustível, etc.) |
| `FoodVibe` | Base | Perfil nutricional com aminoácidos |
| `TypeParser` | Utilitário | Parse de strings tipo `List[Sentinel2Raster]` para tipos concretos |

### Lógicas e Cálculos
- `gen_hash_id()`: SHA-256 de `name + wkt(geometry) + time_start + time_end`
- `gen_guid()`: UUID aleatório
- `clone_from()`: Clona `DataVibe` alterando apenas `id`, `assets` e campos opcionais
- `DataSequence.add_item()`/`add_asset()`: Gerencia ordenação de assets
- `__init_subclass__`: Registra automaticamente todo subtipo no `data_registry`

---

## 4. Data Registry (`data/data_registry.py`)

### Nome do Módulo
`vibe_core.data.data_registry`

### Descrição
Registry singleton que mapeia nomes de classes para suas definições. Usado pelo `TypeParser` e pelo `StacConverter` para resolver tipos em tempo de execução.

### JTBDs
- **J1** — Permitir resolução de tipos por nome string em tempo de execução
- **J2** — Garantir registro único de cada tipo com warning em caso de duplicata

### API
- `register_vibe_datatype(classdef)` → registra classe
- `retrieve(id: str)` → retorna classe
- `get_name(classdef)` → `classdef.__name__`
- `get_id(classdef)` → `classdef.__name__`

---

## 5. Rasters (`data/rasters.py`)

### Nome do Módulo
`vibe_core.data.rasters`

### Descrição
Tipos especializados para dados raster: `Raster`, `RasterSequence`, `RasterChunk`, `CategoricalRaster`, `CloudRaster`, `DemRaster`, `NaipRaster`, `LandsatRaster`, `ModisRaster`, `GNATSGORaster`, `SamMaskRaster`, `RasterIlluminance`.

### JTBDs
- **J1** — Modelar bandas espectrais (`bands: Dict[str, int]`)
- **J2** — Suportar chunking para processamento distribuído (`RasterChunk`)
- **J3** — Diferenciar escalas de reflectância (`LandsatRaster.scale = 2.75e-5`, `ModisRaster.scale = 1e-4`)
- **J4** — Modelar máscaras SAM com scores e bounding boxes

### Datasets / Tipos
| Classe | Especialização | Atributos Distintos |
|---|---|---|
| `Raster` | `DataVibe` | `bands: Dict[str, int]`, `raster_asset`, `visualization_asset` |
| `CategoricalRaster` | `Raster` | `categories: List[str]` |
| `CloudRaster` | `Raster` | `bands = {"cloud": 0}` |
| `RasterChunk` | `Raster` | `chunk_pos`, `num_chunks`, `limits`, `write_rel_limits` |
| `SamMaskRaster` | `CategoricalRaster` | `mask_score: List[float]`, `mask_bbox: List[BBox]`, `chip_window` |
| `DemRaster` | `Raster + DemProduct` | — |
| `LandsatRaster` | `LandsatProduct + Raster` | `scale = 2.75e-5`, `offset = -0.2` |
| `ModisRaster` | `Raster` | `scale = 1e-4` |

### Lógicas e Cálculos
- `Raster.raster_asset`: Busca asset com MIME de imagem
- `RasterSequence.add_item()`: Adiciona `raster_asset` de um `Raster` à sequência

---

## 6. Sentinel (`data/sentinel.py`)

### Nome do Módulo
`vibe_core.data.sentinel`

### Descrição
Tipos especializados para dados Sentinel-1, Sentinel-2 e SpaceEye: produtos, rasters, orbit groups, tile sequences e cloud masks.

### JTBDs
- **J1** — Modelar metadados de produtos Sentinel (órbita, plataforma, processamento)
- **J2** — Gerenciar bands baixadas com asset mapping (S2: TIFF/JP2, S1: ZIP)
- **J3** — Agrupar rasters por órbita (`OrbitGroup`) com ordenação temporal
- **J4** — Modelar sequências por tile (`TileSequence`) com `write_time_range`

### Datasets / Tipos
| Classe | Pai | Descrição |
|---|---|---|
| `SentinelProduct` | `DataVibe` | Metadados base (product_name, orbit, platform) |
| `Sentinel1Product` | `SentinelProduct` | `sensor_mode`, `polarisation_mode` |
| `Sentinel2Product` | `SentinelProduct` | `tile_id`, `processing_level` (L1C/L2A) |
| `SentinelRaster` | `Raster + SentinelProduct` | Raster de Sentinel |
| `Sentinel2Raster` | `Raster + Sentinel2Product` | `scale = 1e-4` |
| `Sentinel1Raster` | `Raster + Sentinel1Product` | `tile_id` |
| `DownloadedSentinel2Product` | `Sentinel2Product` | `asset_map`, `add_downloaded_band()` |
| `Sentinel1RasterOrbitGroup` | `Sentinel1Raster` | `asset_map`, `get_ordered_assets()` |
| `Sentinel2CloudMask` | `CloudMask + Sentinel2Product` | Cloud mask específica S2 |
| `TileSequence` | `RasterSequence` | `write_time_range` |
| `SpaceEyeRaster` | `Sentinel2Raster` | Raster SpaceEye |

### Lógicas e Cálculos
- `discriminator_date()`: Extrai data do nome do produto S2
- `DownloadedSentinel2Product.add_downloaded_band()`: Valida MIME TIFF/JP2 e mapeia GUID
- `OrbitGroup.get_ordered_assets()`: Ordena assets por data de aquisição
- `Tile2Sequence` / `Sequence2Tile`: Mapeamento bidirecional entre tile e sequência

---

## 7. Farm / ADMAg (`data/farm.py`, `admag_client.py`)

### Nome do Módulo
`vibe_core.data.farm` + `vibe_core.admag_client`

### Descrição
Modelos de dados integração com Azure Data Manager for Agriculture (ADMAg): campos sazonais, fertilizantes, harvest, tillage, prescrições. O `ADMAgClient` faz a autenticação MSAL e chamadas REST à API ADMAg.

### JTBDs
- **J1** — Modelar operações de manejo agrícola (plantio, colheita, fertilização, preparo do solo)
- **J2** — Buscar dados de campo do Azure ADMAg via REST com autenticação OAuth2
- **J3** — Mapear prescrições de insumos por campo/safra

### Datasets / Tipos (`farm.py`)
| Classe | Pai | Campos |
|---|---|---|
| `ADMAgSeasonalFieldInput` | `BaseVibe` | `party_id`, `seasonal_field_id` |
| `SeasonalFieldInformation` | `DataVibe` | `crop_name`, `crop_type`, `fertilizers`, `harvests`, `tillages`, `organic_amendments` |
| `FertilizerInformation` | — | `start_date`, `end_date`, `total_nitrogen`, `enhanced_efficiency_phosphorus` |
| `HarvestInformation` | — | `is_grain`, `start_date`, `end_date`, `crop_yield`, `stray_stover_hay_removal` |
| `TillageInformation` | — | `start_date`, `end_date`, `implement` |
| `ADMAgPrescription` | `BaseVibe` | `partyId`, `prescriptionMapId`, `productCode`, `measurements`, `geometry` |

### API do `ADMAgClient`
| Método | Endpoint ADMAg | Descrição |
|---|---|---|
| `get_seasonal_fields(party_id)` | `GET /parties/{id}/seasonal-fields` | Lista campos sazonais |
| `get_field(party_id, field_id)` | `GET /parties/{id}/fields/{field_id}` | Detalhes do campo |
| `get_harvest_info(...)` | `POST /harvest-data:search` | Dados de colheita |
| `get_fertilizer_info(...)` | `POST /application-data:search` | Dados de fertilizante |
| `get_tillage_info(...)` | `POST /tillage-data:search` | Dados de preparo |
| `get_planting_info(...)` | `POST /planting-data:search` | Dados de plantio |
| `get_prescriptions(...)` | `POST /prescription:search` | Prescrições |

### Infraestrutura de Autenticação
- MSAL `ConfidentialClientApplication` para OAuth2 client credentials
- Token armazenado na sessão, renovado sob demanda
- Headers: `Authorization: Bearer {token}`, `Content-Type: application/merge-patch+json`

---

## 8. Products (`data/products.py`)

### Nome do Módulo
`vibe_core.data.products`

### Descrição
Metadados de produtos de sensoriamento remoto suportados: DEM, NAIP, Landsat, CHIRPS, ERA5, MODIS, GEDI, gNATSGO, ClimatologyLab, GLAD, Hansen, Esri LULC, Herbie, Bing Maps, ALOS, CDL.

### Datasets / Tipos
| Classe | Descrição | Atributos Distintos |
|---|---|---|
| `DemProduct` | DEM tile | `tile_id`, `resolution`, `provider` |
| `NaipProduct` | NAIP tile | `tile_id`, `year`, `resolution` |
| `LandsatProduct` | Landsat tile | `tile_id`, `asset_map`, `add_downloaded_band()` |
| `ChirpsProduct` | CHIRPS precipitação | `url` |
| `Era5Product` | ERA5 clima | `item_id`, `var`, `cds_request` |
| `GEDIProduct` | GEDI LiDAR | `product_name`, `start_orbit`, `stop_orbit`, `processing_level` |
| `HansenProduct` | Hansen forest change | `asset_url`, validação regex, `tile_name`, `last_year`, `version`, `layer_name` |
| `HerbieProduct` | Herbie weather model | `model`, `product`, `lead_time_hours`, `search_text` |
| `GNATSGOProduct` | gNATSGO solo | — |
| `ClimatologyLabProduct` | Climatologia | `url`, `variable` |
| `GLADProduct` | GLAD | `url`, `tile_name` |
| `BingMapsProduct` | Bing Maps | `url`, `zoom_level`, `imagery_set`, `map_layer`, `orientation` |
| `EsriLandUseLandCoverProduct` | Esri LULC | — |

---

## 9. Weather (`data/weather.py`)

### Nome do Módulo
`vibe_core.data.weather`

### Descrição
Tipos para dados meteorológicos: GFS forecasts, GRIB files.

### Datasets / Tipos
| Classe | Pai | Campos |
|---|---|---|
| `GfsForecast` | `DataVibe` | `publish_time` |
| `WeatherVibe` | `DataVibe` | — |
| `Grib` | `Raster` | `meta: Dict[str, str]` |

### Lógicas
- `gen_forecast_time_hash_id()`: SHA-256 de `name + wkt(geometry) + publish_time + time_range`

---

## 10. Airbus (`data/airbus.py`)

### Nome do Módulo
`vibe_core.data.airbus`

### Descrição
Tipos para imagens Airbus: metadados de produto, preço, raster.

### Datasets / Tipos
| Classe | Pai | Campos |
|---|---|---|
| `AirbusProduct` | `DataVibe` | `acquisition_id`, `extra_info` |
| `AirbusPrice` | `DataVibe` | `price: float` |
| `AirbusRaster` | `Raster + AirbusProduct` | Raster Airbus baixado |

---

## 11. STAC Converter (`data/utils.py`)

### Nome do Módulo
`vibe_core.data.utils`

### Descrição
Conversão bidirecional entre tipos `BaseVibe` e STAC Items (pystac). Gerencia serialização/deserialização de geometry (shapely ↔ GeoJSON), datetime ↔ ISO string, e type resolution via `data_registry`.

### JTBDs
- **J1** — Converter objetos FarmVibes para STAC para armazenamento em Catálogo STAC (CosmosDB)
- **J2** — Hidratar STAC items de volta para tipos concretos FarmVibes
- **J3** — Validar e sanitizar propriedades para garantir JSON serializable

### APIs
| Método | Descrição |
|---|---|
| `StacConverter.to_stac_item(BaseVibe)` → `Item` | Converte para STAC |
| `StacConverter.from_stac_item(Item)` → `BaseVibe` | Hidrata de STAC |
| `serialize_input(input_data)` → `Dict/List` | Serializa input para payload REST |
| `serialize_stac(item)` → `Dict` | STAC → dict |
| `deserialize_stac(dict)` → `Item` | Dict → STAC |
| `get_base_type(vibetype)` → `Type[BaseVibe]` | Resolve tipo base |
| `is_container_type(typeclass)` → `bool` | Verifica se é `List[X]` |

### Lógicas
- `_to_stac_impl()`: Extrai `start_datetime`, `end_datetime`, `bbox`, `geometry` do `DataVibe`
- `_from_stac_impl()`: Lê `terravibes_data_type` dos extra_fields, resolve classe e constrói instância
- `convert_field()`: Conversão recursiva para tipos aninhados (`List`, `Dict`, `Tuple`)
- `sanitize_properties()`: Remove campos não serializáveis

---

## 12. JSON Converter (`data/json_converter.py`)

### Nome do Módulo
`vibe_core.data.json_converter`

### Descrição
Encoder JSON customizado (`DataclassJSONEncoder`) que serializa dataclasses Pydantic, datetimes e BaseModels.

### API
- `dump_to_json(data)` → `str`: Serializa qualquer objeto FarmVibes para JSON

---

## 13. Client (`client.py`)

### Nome do Módulo
`vibe_core.client`

### Descrição
Cliente HTTP principal (`FarmvibesAiClient`) para interação com o serviço FarmVibes.AI. Implementa `list_workflows`, `describe_workflow`, `run`, `list_runs`, `cancel_run`, `delete_run`, `resubmit_run`, `get_system_metrics`, `monitor`. Exposto como `Client` e `FarmvibesAiClient` no `__init__`.

### JTBDs
- **J1** — Submeter workflows com geometria + tempo OU input data pré-existente
- **J2** — Monitorar execução de runs (single ou batch) com atualização ao vivo (Rich)
- **J3** — Cancelar/deletar/resubmeter runs
- **J4** — Documentar workflows (descrição em rich text)
- **J5** — Verificar espaço em disco antes de executar

### Faz / Não Faz
- Faz: Formação de payload, chamadas HTTP, polling de status, conversão de output
- Não Faz: Autenticação (espera que o endpoint já esteja acessível); não gerencia clusters

### Users Inputs
- `workflow: str | Dict` (nome ou YAML dict)
- `geometry: BaseGeometry` (shapely)
- `time_range: Tuple[datetime, datetime]`
- `input_data: InputData[T]` (alternativa a geometry + time_range)
- `parameters: Optional[Dict]`
- `run_name: str`

### System Outputs
- `VibeWorkflowRun`: objeto que trackeia status e output
- `RunConfigUser`: detalhes completos de uma execução
- `List[str]`: lista de workflows
- `MetricsDict`: métricas do servidor

### Lógicas e Cálculos
- `_form_payload()`: Monta dict de payload com `RunConfigInput` e `serialize_input()`
- `_request()`: Wrapper com tratamento de erro HTTP e parse JSON
- `VibeWorkflowRun._convert_output()`: Converte STAC items do output para `DataVibe` via `StacConverter`
- `_block_until_status()`: Polling com timeout até um status desejado
- `get_default_vibe_client()`: Tenta remote primeiro, fallback local

### Monitoramento
- `VibeWorkflowRunMonitor`: Usa Rich `Live` display com tabela de tasks
- Suporta single-run e multi-run monitoring
- Progress bars com `ProgressBar` para subtasks completadas
- Atualização de warnings (ex: disco baixo) a cada `refresh_warnings_time_min`

---

## 14. File Downloader (`file_downloader.py`)

### Nome do Módulo
`vibe_core.file_downloader`

### Descrição
Utilitário de download de arquivos com retry session (urllib3), chunk streaming e verificação de URL.

### API
- `retry_session()` → `requests.Session` com retry (5x, backoff 0.3s)
- `download_file(url, file_path)` → `str`: Download com streaming de 1MB chunks
- `verify_url(url)` → `bool`: HEAD/GET de validação

---

## 15. Monitor (`monitor.py`)

### Nome do Módulo
`vibe_core.monitor`

### Descrição
Classes de formatação e exibição de status de workflows no terminal usando Rich: `VibeWorkflowDocumenter` e `VibeWorkflowRunMonitor`.

### APIs
- `VibeWorkflowDocumenter.print_documentation()`: Exibe descrição formatada do workflow
- `VibeWorkflowRunMonitor.update_run_status()`: Atualiza tabela em tempo real
- `strftimedelta()`: Formata timedelta como `HH:MM:SS`

---

## 16. URI (`uri.py`)

### Nome do Módulo
`vibe_core.uri`

### Descrição
Utilitários para manipulação de URIs: detecção de path local, conversão `file://` → path, extração de filename.

### API
- `is_local(url)` → `bool`: Verifica scheme `file` ou vazio
- `local_uri_to_path(uri)` → `str`: Converte `file:///path` para `/path`
- `uri_to_filename(uri)` → `str`: Extrai basename do path

---

## 17. Utilitários Gerais (`utils.py`)

### Nome do Módulo
`vibe_core.utils`

### Descrição
Funções auxiliares: `ensure_list`, `get_input_ids`, `rename_keys`, `format_double_escaped`, geração de diagramas Mermaid para workflows.

### API
- `ensure_list(x)` → `List[T]`: Normaliza para lista
- `get_input_ids(input: OpIOType)` → `Dict`: Extrai IDs dos inputs
- `draw_mermaid_diagram(vertices, edges)` → `str`: Gera diagrama `graph TD`
- `build_mermaid_edge(origin, destination, ...)` → `str`: Constrói aresta Mermaid

---

## 18. CLI (`cli/`)

### Nome do Módulo
`vibe_core.cli`

### Descrição
CLI `farmvibes-ai` para gerenciamento de clusters local (k3d/Kubernetes via Docker) e remoto (AKS). Inclui parsers, dispatchers, wrappers para kubectl, terraform, docker, dapr, k3d, Azure CLI.

### JTBDs
- **J1** — Provisionar cluster Kubernetes local com k3d + Terraform
- **J2** — Provisionar cluster AKS no Azure com rede, storage, monitor, cert-manager
- **J3** — Gerenciar secrets, ONNX models, e atualizações de cluster
- **J4** — Obter status e URL do serviço
- **J5** — Fazer backup/restore de Redis antes de destruir cluster

### Comandos (`farmvibes-ai local|remote`)

| Comando | Local | Remoto (AKS) | Descrição |
|---|---|---|---|
| `setup` | ✅ | ✅ | Cria cluster (k3d ou AKS) |
| `update` | ✅ | ✅ | Atualiza serviços do cluster |
| `destroy` | ✅ | ✅ | Remove cluster (com backup opcional) |
| `start` | ✅ | ❌ | Inicia cluster parado |
| `stop` | ✅ | ❌ | Para cluster |
| `restart` | ✅ | ✅ | Reinicia deployments |
| `status` | ✅ | ✅ | Mostra URL e estado do cluster |
| `add-secret` | ✅ | ✅ | Adiciona secret Kubernetes |
| `delete-secret` | ✅ | ✅ | Remove secret |
| `add-onnx` | ✅ | ✅ | Adiciona modelo ONNX ao storage |

### Subcomandos e Flags (Local)
- `--servers`, `--agents`: Topologia do cluster k3d
- `--storage-path`: Diretório de cache
- `--registry`, `--registry-username`, `--registry-password`: Container registry
- `--image-tag`, `--image-prefix`: Tag das imagens
- `--worker-replicas`: Réplicas do worker
- `--port`, `--host`: Binding do REST API
- `--enable-telemetry`: Ativa OpenTelemetry

### Subcomandos e Flags (Remoto / AKS)
- `--resource-group`, `--cluster-name`: Identificação do cluster Azure
- `--region`: Região Azure
- `--cert-email`: Email para Let's Encrypt
- `--max-worker-nodes`: Máximo de VMs no node pool
- `--worker-replicas`: Réplicas do worker
- `--environment`: Azure environment (public, usgovernment, german, china)

### Wrappers
| Wrapper | Função |
|---|---|
| `K3dWrapper` | Gerencia cluster k3d (create, delete, start, stop) |
| `KubectlWrapper` | Operações kubectl (apply, delete, exec, cp, scale, restart) |
| `TerraformWrapper` | Executa Terraform com workspaces |
| `DockerWrapper` | Operações Docker (exec, cp, network) |
| `DaprWrapper` | Upgrade de CRDs do Dapr |
| `AzureCliWrapper` | Autenticação Azure, ACR, AKS, resource groups |

---

## 19. Infraestrutura Terraform

### Nome do Módulo
`vibe_core.terraform`

### Descrição
Código Terraform para deploy dos serviços FarmVibes.AI em clusters Kubernetes. Três categorias:

- **`terraform/services/`**: Deploy dos microsserviços (restapi, orchestrator, worker, cache, dataops) usando módulo reutilizável que varia conforme local vs. AKS
- **`terraform/local/`**: Infra local — módulo Kubernetes com Redis, RabbitMQ, Jaeger, OpenTelemetry, Dapr, persistent volume
- **`terraform/aks/`**: Infra Azure — resource group, VNet, AKS cluster, storage account, CosmosDB, KeyVault, cert-manager, Azure Monitor

### Serviços (`terraform/services/`)

| Serviço | Imagem Docker | Porta | Dapr App ID | Descrição |
|---|---|---|---|---|
| `restapi` | `api-orchestrator` | 3000 | `terravibes-rest-api` | REST API + Ingress |
| `orchestrator` | `api-orchestrator` | 3000 | `terravibes-orchestrator` | Orquestração de workflows |
| `worker` | `worker` | 3000 | `terravibes-worker` | Execução de tarefas (grpc) |
| `cache` | `cache` | 3000 | `terravibes-cache` | Cache de dados (grpc) |
| `dataops` | `cache` | 3000 | `terravibes-data-ops` | Operações de dados STAC |

### Componentes de Infra (Local)
- **Redis** (state store Dapr)
- **RabbitMQ** (pub/sub Dapr)
- **Jaeger** (tracing)
- **OpenTelemetry Collector**
- **Dapr** (sidecar injection)
- **cert-manager** (TLS, local via Traefik)

### Componentes de Infra (AKS)
- **Resource Group** + naming random
- **VNet** + subnets
- **AKS cluster** com node pools (system + user)
- **Azure Storage** (blob para assets)
- **CosmosDB** (STAC catalog)
- **KeyVault** (secrets)
- **Azure Monitor** + Application Insights
- **Public IP** + DNS label
- **Let's Encrypt** (cert-manager)
- **nginx-ingress**

---

## 20. Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Módulo | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD (Geração Distribuída) | `client.py` + `datamodel.py` para submeter workflows de previsão solar usando dados `Sentinel2Raster` e `GfsForecast` | Previsão de irradiância e geração para usinas solares de até 5 MW conectadas à rede de distribuição |
| Geração Solar | GC (Geração Centralizada) | `client.py` + `terraform/aks/` para workflows em larga escala; `AirbusRaster` para inspeção de parques solares de grande porte | Monitoramento de eficiência de painéis, detecção de sombreamento e sujeira em usinas >5 MW |
| Geração Eólica | Onshore | `data/weather.py` (`GfsForecast` + `Grib`) combinado com `DemRaster` para análise de vento em topografia complexa | Previsão de vento em 48h com resolução de 3 km para fazendas eólicas terrestres |
| Geração Eólica | Offshore | `Era5Product` + `ChirpsProduct` para condições oceânicas; `Sentinel1Raster` (modo IW) para detecção de ondas e vento | Previsão de vento offshore e detecção de correntes marinhas para parques eólicos marítimos |
| Geração Hidrelétrica | Fio d'Água | `ClimatologyLabProduct` + `CHIRPSProduct` para histórico de precipitação; `DemProduct` para modelo digital de elevação | Previsão de vazão e energia firme com base em séries históricas de precipitação e evapotranspiração |
| Geração Hidrelétrica | Reservatório | `GHGProtocolVibe` para cálculo de emissões de metano do reservatório; `Sentinel2Raster` para monitoramento do espelho d'água | Estimativa de emissões de GEE e gestão do nível do reservatório para otimização da geração |
| Geração Termelétrica | Biomassa | `SeasonalFieldInformation` + `FoodVibe` para modelagem de culturas energéticas (cana-de-açúcar, eucalipto, palma); `LandsatRaster` para estimativa de produtividade | Precificação de biomassa e programação de colheita com base em NDVI e índices vegetativos |
| Geração Termelétrica | Gás Natural | `HerbieProduct` para previsão de demanda de gás; `ADMAgPrescription` não se aplica diretamente; usa `Era5Product` para temperatura | Previsão de demanda para térmicas a gás com base em ondas de calor/frio e despacho do ONS |
| Armazenamento | Baterias (BESS) | `DataVibe` + `TimeSeries` para modelagem de séries de preço de energia; `client.run()` para workflow de otimização de carga/descarga | Otimização do schedule de carga/descarga com base em preço horário da CCEE e previsão de geração renovável |
| Armazenamento | Hidrelétrica Reversível | `DemRaster` + `Sentinel1Raster` (InSAR) para monitoramento geotécnico; `ClimatologyLabProduct` para disponibilidade hídrica | Viabilidade geotécnica e hidrológica para projetos de bombeamento com análise de séries históricas |
| Comercialização | Varejo (Mercado Livre) | `get_input_ids()` + `ensure_list()` para processamento de carga de clientes; `client.list_workflows()` + `run()` para workflow de forecast de carga | Previsão de carga horária para clientes do mercado livre com 96% de acuracidade |
| Comercialização | Balanço de Energia | `GHGFlux` + `CarbonOffsetInfo` para rastreabilidade de carbono; `FarmvibesAiClient.monitor()` para acompanhamento de execuções em lote | Relatórios de balanço energético com pegada de carbono para certificação I-REC e/ou REC |
