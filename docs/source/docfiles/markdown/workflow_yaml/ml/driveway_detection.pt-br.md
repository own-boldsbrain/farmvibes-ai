# ml/driveway_detection

Detecta caminhos de entrada (driveways) em frente a casas. O fluxo de trabalho (workflow) baixa a geometria da estrada do Open Street Maps e segmenta a frente das casas na imagem de entrada usando um modelo de aprendizado de máquina (machine learning). Em seguida, ele usa a imagem de entrada, o mapa de segmentação, a geometria da estrada e os limites da propriedade de entrada para detectar a presença de caminhos de entrada na frente de cada casa.

```{mermaid}
    graph TD
    inp1>input_raster]
    inp2>property_boundaries]
    out1>properties]
    out2>driveways]
    tsk1{{segment}}
    tsk2{{osm}}
    tsk3{{detect}}
    tsk1{{segment}} -- segmentation_raster --> tsk3{{detect}}
    tsk2{{osm}} -- roads --> tsk3{{detect}}
    inp1>input_raster] -- input_raster --> tsk1{{segment}}
    inp1>input_raster] -- input_raster --> tsk3{{detect}}
    inp1>input_raster] -- user_input --> tsk2{{osm}}
    inp2>property_boundaries] -- property_boundaries --> tsk3{{detect}}
    tsk3{{detect}} -- properties_with_driveways --> out1>properties]
    tsk3{{detect}} -- driveways --> out2>driveways]
```

## Fontes (Sources)

- **input_raster**: Imagens aéreas da região de interesse com bandas RGB + NIR.

- **property_boundaries**: Informações de limites de propriedade para a região de interesse.

## Sinks (Saídas)

- **properties**: Limites de propriedades que contêm um caminho de entrada.

- **driveways**: Regiões de cada limite de propriedade onde um caminho de entrada foi detectado.

## Parâmetros

- **min_region_area**: Área mínima de região contígua que será considerada como um potencial caminho de entrada, em metros.

- **ndvi_thr**: Apenas áreas abaixo deste limiar (threshold) de NDVI serão consideradas para caminhos de entrada.

- **car_size**: Tamanho esperado de um carro, em pixels, definido como [altura, largura].

- **num_kernels**: Número de kernels rotacionados para tentar encaixar um carro dentro de uma região potencial de caminho de entrada.

- **car_thr**: Proporção de pixels de um kernel que devem estar dentro de uma região para considerá-la um local de estacionamento.

## Tarefas (Tasks)

- **segment**: Segmenta a frente das casas no raster de entrada usando um modelo de aprendizado de máquina.

- **osm**: Baixa a geometria da estrada para a região de entrada do Open Street Maps.

- **detect**: Detecta caminhos de entrada na frente de cada casa, usando a imagem de entrada, o mapa de segmentação, a geometria da estrada e os limites da propriedade de entrada.

## Workflow Yaml

```yaml

name: driveway_detection
sources:
  input_raster:
  - segment.input_raster
  - detect.input_raster
  - osm.user_input
  property_boundaries:
  - detect.property_boundaries
sinks:
  properties: detect.properties_with_driveways
  driveways: detect.driveways
parameters:
  min_region_area: null
  ndvi_thr: null
  car_size: null
  num_kernels: null
  car_thr: null
tasks:
  segment:
    op: segment_driveway
  osm:
    workflow: data_ingestion/osm_road_geometries
    parameters:
      network_type: drive_service
      buffer_size: 100
  detect:
    op: detect_driveway
    parameters:
      min_region_area: '@from(min_region_area)'
      ndvi_thr: '@from(ndvi_thr)'
      car_size: '@from(car_size)'
      num_kernels: '@from(num_kernels)'
      car_thr: '@from(car_thr)'
edges:
- origin: segment.segmentation_raster
  destination:
  - detect.segmentation_raster
- origin: osm.roads
  destination:
  - detect.roads
description:
  short_description: Detecta caminhos de entrada em frente a casas.
  long_description: O fluxo de trabalho baixa a geometria da estrada do Open Street Maps e segmenta a frente das casas na imagem de entrada usando um modelo de aprendizado de máquina. Em seguida, ele usa a imagem de entrada, o mapa de segmentação, a geometria da estrada e os limites da propriedade de entrada para detectar a presença de caminhos de entrada na frente de cada casa.
  sources:
    input_raster: Imagens aéreas da região de interesse com bandas RGB + NIR.
    property_boundaries: Informações de limites de propriedade para a região de interesse.
  sinks:
    properties: Limites de propriedades que contêm um caminho de entrada.
    driveways: Regiões de cada limite de propriedade onde um caminho de entrada foi detectado.
  parameters:
    min_region_area: Área mínima de região contígua que será considerada como um potencial caminho de entrada, em metros.
    ndvi_thr: Apenas áreas abaixo deste limiar de NDVI serão consideradas para caminhos de entrada.
    car_size: Tamanho esperado de um carro, em pixels, definido como [altura, largura].
    num_kernels: Número de kernels rotacionados para tentar encaixar um carro dentro de uma região potencial de caminho de entrada.
    car_thr: Proporção de pixels de um kernel que devem estar dentro de uma região para considerá-la um local de estacionamento.


```