# data_ingestion/weather/download_chirps

Faz o download de dados de precipitação acumulada do conjunto de dados CHIRPS.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>product]
    tsk1{{list_chirps}}
    tsk2{{download_chirps}}
    tsk1{{list_chirps}} -- chirps_products/chirps_product --> tsk2{{download_chirps}}
    inp1>user_input] -- input_item --> tsk1{{list_chirps}}
    tsk2{{download_chirps}} -- downloaded_product --> out1>product]
```

## Origens (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos (Sinks)

- **product**: Arquivo TIFF contendo a precipitação acumulada.

## Parâmetros

- **freq**: frequências diárias ou mensais

- **res**: p05 para resolução de 0,05 graus ou p25 para resolução de 0,25 graus, p25 está disponível apenas diariamente

## Tarefas (Tasks)

- **list_chirps**: Lista produtos do conjunto de dados CHIRPS com a frequência e resolução desejadas para a geometria de entrada e o intervalo de tempo.

- **download_chirps**: Faz o download dos dados de precipitação acumulada dos produtos listados.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: chirps
sources:
  user_input:
  - list_chirps.input_item
sinks:
  product: download_chirps.downloaded_product
parameters:
  freq: daily
  res: p05
tasks:
  list_chirps:
    op: list_chirps
    parameters:
      freq: '@from(freq)'
      res: '@from(res)'
  download_chirps:
    op: download_chirps
edges:
- origin: list_chirps.chirps_products
  destination:
  - download_chirps.chirps_product
description:
  short_description: Faz o download de dados de precipitação acumulada do conjunto de dados CHIRPS.
  long_description: null
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    product: Arquivo TIFF contendo a precipitação acumulada.
  parameters:
    freq: frequências diárias ou mensais
    res: p05 para resolução de 0,05 graus ou p25 para resolução de 0,25 graus, p25
      está disponível apenas diariamente


```