# data_ingestion/bing/basemap_download_merge

Baixa mosaicos de mapa base do Bing Maps e os mescla em um único raster. O fluxo de trabalho listará todos os mosaicos que intersectam com a geometria de entrada para um determinado nível de zoom e baixará um mapa base para cada um deles usando a API do Bing Maps. Os mapas base serão mesclados em um único raster com a união das geometrias de todos os mosaicos.

```{mermaid}
    graph TD
    inp1>input_geometry]
    out1>merged_basemap]
    tsk1{{basemap_download}}
    tsk2{{to_sequence}}
    tsk3{{merge}}
    tsk1{{basemap_download}} -- basemaps/list_rasters --> tsk2{{to_sequence}}
    tsk2{{to_sequence}} -- rasters_seq/raster_sequence --> tsk3{{merge}}
    inp1>input_geometry] -- input_geometry --> tsk1{{basemap_download}}
    tsk3{{merge}} -- raster --> out1>merged_basemap]
```

## Fontes

- **input_geometry**: Geometria de interesse para a qual baixar os mosaicos do mapa base.

## Sinks

- **merged_basemap**: Raster do mapa base mesclado.

## Parâmetros

- **api_key**: Chave de API do BingMaps obrigatória.

- **zoom_level**: Nível de zoom de interesse, variando de 0 a 20. Por exemplo, um nível de zoom de 1 corresponde a uma resolução de 78271,52 m/pixel, um nível de zoom de 10 corresponde a 152,9 m/pixel e um nível de zoom de 19 corresponde a 0,3 m/pixel. Para mais informações sobre níveis de zoom e sua escala e resolução correspondentes, consulte a documentação da API do BingMaps em https://learn.microsoft.com/en-us/bingmaps/articles/understanding-scale-and-resolution

- **merge_resolution**: Determina como a resolução do raster de saída é definida. Pode ser 'equal' (falha se a resolução dos rasters da sequência não for a mesma), 'lowest' (usa a menor resolução entre os rasters), 'highest' (usa a maior resolução entre os rasters) ou 'average' (faz a média da resolução de todos os rasters na sequência).

## Tarefas

- **basemap_download**: Baixa mapas base do Bing Maps.

- **to_sequence**: Combina uma lista de Rasters em uma RasterSequence.

- **merge**: Mescla rasters em uma sequência para um único raster.

## Yaml do Fluxo de Trabalho

```yaml

name: basemap_download_merge
sources:
  input_geometry:
  - basemap_download.input_geometry
sinks:
  merged_basemap: merge.raster
parameters:
  api_key: null
  zoom_level: null
  merge_resolution: highest
tasks:
  basemap_download:
    workflow: data_ingestion/bing/basemap_download
    parameters:
      api_key: '@from(api_key)'
      zoom_level: '@from(zoom_level)'
  to_sequence:
    op: list_to_sequence
  merge:
    op: merge_rasters
    parameters:
      resolution: '@from(merge_resolution)'
edges:
- origin: basemap_download.basemaps
  destination:
  - to_sequence.list_rasters
- origin: to_sequence.rasters_seq
  destination:
  - merge.raster_sequence
description:
  short_description: Downloads Bing Maps basemap tiles and merges them into a single
    raster.
  long_description: The workflow will list all tiles intersecting with the input geometry
    for a given zoom level, and download a basemap for each of them using Bing Maps
    API. The basemaps will be merged into a single raster with the union of the geometries
    of all tiles.
  sources:
    input_geometry: Geometry of interest for which to download the basemap tiles.
  sinks:
    merged_basemap: Merged basemap raster.


```