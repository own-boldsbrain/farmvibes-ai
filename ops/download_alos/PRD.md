# JTBDs (download_alos)

## JTBDs
1. Baixar mapas de classificação floresta/não-floresta do satélite ALOS
2. Integrar dados ALOS da Planetary Computer para análises de cobertura florestal

## Descrição
Baixa mapas de classificação de floresta/não-floresta do Advanced Land Observing Satellite (ALOS) via Planetary Computer. A operação consulta o tile ALOS pelo ID, faz download dos assets TIFF e retorna um raster categórico com as classes de cobertura florestal.

## Inputs
- `product`: `AlosProduct` com metadados do tile ALOS a ser baixado

## Outputs
- `raster`: `CategoricalRaster` com banda "forest_non_forest" e categorias do ALOS

## Lógicas e Cálculos
- Configura chave de assinatura da Planetary Computer
- Consulta coleção ALOS Forest pelo ID do produto
- Faz download dos assets do item encontrado
- Gera ID hash único baseado no produto, geometria e período
