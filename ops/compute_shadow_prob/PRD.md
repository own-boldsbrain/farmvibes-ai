# JTBDs (compute_shadow_prob)

## JTBDs

1. Detectar sombras em imagens Sentinel-2 L2A
2. Produzir máscara de probabilidade de sombra para correção radiométrica

## Descrição

Aplica modelo de segmentação convolutional (ONNX) FPN (Feature Pyramid Network) sobre Sentinel-2 L2A para estimar probabilidade de sombra por pixel.

## Inputs

- `sentinel_raster: Sentinel2Raster` — imagem Sentinel-2 L2A
- Parâmetros: `downsampling`, `model_path`, `window_size`, `overlap`, `batch_size`, `num_workers`, `in_memory`

## Outputs

- `shadow_probability: Sentinel2CloudProbability` — raster de probabilidade de sombra

## Lógicas e Cálculos

- Verifica nível de processamento L2A obrigatório
- Pré-processamento: escala o chip_data pelo factor de scale do raster
- Sliding window (512px, overlap 25%) com downsampling
- Inferência ONNX, sigmoid nas saídas
- Regiões nodata marcadas como 100% sombra
- Reamostragem bilinear para resolução original
