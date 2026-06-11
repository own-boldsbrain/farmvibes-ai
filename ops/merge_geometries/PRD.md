# JTBDs (Merge Geometries)

## JTBDs
1. Unificar múltiplas geometrias em uma única geometria combinada
2. Calcular interseção entre geometrias de itens diferentes

## Descrição
Cria um novo `DataVibe` com a geometria resultante da união ou interseção de todas as geometrias dos itens de entrada. Copia os demais metadados do primeiro item da lista.

## Inputs
- `items`: `List[DataVibe]`
- Parâmetro: `method` (`"union"` ou `"intersection"`)

## Outputs
- `merged`: `DataVibe`

## Lógicas e Cálculos
- `union`: aplica `shapely.unary_union` em todas as geometrias
- `intersection`: itera calculando `geom.intersection(geom_i)` incrementalmente
- Gera `id` hash SHA-256 a partir dos IDs dos itens + método
- Clona o primeiro item com `clone_from` usando a nova geometria mesclada
