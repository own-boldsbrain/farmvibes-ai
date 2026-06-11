# JTBDs (compute_cloud_water_mask)

## JTBDs

1. Mascarar pixels contaminados por nuvem e corpos d'água
2. Produzir máscara binária "limpa" para análises posteriores

## Descrição

Combina a banda `qa_pixel` do Landsat (bits de nuvem) com um limiar de NDVI para identificar água, gerando máscara onde 1 = pixel válido e 0 = nuvem ou água.

## Inputs

- `landsat_raster: LandsatRaster` — raster Landsat com banda qa_pixel
- `ndvi_raster: Raster` — raster NDVI
- Parâmetro: `ndvi_threshold` (padrão 0.0)

## Outputs

- `cloud_water_mask: Raster` — máscara binária (1 = limpo, 0 = nuvem/água)

## Lógicas e Cálculos

- Extrai banda `qa_pixel` e verifica bit 6 (cloud dilated)
- Marca pixels com nuvem como NaN
- NDVI ≤ threshold → assume água → NaN
- Multiplica as duas máscaras: resultado 1 só onde ambas são 1
