# data_ingestion/weather/download_terraclimate

Propriedades climáticas e hidroclimáticas mensais do TerraClimate. O fluxo de trabalho baixa dados meteorológicos e hidrológicos para o intervalo de tempo de entrada. Os dados estão disponíveis para superfícies terrestres globais de 1958 até o presente, com uma resolução temporal mensal e uma resolução espacial de aproximadamente 4 km (1/24 de grau).

```{mermaid}
    graph TD
    inp1>user_input]
    out1>downloaded_product]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- products/input_product --> tsk2{{download}}
    inp1>user_input] -- input_item --> tsk1{{list}}
    tsk2{{download}} -- downloaded_product --> out1>downloaded_product]
```

## Fontes

- **user_input**: Intervalo de tempo de interesse.

## Destinos

- **downloaded_product**: Variável baixada para cada ano no intervalo de tempo de entrada.

## Parâmetros

- **variable**: As opções são:
  aet - Evapotranspiração Real (total mensal, unidades = mm)
  def - Déficit Hídrico Climático (total mensal, unidades = mm)
  pet - Evapotranspiração Potencial (total mensal, unidades = mm)
  ppt - Precipitação (total mensal, unidades = mm)
  q - Escoamento (total mensal, unidades = mm)
  soil - Umidade do Solo (coluna total no final do mês, unidades = mm)
  srad - Radiação de onda curta descendente na superfície (unidades = W/m2)
  swe - Equivalente de água da neve (no final do mês, unidades = mm)
  tmax - Temperatura Máxima (média do mês, unidades = C)
  tmin - Temperatura Mínima (média do mês, unidades = C)
  vap - Pressão de vapor (média do mês, unidades = kPa)
  ws - Velocidade do vento (média do mês, unidades = m/s)
  vpd - Déficit de Pressão de Vapor (média do mês, unidades = kPa)
  PDSI - Índice de Severidade de Seca de Palmer (no final do mês, unidades = sem unidade)

## Tarefas

- **list**: Lista produtos TerraClimate da `variável` de anos que interceptam o intervalo de tempo de entrada.

- **download**: Baixa produtos meteorológicos do Climatology Lab (TerraClimate e GridMET) definidos pelo produto de entrada.

## Fluxo de Trabalho Yaml

```yaml

name: download_terraclimate
sources:
  user_input:
  - list.input_item
sinks:
  downloaded_product: download.downloaded_product
parameters:
  variable: tmax
tasks:
  list:
    op: list_terraclimate
    op_dir: list_climatology_lab
    parameters:
      variable: '@from(variable)'
  download:
    op: download_climatology_lab
edges:
- origin: list.products
  destination:
  - download.input_product
description:
  short_description: Propriedades climáticas e hidroclimáticas mensais do TerraClimate.
  long_description: O fluxo de trabalho baixa dados meteorológicos e hidrológicos para o intervalo de tempo de entrada. Os dados estão disponíveis para superfícies terrestres globais de 1958 até o presente, com uma resolução temporal mensal e uma resolução espacial de aproximadamente 4 km (1/24 de grau).
  sources:
    user_input: Intervalo de tempo de interesse.
  sinks:
    downloaded_product: Variável baixada para cada ano no intervalo de tempo de entrada.
  parameters:
    variable: "As opções são:\n  aet - Evapotranspiração Real (total mensal, unidades = mm)\n  def - Déficit Hídrico Climático (total mensal, unidades = mm)\n  pet - Evapotranspiração Potencial (total mensal, unidades = mm)\n  ppt - Precipitação (total mensal, unidades = mm)\n  q - Escoamento (total mensal, unidades = mm)\n  soil - Umidade do Solo (coluna total no final do mês, unidades = mm)\n  srad - Radiação de onda curta descendente na superfície (unidades = W/m2)\n  swe - Equivalente de água da neve (no final do mês, unidades = mm)\n  tmax - Temperatura Máxima (média do mês, unidades = C)\n  tmin - Temperatura Mínima (média do mês, unidades = C)\n  vap - Pressão de vapor (média do mês, unidades = kPa)\n  ws - Velocidade do vento (média do mês, unidades = m/s)\n  vpd - Déficit de Pressão de Vapor (média do mês, unidades = kPa)\n  PDSI - Índice de Severidade de Seca de Palmer (no final do mês, unidades = sem unidade)"


```
