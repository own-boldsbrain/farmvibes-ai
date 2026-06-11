# JTBDs (threshold_raster)

## JTBDs

1. Binarizar um raster aplicando um limiar numérico
2. Identificar regiões onde valores excedem um determinado patamar

## Descrição

Aplica um threshold a um raster: pixels com valor acima do limiar viram 1, abaixo viram 0, resultando em um raster uint8 binário.

## Inputs

- `raster`: Raster — raster de valores contínuos

## Outputs

- `thresholded`: Raster — raster binário (0/1) em uint8

## Lógicas e Cálculos

1. Carrega raster com `load_raster`, converte para masked array
2. Aplica `data_ma > threshold`, resultando em máscara booleana float32
3. Preserva a máscara original (preenche com NaN)
4. Converte encoding para uint8 e salva com `save_raster_from_ref`
