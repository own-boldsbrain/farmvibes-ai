# JTBDs (Match Raster to Ref)

## JTBDs
1. Reprojetar, reamostrar e recortar um raster para alinhar exatamente ao grid de um raster de referência

## Descrição
Recebe um `raster` e um `ref_raster`. Reprojeta o raster de entrada para o CRS, extensão e resolução do raster de referência usando `load_raster_match`. Preserva o mesmo número de bandas do raster de entrada. A geometria de saída é a do raster de referência.

## Inputs
- `raster`: `Raster`
- `ref_raster`: `Raster`
- Parâmetro: `resampling`

## Outputs
- `output_raster`: `Raster`

## Lógicas e Cálculos
- `load_raster_match(raster, match_raster=ref_raster, resampling=resampling)` carrega array alinhado
- Salva em asset GeoTIFF via `save_raster_to_asset`
- Clona com `geometry=ref_raster.geometry` e `id=gen_guid()`
- Tenta preservar `visualization_asset` do raster original
