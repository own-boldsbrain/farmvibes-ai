# data_processing/gradient/raster_gradient

Calcula o gradiente de cada banda do raster de entrada com um operador Sobel.

```{mermaid}
    graph TD
    inp1>raster]
    out1>gradient]
    tsk1{{gradient}}
    inp1>raster] -- input_raster --> tsk1{{gradient}}
    tsk1{{gradient}} -- output_raster --> out1>gradient]
```

## Fontes

- **raster**: Raster de entrada.

## Destinos

- **gradient**: Raster com os gradientes.

## Tarefas

- **gradient**: Calcula o gradiente de cada banda do raster de entrada com um operador Sobel.

## Fluxo de Trabalho Yaml

```yaml

name: raster_gradient
sources:
  raster:
  - gradient.input_raster
sinks:
  gradient: gradient.output_raster
tasks:
  gradient:
    op: compute_raster_gradient
edges: null
description:
  short_description: Calcula o gradiente de cada banda do raster de entrada com um operador Sobel.
  long_description: null
  sources:
    raster: Raster de entrada.
  sinks:
    gradient: Raster com os gradientes.
  parameters: null


```
