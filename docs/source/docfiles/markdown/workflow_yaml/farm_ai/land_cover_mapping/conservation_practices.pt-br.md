# farm_ai/land_cover_mapping/conservation_practices

Identifica práticas de conservação (terraços e canais gramados - grassed waterways) usando dados de elevação. O fluxo de trabalho (workflow) classifica pixels em terraços ou canais gramados. Ele começa baixando as peças (tiles) NAIP e USGS 3DEP. Em seguida, calcula o gradiente de elevação usando um filtro Sobel. E calcula agrupamentos (clusters) locais usando um método de agrupamento por sobreposição. Então, combina as peças de agrupamento e elevação para calcular a elevação média por agrupamento. Finalmente, usa um modelo CNN para classificar os pixels em terraços ou canais gramados.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>dem_raster]
    out2>naip_raster]
    out3>dem_gradient]
    out4>cluster]
    out5>average_elevation]
    out6>practices]
    tsk1{{naip}}
    tsk2{{cluster}}
    tsk3{{dem}}
    tsk4{{gradient}}
    tsk5{{match_grad}}
    tsk6{{match_elev}}
    tsk7{{avg_elev}}
    tsk8{{practice}}
    tsk1{{naip}} -- raster/user_input --> tsk3{{dem}}
    tsk1{{naip}} -- raster/input_raster --> tsk2{{cluster}}
    tsk1{{naip}} -- raster/ref_rasters --> tsk6{{match_elev}}
    tsk1{{naip}} -- raster/ref_rasters --> tsk5{{match_grad}}
    tsk3{{dem}} -- raster --> tsk4{{gradient}}
    tsk3{{dem}} -- raster/rasters --> tsk6{{match_elev}}
    tsk4{{gradient}} -- gradient/rasters --> tsk5{{match_grad}}
    tsk2{{cluster}} -- output_raster/input_cluster_raster --> tsk7{{avg_elev}}
    tsk6{{match_elev}} -- match_rasters/input_dem_raster --> tsk7{{avg_elev}}
    tsk7{{avg_elev}} -- output_raster/average_elevation --> tsk8{{practice}}
    tsk5{{match_grad}} -- match_rasters/elevation_gradient --> tsk8{{practice}}
    inp1>user_input] -- user_input --> tsk1{{naip}}
    tsk3{{dem}} -- raster --> out1>dem_raster]
    tsk1{{naip}} -- raster --> out2>naip_raster]
    tsk4{{gradient}} -- gradient --> out3>dem_gradient]
    tsk2{{cluster}} -- output_raster --> out4>cluster]
    tsk7{{avg_elev}} -- output_raster --> out5>average_elevation]
    tsk8{{practice}} -- output_raster --> out6>practices]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks (Saídas)

- **dem_raster**: Peças USGS 3DEP que se sobrepõem às peças NAIP que se sobrepõem à área de interesse.

- **naip_raster**: Peças NAIP que se sobrepõem à área de interesse.

- **dem_gradient**: Uma cópia das peças USGS 3DEP onde os valores de pixel são o gradiente calculado usando o filtro Sobel.

- **cluster**: Uma cópia das peças NAIP com uma banda representando a saída do método de agrupamento por sobreposição. Cada pixel tem um valor entre um e quatro.

- **average_elevation**: Uma combinação das saídas dem_gradient e cluster, onde cada valor de pixel é a elevação média de todos os pixels que caem no mesmo agrupamento.

- **practices**: Uma cópia da peça NAIP com uma banda onde cada valor de pixel se refere a uma prática de conservação (0 = nenhuma, 1 = terraços, 2 = canais gramados).

## Parâmetros

- **clustering_iterations**: O número de iterações usadas no método de agrupamento por sobreposição.

- **pc_key**: Chave de API opcional do Planetary Computer.

## Tarefas (Tasks)

- **naip**: Baixa peças NAIP que intersectam com a geometria e o intervalo de tempo de entrada.

- **cluster**: Calcula agrupamentos locais usando um método de agrupamento por sobreposição.

- **dem**: Baixa mosaicos de mapa de elevação digital que intersectam com a geometria e o intervalo de tempo de entrada.

- **gradient**: Calcula o gradiente de cada banda do raster de entrada com um operador Sobel.

- **match_grad**: Reamostra os rasters de entrada para a grade dos rasters de referência.

- **match_elev**: Reamostra os rasters de entrada para a grade dos rasters de referência.

- **avg_elev**: Calcula a elevação média por classe em janelas sobrepostas, combinando peças de agrupamento e elevação.

- **practice**: Classifica pixels em terraços ou canais gramados usando um modelo CNN.

## Workflow Yaml

```yaml

name: conservation_practices
sources:
  user_input:
  - naip.user_input
sinks:
  dem_raster: dem.raster
  naip_raster: naip.raster
  dem_gradient: gradient.gradient
  cluster: cluster.output_raster
  average_elevation: avg_elev.output_raster
  practices: practice.output_raster
parameters:
  clustering_iterations: null
  pc_key: null
tasks:
  naip:
    workflow: data_ingestion/naip/download_naip
    parameters:
      pc_key: '@from(pc_key)'
  cluster:
    op: compute_raster_cluster
    parameters:
      number_iterations: '@from(clustering_iterations)'
  dem:
    workflow: data_ingestion/dem/download_dem
    parameters:
      pc_key: '@from(pc_key)'
  gradient:
    workflow: data_processing/gradient/raster_gradient
  match_grad:
    workflow: data_processing/merge/match_merge_to_ref
  match_elev:
    workflow: data_processing/merge/match_merge_to_ref
  avg_elev:
    op: compute_raster_class_windowed_average
  practice:
    op: compute_conservation_practice
edges:
- origin: naip.raster
  destination:
  - dem.user_input
  - cluster.input_raster
  - match_elev.ref_rasters
  - match_grad.ref_rasters
- origin: dem.raster
  destination:
  - gradient.raster
  - match_elev.rasters
- origin: gradient.gradient
  destination:
  - match_grad.rasters
- origin: cluster.output_raster
  destination:
  - avg_elev.input_cluster_raster
- origin: match_elev.match_rasters
  destination:
  - avg_elev.input_dem_raster
- origin: avg_elev.output_raster
  destination:
  - practice.average_elevation
- origin: match_grad.match_rasters
  destination:
  - practice.elevation_gradient
description:
  short_description: Identifica práticas de conservação (terraços e canais gramados) usando dados de elevação.
  long_description: O fluxo de trabalho classifica pixels em terraços ou canais gramados. Ele começa baixando as peças NAIP e USGS 3DEP. Em seguida, calcula o gradiente de elevação usando um filtro Sobel. E calcula agrupamentos locais usando um método de agrupamento por sobreposição. Então, combina as peças de agrupamento e elevação para calcular a elevação média por agrupamento. Finalmente, usa um modelo CNN para classificar os pixels em terraços ou canais gramados.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    dem_raster: Peças USGS 3DEP que se sobrepõem às peças NAIP que se sobrepõem à área de interesse.
    naip_raster: Peças NAIP que se sobrepõem à área de interesse.
    dem_gradient: Uma cópia das peças USGS 3DEP onde os valores de pixel são o gradiente calculado usando o filtro Sobel.
    cluster: Uma cópia das peças NAIP com uma banda representando a saída do método de agrupamento por sobreposição. Cada pixel tem um valor entre um e quatro.
    average_elevation: Uma combinação das saídas dem_gradient e cluster, onde cada valor de pixel é a elevação média de todos os pixels que caem no mesmo agrupamento.
    practices: Uma cópia da peça NAIP com uma banda onde cada valor de pixel se refere a uma prática de conservação (0 = nenhuma, 1 = terraços, 2 = canais gramados).
  parameters:
    clustering_iterations: O número de iterações usadas no método de agrupamento por sobreposição.
    pc_key: Chave de API opcional do Planetary Computer.


```