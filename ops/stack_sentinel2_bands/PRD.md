# JTBDs (stack_sentinel2_bands)

## JTBDs

1. Empilhar bandas individuais de um produto Sentinel-2 baixado em raster multibanda
2. Gerar máscara de nuvens rasterizada a partir do GML de metadados

## Descrição

Para um produto Sentinel-2 baixado, empilha as bandas na ordem correta (B01-B12) em um único GeoTIFF e gera um raster de máscara de nuvens com categorias.

## Inputs

- `input_item`: DownloadedSentinel2Product — produto baixado com bandas e cloud mask

## Outputs

- `sentinel2_raster`: Sentinel2Raster — raster com bandas empilhadas
- `sentinel2_cloud_mask`: Sentinel2CloudMask — máscara de nuvens rasterizada

## Lógicas e Cálculos

1. Abre cada banda na ordem B01-B12 e reprojeta para referência B02 via WarpedVRT
2. Escreve todas as bandas no mesmo GeoTIFF (GTiff, COMPRESS)
3. Lê GML de nuvens, rasteriza polígonos com categorias: NO-CLOUD(0), OPAQUE(1), CIRRUS(2), OTHER(3)
4. Salva cloud mask como uint8 com nodata=100
