# data_ingestion/spaceeye/spaceeye_preprocess_ensemble

Executa o pipeline de pré-processamento do SpaceEye com um ensemble (conjunto) de modelos de segmentação de nuvens. O fluxo de trabalho busca tiles de Sentinel-1 e Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada e os pré-processa; ele também calcula máscaras de nuvens aprimoradas usando modelos de segmentação de nuvens e sombras. As probabilidades de nuvens são calculadas com um ensemble de cinco modelos.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>s2_raster]
    out2>s1_raster]
    out3>cloud_mask]
    tsk1{{s2}}
    tsk2{{s1}}
    tsk1{{s2}} -- raster/s2_products --> tsk2{{s1}}
    inp1>user_input] -- user_input --> tsk1{{s2}}
    inp1>user_input] -- user_input --> tsk2{{s1}}
    tsk1{{s2}} -- raster --> out1>s2_raster]
    tsk2{{s1}} -- raster --> out2>s1_raster]
    tsk1{{s2}} -- mask --> out3>cloud_mask]
```

## Origens (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos (Sinks)

- **s2_raster**: Rasters do Sentinel-2.

- **s1_raster**: Rasters do Sentinel-1.

- **cloud_mask**: Máscara de nuvens e sombras de nuvens.

## Parâmetros

- **pc_key**: Chave de API do Planetary Computer.

## Tarefas (Tasks)

- **s2**: Faz o download e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada, e calcula máscaras de nuvens aprimoradas usando um ensemble de modelos de segmentação de nuvens e sombras.

- **s1**: Faz o download e pré-processa tiles de imagens do Sentinel-1 que se interceptam com os produtos Sentinel-2 de entrada no intervalo de tempo informado.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: spaceeye_preprocess_ensemble
sources:
  user_input:
  - s2.user_input
  - s1.user_input
sinks:
  s2_raster: s2.raster
  s1_raster: s1.raster
  cloud_mask: s2.mask
parameters:
  pc_key: '@SECRET(eywa-secrets, pc-sub-key)'
tasks:
  s2:
    workflow: data_ingestion/sentinel2/preprocess_s2_ensemble_masks
    parameters:
      pc_key: '@from(pc_key)'
  s1:
    workflow: data_ingestion/sentinel1/preprocess_s1
    parameters:
      pc_key: '@from(pc_key)'
edges:
- origin: s2.raster
  destination:
  - s1.s2_products
description:
  short_description: Executa o pipeline de pré-processamento do SpaceEye com um ensemble
    de modelos de segmentação de nuvens.
  long_description: O fluxo de trabalho busca tiles de Sentinel-1 e Sentinel-2 que
    cobrem a geometria e o intervalo de tempo de entrada e os pré-processa; ele também
    calcula máscaras de nuvens aprimoradas usando modelos de segmentação de nuvens
    e sombras. As probabilidades de nuvens são calculadas com um ensemble de cinco
    modelos.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    s2_raster: Rasters do Sentinel-2.
    s1_raster: Rasters do Sentinel-1.
    cloud_mask: Máscara de nuvens e sombras de nuvens.
  parameters:
    pc_key: Chave de API do Planetary Computer.


```