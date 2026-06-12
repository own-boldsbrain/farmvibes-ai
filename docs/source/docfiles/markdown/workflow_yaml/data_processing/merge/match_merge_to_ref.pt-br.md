# data_processing/merge/match_merge_to_ref

Realiza a reamostragem dos rasters de entrada para a grade dos rasters de referência. O fluxo de trabalho produzirá pares de rasters de entrada e referência com geometrias que se interceptam. Para cada par, o raster de entrada é reamostrado para corresponder à grade do raster de referência. Posteriormente, todos os rasters reamostrados são agrupados se estiverem contidos na geometria de um raster de referência, e cada grupo de rasters é combinado em um único raster. A saída deve conter a informação disponível nos rasters de entrada, organizada em grade de acordo com os rasters de referência.

```{mermaid}
    graph TD
    inp1>rasters]
    inp2>ref_rasters]
    out1>match_rasters]
    tsk1{{pair}}
    tsk2{{match}}
    tsk3{{group}}
    tsk4{{merge}}
    tsk1{{pair}} -- paired_rasters1/ref_raster --> tsk2{{match}}
    tsk1{{pair}} -- paired_rasters2/raster --> tsk2{{match}}
    tsk2{{match}} -- output_raster/rasters --> tsk3{{group}}
    tsk3{{group}} -- raster_groups/raster_sequence --> tsk4{{merge}}
    inp1>rasters] -- rasters2 --> tsk1{{pair}}
    inp2>ref_rasters] -- rasters1 --> tsk1{{pair}}
    inp2>ref_rasters] -- group_by --> tsk3{{group}}
    tsk4{{merge}} -- raster --> out1>match_rasters]
```

## Fontes

- **rasters**: Rasters de entrada que serão reamostrados.

- **ref_rasters**: Rasters de referência.

## Destinos

- **match_rasters**: Rasters com informações dos rasters de entrada na grade de referência.

## Parâmetros

- **resampling**: Tipo de reamostragem ao reprojetar os rasters. Consulte a [documentação do rasterio](https://rasterio.readthedocs.io/en/latest/api/rasterio.enums.html#rasterio.enums.Resampling) para todas as opções de reamostragem disponíveis.

## Tarefas

- **pair**: Cria pares de rasters com geometrias que se interceptam entre duas listas de entrada de Rasters.

- **match**: Realiza a reamostragem do `raster` de entrada para corresponder à grade do `ref_raster`.

- **group**: Agrupa rasters de entrada que estão contidos na geometria de um raster de referência.

- **merge**: Mescla rasters em uma sequência para um único raster.

## Fluxo de Trabalho Yaml

```yaml

name: match_merge_to_ref
sources:
  rasters:
  - pair.rasters2
  ref_rasters:
  - pair.rasters1
  - group.group_by
sinks:
  match_rasters: merge.raster
parameters:
  resampling: bilinear
tasks:
  pair:
    op: pair_intersecting_rasters
  match:
    op: match_raster_to_ref
    parameters:
      resampling: '@from(resampling)'
  group:
    op: group_rasters_by_geometries
  merge:
    op: merge_rasters
    parameters:
      resampling: '@from(resampling)'
edges:
- origin: pair.paired_rasters1
  destination:
  - match.ref_raster
- origin: pair.paired_rasters2
  destination:
  - match.raster
- origin: match.output_raster
  destination:
  - group.rasters
- origin: group.raster_groups
  destination:
  - merge.raster_sequence
description:
  short_description: Realiza a reamostragem dos rasters de entrada para a grade dos rasters de referência.
  long_description: O fluxo de trabalho produzirá pares de rasters de entrada e referência com geometrias que se interceptam. Para cada par, o raster de entrada é reamostrado para corresponder à grade do raster de referência. Posteriormente, todos os rasters reamostrados são agrupados se estiverem contidos na geometria de um raster de referência, e cada grupo de rasters é combinado em um único raster. A saída deve conter a informação disponível nos rasters de entrada, organizada em grade de acordo com os rasters de referência.
  sources:
    rasters: Rasters de entrada que serão reamostrados.
    ref_rasters: Rasters de referência.
  sinks:
    match_rasters: Rasters com informações dos rasters de entrada na grade de referência.
  parameters:
    resampling: 'Tipo de reamostragem ao reprojetar os rasters. Consulte a documentação do rasterio: https://rasterio.readthedocs.io/en/latest/api/rasterio.enums.html#rasterio.enums.Resampling para todas as opções de reamostragem disponíveis.'


```
