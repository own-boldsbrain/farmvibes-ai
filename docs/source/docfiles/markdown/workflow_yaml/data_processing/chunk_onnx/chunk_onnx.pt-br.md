# data_processing/chunk_onnx/chunk_onnx

Executa um modelo ONNX sobre todos os rasters na entrada para produzir um único raster. Este fluxo de trabalho destina-se a aplicar um modelo ONNX sobre todos os rasters na entrada para gerar uma saída de raster único. Isso pode ser usado, por exemplo, para calcular a análise de série temporal de uma lista de rasters que abrangem vários tempos. A análise pode ser qualquer cálculo que possa ser expresso como um modelo ONNX (para um exemplo, consulte notebooks/crop_cycles/crop_cycles.ipynb). Para executar o modelo em paralelo (e evitar a falta de memória se a lista de rasters for grande), os rasters de entrada são divididos espacialmente em blocos (chunks) que abrangem todos os tempos. O modelo ONNX é aplicado a esses blocos e depois combinado de volta para produzir a saída final.

```{mermaid}
    graph TD
    inp1>rasters]
    out1>raster]
    tsk1{{chunk_raster}}
    tsk2{{list_to_sequence}}
    tsk3{{compute_onnx}}
    tsk4{{combine_chunks}}
    tsk1{{chunk_raster}} -- chunk_series/chunk --> tsk3{{compute_onnx}}
    tsk2{{list_to_sequence}} -- rasters_seq/input_raster --> tsk3{{compute_onnx}}
    tsk3{{compute_onnx}} -- output_raster/chunks --> tsk4{{combine_chunks}}
    inp1>rasters] -- rasters --> tsk1{{chunk_raster}}
    inp1>rasters] -- list_rasters --> tsk2{{list_to_sequence}}
    tsk4{{combine_chunks}} -- raster --> out1>raster]
```

## Fontes

- **rasters**: Rasters de entrada.

## Destinos

- **raster**: Resultado da execução do modelo ONNX.

## Parâmetros

- **model_file**: Um modelo ONNX que precisa ser implantado com o comando "farmvibes-ai local add-onnx".

- **step**: Tamanho do bloco (chunk) em pixels.

## Tarefas

- **chunk_raster**: Divide os rasters de entrada em uma série de blocos.

- **list_to_sequence**: Combina uma lista de Rasters em uma RasterSequence.

- **compute_onnx**: Executa o modelo ONNX através de blocos dos rasters de entrada.

- **combine_chunks**: Combina séries de blocos em um raster final.

## Fluxo de Trabalho Yaml

```yaml

name: chunk_onnx
sources:
  rasters:
  - chunk_raster.rasters
  - list_to_sequence.list_rasters
sinks:
  raster: combine_chunks.raster
parameters:
  model_file: null
  step: 100
tasks:
  chunk_raster:
    op: chunk_raster
    parameters:
      step_y: '@from(step)'
      step_x: '@from(step)'
  list_to_sequence:
    op: list_to_sequence
  compute_onnx:
    op: compute_onnx_from_chunks
    op_dir: compute_onnx
    parameters:
      model_file: '@from(model_file)'
      window_size: '@from(step)'
  combine_chunks:
    op: combine_chunks
edges:
- origin: chunk_raster.chunk_series
  destination:
  - compute_onnx.chunk
- origin: list_to_sequence.rasters_seq
  destination:
  - compute_onnx.input_raster
- origin: compute_onnx.output_raster
  destination:
  - combine_chunks.chunks
description:
  short_description: Executa um modelo ONNX sobre todos os rasters na entrada para produzir um único raster.
  long_description: Este fluxo de trabalho destina-se a aplicar um modelo ONNX sobre todos os rasters na entrada para gerar uma saída de raster único. Isso pode ser usado, por exemplo, para calcular a análise de série temporal de uma lista de rasters que abrangem vários tempos. A análise pode ser qualquer cálculo que possa ser expresso como um modelo ONNX (para um exemplo, consulte notebooks/crop_cycles/crop_cycles.ipynb). Para executar o modelo em paralelo (e evitar a falta de memória se a lista de rasters for grande), os rasters de entrada são divididos espacialmente em blocos que abrangem todos os tempos. O modelo ONNX é aplicado a esses blocos e depois combinado de volta para produzir a saída final.
  sources:
    rasters: Rasters de entrada.
  sinks:
    raster: Resultado da execução do modelo ONNX.
  parameters:
    model_file: Um modelo ONNX que precisa ser implantado com o comando "farmvibes-ai local add-onnx".
    step: Tamanho do bloco em pixels.


```
