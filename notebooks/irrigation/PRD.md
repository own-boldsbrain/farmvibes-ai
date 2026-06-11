# JTBDs (irrigation)

## JTBDs
1. Classificar campos agrícolas como irrigados ou não-irrigados usando imagens de satélite
2. Gerar mapas de probabilidade de irrigação em nível de pixel e de campo

## Descrição
Dois notebooks: um combina segmentação de campos com classificação de irrigação via balanço energético (LST, NDVI, GI, ETRF) e regressão logística; outro estima probabilidade de irrigação usando workflow específico em nível de campo segmentado.

## Notebooks
- irrigation_classification.ipynb: Classificação de irrigação com Landsat 8, índices NGI/EGI e LST
- field_level_irrigation_classification.ipynb: Probabilidade de irrigação em campos segmentados

## Inputs
- Coordenadas (lat/lon) e data de interesse
- Buffer radius e max cloud cover
- Geometria do campo segmentado

## Outputs
- Mapa de probabilidade de irrigação (raster)
- Sumário por campo (estatísticas de probabilidade)

## Workflows Utilizados
- `farm_ai/water/irrigation_classification`
- `farm_ai/segmentation/segment_s2`
