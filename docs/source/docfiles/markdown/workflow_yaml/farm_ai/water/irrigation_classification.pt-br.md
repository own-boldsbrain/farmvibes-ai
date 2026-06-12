# farm_ai/water/irrigation_classification

Desenvolve um mapa de probabilidade de irrigação por pixel de 30m. O fluxo de trabalho (workflow) recupera o mosaico de imagem LANDSAT 8 de Refletância de Superfície (SR) e dados de elevação da superfície terrestre DEM, e executa quatro operações (ops) para calcular o mapa de probabilidade de irrigação. As fontes de dados de elevação da superfície terrestre são o USGS DEM de 10m ou o Copernicus DEM de 30m; mas o Copernicus DEM é definido como a fonte padrão no fluxo de trabalho. A operação de Landsat compute_cloud_water_mask utiliza a banda qa_pixel da imagem e o índice NDVI para gerar uma máscara de cobertura de nuvens e corpos d''água. A operação compute_evaporative_fraction utiliza o índice NDVI, a temperatura da superfície terrestre (LST), as bandas verde e infravermelho próximo (NIR), e dados DEM para estimar o fluxo evaporativo (ETRF). A operação compute_ngi_egi_layers utiliza o índice NDVI, estimativas de ETRF, bandas verde e infravermelho próximo para gerar as camadas de irrigação NGI e EGI. Por fim, a operação compute_irrigation_probability usa as camadas NGI e EGI junto com a banda LST; e aplica um modelo de regressão logística otimizado para calcular o mapa de probabilidade de irrigação por pixel de 30m. Os coeficientes e a interceptação do modelo foram obtidos previamente usando dados de verdade terrestre (ground-truth) do estado de Nebraska, EUA, para o ano de 2015.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>landsat_bands]
    out2>ndvi]
    out3>cloud_water_mask]
    out4>dem]
    out5>evaporative_fraction]
    out6>ngi]
    out7>egi]
    out8>lst]
    out9>irrigation_probability]
    tsk1{{landsat}}
    tsk2{{ndvi}}
    tsk3{{merge_geom}}
    tsk4{{merge_geom_time_range}}
    tsk5{{cloud_water_mask}}
    tsk6{{dem}}
    tsk7{{match_dem}}
    tsk8{{evaporative_fraction}}
    tsk9{{ngi_egi_layers}}
    tsk10{{irrigation_probability}}
    tsk1{{landsat}} -- raster/items --> tsk3{{merge_geom}}
    tsk1{{landsat}} -- raster --> tsk2{{ndvi}}
    tsk1{{landsat}} -- raster/landsat_raster --> tsk5{{cloud_water_mask}}
    tsk1{{landsat}} -- raster/ref_rasters --> tsk7{{match_dem}}
    tsk1{{landsat}} -- raster/landsat_raster --> tsk8{{evaporative_fraction}}
    tsk1{{landsat}} -- raster/landsat_raster --> tsk9{{ngi_egi_layers}}
    tsk1{{landsat}} -- raster/landsat_raster --> tsk10{{irrigation_probability}}
    tsk2{{ndvi}} -- index/ndvi_raster --> tsk5{{cloud_water_mask}}
    tsk2{{ndvi}} -- index/ndvi_raster --> tsk8{{evaporative_fraction}}
    tsk2{{ndvi}} -- index/ndvi_raster --> tsk9{{ngi_egi_layers}}
    tsk3{{merge_geom}} -- merged/geometry --> tsk4{{merge_geom_time_range}}
    tsk4{{merge_geom_time_range}} -- merged/user_input --> tsk6{{dem}}
    tsk6{{dem}} -- raster/rasters --> tsk7{{match_dem}}
    tsk7{{match_dem}} -- match_rasters/dem_raster --> tsk8{{evaporative_fraction}}
    tsk8{{evaporative_fraction}} -- evaporative_fraction --> tsk9{{ngi_egi_layers}}
    tsk5{{cloud_water_mask}} -- cloud_water_mask/cloud_water_mask_raster --> tsk8{{evaporative_fraction}}
    tsk5{{cloud_water_mask}} -- cloud_water_mask/cloud_water_mask_raster --> tsk9{{ngi_egi_layers}}
    tsk5{{cloud_water_mask}} -- cloud_water_mask/cloud_water_mask_raster --> tsk10{{irrigation_probability}}
    tsk9{{ngi_egi_layers}} -- ngi --> tsk10{{irrigation_probability}}
    tsk9{{ngi_egi_layers}} -- egi --> tsk10{{irrigation_probability}}
    tsk9{{ngi_egi_layers}} -- lst --> tsk10{{irrigation_probability}}
    inp1>user_input] -- user_input --> tsk1{{landsat}}
    inp1>user_input] -- time_range --> tsk4{{merge_geom_time_range}}
    tsk1{{landsat}} -- raster --> out1>landsat_bands]
    tsk2{{ndvi}} -- index --> out2>ndvi]
    tsk5{{cloud_water_mask}} -- cloud_water_mask --> out3>cloud_water_mask]
    tsk7{{match_dem}} -- match_rasters --> out4>dem]
    tsk8{{evaporative_fraction}} -- evaporative_fraction --> out5>evaporative_fraction]
    tsk9{{ngi_egi_layers}} -- ngi --> out6>ngi]
    tsk9{{ngi_egi_layers}} -- egi --> out7>egi]
    tsk9{{ngi_egi_layers}} -- lst --> out8>lst]
    tsk10{{irrigation_probability}} -- irrigation_probability --> out9>irrigation_probability]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks (Saídas)

- **landsat_bands**: Raster de bandas Landsat.

- **ndvi**: Raster NDVI.

- **cloud_water_mask**: Máscara de cobertura de nuvens e corpos d''água.

- **dem**: Raster DEM. As opções são CopernicusDEM30 e USGS3DEP.

- **evaporative_fraction**: Raster com estimativas do fluxo da fração evaporativa.

- **ngi**: Raster da camada de irrigação NGI.

- **egi**: Raster da camada de irrigação EGI.

- **lst**: Raster de temperatura da superfície terrestre.

- **irrigation_probability**: Raster do mapa de probabilidade de irrigação em resolução de 30m.

## Parâmetros

- **ndvi_threshold**: Valor do limiar (threshold) do índice NDVI para mascarar corpos d''água.

- **ndvi_hot_threshold**: Valor máximo do limiar do índice NDVI para selecionar pixel quente.

- **coef_ngi**: Coeficiente da camada NGI no modelo de regressão logística otimizado.

- **coef_egi**: Coeficiente da camada EGI no modelo de regressão logística otimizado.

- **coef_lst**: Coeficiente da banda de temperatura da superfície terrestre no modelo de regressão logística otimizado.

- **intercept**: Valor de interceptação do modelo de regressão logística otimizado.

- **dem_resolution**: Resolução espacial do DEM. 10m e 30m estão disponíveis.

- **dem_provider**: Provedor do DEM. "USGS3DEP" e "CopernicusDEM30" estão disponíveis.

- **pc_key**: Chave de API opcional do Planetary Computer.

## Tarefas (Tasks)

- **landsat**: Baixa e pré-processa mosaicos LANDSAT que intersectam com a geometria e o intervalo de tempo de entrada.

- **ndvi**: Calcula o `índice` (index) sobre o raster de entrada.

- **merge_geom**: Cria um item com geometria mesclada a partir de uma lista de itens.

- **merge_geom_time_range**: Cria um item que contém a geometria de um item e o intervalo de tempo de outro.

- **cloud_water_mask**: Mescla a máscara de nuvens do Landsat e a máscara baseada em NDVI para produzir uma máscara de água e nuvens.

- **dem**: Baixa mosaicos de mapa de elevação digital que intersectam com a geometria e o intervalo de tempo de entrada.

- **match_dem**: Reamostra os rasters de entrada para a grade dos rasters de referência.

- **evaporative_fraction**: Calcula a camada de fração evaporativa com base nos valores percentis de lst_dem (criado ao tratar a temperatura da superfície terrestre com dem) e camadas ndvi. A fonte das constantes utilizadas é \"Senay, G.B.; Bohms, S.; Singh, R.K.; Gowda, P.H.; Velpuri, N.M.; Alemu, H.; Verdin, J.P. Operational Evapotranspiration Mapping Using Remote Sensing and Weather Datasets - A New Parameterization for the SSEB Approach. JAWRA J. Am. Water Resour. Assoc. 2013, 49, 577–591. As fontes de dados de elevação da superfície terrestre são o USGS DEM de 10m e o Copernicus DEM de 30m; mas o Copernicus DEM é definido como a fonte padrão no fluxo de trabalho.

- **ngi_egi_layers**: Calcula as camadas NGI, EGI e LST a partir das bandas Landsat, camada ndvi, camada de máscara de água e nuvens e camada de fração evaporativa.

- **irrigation_probability**: Calcula os valores de probabilidade de irrigação para cada pixel no raster usando o modelo de regressão logística otimizado com os rasters ngi, egi e lst como entrada.

## Workflow Yaml

```yaml

name: irrigation_classification
sources:
  user_input:
  - landsat.user_input
  - merge_geom_time_range.time_range
sinks:
  landsat_bands: landsat.raster
  ndvi: ndvi.index
  cloud_water_mask: cloud_water_mask.cloud_water_mask
  dem: match_dem.match_rasters
  evaporative_fraction: evaporative_fraction.evaporative_fraction
  ngi: ngi_egi_layers.ngi
  egi: ngi_egi_layers.egi
  lst: ngi_egi_layers.lst
  irrigation_probability: irrigation_probability.irrigation_probability
parameters:
  ndvi_threshold: 0.0
  ndvi_hot_threshold: 0.02
  coef_ngi: -0.50604148
  coef_egi: -0.93103156
  coef_lst: -0.14612046
  intercept: 1.99036986
  dem_resolution: 30
  dem_provider: CopernicusDEM30
  pc_key: null
tasks:
  landsat:
    workflow: data_ingestion/landsat/preprocess_landsat
    parameters:
      pc_key: '@from(pc_key)'
  ndvi:
    op: compute_index
  merge_geom:
    op: merge_geometries
  merge_geom_time_range:
    op: merge_geometry_and_time_range
  cloud_water_mask:
    op: compute_cloud_water_mask
    parameters:
      ndvi_threshold: '@from(ndvi_threshold)'
  dem:
    workflow: data_ingestion/dem/download_dem
    parameters:
      resolution: '@from(dem_resolution)'
      provider: '@from(dem_provider)'
  match_dem:
    workflow: data_processing/merge/match_merge_to_ref
  evaporative_fraction:
    op: compute_evaporative_fraction
    parameters:
      ndvi_hot_threshold: '@from(ndvi_hot_threshold)'
  ngi_egi_layers:
    op: compute_ngi_egi_layers
  irrigation_probability:
    op: compute_irrigation_probability
    parameters:
      coef_ngi: '@from(coef_ngi)'
      coef_egi: '@from(coef_egi)'
      coef_lst: '@from(coef_lst)'
      intercept: '@from(intercept)'
edges:
- origin: landsat.raster
  destination:
  - merge_geom.items
  - ndvi.raster
  - cloud_water_mask.landsat_raster
  - match_dem.ref_rasters
  - evaporative_fraction.landsat_raster
  - ngi_egi_layers.landsat_raster
  - irrigation_probability.landsat_raster
- origin: ndvi.index
  destination:
  - cloud_water_mask.ndvi_raster
  - evaporative_fraction.ndvi_raster
  - ngi_egi_layers.ndvi_raster
- origin: merge_geom.merged
  destination:
  - merge_geom_time_range.geometry
- origin: merge_geom_time_range.merged
  destination:
  - dem.user_input
- origin: dem.raster
  destination:
  - match_dem.rasters
- origin: match_dem.match_rasters
  destination:
  - evaporative_fraction.dem_raster
- origin: evaporative_fraction.evaporative_fraction
  destination:
  - ngi_egi_layers.evaporative_fraction
- origin: cloud_water_mask.cloud_water_mask
  destination:
  - evaporative_fraction.cloud_water_mask_raster
  - ngi_egi_layers.cloud_water_mask_raster
  - irrigation_probability.cloud_water_mask_raster
- origin: ngi_egi_layers.ngi
  destination:
  - irrigation_probability.ngi
- origin: ngi_egi_layers.egi
  destination:
  - irrigation_probability.egi
- origin: ngi_egi_layers.lst
  destination:
  - irrigation_probability.lst
description:
  short_description: Desenvolve um mapa de probabilidade de irrigação por pixel de 30m.
  long_description: O fluxo de trabalho recupera o mosaico de imagem LANDSAT 8 de Refletância de Superfície (SR) e dados de elevação da superfície terrestre DEM, e executa quatro operações para calcular o mapa de probabilidade de irrigação. As fontes de dados de elevação da superfície terrestre são o USGS DEM de 10m ou o Copernicus DEM de 30m; mas o Copernicus DEM é definido como a fonte padrão no fluxo de trabalho. A operação de Landsat compute_cloud_water_mask utiliza a banda qa_pixel da imagem e o índice NDVI para gerar uma máscara de cobertura de nuvens e corpos d'água. A operação compute_evaporative_fraction utiliza o índice NDVI, a temperatura da superfície terrestre (LST), as bandas verde e infravermelho próximo, e dados DEM para estimar o fluxo evaporativo (ETRF). A operação compute_ngi_egi_layers utiliza o índice NDVI, estimativas de ETRF, bandas verde e infravermelho próximo para gerar as camadas de irrigação NGI e EGI. Por fim, a operação compute_irrigation_probability usa as camadas NGI e EGI junto com a banda LST; e aplica um modelo de regressão logística otimizado para calcular o mapa de probabilidade de irrigação por pixel de 30m. Os coeficientes e a interceptação do modelo foram obtidos previamente usando dados de verdade terrestre do estado de Nebraska, EUA, para o ano de 2015.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    landsat_bands: Raster de bandas Landsat.
    ndvi: Raster NDVI.
    cloud_water_mask: Máscara de cobertura de nuvens e corpos d'água.
    dem: Raster DEM. As opções são CopernicusDEM30 e USGS3DEP.
    evaporative_fraction: Raster com estimativas do fluxo da fração evaporativa.
    ngi: Raster da camada de irrigação NGI.
    egi: Raster da camada de irrigação EGI.
    lst: Raster de temperatura da superfície terrestre.
    irrigation_probability: Raster do mapa de probabilidade de irrigação em resolução de 30m.
  parameters:
    ndvi_threshold: Valor do limiar do índice NDVI para mascarar corpos d'água.
    ndvi_hot_threshold: Valor máximo do limiar do índice NDVI para selecionar pixel quente.
    coef_ngi: Coeficiente da camada NGI no modelo de regressão logística otimizado.
    coef_egi: Coeficiente da camada EGI no modelo de regressão logística otimizado.
    coef_lst: Coeficiente da banda de temperatura da superfície terrestre no modelo de regressão logística
      otimizado.
    intercept: Valor de interceptação do modelo de regressão logística otimizado.
    pc_key: Chave de API opcional do Planetary Computer.


```