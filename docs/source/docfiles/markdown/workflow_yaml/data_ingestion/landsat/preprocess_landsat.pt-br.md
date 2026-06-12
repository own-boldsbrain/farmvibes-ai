# data_ingestion/landsat/preprocess_landsat

Baixa e pré-processa blocos (tiles) do LANDSAT que interceptam a geometria e o intervalo de tempo informados. O fluxo de trabalho baixará as bandas dos blocos do Planetary Computer e as empilhará (stack) em um único raster com resolução de 30m.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    tsk1{{list}}
    tsk2{{download}}
    tsk3{{stack}}
    tsk1{{list}} -- landsat_products/landsat_product --> tsk2{{download}}
    tsk2{{download}} -- downloaded_product/landsat_product --> tsk3{{stack}}
    inp1>user_input] -- input_item --> tsk1{{list}}
    tsk3{{stack}} -- landsat_raster --> out1>raster]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **raster**: Rasters do LANDSAT com resolução de 30m.

## Parâmetros

- **pc_key**: Chave da API do Planetary Computer (opcional).

- **qa_mask_value**: Mapa de bits para determinar quais pixels devem ser incluídos. Consulte a documentação de cada bit em https://www.usgs.gov/media/images/landsat-collection-2-pixel-quality-assessment-bit-index. Por exemplo, o valor padrão 64 (ou seja, 1<<6) corresponde a pixels "Limpos" (Clear).

## Tarefas (Tasks)

- **list**: Lista os blocos do LANDSAT que interceptam a geometria e o intervalo de tempo informados.

- **download**: Baixa as bandas dos blocos do LANDSAT a partir do produto.

- **stack**: Empilha as bandas baixadas em um único raster.

## Workflow Yaml

```yaml

name: preprocess_landsat
sources:
  user_input:
  - list.input_item
sinks:
  raster: stack.landsat_raster
parameters:
  pc_key: null
  qa_mask_value: 64
tasks:
  list:
    op: list_landsat_products_pc
  download:
    op: download_landsat_from_pc
    parameters:
      api_key: '@from(pc_key)'
  stack:
    op: stack_landsat
    parameters:
      qa_mask_value: '@from(qa_mask_value)'
edges:
- origin: list.landsat_products
  destination:
  - download.landsat_product
- origin: download.downloaded_product
  destination:
  - stack.landsat_product
description:
  short_description: Baixa e pré-processa blocos do LANDSAT que interceptam a geometria e o intervalo de tempo informados.
  long_description: O fluxo de trabalho baixará as bandas dos blocos do Planetary Computer
    e as empilhará em um único raster com resolução de 30m.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    raster: Rasters do LANDSAT com resolução de 30m.
  parameters:
    pc_key: Chave da API do Planetary Computer (opcional).
    qa_mask_value: Mapa de bits para determinar quais pixels devem ser incluídos.
      Consulte a documentação de cada bit em https://www.usgs.gov/media/images/landsat-collection-2-pixel-quality-assessment-bit-index.
      Por exemplo, o valor padrão 64 (ou seja, 1<<6) corresponde a pixels "Limpos" (Clear).


```
