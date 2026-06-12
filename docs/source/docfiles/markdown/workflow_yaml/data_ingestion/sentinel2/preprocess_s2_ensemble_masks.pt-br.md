# data_ingestion/sentinel2/preprocess_s2_ensemble_masks

Faz o download e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada, e calcula máscaras de nuvens aprimoradas usando um ensemble (conjunto) de modelos de segmentação de nuvens e sombras. Este fluxo de trabalho seleciona um conjunto mínimo de tiles que cobre a geometria de entrada, baixa as imagens do Sentinel-2 para o intervalo de tempo selecionado e as pré-processa gerando um único raster multibanda com resolução de 10m. Em seguida, aprimora as máscaras de nuvens mesclando a máscara do produto com as máscaras de nuvens e sombras calculadas por meio de um ensemble de modelos de segmentação.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    out2>mask]
    tsk1{{s2}}
    tsk2{{cloud}}
    tsk1{{s2}} -- raster/s2_raster --> tsk2{{cloud}}
    tsk1{{s2}} -- mask/product_mask --> tsk2{{cloud}}
    inp1>user_input] -- user_input --> tsk1{{s2}}
    tsk1{{s2}} -- raster --> out1>raster]
    tsk2{{cloud}} -- mask --> out2>mask]
```

## Origens (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos (Sinks)

- **raster**: Rasters do Sentinel-2 L2A com todas as bandas reamostradas para resolução de 10m.

- **mask**: Máscaras de nuvens com resolução de 10m.

## Parâmetros

- **min_tile_cover**: Cobertura mínima da RoI para considerar um conjunto de tiles suficiente.

- **max_tiles_per_time**: Número máximo de tiles usados para cobrir a RoI em cada data.

- **cloud_thr**: Limiar de confiança para atribuir um pixel como nuvem.

- **shadow_thr**: Limiar de confiança para atribuir um pixel como sombra.

- **pc_key**: Chave de API opcional do Planetary Computer.

## Tarefas (Tasks)

- **s2**: Faz o download e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada.

- **cloud**: Aprimora as máscaras de nuvens mesclando a máscara de nuvem do produto com as máscaras de nuvens e sombras calculadas por um ensemble de modelos de segmentação de aprendizado de máquina.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: preprocess_s2_ensemble_masks
sources:
  user_input:
  - s2.user_input
sinks:
  raster: s2.raster
  mask: cloud.mask
parameters:
  min_tile_cover: null
  max_tiles_per_time: null
  cloud_thr: null
  shadow_thr: null
  pc_key: null
tasks:
  s2:
    workflow: data_ingestion/sentinel2/preprocess_s2
    parameters:
      min_tile_cover: '@from(min_tile_cover)'
      max_tiles_per_time: '@from(max_tiles_per_time)'
      pc_key: '@from(pc_key)'
  cloud:
    workflow: data_ingestion/sentinel2/improve_cloud_mask_ensemble
    parameters:
      cloud_thr: '@from(cloud_thr)'
      shadow_thr: '@from(shadow_thr)'
edges:
- origin: s2.raster
  destination:
  - cloud.s2_raster
- origin: s2.mask
  destination:
  - cloud.product_mask
description:
  short_description: Faz o download e pré-processa imagens do Sentinel-2 que cobrem
    a geometria e o intervalo de tempo de entrada, e calcula máscaras de nuvens aprimoradas
    usando um ensemble de modelos de segmentação de nuvens e sombras.
  long_description: Este fluxo de trabalho seleciona um conjunto mínimo de tiles que
    cobre a geometria de entrada, baixa as imagens do Sentinel-2 para o intervalo
    de tempo selecionado e as pré-processa gerando um único raster multibanda com
    resolução de 10m. Em seguida, aprimora as máscaras de nuvens mesclando a máscara
    do produto com as máscaras de nuvens e sombras calculadas por meio de um ensemble
    de modelos de segmentação de nuvens e sombras.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    raster: Rasters do Sentinel-2 L2A com todas as bandas reamostradas para resolução
      de 10m.
    mask: Máscaras de nuvens com resolução de 10m.


```