# JTBDs (Segment Driveway)

## JTBDs
1. Segmentar frentes de casas em imagens de satélite usando modelo ONNX
2. Classificar pixels em Background, Driveway e Unknown

## Descrição
Executa inferência de um modelo ONNX de segmentação semântica (driveway.onnx) sobre um raster de entrada. O raster é recortado em chips com overlap, pré-processado (downsampling, seleção de bandas NIR-R-G, realce de contraste), passado pelo modelo, e pós-processado (argmax, reassemblagem). A saída é um `CategoricalRaster` com 3 categorias.

## Inputs
- `input_raster`: `Raster`
- Parâmetros: `downsampling`, `model_path`, `window_size`, `model_size`, `overlap`, `batch_size`, `num_workers`

## Outputs
- `segmentation_raster`: `CategoricalRaster`

## Lógicas e Cálculos
- `ChipDataset` com `chip_size` e `step_size = chip_size * (1 - overlap)`, downsampling configurável
- Reader lê bandas [4, 1, 2] (NIR, Blue, Green), máscara de nodata
- `pre_process`: redimensiona para `model_size` com `bilinear`, realce de contraste (percentis 2-98)
- `post_process`: redimensiona saída para `window_size`, `argmax(axis=1)` → classe
- `predict_chips` com ONNX Runtime InferenceSession
- Reamostra predição para resolução original com `resample_raster` (nearest)
