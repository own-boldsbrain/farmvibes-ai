# data_ingestion/user_data/ingest_smb

Adiciona rasters do usuário ao armazenamento do cluster a partir de um compartilhamento SMB, permitindo que sejam usados em fluxos de trabalho. O fluxo de trabalho faz o download de rasters do compartilhamento SMB fornecido e gera objetos Raster com ativos locais que podem ser usados em outras operações.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>rasters]
    tsk1{{download}}
    inp1>user_input] -- user_input --> tsk1{{download}}
    tsk1{{download}} -- rasters --> out1>rasters]
```

## Origens (Sources)

- **user_input**: DataVibe contendo o intervalo de tempo e metadados de geometria do conjunto de rasters a serem baixados.

## Destinos (Sinks)

- **rasters**: Rasters com ativos baixados.

## Parâmetros

- **server_name**: O nome do servidor SMB

- **server_ip**: O endereço IP do servidor SMB

- **server_port**: A porta para conectar no servidor SMB

- **username**: Nome de usuário usado para conectar ao servidor

- **password**: Senha para acessar o servidor

- **share_name**: Nome do compartilhamento de arquivos

- **directory_path**: Caminho para o diretório contendo os rasters

- **bands**: Lista ordenada de bandas dentro dos rasters

## Tarefas (Tasks)

- **download**: Faz o download de rasters de um compartilhamento SMB.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: ingest_smb
sources:
  user_input:
  - download.user_input
sinks:
  rasters: download.rasters
parameters:
  server_name: null
  server_ip: null
  server_port: 445
  username: null
  password: null
  share_name: null
  directory_path: /
  bands:
  - red
  - green
  - blue
tasks:
  download:
    op: download_rasters_from_smb
    op_dir: download_from_smb
    parameters:
      server_name: '@from(server_name)'
      server_ip: '@from(server_ip)'
      server_port: '@from(server_port)'
      username: '@from(username)'
      password: '@from(password)'
      share_name: '@from(share_name)'
      directory_path: '@from(directory_path)'
      bands: '@from(bands)'
edges: null
description:
  short_description: Adiciona rasters do usuário ao armazenamento do cluster a partir
    de um compartilhamento SMB, permitindo que sejam usados em fluxos de trabalho.
  long_description: O fluxo de trabalho faz o download de rasters do compartilhamento
    SMB fornecido e gera objetos Raster com ativos locais que podem ser usados em
    outras operações.
  sources:
    user_input: DataVibe contendo o intervalo de tempo e metadados de geometria do
      conjunto de rasters a serem baixados.
  sinks:
    rasters: Rasters com ativos baixados.


```