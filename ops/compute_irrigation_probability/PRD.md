# JTBDs (compute_irrigation_probability)

## JTBDs

1. Identificar pixels com irrigação ativa
2. Produzir mapa de probabilidade de irrigação para agricultura

## Descrição

Aplica regressão logística otimizada com coeficientes pré-definidos sobre as camadas NGI, EGI e LST para estimar probabilidade de irrigação por pixel.

## Inputs

- `landsat_raster: LandsatRaster` — raster de referência Landsat
- `ngi: Raster` — NGI (Normalized Green Index)
- `egi: Raster` — EGI (Evaporative Green Index)
- `lst: Raster` — temperatura da superfície
- `cloud_water_mask_raster: Raster` — máscara de nuvem/água
- Parâmetros: `coef_ngi`, `coef_egi`, `coef_lst`, `intercept`

## Outputs

- `irrigation_probability: Raster` — probabilidade de irrigação (0-1)

## Lógicas e Cálculos

- Pré-processa valores (NaN/Inf → 0)
- Padroniza com StandardScaler
- Aplica `LogisticRegression` com coeficientes fixos e intercept
- Multiplica probabilidade pela máscara cloud_water_mask
