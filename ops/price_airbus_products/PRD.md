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
