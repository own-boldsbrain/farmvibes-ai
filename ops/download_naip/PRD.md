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
