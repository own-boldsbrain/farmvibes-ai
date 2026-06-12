# data_processing/clip/clip

Realiza um recorte (clip) em um raster de entrada com base em uma geometria de referência fornecida. O fluxo de trabalho gera um novo raster copiado do raster de entrada com seus metadados de geometria como a interseção entre a geometria do raster de entrada e a geometria de referência fornecida. Se o parâmetro hard_clip for definido como true, apenas os dados na interseção serão mantidos na saída. O fluxo de trabalho gera um erro se não houver interseção entre ambas as geometrias.

```{mermaid}
    graph TD
    inp1>raster]
    inp2>input_geometry]
    out1>clipped_raster]
    tsk1{{clip_raster}}
    inp1>raster] -- raster --> tsk1{{clip_raster}}
    inp2>input_geometry] -- input_item --> tsk1{{clip_raster}}
    tsk1{{clip_raster}} -- clipped_raster --> out1>clipped_raster]
```

## Fontes

- **raster**: Raster de entrada a ser recortado.

- **input_geometry**: Geometria de referência.

## Destinos

- **clipped_raster**: Raster recortado com a geometria de referência.

## Parâmetros

- **hard_clip**: se true, mantém apenas os dados dentro da interseção das geometrias de referência e de entrada; caso contrário, realiza um recorte suave (soft clip).


## Tarefas

- **clip_raster**: recorta o raster de entrada com base na geometria de referência fornecida.

## Fluxo de Trabalho Yaml

```yaml

name: clip
sources:
  raster:
  - clip_raster.raster
  input_geometry:
  - clip_raster.input_item
sinks:
  clipped_raster: clip_raster.clipped_raster
parameters:
  hard_clip: false
tasks:
  clip_raster:
    op: clip_raster
    parameters:
      hard_clip: '@from(hard_clip)'
edges: null
description:
  short_description: Realiza um recorte em um raster de entrada com base em uma geometria de referência fornecida.
  long_description: O fluxo de trabalho gera um novo raster copiado do raster de entrada com seus metadados de geometria como a interseção entre a geometria do raster de entrada e a geometria de referência fornecida. Se o parâmetro hard_clip for definido como true, apenas os dados na interseção serão mantidos na saída. O fluxo de trabalho gera um erro se não houver interseção entre ambas as geometrias.
  sources:
    raster: Raster de entrada a ser recortado.
    input_geometry: Geometria de referência.
  sinks:
    clipped_raster: Raster recortado com a geometria de referência.
  parameters:
    hard_clip: 'se true, mantém apenas os dados dentro da interseção das geometrias de referência e de entrada; caso contrário, realiza um recorte suave (soft clip).

      '


```
