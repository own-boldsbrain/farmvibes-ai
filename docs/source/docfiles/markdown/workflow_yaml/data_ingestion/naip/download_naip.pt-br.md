# data_ingestion/naip/download_naip

Baixa blocos (tiles) do NAIP que interceptam a geometria e o intervalo de tempo informados.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- naip_products/input_product --> tsk2{{download}}
    inp1>user_input] -- input_item --> tsk1{{list}}
    tsk2{{download}} -- downloaded_product --> out1>raster]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **raster**: Blocos do NAIP.

## Parâmetros

- **pc_key**: Chave da API do Planetary Computer (opcional).

## Tarefas (Tasks)

- **list**: Lista os blocos do NAIP que interceptam a geometria e o intervalo de tempo informados.

- **download**: Baixa o raster NAIP a partir do produto NAIP.

## Workflow Yaml

```yaml

name: download_naip
sources:
  user_input:
  - list.input_item
sinks:
  raster: download.downloaded_product
parameters:
  pc_key: null
tasks:
  list:
    op: list_naip_products
  download:
    op: download_naip
    parameters:
      api_key: '@from(pc_key)'
edges:
- origin: list.naip_products
  destination:
  - download.input_product
description:
  short_description: Baixa blocos do NAIP que interceptam a geometria e o intervalo de tempo informados.
  long_description: null
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    raster: Blocos do NAIP.
  parameters:
    pc_key: Chave da API do Planetary Computer (opcional).


```
