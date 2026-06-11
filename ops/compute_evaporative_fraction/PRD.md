# JTBDs (compute_evaporative_fraction)

## JTBDs

1. Estimar fração evaporativa para cálculo de evapotranspiração
2. Identificar pixels quentes e frios para balanço de energia

## Descrição

Implementa o método SSEB (Senay et al., 2013) para calcular fração evaporativa usando LST corrigido por DEM, NDVI e máscara de nuvem/água.

## Inputs

- `landsat_raster: LandsatRaster` — banda lwir11 (LST)
- `dem_raster: Raster` — modelo digital de elevação
- `ndvi_raster: Raster` — NDVI
- `cloud_water_mask_raster: Raster` — máscara de nuvem/água
- Parâmetro: `ndvi_hot_threshold` (padrão 0.02)

## Outputs

- `evaporative_fraction: Raster` — fração evaporativa

## Lógicas e Cálculos

- LST = (lwir11 * 0.00341802) + 149; corrige com lapse rate (0.0065 * DEM)
- Seleciona hot pixels: LST entre P90 e P95 com NDVI < P01
- Seleciona cold pixels: LST entre P02 e P04 com NDVI > P90
- Remove agrupamentos menores que 9 pixels via connected components
- etrf = (NDVI * K1 / K2) + LP; EF = etrf * (hot - LST) / (hot - cold)

