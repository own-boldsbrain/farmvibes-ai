# JTBDs (admag)

## JTBDs

1. Integrar dados agrícolas do Azure Data Manager for Agriculture (ADMAg) no FarmVibes.AI
2. Compor workflows ADMAg + NDVI summary para análise de safra
3. Avaliar sequestro de carbono usando ADMAg + COMET-Farm API

## Descrição

Notebooks que conectam FarmVibes.AI ao Microsoft Azure Data Manager for Agriculture (ADMAg). O primeiro demonstra a ingestão de dados de campo (plantio, colheita, fertilização, preparo do solo) via ADMAg e composição com workflow de NDVI. O segundo integra ADMAg com a COMET-Farm API para calcular sequestro de carbono em cenários what-if, unindo dados reais de fazenda com simulação de carbono.

## Use Cases

1. **Integração ADMAg**: Um agricultor conecta seus dados agronômicos do Azure ao FarmVibes.AI para composição com imagens de satélite e índices vegetativos.
2. **Carbono what-if**: Um consultor avalia o impacto de mudanças de práticas agrícolas no sequestro de carbono, combinando dados reais da fazenda com simulação COMET-Farm.

## Faz / Não Faz

- **Faz**: Ingestão de dados de campo via ADMAg (plantio, colheita, preparo do solo, fertilizantes).
- **Faz**: Composição de dados ADMAg com workflow NDVI summary.
- **Faz**: Integração com COMET-Farm API para cálculo de carbono em cenários what-if.
- **Não Faz**: Não substitui o ADMAg como fonte primária — depende de dados já cadastrados.
- **Não Faz**: Não calcula carbono sem dados de linha de base (baseline).

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

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `party_id` | string | ID da parte no ADMAg |
| `seasonal_field_id` | string | ID do campo sazonal no ADMAg |
| `pc_key` | string | Chave de API do Planetary Computer |

## Lógicas / Cálculos

1. `admag_seasonal_field` — Ingestão de dados agronômicos do ADMAg (tillage, planting, harvest, fertilizer).
2. `ndvi_summary` — Composição com imagens Sentinel-2 para gerar resumo NDVI da safra.
3. `admag_carbon_integration` — Envio de dados ADMAg + práticas agrícolas para COMET-Farm API e cálculo de sequestro de carbono (DayCent model).

## Outcomes Esperados

- Dados agronômicos do ADMAg enriquecidos com índices espectrais de satélite.
- Relatório de sequestro de carbono comparando baseline vs. cenário planejado.
- Rastreabilidade completa entre práticas de campo e impacto no carbono do solo.

## APIs / Conectores

- **Azure Data Manager for Agriculture (ADMAg)**: Ingestão de dados de campo.
- **COMET-Farm API**: Cálculo de sequestro de carbono (DayCent, rice methane, residue burning, liming, urea fertilizer).
- **Planetary Computer API**: Download de cenas Sentinel-2.

## Datasets / Fontes de Dados

- ADMAg: party_id, seasonal_field_id, práticas agrícolas (plantio, colheita, preparo, fertilizantes).
- Sentinel-2: reflectância de superfície para cálculo de NDVI.
- COMET-Farm: modelos DayCent, rice methane, residue burning, liming, urea fertilizer.

## Workflows Utilizados

- data_ingestion/admag/admag_seasonal_field
- farm_ai/agriculture/ndvi_summary
- farm_ai/carbon_local/admag_carbon_integration
