# JTBDs (compute_conservation_practice)

## JTBDs

1. Classificar pixels como terraço ou canal escoadouro gramado
2. Mapear práticas conservacionistas no terreno a partir de elevação

## Descrição

Usa modelo CNN (ONNX) sobre gradiente de elevação e elevação média para classificar cada pixel em terraços ou canais escoadouros gramados.

## Inputs

- `elevation_gradient: Raster` — gradiente de elevação
- `average_elevation: Raster` — elevação média
- Parâmetros: `downsampling`, `model_path`, `window_size`, `overlap`, `batch_size`, `num_workers`

## Outputs

- `output_raster: Raster` — raster classificado (argmax das probabilidades)

## Lógicas e Cálculos

- Empilha os dois rasters como canais de entrada
- Sliding window (512px, overlap 25%) com downsampling
- Inferência via ONNX Runtime
- Pós-processamento: argmax ao longo do eixo das classes
- Reamostragem nearest-neighbor para resolução original
