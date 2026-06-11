# JTBDs (heatmaps)

## JTBDs
1. Mapear variabilidade espacial de nutrientes do solo (C, N, P, pH) a partir de amostras georreferenciadas
2. Gerar mapas de fertilidade para aplicação localizada de insumos usando classificação ou interpolação

## Descrição
Três notebooks para criar heatmaps de nutrientes: classificação supervisionada (Random Forest) com amostras do usuário, classificação integrada com ADMAG, e interpolação espacial por vizinhança usando dados de sensores em locais ótimos.

## Notebooks
- nutrients_using_classification.ipynb: Heatmap por classificação com Random Forest
- nutrients_using_classification_admag.ipynb: Heatmap integrado com Azure Data Manager for Agriculture
- nutrients_using_neighbors.ipynb: Heatmap por interpolação espacial (cluster overlap, nearest/kriging neighbor)

## Inputs
- sensor_farm_boundary.geojson: limite da fazenda
- sensor_samples.geojson: amostras de solo com atributos (C, N, P, pH)
- Parâmetros: índice espectral (EVI, PRI), bins, algorithm, buffer

## Outputs
- ZIP com shapefiles dos clusters/heatmap por nutriente

## Workflows Utilizados
- `farm_ai/agriculture/heatmap_using_classification`
- `farm_ai/agriculture/heatmap_using_classification_admag`
- `farm_ai/agriculture/heatmap_using_neighboring_data_points`
