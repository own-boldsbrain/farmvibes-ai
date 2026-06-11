# JTBDs (Pair Intersecting Rasters)

## JTBDs
1. Parear rasters de duas listas que possuem geometrias com interseção espacial
2. Garantir que apenas pares com overlap espacial sejam processados adiante

## Descrição
Recebe duas listas de `Raster` e retorna pares preservando a ordem: para cada raster de `rasters1`, encontra todos os rasters de `rasters2` cuja geometria intersecta. Os outputs são duas listas sincronizadas (mesmo índice = par).

## Inputs
- `rasters1`: `List[Raster]`
- `rasters2`: `List[Raster]`

## Outputs
- `paired_rasters1`: `@INHERIT(rasters1)`
- `paired_rasters2`: `@INHERIT(rasters2)`

## Lógicas e Cálculos
- Itera sobre `rasters1` × `rasters2` testando `geom_n.intersects(geom_d)` com `shapely`
- Se nenhum par for encontrado, levanta `ValueError("No intersecting rasters could be paired")`
- Retorna listas sincronizadas (um raster de `rasters1` pode aparecer múltiplas vezes)
