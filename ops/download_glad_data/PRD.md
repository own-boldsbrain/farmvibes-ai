# JTBDs (download_glad_data)

## JTBDs
1. Baixar dados GLAD (Global Land Analysis & Discovery) de alertas de desmatamento e cobertura florestal
2. Obter rasters de extensão florestal para monitoramento de mudanças na vegetação

## Descrição
Baixa produtos GLAD da Universidade de Maryland a partir de URLs fornecidas por `GLADProduct`. Extrai o nome do tile e ano do produto, faz download do GeoTIFF e retorna um raster categórico com classificação binária floresta/não-floresta.

## Inputs
- `glad_product`: `GLADProduct` com URL, tile_name, geometria e período

## Outputs
- `downloaded_product`: `CategoricalRaster` com banda "forest_extent" e categorias ["Non-Forest", "Forest"]

## Lógicas e Cálculos
- Concatena tile_name e ano para nomear o arquivo: `{tile_name}_{year}.tif`
- Faz download do arquivo GeoTIFF da URL do produto
- Gera ID hash único combinando nome do arquivo, geometria e período
- Clona metadados do produto de entrada mapeando banda 0 como "forest_extent" com categorias binárias
