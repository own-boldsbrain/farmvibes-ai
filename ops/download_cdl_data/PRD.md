# JTBDs (download_cdl_data)

## JTBDs
1. Baixar dados do Cropland Data Layer (CDL) do USDA para classificação de culturas agrícolas
2. Obter mapas de uso do solo agrícola para uma região e ano específicos

## Descrição
Baixa dados do Cropland Data Layer (USDA NASS) para uma geometria e ano. Gerencia geometrias que excedem 1e11 m² dividindo-as em sub-regiões, baixando cada parte via API CDL Service e mesclando em um único GeoTIFF categórico. Também carrega metadados de cores e nomes das classes do arquivo Excel do USDA.

## Inputs
- `input_items`: Lista de `DataVibe` com geometria de interesse (CRS 4326)

## Outputs
- `cdl_rasters`: Lista de `CategoricalRaster` com banda "categories" e legenda de 255 classes USDA

## Lógicas e Cálculos
- Projeta geometria de EPSG:4326 para EPSG:5070 (CRS do CDL)
- Se área > MAX_AREA (1e11 m²), divide recursivamente a geometria pelo eixo mais longo
- Para cada sub-geometria, consulta URL do GeoTIFF via serviço SOAP da GMU
- Faz download de cada tile e, se houver múltiplas partes, mescla com `rasterio.merge`
- Carrega planilha de metadados do USDA com nomes, cores RGB das classes e gera colormap step
- Retorna raster categórico com colormap para visualização
