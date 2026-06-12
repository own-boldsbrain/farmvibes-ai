# data_ingestion/gedi/download_gedi_rh100

Baixa produtos L2B GEDI e extrai variáveis RH100. O fluxo de trabalho baixará os produtos para a região e o intervalo de tempo de entrada e, em seguida, extrairá as variáveis RH100 para cada um dos disparos do feixe (beam shots). Cada valor é geolocalizado de acordo com os valores de latitude e longitude do modo mais baixo.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>rh100]
    tsk1{{download}}
    tsk2{{extract}}
    tsk1{{download}} -- product/gedi_product --> tsk2{{extract}}
    inp1>user_input] -- user_input --> tsk1{{download}}
    inp1>user_input] -- roi --> tsk2{{extract}}
    tsk2{{extract}} -- rh100 --> out1>rh100]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **rh100**: Pontos em EPSG:4326 com seus valores RH100 associados.

## Parâmetros

- **earthdata_token**: Token da API para a plataforma EarthData. Necessário para executar o fluxo de trabalho.

- **check_quality**: Se os pontos devem ser filtrados de acordo com a sinalização (flag) de qualidade.

## Tarefas (Tasks)

- **download**: Baixa os produtos GEDI para a região e o intervalo de tempo informados.

- **extract**: Extrai variáveis RH100 dentro da região de interesse de um GEDIProduct.

## Workflow Yaml

```yaml

name: download_gedi_rh100
sources:
  user_input:
  - download.user_input
  - extract.roi
sinks:
  rh100: extract.rh100
parameters:
  earthdata_token: null
  check_quality: null
tasks:
  download:
    workflow: data_ingestion/gedi/download_gedi
    parameters:
      earthdata_token: '@from(earthdata_token)'
  extract:
    op: extract_gedi_rh100
    parameters:
      check_quality: '@from(check_quality)'
edges:
- origin: download.product
  destination:
  - extract.gedi_product
description:
  short_description: Baixa produtos L2B GEDI e extrai variáveis RH100.
  long_description: O fluxo de trabalho baixará os produtos para a região e o intervalo de tempo
    de entrada e, em seguida, extrairá as variáveis RH100 para cada um dos disparos do feixe.
    Cada valor é geolocalizado de acordo com os valores de latitude e longitude do modo mais baixo.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    rh100: Pontos em EPSG:4326 com seus valores RH100 associados.
  parameters:
    check_quality: Se os pontos devem ser filtrados de acordo com a sinalização de qualidade.


```
