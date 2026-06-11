# JTBDs (compute_pixel_count)

## JTBDs

1. Contar frequência de valores de pixel em um raster
2. Produzir histograma de classes para análises de mudança

## Descrição

Conta valores únicos de pixel em todas as bandas do raster de entrada, gerando arquivo CSV com valores e contagens. Utiliza a geometria do raster para mascaramento.

## Inputs

- `raster: Raster` — raster a ser analisado

## Outputs

- `pixel_count: RasterPixelCount` — contagem de pixels por valor único (CSV)

## Lógicas e Cálculos

- Abre raster com rasterio, aplica máscara pela geometria
- Usa `np.unique(data, return_counts=True)` para contar
- Salva resultado em CSV com colunas `unique_values` e `counts`
