# data_ingestion/user_data/ingest_geometry

Adiciona geometrias do usuário ao armazenamento do cluster, permitindo que sejam usadas em fluxos de trabalho. O fluxo de trabalho faz o download de geometrias fornecidas nas referências e gera objetos GeometryCollection com ativos locais que podem ser usados em outras operações.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>geometry]
    tsk1{{unpack}}
    tsk2{{download}}
    tsk1{{unpack}} -- ref_list/input_ref --> tsk2{{download}}
    inp1>user_input] -- input_refs --> tsk1{{unpack}}
    tsk2{{download}} -- downloaded --> out1>geometry]
```

## Origens (Sources)

- **user_input**: Lista de referências externas.

## Destinos (Sinks)

- **geometry**: GeometryCollections com ativos baixados.

## Tarefas (Tasks)

- **unpack**: Descompacta as URLs da lista de referências externas.

- **download**: Faz o download de geometrias fornecidas na referência e gera uma GeometryCollection.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: ingest_geometry
sources:
  user_input:
  - unpack.input_refs
sinks:
  geometry: download.downloaded
tasks:
  unpack:
    op: unpack_refs
  download:
    op: download_geometry_from_ref
    op_dir: download_from_ref
edges:
- origin: unpack.ref_list
  destination:
  - download.input_ref
description:
  short_description: Adiciona geometrias do usuário ao armazenamento do cluster, permitindo
    que sejam usadas em fluxos de trabalho.
  long_description: O fluxo de trabalho faz o download de geometrias fornecidas nas
    referências e gera objetos GeometryCollection com ativos locais que podem ser
    usados em outras operações.
  sources:
    user_input: Lista de referências externas.
  sinks:
    geometry: GeometryCollections com ativos baixados.


```