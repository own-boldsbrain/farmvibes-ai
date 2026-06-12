# data_ingestion/weather/download_herbie

Baixa dados de previsão para a localização e intervalo de tempo fornecidos usando o pacote python Herbie. Herbie é um pacote python que baixa saídas de modelos de Previsão Numérica do Tempo (NWP) recentes e arquivados de diferentes fontes de arquivos na nuvem. Sua funcionalidade mais popular é baixar dados do modelo HRRR. Os dados NWP no formato GRIB2 podem ser lidos com xarray+cfgrib. Os dados de modelos que o Herbie pode recuperar incluem o High Resolution Rapid Refresh (HRRR), Rapid Refresh (RAP), Global Forecast System (GFS), National Blend of Models (NBM), Rapid Refresh Forecast System - Prototype (RRFS) e produtos de previsão de dados abertos do ECMWF (ECMWF).

```{mermaid}
    graph TD
    inp1>user_input]
    out1>forecast]
    tsk1{{list_herbie}}
    tsk2{{download_herbie}}
    tsk1{{list_herbie}} -- product/herbie_product --> tsk2{{download_herbie}}
    inp1>user_input] -- input_item --> tsk1{{list_herbie}}
    tsk2{{download_herbie}} -- forecast --> out1>forecast]
```

## Fontes

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos

- **forecast**: Arquivo GRIB com a previsão solicitada.

## Parâmetros

- **model**: Nome do modelo conforme definido na pasta de templates de modelos. INSENSÍVEL A MAIÚSCULAS/MINÚSCULAS. Abaixo estão exemplos de tipos de modelos: 'hrrr' (modelo HRRR Estados Unidos contíguos), 'hrrrak' (modelo HRRR Alasca, alias 'alaska'), 'rap' (modelo RAP), 'gfs' (Sistema de Previsão Global - atmosfera), 'gfs_wave' (Sistema de Previsão Global - ondas), 'rrfs' (protótipo do Rapid Refresh Forecast System). Para mais informações, consulte https://herbie.readthedocs.io/en/latest/user_guide/model_info.html

- **product**: Tipo de arquivo do produto da variável de saída (sfc (campos de superfície), prs (campos de pressão), nat (campos nativos), subh (campos sub-horários)). Não especificar isso usará o primeiro produto no arquivo de template do modelo.

- **frequency**: frequência em horas da previsão.

- **forecast_lead_times**: Lead time (tempo de antecedência) da previsão no formato [hora_inicial, hora_final, incremento] (em horas). Este parâmetro pode ser nulo (None) e, neste caso, consulte o parâmetro 'forecast_start_date' para mais detalhes. Você não pode especificar 'forecast_lead_times' e 'forecast_start_date' ao mesmo tempo.

- **forecast_start_date**: última data/hora (no formato "%Y-%m-%d %H:%M") para a qual as análises (lead time zero) são recuperadas. Após esta data/hora, são recuperadas previsões com lead times progressivamente crescentes. Se este parâmetro for definido como nulo e 'forecast_lead_times' também for definido como nulo, o fluxo de trabalho retornará a análise (lead time zero) até a análise mais recente disponível e, a partir desse ponto, retornará as previsões com lead times progressivamente crescentes.

- **search_text**: É uma expressão regular usada para pesquisar em arquivos de índice GRIB2 e permitir que você baixe apenas a camada do arquivo necessária em vez do arquivo completo. Para mais informações sobre search_text, consulte a URL abaixo. https://blaylockbk.github.io/Herbie/_build/html/user_guide/searchString.html

## Tarefas

- **list_herbie**: Lista produtos do Herbie.

- **download_herbie**: Baixa arquivos GRIB do Herbie.

## Fluxo de Trabalho Yaml

```yaml

name: download_herbie
sources:
  user_input:
  - list_herbie.input_item
sinks:
  forecast: download_herbie.forecast
parameters:
  model: hrrr
  product: null
  frequency: 1
  forecast_lead_times: null
  forecast_start_date: null
  search_text: :TMP:2 m
tasks:
  list_herbie:
    op: list_herbie
    parameters:
      model: '@from(model)'
      product: '@from(product)'
      frequency: '@from(frequency)'
      forecast_lead_times: '@from(forecast_lead_times)'
      forecast_start_date: '@from(forecast_start_date)'
      search_text: '@from(search_text)'
  download_herbie:
    op: download_herbie
edges:
- origin: list_herbie.product
  destination:
  - download_herbie.herbie_product
description:
  short_description: Baixa dados de previsão para a localização e intervalo de tempo fornecidos usando o pacote python Herbie.
  long_description: Herbie é um pacote python que baixa saídas de modelos de Previsão Numérica do Tempo (NWP) recentes e arquivados de diferentes fontes de arquivos na nuvem. Sua funcionalidade mais popular é baixar dados do modelo HRRR. Os dados NWP no formato GRIB2 podem ser lidos com xarray+cfgrib. Os dados de modelos que o Herbie pode recuperar incluem o High Resolution Rapid Refresh (HRRR), Rapid Refresh (RAP), Global Forecast System (GFS), National Blend of Models (NBM), Rapid Refresh Forecast System - Prototype (RRFS) e produtos de previsão de dados abertos do ECMWF (ECMWF).
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    forecast: Arquivo Grib com a previsão solicitada.
  parameters:
    model: Nome do modelo conforme definido na pasta de templates de modelos. INSENSÍVEL A MAIÚSCULAS/MINÚSCULAS. Abaixo estão exemplos de tipos de modelos 'hrrr' HRRR Estados Unidos contíguos 'hrrrak' HRRR Alasca (alias 'alaska') 'rap' modelo RAP 'gfs' Sistema de Previsão Global (atmosfera) 'gfs_wave' Sistema de Previsão Global (ondas) 'rrfs' protótipo do Rapid Refresh Forecast System para mais informações veja https://herbie.readthedocs.io/en/latest/user_guide/model_info.html
    product: Tipo de arquivo do produto da variável de saída (sfc (campos de superfície), prs (campos de pressão), nat (campos nativos), subh (campos sub-horários)). Não especificar isso usará o primeiro produto no arquivo de template do modelo.
    frequency: frequência em horas da previsão
    forecast_lead_times: Lead time da previsão no formato [hora_inicial, hora_final, incremento] (em horas). Este parâmetro pode ser nulo, e neste caso veja o parâmetro 'forecast_start_date' para mais detalhes. Você não pode especificar 'forecast_lead_times' e 'forecast_start_date' ao mesmo tempo.
    forecast_start_date: última data/hora (no formato "%Y-%m-%d %H:%M") para a qual as análises (lead time zero) são recuperadas. Após esta data/hora, previsões com lead times progressivamente crescentes são recuperadas. Se este parâmetro for definido como nulo e 'forecast_lead_times' também for definido como nulo, então o fluxo de trabalho retorna a análise (lead time zero) até a análise mais recente disponível, e a partir desse ponto retorna as previsões com lead times progressivamente crescentes.
    search_text: É uma expressão regular usada para pesquisar em arquivos de índice GRIB2 e permitir que você baixe apenas a camada do arquivo necessária em vez do arquivo completo. Para mais informações sobre search_text veja a url abaixo. https://blaylockbk.github.io/Herbie/_build/html/user_guide/searchString.html


```
