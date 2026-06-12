# JTBDs (sensor)

## JTBDs

1. Identificar localizações ótimas para instalação de sensores de solo usando clustering (GMM) sobre índices espectrais
2. Combinar segmentação de campos com posicionamento ótimo de sensores para reduzir custo de amostragem

## Descrição

Notebooks que identificam pontos representativos para coleta de solo ou instalação de sensores usando Gaussian Mixture Model sobre índices Sentinel-2 (EVI, NDMI, NDWI). Um notebook segmenta o campo antes de posicionar sensores.

## Use Cases

1. **Amostragem inteligente**: Um consultor identifica locais ótimos para coleta de solo, reduzindo custos de amostragem.
2. **Instalação de sensores**: Uma empresa de agricultura de precisão posiciona sensores de solo em pontos representativos da variabilidade do campo.
3. **Zoneamento de manejo**: Um produtor delimita zonas de manejo homogêneas com base em índices espectrais.

## Faz / Não Faz

- **Faz**: Clustering GMM sobre índices espectrais (EVI, NDMI, NDWI).
- **Faz**: Segmentação de campo antes do posicionamento.
- **Faz**: Geração de shapefiles com localizações ótimas (lat, lon, cluster_id).
- **Não Faz**: Não coleta nem analisa amostras de solo.
- **Não Faz**: Não determina número ideal de sensores — usa parâmetro fornecido.

## Notebooks

- optimal_locations.ipynb: Identificação de locais ótimos via clustering de índices espectrais
- optimal_locations_segmentation.ipynb: Posicionamento ótimo de sensores em campo segmentado

## Inputs

- sensor_farm_boundary.geojson: limite da fazenda
- sensor_samples.geojson: amostras de solo
- Parâmetros: n_clusters, sieve_size, index (EVI, NDMI, NDWI, etc.)

## Outputs

- ZIP com shapefile de localizações ótimas (latitude, longitude, cluster_id)

## Variáveis

| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| `n_clusters` | int | — | Número de clusters GMM |
| `sieve_size` | int | — | Tamanho mínimo de filtro (pixels) |
| `index` | string | EVI | Índice espectral (EVI, NDMI, NDWI) |

## Lógicas / Cálculos

1. Download de Sentinel-2 e cálculo de índices espectrais (EVI, NDMI, NDWI) para a área.
2. Aplicação de Gaussian Mixture Model (GMM) sobre os índices para identificar N clusters espectrais.
3. Seleção de pontos representativos (centroides dos clusters) como localizações ótimas para sensores/amostras.
4. (Opcional) Segmentação do campo antes do clustering para respeitar limites de talhões.

## Outcomes Esperados

- Localizações ótimas para instalação de sensores ou coleta de solo.
- Redução do número de amostras necessárias para representar a variabilidade do campo.
- Shapefile com coordenadas prontas para uso em campo.

## APIs / Conectores

- **Planetary Computer API**: Download de Sentinel-2.

## Datasets / Fontes de Dados

- Sentinel-2: reflectância de superfície para índices espectrais.
- Farm boundary: fornecido pelo usuário (GeoJSON).

## Workflows Utilizados

- `farm_ai/sensor/optimal_locations`
- `farm_ai/segmentation/segment_s2`
