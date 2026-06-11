# JTBDs (Merge Sentinel-1 Orbits)

## JTBDs
1. Mesclar rasters da mesma orbita absoluta Sentinel-1 em um único raster por tile MGRS
2. Reprojetar dados para o CRS UTM apropriado do tile

## Descrição
Recebe um `Sentinel1RasterOrbitGroup` (raster da mesma orbita/tile) e mescla usando `rasterio.merge` com `WarpedVRT` para reprojeção ao CRS UTM do tile. A ordem dos assets no grupo define prioridade no merge.

## Inputs
- `raster_group`: `Sentinel1RasterOrbitGroup`
- Parâmetro: `resampling`

## Outputs
- `merged_product`: `Sentinel1Raster`

## Lógicas e Cálculos
- Obtém CRS UTM do `tile_id` via `tile_to_utm()`
- Projeta bounds da geometria para o CRS UTM
- Abre cada raster com `rasterio.open` + `WarpedVRT` para reprojetar para o CRS destino
- `merge()` com bounds, resampling e `FLOAT_COMPRESSION_KWARGS` (blocos 512x512)
