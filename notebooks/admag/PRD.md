# JTBDs (admag)

## JTBDs
1. Integrar dados agrícolas do Azure Data Manager for Agriculture (ADMAg) no FarmVibes.AI
2. Compor workflows ADMAg + NDVI summary para análise de safra
3. Avaliar sequestro de carbono usando ADMAg + COMET-Farm API

## Descrição
Notebooks que conectam FarmVibes.AI ao Microsoft Azure Data Manager for Agriculture (ADMAg). O primeiro demonstra a ingestão de dados de campo (plantio, colheita, fertilização, preparo do solo) via ADMAg e composição com workflow de NDVI. O segundo integra ADMAg com a COMET-Farm API para calcular sequestro de carbono em cenários what-if, unindo dados reais de fazenda com simulação de carbono.

## Notebooks
- azure_data_manager_for_agriculture_example.ipynb: Ingestão de dados agrícolas via ADMAg e composição com workflow NDVI summary
- azure_data_manager_for_agriculture_and_comet_farm_api_example.ipynb: Integração ADMAg + COMET-Farm API para avaliação de sequestro de carbono

## Inputs
- party_id e seasonal_field_id (ADMAg)
- Geometria da área (WKT)
- Período de interesse
- Parâmetros de campo (plantio, colheita, preparo do solo, fertilizantes)

## Outputs
- SeasonalFieldInformation com dados da fazenda
- NDVI summary da safra
- Relatório de sequestro de carbono (COMET-Farm API)

## Workflows Utilizados
- data_ingestion/admag/admag_seasonal_field
- farm_ai/agriculture/ndvi_summary
- farm_ai/carbon_local/admag_carbon_integration
