# data_ingestion/modis/download_modis_surface_reflectance

Baixa rasters de refletância de superfície MODIS de 8 dias que interceptam a geometria e o intervalo de tempo informados. O fluxo de trabalho baixará imagens raster MODIS com resolução de 250m ou 500m. Os produtos estão disponíveis em intervalos de 8 dias e os valores dos pixels são selecionados com base em baixa nebulosidade, baixo ângulo de visão e maior valor de índice. Observe que apenas as bandas 1, 2 e o controle de qualidade estão disponíveis na resolução de 250m. Para mais informações, consulte https://planetarycomputer.microsoft.com/dataset/modis-09Q1-061 e https://planetarycomputer.microsoft.com/dataset/modis-09A1-061

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- modis_products/product --> tsk2{{download}}
    inp1>user_input] -- input_data --> tsk1{{list}}
    tsk2{{download}} -- raster --> out1>raster]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **raster**: Produtos contendo bandas de refletância MODIS e dados.

## Parâmetros

- **pc_key**: Chave da API do Planetary Computer (opcional).

- **resolution_m**: Resolução do produto, em metros. Pode ser 250 ou 500.

## Tarefas (Tasks)

- **list**: Lista rasters de refletância de superfície MODIS de 8 dias que interceptam a geometria e o intervalo de tempo informados para a resolução desejada.

- **download**: Baixa os rasters de refletância de superfície MODIS.

## Workflow Yaml

```yaml

name: download_modis_surface_reflectance
sources:
  user_input:
  - list.input_data
sinks:
  raster: download.raster
parameters:
  pc_key: null
  resolution_m: null
tasks:
  list:
    op: list_modis_sr
    parameters:
      resolution: '@from(resolution_m)'
  download:
    op: download_modis_sr
    parameters:
      pc_key: '@from(pc_key)'
edges:
- origin: list.modis_products
  destination:
  - download.product
description:
  short_description: Baixa rasters de refletância de superfície MODIS de 8 dias que interceptam a geometria e o intervalo de tempo informados.
  long_description: O fluxo de trabalho baixará imagens raster MODIS com resolução de 250m
    ou 500m. Os produtos estão disponíveis em intervalos de 8 dias e os valores dos pixels
    são selecionados com base em baixa nebulosidade, baixo ângulo de visão e maior valor de índice.
    Observe que apenas as bandas 1, 2 e o controle de qualidade estão disponíveis na resolução de 250m.
    Para mais informações, consulte https://planetarycomputer.microsoft.com/dataset/modis-09Q1-061
    https://planetarycomputer.microsoft.com/dataset/modis-09A1-061
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    raster: Produtos contendo bandas de refletância MODIS e dados.
  parameters:
    pc_key: Chave da API do Planetary Computer (opcional).
    resolution_m: Resolução do produto, em metros. Pode ser 250 ou 500.


```
