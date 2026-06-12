# JTBDs (carbon)

## JTBDs

1. Avaliar cenários "what-if" de sequestro de carbono no solo
2. Submeter práticas agrícolas históricas e planejadas à API COMET-Farm
3. Comparar linha de base (baseline) vs. cenário planejado (scenario) de carbono

## Descrição

Notebook que utiliza a COMET-Farm API para calcular sequestro de carbono no solo em campos agrícolas. O usuário fornece duas listas de SeasonalFieldInformation: uma linha de base (10 anos de práticas passadas) e um cenário futuro (mínimo 2 anos). O workflow submete os dados à COMET-Farm, que executa modelos como DayCent e retorna a diferença de carbono entre os cenários.

## Use Cases

1. **Creditação de carbono**: Um produtor rural avalia o potencial de geração de créditos de carbono ao mudar de plantio convencional para plantio direto.
2. **Planejamento agrícola**: Um consultor compara cenários de manejo (rotação de culturas, adubação verde) para maximizar sequestro de carbono.
3. **Compliance ambiental**: Uma empresa agroindustrial quantifica a pegada de carbono de sua cadeia de fornecedores.

## Faz / Não Faz

- **Faz**: Submissão de baseline (10 anos) e cenário (2+ anos) para COMET-Farm API.
- **Faz**: Cálculo de diferença líquida de CO₂ equivalente entre cenários.
- **Faz**: Geração de relatório por modelo (DayCent, rice methane, residue burning, liming, urea fertilizer).
- **Não Faz**: Não sugere práticas agrícolas — apenas compara cenários fornecidos pelo usuário.
- **Não Faz**: Não funciona sem dados históricos de 10 anos.

## Notebooks

- whatif.ipynb: Avaliação what-if de sequestro de carbono via COMET-Farm API

## Inputs

- baseline_seasonal_fields.json (10 anos de práticas agrícolas)
- scenario_seasonal_fields.json (2+ anos de práticas planejadas)
- ngrok auth token (webhook da COMET-Farm)
- Email registrado no COMET-Farm

## Outputs

- Relatório de sequestro de carbono (CO₂ equivalente)
- Baseline e Scenario aggregated totals por modelo (DayCent, rice methane, residue burning, liming, urea fertilizer)
- Diferença líquida entre cenários

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `ngrok_auth_token` | string | Token de autenticação ngrok (webhook COMET-Farm) |
| `comet_email` | string | Email registrado no COMET-Farm |
| `baseline_seasonal_fields` | JSON | 10 anos de práticas agrícolas passadas |
| `scenario_seasonal_fields` | JSON | 2+ anos de práticas planejadas |

## Lógicas / Cálculos

1. Submissão de baseline (10 anos históricos) à COMET-Farm API via ngrok webhook.
2. Submissão de cenário planejado (2+ anos) à COMET-Farm API.
3. Agregação de resultados por modelo: DayCent (carbono orgânico do solo), rice methane (metano em arroz), residue burning (queima de resíduos), liming (calagem), urea fertilizer (fertilizante ureia).
4. Cálculo da diferença líquida: `ΔCO₂ = ScenarioTotal - BaselineTotal`.

## Outcomes Esperados

- Relatório quantitativo de CO₂ equivalente sequestrado/emitido por cenário.
- Comparação lado a lado de baseline vs. cenário planejado.
- Dados prontos para relatórios de sustentabilidade e programas de crédito de carbono.

## APIs / Conectores

- **COMET-Farm API**: Modelos de carbono no solo (DayCent, rice methane, residue burning, liming, urea fertilizer).
- **ngrok**: Tunnel para webhook de resposta da COMET-Farm.

## Datasets / Fontes de Dados

- SeasonalFieldInformation (JSON): práticas agrícolas históricas e planejadas fornecidas pelo usuário.
- COMET-Farm: modelos de simulação de carbono no solo.

## Workflows Utilizados

- farm_ai/carbon/carbon_workflow
