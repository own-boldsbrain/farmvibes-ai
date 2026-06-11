# JTBDs (compute_raster_class_windowed_average)

## JTBDs

1. Calcular elevação média por classe de solo em janelas deslizantes
2. Suavizar variações locais de elevação agrupadas por cluster

## Descrição

Calcula a média de elevação (z-score) por classe de cluster em janelas deslizantes, combinando DEM e raster de classificação via convoluções PyTorch.

## Inputs

- `input_dem_raster: Raster` — DEM (elevação)
- `input_cluster_raster: Raster` — raster de classes
- Parâmetro: `window_size` (padrão 41)

## Outputs

- `output_raster: Raster` — elevação média por classe por janela

## Lógicas e Cálculos

- Downscale 4x via interpolate (bilinear para DEM, nearest para cluster)
- Calcula z-score do DEM em janelas: `conv2d` com kernel ones
- Para cada classe: soma da elevação mascarada / contagem de pixels da classe na janela
- Upsample para resolução original via bilinear
