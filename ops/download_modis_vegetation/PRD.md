# JTBDs (download_modis_vegetation)

## JTBDs
1. Obter índices de vegetação (NDVI/EVI) MODIS pré-processados para monitoramento de safra
2. Avaliar vigor vegetativo de talhões em intervalos de 16 dias

## Descrição
Baixa o índice de vegetação selecionado (NDVI ou EVI) de produtos MODIS (MOD13Q1/MYD13Q1) a partir do Planetary Computer.

## Inputs
- `product`: `ModisProduct` com ID, resolução e período
- `index`: Índice desejado — `"ndvi"` ou `"evi"`
- `pc_key` (opcional): Chave de API do Planetary Computer

## Outputs
- `index`: `Raster` com o índice de vegetação solicitado em banda única

## Lógicas e Cálculos
1. Conecta ao `Modis16DayVICollection` e consulta item único pelo ID e resolução
2. Filtra os assets do item para encontrar o que contém o índice (case-insensitive: "NDVI" ou "EVI" no nome)
3. Baixa o asset selecionado e retorna como `Raster` com a banda mapeada ao nome do índice
