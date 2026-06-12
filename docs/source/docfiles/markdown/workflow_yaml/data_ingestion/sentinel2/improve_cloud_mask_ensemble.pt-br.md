# data_ingestion/sentinel2/improve_cloud_mask_ensemble

Melhora as máscaras de nuvens ao mesclar a máscara de nuvens do produto com as máscaras de nuvens e sombras computadas por um conjunto (ensemble) de modelos de segmentação de aprendizado de máquina. Este fluxo de trabalho computa probabilidades de nuvens e sombras usando um conjunto de modelos de segmentação, aplica limiares (thresholds) a elas e mescla as máscaras dos modelos com a máscara do produto.

```{mermaid}
    graph TD
    inp1>s2_raster]
    inp2>product_mask]
    out1>mask]
    tsk1{{cloud}}
    tsk2{{shadow}}
    tsk3{{merge}}
    tsk1{{cloud}} -- cloud_probability --> tsk3{{merge}}
    tsk2{{shadow}} -- shadow_probability --> tsk3{{merge}}
    inp1>s2_raster] -- sentinel_raster --> tsk1{{cloud}}
    inp1>s2_raster] -- sentinel_raster --> tsk2{{shadow}}
    inp2>product_mask] -- product_mask --> tsk3{{merge}}
    tsk3{{merge}} -- merged_cloud_mask --> out1>mask]
```

## Fontes (Sources)

- **s2_raster**: Raster do Sentinel-2 L2A.

- **product_mask**: Máscara de nuvens obtida dos indicadores de qualidade do produto.

## Sinks

- **mask**: Máscara de nuvens melhorada.

## Parâmetros

- **cloud_thr**: Limiar de confiança para atribuir um pixel como nuvem.

- **shadow_thr**: Limiar de confiança para atribuir um pixel como sombra.

## Tarefas (Tasks)

- **cloud**: Computa a probabilidade de nuvem de um raster Sentinel-2 L2A usando um conjunto de cinco modelos de segmentação de nuvem.

- **shadow**: Computa probabilidades de sombra usando um modelo de segmentação convolucional para L2A.

- **merge**: Mescla as máscaras de nuvem, sombra e a máscara de nuvens do produto em uma única máscara.

## Workflow Yaml

```yaml

name: improve_cloud_mask_ensemble
sources:
  s2_raster:
  - cloud.sentinel_raster
  - shadow.sentinel_raster
  product_mask:
  - merge.product_mask
sinks:
  mask: merge.merged_cloud_mask
parameters:
  cloud_thr: null
  shadow_thr: null
tasks:
  cloud:
    workflow: data_ingestion/sentinel2/cloud_ensemble
  shadow:
    op: compute_shadow_prob
  merge:
    op: merge_cloud_masks_simple
    op_dir: merge_cloud_masks
    parameters:
      cloud_prob_threshold: '@from(cloud_thr)'
      shadow_prob_threshold: '@from(shadow_thr)'
edges:
- origin: cloud.cloud_probability
  destination:
  - merge.cloud_probability
- origin: shadow.shadow_probability
  destination:
  - merge.shadow_probability
description:
  short_description: Melhora as máscaras de nuvens ao mesclar a máscara de nuvens do produto com as máscaras de nuvens
    e sombras computadas por um conjunto (ensemble) de modelos de segmentação de aprendizado de máquina.
  long_description: Este fluxo de trabalho computa probabilidades de nuvens e sombras usando um conjunto
    de modelos de segmentação, aplica limiares (thresholds) a elas e mescla as máscaras dos modelos
    com a máscara do produto.
  sources:
    s2_raster: Raster do Sentinel-2 L2A.
    product_mask: Máscara de nuvens obtida dos indicadores de qualidade do produto.
  sinks:
    mask: Máscara de nuvens melhorada.
  parameters:
    cloud_thr: Limiar de confiança para atribuir um pixel como nuvem.
    shadow_thr: Limiar de confiança para atribuir um pixel como sombra.


```
