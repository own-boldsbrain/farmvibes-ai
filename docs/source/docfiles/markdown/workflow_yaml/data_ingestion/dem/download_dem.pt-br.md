# data_ingestion/dem/download_dem

Baixa mosaicos de mapa digital de elevação que intersectam com a geometria de entrada e o intervalo de tempo. O fluxo de trabalho baixará mapas digitais de elevação dos conjuntos de dados USGS 3DEP (disponíveis para os Estados Unidos em 10 e 30 metros) ou Copernicus DEM GLO-30 (globalmente em 30 metros) através do Planetary Computer. Para mais informações, consulte https://planetarycomputer.microsoft.com/dataset/3dep-seamless e https://planetarycomputer.microsoft.com/dataset/cop-dem-glo-30 .

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- dem_products/input_product --> tsk2{{download}}
    inp1>user_input] -- input_items --> tsk1{{list}}
    tsk2{{download}} -- downloaded_product --> out1>raster]
```

## Fontes

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks

- **raster**: Raster de DEM.

## Parâmetros

- **pc_key**: Chave de API opcional do Planetary Computer.

- **resolution**: Resolução espacial do DEM. 10m e 30m estão disponíveis.

- **provider**: Provedor do DEM. "USGS3DEP" e "CopernicusDEM30" estão disponíveis.

## Tarefas

- **list**: Lista mosaicos de mapa digital de elevação que intersectam com a geometria de entrada e o intervalo de tempo.

- **download**: Baixa o raster do mapa digital de elevação dado um DemProduct.

## Yaml do Fluxo de Trabalho

```yaml

name: download_dem
sources:
  user_input:
  - list.input_items
sinks:
  raster: download.downloaded_product
parameters:
  pc_key: null
  resolution: 10
  provider: USGS3DEP
tasks:
  list:
    op: list_dem_products
    parameters:
      resolution: '@from(resolution)'
      provider: '@from(provider)'
  download:
    op: download_dem
    parameters:
      api_key: '@from(pc_key)'
edges:
- origin: list.dem_products
  destination:
  - download.input_product
description:
  short_description: Downloads digital elevation map tiles that intersect with the
    input geometry and time range.
  long_description: The workflow will download digital elevation maps from the USGS
    3DEP datasets (available for the United States at 10 and 30 meters) or Copernicus
    DEM GLO-30 (globally at 30 meters) through the Planetary Computer. For more information,
    see https://planetarycomputer.microsoft.com/dataset/3dep-seamless and https://planetarycomputer.microsoft.com/dataset/cop-dem-glo-30
    .
  sources:
    user_input: Time range and geometry of interest.
  sinks:
    raster: DEM raster.
  parameters:
    pc_key: Optional Planetary Computer API key.
    resolution: Spatial resolution of the DEM. 10m and 30m are available.
    provider: Provider of the DEM. "USGS3DEP" and "CopernicusDEM30" are available.


```