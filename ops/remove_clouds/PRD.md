# JTBDs (remove_clouds / remove_clouds_interpolation)

## JTBDs
1. Remover nuvens de imagens Sentinel-2 usando dados Sentinel-1 (SpaceEye)
2. Gerar sequência temporal de rasters sem nuvens com iluminação corrigida

## Descrição
Executa o modelo SpaceEye (ONNX ou interpolação) para remover nuvens de sequências Sentinel-2, combinando com dados Sentinel-1 SAR e máscaras de nuvem, produzindo uma SpaceEyeRasterSequence.

## Inputs
- `s1_products`: Sentinel1RasterTileSequence (opcional) — dados SAR para suporte
- `s2_products`: Sentinel2RasterTileSequence — imagens ópticas com nuvens
- `cloud_masks`: Sentinel2CloudMaskTileSequence — máscaras de nuvem

## Outputs
- `spaceeye_sequence`: SpaceEyeRasterSequence — sequência sem nuvens

## Lógicas e Cálculos
1. Cria dataset SpaceEyeReader com chips espaço-temporais (window_size, duration, overlap)
2. Para cada chip, executa modelo ONNX (ou interpolação DampedInterpolation) para reconstruir bandas S2
3. Reaplica iluminância e quantifica para uint16
4. Escreve predições em tiles GeoTIFF e comprime
5. Monta SpaceEyeRasterSequence com assets ordenados por data
