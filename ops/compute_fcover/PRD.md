# JTBDs (compute_fcover)

## JTBDs

1. Estimar fração de cobertura vegetal do solo (FCOVER)
2. Produzir insumo para modelos biofísicos de vegetação

## Descrição

Calcula FCOVER a partir de bandas Sentinel-2 (B03-B12, B8A) e ângulos de visada usando rede neural com pesos pré-treinados do S2Toolbox.

## Inputs

- `raster: Raster` — bandas reflectância Sentinel-2
- `angles: Raster` — ângulos zenitais e azimutais

## Outputs

- `fcover: Raster` — fração de cobertura vegetal (0-1)

## Lógicas e Cálculos

- Normaliza bandas e ângulos com parâmetros do S2Toolbox
- Concatena bandas (8) + ângulos (3: cos(zen), cos(rel_az))
- Rede neural: 11 entradas → 5 neurônios ocultos (tanh) → 1 saída (tanh)
- Denormaliza para [0, 1]
