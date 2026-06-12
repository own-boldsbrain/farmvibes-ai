# data_processing/heatmap/classification

Utiliza imagens de satélite Sentinel-2 e amostras de sensores como dados rotulados que contêm informações de nutrientes (Nitrogênio, Carbono, pH, Fósforo) para treinar um modelo usando o classificador Random Forest. A operação de inferência prevê nutrientes no solo para o limite da fazenda escolhido.
O fluxo de trabalho gera um mapa de calor (heatmap) para o nutriente selecionado. Ele depende de dados de solo de amostra que contêm informações de nutrientes. A quantidade de amostras define a precisão da geração do mapa de calor. Durante a pesquisa, foram realizados testes com amostras espaçadas a 200 pés, 100 pés e 50 pés. O espaçamento de amostra de 50 pés forneceu resultados correspondentes à verdade terrestre.
Gerar mapas de calor com esta abordagem reduz o número de amostras. Utiliza a lógica abaixo nos bastidores para gerar o mapa de calor:
  - Lê o raster Sentinel fornecido.
  - As amostras do sensor precisam ser carregadas na entidade de prescrições no Azure Data Manager for Agriculture (ADMAg). O ADMAg possui uma hierarquia para manter informações de Parte, Talhão (Field), Safras, Culturas, etc. Antes de carregar as prescrições, é necessário construir a hierarquia e um `prescription_map_id`. Todas as prescrições carregadas no ADMAg estão relacionadas à hierarquia da fazenda através do `prescription_map_id`. Consulte https://learn.microsoft.com/en-us/rest/api/data-manager-for-agri/ para mais informações sobre o ADMAg.
  - Calcula índices usando o pacote python spyndex.
  - Recorta a imagem de satélite e as amostras do sensor usando o limite da fazenda.
  - Realiza interpolação espacial para encontrar pixels do raster dentro da distância de deslocamento (offset) do local da amostra e atribui o valor dos nutrientes ao grupo de pixels.
  - Classifica os dados com base no número de intervalos (bins).
  - Treina o modelo usando o classificador Random Forest.
  - Preve os nutrientes usando a imagem de satélite.
  - Gera um arquivo shapefile usando os resultados previstos.

```{mermaid}
    graph TD
    inp1>input_raster]
    inp2>samples]
    out1>result]
    tsk1{{compute_index}}
    tsk2{{soil_sample_heatmap}}
    tsk1{{compute_index}} -- index_raster/raster --> tsk2{{soil_sample_heatmap}}
    inp1>input_raster] -- raster --> tsk1{{compute_index}}
    inp2>samples] -- samples --> tsk2{{soil_sample_heatmap}}
    tsk2{{soil_sample_heatmap}} -- result --> out1>result]
```

## Fontes

- **input_raster**: Raster de entrada para o cálculo do índice.

- **samples**: Referências externas para amostras de sensores de nutrientes.

## Destinos

- **result**: Arquivo zip contendo as geometrias dos clusters.

## Parâmetros

- **attribute_name**: Nome da propriedade do nutriente no arquivo geojson de amostras do sensor. Por exemplo, CARBON (C), Nitrogen (N), Phosphorus (P), etc.

- **buffer**: Distância de deslocamento (offset) da amostra para realizar operações de interpolação com o raster.

- **index**: Tipo de índice a ser usado para gerar o mapa de calor. Por exemplo - evi, pri, etc.

- **bins**: Número possível de grupos usados para mover o valor para o grupo mais próximo usando [histograma numpy](https://numpy.org/doc/stable/reference/generated/numpy.histogram.html) e para pré-processar os dados para suportar o treinamento do modelo com classificação.

- **simplify**: Substitui pequenos polígonos na entrada pelo valor de seu vizinho maior após a conversão de raster para vetor. Aceita 'simplify', 'convex' ou 'none'.

- **tolerance**: Todas as partes de uma [geometria simplificada](https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoSeries.simplify.html) não estarão a mais do que a distância de tolerância da original. Tem as mesmas unidades do sistema de referência de coordenadas da GeoSeries. Por exemplo, usar tolerance=100 em um CRS projetado com metros como unidades significa uma distância de 100 metros na realidade.

- **data_scale**: Aceita True ou False. O padrão é False. Em True, escala os dados usando [StandardScalar] (https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html) do pacote scikit-learn. Padroniza as funcionalidades removendo a média e escalonando para a variância unitária.

- **max_depth**: A profundidade máxima da árvore. Se None, os nós são expandidos até que todas as folhas sejam puras ou até que todas as folhas contenham menos de min_samples_split amostras. Para mais detalhes, consulte (https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)

- **n_estimators**: O número de árvores na floresta. Para mais detalhes, consulte (https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)

- **random_state**: Controla tanto a aleatoriedade da amostragem (bootstrapping) das amostras usadas ao construir as árvores (se bootstrap=True) quanto a amostragem das funcionalidades a serem consideradas ao procurar a melhor divisão em cada nó (se max_features < n_features). Para mais detalhes, consulte (https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)

## Tarefas

- **compute_index**: Calcula um índice a partir das bandas de um raster de entrada.

- **soil_sample_heatmap**: Gera mapa de calor para nutrientes usando imagens de satélite ou SpaceEye.

## Fluxo de Trabalho Yaml

```yaml

name: heatmap_intermediate
sources:
  input_raster:
  - compute_index.raster
  samples:
  - soil_sample_heatmap.samples
sinks:
  result: soil_sample_heatmap.result
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
  compute_index:
    workflow: data_processing/index/index
    parameters:
      index: '@from(index)'
  soil_sample_heatmap:
    op: soil_sample_heatmap_using_classification
    op_dir: heatmap_sensor
    parameters:
      attribute_name: '@from(attribute_name)'
      buffer: '@from(buffer)'
      bins: '@from(bins)'
      simplify: '@from(simplify)'
      tolerance: '@from(tolerance)'
      data_scale: '@from(data_scale)'
      max_depth: '@from(max_depth)'
      n_estimators: '@from(n_estimators)'
      random_state: '@from(random_state)'
edges:
- origin: compute_index.index_raster
  destination:
  - soil_sample_heatmap.raster
description:
  short_description: Utiliza imagens de satélite Sentinel-2 e amostras de sensores como dados rotulados que contêm informações de nutrientes (Nitrogênio, Carbono, pH, Fósforo) para treinar um modelo usando o classificador Random Forest. A operação de inferência prevê nutrientes no solo para o limite da fazenda escolhido.
  long_description: "O fluxo de trabalho gera um mapa de calor para o nutriente selecionado. Ele depende de dados de solo de amostra que contêm informações de nutrientes. A quantidade de amostras define a precisão da geração do mapa de calor. Durante a pesquisa, foram realizados testes com amostras espaçadas a 200 pés, 100 pés e 50 pés. O espaçamento de amostra de 50 pés forneceu resultados correspondentes à verdade terrestre.\nGerar mapas de calor com esta abordagem reduz o número de amostras. Utiliza a lógica abaixo nos bastidores para gerar o mapa de calor:\n  - Lê o raster Sentinel fornecido.\n  - Amostras do sensor precisam ser carregadas na entidade de prescrições no Azure Data Manager for Agriculture (ADMAg). O ADMAg possui uma hierarquia para manter informações de Parte, Talhão, Safras, Cultura, etc. Antes de carregar as prescrições, é necessário construir a hierarquia e um `prescription_map_id`. Todas as prescrições carregadas no ADMAg estão relacionadas à hierarquia da fazenda através do `prescription_map_id`. Consulte https://learn.microsoft.com/en-us/rest/api/data-manager-for-agri/ para mais informações sobre o ADMAg.\n  - Calcula índices usando o pacote python spyndex.\n  - Recorta a imagem de satélite e as amostras do sensor usando o limite da fazenda.\n  - Realiza interpolação espacial para encontrar pixels do raster dentro da distância de deslocamento da localização da amostra e atribui o valor dos nutrientes ao grupo de pixels.\n  - Classifica os dados com base no número de intervalos.\n  - Treina o modelo usando o classificador Random Forest.\n  - Preve os nutrientes usando a imagem de satélite.\n  - Gera um arquivo shapefile usando os resultados previstos."
  sources:
    input_raster: Raster de entrada para o cálculo do índice.
    samples: Referências externas para amostras de sensores de nutrientes.
  sinks:
    result: Arquivo zip contendo as geometrias dos clusters.
  parameters:
    attribute_name: Nome da propriedade do nutriente no arquivo geojson de amostras do sensor. Por exemplo CARBON (C), Nitrogênio (N), Fósforo (P) etc.,
    buffer: Distância de deslocamento da amostra para realizar operações de interpolação com o raster.
    index: Tipo de índice a ser usado para gerar o mapa de calor. Por exemplo - evi, pri etc.,
    bins: Número possível de grupos usados para mover o valor para o grupo mais próximo usando [histograma numpy](https://numpy.org/doc/stable/reference/generated/numpy.histogram.html) e para pré-processar os dados para suportar o treinamento do modelo com classificação.
    simplify: Substitui pequenos polígonos na entrada pelo valor de seu vizinho maior após a conversão de raster para vetor. Aceita 'simplify', 'convex' ou 'none'.
    tolerance: Todas as partes de uma [geometria simplificada](https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoSeries.simplify.html) não estarão a mais do que a distância de tolerância da original. Tem as mesmas unidades do sistema de referência de coordenadas da GeoSeries. Por exemplo, usar tolerance=100 em um CRS projetado com metros como unidades significa uma distância de 100 metros na realidade.
    data_scale: Aceita True ou False. O padrão é False. Em True, escala os dados usando [StandardScalar] (https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html) do pacote scikit-learn. Padroniza as funcionalidades removendo a média e escalonando para a variância unitária.
    max_depth: A profundidade máxima da árvore. Se None, os nós são expandidos até que todas as folhas sejam puras ou até que todas as folhas contenham menos de min_samples_split amostras. Para mais detalhes, consulte (https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)
    n_estimators: O número de árvores na floresta. Para mais detalhes, consulte (https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)
    random_state: Controla tanto a aleatoriedade da amostragem das amostras usadas ao construir as árvores (se bootstrap=True) quanto a amostragem das funcionalidades a serem consideradas ao procurar a melhor divisão em cada nó (se max_features < n_features). Para mais detalhes, consulte (https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)


```
