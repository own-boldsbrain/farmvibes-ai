# data_ingestion/hansen/hansen_forest_change_download

Baixa e mescla rasters de Mudança Florestal Global (Global Forest Change - Hansen) que interceptam a geometria/intervalo de tempo fornecidos pelo usuário. O fluxo de trabalho lista os produtos de Mudança Florestal Global (Hansen) que interceptam a geometria/intervalo de tempo informados, baixa os dados para cada um deles e mescla os rasters. O conjunto de dados está disponível em resolução de 30m e é atualizado anualmente. Os dados contêm informações sobre cobertura florestal, perda e ganho. A versão padrão do conjunto de dados é GFC-2022-v1.10 e é passada para o fluxo de trabalho como o parâmetro tiles_folder_url. Para a versão padrão, o conjunto de dados está disponível de 2000 a 2022. Detalhes do conjunto de dados podem ser encontrados em https://storage.googleapis.com/earthenginepartners-hansen/GFC-2022-v1.10/download.html.

```{mermaid}
    graph TD
    inp1>input_item]
    out1>merged_raster]
    out2>downloaded_raster]
    tsk1{{list}}
    tsk2{{download}}
    tsk3{{group}}
    tsk4{{merge}}
    tsk1{{list}} -- hansen_products/hansen_product --> tsk2{{download}}
    tsk2{{download}} -- raster/rasters --> tsk3{{group}}
    tsk3{{group}} -- raster_groups/raster_sequence --> tsk4{{merge}}
    inp1>input_item] -- input_item --> tsk1{{list}}
    tsk4{{merge}} -- raster --> out1>merged_raster]
    tsk2{{download}} -- raster --> out2>downloaded_raster]
```

## Fontes (Sources)

- **input_item**: Geometria e intervalo de tempo fornecidos pelo usuário.

## Sinks

- **merged_raster**: Dados de Mudança Florestal Global (Hansen) mesclados como um raster.

- **downloaded_raster**: Rasters individuais de Mudança Florestal Global (Hansen) antes da operação de mesclagem (merge).

## Parâmetros

- **layer_name**: Nome da camada de Mudança Florestal Global (Hansen). Pode ser qualquer um dos seguintes nomes: 'treecover2000', 'loss', 'gain', 'lossyear', 'datamask', 'first', 'last'.

- **tiles_folder_url**: URL para o conjunto de dados de Mudança Florestal Global (Hansen). Especifica a versão do conjunto de dados e é usada para baixar os dados.

## Tarefas (Tasks)

- **list**: Lista os produtos de Mudança Florestal Global (Hansen) que interceptam a geometria/intervalo de tempo fornecidos pelo usuário.

- **download**: Baixa os dados de Mudança Florestal Global (Hansen).

- **group**: Esta operação (op) agrupa rasters no tempo de acordo com o 'critério' (criterion).

- **merge**: Mescla rasters em uma sequência para um único raster.

## Workflow Yaml

```yaml

name: glad_forest_change_download
sources:
  input_item:
  - list.input_item
sinks:
  merged_raster: merge.raster
  downloaded_raster: download.raster
parameters:
  layer_name: null
  tiles_folder_url: https://storage.googleapis.com/earthenginepartners-hansen/GFC-2022-v1.10/
tasks:
  list:
    op: list_hansen_products
    parameters:
      tiles_folder_url: '@from(tiles_folder_url)'
      layer_name: '@from(layer_name)'
  download:
    op: download_hansen
  group:
    op: group_rasters_by_time
    parameters:
      criterion: year
  merge:
    op: merge_rasters
edges:
- origin: list.hansen_products
  destination:
  - download.hansen_product
- origin: download.raster
  destination:
  - group.rasters
- origin: group.raster_groups
  destination:
  - merge.raster_sequence
description:
  short_description: Baixa e mescla rasters de Mudança Florestal Global (Hansen) que interceptam a geometria/intervalo de tempo fornecidos pelo usuário.
  long_description: O fluxo de trabalho lista os produtos de Mudança Florestal Global (Hansen) que interceptam a geometria/intervalo de tempo fornecidos pelo usuário, baixa os dados para cada um deles e mescla os rasters. O conjunto de dados está disponível em resolução de 30m e é atualizado anualmente. Os dados contêm informações sobre cobertura florestal, perda e ganho. A versão padrão do conjunto de dados é GFC-2022-v1.10 e é passada para o fluxo de trabalho como o parâmetro tiles_folder_url. Para a versão padrão, o conjunto de dados está disponível de 2000 a 2022. Detalhes do conjunto de dados podem ser encontrados em https://storage.googleapis.com/earthenginepartners-hansen/GFC-2022-v1.10/download.html.
  sources:
    input_item: Geometria e intervalo de tempo fornecidos pelo usuário.
  sinks:
    merged_raster: Dados de Mudança Florestal Global (Hansen) mesclados como um raster.
    downloaded_raster: Rasters individuais de Mudança Florestal Global (Hansen) antes da operação de mesclagem.
  parameters:
    tiles_folder_url: URL para o conjunto de dados de Mudança Florestal Global (Hansen). Especifica a versão do conjunto de dados e é usada para baixar os dados.
    layer_name: Nome da camada de Mudança Florestal Global (Hansen). Pode ser qualquer um dos seguintes nomes: 'treecover2000', 'loss', 'gain', 'lossyear', 'datamask', 'first', 'last'.


```
