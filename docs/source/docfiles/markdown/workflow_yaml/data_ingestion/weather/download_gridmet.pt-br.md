# data_ingestion/weather/download_gridmet

Propriedades meteorológicas diárias de superfície do GridMET. O fluxo de trabalho baixa dados meteorológicos e hidrológicos para o intervalo de tempo de entrada. Os dados estão disponíveis para superfícies terrestres dos Estados Unidos contíguos e do sul da Colúmbia Britânica de 1979 até o presente, com uma resolução temporal diária e uma resolução espacial de aproximadamente 4 km (1/24 de grau).

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
  bi - Índice de Queima (Burning Index)
  erc - Componente de Liberação de Energia (Energy Release Component)
  etr - Evapotranspiração de referência diária (alfafa, unidades = mm)
  fm100 - Umidade do Combustível (100 horas, unidades = %)
  fm1000 - Umidade do Combustível (1000 horas, unidades = %)
  pet - Evapotranspiração potencial (evapotranspiração de grama de referência, unidades = mm)
  pr - Quantidade de precipitação (total diário, unidades = mm)
  rmax - Umidade relativa máxima (unidades = %)
  rmin - Umidade relativa mínima (unidades = %)
  sph - Umidade específica (unidades = kg/kg)
  srad - Radiação de onda curta descendente na superfície (unidades = W/m^2)
  th - Direção do vento (graus no sentido horário a partir do Norte)
  tmmn - Temperatura mínima (unidades = K)
  tmmx - Temperatura máxima (unidades = K)
  vpd - Déficit de Pressão de Vapor (unidades = kPa)
  vs - Velocidade do vento a 10m (unidades = m/s)

## Tarefas

- **list**: Lista produtos GridMET da `variável` de anos que interceptam o intervalo de tempo de entrada.

- **download**: Baixa produtos meteorológicos do Climatology Lab (TerraClimate e GridMET) definidos pelo produto de entrada.

## Fluxo de Trabalho Yaml

```yaml

name: download_gridmet
sources:
  user_input:
  - list.input_item
sinks:
  downloaded_product: download.downloaded_product
parameters:
  variable: pet
tasks:
  list:
    op: list_gridmet
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
  short_description: Propriedades meteorológicas diárias de superfície do GridMET.
  long_description: O fluxo de trabalho baixa dados meteorológicos e hidrológicos para o intervalo de tempo de entrada. Os dados estão disponíveis para superfícies terrestres dos Estados Unidos contíguos e do sul da Colúmbia Britânica de 1979 até o presente, com uma resolução temporal diária e uma resolução espacial de aproximadamente 4 km (1/24 de grau).
  sources:
    user_input: Intervalo de tempo de interesse.
  sinks:
    downloaded_product: Variável baixada para cada ano no intervalo de tempo de entrada.
  parameters:
    variable: "As opções são:\n  bi - Índice de Queima\n  erc - Componente de Liberação de Energia\n  etr - Evapotranspiração de referência diária (alfafa, unidades = mm)\n  fm100 - Umidade do Combustível (100 horas, unidades = %)\n  fm1000 - Umidade do Combustível (1000 horas, unidades = %)\n  pet - Evapotranspiração potencial (evapotranspiração de grama de referência, unidades = mm)\n  pr - Quantidade de precipitação (total diário, unidades = mm)\n  rmax - Umidade relativa máxima (unidades = %)\n  rmin - Umidade relativa mínima (unidades = %)\n  sph - Umidade específica (unidades = kg/kg)\n  srad - Radiação de onda curta descendente na superfície (unidades = W/m^2)\n  th - Direção do vento (graus no sentido horário a partir do Norte)\n  tmmn - Temperatura mínima (unidades = K)\n  tmmx - Temperatura máxima (unidades = K)\n  vpd - Déficit de Pressão de Vapor (unidades = kPa)\n  vs - Velocidade do vento a 10m (unidades = m/s)"


```
