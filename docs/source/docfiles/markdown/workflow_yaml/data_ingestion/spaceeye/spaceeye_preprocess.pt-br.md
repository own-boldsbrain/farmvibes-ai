# data_ingestion/spaceeye/spaceeye_preprocess

Executa o pipeline de pré-processamento do SpaceEye. O fluxo de trabalho busca tiles de Sentinel-1 e Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada e os pré-processa. Também calcula máscaras de nuvens aprimoradas usando modelos de segmentação de nuvens e sombras.

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

- **min_tile_cover**: Cobertura mínima da RoI (Região de Interesse) para considerar um conjunto de tiles suficiente.

- **max_tiles_per_time**: Número máximo de tiles usados para cobrir a RoI em cada data.

- **cloud_thr**: Limiar (threshold) de confiança para atribuir um pixel como nuvem.

- **shadow_thr**: Limiar de confiança para atribuir um pixel como sombra.

- **pc_key**: Chave de API opcional do Planetary Computer.

- **s1_timeout**: Tempo máximo, em segundos, antes que uma operação de leitura de banda expire (timeout).

- **s2_timeout**: Tempo máximo, em segundos, antes que uma operação de leitura de banda expire.

## Tarefas (Tasks)

- **s2**: Faz o download e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada, e calcula máscaras de nuvens aprimoradas usando modelos de segmentação de nuvens e sombras.

- **s1**: Faz o download e pré-processa tiles de imagens do Sentinel-1 que se interceptam com os produtos Sentinel-2 de entrada no intervalo de tempo informado.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: spaceeye_preprocess_rtc
sources:
  user_input:
  - s2.user_input
  - s1.user_input
sinks:
  s2_raster: s2.raster
  s1_raster: s1.raster
  cloud_mask: s2.mask
parameters:
  min_tile_cover: 0.4
  max_tiles_per_time: null
  cloud_thr: null
  shadow_thr: null
  pc_key: '@SECRET(eywa-secrets, pc-sub-key)'
  s1_timeout: null
  s2_timeout: null
tasks:
  s2:
    workflow: data_ingestion/sentinel2/preprocess_s2_improved_masks
    parameters:
      min_tile_cover: '@from(min_tile_cover)'
      max_tiles_per_time: '@from(max_tiles_per_time)'
      cloud_thr: '@from(cloud_thr)'
      shadow_thr: '@from(shadow_thr)'
      pc_key: '@from(pc_key)'
      in_memory: true
      dl_timeout: '@from(s2_timeout)'
  s1:
    workflow: data_ingestion/sentinel1/preprocess_s1
    parameters:
      pc_key: '@from(pc_key)'
      dl_timeout: '@from(s1_timeout)'
edges:
- origin: s2.raster
  destination:
  - s1.s2_products
description:
  short_description: Executa o pipeline de pré-processamento do SpaceEye.
  long_description: O fluxo de trabalho busca tiles de Sentinel-1 e Sentinel-2 que
    cobrem a geometria e o intervalo de tempo de entrada e os pré-processa. Também
    calcula máscaras de nuvens aprimoradas usando modelos de segmentação de nuvens
    e sombras.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    s2_raster: Rasters do Sentinel-2.
    s1_raster: Rasters do Sentinel-1.
    cloud_mask: Máscara de nuvens e sombras de nuvens.


```