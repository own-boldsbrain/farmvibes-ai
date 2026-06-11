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
