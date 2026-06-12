# JTBDs (crop_segmentation)

## JTBDs

1. Gerar dataset de segmentação de lavouras com NDVI + Crop Data Layer (CDL)
2. Visualizar e explorar os dados gerados (Sentinel-2, máscaras, SpaceEye, NDVI, CDL)
3. Treinar modelo de segmentação (U-Net) localmente com PyTorch Lightning
4. Treinar modelo de segmentação em escala com Azure Machine Learning
5. Executar inferência com modelo ONNX em novas regiões

## Descrição

Pipeline completo de segmentação de lavouras: geração de dataset (NDVI multitemporal + CDL do USDA), visualização dos dados intermediários, treinamento de U-Net (local ou via AML), exportação para ONNX e inferência em novas regiões via FarmVibes.AI. O notebook de visualização expõe outputs intermediários (Sentinel-2, máscaras de nuvem/sombra, SpaceEye) para exploração.

## Use Cases

1. **Mapeamento de safras**: Um órgão governamental mapeia a extensão de culturas para estatísticas agrícolas.
2. **Agricultura de precisão**: Uma cooperativa segmenta talhões cultivados para gestão localizada.
3. **Treinamento em escala**: Uma empresa de IA agrícola treina modelos U-Net na nuvem (Azure ML) com datasets gerados automaticamente.

## Faz / Não Faz

- **Faz**: Geração de dataset NDVI multitemporal + CDL para treinamento.
- **Faz**: Visualização de dados intermediários (Sentinel-2, máscaras, SpaceEye).
- **Faz**: Treinamento de U-Net local (PyTorch Lightning) e em escala (Azure ML).
- **Faz**: Exportação para ONNX e inferência em novas regiões.
- **Não Faz**: Não suporta outros índices além de NDVI para o dataset.
- **Não Faz**: Não funciona sem os mapas CDL do USDA (apenas EUA).

## Notebooks

- 01_dataset_generation.ipynb: Geração de dataset NDVI + CDL para segmentação
- 02_visualize_dataset.ipynb: Visualização e exploração dos dados e máscaras
- 03_local_training.ipynb: Treinamento local de U-Net com PyTorch Lightning
- 03_aml_training.ipynb: Treinamento em escala com Azure Machine Learning
- 04_inference.ipynb: Inferência com modelo ONNX em novas regiões

## Inputs

- Região de interesse (WKT)
- Período de tempo
- Planetary Computer API key (pc_key)
- CDL maps do USDA

## Outputs

- Dataset de treino (chips NDVI + máscaras CDL)
- Modelo treinado (formato ONNX)
- Mapa de segmentação (probability heatmap)

## Variáveis

| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| `pc_key` | string | — | Chave de API do Planetary Computer |
| `model_bands` | int | 37 | Número de bandas NDVI empilhadas |
| `window_size` | int | 256 | Tamanho da janela de inferência (pixels) |
| `overlap` | float | 0.25 | Sobreposição entre janelas |

## Lógicas / Cálculos

1. `spaceeye_interpolation` — Gera dados SpaceEye (Sentinel-2 sem nuvens) para todas as datas no período.
2. `index` (NDVI) — Calcula NDVI para cada data disponível.
3. `select_sequence` — Seleciona N bandas NDVI regularmente espaçadas ao longo do ano.
4. `compute_onnx_from_sequence` — Inferência ONNX com janela deslizante 256×256, overlap 25%, 4 workers.

## Outcomes Esperados

- Dataset de treino (chips NDVI + CDL) para segmentação de culturas.
- Modelo U-Net treinado (ONNX) pronto para implantação em produção.
- Mapa de segmentação de culturas a 10m de resolução.

## APIs / Conectores

- **Planetary Computer API**: Download de cenas Sentinel-2.
- **USDA CDL**: Crop Data Layer dos EUA (ground truth para treinamento).
- **Azure Machine Learning**: Treinamento em escala (opcional).

## Datasets / Fontes de Dados

- Sentinel-2: reflectância de superfície (10-60m).
- SpaceEye: imagens diárias sem nuvens.
- USDA CDL: Crop Data Layer anual (30m, EUA).
- Modelo ONNX pré-treinado ou gerado pelo usuário.

## Workflows Utilizados

- ml/dataset_generation/datagen_crop_segmentation
- data_ingestion/sentinel2/preprocess_s2_improved_masks
- data_ingestion/spaceeye/spaceeye_interpolation
- data_processing/index/index (NDVI)
- data_ingestion/cdl/download_cdl
- ml/crop_segmentation (inferência)
