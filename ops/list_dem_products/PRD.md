# JTBDs (List DEM Products)

## JTBDs
1. Listar tiles de modelo digital de elevação (DEM) que intersectam uma geometria
2. Selecionar resolução (10m ou 30m) e provedor (ex: USGS3Dep)

## Descrição
Operação que consulta provedores de DEM (como USGS 3DEP) e lista tiles que intersectam a geometria de entrada unificada, filtrando pela resolução desejada. Utiliza coleções do Planetary Computer.

## Inputs
- `input_items` (List[DataVibe]): geometrias e/ou intervalos de tempo de interesse

## Outputs
- `dem_products` (List[DemProduct]): produtos DEM listados

## Lógicas e Cálculos
- Faz união geométrica de todos os `input_items` via `unary_union`
- Valida provedor e resolução com `validate_dem_provider()`
- Filtra itens da coleção cujo `gsd` (ground sample distance) corresponda à resolução
- Cria `DemProduct` com `tile_id`, `resolution` e `provider`
