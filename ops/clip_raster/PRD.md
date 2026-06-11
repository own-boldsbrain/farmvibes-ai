# JTBDs (clip_raster)

## JTBDs

1. Extrair apenas a região de interesse do raster
2. Reduzir área processada eliminando pixels fora do boundary

## Descrição

Recorta o raster de entrada com base na geometria de referência fornecida. Suporta dois modos: soft clip (apenas metadados) e hard clip (corta efetivamente os pixels).

## Inputs

- `input_item: DataVibe` — geometria de referência
- `raster: Raster` — raster a ser recortado
- Parâmetro: `hard_clip` (padrão false)

## Outputs

- `clipped_raster: Raster` — raster recortado (tipo herdado do input)

## Lógicas e Cálculos

- Verifica interseção entre geometrias do raster e do item de referência
- **Soft clip**: clona o raster com nova geometria sem modificar pixels
- **Hard clip**: usa `rioxarray.clip()` para recortar os dados fisicamente, gerando novo asset
