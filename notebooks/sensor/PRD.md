# JTBDs (sensor)

## JTBDs
1. Identificar localizações ótimas para instalação de sensores de solo usando clustering (GMM) sobre índices espectrais
2. Combinar segmentação de campos com posicionamento ótimo de sensores para reduzir custo de amostragem

## Descrição
Notebooks que identificam pontos representativos para coleta de solo ou instalação de sensores usando Gaussian Mixture Model sobre índices Sentinel-2 (EVI, NDMI, NDWI). Um notebook segmenta o campo antes de posicionar sensores.

## Notebooks
- optimal_locations.ipynb: Identificação de locais ótimos via clustering de índices espectrais
- optimal_locations_segmentation.ipynb: Posicionamento ótimo de sensores em campo segmentado

## Inputs
- sensor_farm_boundary.geojson: limite da fazenda
- sensor_samples.geojson: amostras de solo
- Parâmetros: n_clusters, sieve_size, index (EVI, NDMI, NDWI, etc.)

## Outputs
- ZIP com shapefile de localizações ótimas (latitude, longitude, cluster_id)

## Workflows Utilizados
- `farm_ai/sensor/optimal_locations`
- `farm_ai/segmentation/segment_s2`
