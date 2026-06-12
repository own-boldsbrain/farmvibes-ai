# data_ingestion/user_data/ingest_raster

Adiciona rasters do usuário ao armazenamento do cluster, permitindo que sejam usados em fluxos de trabalho. O fluxo de trabalho faz o download de rasters fornecidos nas referências e gera objetos Raster com ativos locais que podem ser usados em outras operações.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    tsk1{{unpack}}
    tsk2{{download}}
    tsk1{{unpack}} -- ref_list/input_ref --> tsk2{{download}}
    inp1>user_input] -- input_refs --> tsk1{{unpack}}
    tsk2{{download}} -- downloaded --> out1>raster]
```

## Origens (Sources)

- **user_input**: Lista de referências externas.

## Destinos (Sinks)

- **raster**: Rasters com ativos baixados.

## Tarefas (Tasks)

- **unpack**: Descompacta (unpacks) as URLs da lista de referências externas.

- **download**: Faz o download do raster a partir da URL da referência de entrada.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: ingest_raster
sources:
  user_input:
  - unpack.input_refs
sinks:
  raster: download.downloaded
tasks:
  unpack:
    op: unpack_refs
  download:
    op: download_raster_from_ref
    op_dir: download_from_ref
edges:
- origin: unpack.ref_list
  destination:
  - download.input_ref
description:
  short_description: Adiciona rasters do usuário ao armazenamento do cluster, permitindo
    que sejam usados em fluxos de trabalho.
  long_description: O fluxo de trabalho faz o download de rasters fornecidos nas referências
    e gera objetos Raster com ativos locais que podem ser usados em outras operações.
  sources:
    user_input: Lista de referências externas.
  sinks:
    raster: Rasters com ativos baixados.


```