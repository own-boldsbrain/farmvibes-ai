# PRD — COMET-Farm

## JTBDs

1. **Calcular offset de carbono de áreas agrícolas via API COMET-Farm** — O usuário envia um arquivo XML com parâmetros da propriedade rural e recebe o valor de carbono sequestrado/emitido (Mg CO2e/ano).

2. **Parsear resposta XML da COMET-Farm em modelos Pydantic tipados** — Converter a resposta XML bruta (aninhada, com atributos) em objetos Python fortemente tipados (`CometResponse`, `CometOutput`, `CarbonResponse`, etc.) para facilitar a extração dos dados.

3. **Expor um servidor HTTP local como webhook para callback assíncrono** — A COMET-Farm processa o job de forma assíncrona; o módulo sobe um `HTTPServer` em background que recebe o POST de retorno com o resultado.

4. **Expor o servidor local à internet via ngrok** — Tunelar o servidor HTTP local com ngrok para que a COMET-Farm consiga alcançar o webhook mesmo atrás de NAT/firewall.

5. **Extrair e validar o carbon offset do resultado** — Percorrer a árvore de cenários do XML, localizar o `CometOutput` que representa o cenário de interesse e extrair o campo `soilCarbon`.

6. **Encapsular parâmetros de conexão (URL, webhook, token ngrok, email) em um modelo de configuração** — Usar `CometServerParameters` (Pydantic) para validar e transportar as credenciais e endpoints necessários para a comunicação com a API.

7. **Gerenciar ciclo de vida do servidor e do túnel ngrok** — Iniciar o servidor + ngrok antes da submissão, manter em execução até o callback chegar (com timeout), e encerrar limpeza (shutdown do server, kill do ngrok, remoção de arquivos temporários).

## Descrição do Módulo

Módulo de integração com a API COMET-Farm para cálculo de offset de carbono em propriedades rurais. Envia um arquivo XML de simulação, recebe o resultado de forma assíncrona via webhook HTTP tunelado por ngrok, faz o parsing XML → Pydantic e extrai o valor de carbono do solo.

## Inputs

| Classe / Função | Parâmetros |
|---|---|
| `CometServerParameters` | `url: str`, `webhook: str`, `ngrokToken: str`, `supportEmail: str` |
| `CometRequester.__init__` | `comet_request: CometServerParameters` |
| `CometRequester.run_comet_request` | `request_str: str` — XML completo da simulação DAYCENT/CENTURY |
| `CometHTTPServer.__init__` | `outqueue: Queue[str]`, `comet_request: CometServerParameters`, `request_str: str` |
| `CometHTTPRequestHandler.__init__` | `outqueue: Queue[str]` |
| `CometHTTPServer.submit_job` | `xml_string: str`, `reference_id: str` |

## Outputs

| Classe / Função | Retorno |
|---|---|
| `CometRequester.run_comet_request` | `str` — carbon offset no formato `"<valor> Mg Co2e/year"` |
| `CometRequester.get_comet_raw_output` | `str` — XML bruto vindo da fila |
| `CometRequester.parse_comet_response` | `Dict[str, Any]` — XML convertido para dict via xmltodict |
| `CometHTTPServer.submit_job` | `str` — texto de confirmação da submissão |
| `CarbonOffset` | `id: str`, `data: Dict[str, Any]` |

**Modelos Pydantic (árvore XML → objetos):**

- `MapUnit` — 58 campos (ex.: `id`, `area`, `year`, `inputCrop`, `irrigated`, `soilC`, `n2oflux`, etc.)
- `CarbonResponse` — `soilCarbon`, `biomassBurningCarbon`, `soilCarbonStock2000`, `soilCarbonStockBegin`, `soilCarbonStockEnd`
- `Co2Response` — `limingCO2`, `ureaFertilizationCO2`, `drainedOrganicSoilsCO2`
- `N2OResponse` — `soilN2O`, `soilN2O_Direct`, `soilN2O_Indirect_Volatilization`, `soilN2O_Indirect_Leaching`, `wetlandRiceCultivationN2O`, `biomassBurningN2O`, `drainedOrganicSoilsN2O`
- `CH4Response` — `soilCH4`, `wetlandRiceCultivationCH4`, `biomassBurningCH4`
- `CometOutput` — `name`, `carbon`, `co2`, `n20`, `ch4`
- `CometDay` — `cometEmailID`, `cFARMVersion`, `cropland`
- `CometResponse` — `day` → árvore completa

## Lógicas e Cálculos

1. **Submissão do job**: `CometHTTPServer.submit_job` monta um formulário multipart com o XML e parâmetros (`LastCropland`, `FirstCropland`, `email`, `url` do webhook, `LastDaycentInput`, `FirstDaycentInput`) e faz POST síncrono para `CometServerParameters.url`.

2. **Callback assíncrono**: A COMET-Farm responde no webhook fornecido. `CometHTTPRequestHandler.do_POST` lê o corpo (`Content-Length`), coloca o XML bruto na `Queue` compartilhada e responde HTTP 200 "OK".

3. **Sincronização via fila**: `CometRequester.get_comet_raw_output(queue)` faz `queue.get(timeout=120*60)` — bloqueia até o callback chegar ou estourar timeout de 2h.

4. **Parsing XML**: `parse_comet_response` usa `xmltodict.parse()` para converter XML com atributos (`@id`, `@name`, etc.) em dict, depois `json.loads(json.dumps(...))` para normalizar tipos.

5. **Extração do carbon offset**: O loop percorre `cr.day.cropland.modelRun.scenario`, filtra elementos onde `type(scenario) == CometOutput` e o nome contém "scenario", então extrai `co.carbon.soilCarbon` e formata como `"<valor> Mg Co2e/year"`. Se não encontrar, lança `RuntimeError`.

6. **Túnel ngrok**: `start_ngrok` autentica com o token, cria túnel TLS na porta 1108 e atualiza `webhook` com a URL pública. `shutdown` desconecta o túnel e limpa o diretório temporário do binário ngrok.

7. **Timeout total**: 120 minutos (`TIMEOUT_IN_SECONDS * 60`). O servidor HTTP permanece ativo até o callback chegar ou o timeout expirar.
