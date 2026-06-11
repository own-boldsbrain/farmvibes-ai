# JTBDs (List Landsat Products PC)

## JTBDs
1. Listar cenas Landsat disponíveis no Planetary Computer para uma região e período
2. Obter metadados dos tiles para download ou processamento posterior

## Descrição
Operação que consulta a coleção Landsat do Planetary Computer e lista produtos que intersectam a geometria e intervalo de tempo fornecidos. Cada produto contém ID, geometria e data da cena.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `landsat_products` (List[LandsatProduct]): produtos Landsat listados

## Lógicas e Cálculos
- Instancia `LandsatCollection` e faz query com bbox e time range
- Converte datetime do item STAC para time_range do produto
- Armazena o tile_id (ID original do item)
- Retorna erro se nenhum produto for encontrado
