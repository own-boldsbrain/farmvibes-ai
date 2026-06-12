# data_processing/outlier/detect_outlier

Ajusta um Modelo de Mistura Gaussiana (GMM) de componente único sobre os dados de entrada para detectar outliers de acordo com o parâmetro de limiar (threshold). O fluxo de trabalho gera mapas de segmentação e de outliers baseados no parâmetro de limiar e na probabilidade de cada amostra pertencer ao componente do GMM. Também produz mapas de calor (heatmaps) da probabilidade e a média do componente do GMM.

```{mermaid}
    graph TD
    inp1>rasters]
    out1>segmentation]
    out2>heatmap]
    out3>outliers]
    out4>mixture_means]
    tsk1{{outlier}}
    inp1>rasters] -- rasters --> tsk1{{outlier}}
    tsk1{{outlier}} -- segmentation --> out1>segmentation]
    tsk1{{outlier}} -- heatmap --> out2>heatmap]
    tsk1{{outlier}} -- outliers --> out3>outliers]
    tsk1{{outlier}} -- mixture_means --> out4>mixture_means]
```

## Fontes

- **rasters**: Rasters de entrada.

## Destinos

- **segmentation**: Mapas de segmentação baseados na probabilidade de cada amostra pertencer ao componente único do GMM.

- **heatmap**: Mapas de probabilidade.

- **outliers**: Mapas de outliers baseados no mapa de probabilidade limiarizado.

- **mixture_means**: Média do GMM.

## Parâmetros

- **threshold**: Valor de limiar de probabilidade para considerar uma amostra como um outlier.

## Tarefas

- **outlier**: Ajusta um Modelo de Mistura Gaussiana (GMM) de componente único sobre os rasters de entrada para detectar outliers de acordo com o parâmetro de limiar.

## Fluxo de Trabalho Yaml

```yaml

name: detect_outlier
sources:
  rasters:
  - outlier.rasters
sinks:
  segmentation: outlier.segmentation
  heatmap: outlier.heatmap
  outliers: outlier.outliers
  mixture_means: outlier.mixture_means
parameters:
  threshold: null
tasks:
  outlier:
    op: detect_outliers
    parameters:
      threshold: '@from(threshold)'
edges: null
description:
  short_description: Ajusta um Modelo de Mistura Gaussiana (GMM) de componente único sobre os dados de entrada para detectar outliers de acordo com o parâmetro de limiar.
  long_description: O fluxo de trabalho gera mapas de segmentação e de outliers baseados no parâmetro de limiar e na probabilidade de cada amostra pertencer ao componente do GMM. Também produz mapas de calor da probabilidade e a média do componente do GMM.
  sources:
    rasters: Rasters de entrada.
  sinks:
    segmentation: Mapas de segmentação baseados na probabilidade de cada amostra pertencer ao componente único do GMM.
    heatmap: Mapas de probabilidade.
    outliers: Mapas de outliers baseados no mapa de probabilidade limiarizado.
    mixture_means: Média do GMM.
  parameters:
    threshold: Valor de limiar de probabilidade para considerar uma amostra como um outlier.


```
