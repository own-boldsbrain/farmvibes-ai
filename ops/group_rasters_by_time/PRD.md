# JTBDs (Group Rasters by Time)

## JTBDs
1. Agrupar rasters por critério temporal (dia do ano, semana, mês, ano, mês+ano)
2. Produzir sequências ordenadas temporalmente de rasters

## Descrição
Agrupa uma lista de `Raster` em `RasterSequence` conforme o critério temporal definido. Os rasters são ordenados e agrupados usando `itertools.groupby` com a função chave baseada no `time_range[0]` de cada raster.

## Inputs
- `rasters`: `List[Raster]`
- Parâmetro: `criterion` (`"day_of_year"`, `"week"`, `"month"`, `"year"`, `"month_and_year"`)

## Outputs
- `raster_groups`: `List[RasterSequence]`

## Lógicas e Cálculos
- Função chave mapeada: `tm_yday`, `isocalendar()[1]`, `month`, `year`, `(year, month)`
- `groupby(sorted(rasters, key=criterion_func), criterion_func)`
- Clona primeiro raster como `RasterSequence` com id = `group_{key}_{gen_guid()}`, adiciona demais
