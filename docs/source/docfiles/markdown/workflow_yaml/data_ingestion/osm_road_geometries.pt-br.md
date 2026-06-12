# data_ingestion/osm_road_geometries

Baixa a geometria das estradas para a região de entrada a partir do Open Street Maps. O fluxo de trabalho baixa informações do Open Street Maps para a região-alvo e gera geometrias para as estradas que interceptam a caixa delimitadora (bounding box) da região de entrada.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>roads]
    tsk1{{download}}
    inp1>user_input] -- input_region --> tsk1{{download}}
    tsk1{{download}} -- roads --> out1>roads]
```

## Fontes (Sources)

- **user_input**: Lista de referências externas.

## Sinks

- **roads**: Coleção de geometrias com geometrias de estradas que interceptam a caixa delimitadora da região de entrada.

## Parâmetros

- **network_type**: Tipo de estradas que serão selecionadas. Um de:
  - 'drive_service': obter ruas dirigíveis, incluindo estradas de serviço.
  - 'walk': obter todas as ruas e caminhos que pedestres podem usar (este tipo de rede ignora
    a direcionalidade de mão única).
  - 'bike': obter todas as ruas e caminhos que ciclistas podem usar.
  - 'all': baixar todas as ruas e caminhos não privados do OSM (este é o tipo de rede padrão,
    a menos que você especifique um diferente).
  - 'all_private': baixar todas as ruas e caminhos do OSM, incluindo os de acesso privado.
  - 'drive': obter ruas públicas dirigíveis (mas não estradas de serviço).
Para mais informações, consulte https://osmnx.readthedocs.io/en/stable/index.html.

- **buffer_size**: Tamanho do buffer, em metros, para pesquisar nós no OSM.

## Tarefas (Tasks)

- **download**: Baixa a geometria das estradas para a região de entrada a partir do Open Street Maps.

## Workflow Yaml

```yaml

name: osm_road_geometries
sources:
  user_input:
  - download.input_region
sinks:
  roads: download.roads
parameters:
  network_type: null
  buffer_size: null
tasks:
  download:
    op: download_road_geometries
    parameters:
      network_type: '@from(network_type)'
      buffer_size: '@from(buffer_size)'
description:
  short_description: Baixa a geometria das estradas para a região de entrada a partir do Open Street Maps.
  long_description: O fluxo de trabalho baixa informações do Open Street Maps para a região-alvo
    e gera geometrias para as estradas que interceptam a caixa delimitadora da região de entrada.
  sources:
    user_input: Lista de referências externas.
  sinks:
    roads: Coleção de geometrias com geometrias de estradas que interceptam a caixa
      delimitadora da região de entrada.
  parameters:
    network_type: "Tipo de estradas que serão selecionadas. Um de:\n  - 'drive_service':\
      \ obter ruas dirigíveis, incluindo estradas de serviço.\n  - 'walk': obter todas as ruas\
      \ e caminhos que pedestres podem usar (este tipo de rede ignora\n    a direcionalidade de mão\
      \ única).\n  - 'bike': obter todas as ruas e caminhos que ciclistas podem\
      \ usar.\n  - 'all': baixar todas as ruas e caminhos não privados do OSM (este é o\
      \ tipo de rede padrão,\n    a menos que você especifique um diferente).\n  - 'all_private':\
      \ baixar todas as ruas e caminhos do OSM, incluindo os de acesso privado.\n  - 'drive':\
      \ obter ruas públicas dirigíveis (mas não estradas de serviço).\nPara mais informações,\
      \ consulte https://osmnx.readthedocs.io/en/stable/index.html."
    buffer_size: Tamanho do buffer, em metros, para pesquisar nós no OSM.


```
