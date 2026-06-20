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

## Use Cases

1. **Automação**: Conecta-se à API ADMAg usando credenciais OAuth2 para buscar dados agronômicos de um campo sazonal específico (`party_id` + `seasonal_field_id`) de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável                  | Tipo | Descrição                          |
| ------------------------- | ---- | ---------------------------------- |
| `admag_input`             | —    | Conforme especificação da operação |
| `ADMAgSeasonalFieldInput` | —    | Conforme especificação da operação |
| `party_id`                | —    | Conforme especificação da operação |
| `seasonal_field_id`       | —    | Conforme especificação da operação |
| `base_url`                | —    | Conforme especificação da operação |
| `client_id`               | —    | Conforme especificação da operação |
| `client_secret`           | —    | Conforme especificação da operação |
| `authority`               | —    | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `admag` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.
