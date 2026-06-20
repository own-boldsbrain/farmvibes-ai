# farm_ai/agriculture/heatmap_using_neighboring_data_points

Cria um mapa de calor (heatmap) usando os vizinhos por meio da realização de operações de interpolação espacial. Ele utiliza informações de solo coletadas em locais ideais de sensores/amostras e imagens de satélite Sentinel baixadas. A localização ideal das amostras de nutrientes é identificada usando o fluxo de trabalho <farm_ai/sensor/optimal_locations>. A quantidade de amostras define a precisão da geração do mapa de calor. Durante a pesquisa, foram realizados testes em uma fazenda de 100 acres usando contagens de amostras de aproximadamente 20, 80, 130, 600. A pesquisa concluiu que uma contagem de 20 amostras forneceu resultados satisfatórios, e também que a precisão das informações de nutrientes melhorou com o aumento da contagem de amostras.

```{mermaid}
    graph TD
    inp1>input_raster]
    inp2>input_samples]
    inp3>input_sample_clusters]
    out1>result]
    tsk1{{download_samples}}
    tsk2{{download_sample_clusters}}
    tsk3{{soil_sample_heatmap}}
    tsk1{{download_samples}} -- geometry/samples --> tsk3{{soil_sample_heatmap}}
    tsk2{{download_sample_clusters}} -- geometry/samples_boundary --> tsk3{{soil_sample_heatmap}}
    inp1>input_raster] -- raster --> tsk3{{soil_sample_heatmap}}
    inp2>input_samples] -- user_input --> tsk1{{download_samples}}
    inp3>input_sample_clusters] -- user_input --> tsk2{{download_sample_clusters}}
    tsk3{{soil_sample_heatmap}} -- result --> out1>result]
```

## Fontes (Sources)

- **input_raster**: Raster do Sentinel-2.

- **input_samples**: Amostras de sensores com informações de nutrientes.

- **input_sample_clusters**: Limites dos clusters das localizações das amostras dos sensores.

## Sinks

- **result**: Arquivo zip contendo a saída do mapa de calor como arquivos shape (shapefiles).

## Parâmetros

- **attribute_name**: Nome da propriedade do nutriente no arquivo geojson de amostras do sensor. Por exemplo: CARBON (C), Nitrogen (N), Phosphorus (P) etc.

- **simplify**: Substitui polígonos pequenos na entrada pelo valor de seu maior vizinho após a conversão de raster para vetor. Aceita 'simplify', 'convex' ou 'none'.

- **tolerance**: Todas as partes de uma [geometria simplificada](https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoSeries.simplify.html) não estarão a mais do que a distância de tolerância da original. Possui as mesmas unidades do sistema de referência de coordenadas (CRS) da GeoSeries. Por exemplo, usar tolerance=100 em um CRS projetado com metros como unidades significa uma distância de 100 metros na realidade.

- **algorithm**: Algoritmo usado para identificar os vizinhos mais próximos. Aceita 'cluster overlap', 'nearest neighbor' ou 'kriging neighbor'.

- **resolution**: Define a resolução de saída como a proporção da resolução do raster de entrada. Por exemplo, se a resolução for 5, o mapa de calor de saída será 5 vezes mais grosseiro que o raster de entrada.

- **bins**: Define o número de intervalos (bins) de largura igual na faixa fornecida. Consulte este artigo para saber mais sobre bins: <https://numpy.org/doc/stable/reference/generated/numpy.histogram.html>

## Tarefas (Tasks)

- **download_samples**: Adiciona geometrias do usuário no armazenamento do cluster, permitindo que sejam usadas em fluxos de trabalho.

- **download_sample_clusters**: Adiciona geometrias do usuário no armazenamento do cluster, permitindo que sejam usadas em fluxos de trabalho.

- **soil_sample_heatmap**: Gera mapa de calor para nutrientes usando imagens de satélite ou SpaceEye.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: heatmap_using_neighboring_data_points
sources:
  input_raster:
  - soil_sample_heatmap.raster
  input_samples:
  - download_samples.user_input
  input_sample_clusters:
  - download_sample_clusters.user_input
sinks:
  result: soil_sample_heatmap.result
parameters:
  attribute_name: null
  simplify: null
  tolerance: null
  algorithm: null
  resolution: null
  bins: null
tasks:
  download_samples:
    workflow: data_ingestion/user_data/ingest_geometry
  download_sample_clusters:
    workflow: data_ingestion/user_data/ingest_geometry
  soil_sample_heatmap:
    op: soil_sample_heatmap_using_neighbors
    op_dir: heatmap_sensor
    parameters:
      attribute_name: '@from(attribute_name)'
      simplify: '@from(simplify)'
      tolerance: '@from(tolerance)'
      algorithm: '@from(algorithm)'
      resolution: '@from(resolution)'
      bins: '@from(bins)'
edges:
- origin: download_samples.geometry
  destination:
  - soil_sample_heatmap.samples
- origin: download_sample_clusters.geometry
  destination:
  - soil_sample_heatmap.samples_boundary
description:
  short_description: Cria um mapa de calor usando os vizinhos por meio da realização de operações de interpolação espacial. Ele utiliza informações de solo coletadas em locais ideais de sensores/amostras e imagens de satélite Sentinel baixadas.
  long_description: A localização ideal das amostras de nutrientes é identificada usando o fluxo de trabalho <farm_ai/sensor/optimal_locations>. A quantidade de amostras define a precisão da geração do mapa de calor. Durante a pesquisa, foram realizados testes em uma fazenda de 100 acres usando contagens de amostras de aproximadamente 20, 80, 130, 600. A pesquisa concluiu que uma contagem de 20 amostras forneceu resultados satisfatórios, e também que a precisão das informações de nutrientes melhorou com o aumento da contagem de amostras.
  sources:
    input_raster: Raster do Sentinel-2.
    input_samples: Amostras de sensores com informações de nutrientes.
    input_sample_clusters: Limites dos clusters das localizações das amostras dos sensores.
  sinks:
    result: Arquivo zip contendo a saída do mapa de calor como arquivos shape.
  parameters:
    attribute_name: 'Nome da propriedade do nutriente no arquivo geojson de amostras do sensor. Por exemplo: CARBON (C), Nitrogen (N), Phosphorus (P) etc.'
    simplify: Substitui polígonos pequenos na entrada pelo valor de seu maior vizinho após a conversão de raster para vetor. Aceita 'simplify', 'convex' ou 'none'.
    tolerance: Todas as partes de uma [geometria simplificada](https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoSeries.simplify.html) não estarão a mais do que a distância de tolerância da original. Possui as mesmas unidades do sistema de referência de coordenadas da GeoSeries. Por exemplo, usar tolerance=100 em um CRS projetado com metros como unidades significa uma distância de 100 metros na realidade.
    algorithm: Algoritmo usado para identificar os vizinhos mais próximos. Aceita 'cluster overlap', 'nearest neighbor' ou 'kriging neighbor'.
    resolution: Define a resolução de saída como a proporção da resolução do raster de entrada. Por exemplo, se a resolução for 5, o mapa de calor de saída será 5 vezes mais grosseiro que o raster de entrada.
    bins: Define o número de intervalos de largura igual na faixa fornecida. Consulte este artigo para saber mais sobre bins: https://numpy.org/doc/stable/reference/generated/numpy.histogram.html


```
