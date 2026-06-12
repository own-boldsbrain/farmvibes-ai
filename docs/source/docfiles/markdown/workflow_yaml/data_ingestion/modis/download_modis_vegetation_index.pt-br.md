# data_ingestion/modis/download_modis_vegetation_index

Baixa produtos de índice de vegetação MODIS de 16 dias que interceptam a geometria e o intervalo de tempo informados. O fluxo de trabalho baixará os produtos no índice e resolução escolhidos. Os produtos estão disponíveis em intervalos de 16 dias e os valores dos pixels são selecionados com base em baixa nebulosidade, baixo ângulo de visão e maior valor de índice. Os valores do índice de vegetação variam de (-2000 a 10000). Para mais informações, consulte https://planetarycomputer.microsoft.com/dataset/modis-13Q1-061 e https://lpdaac.usgs.gov/products/mod13a1v061/ .

```{mermaid}
    graph TD
    inp1>user_input]
    out1>index]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- modis_products/product --> tsk2{{download}}
    inp1>user_input] -- input_data --> tsk1{{list}}
    tsk2{{download}} -- index --> out1>index]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **index**: Produtos contendo o índice escolhido na resolução selecionada.

## Parâmetros

- **index**: Índice de vegetação que deve ser baixado. Pode ser 'evi' ou 'ndvi'.

- **pc_key**: Chave da API do Planetary Computer (opcional).

- **resolution_m**: Resolução do produto, em metros. Pode ser 250 ou 500.

## Tarefas (Tasks)

- **list**: Lista produtos de vegetação MODIS para a geometria, intervalo de tempo e resolução informados.

- **download**: Baixa o raster do índice selecionado a partir do produto MODIS.

## Workflow Yaml

```yaml

name: download_modis_vegetation_index
sources:
  user_input:
  - list.input_data
sinks:
  index: download.index
parameters:
  index: null
  pc_key: null
  resolution_m: null
tasks:
  list:
    op: list_modis_vegetation
    parameters:
      resolution: '@from(resolution_m)'
  download:
    op: download_modis_vegetation
    parameters:
      pc_key: '@from(pc_key)'
      index: '@from(index)'
edges:
- origin: list.modis_products
  destination:
  - download.product
description:
  short_description: Baixa produtos de índice de vegetação MODIS de 16 dias que interceptam a geometria e o intervalo de tempo informados.
  long_description: O fluxo de trabalho baixará os produtos no índice e resolução escolhidos.
    Os produtos estão disponíveis em intervalos de 16 dias e os valores dos pixels são selecionados
    com base em baixa nebulosidade, baixo ângulo de visão e maior valor de índice. O índice de vegetação
    varia de (-2000 a 10000). Para mais informações, consulte https://planetarycomputer.microsoft.com/dataset/modis-13Q1-061
    e https://lpdaac.usgs.gov/products/mod13a1v061/ .
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    index: Produtos contendo o índice escolhido na resolução selecionada.
  parameters:
    index: Índice de vegetação que deve ser baixado. Pode ser 'evi' ou 'ndvi'.
    pc_key: Chave da API do Planetary Computer (opcional).
    resolution_m: Resolução do produto, em metros. Pode ser 250 ou 500.


```
