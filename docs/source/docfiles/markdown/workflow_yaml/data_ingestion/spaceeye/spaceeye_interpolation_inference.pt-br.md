# data_ingestion/spaceeye/spaceeye_interpolation_inference

Realiza interpolação temporal amortecida (damped interpolation) para gerar imagens diárias livres de nuvens a partir de dados do Sentinel-2 e máscaras de nuvens. O fluxo de trabalho agrupará os rasters de entrada do Sentinel-2 e das máscaras de nuvens em janelas espaço-temporais e realizará a inferência de cada janela. As janelas serão então mescladas em rasters para a RoI. Mais informações sobre o SpaceEye estão disponíveis no artigo: https://arxiv.org/abs/2106.08408.

```{mermaid}
    graph TD
    inp1>input_data]
    inp2>s2_rasters]
    inp3>cloud_rasters]
    out1>raster]
    tsk1{{group_s2}}
    tsk2{{group_mask}}
    tsk3{{spaceeye}}
    tsk4{{split}}
    tsk1{{group_s2}} -- tile_sequences/s2_products --> tsk3{{spaceeye}}
    tsk2{{group_mask}} -- tile_sequences/cloud_masks --> tsk3{{spaceeye}}
    tsk3{{spaceeye}} -- spaceeye_sequence/sequences --> tsk4{{split}}
    inp1>input_data] -- input_data --> tsk1{{group_s2}}
    inp1>input_data] -- input_data --> tsk2{{group_mask}}
    inp2>s2_rasters] -- rasters --> tsk1{{group_s2}}
    inp3>cloud_rasters] -- rasters --> tsk2{{group_mask}}
    tsk4{{split}} -- rasters --> out1>raster]
```

## Origens (Sources)

- **input_data**: Intervalo de tempo e região de interesse. Determinará as janelas espaço-temporais e a região para os rasters de saída.

- **s2_rasters**: Rasters de tiles do Sentinel-2 para o intervalo de tempo de entrada.

- **cloud_rasters**: Máscaras de nuvens para cada um dos tiles do Sentinel-2.

## Destinos (Sinks)

- **raster**: Rasters livres de nuvens para o intervalo de tempo de entrada e região de interesse.

## Parâmetros

- **duration**: Janela de tempo, em dias, considerada na inferência. Controla a quantidade de contexto temporal para o preenchimento (inpainting) de nuvens. Janelas maiores exigem mais processamento e memória.

- **time_overlap**: Taxa de sobreposição de cada janela temporal. Controla o passo temporal entre as janelas como uma fração do tamanho da janela.

## Tarefas (Tasks)

- **group_s2**: Agrupa tiles do Sentinel-2 em janelas de tempo de duração definida.

- **group_mask**: Agrupa máscaras de nuvens do Sentinel-2 em janelas de tempo de duração definida.

- **spaceeye**: Executa a versão de interpolação do SpaceEye para remover nuvens nos rasters de entrada.

- **split**: Divide uma lista de múltiplos TileSequence de volta em uma lista de Rasters.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: spaceeye_interpolation_inference
sources:
  input_data:
  - group_s2.input_data
  - group_mask.input_data
  s2_rasters:
  - group_s2.rasters
  cloud_rasters:
  - group_mask.rasters
sinks:
  raster: split.rasters
parameters:
  duration: 48
  time_overlap: 0.5
tasks:
  group_s2:
    op: group_s2_tile_sequence
    op_dir: group_tile_sequence
    parameters:
      duration: '@from(duration)'
      overlap: '@from(time_overlap)'
  group_mask:
    op: group_s2cloudmask_tile_sequence
    op_dir: group_tile_sequence
    parameters:
      duration: '@from(duration)'
      overlap: '@from(time_overlap)'
  spaceeye:
    op: remove_clouds_interpolation
    op_dir: remove_clouds
    parameters:
      duration: '@from(duration)'
  split:
    op: split_spaceeye_sequence
    op_dir: split_sequence
edges:
- origin: group_s2.tile_sequences
  destination:
  - spaceeye.s2_products
- origin: group_mask.tile_sequences
  destination:
  - spaceeye.cloud_masks
- origin: spaceeye.spaceeye_sequence
  destination:
  - split.sequences
description:
  short_description: Realiza interpolação temporal amortecida para gerar imagens diárias
    livres de nuvens a partir de dados do Sentinel-2 e máscaras de nuvens.
  long_description: 'O fluxo de trabalho agrupará os rasters de entrada do Sentinel-2
    e das máscaras de nuvens em janelas espaço-temporais e realizará a inferência de
    cada janela. As janelas serão então mescladas em rasters para a RoI. Mais informações
    sobre o SpaceEye estão disponíveis no artigo: https://arxiv.org/abs/2106.08408.'
  sources:
    input_data: Intervalo de tempo e região de interesse. Determinará as janelas espaço-temporais
      e a região para os rasters de saída.
    s2_rasters: Rasters de tiles do Sentinel-2 para o intervalo de tempo de entrada.
    cloud_rasters: Máscaras de nuvens para cada um dos tiles do Sentinel-2.
  sinks:
    raster: Rasters livres de nuvens para o intervalo de tempo de entrada e região
      de interesse.
  parameters:
    duration: Janela de tempo, em dias, considerada na inferência. Controla a quantidade
      de contexto temporal para o preenchimento de nuvens. Janelas maiores exigem mais
      processamento e memória.
    time_overlap: Taxa de sobreposição de cada janela temporal. Controla o passo temporal
      entre as janelas como uma fração do tamanho da janela.


```