# JTBDs (List Airbus Products)

## JTBDs
1. Encontrar imagens de satélite Airbus disponíveis para uma região e período específicos
2. Filtrar produtos por constelação (PHR/SPOT) e cobertura máxima de nuvens

## Descrição
Operação que consulta a API da Airbus para listar produtos de imageamento disponíveis (constelações PHR e SPOT) que intersectam a geometria e o intervalo de tempo fornecidos. Cada produto listado carrega metadados de aquisição e geometria real do raster.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `airbus_products` (List[AirbusProduct]): produtos Airbus disponíveis

## Lógicas e Cálculos
- Converte as constelações de string para enum `Constellation`
- Consulta a API AirBus com geometria, time range e `max_cloud_cover` (10%)
- Converte cada resultado para `AirbusProduct` com ID único, geometria real do raster e metadados da aquisição
