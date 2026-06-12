# data_ingestion/weather/download_era5

Variáveis meteorológicas estimadas horárias. Variáveis meteorológicas horárias obtidas a partir da combinação de observações e execuções de modelos numéricos para estimar o estado da atmosfera.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>downloaded_product]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- era5_products/era5_product --> tsk2{{download}}
    inp1>user_input] -- input_item --> tsk1{{list}}
    tsk2{{download}} -- downloaded_product --> out1>downloaded_product]
```

## Fontes

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos

- **downloaded_product**: Variáveis meteorológicas com resolução de 30 km.

## Parâmetros

- **pc_key**: Chave de API opcional do Planetary Computer.

- **variable**: As opções são:
  2t - Temperatura a 2 metros (padrão)
  100u - Componente U do vento a 100 metros
  100v - Componente V do vento a 100 metros
  10u - Componente U do vento a 10 metros
  10v - Componente V do vento a 10 metros
  2d - Temperatura do ponto de orvalho a 2 metros
  mn2t - Temperatura mínima a 2 metros desde o pós-processamento anterior
  msl - Pressão média ao nível do mar
  mx2t - Temperatura máxima a 2 metros desde o pós-processamento anterior
  sp - Pressão à superfície
  ssrd - Radiação solar de superfície descendente
  sst - Temperatura da superfície do mar
  tp - Precipitação total

## Tarefas

- **list**: Lista produtos ERA5 para a geometria e o intervalo de tempo de entrada.

- **download**: Baixa a propriedade solicitada dos produtos ERA5.

## Fluxo de Trabalho Yaml

```yaml

name: download_era5
sources:
  user_input:
  - list.input_item
sinks:
  downloaded_product: download.downloaded_product
parameters:
  pc_key: null
  variable: 2t
tasks:
  list:
    op: list_era5
    parameters:
      variable: '@from(variable)'
  download:
    op: download_era5
    parameters:
      api_key: '@from(pc_key)'
edges:
- origin: list.era5_products
  destination:
  - download.era5_product
description:
  short_description: Variáveis meteorológicas estimadas horárias.
  long_description: Variáveis meteorológicas horárias obtidas a partir da combinação de observações e execuções de modelos numéricos para estimar o estado da atmosfera.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    downloaded_product: Variáveis meteorológicas com resolução de 30 km.
  parameters:
    pc_key: Chave de API opcional do Planetary Computer.
    variable: "As opções são:\n  2t - Temperatura a 2 metros (padrão)\n  100u - Componente U do vento a 100 metros\n  100v - Componente V do vento a 100 metros\n  10u - Componente U do vento a 10 metros\n  10v - Componente V do vento a 10 metros\n  2d - Temperatura do ponto de orvalho a 2 metros\n  mn2t - Temperatura mínima a 2 metros desde o pós-processamento anterior\n  msl - Pressão média ao nível do mar\n  mx2t - Temperatura máxima a 2 metros desde o pós-processamento anterior\n  sp - Pressão à superfície\n  ssrd - Radiação solar de superfície descendente\n  sst - Temperatura da superfície do mar\n  tp - Precipitação total"


```
