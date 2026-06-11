# JTBDs (List gNATSGO Products)

## JTBDs
1. Listar produtos de solo gNATSGO do Planetary Computer para uma geometria
2. Obter dados de solo para análises agrícolas (EUA continental)

## Descrição
Operação que consulta a coleção gNATSGO (Gridded National Soil Survey Geographic Database) do Planetary Computer e lista produtos de solo que intersectam a geometria de entrada. Limitado à área do EUA continental.

## Inputs
- `input_item` (DataVibe): geometria de interesse

## Outputs
- `gnatsgo_products` (List[GNATSGOProduct]): produtos gNATSGO listados

## Lógicas e Cálculos
- Instancia `GNATSGOCollection` e faz query com bbox da geometria
- Define time_range de cada produto como a data do item (datetime único)
- Valida que geometria esteja dentro do EUA continental; retorna erro caso contrário
