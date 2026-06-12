# data_ingestion/spaceeye/spaceeye

Executa o pipeline de remoção de nuvens do SpaceEye, produzindo imagens diárias livres de nuvens para a geometria e o intervalo de tempo de entrada. O fluxo de trabalho busca tiles de Sentinel-1 e Sentinel-2 que cobrem a geometria e o intervalo de tempo, pré-processa-os, calcula máscaras de nuvens e executa a inferência do SpaceEye em uma janela deslizante nos tiles recuperados. Este fluxo de trabalho pode ser reutilizado como uma etapa de pré-processamento em muitas aplicações que exigem dados do Sentinel-2 sem nuvens. Para mais informações sobre o SpaceEye, leia o artigo: https://arxiv.org/abs/2106.08408.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    tsk1{{preprocess}}
    tsk2{{spaceeye}}
    tsk1{{preprocess}} -- s2_raster/s2_rasters --> tsk2{{spaceeye}}
    tsk1{{preprocess}} -- s1_raster/s1_rasters --> tsk2{{spaceeye}}
    tsk1{{preprocess}} -- cloud_mask/cloud_rasters --> tsk2{{spaceeye}}
    inp1>user_input] -- user_input --> tsk1{{preprocess}}
    inp1>user_input] -- input_data --> tsk2{{spaceeye}}
    tsk2{{spaceeye}} -- raster --> out1>raster]
```

## Origens (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos (Sinks)

- **raster**: Rasters livres de nuvens.

## Parâmetros

- **duration**: Janela de tempo, em dias, considerada na inferência. Controla a quantidade de contexto temporal para o preenchimento de nuvens. Janelas maiores exigem mais processamento e memória.

- **time_overlap**: Taxa de sobreposição de cada janela temporal. Controla o passo temporal entre as janelas como uma fração do tamanho da janela.

- **min_tile_cover**: Cobertura mínima da RoI para considerar um conjunto de tiles suficiente.

- **max_tiles_per_time**: Número máximo de tiles usados para cobrir a RoI em cada data.

- **cloud_thr**: Limiar de confiança para atribuir um pixel como nuvem.

- **shadow_thr**: Limiar de confiança para atribuir um pixel como sombra.

- **pc_key**: Chave de API opcional do Planetary Computer.

- **s2_timeout**: Tempo máximo, em segundos, antes que uma operação de leitura de banda expire.

## Tarefas (Tasks)

- **preprocess**: Executa o pipeline de pré-processamento do SpaceEye.

- **spaceeye**: Realiza a inferência do SpaceEye para gerar imagens diárias livres de nuvens, dados os rasters do Sentinel e as máscaras de nuvens.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: spaceeye
sources:
  user_input:
  - preprocess.user_input
  - spaceeye.input_data
sinks:
  raster: spaceeye.raster
parameters:
  duration: null
  time_overlap: null
  min_tile_cover: null
  max_tiles_per_time: null
  cloud_thr: null
  shadow_thr: null
  pc_key: null
  s2_timeout: null
tasks:
  preprocess:
    workflow: data_ingestion/spaceeye/spaceeye_preprocess
    parameters:
      min_tile_cover: '@from(min_tile_cover)'
      max_tiles_per_time: '@from(max_tiles_per_time)'
      cloud_thr: '@from(cloud_thr)'
      shadow_thr: '@from(shadow_thr)'
      pc_key: '@from(pc_key)'
      s2_timeout: '@from(s2_timeout)'
  spaceeye:
    workflow: data_ingestion/spaceeye/spaceeye_inference
    parameters:
      duration: '@from(duration)'
      time_overlap: '@from(time_overlap)'
edges:
- origin: preprocess.s2_raster
  destination:
  - spaceeye.s2_rasters
- origin: preprocess.s1_raster
  destination:
  - spaceeye.s1_rasters
- origin: preprocess.cloud_mask
  destination:
  - spaceeye.cloud_rasters
description:
  short_description: Executa o pipeline de remoção de nuvens do SpaceEye, produzindo
    imagens diárias livres de nuvens para a geometria e o intervalo de tempo de entrada.
  long_description: 'O fluxo de trabalho busca tiles de Sentinel-1 e Sentinel-2 que
    cobrem a geometria e o intervalo de tempo, pré-processa-os, calcula máscaras de
    nuvens e executa a inferência do SpaceEye em uma janela deslizante nos tiles recuperados.
    Este fluxo de trabalho pode ser reutilizado como uma etapa de pré-processamento
    em muitas aplicações que exigem dados do Sentinel-2 sem nuvens. Para mais informações
    sobre o SpaceEye, leia o artigo: https://arxiv.org/abs/2106.08408.'
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    raster: Rasters livres de nuvens.
  parameters: null


```