# JTBDs (ADMAg Seasonal Field)

## JTBDs

1. Obter informações de campo sazonal da plataforma ADMAg (Agricultura Digital)
2. Coletar dados de fertilizantes, colheitas, plantios, preparo do solo e adubação orgânica

## Descrição

Conecta-se à API ADMAg usando credenciais OAuth2 para buscar dados agronômicos de um campo sazonal específico (`party_id` + `seasonal_field_id`). Obtém metadados do campo, da estação, e todas as operações associadas (fertilizantes, colheitas, preparo do solo, adubação orgânica). Valida propriedades obrigatórias como `totalNitrogen`, `gfsrt`, `strawStoverHayRemoval`, `type`, `amount`, `percentN`, `CNratio`.

## Inputs

- `admag_input`: `ADMAgSeasonalFieldInput` (contém `party_id`, `seasonal_field_id`)
- Parâmetros: `base_url`, `client_id`, `client_secret`, `authority`, `default_scope`

## Outputs

- `seasonal_field`: `SeasonalFieldInformation`

## Lógicas e Cálculos

- `ADMAgClient` autentica via OAuth2 com `client_credentials`
- `get_field_entities`: busca seasonal field → field → season (encadeamento de IDs)
- `get_harvests`: filtra por operações, valida `gfsrt` e `strawStoverHayRemoval`
- `get_fertilizers`: valida `totalNitrogen` e `eep` (Enhanced Efficiency Phosphorus)
- `get_first_planting`: menor `operationStartDateTime` entre plantios
- `get_tillages` e `get_organic_amendments`: coleta implements e tipos de adubação orgânica
- `time_range` = (primeiro plantio, última colheita)
