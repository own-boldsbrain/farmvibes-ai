# data_ingestion/gedi/download_gedi

Baixa produtos GEDI para a região e o intervalo de tempo informados. O fluxo de trabalho baixa produtos da Investigação de Dinâmica de Ecossistemas Globais (Global Ecosystem Dynamics Investigation - GEDI) no nível de processamento desejado usando a API EarthData da NASA. Este fluxo de trabalho requer um token da API EarthData.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>product]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- gedi_products/gedi_product --> tsk2{{download}}
    inp1>user_input] -- input_data --> tsk1{{list}}
    tsk2{{download}} -- downloaded_product --> out1>product]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **product**: Produtos GEDI.

## Parâmetros

- **earthdata_token**: Token da API para a plataforma EarthData. Necessário para executar o fluxo de trabalho.

- **processing_level**: Nível de processamento do produto GEDI. Um de 'GEDI01_B.002', 'GEDI02_A.002', 'GEDI02_B.002'.

## Tarefas (Tasks)

- **list**: Lista produtos GEDI a partir da API EarthData da NASA.

- **download**: Baixa os produtos GEDI.

## Workflow Yaml

```yaml

name: download_gedi
sources:
  user_input:
  - list.input_data
sinks:
  product: download.downloaded_product
parameters:
  earthdata_token: null
  processing_level: null
tasks:
  list:
    op: list_gedi_products
    parameters:
      processing_level: '@from(processing_level)'
  download:
    op: download_gedi_product
    parameters:
      token: '@from(earthdata_token)'
edges:
- origin: list.gedi_products
  destination:
  - download.gedi_product
description:
  short_description: Baixa produtos GEDI para a região e o intervalo de tempo informados.
  long_description: O fluxo de trabalho baixa produtos da Investigação de Dinâmica de Ecossistemas Globais (GEDI) no nível de processamento desejado usando a API EarthData da NASA. Este fluxo de trabalho requer um token da API EarthData.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    product: Produtos GEDI.
  parameters:
    earthdata_token: Token da API para a plataforma EarthData. Necessário para executar o fluxo de trabalho.
    processing_level: Nível de processamento do produto GEDI. Um de 'GEDI01_B.002', 'GEDI02_A.002',
      'GEDI02_B.002'.
```