# JTBDs (compute_illuminance)

## JTBDs

1. Calcular iluminância média por banda de Sentinel-2
2. Filtrar cenas com pouca área limpa (muita nuvem)

## Descrição

Calcula o valor médio de iluminância para cada banda de um raster Sentinel-2, áreas com nuvem mascaradas, filtrando cenas com razão de pixels limpos abaixo do limiar.

## Inputs

- `rasters: List[Sentinel2Raster]` — rasters Sentinel-2
- `cloud_masks: List[Sentinel2CloudMask]` — máscaras de nuvem correspondentes
- Parâmetro: `num_workers` (padrão 6)

## Outputs

- `illuminance: List[RasterIlluminance]` — iluminância por banda

## Lógicas e Cálculos

- Para cada par raster/máscara: lê máscara, verifica razão de pixels limpos
- Se razão < `MIN_CLEAR_RATIO`, descarta a cena
- Para cada banda: lê dados, divide pelo fator de quantificação, calcula média mascarada
- Retorna apenas resultados não-nulos
