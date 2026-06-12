# JTBDs (download_naip)

## JTBDs
1. Obter imagens aéreas NAIP de alta resolução (RGB+NIR) para inspeção visual de campo
2. Dispor de ortofotos atualizadas para delimitação de talhões e feições

## Descrição
Baixa as 4 bandas (R, G, B, NIR) de uma cena NAIP do Planetary Computer e retorna como raster com asset de visualização RGB.

## Inputs
- `input_product`: `NaipProduct` com tile ID, ano e resolução
- `api_key` (opcional): Chave de API do Planetary Computer

## Outputs
- `downloaded_product`: `NaipRaster` com as bandas red, green, blue, nir e asset de visualização

## Lógicas e Cálculos
1. Conecta ao `NaipCollection` no Planetary Computer e consulta item pelo `tile_id`
2. Baixa todos os assets do item para diretório temporário
3. Gera asset de visualização RGB via `json_to_asset` com as 3 primeiras bandas
4. Mapeia bandas para `("red", "green", "blue", "nir")` e retorna `NaipRaster`

## Use Cases
1. **Ingestão de Naip**: Baixar dados Naip para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Naip mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_product` | — | Conforme especificação da operação |
| `api_key` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_naip` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **NAIP**: Imagens aéreas RGB/NIR dos EUA (1m).

