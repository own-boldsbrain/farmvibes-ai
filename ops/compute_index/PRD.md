# JTBDs (compute_index)

## JTBDs

1. Calcular índices espectrais (NDVI, EVI, NDMI, etc.)
2. Produzir camadas derivadas para modelos de vegetação e solo

## Descrição

Calcula índices espectrais sobre rasters usando a biblioteca spyndex (NDVI, EVI, MSEVI, NDMI, etc.) ou implementações customizadas (methane, NDRE, PRI, RECI).

## Inputs

- `raster: Raster` — raster com bandas espectrais
- Parâmetro: `index` (padrão "ndvi")

## Outputs

- `index: Raster` — raster do índice calculado

## Lógicas e Cálculos

- Se índice está no spyndex: carrega bandas necessárias, aplica scale/offset, executa `spyndex.computeIndex`
- Índices custom: methane (anomalia em B12 via kNN + gaussian filter), NDRE, PRI, RECI
- Anexa asset de visualização com colormap e range
