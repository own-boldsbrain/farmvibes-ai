# data_ingestion/soil/usda

Faz o download do raster de classificação de solos do USDA. O fluxo de trabalho baixará um raster global com as classes de solo do USDA com resolução de 1/30 de grau.

```{mermaid}
    graph TD
    inp1>input_item]
    out1>downloaded_raster]
    tsk1{{datavibe_filter}}
    tsk2{{download_usda_soils}}
    tsk1{{datavibe_filter}} -- output_item/input_item --> tsk2{{download_usda_soils}}
    inp1>input_item] -- input_item --> tsk1{{datavibe_filter}}
    tsk2{{download_usda_soils}} -- downloaded_raster --> out1>downloaded_raster]
```

## Origens (Sources)

- **input_item**: Entrada fictícia (dummy input).

## Destinos (Sinks)

- **downloaded_raster**: Raster com as classes de solo do USDA.

## Parâmetros

- **ignore**: Seleção de quais campos do item de entrada devem ser ignorados (entre "time_range", "geometry" ou "all" para ambos).

## Tarefas (Tasks)

- **datavibe_filter**: Filtra informações de intervalo de tempo e/ou geometria do item de entrada.

- **download_usda_soils**: Faz o download de um raster global com classes de solo do USDA com resolução de 1/30 de grau.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: usda_soils
sources:
  input_item:
  - datavibe_filter.input_item
sinks:
  downloaded_raster: download_usda_soils.downloaded_raster
parameters:
  ignore: all
tasks:
  datavibe_filter:
    op: datavibe_filter
    parameters:
      filter_out: '@from(ignore)'
  download_usda_soils:
    op: download_usda_soils
edges:
- origin: datavibe_filter.output_item
  destination:
  - download_usda_soils.input_item
description:
  short_description: Faz o download do raster de classificação de solos do USDA.
  long_description: O fluxo de trabalho baixará um raster global com as classes de
    solo do USDA com resolução de 1/30 de grau.
  sources:
    input_item: Entrada fictícia.
  sinks:
    downloaded_raster: Raster com as classes de solo do USDA.
  parameters:
    ignore: Seleção de quais campos do item de entrada devem ser ignorados (entre
      "time_range", "geometry" ou "all" para ambos).


```