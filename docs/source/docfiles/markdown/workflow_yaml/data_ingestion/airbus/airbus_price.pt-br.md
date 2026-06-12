# data_ingestion/airbus/airbus_price

Calcula o preço das imagens AirBus disponíveis para a geometria de entrada e o intervalo de tempo. O fluxo de trabalho verificará as imagens disponíveis, usando a API do AirBus, que contêm a geometria de entrada dentro do intervalo de tempo informado. O preço agregado (em kB) para as imagens correspondentes será computado, descontando as imagens que já estão na biblioteca do usuário. Este fluxo de trabalho requer uma chave de API do AirBus.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>price]
    tsk1{{list}}
    tsk2{{price}}
    tsk1{{list}} -- airbus_products --> tsk2{{price}}
    inp1>user_input] -- input_item --> tsk1{{list}}
    tsk2{{price}} -- products_price --> out1>price]
```

## Fontes

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **price**: Preço de todas as imagens correspondentes.

## Parâmetros

- **api_key**: Chave de API do AirBus. Obrigatória para executar o fluxo de trabalho.

## Tarefas

- **list**: Lista produtos AirBus disponíveis para a geometria de entrada e o intervalo de tempo.

- **price**: Calcula o preço agregado (em kB) para as imagens AirBus selecionadas, descontando as imagens que já estão na biblioteca do usuário.

## Yaml do Fluxo de Trabalho

```yaml

name: airbus_price
sources:
  user_input:
  - list.input_item
sinks:
  price: price.products_price
parameters:
  api_key: null
tasks:
  list:
    op: list_airbus_products
    parameters:
      api_key: '@from(api_key)'
  price:
    op: price_airbus_products
    parameters:
      api_key: '@from(api_key)'
edges:
- origin: list.airbus_products
  destination:
  - price.airbus_products
description:
  short_description: Prices available AirBus imagery for the input geometry and time
    range.
  long_description: The workflow will check available imagery, using the AirBus API,
    that contains the input geometry inside the input time range. The aggregate price
    (in kB) for matching images will be computed, discounting images already in the
    user's library. This workflow requires an AirBus API key.
  sources:
    user_input: Time range and geometry of interest.
  sinks:
    price: Price for all matching imagery.
  parameters:
    api_key: AirBus API key. Required to run the workflow.


```