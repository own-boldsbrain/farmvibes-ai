# ml/spectral_extension

Gera bandas Sentinel-2 de alta resolução combinando dados de VANT (Veículo Aéreo Não Tripulado) e Sentinel-2. O fluxo de trabalho (workflow) fará o download de um raster de VANT especificado pelo usuário, baixará e reamostrará o raster Sentinel-2 correspondente, e executará o modelo de extensão espectral para gerar 8 bandas Sentinel-2 com resolução de 0,125m. O raster de entrada deve conter três bandas (RGB) com resolução de 0,125m/px no intervalo 0-255.

```{mermaid}
    graph TD
    inp1>raster]
    out1>s2_rasters]
    out2>matched_raster]
    out3>extended_raster]
    tsk1{{ingest_raster}}
    tsk2{{s2}}
    tsk3{{select}}
    tsk4{{match}}
    tsk5{{sequence}}
    tsk6{{compute_onnx}}
    tsk1{{ingest_raster}} -- downloaded/user_input --> tsk2{{s2}}
    tsk1{{ingest_raster}} -- downloaded/ref_raster --> tsk4{{match}}
    tsk1{{ingest_raster}} -- downloaded/rasters1 --> tsk5{{sequence}}
    tsk2{{s2}} -- raster/rasters --> tsk3{{select}}
    tsk3{{select}} -- sequence/raster --> tsk4{{match}}
    tsk4{{match}} -- output_raster/rasters2 --> tsk5{{sequence}}
    tsk5{{sequence}} -- sequence/input_raster --> tsk6{{compute_onnx}}
    inp1>raster] -- input_ref --> tsk1{{ingest_raster}}
    tsk2{{s2}} -- raster --> out1>s2_rasters]
    tsk4{{match}} -- output_raster --> out2>matched_raster]
    tsk6{{compute_onnx}} -- output_raster --> out3>extended_raster]
```

## Fontes (Sources)

- **raster**: O raster de entrada do VANT com três bandas (vermelho, verde, azul, nesta ordem) com resolução de 0,125m.

## Sinks (Saídas)

- **s2_rasters**: O raster Sentinel-2 original usado na extensão espectral.

- **matched_raster**: Dados do Sentinel-2 reamostrados para a grade do raster do VANT (baixa resolução).

- **extended_raster**: O raster gerado, contendo 8 das 12 bandas do Sentinel-2.

## Parâmetros

- **resampling**: Reamostragem a ser usada ao reprojetar os dados do Sentinel-2 para a grade do raster do VANT.

## Tarefas (Tasks)

- **ingest_raster**: Baixa o raster a partir da URL da referência de entrada.

- **s2**: Baixa e pré-processa imagens do Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada.

- **select**: Seleciona "num" entradas de uma lista de Rasters para que a sequência de saída tenha um comprimento fixo.

- **match**: Reamostra o `raster` de entrada para corresponder à grade do `ref_raster`.

- **sequence**: Cria uma sequência de rasters a partir de duas listas de rasters.

- **compute_onnx**: Processa uma sequência de rasters com um modelo ONNX.

## Workflow Yaml

```yaml

name: spectral_extension
sources:
  raster:
  - ingest_raster.input_ref
sinks:
  s2_rasters: s2.raster
  matched_raster: match.output_raster
  extended_raster: compute_onnx.output_raster
parameters:
  resampling: nearest
tasks:
  ingest_raster:
    op: download_raster_from_ref
    op_dir: download_from_ref
  s2:
    workflow: data_ingestion/sentinel2/preprocess_s2
  select:
    op: select_sequence_from_list
    op_dir: select_sequence
    parameters:
      num: 1
      criterion: first
  match:
    op: match_raster_to_ref
    parameters:
      resampling: '@from(resampling)'
  sequence:
    op: create_raster_sequence
  compute_onnx:
    op: compute_onnx_from_sequence
    op_dir: compute_onnx
    parameters:
      model_file: /opt/terravibes/ops/resources/spectral_extension_model/spectral_extension.onnx
      nodata: 0
edges:
- origin: ingest_raster.downloaded
  destination:
  - s2.user_input
  - match.ref_raster
  - sequence.rasters1
- origin: s2.raster
  destination:
  - select.rasters
- origin: select.sequence
  destination:
  - match.raster
- origin: match.output_raster
  destination:
  - sequence.rasters2
- origin: sequence.sequence
  destination:
  - compute_onnx.input_raster
description:
  short_description: Gera bandas Sentinel-2 de alta resolução combinando dados de VANT e Sentinel-2.
  long_description: O fluxo de trabalho fará o download de um raster de VANT especificado pelo usuário, baixará e reamostrará o raster Sentinel-2 correspondente, e executará o modelo de extensão espectral para gerar 8 bandas Sentinel-2 com resolução de 0,125m. O raster de entrada deve conter três bandas (RGB) com resolução de 0,125m/px no intervalo 0-255.
  sources:
    raster: O raster de entrada do VANT com três bandas (vermelho, verde, azul, nesta ordem) com resolução de 0,125m.
  sinks:
    s2_rasters: O raster Sentinel-2 original usado na extensão espectral.
    matched_raster: Dados do Sentinel-2 reamostrados para a grade do raster do VANT (baixa resolução).
    extended_raster: O raster gerado, contendo 8 das 12 bandas do Sentinel-2.
  parameters:
    resampling: Reamostragem a ser usada ao reprojetar os dados do Sentinel-2 para a grade do raster do VANT.


```