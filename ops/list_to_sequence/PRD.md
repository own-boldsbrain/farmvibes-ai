# JTBDs (List to Sequence)

## JTBDs
1. Combinar múltiplos rasters em uma única sequência ordenada
2. Unificar geometrias e intervalos de tempo de vários rasters

## Descrição
Operação utilitária que recebe uma lista de objetos `Raster` e os combina em um `RasterSequence`. A geometria de saída é a união geométrica de todos os rasters, e o time range é o intervalo mínimo-máximo entre eles.

## Inputs
- `list_rasters` (List[Raster]): lista de rasters a serem combinados

## Outputs
- `rasters_seq` (RasterSequence): sequência de rasters com metadados unificados

## Lógicas e Cálculos
- Calcula `time_range_union`: menor `time_range[0]` e maior `time_range[1]` entre todos os rasters
- Calcula `geometry_union`: união geométrica via `unary_union` + `mapping`
- Gera ID único via SHA-256 concatenando "sequence" com todos os IDs dos rasters
- Adiciona cada raster individualmente à sequência via `add_item()`
