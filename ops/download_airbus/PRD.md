# JTBDs (download_airbus)

## JTBDs
1. Baixar imagens de satélite de alta resolução da Airbus para produtos listados
2. Processar pedidos de compra e download automático quando o produto não é de propriedade do usuário

## Descrição
Baixa imagens de satélite da frota Airbus (constelações múltiplas) a partir de uma lista de produtos Airbus. A operação gerencia autenticação via API key, verifica propriedade via IoU, realiza compra se necessário e converte o resultado em rasters Airbus completos com bandas RGBN.

## Inputs
- `airbus_products`: Lista de `AirbusProduct` com geometria, ID de aquisição e metadados

## Outputs
- `downloaded_products`: Lista de `AirbusRaster` com assets TIFF, bandas (red, green, blue, nir) e metadados de aquisição

## Lógicas e Cálculos
- Calcula interseção geométrica normalizada (IoU) entre o produto solicitado e produtos disponíveis na conta
- Se IoU < threshold (0.95), realiza ordem de compra via API Airbus e aguarda entrega
- Se IoU >= threshold, utiliza produto já pertencente ao usuário
- Faz download do produto e converte para `AirbusRaster` com asset georreferenciado
