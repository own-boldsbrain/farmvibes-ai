# data_ingestion/sentinel2/preprocess_s2

Faz o download e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada. Este fluxo de trabalho seleciona um conjunto mínimo de tiles que cobre a geometria de entrada, baixa as imagens do Sentinel-2 para o intervalo de tempo selecionado e as pré-processa gerando um único raster multibanda com resolução de 10m.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    out2>mask]
    tsk1{{list}}
    tsk2{{filter}}
    tsk3{{download}}
    tsk4{{group}}
    tsk5{{merge}}
    tsk1{{list}} -- sentinel_products/items --> tsk2{{filter}}
    tsk2{{filter}} -- filtered_items/sentinel_product --> tsk3{{download}}
    tsk3{{download}} -- raster/rasters --> tsk4{{group}}
    tsk3{{download}} -- cloud/masks --> tsk4{{group}}
    tsk4{{group}} -- raster_groups/raster_group --> tsk5{{merge}}
    tsk4{{group}} -- mask_groups/mask_group --> tsk5{{merge}}
    inp1>user_input] -- input_item --> tsk1{{list}}
    inp1>user_input] -- bounds_items --> tsk2{{filter}}
    tsk5{{merge}} -- output_raster --> out1>raster]
    tsk5{{merge}} -- output_mask --> out2>mask]
```

## Origens (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos (Sinks)

- **raster**: Rasters do Sentinel-2 L2A com todas as bandas reamostradas para resolução de 10m.

- **mask**: Máscara de nuvens com resolução de 10m a partir dos indicadores de qualidade do produto.

## Parâmetros

- **min_tile_cover**: Cobertura mínima da RoI para considerar um conjunto de tiles suficiente.

- **max_tiles_per_time**: Número máximo de tiles usados para cobrir a RoI em cada data.

- **pc_key**: Chave de API opcional do Planetary Computer.

- **dl_timeout**: Tempo máximo, em segundos, antes que uma operação de leitura de banda expire.

## Tarefas (Tasks)

- **list**: Lista produtos do Sentinel-2 que se interceptam com a geometria e o intervalo de tempo de entrada.

- **filter**: Seleciona os itens necessários para cobrir espacialmente a geometria dos itens delimitadores (bounds items).

- **download**: Faz o download e pré-processa os produtos do Sentinel-2.

- **group**: Agrupa arquivos raster que representam o mesmo tile e momento no tempo, que podem ter sido parcialmente gerados e divididos devido ao movimento do Sentinel-2 pelas estações terrestres.

- **merge**: Combina arquivos raster agrupados pela tarefa group_sentinel2_orbits em um único raster.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: preprocess_s2
sources:
  user_input:
  - list.input_item
  - filter.bounds_items
sinks:
  raster: merge.output_raster
  mask: merge.output_mask
parameters:
  min_tile_cover: null
  max_tiles_per_time: null
  pc_key: null
  dl_timeout: null
tasks:
  list:
    op: list_sentinel2_products_pc
    op_dir: list_sentinel2_products
  filter:
    op: select_necessary_coverage_items
    parameters:
      min_cover: '@from(min_tile_cover)'
      max_items: '@from(max_tiles_per_time)'
  download:
    op: download_stack_sentinel2
    parameters:
      api_key: '@from(pc_key)'
      timeout_s: '@from(dl_timeout)'
  group:
    op: group_sentinel2_orbits
  merge:
    op: merge_sentinel2_orbits
edges:
- origin: list.sentinel_products
  destination:
  - filter.items
- origin: filter.filtered_items
  destination:
  - download.sentinel_product
- origin: download.raster
  destination:
  - group.rasters
- origin: download.cloud
  destination:
  - group.masks
- origin: group.raster_groups
  destination:
  - merge.raster_group
- origin: group.mask_groups
  destination:
  - merge.mask_group
description:
  short_description: Faz o download e pré-processa imagens do Sentinel-2 que cobrem
    a geometria e o intervalo de tempo de entrada.
  long_description: Este fluxo de trabalho seleciona um conjunto mínimo de tiles que
    cobre a geometria de entrada, baixa as imagens do Sentinel-2 para o intervalo
    de tempo selecionado e as pré-processa gerando um único raster multibanda com
    resolução de 10m.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    raster: Rasters do Sentinel-2 L2A com todas as bandas reamostradas para resolução
      de 10m.
    mask: Máscara de nuvens com resolução de 10m a partir dos indicadores de qualidade
      do produto.
  parameters:
    min_tile_cover: Cobertura mínima da RoI para considerar um conjunto de tiles suficiente.
    max_tiles_per_time: Número máximo de tiles usados para cobrir a RoI em cada data.
    pc_key: Chave de API opcional do Planetary Computer.


```