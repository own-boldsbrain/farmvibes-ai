# Gerenciamento de Dados

O FarmVibes.AI oferece uma plataforma escalável para processar dados geoespaciais em larga escala usando componentes
reutilizáveis. Além de decompor as computações espacial e temporalmente em chunks paralelos, a plataforma também reutiliza resultados computados anteriormente para regiões e carimbos de data/hora (timestamps) específicos.

Este documento descreve como os dados são gerenciados no FarmVibes.AI, fornecendo detalhes sobre o sistema de cache
e como excluir dados de fluxos de trabalho.

## Sistema de Cache

Como discutido na [documentação de fluxos de trabalho](WORKFLOWS.md), um fluxo de trabalho define um conjunto de tarefas que o
cluster deve executar e é composto por operações e outros fluxos de trabalho. O Farmvibes.AI resolve todas as tarefas
em um fluxo de trabalho para operações, que representam uma computação comum realizada em dados geoespaciais.
De fato, as operações são os "componentes reutilizáveis" mencionados acima. Cada vez que uma operação é executada no
FarmVibes.AI, o cluster precisa saber quais são suas entradas e parâmetros. Toda vez que o
sistema executa uma operação com entradas e parâmetros únicos, os resultados são salvos em disco.
Portanto, antes de executar uma nova operação, o sistema verifica se essa mesma operação já foi
executada com as mesmas entradas e parâmetros e, se sim, ela não precisa ser recomputada
e pode retornar a saída salva.

Por exemplo, considere a documentação do fluxo de trabalho
[`data_processing/index/index`](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/workflow_yaml/data_processing/index/index.html) do FarmVibes.AI:

```yaml
name: index
sources:
  raster:
  - compute_index.raster
sinks:
  index_raster: compute_index.index
parameters:
  index: ndvi
tasks:
  compute_index:
    op: compute_index
    parameters:
      index: '@from(index)'
edges: null
description:
  short_description: Computes an index from the bands of an input raster.
  long_description: In addition to the indices 'ndvi', 'evi', 'msavi', 'ndre', 'reci', 'ndmi',
    'methane' and 'pri' all indices in https://github.com/awesome-spectral-indices/awesome-spectral-indices
    are available (depending on the bands available on the corresponding satellite
    product).
  sources:
    raster: Input raster.
  sinks:
    index_raster: Single-band raster with the computed index.
  parameters:
    index: The choice of index to be computed ('ndvi', 'evi', 'msavi', 'ndre', 'reci',
      'ndmi', 'methane', 'pri' or any of the awesome-spectral-indices).
```

Se o fluxo de trabalho `data_processing/index/index` for executado com o parâmetro padrão `ndvi` e um raster de entrada
de um campo no Brasil, o FarmVibes.ai produzirá um raster do NDVI daquele campo. Se este
fluxo de trabalho `data_processing/index/index` for executado uma segunda vez com o **exatamente o mesmo** raster de entrada
e o parâmetro `ndvi`, o FarmVibes.AI não executará nenhuma nova computação nem produzirá um novo raster
de saída. Ele simplesmente detectará que este fluxo de trabalho já foi executado antes com este exato raster de entrada e
parâmetro, e a saída da segunda execução será a mesma saída produzida na primeira execução.
Isso é válido para todas as operações executadas como parte de todos os fluxos de trabalho.

## Excluindo Dados de Fluxo de Trabalho

Uma implicação do sistema de cache do FarmVibes.AI é que duas execuções de fluxos de trabalho inteiramente diferentes podem
se referir às mesmas saídas (ou seja, arquivos em disco) se as duas execuções de fluxo de trabalho contiverem uma
operação executada com os mesmos parâmetros e entradas. O FarmVibes.AI rastreia todas as operações que são executadas
em cada fluxo de trabalho. O sistema usa essas informações para garantir que nenhuma saída no cache seja excluída
se qualquer execução de fluxo de trabalho não excluída e as operações contidas ainda dependerem delas.

Por exemplo, considere o seguinte trecho de código:

```python
from datetime import datetime
from shapely import geometry as shpg

from vibe_core.client import get_default_vibe_client

SPACEEYE_COORDS = (-55.252304077148445, -6.424483546180726)
SPACEEYE_GEOMETRY = shpg.Point(*SPACEEYE_COORDS).buffer(0.05, cap_style=3)
SPACEEYE_TIME_RANGE = (datetime(2018, 6, 1), datetime(2018, 8, 1))

client = get_default_vibe_client()

space_eye_run = client.run(
    "data_ingestion/spaceeye/spaceeye",
    name="SpaceEye Long Haul Test",
    geometry=SPACEEYE_GEOMETRY,
    time_range=SPACEEYE_TIME_RANGE,
)
space_eye_run.monitor()

preprocess_s2_run = client.run(
    "data_ingestion/sentinel2/preprocess_s2",
    name="Preprocess Sentinel 2",
    geometry=SPACEEYE_GEOMETRY,
    time_range=SPACEEYE_TIME_RANGE,
)
preprocess_s2_run.monitor()

space_eye_run.delete()
space_eye_run.block_until_deleted(120)

```

Imagine que este trecho de código seja executado em um cluster novo, sem execuções anteriores, e ambas as execuções
sejam concluídas com sucesso. Você poderia esperar que o cache estivesse vazio após
`space_eye_run.delete()` ser chamado. No entanto, `data_ingestion/sentinel2/preprocess_s2` é uma tarefa
no fluxo de trabalho `spaceeye`. Como `preprocess_s2_run` foi chamado antes de `space_eye_run` ser
excluído, todos os arquivos que foram gerados e armazenados no cache como parte de
`preprocess_s2_run` serão preservados porque essa execução de fluxo de trabalho não foi excluída. Todos os outros
arquivos gerados por `space_eye_run` serão excluídos, desde que não tenha havido outras execuções com
operações em comum com esta execução. Se, após a conclusão de `space_eye_run.delete()`,
`preprocess_s2_run.delete()` for chamado e nenhum outro fluxo de trabalho contendo operações com a
exatamente a mesma entrada que as operações em `preprocess_s2_run` tiver sido chamado, o cache não conteria nenhum arquivo
após a conclusão da exclusão.

## Roteiro de Operações de Gerenciamento de Dados

Atualmente, oferecemos suporte apenas para a exclusão de dados de fluxo de trabalho, mas temos planos para outras operações de gerenciamento de dados.
Gostaríamos muito de ouvir de você quais operações de dados você gostaria de ver no FarmVibes.AI.
[Por favor, deixe-nos saber abrindo uma issue no GitHub](https://github.com/microsoft/farmvibes-ai/issues).
