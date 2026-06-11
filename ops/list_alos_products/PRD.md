# JTBDs (List ALOS Products)

## JTBDs
1. Encontrar produtos florestais ALOS disponíveis para uma região e período
2. Obter metadados dos itens do dataset ALOS Forest do Planetary Computer

## Descrição
Operação que consulta a coleção ALOS Forest do Planetary Computer e lista produtos que intersectam a geometria e intervalo de tempo fornecidos. Utiliza a biblioteca `vibe_lib.planetary_computer` para realizar a query STAC.

## Inputs
- `input_data` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `alos_products` (List[AlosProduct]): produtos ALOS disponíveis

## Lógicas e Cálculos
- Instancia `AlosForestCollection` e faz query com geometria e time range
- Valida que cada item STAC possui geometria
- Converte `start_datetime` e `end_datetime` do item para o time range do produto
- Retorna erro se nenhum item for encontrado
