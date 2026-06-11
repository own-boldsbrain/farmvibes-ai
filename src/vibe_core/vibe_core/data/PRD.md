# PRD — Módulo Data (vibe_core.data)

## JTBDs (Jobs To Be Done)

1. **Representar dados geoespaciais com tipagem forte e auto-validação** — O cientista de dados precisa definir tipos como `Raster`, `Sentinel2Raster`, `Farm`, `Weather` que carreguem metadados (geometria, bbox, time range, bandas, assets) com validação automática via Pydantic no `__post_init__`.

2. **Associar assets (arquivos) a objetos de dados com download lazy** — Cada `DataVibe` contém uma lista de `AssetVibe`. Quando o asset é remoto, seu `local_path` é baixado sob demanda (lazy) para um diretório temporário na primeira vez que a propriedade é acessada, evitando downloads desnecessários.

3. **Registrar e recuperar tipos de dados dinamicamente** — O sistema deve manter um registry global (`__DATA_REGISTRY`) que mapeia nomes de classes a suas definições, permitindo que `TypeParser.parse("Raster")` resolva strings para tipos concretos em tempo de execução.

4. **Calcular hash ID único para cada instância de dado** — Cada `DataVibe` precisa de um identificador único baseado em SHA-256 de seu conteúdo JSON (exceto `id`, `assets`, `hash_id`, `bbox`), permitindo cache e deduplicação. Quando o objeto possui `geometry`, o hash também considera nome + geometria WKT + time range (`gen_hash_id`).

5. **Converter entre representações dict, JSON, STAC e Pydantic** — O módulo deve suportar conversão bidirecional: `DataVibe` ↔ dict (via `from_dict`/`asdict`), `DataVibe` ↔ JSON (via `dump_to_json`), e integração com STAC via `StacConverter` em `utils.py`.

6. **Modelar produtos de satélite específicos (Sentinel-1/2, Landsat, NAIP, MODIS, DEM, Airbus)** — O engenheiro de dados precisa de tipos especializados que herdam de `Raster`/`DataVibe` e adicionam campos como `orbit_number`, `tile_id`, `processing_level`, `sensor_mode`, `resolution`, `provider`, preservando a semântica de cada fonte.

7. **Modelar dados agrícolas (ADMA, GHG Protocol, Food, Farm)** — O agrônomo precisa de tipos que representam prescrições agrícolas (ADMAg), emissões de gases de efeito estufa, composição nutricional de alimentos, informações sazonais de campo, com dezenas de parâmetros opcionais com defaults.

8. **Suportar sequências ordenadas de dados temporais** — O `DataSequence` e `RasterSequence` permitem agrupar múltiplos `DataVibe`/`Raster` em séries temporais ordenadas, com mapeamento de asset → time range → geometria para cada elemento.

## Descrição do Módulo

Modelo de dados central do FarmVibes.AI. Define a hierarquia de tipos (`BaseVibe` → `DataVibe` → `Raster`/`SentinelProduct`/etc.), o sistema de assets com download lazy, o data registry global, conversores JSON/STAC, e tipos especializados para satélites (Sentinel-1/2, Landsat, MODIS, NAIP, DEM, Airbus), clima (GFS, GRIB), agricultura (ADMA, GHG Protocol), e alimentos (FoodVibe).

## Inputs

- `BaseVibe` — classe base abstrata; `from_dict(data: Dict) -> BaseVibe`, `hash_id -> str`
- `DataVibe(BaseVibe)` — `id: str`, `time_range: TimeRange`, `geometry: Dict`, `assets: List[AssetVibe]`; `bbox` calculado automaticamente
- `AssetVibe` — `id: str`, `path_or_url: str`, `type: Optional[str]`; download lazy via `local_path`
- `Raster(DataVibe)` — `bands: Dict[str, int]`; propriedades: `raster_asset`, `visualization_asset`
- `SentinelProduct(DataVibe)` — `product_name`, `orbit_number`, `relative_orbit_number`, `orbit_direction`, `platform`, `extra_info`
- `Sentinel1Product(SentinelProduct)` — `sensor_mode`, `polarisation_mode`
- `Sentinel2Product(SentinelProduct)` — `tile_id`, `processing_level` (L1C/L2A)
- `Sentinel2Raster(Raster)` — bandas específicas, `cloud_mask`
- `LandsatProduct(DataVibe)` — `tile_id`, `asset_map: Dict[str, str]`
- `DemProduct(DataVibe)` — `tile_id`, `resolution`, `provider`
- `NaipProduct(DataVibe)` — `tile_id`, `year`, `resolution`
- `AirbusProduct(DataVibe)` — `acquisition_id`, `extra_info`
- `AirbusRaster(Raster, AirbusProduct)` — herança múltipla
- `ADMAgSeasonalFieldInput(BaseVibe)` — `party_id`, `seasonal_field_id`
- `FertilizerInformation` — `start_date`, `end_date`, `application_type`, `total_nitrogen`, etc.
- `GHGProtocolVibe(DataVibe)` — ~30 parâmetros opcionais (área de cultivo, fertilizantes, combustíveis, uso do solo, bioma)
- `FoodVibe(BaseVibe)` — macro/micronutrientes, aminoácidos, `fasta_sequence`, `protein_families`
- `GfsForecast(DataVibe)` — dados de previsão meteorológica
- `Grib(Raster)` — dados GRIB meteorológicos
- `DataSequence(DataVibe)` — `asset_order`, `asset_time_range`, `asset_geometry`
- `RasterSequence(DataSequence, Raster)` — sequência de rasters
- `SamMaskRaster(CategoricalRaster)` — `mask_score`, `mask_bbox`, `chip_window`
- `S2ProcessingLevel` — enum (`L1C`, `L2A`)
- `BBox = Tuple[float, float, float, float]`, `Point = Tuple[float, float]`, `TimeRange = Tuple[datetime, datetime]`, `ChipWindow = Tuple[float, float, float, float]`

## Outputs

- Instâncias dos tipos acima, todos subclasses de `BaseVibe`
- `str` — hash ID (SHA-256 hexdigest)
- `str` — URL ou path local de asset (via `AssetVibe.url` / `AssetVibe.local_path`)
- `TypeDictVibe` — dicionário validado de tipos (`DataVibeType`)
- `DataVibeType` — tipo resolvido (`BaseVibe` ou `List[BaseVibe]`)
- Dicionários serializados via `dump_to_json`
- Modelos Pydantic gerados via `BaseVibe.pydantic_model()`
- Registro no `data_registry` — efeito colateral de `__init_subclass__`

## Lógicas e Cálculos

- **Registro automático:** `BaseVike.__init_subclass__` é chamado para cada nova subclasse, registrando-a automaticamente em `__DATA_REGISTRY` via `data_registry.register_vibe_datatype`. Se a classe já foi registrada, emite `DeprecationWarning` e retorna a classe existente.
- **Geração de hash ID:** `gen_hash_id` calcula `SHA-256(name + wkt(geometry) + time_range_start.isoformat() + time_range_end.isoformat())`. Em `BaseVibe.hash_id`, o fallback é `SHA-256(dump_to_json(self))`.
- **Cálculo de bbox:** `DataVibe.__post_init__` faz `shpg.shape(self.geometry).bounds` para calcular `(minx, miny, maxx, maxy)` automaticamente.
- **Download lazy de assets:** `AssetVibe.local_path` verifica `_is_local`; se remoto e não baixado, chama `download_file` e armazena em `_local_path` dentro de um `TemporaryDirectory` que é limpo no `__del__`.
- **Geração de modelo Pydantic:** `pydantic_model()` em `BaseVibe.__init_subclass__` usa `pydataclass(cls).__pydantic_model__`. Para `DataVibe`, faz deepcopy da classe, substitui `asset_geometry` de `BaseGeometry` para `Dict[str, Any]` (para serialização), e cria um `PydanticAssetVibe` intermediário.
- **Ordenação de sequências:** `DataSequence.add_item` incrementa `self.idx` e adiciona ao `asset_order`, `asset_time_range`, `asset_geometry`. `get_ordered_assets` ordena por `asset_order[x.id]`, aceitando `order_by` opcional.
- **Parsing de tipos:** `TypeParser.parse` usa regex `r"((\w+)\[)?(\w+)\]?"` para extrair container (List) e data ID. Se encontrar `@INHERIT(nome)`, cria `UnresolvedDataVibe` que será resolvido em tempo de execução pelo workflow.
- **Fator de escala em rasters:** `LandsatRaster.__post_init__` define `scale=2.75e-5, offset=-0.2`; `ModisRaster` define `scale=1e-4`; `Raster` base define `scale=1, offset=0`. Estes são usados por downstream para converter valores de pixel para unidades físicas.
