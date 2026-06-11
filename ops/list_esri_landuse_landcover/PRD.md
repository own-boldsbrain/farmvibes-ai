# JTBDs (List ESRI Land Use Land Cover)

## JTBDs
1. Listar tiles de uso e cobertura do solo ESRI 10m (9 classes) para uma geometria e período
2. Obter metadados dos tiles disponíveis no Planetary Computer

## Descrição
Operação que consulta a coleção ESRI Land Use Land Cover do Planetary Computer e lista tiles que intersectam a geometria e intervalo de tempo fornecidos. O produto representa a classificação de 9 classes de uso do solo em resolução de 10m.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `listed_products` (List[EsriLandUseLandCoverProduct]): tiles ESRI LULC listados

## Lógicas e Cálculos
- Instancia `EsriLandUseLandCoverCollection` e faz query com bbox e time range
- Converte `start_datetime` e `end_datetime` do item STAC para o time range
- Cria `EsriLandUseLandCoverProduct` com ID, geometria e time range
