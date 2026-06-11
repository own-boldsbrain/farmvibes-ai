# JTBDs (chunk_raster / chunk_sequence_raster)

## JTBDs

1. Processar grandes rasters sem estourar memória
2. Paralelizar computações pixel-a-pixel dividindo a cena em pedaços

## Descrição

Divide rasters de entrada em uma série de chunks (blocos) menores, permitindo processamento paralelo em grade. Suporta entrada como `List[Raster]` ou `RasterSequence`.

## Inputs

- `rasters: List[Raster]` ou `RasterSequence` — raster(s) de entrada
- Parâmetros: `step_y` (padrão 1000), `step_x` (padrão 1000)

## Outputs

- `chunk_series: List[RasterChunk]` — lista de chunks com limites, posição e geometria

## Lógicas e Cálculos

- Lê o shape do raster de referência e calcula intervalos de leitura/escrita
- Cria grid de chunks com `(step_y, step_x)` de tamanho
- Cada chunk armazena `ChunkLimits` (col, row, width, height) para leitura absoluta e escrita relativa
- Gera geometria do chunk em EPSG:4326 a partir da window do raster
