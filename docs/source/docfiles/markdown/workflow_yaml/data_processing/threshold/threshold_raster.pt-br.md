# data_processing/threshold/threshold_raster

Aplica limiarização aos valores do raster de entrada se forem superiores ao parâmetro de limiar (threshold).

```{mermaid}
    graph TD
    inp1>raster]
    out1>thresholded_raster]
    tsk1{{threshold_task}}
    inp1>raster] -- raster --> tsk1{{threshold_task}}
    tsk1{{threshold_task}} -- thresholded --> out1>thresholded_raster]
```

## Fontes

- **raster**: Raster de entrada.

## Destinos

- **thresholded_raster**: Raster limiarizado.

## Parâmetros

- **threshold**: Valor do limiar (threshold).

## Tarefas

- **threshold_task**: Aplica limiarização aos valores do raster de entrada se forem superiores ao parâmetro de limiar.

## Fluxo de Trabalho Yaml

```yaml

name: threshold_raster
sources:
  raster:
  - threshold_task.raster
sinks:
  thresholded_raster: threshold_task.thresholded
parameters:
  threshold: null
tasks:
  threshold_task:
    op: threshold_raster
    parameters:
      threshold: '@from(threshold)'
edges: null
description:
  short_description: Aplica limiarização aos valores do raster de entrada se forem superiores ao parâmetro de limiar.
  long_description: null
  sources:
    raster: Raster de entrada.
  sinks:
    thresholded_raster: Raster limiarizado.
  parameters:
    threshold: Valor do limiar.


```
