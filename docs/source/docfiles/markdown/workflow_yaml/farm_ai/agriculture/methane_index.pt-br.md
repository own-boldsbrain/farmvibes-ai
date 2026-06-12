# farm_ai/agriculture/methane_index

Calcula o índice de metano a partir de ultra emissores para uma região e intervalo de datas. O fluxo de trabalho (workflow) recupera os produtos relevantes do Sentinel-2 com a API do Planetary Computer (PC) e recorta (crop) os rasters para a região definida em user_input. Todas as bandas são normalizadas e um filtro gaussiano de suavização (anti-aliasing) é aplicado para suavizar e remover potenciais artefatos. Um algoritmo não supervisionado de K-Vizinhos Mais Próximos (K-Nearest Neighbor) é aplicado para identificar bandas semelhantes à banda 12, e o índice é calculado pela diferença entre a banda 12 e a mediana pixel a pixel das K bandas mais semelhantes.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>index]
    out2>s2_raster]
    out3>cloud_mask]
    tsk1{{s2}}
    tsk2{{clip}}
    tsk3{{methane}}
    tsk1{{s2}} -- raster --> tsk2{{clip}}
    tsk2{{clip}} -- clipped_raster/raster --> tsk3{{methane}}
    inp1>user_input] -- user_input --> tsk1{{s2}}
    inp1>user_input] -- input_geometry --> tsk2{{clip}}
    tsk3{{methane}} -- index_raster --> out1>index]
    tsk1{{s2}} -- raster --> out2>s2_raster]
    tsk1{{s2}} -- mask --> out3>cloud_mask]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **index**: Raster do índice de metano.

- **s2_raster**: Raster do Sentinel-2.

- **cloud_mask**: Máscara de nuvens.

## Parâmetros

- **pc_key**: Chave opcional da API do Planetary Computer.

## Tarefas (Tasks)

- **s2**: Baixa e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada, e calcula máscaras de nuvem aprimoradas usando modelos de segmentação de nuvens e sombras.

- **clip**: Realiza um recorte (clip) em um raster de entrada com base em uma geometria de referência fornecida.

- **methane**: Calcula um índice a partir das bandas de um raster de entrada.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: methane_index
sources:
  user_input:
  - s2.user_input
  - clip.input_geometry
sinks:
  index: methane.index_raster
  s2_raster: s2.raster
  cloud_mask: s2.mask
parameters:
  pc_key: null
tasks:
  s2:
    workflow: data_ingestion/sentinel2/preprocess_s2_improved_masks
    parameters:
      pc_key: '@from(pc_key)'
  clip:
    workflow: data_processing/clip/clip
  methane:
    workflow: data_processing/index/index
    parameters:
      index: methane
edges:
- origin: s2.raster
  destination:
  - clip.raster
- origin: clip.clipped_raster
  destination:
  - methane.raster
description:
  short_description: Calcula o índice de metano a partir de ultra emissores para uma região e intervalo de datas.
  long_description: O fluxo de trabalho recupera os produtos relevantes do Sentinel-2 com a API do Planetary Computer (PC) e recorta os rasters para a região definida em user_input. Todas as bandas são normalizadas e um filtro gaussiano de suavização (anti-aliasing) é aplicado para suavizar e remover potenciais artefatos. Um algoritmo não supervisionado de K-Vizinhos Mais Próximos (K-Nearest Neighbor) é aplicado para identificar bandas semelhantes à banda 12, e o índice é calculado pela diferença entre a banda 12 e a mediana pixel a pixel das K bandas mais semelhantes.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    index: Raster do índice de metano.
    s2_raster: Raster do Sentinel-2.
    cloud_mask: Máscara de nuvens.
  parameters:
    pc_key: Chave opcional da API do Planetary Computer.


```