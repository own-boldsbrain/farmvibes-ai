# data_ingestion/weather/get_forecast

Baixa dados de previsão do tempo do NOAA Global Forecast System (GFS) para o intervalo de tempo de entrada. O fluxo de trabalho baixa dados de previsão global do Planetary Computer com resolução de 13 km entre os pontos da grade. O fluxo de trabalho requer um token SAS para acessar o armazenamento de blobs, que pode ser encontrado em https://planetarycomputer.microsoft.com/dataset/storage/noaa-gfs.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>forecast]
    tsk1{{preprocessing}}
    tsk2{{gfs_download}}
    tsk3{{read_forecast}}
    tsk1{{preprocessing}} -- time --> tsk2{{gfs_download}}
    tsk1{{preprocessing}} -- location --> tsk3{{read_forecast}}
    tsk2{{gfs_download}} -- global_forecast --> tsk3{{read_forecast}}
    inp1>user_input] -- user_input --> tsk1{{preprocessing}}
    tsk3{{read_forecast}} -- local_forecast --> out1>forecast]
```

## Fontes

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos

- **forecast**: Dados de previsão do tempo.

## Parâmetros

- **noaa_gfs_token**: Token SAS para acessar o armazenamento de blobs.

## Tarefas

- **preprocessing**: Obtém a data do modelo e a hora de previsão do produto mais relevantes para o dia, hora e localização de entrada fornecidos.

- **gfs_download**: Baixa a previsão global para o tempo de entrada fornecido.

- **read_forecast**: Extrai os dados locais de uma previsão global.

## Fluxo de Trabalho Yaml

```yaml

name: get_forecast
sources:
  user_input:
  - preprocessing.user_input
sinks:
  forecast: read_forecast.local_forecast
parameters:
  noaa_gfs_token: null
tasks:
  preprocessing:
    op: gfs_preprocess
    op_dir: gfs_preprocess
    parameters:
      sas_token: '@from(noaa_gfs_token)'
  gfs_download:
    op: gfs_download
    op_dir: gfs_download
    parameters:
      sas_token: '@from(noaa_gfs_token)'
  read_forecast:
    op: read_grib_forecast
    op_dir: read_grib_forecast
edges:
- origin: preprocessing.time
  destination:
  - gfs_download.time
- origin: preprocessing.location
  destination:
  - read_forecast.location
- origin: gfs_download.global_forecast
  destination:
  - read_forecast.global_forecast
description:
  short_description: Baixa dados de previsão do tempo do NOAA Global Forecast System (GFS) para o intervalo de tempo de entrada.
  long_description: O fluxo de trabalho baixa dados de previsão global do Planetary Computer com resolução de 13 km entre os pontos da grade. O fluxo de trabalho requer um token SAS para acessar o armazenamento de blobs, que pode ser encontrado em https://planetarycomputer.microsoft.com/dataset/storage/noaa-gfs.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    forecast: Dados de previsão do tempo.
  parameters:
    noaa_gfs_token: Token SAS para acessar o armazenamento de blobs.


```
