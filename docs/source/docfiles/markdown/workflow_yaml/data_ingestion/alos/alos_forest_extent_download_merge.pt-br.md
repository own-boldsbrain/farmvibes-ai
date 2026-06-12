# data_ingestion/alos/alos_forest_extent_download_merge

Baixa o mapa de classificação floresta/não floresta do Advanced Land Observing Satellite (ALOS) e o mescla em um único raster. O fluxo de trabalho lista os produtos de classificação floresta/não floresta do ALOS que intersectam com a geometria de entrada e o intervalo de tempo (intervalo disponível 2015-2020) e baixa os produtos filtrados. O fluxo de trabalho processa os produtos baixados e os mescla em um único raster.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>merged_raster]
    out2>categorical_raster]
    tsk1{{alos_forest_extent_download}}
    tsk2{{group_rasters_by_time}}
    tsk3{{merge}}
    tsk1{{alos_forest_extent_download}} -- downloaded_product/rasters --> tsk2{{group_rasters_by_time}}
    tsk2{{group_rasters_by_time}} -- raster_groups/raster_sequence --> tsk3{{merge}}
    inp1>user_input] -- user_input --> tsk1{{alos_forest_extent_download}}
    tsk3{{merge}} -- raster --> out1>merged_raster]
    tsk1{{alos_forest_extent_download}} -- downloaded_product --> out2>categorical_raster]
```

## Fontes

- **user_input**: Geometria de interesse para a qual baixar o mapa de classificação floresta/não floresta do ALOS.

## Sinks

- **merged_raster**: Produtos de classificação floresta/não floresta do ALOS convertidos para raster e mesclados.

- **categorical_raster**: Produtos de classificação floresta/não floresta do ALOS que intersectam com a geometria de entrada e o intervalo de tempo.

## Parâmetros

- **pc_key**: Chave de API do Planetary Computer.

## Tarefas

- **alos_forest_extent_download**: Baixa o mapa de classificação floresta/não floresta do Advanced Land Observing Satellite (ALOS).

- **group_rasters_by_time**: Esta operação agrupa rasters no tempo de acordo com o 'criterion'.

- **merge**: Mescla rasters em uma sequência para um único raster.

## Yaml do Fluxo de Trabalho

```yaml

name: alos_forest_extent_download_merge
sources:
  user_input:
  - alos_forest_extent_download.user_input
sinks:
  merged_raster: merge.raster
  categorical_raster: alos_forest_extent_download.downloaded_product
parameters:
  pc_key: null
tasks:
  alos_forest_extent_download:
    workflow: data_ingestion/alos/alos_forest_extent_download
    parameters:
      pc_key: '@from(pc_key)'
  group_rasters_by_time:
    op: group_rasters_by_time
    parameters:
      criterion: year
  merge:
    op: merge_rasters
edges:
- origin: alos_forest_extent_download.downloaded_product
  destination:
  - group_rasters_by_time.rasters
- origin: group_rasters_by_time.raster_groups
  destination:
  - merge.raster_sequence
description:
  short_description: Downloads Advanced Land Observing Satellite (ALOS) forest/non-forest
    classification map and merges it into a single raster.
  long_description: The workflow lists the ALOS forest/non-forest classification products
    that intersect with the input geometry and time range (available range 2015-2020),
    and downloads the filtered products. The workflow processes the downloaded products
    and merge them into a single raster.
  sources:
    user_input: Geometry of interest for which to download the ALOS forest/non-forest
      classification map.
  sinks:
    merged_raster: ALOS forest/non-forest classification products converted to raster
      and merged.
    categorical_raster: ALOS forest/non-forest classification products that intersect
      with the input geometry & time range.
  parameters:
    pc_key: Planetary computer API key.


```