# JTBDs (Merge Rasters)

## JTBDs
1. Mesclar uma sequência de rasters em um único raster mosaico
2. Garantir que todos os rasters tenham mesmo CRS, dtype e número de bandas

## Descrição
Recebe um `RasterSequence` e mescla todos os rasters em um único arquivo GeoTIFF usando `rasterio.merge`. Suporta resampling bilinear e diferentes estratégias de resolução (`equal`, `lowest`, `highest`, `average`). A geometria de saída e o CRS são herdados da sequência.

## Inputs
- `raster_sequence`: `RasterSequence`
- Parâmetros: `resampling`, `resolution`

## Outputs
- `raster`: `Raster`

## Lógicas e Cálculos
- Valida que todos os rasters têm mesmo `crs`, `dtype` e `count`; erro se discrepantes
- Define resolução de saída conforme método escolhido (None para `equal`; média/min/max para os demais)
- Usa `rasterio.merge.merge()` com bounds projetados do CRS da sequência
- Compressão ZSTD com predictor adequado ao dtype (int ou float)
