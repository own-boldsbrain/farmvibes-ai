# JTBDs (download_bing_basemap)

## JTBDs
1. Baixar tiles de mapa base Bing Maps para uma região específica
2. Converter tiles JPEG em rasters GeoTIFF georreferenciados para uso em análises geoespaciais

## Descrição
Baixa um tile de mapa base representado por um `BingMapsProduct` usando a Bing Maps API e converte a imagem JPEG em um GeoTIFF georreferenciado no CRS EPSG:4326 com bandas RGB.

## Inputs
- `input_product`: `BingMapsProduct` com URL do tile, nível de zoom e bbox

## Outputs
- `basemap`: `Raster` com 3 bandas (red, green, blue) em formato GeoTIFF

## Lógicas e Cálculos
- Faz download da imagem JPEG da URL fornecida pelo produto Bing Maps
- Converte a imagem para GeoTIFF usando `rasterio`, aplicando transformação afim baseada nas coordenadas da bbox
- Gera asset com tipo MIME image/tiff e ID único
- Clona metadados do produto de entrada com hash SHA-256 do ID
