# JTBDs (compute_onnx)

## JTBDs

1. Executar inferência de modelos ONNX arbitrários sobre rasters
2. Processar rasters inteiros, sequências ou chunks com sliding window

## Descrição

Operação genérica de inferência ONNX. Suporta três modos: raster completo (`compute_onnx`), chunks (`compute_onnx_from_chunks`) e sequências (`compute_onnx_from_sequence`).

## Inputs

- `input_raster: Raster | RasterSequence | List[Raster]` — dados de entrada
- `chunk: RasterChunk` (opcional, modo chunks)
- Parâmetros: `model_file`, `window_size`, `overlap`, `batch_size`, `num_workers`, `nodata`, `skip_nodata`, `resampling`, `downsampling`

## Outputs

- `output_raster: Raster | RasterChunk` — resultado da inferência

## Lógicas e Cálculos

- Converte entrada para lista de rasters (se RasterSequence)
- Cria `StackOnChannelsChipDataset` com sliding window
- Inferência via ONNX Runtime em batches
- Reamostragem para resolução original (bilinear ou nearest)
- Retorna Raster ou RasterChunk conforme modo
