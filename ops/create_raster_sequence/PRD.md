# JTBDs (create_raster_sequence)

## JTBDs
1. Combinar duas listas de rasters em uma única sequência ordenada
2. Mesclar um RasterSequence existente com uma lista de rasters

## Descrição
Cria uma única RasterSequence combinando rasters de duas listas de entrada (ou um sequence + lista), ordenados por data e unificando geometrias e períodos.

## Inputs
- `rasters1`: List[Raster] | RasterSequence — primeira lista ou sequência
- `rasters2`: List[Raster] — segunda lista de rasters

## Outputs
- `sequence`: RasterSequence — sequência combinada com geometria unificada

## Lógicas e Cálculos
1. Ordena cada lista por `time_range[0]` (ou extrai assets ordenados se for RasterSequence)
2. Calcula time_range unificado (min/max das datas)
3. Calcula geometria unificada via `unary_union` das geometrias individuais
4. Adiciona todos os rasters ordenados dentro do RasterSequence resultante
