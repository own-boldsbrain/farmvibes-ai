# farm_ai/agriculture/heatmap_using_classification

O fluxo de trabalho (workflow) gera um mapa de calor (heatmap) de nutrientes para amostras fornecidas pelo usuário, baixando as amostras da entrada do usuário. As amostras fornecidas estão relacionadas ao limite da fazenda e possuem as informações de nutrientes necessárias para criar um mapa de calor.

```{mermaid}
    graph TD
    inp1>input_samples]
    inp2>input_raster]
    out1>result]
    tsk1{{download_samples}}
    tsk2{{soil_sample_heatmap_classification}}
    tsk1{{download_samples}} -- geometry/samples --> tsk2{{soil_sample_heatmap_classification}}
    inp1>input_samples] -- user_input --> tsk1{{download_samples}}
    inp2>input_raster] -- input_raster --> tsk2{{soil_sample_heatmap_classification}}
    tsk2{{soil_sample_heatmap_classification}} -- result --> out1>result]
```

## Fontes (Sources)

- **input_raster**: Raster de entrada para o cálculo do índice.

- **input_samples**: Referências externas para amostras de sensores para nutrientes.

## Sinks

- **result**: Arquivo zip contendo as geometrias dos clusters.

## Parâmetros

- **attribute_name**: Nome da propriedade do nutriente no arquivo geojson de amostras do sensor. Por exemplo: CARBON (C), Nitrogen (N), Phosphorus (P) etc.

- **buffer**: Distância de deslocamento (offset) da amostra para realizar operações de interpolação com raster.

- **index**: Tipo de índice a ser usado para gerar o mapa de calor. Por exemplo - evi, pri etc.

- **bins**: Número possível de grupos usados para mover o valor para o grupo mais próximo usando o [histograma numpy](https://numpy.org/doc/stable/reference/generated/numpy.histogram.html) e para pré-processar os dados para suportar o treinamento do modelo com classificação.

- **simplify**: Substitui polígonos pequenos na entrada pelo valor de seu maior vizinho após a conversão de raster para vetor. Aceita 'simplify', 'convex' ou 'none'.

- **tolerance**: Todas as partes de uma [geometria simplificada](https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoSeries.simplify.html) não estarão a mais do que a distância de tolerância da original. Possui as mesmas unidades do sistema de referência de coordenadas da GeoSeries. Por exemplo, usar tolerance=100 em um CRS projetado com metros como unidades significa uma distância de 100 metros na realidade.

- **data_scale**: Aceita True ou False. O padrão é False. Se True, escala os dados usando [StandardScalar](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html) do pacote scikit-learn. Ele padroniza as funcionalidades removendo a média e escalonando para a variância unitária.

- **max_depth**: A profundidade máxima da árvore. Se None, os nós são expandidos até que todas as folhas sejam puras ou até que todas as folhas contenham menos de min_samples_split amostras. Para mais detalhes, consulte (https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)

- **n_estimators**: O número de árvores na floresta. Para mais detalhes, consulte (https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)

- **random_state**: Controla tanto a aleatoriedade da amostragem das amostras usadas ao construir árvores (se bootstrap=True) quanto a amostragem das funcionalidades a serem consideradas ao procurar a melhor divisão em cada nó (se max_features < n_features). Para mais detalhes, consulte (https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)

## Tarefas (Tasks)

- **download_samples**: Adiciona geometrias do usuário no armazenamento do cluster, permitindo que sejam usadas em fluxos de trabalho.

- **soil_sample_heatmap_classification**: Utiliza imagens de satélite Sentinel-2 de entrada e as amostras de sensores como dados rotulados que contêm informações de nutrientes (Nitrogênio, Carbono, pH, Fósforo) para treinar um modelo usando o classificador Random Forest. A operação de inferência prevê os nutrientes no solo para o limite da fazenda escolhido.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: heatmap_using_classification
sources:
  input_samples:
  - download_samples.user_input
  input_raster:
  - soil_sample_heatmap_classification.input_raster
sinks:
  result: soil_sample_heatmap_classification.result
parameters:
  attribute_name: null
  buffer: null
  index: null
  bins: null
  simplify: null
  tolerance: null
  data_scale: null
  max_depth: null
  n_estimators: null
  random_state: null
tasks:
  download_samples:
    workflow: data_ingestion/user_data/ingest_geometry
  soil_sample_heatmap_classification:
    workflow: data_processing/heatmap/classification
    parameters:
      attribute_name: '@from(attribute_name)'
      buffer: '@from(buffer)'
      index: '@from(index)'
      bins: '@from(bins)'
      simplify: '@from(simplify)'
      tolerance: '@from(tolerance)'
      data_scale: '@from(data_scale)'
      max_depth: '@from(max_depth)'
      n_estimators: '@from(n_estimators)'
      random_state: '@from(random_state)'
edges:
- origin: download_samples.geometry
  destination:
  - soil_sample_heatmap_classification.samples
description:
  short_description: O fluxo de trabalho gera um mapa de calor de nutrientes para amostras fornecidas pelo usuário, baixando as amostras da entrada do usuário.
  long_description: As amostras fornecidas estão relacionadas ao limite da fazenda e possuem as informações de nutrientes necessárias para criar um mapa de calor.
  sources:
    input_raster: Raster de entrada para o cálculo do índice.
    input_samples: Referências externas para amostras de sensores para nutrientes.
  sinks:
    result: Arquivo zip contendo as geometrias dos clusters.
  parameters: null


```