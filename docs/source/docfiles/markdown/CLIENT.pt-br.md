# Cliente FarmVibes.AI

Fornecemos um cliente python para interagir com o cluster, que é acessível instalando o pacote `vibe_core`.
Para a documentação completa do cliente, consulte a [documentação do cliente](../code/vibe_core_client/client).

Neste guia do usuário, fornecemos uma visão geral do cliente e como usá-lo para interagir com o cluster. Para começar, vamos
instanciar um objeto cliente fazendo:

```python
from vibe_core.client import get_default_vibe_client
client = get_default_vibe_client()
```

A função `get_default_vibe_client` direcionará automaticamente para o seu cluster local. Se você quiser direcionar para um cluster remoto, certifique-se de adicionar o argumento `remote`:

```python
client = get_default_vibe_client("remote")
```

A URL do cluster local/remoto é gravada nos arquivos de configuração pelo script `farmvibes-ai <local | remote> setup`. Caso a implantação mude, você pode atualizar os arquivos de configuração executando `farmvibes-ai <local | remote> status`.

## Verificando fluxos de trabalho disponíveis

O método `list_workflows` pode ser usado para listar o nome de todos os fluxos de trabalho disponíveis

```python
>>> client.list_workflows()[:7]
['ingest_raster',
'helloworld',
'farm_ai/land_cover_mapping/conservation_practices',
'farm_ai/agriculture/canopy_cover',
'farm_ai/agriculture/methane_index',
'farm_ai/agriculture/emergence_summary',
'farm_ai/agriculture/change_detection',
]
```

O método `document_workflow` fornece documentação sobre um fluxo de trabalho, incluindo suas entradas, saídas
e parâmetros.

```text
>>> client.document_workflow("helloworld")

Workflow: helloworld

Description:
    Hello world! Small test workflow that generates an image of the Earth with countries that
    intersect with the input geometry highlighted in orange.

Sources:
    - user_input (vibe_core.data.core_types.DataVibe): Input geometry.

Sinks:
    - raster (vibe_core.data.rasters.Raster): Raster with highlighted countries.

Tasks:
    - hello
```

Para mais informações sobre fluxos de trabalho, consulte a [documentação de fluxos de trabalho](WORKFLOWS.md).

## Submetendo uma execução de fluxo de trabalho

Para submeter uma execução de fluxo de trabalho, use o método `run`, que recebe o fluxo de trabalho, um nome de execução,
a entrada do fluxo de trabalho e substituições de parâmetros opcionais. Para fluxos de trabalho que recebem um `DataVibe`
definindo uma região e intervalo de tempo de interesse, as entradas podem ser uma geometria (objeto `shapely`)
e um intervalo de tempo (tupla de objetos `datetime`). Veja o exemplo abaixo:

```python
from shapely import geometry as shpg
from datetime import datetime
# Geometria em WGS-84/EPSG:4326
geom = shpg.box(-122.142363,47.681775, -122.106146, 47.667801)
# Intervalo de tempo com início e fim
time_range = (datetime(2020, 1, 1), datetime(2022, 1, 1))
run = client.run("helloworld", "My first workflow run", geometry=geom, time_range=time_range)
```

Para submeter uma execução com outras entradas, use a assinatura alternativa de `run`. O seguinte é um exemplo equivalente
à execução anterior, mas submetendo um objeto `DataVibe` em vez disso.

```python
from vibe_core.data import DataVibe, gen_guid
vibe_input = DataVibe(id=gen_guid(), geometry=shpg.mapping(geom), time_range=time_range, assets=[])
# Como este fluxo de trabalho tem apenas uma única fonte (entrada), podemos passar o objeto diretamente, e
# ele será atribuído à única fonte
run = client.run("helloworld", "Workflow run with other inputs", input_data=vibe_input)
# De forma mais geral, passe um dicionário onde as chaves são as fontes do fluxo de trabalho
run = client.run(
    "helloworld",
    "Workflow run with other inputs",
    input_data={"user_input": vibe_input}
)
```

## Monitorando sua execução de fluxo de trabalho

O método `run` retornará um objeto `VibeWorkflowRun`, que contém informações sobre sua execução,
e pode ser usado para acompanhar o progresso da execução, acessar saídas e muito mais. A representação do objeto
exibirá o id da execução, nome, fluxo de trabalho e status:

```python
>>> run
VibeWorkflowRun(id='7b95932f-2428-4036-b4cc-14ef832bf8c2', name='My first workflow run', workflow='helloworld', status='running')
```

Essas informações também podem ser consultadas com suas respectivas propriedades. Para o status, ele será
atualizado em cada chamada:

```python
>>> run.status
<RunStatus.done: 'done'>
```

Para informações mais detalhadas sobre cada tarefa na execução do fluxo de trabalho, use `task_status` e
`task_details`:

```python
>>> run.task_status  # Status de cada tarefa
{'hello': 'done'}
>>> run.task_details  # Detalhes completos
{'hello': RunDetails(start_time=datetime.datetime(2022, 10, 3, 22, 22, 4, 609784), end_time=datetime.datetime(2022, 10, 3, 22, 22, 9, 533641), reason=None, status='done'),}
```

Para monitorar a execução de maneira contínua, use o método `monitor`. Ele desenhará uma tabela no
terminal e a atualizará em intervalos regulares

```text
>>> run.monitor()
                                   🌎 FarmVibes.AI 🌍 helloworld 🌏                                    
                                    Run name: My first workflow run                                    
                             Run id: dd541f5b-4f03-46e2-b017-8e88a518dfe6                              
                                          Run status: done                                           
                                        Run duration: 00:00:04                                         
┏━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Task Name        ┃ Status ┃ Start Time          ┃ End Time            ┃ Duration ┃ Progress                    ┃
┡━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ hello            │ done   │ 2023/08/17 14:45:13 │ 2023/08/17 14:45:17 │ 00:00:04 │  ━━━━━━━━━━━━━━━━━━━━  1/1  │
└──────────────────┴────────┴─────────────────────┴─────────────────────┴──────────┴─────────────────────────────┘
                                 Last update: 2023/08/17 14:45:19 UTC    
```

Da mesma forma, você pode usar o método `monitor` do `VibeWorkflowClient`, passando o objeto de execução como
um argumento, como em `client.monitor(run)`. Este método também permite monitorar múltiplas execuções de
uma só vez, passando uma lista de execuções. Por exemplo:

```python
time_range_list = [
    (datetime(2020, 1, 1), datetime(2022, 1, 1)),
    (datetime(2020, 7, 1), datetime(2022, 7, 1)),
    (datetime(2020, 12, 1), datetime(2022, 12, 1)),
]

run_list = [ 
  client.run("helloworld", f"Run {i}", geometry=geom, time_range=time_range)
  for i, time_range in enumerate(time_range_list) 
  ]
```

Ao chamar `client.monitor(run_list)`, a saída será uma tabela com informações resumidas
de cada execução, juntamente com o progresso de sua tarefa atual.

```text
>>> client.montior(run_list)

                                      🌎 FarmVibes.AI 🌍 Multi-Run Monitoring 🌏                                       
                                               Total duration: 00:01:08                                                
┏━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Run Name ┃ Task Name ┃ Status  ┃ Start Time          ┃ End Time            ┃ Duration ┃ Progress                    ┃
┡━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ Run 0    │           │ done    │ 2023/08/15 12:41:10 │ 2023/08/15 12:41:10 │ 00:00:00 │  ━━━━━━━━━━━━━━━━━━━━  1/1  │
│ ↪        │ hello     │ done    │ 2023/08/15 12:41:10 │ 2023/08/15 12:41:10 │ 00:00:00 │  ━━━━━━━━━━━━━━━━━━━━  1/1  │
├──────────┼───────────┼─────────┼─────────────────────┼─────────────────────┼──────────┼─────────────────────────────┤
│ Run 1    │           │ done    │ 2023/08/15 12:41:10 │ 2023/08/15 12:41:17 │ 00:00:06 │  ━━━━━━━━━━━━━━━━━━━━  1/1  │
│ ↪        │ hello     │ done    │ 2023/08/15 12:41:10 │ 2023/08/15 12:41:17 │ 00:00:06 │  ━━━━━━━━━━━━━━━━━━━━  1/1  │
├──────────┼───────────┼─────────┼─────────────────────┼─────────────────────┼──────────┼─────────────────────────────┤
│ Run 2    │           │ running │ 2023/08/15 12:41:10 │        N/A          │ 00:01:08 │  ━━━━━━━━━━━━━━━━━━━━  0/1  │
│ ↪        │ hello     │ running │ 2023/08/15 12:42:17 │        N/A          │ 00:00:01 │  ━━━━━━━━━━━━━━━━━━━━  0/1  │
└──────────┴───────────┴─────────┴─────────────────────┴─────────────────────┴──────────┴─────────────────────────────┘
                                         Last update: 2023/08/15 12:42:18 UTC           
```

## Bloqueando o interpretador até que a execução seja concluída

A chamada de execução é assíncrona: o cluster começará a trabalhar na sua submissão, mas o interpretador
fica livre. Para bloquear o interpretador (*ex:*, em um script que precisa esperar por uma execução ser concluída),
use `block_until_complete()`. Você pode opcionalmente definir um tempo limite (timeout) em segundos:

```python
run.block_until_complete()  # Esperará até que a execução seja concluída
run.block_until_complete(timeout=60)  # Gerará um RuntimeError se a execução não for concluída em 60s
```

## Recuperando execuções anteriores

Para listar todas as execuções, use o método `list_runs`. Ele retornará uma lista de `ids` para todas as execuções no
cluster. Os IDs de execução seguem o [padrão UUID4](https://datatracker.ietf.org/doc/html/rfc4122.html).

```python
>>> client.list_runs()
['7b95932f-2428-4036-b4cc-14ef832bf8c2']
```

Você pode então obter um `VibeWorkflowRun` a partir do id com o método `get_run_by_id`

```python
# Obter a execução mais recente
run_id = client.list_runs()[-1]
run = client.get_run_by_id(run_id)
```

## Saídas de execução (Run outputs)

Após a conclusão da execução, a propriedade `output` conterá um dicionário com as saídas. As
chaves do dicionário são os sinks do fluxo de trabalho. As saídas serão objetos do tipo `DataVibe`, que contêm
metadados sobre as saídas e referências aos arquivos de dados como assets. Veja o exemplo abaixo:

```python
>>> run.status
<RunStatus.done: 'done'>
>>> run.output.keys()
dict_keys(['raster'])
>>> out = run.output["raster"]
>>> out
[Raster(id='3339a6f3-1800-4c1a-9edd-5b791734f240', time_range=(datetime.datetime(2020, 1, 1, 0, 0, tzinfo=datetime.timezone.utc), datetime.datetime(2022, 1, 1, 0, 0, tzinfo=datetime.timezone.utc)), bbox=(-122.142363, 47.667801, -122.106146, 47.667801), geometry={'type': 'Polygon', 'coordinates': [[[-122.106146, 47.681775], [-122.106146, 47.667801], [-122.142363, 47.667801], [-122.142363, 47.681775], [-122.106146, 47.681775]]]}, assets=[AssetVibe(type='image/tiff', id='baa45c36-648b-4a03-9f3f-51ec9ff9d061', path_or_url='/data/cache/farmvibes-ai/data/assets/baa45c36-648b-4a03-9f3f-51ec9ff9d061/baa45c36-648b-4a03-9f3f-51ec9ff9d061.tif', _is_local=True, _local_path='/data/cache/farmvibes-ai/data/assets/baa45c36-648b-4a03-9f3f-51ec9ff9d061/baa45c36-648b-4a03-9f3f-51ec9ff9d061.tif')], bands={'red': 0, 'blue': 1, 'green': 2})]
>>> out[0].assets  # Verificar lista de assets
[AssetVibe(type='image/tiff', id='baa45c36-648b-4a03-9f3f-51ec9ff9d061', path_or_url='/data/cache/farmvibes-ai/data/assets/baa45c36-648b-4a03-9f3f-51ec9ff9d061/baa45c36-648b-4a03-9f3f-51ec9ff9d061.tif', _is_local=True, _local_path='/data/cache/farmvibes-ai/data/assets/baa45c36-648b-4a03-9f3f-51ec9ff9d061/baa45c36-648b-4a03-9f3f-51ec9ff9d061.tif')]
>>> out[0].raster_asset.url  # Obter referência para o arquivo tiff gerado
'file:///data/cache/farmvibes-ai/data/assets/baa45c36-648b-4a03-9f3f-51ec9ff9d061/baa45c36-648b-4a03-9f3f-51ec9ff9d061.tif'
```

## Submetendo fluxos de trabalho customizados

Em vez de submeter uma execução com um nome de fluxo de trabalho embutido, também é possível enviar uma definição de fluxo de trabalho para um fluxo customizado.
A definição do fluxo de trabalho é um dicionário que define fontes (entradas), sinks (saídas), parâmetros, tarefas e arestas.
Consulte a [documentação de fluxos de trabalho](WORKFLOWS.md) para mais informações sobre a estrutura e sintaxe das definições de fluxo de trabalho.
Considere um caso em que queremos obter rasters NDVI de imagens Sentinel-2.
Podemos fazer isso compondo um fluxo de trabalho que baixa e pré-processa dados do Sentinel-2 e um fluxo de trabalho que computa os índices NDVI. A definição do fluxo de trabalho é mostrada abaixo:

```yaml
name: custom_ndvi_workflow
sources:
  user_input:
    - s2.user_input
sinks:
  ndvi: ndvi.index_raster
parameters:
  pc_key:
tasks:
  s2:
    workflow: data_ingestion/sentinel2/preprocess_s2
    parameters:
      # Este parâmetro terá seu valor preenchido pelo parâmetro do fluxo de trabalho
      pc_key: "@from(pc_key)"
  ndvi:
    workflow: data_processing/index/index
    parameters:
      # Definir o índice para NDVI
      index: ndvi
edges:
  - origin: s2.raster
    destination:
      - ndvi.raster
```

Para submeter o fluxo de trabalho, envie o dicionário em vez de um nome de fluxo de trabalho:

```python
import yaml

with open("custom_ndvi_workflow.yaml") as f:
    custom_wf = yaml.safe_load(f)
run = client.run(custom_wf, "Custom run name", geometry=my_geometry, time_range=my_time_range)
```

O fluxo de trabalho customizado pode ser uma composição de qualquer um dos fluxos de trabalho disponíveis.
Não é possível usar um fluxo de trabalho customizado como uma tarefa para outro fluxo de trabalho.

## Cancelando uma execução de fluxo de trabalho

Caso você precise cancelar uma execução de fluxo de trabalho em andamento, use os métodos `VibeWorkflowRun.cancel` ou
`FarmvibesAiClient.cancel_run`. O status da execução, juntamente com as tarefas enfileiradas e em execução,
será definido como `cancelled` (cancelado).

```text
>>> run.cancel()
'VibeWorkflowRun'(id='89252ae9-abbb-46f2-aac3-73836a016b96', name='Cancelled workflow run', workflow='helloworld', status='cancelled')
>>> run.monitor()
                                       🌎 FarmVibes.AI 🌍 helloworld 🌏                                       
                                       Run name: Cancelled workflow run                                        
                                 Run id: 89252ae9-abbb-46f2-aac3-73836a016b96                                 
                                            Run status: cancelled                                             
                                            Run duration: 00:00:02                                            
┏━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Task Name ┃ Status    ┃ Start Time          ┃ End Time            ┃ Duration ┃ Progress                    ┃
┡━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ hello     │ cancelled │ 2023/08/15 12:48:18 │ 2023/08/15 12:48:20 │ 00:00:02 │  ━━━━━━━━━━━━━━━━━━━━  0/1  │
└───────────┴───────────┴─────────────────────┴─────────────────────┴──────────┴─────────────────────────────┘
                                     Last update: 2023/08/15 12:48:26 UTC
```

## Excluindo uma execução de fluxo de trabalho

Você pode usar os métodos `VibeWorkflowRun.delete` ou `FarmvibesAiClient.delete_run` para excluir uma
execução de fluxo de trabalho concluída (ou seja, uma execução com status de `done`, `failed` ou `cancelled`). Se a
exclusão for bem-sucedida, todos os dados em cache que a execução do fluxo de trabalho produziu e que não são compartilhados com outras
execuções de fluxos de trabalho serão excluídos e o status será definido como `deleted`.

Para mais informações sobre como os dados são gerenciados e armazenados em cache no FarmVibes.AI, consulte o nosso [Guia do usuário de Gerenciamento de Dados](./CACHE.md).
