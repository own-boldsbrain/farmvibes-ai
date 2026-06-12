# JTBDs (Group Sentinel-1 Orbits)

## JTBDs
1. Agrupar rasters Sentinel-1 por número de orbita absoluta e tile MGRS
2. Consolidar tiles parciais divididos por passagem do satélite por estações base

## Descrição
Agrupa `Sentinel1Raster` em `Sentinel1RasterOrbitGroup` usando a chave `(orbit_number, tile_id)`. Cada grupo tem geometria = `unary_union` de todas as geometrias e intervalo de tempo = (min, max) das datas. Ordena por data para consistência do hash ID.

## Inputs
- `rasters`: `List[Sentinel1Raster]`

## Outputs
- `raster_groups`: `List[Sentinel1RasterOrbitGroup]`

## Lógicas e Cálculos
- `defaultdict(list)` chaveado por `(orbit_number, tile_id)`
- Para cada grupo: ordena por `time_range[0]`, calcula `unary_union` das geometrias, `time_range` = (min, max)
- Gera `group_id` = SHA-256 da concatenação dos IDs
- `clone_from` com geometria e time_range mesclados

## Use Cases
1. **Organização de dados**: Agrupar rasters/produtos por critérios espaciais ou temporais.
2. **Preparação para merge**: Estruturar sequências antes de operações de mosaico.
3. **Redução de complexidade**: Simplificar listas grandes em grupos gerenciáveis.

## Faz / Não Faz

- **Faz**: Agrupamento de itens por critérios espaciais e/ou temporais.
- **Não Faz**: Não altera o conteúdo dos itens agrupados.
- **Não Faz**: Não modifica a ordem interna dos itens.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `rasters` | — | Conforme especificação da operação |
| `List[Sentinel1Raster]` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `group_sentinel1_orbits` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.
- **Sentinel-1 (SAR)**: Radar C-band, GRD e RTC.

