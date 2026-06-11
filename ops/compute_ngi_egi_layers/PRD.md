# JTBDs (compute_ngi_egi_layers)

## JTBDs

1. Calcular NGI (Normalized Green Index) e EGI (Evaporative Green Index)
2. Produzir camadas LST calibradas para modelo de irrigação

## Descrição

Processa bandas Landsat (green, nir, lwir11), NDVI e fração evaporativa para gerar NGI, EGI e LST, todas mascaradas por cloud_water_mask.

## Inputs

- `landsat_raster: LandsatRaster` — bandas green, nir, lwir11
- `ndvi_raster: Raster` — NDVI
- `evaporative_fraction: Raster` — fração evaporativa
- `cloud_water_mask_raster: Raster` — máscara

## Outputs

- `ngi: Raster` — NGI = NDVI * GI
- `egi: Raster` — EGI = EF / GI
- `lst: Raster` — LST calibrada

## Lógicas e Cálculos

- Aplica scale/offset: LST = lwir11 * 0.00341802 + 149; bandas = banda * 0.0000275 - 0.2
- Green Index (GI) = NIR / Green
- NGI = NDVI * GI; EGI = EF / GI
- Aplica cloud_water_mask nas três camadas de saída
