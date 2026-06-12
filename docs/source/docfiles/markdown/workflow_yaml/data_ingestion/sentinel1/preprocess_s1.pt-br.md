# data_ingestion/sentinel1/preprocess_s1

Baixa e pré-processa blocos (tiles) de imagens do Sentinel-1 que interceptam os produtos Sentinel-2 de entrada no intervalo de tempo informado. O fluxo de trabalho busca os blocos do Sentinel-1 que interceptam os produtos Sentinel-2, baixa-os e os pré-processa, produzindo rasters do Sentinel-1 no sistema de blocos do Sentinel-2.

```{mermaid}
    graph TD
    inp1>user_input]
    inp2>s2_products]
    out1>raster]
    tsk1{{union}}
    tsk2{{merge_geom_tr}}
    tsk3{{list}}
    tsk4{{filter}}
    tsk5{{download}}
    tsk6{{tile}}
    tsk7{{group}}
    tsk8{{merge}}
    tsk1{{union}} -- merged/geometry --> tsk2{{merge_geom_tr}}
    tsk2{{merge_geom_tr}} -- merged/input_item --> tsk3{{list}}
    tsk3{{list}} -- sentinel_products/items --> tsk4{{filter}}
    tsk4{{filter}} -- filtered_items/sentinel_product --> tsk5{{download}}
    tsk5{{download}} -- downloaded_product/sentinel1_products --> tsk6{{tile}}
    tsk6{{tile}} -- tiled_products/rasters --> tsk7{{group}}
    tsk7{{group}} -- raster_groups/raster_group --> tsk8{{merge}}
    inp1>user_input] -- time_range --> tsk2{{merge_geom_tr}}
    inp2>s2_products] -- items --> tsk1{{union}}
    inp2>s2_products] -- bounds_items --> tsk4{{filter}}
    inp2>s2_products] -- sentinel2_products --> tsk6{{tile}}
    tsk8{{merge}} -- merged_product --> out1>raster]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo de interesse.

- **s2_products**: Produtos Sentinel-2 cujas geometrias são usadas para selecionar os blocos do Sentinel-1.

## Sinks

- **raster**: Rasters do Sentinel-1 no sistema de blocos do Sentinel-2.

## Parâmetros

- **pc_key**: Chave da API do Planetary Computer.

- **min_cover**: Quantidade mínima de cobertura necessária para que um grupo seja utilizado.

- **dl_timeout**: Tempo máximo, em segundos, antes que uma operação de leitura de banda expire.

## Tarefas (Tasks)

- **union**: Cria um item com a geometria mesclada a partir de uma lista de itens.

- **merge_geom_tr**: Cria um item que contém a geometria de um item e o intervalo de tempo de outro.

- **list**: Lista produtos Sentinel-1 GRD ou RTC dada a geometria e o intervalo de tempo.

- **filter**: Seleciona os itens necessários para cobrir espacialmente a geometria dos itens de limite (bounds items).

- **download**: Baixa as bandas do produto Sentinel-1 RTC.

- **tile**: Faz a correspondência dos produtos Sentinel-1 que interceptam os blocos do Sentinel-2.

- **group**: Agrupa arquivos raster que representam o mesmo bloco e momento no tempo, que podem ter sido gerados parcialmente e divididos devido ao movimento do Sentinel-1 pelas estações terrestres.

- **merge**: Mescla itens da mesma órbita absoluta no bloco MGRS (sistema de blocos do Sentinel-2) apropriado.

## Workflow Yaml

```yaml

name: preprocess_s1_rtc
sources:
  user_input:
  - merge_geom_tr.time_range
  s2_products:
  - union.items
  - filter.bounds_items
  - tile.sentinel2_products
sinks:
  raster: merge.merged_product
parameters:
  pc_key: null
  min_cover: 0.4
  dl_timeout: null
tasks:
  union:
    op: merge_geometries
  merge_geom_tr:
    op: merge_geometry_and_time_range
  list:
    op: list_sentinel1_products_pc
    op_dir: list_sentinel1_products
  filter:
    op: select_necessary_coverage_items
    parameters:
      min_cover: '@from(min_cover)'
      group_attribute: orbit_number
  download:
    op: download_sentinel1
    parameters:
      api_key: '@from(pc_key)'
      timeout_s: '@from(dl_timeout)'
  tile:
    op: tile_sentinel1_rtc
    op_dir: tile_sentinel1
  group:
    op: group_sentinel1_orbits
  merge:
    op: merge_sentinel1_orbits
edges:
- origin: union.merged
  destination:
  - merge_geom_tr.geometry
- origin: merge_geom_tr.merged
  destination:
  - list.input_item
- origin: list.sentinel_products
  destination:
  - filter.items
- origin: filter.filtered_items
  destination:
  - download.sentinel_product
- origin: download.downloaded_product
  destination:
  - tile.sentinel1_products
- origin: tile.tiled_products
  destination:
  - group.rasters
- origin: group.raster_groups
  destination:
  - merge.raster_group
description:
  short_description: Baixa e pré-processa blocos de imagens do Sentinel-1 que interceptam
    os produtos Sentinel-2 de entrada no intervalo de tempo informado.
  long_description: O fluxo de trabalho busca os blocos do Sentinel-1 que interceptam os
    produtos Sentinel-2, baixa-os e os pré-processa, produzindo rasters do Sentinel-1
    no sistema de blocos do Sentinel-2.
  sources:
    user_input: Intervalo de tempo de interesse.
    s2_products: Produtos Sentinel-2 cujas geometrias são usadas para selecionar os blocos
      do Sentinel-1.
  sinks:
    raster: Rasters do Sentinel-1 no sistema de blocos do Sentinel-2.
  parameters:
    pc_key: Chave da API do Planetary Computer.


```
