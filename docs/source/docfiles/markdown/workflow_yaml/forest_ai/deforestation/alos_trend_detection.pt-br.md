# forest_ai/deforestation/alos_trend_detection

Detecta tendências de aumento/diminuição nos níveis de pixel florestal sobre a geometria e o intervalo de tempo de entrada do usuário para o mapa florestal ALOS. Este fluxo de trabalho (workflow) combina os fluxos de trabalho alos_forest_extent_download_merge e ordinal_trend_detection para detectar tendências de aumento/diminuição nos níveis de pixel florestal sobre a geometria e o intervalo de tempo fornecidos pelo usuário para o mapa florestal ALOS. Os Mapas Florestais/Não Florestais do ALOS PALSAR 2.1 são baixados no fluxo de trabalho alos_forest_extent_download_merge. Em seguida, o fluxo de trabalho ordinal_trend_detection recorta (clips) o raster ordinal para a geometria e o intervalo de tempo fornecidos pelo usuário e determina se há uma tendência de aumento ou diminuição nos níveis de pixel florestal sobre eles. O alos_trend_detection usa o teste de Cochran-Armitage para detectar tendências nos níveis florestais ao longo dos anos. A hipótese nula é que não há tendência nos níveis de pixel sobre a lista de rasters. A hipótese alternativa é que há uma tendência nos níveis de pixel florestal sobre a lista de rasters (um para cada ano). Ele retorna um valor-p (p-value) e uma pontuação-z (z-score). Se o valor-p for menor que algum nível de significância, a hipótese nula é rejeitada e a hipótese alternativa é aceita. Se a pontuação-z for positiva, a tendência é de aumento. Se a pontuação-z for negativa, a tendência é de diminuição.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>merged_raster]
    out2>categorical_raster]
    out3>recoded_raster]
    out4>clipped_raster]
    out5>trend_test_result]
    tsk1{{alos_forest_extent_download_merge}}
    tsk2{{ordinal_trend_detection}}
    tsk1{{alos_forest_extent_download_merge}} -- merged_raster/raster --> tsk2{{ordinal_trend_detection}}
    inp1>user_input] -- user_input --> tsk1{{alos_forest_extent_download_merge}}
    inp1>user_input] -- input_geometry --> tsk2{{ordinal_trend_detection}}
    tsk1{{alos_forest_extent_download_merge}} -- merged_raster --> out1>merged_raster]
    tsk1{{alos_forest_extent_download_merge}} -- categorical_raster --> out2>categorical_raster]
    tsk2{{ordinal_trend_detection}} -- recoded_raster --> out3>recoded_raster]
    tsk2{{ordinal_trend_detection}} -- clipped_raster --> out4>clipped_raster]
    tsk2{{ordinal_trend_detection}} -- trend_test_result --> out5>trend_test_result]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks (Saídas)

- **merged_raster**: Raster mesclado (merged) do Mapa Florestal/Não Florestal ALOS PALSAR 2.1 para a geometria e o intervalo de tempo fornecidos pelo usuário.

- **categorical_raster**: Raster categórico do Mapa Florestal/Não Florestal ALOS PALSAR 2.1 para a geometria e o intervalo de tempo fornecidos pelo usuário antes da operação de mesclagem.

- **recoded_raster**: Raster recodificado do Mapa Florestal/Não Florestal ALOS PALSAR 2.1 para a geometria e o intervalo de tempo fornecidos pelo usuário.

- **clipped_raster**: Raster ordinal recortado para a geometria e o intervalo de tempo fornecidos pelo usuário.

- **trend_test_result**: Resultados do teste de Cochran-Armitage compostos por valor-p e pontuação-z.

## Parâmetros

- **pc_key**: Chave de API do Planetary Computer.

- **from_values**: Valores a partir dos quais recodificar.

- **to_values**: Valores para os quais recodificar.

## Tarefas (Tasks)

- **alos_forest_extent_download_merge**: Baixa o mapa de classificação florestal/não florestal do Advanced Land Observing Satellite (ALOS) e o mescla em um único raster.

- **ordinal_trend_detection**: Detecta tendências de aumento/diminuição nos níveis de pixel sobre a geometria e o intervalo de tempo de entrada do usuário.

## Workflow Yaml

```yaml

name: alos_trend_detection
sources:
  user_input:
  - alos_forest_extent_download_merge.user_input
  - ordinal_trend_detection.input_geometry
sinks:
  merged_raster: alos_forest_extent_download_merge.merged_raster
  categorical_raster: alos_forest_extent_download_merge.categorical_raster
  recoded_raster: ordinal_trend_detection.recoded_raster
  clipped_raster: ordinal_trend_detection.clipped_raster
  trend_test_result: ordinal_trend_detection.trend_test_result
parameters:
  pc_key: null
  from_values:
  - 4
  - 3
  - 0
  - 2
  - 1
  to_values:
  - 0
  - 0
  - 0
  - 1
  - 1
tasks:
  alos_forest_extent_download_merge:
    workflow: data_ingestion/alos/alos_forest_extent_download_merge
    parameters:
      pc_key: '@from(pc_key)'
  ordinal_trend_detection:
    workflow: forest_ai/deforestation/ordinal_trend_detection
    parameters:
      from_values: '@from(from_values)'
      to_values: '@from(to_values)'
edges:
- origin: alos_forest_extent_download_merge.merged_raster
  destination:
  - ordinal_trend_detection.raster
description:
  short_description: Detecta tendências de aumento/diminuição nos níveis de pixel florestal sobre a geometria e o intervalo de tempo de entrada do usuário para o mapa florestal ALOS.
  long_description: Este fluxo de trabalho combina os fluxos de trabalho alos_forest_extent_download_merge e ordinal_trend_detection para detectar tendências de aumento/diminuição nos níveis de pixel florestal sobre a geometria e o intervalo de tempo fornecidos pelo usuário para o mapa florestal ALOS. Os Mapas Florestais/Não Florestais do ALOS PALSAR 2.1 são baixados no fluxo de trabalho alos_forest_extent_download_merge. Em seguida, o fluxo de trabalho ordinal_trend_detection recorta o raster ordinal para a geometria e o intervalo de tempo fornecidos pelo usuário e determina se há uma tendência de aumento ou diminuição nos níveis de pixel florestal sobre eles. O alos_trend_detection usa o teste de Cochran-Armitage para detectar tendências nos níveis florestais ao longo dos anos. A hipótese nula é que não há tendência nos níveis de pixel sobre a lista de rasters. A hipótese alternativa é que há uma tendência nos níveis de pixel florestal sobre a lista de rasters (um para cada ano). Ele retorna um valor-p e uma pontuação-z. Se o valor-p for menor que algum nível de significância, a hipótese nula é rejeitada e a hipótese alternativa é aceita. Se a pontuação-z for positiva, a tendência é de aumento. Se a pontuação-z for negativa, a tendência é de diminuição.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    merged_raster: Raster mesclado do Mapa Florestal/Não Florestal ALOS PALSAR 2.1 para a geometria e o intervalo de tempo fornecidos pelo usuário.
    categorical_raster: Raster categórico do Mapa Florestal/Não Florestal ALOS PALSAR 2.1 para a geometria e o intervalo de tempo fornecidos pelo usuário antes da operação de mesclagem.
    recoded_raster: Raster mesclado do Mapa Florestal/Não Florestal ALOS PALSAR 2.1 para a geometria e o intervalo de tempo fornecidos pelo usuário.
    clipped_raster: Raster ordinal recortado para a geometria e o intervalo de tempo fornecidos pelo usuário.
    trend_test_result: Resultados do teste de Cochran-Armitage compostos por valor-p e pontuação-z.
  parameters:
    pc_key: Chave de API do Planetary Computer.
    from_values: Valores a partir dos quais recodificar.
    to_values: Valores para os quais recodificar.


```