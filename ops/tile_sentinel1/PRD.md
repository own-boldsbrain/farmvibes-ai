# JTBDs (tile_sentinel1)

## JTBDs

1. Associar produtos Sentinel-1 aos tiles Sentinel-2 que eles intersectam
2. Preparar metadados de tiling para pré-processamento conjunto S1+S2

## Descrição

Para cada produto Sentinel-1, encontra todos os tiles Sentinel-2 com os quais ele intersecta espacialmente, gerando um item por combinação produto×tile. Apenas metadados — assets não são alterados.

## Inputs

- `sentinel1_products`: List[DownloadedSentinel1Product] | List[Sentinel1Raster]
- `sentinel2_products`: List[Sentinel2Product]

## Outputs

- `tiled_products`: List[TiledSentinel1Product] | List[Sentinel1Raster]

## Lógicas e Cálculos

1. Carrega KML de geometrias de tiles Sentinel-2
2. Filtra apenas tiles presentes nos produtos S2
3. Para cada produto S1, testa interseção com cada tile
4. Se intersecta, clona produto S1 com geometria do tile e tile_id
5. Gera hash único por combinação S1_id + tile_id
