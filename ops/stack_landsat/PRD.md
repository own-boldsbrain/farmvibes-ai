# JTBDs (stack_landsat_bands)

## JTBDs
1. Empilhar bandas individuais Landsat em um único raster multibanda
2. Aplicar máscara QA para remover pixels com nuvens/sombras

## Descrição
Agrupa as bandas baixadas de um produto Landsat em um único raster multibanda, aplicando máscara de qualidade (QA_PIXEL) quando configurado.

## Inputs
- `landsat_product`: LandsatProduct — produto Landsat com bandas individuais

## Outputs
- `landsat_raster`: LandsatRaster — raster multibanda empilhado

## Lógicas e Cálculos
1. Abre arquivos de banda via xarray/rasterio e concatena ao longo do eixo bands
2. Se qa_mask_value > 0, aplica bitwise AND com QA_PIXEL para mascarar pixels indesejados
3. Salva raster empilhado com `save_raster_to_asset`
4. Mapeia nomes de banda para índices (incluindo aliases Spyndex: B, G, R, N, S1, S2)
