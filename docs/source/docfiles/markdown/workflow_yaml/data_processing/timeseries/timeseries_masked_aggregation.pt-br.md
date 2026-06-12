# data_processing/timeseries/timeseries_masked_aggregation

Calcula a média, o desvio padrão, os valores máximo e mínimo de todas as regiões do raster consideradas pela máscara e os agrega em uma série temporal (timeseries).

```{mermaid}
    graph TD
    inp1>raster]
    inp2>mask]
    inp3>input_geometry]
    out1>timeseries]
    tsk1{{masked_summary}}
    tsk2{{timeseries}}
    tsk1{{masked_summary}} -- summary/stats --> tsk2{{timeseries}}
    inp1>raster] -- raster --> tsk1{{masked_summary}}
    inp2>mask] -- mask --> tsk1{{masked_summary}}
    inp3>input_geometry] -- input_geometry --> tsk1{{masked_summary}}
    tsk2{{timeseries}} -- timeseries --> out1>timeseries]
```

## Fontes (Sources)

- **raster**: Raster de entrada.

- **mask**: Máscara das regiões a serem consideradas durante a sumarização.

- **input_geometry**: Geometria de interesse.

## Sinks

- **timeseries**: Estatísticas agregadas do raster considerado pela máscara.

## Parâmetros

- **timeseries_masked_thr**: Limite (threshold) da proporção máxima de conteúdo mascarado permitido em um raster. As estatísticas de rasters com conteúdo mascarado acima do limite (ex: fortemente nublado) não são incluídas na série temporal.

## Tarefas (Tasks)

- **masked_summary**: Calcula a média, o desvio padrão, os valores máximo e mínimo nas regiões não mascaradas do raster.

- **timeseries**: Agrega a lista de estatísticas de resumo em uma série temporal.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: timeseries_masked_aggregation
sources:
  raster:
  - masked_summary.raster
  mask:
  - masked_summary.mask
  input_geometry:
  - masked_summary.input_geometry
sinks:
  timeseries: timeseries.timeseries
parameters:
  timeseries_masked_thr: null
tasks:
  masked_summary:
    op: summarize_masked_raster
    op_dir: summarize_raster
  timeseries:
    op: aggregate_statistics_timeseries
    parameters:
      masked_thr: '@from(timeseries_masked_thr)'
edges:
- origin: masked_summary.summary
  destination:
  - timeseries.stats
description:
  short_description: Calcula a média, o desvio padrão, os valores máximo e mínimo de todas as regiões do raster consideradas pela máscara e os agrega em uma série temporal.
  long_description: null
  sources:
    raster: Raster de entrada.
    mask: Máscara das regiões a serem consideradas durante a sumarização.
    input_geometry: Geometria de interesse.
  sinks:
    timeseries: Estatísticas agregadas do raster considerado pela máscara.
  parameters:
    timeseries_masked_thr: Limite da proporção máxima de conteúdo mascarado permitido em um raster. As estatísticas de rasters com conteúdo mascarado acima do limite (ex: fortemente nublado) não são incluídas na série temporal.


```