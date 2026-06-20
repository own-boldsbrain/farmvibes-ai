# farm_ai/agriculture/change_detection

Identifica alterações/outliers no NDVI ao longo das datas. O fluxo de trabalho (workflow) gera imagens SpaceEye para a região e intervalo de tempo de entrada e calcula o raster NDVI para cada data. Ele agrega as estatísticas de NDVI (média, desvio padrão, máximo e mínimo) no tempo e detecta outliers entre as datas com um Modelo de Mistura Gaussiana (GMM) de componente único.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>spaceeye_raster]
    out2>index]
    out3>timeseries]
    out4>segmentation]
    out5>heatmap]
    out6>outliers]
    out7>mixture_means]
    tsk1{{spaceeye}}
    tsk2{{ndvi}}
    tsk3{{summary_timeseries}}
    tsk4{{outliers}}
    tsk1{{spaceeye}} -- raster --> tsk2{{ndvi}}
    tsk2{{ndvi}} -- index_raster/raster --> tsk3{{summary_timeseries}}
    tsk2{{ndvi}} -- index_raster/rasters --> tsk4{{outliers}}
    inp1>user_input] -- user_input --> tsk1{{spaceeye}}
    inp1>user_input] -- input_geometry --> tsk3{{summary_timeseries}}
    tsk1{{spaceeye}} -- raster --> out1>spaceeye_raster]
    tsk2{{ndvi}} -- index_raster --> out2>index]
    tsk3{{summary_timeseries}} -- timeseries --> out3>timeseries]
    tsk4{{outliers}} -- segmentation --> out4>segmentation]
    tsk4{{outliers}} -- heatmap --> out5>heatmap]
    tsk4{{outliers}} -- outliers --> out6>outliers]
    tsk4{{outliers}} -- mixture_means --> out7>mixture_means]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **spaceeye_raster**: Rasters livres de nuvens do SpaceEye.

- **index**: Rasters de NDVI.

- **timeseries**: Estatísticas de NDVI agregadas ao longo do intervalo de tempo.

- **segmentation**: Mapas de segmentação baseados na probabilidade de cada amostra pertencer ao componente único do GMM.

- **heatmap**: Mapas de probabilidade.

- **outliers**: Mapas de outliers.

- **mixture_means**: Médias do GMM.

## Parâmetros

- **pc_key**: Chave da API do PlanetaryComputer.

## Tarefas (Tasks)

- **spaceeye**: Executa o pipeline de remoção de nuvens do SpaceEye, gerando imagens diárias livres de nuvens para a geometria e o intervalo de tempo de entrada.

- **ndvi**: Calcula um índice a partir das bandas de um raster de entrada.

- **summary_timeseries**: Calcula a média, o desvio padrão, os valores máximo e mínimo de todas as regiões do raster e os agrega em uma série temporal.

- **outliers**: Ajusta um Modelo de Mistura Gaussiana (GMM) de componente único sobre os dados de entrada para detectar outliers de acordo com o parâmetro de limite (threshold).

## Fluxo de Trabalho (Workflow) Yaml

```yaml
name: change_detection
sources:
  user_input:
    - spaceeye.user_input
    - summary_timeseries.input_geometry
sinks:
  spaceeye_raster: spaceeye.raster
  index: ndvi.index_raster
  timeseries: summary_timeseries.timeseries
  segmentation: outliers.segmentation
  heatmap: outliers.heatmap
  outliers: outliers.outliers
  mixture_means: outliers.mixture_means
parameters:
  pc_key: null
tasks:
  spaceeye:
    workflow: data_ingestion/spaceeye/spaceeye
    parameters:
      pc_key: "@from(pc_key)"
  ndvi:
    workflow: data_processing/index/index
    parameters:
      index: ndvi
  summary_timeseries:
    workflow: data_processing/timeseries/timeseries_aggregation
  outliers:
    workflow: data_processing/outlier/detect_outlier
edges:
  - origin: spaceeye.raster
    destination:
      - ndvi.raster
  - origin: ndvi.index_raster
    destination:
      - summary_timeseries.raster
      - outliers.rasters
description:
  short_description: Identifica alterações/outliers no NDVI ao longo das datas.
  long_description: O fluxo de trabalho gera imagens SpaceEye para a região e intervalo de tempo de entrada e calcula o raster NDVI para cada data. Ele agrega as estatísticas de NDVI (média, desvio padrão, máximo e mínimo) no tempo e detecta outliers entre as datas com um Modelo de Mistura Gaussiana (GMM) de componente único.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    spaceeye_raster: Rasters livres de nuvens do SpaceEye.
    index: Rasters de NDVI.
    timeseries: Estatísticas de NDVI agregadas ao longo do intervalo de tempo.
    segmentation: Mapas de segmentação baseados na probabilidade de cada amostra pertencer ao componente único do GMM.
    heatmap: Mapas de probabilidade.
    outliers: Mapas de outliers.
    mixture_means: Médias do GMM.
  parameters:
    pc_key: Chave da API do PlanetaryComputer.
```
