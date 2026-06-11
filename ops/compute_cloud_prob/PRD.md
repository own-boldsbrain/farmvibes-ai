# JTBDs (compute_cloud_prob)

## JTBDs

1. Detectar nuvens em imagens Sentinel-2 L2A automaticamente
2. Produzir máscara de probabilidade de nuvem por pixel para filtragem

## Descrição

Aplica modelo de segmentação convolutional (ONNX) sobre Sentinel-2 L2A para estimar probabilidade de nuvem por pixel, utilizando window sliding com overlap.

## Inputs

- `sentinel_raster: Sentinel2Raster` — imagem Sentinel-2 L2A
- Parâmetros: `downsampling`, `model_path`, `window_size`, `overlap`, `batch_size`, `num_workers`, `in_memory`

## Outputs

- `cloud_probability: Sentinel2CloudProbability` — raster de probabilidade de nuvem

## Lógicas e Cálculos

- Verifica nível de processamento L2A obrigatório
- Cria `ChipDataset` com sliding window (tamanho 512, overlap 25%)
- Executa inferência via ONNX Runtime em batches
- Pós-processamento: softmax sobre logits + regiões nodata marcadas como 100% nuvem
- Reamostra para resolução original via bilinear
