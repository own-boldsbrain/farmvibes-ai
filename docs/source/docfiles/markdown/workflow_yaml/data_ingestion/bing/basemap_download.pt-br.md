# data_ingestion/bing/basemap_download

Baixa mapas base do Bing Maps. O fluxo de trabalho listará todos os mosaicos que intersectam com a geometria de entrada para um determinado nível de zoom e baixará um mapa base para cada um deles usando a API do Bing Maps. Os mosaicos do mapa base serão retornados como rasters individuais.

```{mermaid}
    graph TD
    inp1>input_geometry]
    out1>basemaps]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- products/input_product --> tsk2{{download}}
    inp1>input_geometry] -- user_input --> tsk1{{list}}
    tsk2{{download}} -- basemap --> out1>basemaps]
```

## Fontes

- **input_geometry**: Geometria de interesse para a qual baixar os mosaicos do mapa base.

## Sinks

- **basemaps**: Mapas base baixados.

## Parâmetros

- **api_key**: Chave de API do BingMaps obrigatória.

- **zoom_level**: Nível de zoom de interesse, variando de 0 a 20. Por exemplo, um nível de zoom de 1 corresponde a uma resolução de 78271,52 m/pixel, um nível de zoom de 10 corresponde a 152,9 m/pixel e um nível de zoom de 19 corresponde a 0,3 m/pixel. Para mais informações sobre níveis de zoom e sua escala e resolução correspondentes, consulte a documentação da API do BingMaps em https://learn.microsoft.com/en-us/bingmaps/articles/understanding-scale-and-resolution

## Tarefas

- **list**: Lista produtos de mosaico de mapa base do BingMaps que intersectam a geometria de entrada para um determinado `zoom_level`.

- **download**: Baixa um mosaico de mapa base representado por um BingMapsProduct usando a BingMapsAPI.

## Yaml do Fluxo de Trabalho

```yaml

name: basemap_download
sources:
  input_geometry:
  - list.user_input
sinks:
  basemaps: download.basemap
parameters:
  api_key: null
  zoom_level: null
tasks:
  list:
    op: list_bing_maps
    parameters:
      api_key: '@from(api_key)'
      zoom_level: '@from(zoom_level)'
  download:
    op: download_bing_basemap
    parameters:
      api_key: '@from(api_key)'
edges:
- origin: list.products
  destination:
  - download.input_product
description:
  short_description: Downloads Bing Maps basemaps.
  long_description: The workflow will list all tiles intersecting with the input geometry
    for a given zoom level and download a basemap for each of them using Bing Maps
    API. The basemap tiles will be returned as individual rasters.
  sources:
    input_geometry: Geometry of interest for which to download the basemap tiles.
  sinks:
    basemaps: Downloaded basemaps.


```