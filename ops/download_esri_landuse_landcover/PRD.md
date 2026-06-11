# JTBDs (download_esri_landuse_landcover)

## JTBDs
1. Baixar mapas de uso e cobertura do solo ESRI 10m (9 classes) para uma região
2. Obter dados categóricos de uso do solo para análises ambientais e agrícolas

## Descrição
Baixa rasters de uso e cobertura do solo ESRI (10m resolução, 9 classes) da Planetary Computer a partir de um `EsriLandUseLandCoverProduct`. Consulta o tile pelo ID, faz download dos assets e retorna um `CategoricalRaster` com as classes de uso do solo.

## Inputs
- `input_product`: `EsriLandUseLandCoverProduct` com ID do tile e geometria

## Outputs
- `downloaded_product`: `CategoricalRaster` com banda "data" e 9 categorias ESRI de uso/cobertura do solo

## Lógicas e Cálculos
- Configura chave de assinatura da Planetary Computer
- Consulta coleção ESRI Land Use/Land Cover pelo ID do produto
- Faz download dos assets do item encontrado
- Gera asset de visualização com banda única
- Retorna `CategoricalRaster` com ID hash único e categorias pré-definidas da coleção ESRI
