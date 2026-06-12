# data_ingestion/weather/get_ambient_weather

Baixa dados meteorológicos de uma estação Ambient Weather. O fluxo de trabalho se conecta à API REST da Ambient Weather e solicita dados para o intervalo de tempo de entrada. A geometria de entrada será usada para encontrar um dispositivo dentro da região. Se nenhum dispositivo for encontrado na geometria, o fluxo de trabalho falhará. A conexão com a API requer uma chave de API (API key) e uma chave de Aplicativo (App key).

```{mermaid}
    graph TD
    inp1>user_input]
    out1>weather]
    tsk1{{get_weather}}
    inp1>user_input] -- user_input --> tsk1{{get_weather}}
    tsk1{{get_weather}} -- weather --> out1>weather]
```

## Fontes

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos

- **weather**: Dados meteorológicos da estação.

## Parâmetros

- **api_key**: Chave de API da Ambient Weather.

- **app_key**: Chave de Aplicativo da Ambient Weather.

- **limit**: Número máximo de pontos de dados. Se -1, não limita.

- **feed_interval**: Intervalo entre as amostras. Definido pela estação meteorológica.

## Tarefas

- **get_weather**: Conecta-se à API REST da Ambient Weather e solicita dados meteorológicos para o intervalo de tempo de entrada das estações dentro da geometria de entrada.

## Fluxo de Trabalho Yaml

```yaml

name: get_ambient_weather
sources:
  user_input:
  - get_weather.user_input
sinks:
  weather: get_weather.weather
parameters:
  api_key: null
  app_key: null
  limit: -1
  feed_interval: null
tasks:
  get_weather:
    op: download_ambient_weather
    op_dir: download_ambient_weather
    parameters:
      api_key: '@from(api_key)'
      app_key: '@from(app_key)'
      limit: '@from(limit)'
      feed_interval: '@from(feed_interval)'
edges: null
description:
  short_description: Baixa dados meteorológicos de uma estação Ambient Weather.
  long_description: O fluxo de trabalho se conecta à API REST da Ambient Weather e solicita dados para o intervalo de tempo de entrada. A geometria de entrada será usada para encontrar um dispositivo dentro da região. Se nenhum dispositivo for encontrado na geometria, o fluxo de trabalho falhará. A conexão com a API requer uma chave de API e uma chave de Aplicativo.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    weather: Dados meteorológicos da estação.
  parameters:
    api_key: Chave de API da Ambient Weather.
    app_key: Chave de Aplicativo da Ambient Weather.
    limit: Número máximo de pontos de dados. Se -1, não limita.
    feed_interval: Intervalo entre as amostras. Definido pela estação meteorológica.


```
