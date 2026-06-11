# JTBDs (Merge Sentinel-2 Orbits)

## JTBDs
1. Mesclar rasters e máscaras de nuvem da mesma orbita Sentinel-2 em um único par raster+máscara
2. Consolidar tiles parciais divididos pelo movimento do satélite

## Descrição
Recebe `Sentinel2RasterOrbitGroup` e `Sentinel2CloudMaskOrbitGroup` e mescla cada grupo separadamente usando `rasterio.merge`. A ordem segue o discriminador de data do produto. Se houver apenas um asset, reutiliza o asset original sem merge.

## Inputs
- `raster_group`: `Sentinel2RasterOrbitGroup`
- `mask_group`: `Sentinel2CloudMaskOrbitGroup`

## Outputs
- `output_raster`: `Sentinel2Raster`
- `output_mask`: `Sentinel2CloudMask`

## Lógicas e Cálculos
- Obtém listas de assets ordenados de cada grupo
- Se len > 1: `merge(path_list, dst_path, dst_kwds={zstd_level:9, predictor:2})` para raster e mask
- Se len == 1: reutiliza asset original
- Clona novos itens com geometria atualizada do grupo, `id` = `gen_guid()`
