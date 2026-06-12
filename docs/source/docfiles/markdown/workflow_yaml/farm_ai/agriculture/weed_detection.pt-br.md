# farm_ai/agriculture/weed_detection

Gera arquivos shape (shapefiles) para regiões de cores semelhantes no raster de entrada. O fluxo de trabalho (workflow) recupera um raster remoto e treina um Modelo de Mistura Gaussiana (GMM - Gaussian Mixture Model) sobre um subconjunto dos dados de entrada com um número fixo de componentes. O GMM é então usado para agrupar (clusterizar) todos os pixels das imagens. As regiões agrupadas são convertidas em polígonos com um limite de tamanho mínimo. Esses polígonos são então simplificados para suavizar suas bordas. Todos os polígonos de um determinado grupo são gravados em um único shapefile. Todos os arquivos são então compactados e retornados como um único arquivo zip.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>result]
    tsk1{{download_raster}}
    tsk2{{weed_detection}}
    tsk1{{download_raster}} -- raster --> tsk2{{weed_detection}}
    inp1>user_input] -- user_input --> tsk1{{download_raster}}
    tsk2{{weed_detection}} -- result --> out1>result]
```

## Fontes (Sources)

- **user_input**: Referências externas para dados raster.

## Sinks

- **result**: Arquivo zip contendo as geometrias dos clusters.

## Parâmetros

- **buffer**: Tamanho do buffer, em CRS projetado, a ser aplicado à geometria de entrada antes da amostragem dos pontos de treinamento. Um número negativo pode ser usado para evitar a amostragem de regiões indesejadas se a geometria não for muito precisa.

- **no_data**: Valor a ser usado como nodata ao ler o raster. Usa o valor nodata interno do raster se não for fornecido.

- **clusters**: Número de clusters a serem usados ao segmentar a imagem.

- **sieve_size**: Área da região conectada mínima. Regiões menores terão sua classe atribuída à maior região adjacente.

- **simplify**: Método usado para simplificar as geometrias. Aceita 'none', para nenhuma simplificação, 'simplify', para simplificação baseada em tolerância, e 'convex', para retornar o invólucro convexo (convex hull).

- **tolerance**: Tolerância para o algoritmo de simplificação. Aplicável apenas se o método de simplificação for 'simplify'.

- **samples**: Número de amostras (samples) a serem usadas durante o treinamento.

- **bands**: Lista de índices de bandas a serem usados durante o treinamento e inferência.

- **alpha_index**: Índice positivo da banda alfa, se usada para filtrar valores nodata.

## Tarefas (Tasks)

- **download_raster**: Adiciona rasters do usuário no armazenamento do cluster, permitindo que sejam usados em fluxos de trabalho.

- **weed_detection**: Treina um Modelo de Mistura Gaussiana (GMM), agrupa todos os pixels das imagens e converte as regiões agrupadas em polígonos.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: weed_detection
sources:
  user_input:
  - download_raster.user_input
sinks:
  result: weed_detection.result
parameters:
  buffer: null
  no_data: null
  clusters: null
  sieve_size: null
  simplify: null
  tolerance: null
  samples: null
  bands: null
  alpha_index: null
tasks:
  download_raster:
    workflow: data_ingestion/user_data/ingest_raster
  weed_detection:
    op: weed_detection
    parameters:
      buffer: '@from(buffer)'
      no_data: '@from(no_data)'
      clusters: '@from(clusters)'
      sieve_size: '@from(sieve_size)'
      simplify: '@from(simplify)'
      tolerance: '@from(tolerance)'
      samples: '@from(samples)'
      bands: '@from(bands)'
      alpha_index: '@from(alpha_index)'
edges:
- origin: download_raster.raster
  destination:
  - weed_detection.raster
description:
  short_description: Gera arquivos shape para regiões de cores semelhantes no raster de entrada.
  long_description: O fluxo de trabalho recupera um raster remoto e treina um Modelo de Mistura Gaussiana (GMM) sobre um subconjunto dos dados de entrada com um número fixo de componentes. O GMM é então usado para agrupar todos os pixels das imagens. As regiões agrupadas são convertidas em polígonos com um limite de tamanho mínimo. Esses polígonos são então simplificados para suavizar suas bordas. Todos os polígonos de um determinado grupo são gravados em um único shapefile. Todos os arquivos são então compactados e retornados como um único arquivo zip.
  sources:
    user_input: Referências externas para dados raster.
  sinks:
    result: Arquivo zip contendo as geometrias dos clusters.
  parameters:
    buffer: Tamanho do buffer, em CRS projetado, a ser aplicado à geometria de entrada antes da amostragem dos pontos de treinamento. Um número negativo pode ser usado para evitar a amostragem de regiões indesejadas se a geometria não for muito precisa.
    no_data: Valor a ser usado como nodata ao ler o raster. Usa o valor nodata interno do raster se não for fornecido.
    clusters: Número de clusters a serem usados ao segmentar a imagem.
    sieve_size: Área da região conectada mínima. Regiões menores terão sua classe atribuída à maior região adjacente.
    simplify: Método usado para simplificar as geometrias. Aceita 'none', para nenhuma simplificação, 'simplify', para simplificação baseada em tolerância, e 'convex', para retornar o invólucro convexo.
    tolerance: Tolerância para o algoritmo de simplificação. Aplicável apenas se o método de simplificação for 'simplify'.
    samples: Número de amostras a serem usadas durante o treinamento.
    bands: Lista de índices de bandas a serem usados durante o treinamento e inferência.
    alpha_index: Índice positivo da banda alfa, se usada para filtrar valores nodata.


```