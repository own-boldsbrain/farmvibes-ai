# JTBDs (download_modis_sr)

## JTBDs
1. Obter reflectância de superfície MODIS (bandas 1-7) para uma área e período
2. Aplicar máscara de qualidade (QA) para filtrar pixels com nuvens/sombra

## Descrição
Baixa as bandas de reflectância de superfície de produtos MODIS (MOD09GA/MYD09GA) do Planetary Computer, aplica filtro QA e empilha em um único raster.

## Inputs
- `product`: `ModisProduct` com ID, resolução e período
- `pc_key` (opcional): Chave de API do Planetary Computer
- `qa_mask_value`: Valor de máscara QA para filtrar pixels (default: 1024)

## Outputs
- `raster`: `ModisRaster` com as bandas de reflectância e aliases Spyndex (R, G, B, N, S1, S2)

## Lógicas e Cálculos
1. Conecta ao `Modis8DaySRCollection` e consulta item único pelo ID
2. Baixa todas as bandas `sur_refl_*` para diretório temporário
3. Abre como `xarray.Dataset`, empilha em array único
4. Aplica máscara QA: se `qa_mask_value` > 0, obtém `sur_refl_state_*`, aplica `bitwise_and` e remove pixels mascarados
5. Salva raster comprimido e mapeia bandas com aliases Spyndex para compatibilidade com índices espectrais
