# data_processing/index/index

Calcula um índice a partir das bandas de um raster de entrada. Além dos índices 'ndvi', 'evi', 'msavi', 'ndre', 'reci', 'ndmi', 'methane' e 'pri', todos os índices em https://github.com/awesome-spectral-indices/awesome-spectral-indices estão disponíveis (dependendo das bandas disponíveis no produto de satélite correspondente).

```{mermaid}
    graph TD
    inp1>raster]
    out1>index_raster]
    tsk1{{compute_index}}
    inp1>raster] -- raster --> tsk1{{compute_index}}
    tsk1{{compute_index}} -- index --> out1>index_raster]
```

## Fontes

- **raster**: Raster de entrada.

## Destinos

- **index_raster**: Raster de banda única com o índice calculado.

## Parâmetros

- **index**: A escolha do índice a ser calculado ('ndvi', 'evi', 'msavi', 'ndre', 'reci', 'ndmi', 'methane', 'pri' ou qualquer um dos awesome-spectral-indices).

## Tarefas

- **compute_index**: Calcula o `index` sobre o raster de entrada.

## Fluxo de Trabalho Yaml

```yaml

name: index
sources:
  raster:
  - compute_index.raster
sinks:
  index_raster: compute_index.index
parameters:
  index: ndvi
tasks:
  compute_index:
    op: compute_index
    parameters:
      index: '@from(index)'
edges: null
description:
  short_description: Calcula um índice a partir das bandas de um raster de entrada.
  long_description: Além dos índices 'ndvi', 'evi', 'msavi', 'ndre', 'reci', 'ndmi', 'methane' e 'pri', todos os índices em https://github.com/awesome-spectral-indices/awesome-spectral-indices estão disponíveis (dependendo das bandas disponíveis no produto de satélite correspondente).
  sources:
    raster: Raster de entrada.
  sinks:
    index_raster: Raster de banda única com o índice calculado.
  parameters:
    index: A escolha do índice a ser calculado ('ndvi', 'evi', 'msavi', 'ndre', 'reci', 'ndmi', 'methane', 'pri' ou qualquer um dos awesome-spectral-indices).


```
