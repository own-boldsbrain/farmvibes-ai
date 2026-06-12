# farm_ai/agriculture/canopy_cover

Estima a cobertura do dossel (canopy cover) por pixel para uma região e data. O fluxo de trabalho (workflow) recupera os produtos relevantes do Sentinel-2 com a API do Planetary Computer (PC) e calcula o NDVI para cada bloco (tile) e data disponíveis. Ele aplica um regressor linear treinado com características polinomiais (até o 3º grau) sobre o raster do índice para estimar a cobertura do dossel. Os coeficientes e a interceptação do regressor foram obtidos previamente usando imagens de drones mascaradas/anotadas como verdade de campo (ground-truth) e são usados para inferência neste fluxo de trabalho.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>ndvi]
    out2>estimated_canopy_cover]
    out3>ndvi_timeseries]
    out4>canopy_timeseries]
    tsk1{{ndvi_summary}}
    tsk2{{canopy}}
    tsk3{{canopy_summary_timeseries}}
    tsk1{{ndvi_summary}} -- index/indices --> tsk2{{canopy}}
    tsk2{{canopy}} -- estimated_canopy_cover/raster --> tsk3{{canopy_summary_timeseries}}
    tsk1{{ndvi_summary}} -- merged_cloud_mask/mask --> tsk3{{canopy_summary_timeseries}}
    inp1>user_input] -- user_input --> tsk1{{ndvi_summary}}
    inp1>user_input] -- input_geometry --> tsk3{{canopy_summary_timeseries}}
    tsk1{{ndvi_summary}} -- index --> out1>ndvi]
    tsk2{{canopy}} -- estimated_canopy_cover --> out2>estimated_canopy_cover]
    tsk1{{ndvi_summary}} -- timeseries --> out3>ndvi_timeseries]
    tsk3{{canopy_summary_timeseries}} -- timeseries --> out4>canopy_timeseries]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **ndvi**: Raster de NDVI.

- **estimated_canopy_cover**: Raster com estimativa de cobertura do dossel por pixel.

- **ndvi_timeseries**: Estatísticas de NDVI agregadas dos blocos recuperados dentro da geometria e intervalo de tempo de entrada.

- **canopy_timeseries**: Estatísticas agregadas de cobertura do dossel.

## Parâmetros

- **pc_key**: Chave opcional da API do Planetary Computer.

## Tarefas (Tasks)

- **ndvi_summary**: Calcula estatísticas de NDVI (média, desvio padrão, máximo e mínimo) para a geometria e intervalo de tempo de entrada.

- **canopy**: Aplica um regressor linear com características polinomiais pré-computadas sobre o raster do índice para estimar a cobertura do dossel.

- **canopy_summary_timeseries**: Calcula a média, o desvio padrão, os valores máximo e mínimo de todas as regiões do raster consideradas pela máscara e os agrega em uma série temporal.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: canopy_cover
sources:
  user_input:
  - ndvi_summary.user_input
  - canopy_summary_timeseries.input_geometry
sinks:
  ndvi: ndvi_summary.compute_ndvi.compute_index.index
  estimated_canopy_cover: canopy.estimated_canopy_cover
  ndvi_timeseries: ndvi_summary.timeseries
  canopy_timeseries: canopy_summary_timeseries.timeseries
parameters:
  pc_key: null
tasks:
  ndvi_summary:
    workflow: farm_ai/agriculture/ndvi_summary
    parameters:
      pc_key: '@from(pc_key)'
  canopy:
    op: estimate_canopy_cover
  canopy_summary_timeseries:
    workflow: data_processing/timeseries/timeseries_masked_aggregation
edges:
- origin: ndvi_summary.compute_ndvi.compute_index.index
  destination:
  - canopy.indices
- origin: canopy.estimated_canopy_cover
  destination:
  - canopy_summary_timeseries.raster
- origin: ndvi_summary.s2.cloud.merge.merged_cloud_mask
  destination:
  - canopy_summary_timeseries.mask
description:
  short_description: Estima a cobertura do dossel por pixel para uma região e data.
  long_description: O fluxo de trabalho recupera os produtos relevantes do Sentinel-2 com a API do Planetary Computer (PC) e calcula o NDVI para cada bloco e data disponíveis. Ele aplica um regressor linear treinado com características polinomiais (até o 3º grau) sobre o raster do índice para estimar a cobertura do dossel. Os coeficientes e a interceptação do regressor foram obtidos previamente usando imagens de drones mascaradas/anotadas como verdade de campo e são usados para inferência neste fluxo de trabalho.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    ndvi: Raster de NDVI.
    estimated_canopy_cover: Raster com estimativa de cobertura do dossel por pixel.
    ndvi_timeseries: Estatísticas de NDVI agregadas dos blocos recuperados dentro da geometria e intervalo de tempo de entrada.
    canopy_timeseries: Estatísticas agregadas de cobertura do dossel.
  parameters:
    pc_key: Chave opcional da API do Planetary Computer.


```