# data_ingestion/soil/soilgrids

Faz o download de informações de mapeamento digital de solos do SoilGrids para a geometria de entrada. O fluxo de trabalho baixa um raster contendo o mapa e os identificadores para a geometria informada. O SoilGrids é um sistema para mapeamento digital de solos baseado na compilação global de dados de perfis de solo e camadas ambientais.

```{mermaid}
    graph TD
    inp1>input_item]
    out1>downloaded_raster]
    tsk1{{download_soilgrids}}
    inp1>input_item] -- input_item --> tsk1{{download_soilgrids}}
    tsk1{{download_soilgrids}} -- downloaded_raster --> out1>downloaded_raster]
```

## Origens (Sources)

- **input_item**: Geometria de entrada.

## Destinos (Sinks)

- **downloaded_raster**: Raster com o mapa e identificadores solicitados.

## Parâmetros

- **map**: Mapa para download. Opções:
  - wrb - Classes e probabilidades da Base de Referência Mundial (World Reference Base)
  - bdod - Densidade aparente (Bulk density) - kg/dm^3
  - cec - Capacidade de troca catiônica em ph 7 - cmol(c)/kg
  - cfvo - Fragmentos grossos volumétricos - cm3/100cm3 (vol%)
  - clay - Teor de argila - g/100g (%)
  - nitrogen - Nitrogênio - g/kg
  - phh2o - pH do solo em H2O - pH
  - sand - Teor de areia - g/100g (%)
  - silt - Teor de silte - g/100g (%)
  - soc - Teor de carbono orgânico do solo - g/kg
  - ocs - Estoque de carbono orgânico do solo - kg/m^3
  - ocd - Densidades de carbono orgânico - kg/m^3

- **identifier**: Identificador da variável a ser baixada. Depende do mapa.
  - wrb: Acrisols, Albeluvisols, Alisols, Andosols, Arenosols, Calcisols, Cambisols,
Chernozems, Cryosols, Durisols, Ferralsols, Fluvisols, Gleysols, Gypsisols, Histosols, Kastanozems, Leptosols, Lixisols, Luvisols, MostProbable, Nitisols, Phaeozems, Planosols, Plinthosols, Podzols, Regosols, Solonchaks, Solonetz, Stagnosols, Umbrisols, Vertisols.
Outros identificadores seguem a nomenclatura definida na [link=https://www.isric.org/explore/soilgrids/faq-soilgrids#What_do_the_filename_codes_mean]página de documentação do SoilGrids: https://www.isric.org/explore/soilgrids/faq-soilgrids#What_do_the_filename_codes_mean[/].

## Tarefas (Tasks)

- **download_soilgrids**: Faz o download de informações de mapeamento digital de solos do SoilGrids para a geometria de entrada.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: soilgrids
sources:
  input_item:
  - download_soilgrids.input_item
sinks:
  downloaded_raster: download_soilgrids.downloaded_raster
parameters:
  map: wrb
  identifier: MostProbable
tasks:
  download_soilgrids:
    op: download_soilgrids
    parameters:
      map: '@from(map)'
      identifier: '@from(identifier)'
edges: null
description:
  short_description: Faz o download de informações de mapeamento digital de solos do
    SoilGrids para a geometria de entrada.
  long_description: O fluxo de trabalho baixa um raster contendo o mapa e os identificadores
    para a geometria de entrada. O SoilGrids é um sistema para mapeamento digital de
    solos baseado na compilação global de dados de perfis de solo e camadas ambientais.
  sources:
    input_item: Geometria de entrada.
  sinks:
    downloaded_raster: Raster com o mapa e identificadores solicitados.
  parameters:
    map: "Mapa para download. Opções:\n  - wrb - Classes e probabilidades da World Reference\
      \ Base\n  - bdod - Densidade aparente - kg/dm^3\n  - cec - Capacidade de troca\
      \ catiônica em ph 7 - cmol(c)/kg\n  - cfvo - Fragmentos grossos volumétricos\
      \ - cm3/100cm3 (vol%)\n  - clay - Teor de argila - g/100g (%)\n  - nitrogen\
      \ - Nitrogênio - g/kg\n  - phh2o - pH do solo em H2O - pH\n  - sand - Teor de\
      \ areia - g/100g (%)\n  - silt - Teor de silte - g/100g (%)\n  - soc - Teor de\
      \ carbono orgânico do solo - g/kg\n  - ocs - Estoque de carbono orgânico do solo\
      \ - kg/m^3\n  - ocd - Densidades de carbono orgânico - kg/m^3"
    identifier: "Identificador da variável a ser baixada. Depende do mapa.\n  - wrb:\
      \ Acrisols, Albeluvisols, Alisols, Andosols, Arenosols, Calcisols, Cambisols,\n\
      Chernozems, Cryosols, Durisols, Ferralsols, Fluvisols, Gleysols, Gypsisols, Histosols,\n\
      Kastanozems, Leptosols, Lixisols, Luvisols, MostProbable, Nitisols, Phaeozems,\n\
      Planosols, Plinthosols, Podzols, Regosols, Solonchaks, Solonetz, Stagnosols,\n\
      Umbrisols, Vertisols.\nOutros identificadores seguem a nomenclatura definida\
      \ na [link=https://www.isric.org/explore/soilgrids/faq-soilgrids#What_do_the_filename_codes_mean]página\
      \ de documentação do SoilGrids: https://www.isric.org/explore/soilgrids/faq-soilgrids#What_do_the_filename_codes_mean[/]."


```