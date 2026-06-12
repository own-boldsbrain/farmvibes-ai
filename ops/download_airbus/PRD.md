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

## Use Cases
1. **Ingestão de Airbus**: Baixar dados Airbus para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Airbus mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `airbus_products` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `download_airbus` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Airbus**: Imagens de satélite de alta resolução.

