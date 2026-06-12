# data_ingestion/sentinel2/cloud_ensemble

Computa a probabilidade de nuvem de um raster Sentinel-2 L2A usando um conjunto (ensemble) de cinco modelos de segmentação de nuvem. O fluxo de trabalho computa as probabilidades de nuvem para cada modelo independentemente e faz a média delas para obter um único mapa de probabilidade.

```{mermaid}
    graph TD
    inp1>sentinel_raster]
    out1>cloud_probability]
    tsk1{{cloud1}}
    tsk2{{cloud2}}
    tsk3{{cloud3}}
    tsk4{{cloud4}}
    tsk5{{cloud5}}
    tsk6{{ensemble}}
    tsk1{{cloud1}} -- cloud_probability/cloud1 --> tsk6{{ensemble}}
    tsk2{{cloud2}} -- cloud_probability/cloud2 --> tsk6{{ensemble}}
    tsk3{{cloud3}} -- cloud_probability/cloud3 --> tsk6{{ensemble}}
    tsk4{{cloud4}} -- cloud_probability/cloud4 --> tsk6{{ensemble}}
    tsk5{{cloud5}} -- cloud_probability/cloud5 --> tsk6{{ensemble}}
    inp1>sentinel_raster] -- sentinel_raster --> tsk1{{cloud1}}
    inp1>sentinel_raster] -- sentinel_raster --> tsk2{{cloud2}}
    inp1>sentinel_raster] -- sentinel_raster --> tsk3{{cloud3}}
    inp1>sentinel_raster] -- sentinel_raster --> tsk4{{cloud4}}
    inp1>sentinel_raster] -- sentinel_raster --> tsk5{{cloud5}}
    tsk6{{ensemble}} -- cloud_probability --> out1>cloud_probability]
```

## Fontes (Sources)

- **sentinel_raster**: Raster do Sentinel-2 L2A.

## Sinks

- **cloud_probability**: Mapa de probabilidade de nuvens.

## Tarefas (Tasks)

- **cloud1**: Computa probabilidades de nuvem usando um modelo de segmentação convolucional para L2A.

- **cloud2**: Computa probabilidades de nuvem usando um modelo de segmentação convolucional para L2A.

- **cloud3**: Computa probabilidades de nuvem usando um modelo de segmentação convolucional para L2A.

- **cloud4**: Computa probabilidades de nuvem usando um modelo de segmentação convolucional para L2A.

- **cloud5**: Computa probabilidades de nuvem usando um modelo de segmentação convolucional para L2A.

- **ensemble**: Computa probabilidades de nuvem em conjunto (ensemble) a partir de todos os 5 modelos.

## Workflow Yaml

```yaml

name: cloud_ensemble
sources:
  sentinel_raster:
  - cloud1.sentinel_raster
  - cloud2.sentinel_raster
  - cloud3.sentinel_raster
  - cloud4.sentinel_raster
  - cloud5.sentinel_raster
sinks:
  cloud_probability: ensemble.cloud_probability
tasks:
  cloud1:
    op: compute_cloud_prob
    parameters:
      model_path: cloud_model1_cpu.onnx
  cloud2:
    op: compute_cloud_prob
    parameters:
      model_path: cloud_model2_cpu.onnx
  cloud3:
    op: compute_cloud_prob
    parameters:
      model_path: cloud_model3_cpu.onnx
  cloud4:
    op: compute_cloud_prob
    parameters:
      model_path: cloud_model4_cpu.onnx
  cloud5:
    op: compute_cloud_prob
    parameters:
      model_path: cloud_model5_cpu.onnx
  ensemble:
    op: ensemble_cloud_prob
edges:
- origin: cloud1.cloud_probability
  destination:
  - ensemble.cloud1
- origin: cloud2.cloud_probability
  destination:
  - ensemble.cloud2
- origin: cloud3.cloud_probability
  destination:
  - ensemble.cloud3
- origin: cloud4.cloud_probability
  destination:
  - ensemble.cloud4
- origin: cloud5.cloud_probability
  destination:
  - ensemble.cloud5
description:
  short_description: Computa a probabilidade de nuvem de um raster Sentinel-2 L2A usando
    um conjunto (ensemble) de cinco modelos de segmentação de nuvem.
  long_description: O fluxo de trabalho computa as probabilidades de nuvem para cada modelo
    independentemente e faz a média delas para obter um único mapa de probabilidade.
  sources:
    sentinel_raster: Raster do Sentinel-2 L2A.
  sinks:
    cloud_probability: Mapa de probabilidade de nuvens.


```
