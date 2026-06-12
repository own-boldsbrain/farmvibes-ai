# JTBDs (Price Airbus Products)

## JTBDs
1. Calcular o preço agregado de imagens Airbus, descontando imagens já na biblioteca do usuário
2. Evitar cobrança duplicada por imagens já adquiridas

## Descrição
Para cada `AirbusProduct`, consulta a API Airbus para verificar se já existe imagem similar na biblioteca do usuário (com `norm_intersection` ≥ `iou_threshold`). Se existir, preço = 0. Caso contrário, solicita cotação da imagem pelo ID do produto. Retorna o preço total em kB.

## Inputs
- `airbus_products`: `List[AirbusProduct]`
- Parâmetros: `api_key` (secreto), `projected_crs`, `iou_threshold`

## Outputs
- `products_price`: `AirbusPrice`

## Lógicas e Cálculos
- `AirBusAPI(api_key, projected_crs, constellations)` inicializa cliente
- `price_product`: query `api.query_owned(geom, acquisition_id)`, ordena por `norm_intersection` decrescente
- Se `norm_intersection` ≥ `iou_threshold`: preço = 0 (já possui)
- Senão: `api.get_price([product_id], envelope)` → `quote['amount']` em kB
- Soma todos os preços, geometria = `unary_union` de todos os produtos

## Use Cases
1. **Automação**: Para cada `AirbusProduct`, consulta a API Airbus para verificar se já existe imagem similar na biblioteca do usuário (com `norm_intersection` ≥ `iou_threshold`) de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `airbus_products` | — | Conforme especificação da operação |
| `List[AirbusProduct]` | — | Conforme especificação da operação |
| `api_key` | — | Conforme especificação da operação |
| `projected_crs` | — | Conforme especificação da operação |
| `iou_threshold` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `price_airbus_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Airbus**: Imagens de satélite de alta resolução.

