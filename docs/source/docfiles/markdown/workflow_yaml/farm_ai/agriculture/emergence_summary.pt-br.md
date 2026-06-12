# farm_ai/agriculture/emergence_summary

Calcula estatísticas de emergência usando MSAVI com limiar (média, desvio padrão, máximo e mínimo) para a geometria e o intervalo de tempo de entrada. O fluxo de trabalho (workflow) recupera produtos do Sentinel-2 com a API do Planetary Computer (PC), encaminha-os para um modelo de detecção de nuvens e combina a máscara de nuvens prevista com a máscara fornecida pelo PC. Ele calcula o MSAVI para cada bloco (tile) e data disponíveis, aplica um limiar (threshold) acima de um determinado valor e resume cada um com os valores de média, desvio padrão, máximo e mínimo para as regiões não obscurecidas por nuvens. Por fim, gera uma série temporal (timeseries) com tais estatísticas para todas as datas disponíveis, filtrando os blocos com densa cobertura de nuvens.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>timeseries]
    tsk1{{s2}}
    tsk2{{msavi}}
    tsk3{{emergence}}
    tsk4{{summary_timeseries}}
    tsk1{{s2}} -- raster --> tsk2{{msavi}}
    tsk2{{msavi}} -- index_raster/raster --> tsk3{{emergence}}
    tsk3{{emergence}} -- thresholded_raster/raster --> tsk4{{summary_timeseries}}
    tsk1{{s2}} -- mask --> tsk4{{summary_timeseries}}
    inp1>user_input] -- user_input --> tsk1{{s2}}
    inp1>user_input] -- input_geometry --> tsk4{{summary_timeseries}}
    tsk4{{summary_timeseries}} -- timeseries --> out1>timeseries]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **timeseries**: Estatísticas de emergência agregadas dos blocos recuperados dentro da geometria e intervalo de tempo de entrada.

## Parâmetros

- **pc_key**: Chave opcional da API do Planetary Computer.

## Tarefas (Tasks)

- **s2**: Baixa e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada, e calcula máscaras de nuvem aprimoradas usando modelos de segmentação de nuvens e sombras.

- **msavi**: Calcula um índice a partir das bandas de um raster de entrada.

- **emergence**: Aplica limiares aos valores do raster de entrada se forem superiores ao parâmetro de limite (threshold).

- **summary_timeseries**: Calcula a média, o desvio padrão, os valores máximo e mínimo de todas as regiões do raster consideradas pela máscara e os agrega em uma série temporal.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: emergence_summary
sources:
  user_input:
  - s2.user_input
  - summary_timeseries.input_geometry
sinks:
  timeseries: summary_timeseries.timeseries
parameters:
  pc_key: null
tasks:
  s2:
    workflow: data_ingestion/sentinel2/preprocess_s2_improved_masks
    parameters:
      max_tiles_per_time: 1
      pc_key: '@from(pc_key)'
  msavi:
    workflow: data_processing/index/index
    parameters:
      index: msavi
  emergence:
    workflow: data_processing/threshold/threshold_raster
    parameters:
      threshold: 0.2
  summary_timeseries:
    workflow: data_processing/timeseries/timeseries_masked_aggregation
edges:
- origin: s2.raster
  destination:
  - msavi.raster
- origin: msavi.index_raster
  destination:
  - emergence.raster
- origin: emergence.thresholded_raster
  destination:
  - summary_timeseries.raster
- origin: s2.mask
  destination:
  - summary_timeseries.mask
description:
  short_description: Calcula estatísticas de emergência usando MSAVI com limiar (média, desvio padrão, máximo e mínimo) para a geometria e o intervalo de tempo de entrada.
  long_description: O fluxo de trabalho recupera produtos do Sentinel-2 com a API do Planetary Computer (PC), encaminha-os para um modelo de detecção de nuvens e combina a máscara de nuvens prevista com a máscara fornecida pelo PC. Ele calcula o MSAVI para cada bloco e data disponíveis, aplica um limiar acima de um determinado valor e resume cada um com os valores de média, desvio padrão, máximo e mínimo para as regiões não obscurecidas por nuvens. Por fim, gera uma série temporal com tais estatísticas para todas as datas disponíveis, filtrando os blocos com densa cobertura de nuvens.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    timeseries: Estatísticas de emergência agregadas dos blocos recuperados dentro da geometria e intervalo de tempo de entrada.
  parameters:
    pc_key: Chave opcional da API do Planetary Computer.


```