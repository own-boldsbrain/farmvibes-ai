# JTBDs (carbon)

## JTBDs
1. Avaliar cenários "what-if" de sequestro de carbono no solo
2. Submeter práticas agrícolas históricas e planejadas à API COMET-Farm
3. Comparar linha de base (baseline) vs. cenário planejado (scenario) de carbono

## Descrição
Notebook que utiliza a COMET-Farm API para calcular sequestro de carbono no solo em campos agrícolas. O usuário fornece duas listas de SeasonalFieldInformation: uma linha de base (10 anos de práticas passadas) e um cenário futuro (mínimo 2 anos). O workflow submete os dados à COMET-Farm, que executa modelos como DayCent e retorna a diferença de carbono entre os cenários.

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

## Workflows Utilizados
- farm_ai/carbon/carbon_workflow
