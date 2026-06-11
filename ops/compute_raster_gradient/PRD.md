# JTBDs (compute_raster_gradient)

## JTBDs

1. Detectar bordas e transições no terreno
2. Produzir gradiente por banda como insumo para modelos de relevo

## Descrição

Computa o gradiente horizontal de cada banda do raster de entrada usando o operador Sobel, gerando um novo raster com as bandas originais sufixadas por `_gradient`.

## Inputs

- `input_raster: Raster` — raster de entrada

## Outputs

- `output_raster: Raster` — gradiente Sobel por banda

## Lógicas e Cálculos

- Para cada banda no mapeamento de entrada, aplica `compute_sobel_gradient`
- Preserva metadados e CRS do raster original
- Anexa visualização com colormap interpolado (intervalos 0-200)
- Inclui overviews no raster de saída
