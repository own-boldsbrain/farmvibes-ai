# JTBDs (whatif_comet_op)

## JTBDs

1. Calcular crédito de carbono com baseline vs. cenário futuro
2. Integrar com API COMET Farm para simulação de sequestro de carbono

## Descrição

Computa o offset de carbono que seria sequestrado em um campo sazonal comparando informações históricas (baseline) com um cenário futuro, usando o modelo COMET Farm via API.

## Inputs

- `baseline_seasonal_fields`: List[SeasonalFieldInformation] — dados históricos do campo
- `scenario_seasonal_fields`: List[SeasonalFieldInformation] — dados do cenário futuro

## Outputs

- `carbon_output`: CarbonOffsetInfo — resultado do cálculo de carbono

## Lógicas e Cálculos

1. Converte dados sazonais (plantio, colheita, preparo, fertilização, adubação orgânica) em XML no formato COMET
2. Calcula área e ponto central do polígono via Shapely/Geod
3. Envia requisição ao COMET Farm via webhook com ngrok
4. Retorna o response como CarbonOffsetInfo com geometria e período do cenário

## Use Cases
1. **Automação**: Computa o offset de carbono que seria sequestrado em um campo sazonal comparando informações históricas (baseline) com um cenário futuro, usando o modelo COMET Farm via API de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `baseline_seasonal_fields` | — | Conforme especificação da operação |
| `scenario_seasonal_fields` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `carbon_local` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **COMET-Farm API**: Modelos de carbono no solo.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

