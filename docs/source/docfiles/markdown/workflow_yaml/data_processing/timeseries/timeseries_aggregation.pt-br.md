# data_processing/timeseries/timeseries_aggregation

Calcula a média, o desvio padrão, os valores máximo e mínimo de todas as regiões do raster e os agrega em uma série temporal (timeseries).

```{mermaid}
    graph TD
    inp1>raster]
    inp2>input_geometry]
    out1>timeseries]
    tsk1{{summary}}
    tsk2{{timeseries}}
    tsk1{{summary}} -- summary/stats --> tsk2{{timeseries}}
    inp1>raster] -- raster --> tsk1{{summary}}
    inp2>input_geometry] -- input_geometry --> tsk1{{summary}}
    tsk2{{timeseries}} -- timeseries --> out1>timeseries]
```

## Fontes (Sources)

- **raster**: Raster de entrada.

- **input_geometry**: Geometria de interesse.

## Sinks

- **timeseries**: Estatísticas agregadas do raster.

## Tarefas (Tasks)

- **summary**: Calcula a média, o desvio padrão, os valores máximo e mínimo em todo o raster.

- **timeseries**: Agrega a lista de estatísticas de resumo em uma série temporal.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: timeseries_aggregation
sources:
  raster:
  - summary.raster
  input_geometry:
  - summary.input_geometry
sinks:
  timeseries: timeseries.timeseries
tasks:
  summary:
    op: summarize_raster
  timeseries:
    op: aggregate_statistics_timeseries
edges:
- origin: summary.summary
  destination:
  - timeseries.stats
description:
  short_description: Calcula a média, o desvio padrão, os valores máximo e mínimo de todas as regiões do raster e os agrega em uma série temporal.
  long_description: null
  sources:
    raster: Raster de entrada.
    input_geometry: Geometria de interesse.
  sinks:
    timeseries: Estatísticas agregadas do raster.


```