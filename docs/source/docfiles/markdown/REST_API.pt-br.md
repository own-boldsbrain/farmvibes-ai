# API REST

Uma vez que o cluster FarmVibes.AI esteja instalado e em execução, você pode interagir com ele usando a API REST, que fornece um conjunto de endpoints que permitem listar e descrever fluxos de trabalho, bem como gerenciar execuções de fluxos de trabalho.
A API REST está disponível na URL e porta especificadas durante a criação do cluster, e seu endereço é impresso no terminal assim que a configuração é concluída. Você também pode verificar o endereço executando o seguinte comando no terminal:

```bash
$ farmvibes-ai <local | remote> status
2024-01-01 00:00:00,000 - INFO    - Cluster farmvibes-ai-username is running with 1 servers and 0 agents.
2024-01-01 00:00:00,001 - INFO    - Service url is http://ip.address:port
```

## Interagindo com a API

A API está acessível a partir do [cliente Python do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/markdown/CLIENT.html), que fornece uma interface para interagir com o cluster, listar fluxos de trabalho e gerenciar execuções de fluxos de trabalho.
Alternativamente, a interação com a API pode ser feita usando qualquer ferramenta que possa enviar requisições HTTP, como `curl` ou [Bruno](https://www.usebruno.com/).

Por exemplo, para listar os fluxos de trabalho disponíveis, você pode usar o seguinte comando:

```bash
$ curl -X GET http://localhost:31108/v0/workflows
```

O qual retornará a seguinte lista:

```
["helloworld","farm_ai/land_degradation/landsat_ndvi_trend","farm_ai/land_degradation/ndvi_linear_trend", ...]
```

Para submeter uma execução de um fluxo de trabalho específico, precisamos passar um JSON com a configuração da execução
(ex: nome do fluxo de trabalho, geometria e intervalo de tempo de entrada, parâmetros do fluxo de trabalho, etc.) como corpo da requisição. Por exemplo, podemos usar o seguinte comando para criar uma execução do fluxo de trabalho `helloworld`:

```bash
$ curl -X POST -H "Content-Type: application/json" -d <JSON>
```

Substituindo o corpo da requisição `<JSON>` pelo seguinte:

```json
{
  "name": "Hello!",
  "workflow": "helloworld",
  "parameters": null,
  "user_input": {
    "start_date": "2020-05-01T00:00:00",
    "end_date": "2020-05-05T00:00:00",
    "geojson": {
      "features": [
        {
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -119.14896203939314,
                  46.51578909859286
                ],
                [
                  -119.14896203939314,
                  46.37578909859286
                ],
                [
                  -119.28896203939313,
                  46.37578909859286
                ],
                [
                  -119.28896203939313,
                  46.51578909859286
                ],
                [
                  -119.14896203939314,
                  46.51578909859286
                ]
              ]
            ]
          },
          "type": "Feature"
        }
      ],
      "type": "FeatureCollection"
    }
  }
}
```

Para ajudar a entender o formato e a estrutura esperada do json em nossas requisições, fornecemos em nosso cliente Python o método `_form_payload` ([`vibe_core.client.FarmvibesAiClient._form_payload`](https://microsoft.github.io/farmvibes-ai/docfiles/code/vibe_core_client/client.html#vibe_core.client.FarmvibesAiClient._form_payload)) que pode ser usado para
gerar o payload da requisição para uma dada configuração de execução. Por exemplo, o seguinte código poderia ser usado para obter o json acima para o fluxo de trabalho helloworld:

```python
from vibe_core.client import get_default_vibe_client
import shapely.geometry as shpg
from datetime import datetime

client = get_default_vibe_client()

geom = shpg.Point(-119.21896203939313, 46.44578909859286).buffer(.07, cap_style=3)
time_range = (datetime(2020, 5, 1), datetime(2020, 5, 5))

payload = client._form_payload("helloworld", None, geom, time_range, None,"Hello!")
```

Outro exemplo, considerando a execução do fluxo de trabalho `farm_ai/segmentation/segment_s2` submetida no [notebook de Segmentação Sentinel-2](https://github.com/microsoft/farmvibes-ai/blob/main/notebooks/segment_anything/sentinel2_segmentation.ipynb), seria:

```python
payload = client._form_payload("farm_ai/segmentation/segment_s2", None, None, None, {"user_input": roi_time_range, "prompts": geom_collection},"SAM segmentation") 
```

O que geraria o seguinte json:

```json
{
    'name': 'SAM segmentation',
    'workflow': 'farm_ai/segmentation/segment_s2',
    'parameters': None,
    'user_input': {
        'user_input': {
            'type': 'Feature',
            'stac_version': '1.0.0',
            'id': 'f6465ad0-5e01-4792-ad99-a0bd240c1e7d',
            'properties': {
                'start_datetime': '2020-05-01T00:00:00+00:00',
                'end_datetime': '2020-05-05T00:00:00+00:00',
                'datetime': '2020-05-01T00:00:00Z'
            },
            'geometry': {'type': 'Polygon',
                'coordinates': (((-119.14896203939314, 46.51578909859286),
                (-119.14896203939314, 46.37578909859286),
                (-119.28896203939313, 46.37578909859286),
                (-119.28896203939313, 46.51578909859286),
                (-119.14896203939314, 46.51578909859286)),)
                },
            'links': [],
            'assets': {},
            'bbox': [-119.28896203939313,
                46.37578909859286,
                -119.14896203939314,
                46.51578909859286],
            'stac_extensions': [],
            'terravibes_data_type': 'DataVibe'
            },
        'prompts': {
            'type': 'Feature',
            'stac_version': '1.0.0',
            'id': 'geo_734c6441-cb25-4c40-8204-6b7286f24bb9',
            'properties': {
                'urls': ['/mnt/734c6441-cb25-4c40-8204-6b7286f24bb9_geometry_collection.geojson'],
                'start_datetime': '2020-05-01T00:00:00+00:00',
                'end_datetime': '2020-05-05T00:00:00+00:00',
                'datetime': '2020-05-01T00:00:00Z'
                },
            'geometry': {'type': 'Polygon',
                'coordinates': (((-119.14896203939314, 46.51578909859286),
                (-119.14896203939314, 46.37578909859286),
                (-119.28896203939313, 46.37578909859286),
                (-119.28896203939313, 46.51578909859286),
                (-119.14896203939314, 46.51578909859286)),)
                },
            'links': [],
            'assets': {},
            'bbox': [-119.28896203939313,
                46.37578909859286,
                -119.14896203939314,
                46.51578909859286],
            'stac_extensions': [],
            'terravibes_data_type': 'ExternalReferenceList'
        }
    }
}
```

Para mais informações sobre o método `_form_payload`, consulte a [documentação do cliente Python do FarmVibes.AI](https://microsoft.github.io/farmvibes-ai/docfiles/code/vibe_core_client/client.html#vibe_core.client.FarmvibesAiClient._form_payload).

## Endpoints

Fornecemos abaixo uma lista dos endpoints disponíveis e suas descrições.

-----------------------------

```{eval-rst}
.. openapi:: ../openapi.json
    :examples:
    :format: markdown
```
