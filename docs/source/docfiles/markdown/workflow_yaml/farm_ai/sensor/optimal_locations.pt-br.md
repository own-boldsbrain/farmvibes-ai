# farm_ai/sensor/optimal_locations

Identifica localizações ideais realizando uma operação de agrupamento (clustering) usando o modelo de Mistura Gaussiana em índices de raster calculados. A operação de agrupamento separa os valores dos índices de raster calculados em n grupos de variância igual, cada grupo atribuído a uma localização, e essa localização é considerada uma localização ideal. As localizações de amostra geradas fornecem informações de latitude e longitude. A localização ideal pode ser utilizada para instalar sensores e coletar informações do solo. O parâmetro de índice usado como entrada para executar o fluxo de trabalho (workflow) de índice calculado internamente usando o raster de entrada enviado. A seleção do parâmetro de índice varia de acordo com a necessidade. O fluxo de trabalho suporta todos os índices suportados pela biblioteca spyndex (https://github.com/awesome-spectral-indices/awesome-spectral-indices#vegetation).
Abaixo são fornecidos vários índices que são usados para identificar localizações ideais e gerar um mapa de calor de nutrientes.
Índice de Vegetação Melhorado (EVI - Enhanced Vegetation Index) - O EVI é projetado para minimizar a influência do brilho do solo e das condições atmosféricas na avaliação da vegetação. É calculado usando as bandas vermelha, azul e infravermelho próximo (NIR). O EVI é particularmente útil para monitorar a vegetação em regiões com alta cobertura de dossel (canopy cover) e em áreas onde a interferência atmosférica é significativa. Este índice também é usado no notebook (notebooks/heatmaps/nutrients_using_neighbors.ipynb) que deriva informações de nutrientes para Carbono, Nitrogênio e Fósforo.
Índice de Refletância Fotoquímica (PRI - Photochemical Reflectance Index) - É um índice de vegetação usado para avaliar a eficiência do uso da luz pelas plantas em termos de fotossíntese e sua resposta a mudanças nas condições de luz, particularmente variações nas partes azul e vermelha do espectro eletromagnético. Este índice também é usado no notebook (notebooks/heatmaps/nutrients_using_neighbors.ipynb) que deriva informações de nutrientes para o pH.
O número de localizações de amostra geradas depende dos parâmetros de entrada enviados. Ajuste os parâmetros n_clusters e sieve_size para gerar mais ou menos pontos de dados de localização.
Para uma fazenda de 100 acres, 
- 20 localizações de amostra são geradas usando n_clusters=5 e sieve_size=10.
- 30 localizações de amostra são geradas usando n_clusters=5 e sieve_size=20.
- 80 localizações de amostra são geradas usando n_clusters=5 e sieve_size=5.
- 130 localizações de amostra são geradas usando n_clusters=8 e sieve_size=5.

```{mermaid}
    graph TD
    inp1>user_input]
    inp2>input_raster]
    out1>result]
    tsk1{{compute_index}}
    tsk2{{find_samples}}
    tsk1{{compute_index}} -- index_raster/raster --> tsk2{{find_samples}}
    inp1>user_input] -- user_input --> tsk2{{find_samples}}
    inp2>input_raster] -- raster --> tsk1{{compute_index}}
    tsk2{{find_samples}} -- locations --> out1>result]
```

## Fontes (Sources)

- **input_raster**: Lista de índices de raster calculados gerados usando as imagens de satélite Sentinel-2.

- **user_input**: DataVibe com informações de intervalo de tempo.

## Sinks (Saídas)

- **result**: Arquivo zip contendo as localizações das amostras no formato shapefile (.shp).

## Parâmetros

- **n_clusters**: número de agrupamentos (clusters) usados para gerar localizações de amostra.

- **sieve_size**: Agrupa os valores de pixel vizinhos mais próximos.

- **index**: Índice usado para gerar localizações de amostra.

## Tarefas (Tasks)

- **compute_index**: Calcula um índice a partir das bandas de um raster de entrada.

- **find_samples**: Encontra localizações mínimas de amostras de solo agrupando valores de índices derivados de bandas de imagens de satélite ou SpaceEye.

## Workflow Yaml

```yaml

name: optimal_locations
sources:
  user_input:
  - find_samples.user_input
  input_raster:
  - compute_index.raster
sinks:
  result: find_samples.locations
parameters:
  n_clusters: null
  sieve_size: null
  index: null
tasks:
  compute_index:
    workflow: data_processing/index/index
    parameters:
      index: '@from(index)'
  find_samples:
    op: find_soil_sample_locations
    op_dir: minimum_samples
    parameters:
      n_clusters: '@from(n_clusters)'
      sieve_size: '@from(sieve_size)'
edges:
- origin: compute_index.index_raster
  destination:
  - find_samples.raster
description:
  short_description: Identifica localizações ideais realizando uma operação de agrupamento usando o modelo de Mistura Gaussiana em índices de raster calculados.
  long_description: "A operação de agrupamento separa os valores dos índices de raster calculados em n grupos de variância igual, cada grupo atribuído a uma localização, e essa localização é considerada uma localização ideal. As localizações de amostra geradas fornecem informações de latitude e longitude. A localização ideal pode ser utilizada para instalar sensores e coletar informações do solo. O parâmetro de índice usado como entrada para executar o fluxo de trabalho de índice calculado internamente usando o raster de entrada enviado. A seleção do parâmetro de índice varia de acordo com a necessidade. O fluxo de trabalho suporta todos os índices suportados pela biblioteca spyndex (https://github.com/awesome-spectral-indices/awesome-spectral-indices#vegetation).\nAbaixo são fornecidos vários índices que são usados para identificar localizações ideais e gerar um mapa de calor de nutrientes.\nÍndice de Vegetação Melhorado (EVI) - O EVI é projetado para minimizar a influência do brilho do solo e das condições atmosféricas na avaliação da vegetação. É calculado usando as bandas vermelha, azul e infravermelho próximo (NIR). O EVI é particularmente útil para monitorar a vegetação em regiões com alta cobertura de dossel e em áreas onde a interferência atmosférica é significativa. Este índice também é usado no notebook (notebooks/heatmaps/nutrients_using_neighbors.ipynb) que deriva informações de nutrientes para Carbono, Nitrogênio e Fósforo.\nÍndice de Refletância Fotoquímica (PRI) - É um índice de vegetação usado para avaliar a eficiência do uso da luz pelas plantas em termos de fotossíntese e sua resposta a mudanças nas condições de luz, particularmente variações nas partes azul e vermelha do espectro eletromagnético. Este índice também é usado no notebook (notebooks/heatmaps/nutrients_using_neighbors.ipynb) que deriva informações de nutrientes para o pH.\nO número de localizações de amostra geradas depende dos parâmetros de entrada enviados. Ajuste os parâmetros n_clusters e sieve_size para gerar mais ou menos pontos de dados de localização.\nPara uma fazenda de 100 acres, \n- 20 localizações de amostra são geradas usando n_clusters=5 e sieve_size=10.\n- 30 localizações de amostra são geradas usando n_clusters=5 e sieve_size=20.\n- 80 localizações de amostra são geradas usando n_clusters=5 e sieve_size=5.\n- 130 localizações de amostra são geradas usando n_clusters=8 e sieve_size=5."
  sources:
    input_raster: Lista de índices de raster calculados gerados usando as imagens de satélite Sentinel-2.
    user_input: DataVibe com informações de intervalo de tempo.
  sinks:
    result: Arquivo zip contendo as localizações das amostras no formato shapefile (.shp).
  parameters:
    n_clusters: número de agrupamentos usados para gerar localizações de amostra.
    sieve_size: Agrupa os valores de pixel vizinhos mais próximos.
    index: Índice usado para gerar localizações de amostra.


```