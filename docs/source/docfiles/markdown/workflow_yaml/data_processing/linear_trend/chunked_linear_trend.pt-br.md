# data_processing/linear_trend/chunked_linear_trend

Calcula a tendência linear pixel a pixel de uma lista de rasters (ex: NDVI). O fluxo de trabalho calcula a tendência linear sobre blocos (chunks) de dados, combinando-os no raster final.

```{mermaid}
    graph TD
    inp1>input_rasters]
    out1>linear_trend_raster]
    tsk1{{chunk_raster}}
    tsk2{{linear_trend}}
    tsk3{{combine_chunks}}
    tsk1{{chunk_raster}} -- chunk_series/series --> tsk2{{linear_trend}}
    tsk2{{linear_trend}} -- trend/chunks --> tsk3{{combine_chunks}}
    inp1>input_rasters] -- rasters --> tsk1{{chunk_raster}}
    inp1>input_rasters] -- rasters --> tsk2{{linear_trend}}
    tsk3{{combine_chunks}} -- raster --> out1>linear_trend_raster]
```

## Fontes

- **input_rasters**: Lista de rasters para calcular a tendência linear.

## Destinos

- **linear_trend_raster**: Raster com a tendência e as estatísticas do teste.

## Parâmetros

- **chunk_step_y**: Passos usados para dividir os rasters em blocos na direção y (unidades são pontos da grade).

- **chunk_step_x**: Passos usados para dividir os rasters em blocos na direção x (unidades são pontos da grade).

## Tarefas

- **chunk_raster**: Divide os rasters de entrada em uma série de blocos (chunks).

- **linear_trend**: Calcula a tendência linear pixel a pixel através dos rasters.

- **combine_chunks**: Combina séries de blocos em um raster final.

## Fluxo de Trabalho Yaml

```yaml

name: chunked_linear_trend
sources:
  input_rasters:
  - chunk_raster.rasters
  - linear_trend.rasters
sinks:
  linear_trend_raster: combine_chunks.raster
parameters:
  chunk_step_y: null
  chunk_step_x: null
tasks:
  chunk_raster:
    op: chunk_raster
    parameters:
      step_y: '@from(chunk_step_y)'
      step_x: '@from(chunk_step_x)'
  linear_trend:
    op: linear_trend
  combine_chunks:
    op: combine_chunks
edges:
- origin: chunk_raster.chunk_series
  destination:
  - linear_trend.series
- origin: linear_trend.trend
  destination:
  - combine_chunks.chunks
description:
  short_description: Calcula a tendência linear pixel a pixel de uma lista de rasters (ex: NDVI).
  long_description: O fluxo de trabalho calcula a tendência linear sobre blocos de dados, combinando-os no raster final.
  sources:
    input_rasters: Lista de rasters para calcular a tendência linear.
  sinks:
    linear_trend_raster: Raster com a tendência e as estatísticas do teste.
  parameters:
    chunk_step_y: Passos usados para dividir os rasters em blocos na direção y (unidades são pontos da grade).
    chunk_step_x: Passos usados para dividir os rasters em blocos na direção x (unidades são pontos da grade).


```
