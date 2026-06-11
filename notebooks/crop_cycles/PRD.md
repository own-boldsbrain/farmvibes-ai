# JTBDs (crop_cycles)

## JTBDs
1. Contar ciclos agrícolas por ano em uma região a partir de imagens de satélite
2. Executar análise de séries temporais em rasters usando modelo ONNX
3. Processar 365 imagens diárias com SpaceEye + NDVI + análise de Fourier

## Descrição
Notebook que conta o número de ciclos de cultivo por ano usando séries temporais de NDVI. Executa SpaceEye para gerar imagens sem nuvens (365 dias), calcula NDVI e aplica um modelo ONNX de análise de Fourier para identificar ciclos agrícolas (emergência à colheita). O workflow customizado é definido no arquivo crop_cycles.yaml, encadeando SpaceEye, NDVI e chunk_onnx.

## Notebooks
- crop_cycles.ipynb: Contagem de ciclos agrícolas via análise de séries temporais com ONNX

## Inputs
- Geometria da região (WKT)
- Período (ex: 2018)
- Modelo ONNX (count_cycles.onnx)
- step (tamanho da janela em pixels)

## Outputs
- Raster com número de ciclos agrícolas por pixel
- Regiões de alta frequência classificadas como perenes

## Workflows Utilizados
- data_ingestion/spaceeye/spaceeye_interpolation
- data_processing/index/index (NDVI)
- data_processing/chunk_onnx/chunk_onnx
