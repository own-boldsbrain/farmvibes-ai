# data_ingestion/weather/herbie_forecast

Baixa observações de previsão para a localização e intervalo de tempo fornecidos usando o pacote python Herbie. Herbie é um pacote python que baixa saídas de modelos de Previsão Numérica do Tempo (NWP) recentes e arquivados de diferentes fontes de arquivos na nuvem. Sua funcionalidade mais popular é baixar dados do modelo HRRR. Os dados NWP no formato GRIB2 podem ser lidos com xarray+cfgrib. Os dados de modelos que o Herbie pode recuperar incluem o High Resolution Rapid Refresh (HRRR), Rapid Refresh (RAP), Global Forecast System (GFS), National Blend of Models (NBM), Rapid Refresh Forecast System - Prototype (RRFS) e produtos de previsão de dados abertos do ECMWF (ECMWF).

```{mermaid}
    graph TD
    inp1>user_input]
    out1>weather_forecast]
    out2>forecast_range]
    tsk1{{forecast_range}}
    tsk2{{forecast_download}}
    tsk1{{forecast_range}} -- download_period/user_input --> tsk2{{forecast_download}}
    inp1>user_input] -- user_input --> tsk1{{forecast_range}}
    tsk2{{forecast_download}} -- weather_forecast --> out1>weather_forecast]
    tsk1{{forecast_range}} -- download_period --> out2>forecast_range]
```

## Fontes

- **user_input**: Intervalo de tempo e geometria de interesse.

## Destinos

- **weather_forecast**: Observações de previsão baixadas, limpas, interpoladas e mapeadas para cada hora.

- **forecast_range**: Intervalo de tempo das observações de previsão.

## Parâmetros

- **forecast_lead_times**: Ajuda a definir o lead time (tempo de antecedência) da previsão em horas. Aceita a entrada no formato de intervalo (range). Exemplo - (1, 25, 1). Para mais informações, consulte a URL abaixo. https://blaylockbk.github.io/Herbie/_build/html/reference_guide/_autosummary/herbie.archive.Herbie.html

- **search_text**: É uma expressão regular usada para pesquisar em arquivos de índice GRIB2 e permitir que você baixe apenas a camada do arquivo necessária em vez do arquivo completo. Para mais informações sobre search_text, consulte a URL abaixo. https://blaylockbk.github.io/Herbie/_build/html/user_guide/searchString.html

- **weather_type**: É um texto preferido pelo usuário para representar o tipo de parâmetro climático (temperatura, umidade, velocidade do vento, etc.). Isso é usado como nome da coluna para a saída retornada pelo operador.

- **model**: Nome do modelo conforme definido na pasta de templates de modelos. INSENSÍVEL A MAIÚSCULAS/MINÚSCULAS. Abaixo estão exemplos de tipos de modelos: 'hrrr' (modelo HRRR dos Estados Unidos contíguos), 'hrrrak' (modelo HRRR do Alasca, codinome 'alaska'), 'rap' (modelo RAP), 'gfs' (Sistema de Previsão Global - atmosfera), 'gfs_wave' (Sistema de Previsão Global - ondas), 'rrfs' (protótipo do Rapid Refresh Forecast System).

- **overwrite**: Se verdadeiro, procura o arquivo GRIB2 mesmo que a cópia local exista. Se falso, usa a cópia local.

- **product**: Tipo de arquivo do produto da variável de saída (sfc (campos de superfície), prs (campos de pressão), nat (campos nativos), subh (campos sub-horários)). Não especificar isso usará o primeiro produto no arquivo de template do modelo.

## Tarefas

- **forecast_range**: Divide o intervalo de tempo de entrada de acordo com a frequência e o número de horas no lead time.

- **forecast_download**: Baixa observações de previsão com o Herbie.

## Fluxo de Trabalho Yaml

```yaml

name: forecast_weather
sources:
  user_input:
  - forecast_range.user_input
sinks:
  weather_forecast: forecast_download.weather_forecast
  forecast_range: forecast_range.download_period
parameters:
  forecast_lead_times: null
  search_text: null
  weather_type: null
  model: null
  overwrite: null
  product: null
tasks:
  forecast_range:
    op: forecast_range_split
    op_dir: download_herbie
    parameters:
      forecast_lead_times: '@from(forecast_lead_times)'
      weather_type: '@from(weather_type)'
  forecast_download:
    op: forecast_weather
    op_dir: download_herbie
    parameters:
      model: '@from(model)'
      overwrite: '@from(overwrite)'
      product: '@from(product)'
      forecast_lead_times: '@from(forecast_lead_times)'
      search_text: '@from(search_text)'
      weather_type: '@from(weather_type)'
edges:
- origin: forecast_range.download_period
  destination:
  - forecast_download.user_input
description:
  short_description: Baixa observações de previsão para a localização e intervalo de tempo fornecidos usando o pacote python Herbie.
  long_description: Herbie é um pacote python que baixa saídas de modelos de Previsão Numérica do Tempo (NWP) recentes e arquivados de diferentes fontes de arquivos na nuvem. Sua funcionalidade mais popular é baixar dados do modelo HRRR. Os dados NWP no formato GRIB2 podem ser lidos com xarray+cfgrib. Os dados de modelos que o Herbie pode recuperar incluem o High Resolution Rapid Refresh (HRRR), Rapid Refresh (RAP), Global Forecast System (GFS), National Blend of Models (NBM), Rapid Refresh Forecast System - Prototype (RRFS) e produtos de previsão de dados abertos do ECMWF (ECMWF).
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    weather_forecast: Observações de previsão baixadas, limpas, interpoladas e mapeadas para cada hora.
    forecast_range: Intervalo de tempo das observações de previsão.
  parameters:
    model: Nome do modelo conforme definido na pasta de templates de modelos. INSENSÍVEL A MAIÚSCULAS/MINÚSCULAS. Abaixo estão exemplos de tipos de modelos 'hrrr' HRRR Estados Unidos contíguos 'hrrrak' HRRR Alasca (alias 'alaska') 'rap' modelo RAP 'gfs' Sistema de Previsão Global (atmosfera) 'gfs_wave' Sistema de Previsão Global (ondas) 'rrfs' Protótipo do Rapid Refresh Forecast System
    overwrite: Se verdadeiro, procura o arquivo GRIB2 mesmo que a cópia local exista. Se falso, usa a cópia local
    product: Tipo de arquivo do produto da variável de saída (sfc (campos de superfície), prs (campos de pressão), nat (campos nativos), subh (campos sub-horários)). Não especificar isso usará o primeiro produto no arquivo de template do modelo.
    forecast_lead_times: Ajuda a definir o lead time da previsão em horas. Aceita a entrada no formato de intervalo. Exemplo - (1, 25, 1). Para mais informações, consulte a URL abaixo. https://blaylockbk.github.io/Herbie/_build/html/reference_guide/_autosummary/herbie.archive.Herbie.html
    search_text: É uma expressão regular usada para pesquisar em arquivos de índice GRIB2 e permitir que você baixe apenas a camada do arquivo necessária em vez do arquivo completo. Para mais informações sobre search_text, consulte a URL abaixo. https://blaylockbk.github.io/Herbie/_build/html/user_guide/searchString.html
    weather_type: É um texto preferido pelo usuário para representar o tipo de parâmetro climático (temperatura, umidade, velocidade do vento, etc.). Isso é usado como nome da coluna para a saída retornada pelo operador.


```
