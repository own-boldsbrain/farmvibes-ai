# farm_ai/land_degradation/ndvi_linear_trend

Calcula a tendência linear de NDVI por pixel sobre o raster de entrada. O fluxo de trabalho (workflow) calcula o NDVI a partir do raster de entrada, calcula a tendência linear sobre pedaços (chunks) de dados, combinando-os no raster final.

```{mermaid}
    graph TD
    inp1>raster]
    out1>ndvi_raster]
    out2>linear_trend]
    tsk1{{ndvi}}
    tsk2{{chunked_linear_trend}}
    tsk1{{ndvi}} -- index_raster/input_rasters --> tsk2{{chunked_linear_trend}}
    inp1>raster] -- raster --> tsk1{{ndvi}}
    tsk1{{ndvi}} -- index_raster --> out1>ndvi_raster]
    tsk2{{chunked_linear_trend}} -- linear_trend_raster --> out2>linear_trend]
```

## Fontes (Sources)

- **raster**: Raster de entrada.

## Sinks (Saídas)

- **ndvi_raster**: Raster NDVI.

- **linear_trend**: Raster com a tendência e as estatísticas do teste.

## Tarefas (Tasks)

- **ndvi**: Calcula um índice a partir das bandas de um raster de entrada.

- **chunked_linear_trend**: Calcula a tendência linear por pixel de uma lista de rasters (ex: NDVI).

## Workflow Yaml

```yaml

name: ndvi_linear_trend
sources:
  raster:
  - ndvi.raster
sinks:
  ndvi_raster: ndvi.index_raster
  linear_trend: chunked_linear_trend.linear_trend_raster
tasks:
  ndvi:
    workflow: data_processing/index/index
    parameters:
      index: ndvi
  chunked_linear_trend:
    workflow: data_processing/linear_trend/chunked_linear_trend
    parameters:
      chunk_step_y: 512
      chunk_step_x: 512
edges:
- origin: ndvi.index_raster
  destination:
  - chunked_linear_trend.input_rasters
description:
  short_description: Calcula a tendência linear de NDVI por pixel sobre o raster de entrada.
  long_description: O fluxo de trabalho calcula o NDVI a partir do raster de entrada, calcula a tendência linear sobre pedaços de dados, combinando-os no raster final.
  sources:
    raster: Raster de entrada.
  sinks:
    ndvi_raster: Raster NDVI.
    linear_trend: Raster com a tendência e as estatísticas do teste.


```