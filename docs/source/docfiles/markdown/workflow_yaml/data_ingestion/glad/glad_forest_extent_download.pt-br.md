# data_ingestion/glad/glad_forest_extent_download

Baixa dados de extensão florestal do Global Land Analysis (GLAD). O fluxo de trabalho listará todos os produtos de extensão florestal GLAD que interceptam a geometria de entrada e baixará os dados para cada um deles. Os dados serão retornados como rasters.

```{mermaid}
    graph TD
    inp1>input_item]
    out1>downloaded_product]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- glad_products/glad_product --> tsk2{{download}}
    inp1>input_item] -- input_item --> tsk1{{list}}
    tsk2{{download}} -- downloaded_product --> out1>downloaded_product]
```

## Fontes (Sources)

- **input_item**: Geometria de interesse para a qual baixar os dados de extensão florestal GLAD.

## Sinks

- **downloaded_product**: Produto de extensão florestal GLAD baixado.

## Tarefas (Tasks)

- **list**: Lista produtos florestais do Global Land Analysis (GLAD) que interceptam a geometria/intervalo de tempo fornecidos pelo usuário.

- **download**: Baixa um GLADProduct.

## Workflow Yaml

```yaml

name: glad_forest_extent_download
sources:
  input_item:
  - list.input_item
sinks:
  downloaded_product: download.downloaded_product
parameters: null
tasks:
  list:
    op: list_glad_products
  download:
    op: download_glad
    op_dir: download_glad_data
edges:
- origin: list.glad_products
  destination:
  - download.glad_product
description:
  short_description: Baixa dados de extensão florestal do Global Land Analysis (GLAD).
  long_description: O fluxo de trabalho listará todos os produtos de extensão florestal GLAD
    que interceptam a geometria de entrada e baixará os dados para cada um deles. Os dados
    serão retornados como rasters.
  sources:
    input_item: Geometria de interesse para a qual baixar os dados de extensão florestal
      GLAD.
  sinks:
    downloaded_product: Produto de extensão florestal GLAD baixado.


```
