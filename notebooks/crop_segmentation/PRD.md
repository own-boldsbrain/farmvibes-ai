# JTBDs (crop_segmentation)

## JTBDs
1. Gerar dataset de segmentação de lavouras com NDVI + Crop Data Layer (CDL)
2. Visualizar e explorar os dados gerados (Sentinel-2, máscaras, SpaceEye, NDVI, CDL)
3. Treinar modelo de segmentação (U-Net) localmente com PyTorch Lightning
4. Treinar modelo de segmentação em escala com Azure Machine Learning
5. Executar inferência com modelo ONNX em novas regiões

## Descrição
Pipeline completo de segmentação de lavouras: geração de dataset (NDVI multitemporal + CDL do USDA), visualização dos dados intermediários, treinamento de U-Net (local ou via AML), exportação para ONNX e inferência em novas regiões via FarmVibes.AI. O notebook de visualização expõe outputs intermediários (Sentinel-2, máscaras de nuvem/sombra, SpaceEye) para exploração.

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

## Workflows Utilizados
- ml/dataset_generation/datagen_crop_segmentation
- data_ingestion/sentinel2/preprocess_s2_improved_masks
- data_ingestion/spaceeye/spaceeye_interpolation
- data_processing/index/index (NDVI)
- data_ingestion/cdl/download_cdl
- ml/crop_segmentation (inferência)
