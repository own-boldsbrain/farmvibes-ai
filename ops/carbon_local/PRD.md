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
