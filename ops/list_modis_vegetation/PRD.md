# JTBDs (List MODIS Vegetation)

## JTBDs
1. Listar produtos MODIS de vegetação (NDVI/EVI, 16 dias) para uma região e período
2. Selecionar resolução (250m, 500m ou 1000m)

## Descrição
Operação que consulta a coleção MODIS 16-day Vegetation Indices do Planetary Computer e lista produtos que intersectam a geometria e período de entrada. Suporta os índices de vegetação NDVI e EVI.

## Inputs
- `input_data` (List[DataVibe]): geometrias e intervalos de tempo de interesse

## Outputs
- `modis_products` (List[ModisProduct]): produtos MODIS de vegetação listados

## Lógicas e Cálculos
- Valida resolução contra chaves disponíveis em `Modis16DayVICollection.collections`
- Para cada `DataVibe` de entrada, faz query na coleção com geometria e time range
- Deduplica itens por ID (dicionário items[i.id])
- Converte `start_datetime` e `end_datetime` do item para time_range do produto
