# JTBDs (segment_anything)

## JTBDs
1. Segmentar automaticamente campos agrícolas e feições em basemaps (BingMaps) e imagens Sentinel-2
2. Segmentar por prompts (pontos foreground/background e bounding boxes) entidades específicas em imagens de satélite
3. Explorar o modelo Segment Anything (SAM) localmente para segmentação de campos

## Descrição
Conjunto de 5 notebooks demonstrando o uso do SAM: segmentação automática e por prompts em basemaps BingMaps e Sentinel-2, além de exploração local do modelo fora do cluster FarmVibes.AI. Requer importação de modelos ONNX para o cluster.

## Notebooks
- basemap_automatic_segmentation.ipynb: Segmentação automática de BingMaps (parâmetros: points_per_side, spatial_overlap)
- basemap_segmentation.ipynb: Segmentação por prompts em BingMaps
- sam_exploration.ipynb: SAM executado localmente (fora do cluster) com Sentinel-2
- sentinel2_automatic_segmentation.ipynb: Segmentação automática de Sentinel-2
- sentinel2_segmentation.ipynb: Segmentação por prompts em Sentinel-2

## Inputs
- Geometria (lat/lon) e intervalo de datas
- BingMaps API key (para basemaps)
- Prompts: GeoDataFrame com pontos foreground/background e bounding boxes
- Parâmetros: model_type (vit_b/l/h), points_per_side, spatial_overlap, n_crop_layers

## Outputs
- CategoricalRaster com máscaras de segmentação
- Polígonos extraídos (GeoJSON)

## Workflows Utilizados
- `farm_ai/segmentation/auto_segment_basemap`
- `farm_ai/segmentation/segment_basemap`
- `farm_ai/segmentation/auto_segment_s2`
- `farm_ai/segmentation/segment_s2`
