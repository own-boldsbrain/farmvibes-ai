# JTBDs (recode_raster)

## JTBDs
1. Reclassificar valores de um raster com base em mapeamento origem → destino
2. Transformar legendas de mapas temáticos (ex: mudar códigos de uso do solo)

## Descrição
Recebe um raster e duas listas de valores (from_values, to_values) para recodificar pixels. Valores não listados permanecem inalterados.

## Inputs
- `raster`: Raster — raster de entrada com valores a recodificar

## Outputs
- `recoded_raster`: Raster — raster com valores recodificados

## Lógicas e Cálculos
1. Carrega raster com `load_raster`
2. Aplica mapeamento via `np.vectorize`: para cada pixel, retorna `to_values[i]` se pixel == `from_values[i]`, senão mantém o valor original
3. Salva raster transformado com `save_raster_from_ref`
