# JTBDs (segment_anything)

## JTBDs

1. Segmentar automaticamente campos agrícolas e feições em basemaps (BingMaps) e imagens Sentinel-2
2. Segmentar por prompts (pontos foreground/background e bounding boxes) entidades específicas em imagens de satélite
3. Explorar o modelo Segment Anything (SAM) localmente para segmentação de campos

## Descrição

Conjunto de 5 notebooks demonstrando o uso do SAM: segmentação automática e por prompts em basemaps BingMaps e Sentinel-2, além de exploração local do modelo fora do cluster FarmVibes.AI. Requer importação de modelos ONNX para o cluster.

## Use Cases

1. **Segmentação de campos**: Um agricultor segmenta automaticamente talhões agrícolas em imagens BingMaps sem necessidade de treinamento.
2. **Identificação de feições**: Um consultor usa prompts (pontos foreground/background) para segmentar entidades específicas em imagens de satélite.
3. **Pesquisa em IA**: Um cientista explora o modelo SAM localmente para testar parâmetros antes de implantar no cluster.

## Faz / Não Faz

- **Faz**: Segmentação automática de BingMaps e Sentinel-2.
- **Faz**: Segmentação por prompts (pontos foreground/background, bounding boxes).
- **Faz**: Exploração local do SAM fora do cluster (PyTorch).
- **Não Faz**: Não treina ou fine-tuna o modelo SAM.
- **Não Faz**: Requer modelos ONNX pré-convertidos para deploy no cluster.

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

## Variáveis

| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| `model_type` | string | vit_b | Tipo do modelo (vit_b/l/h) |
| `points_per_side` | int | — | Pontos de grade para segmentação automática |
| `spatial_overlap` | float | — | Sobreposição espacial entre crops |
| `n_crop_layers` | int | — | Número de camadas de crop |
| `foreground_points` | GeoDataFrame | — | Pontos foreground para prompt |
| `background_points` | GeoDataFrame | — | Pontos background para prompt |

## Lógicas / Cálculos

1. **Automático**: Geração de grade de pontos, inferência SAM em múltiplos crops, combinação de máscaras.
2. **Por prompts**: Conversão de pontos/bounding boxes para embeddings, inferência SAM direcionada.
3. Pós-processamento: conversão de máscaras para polígonos (GeoJSON) com simplificação.

## Outcomes Esperados

- Máscaras de segmentação de feições (campos, corpos d'água, construções) sem treinamento.
- Polígonos vetoriais exportáveis para SIG.
- Segmentação interativa via prompts para feições específicas.

## APIs / Conectores

- **BingMaps API**: Basemaps para segmentação (requer API key).
- **Planetary Computer API**: Download de Sentinel-2.
- **Segment Anything Model (SAM)**: Meta AI, modelo ONNX.

## Datasets / Fontes de Dados

- BingMaps: imagens de satélite/basemap.
- Sentinel-2: reflectância de superfície.
- Modelo SAM ONNX (vit_b, vit_l, vit_h) — importado pelo usuário.

## Workflows Utilizados

- `farm_ai/segmentation/auto_segment_basemap`
- `farm_ai/segmentation/segment_basemap`
- `farm_ai/segmentation/auto_segment_s2`
- `farm_ai/segmentation/segment_s2`
