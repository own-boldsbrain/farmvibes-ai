# JTBDs (Merge Cloud Masks)

## JTBDs
1. Mesclar múltiplas máscaras de nuvem em máscaras refinadas usando janela temporal
2. Eliminar falsos positivos de nuvens usando consistência temporal

## Descrição
Refina máscaras de nuvem Sentinel-2 combinando a máscara L1C nativa com a probabilidade S2Cloudless em uma janela deslizante de tempo. Remove componentes pequenos, preenche buracos e usa dilatação morfológica. A saída é a união da máscara original com a máscara limpa.

## Inputs
- `masks`: `List[Sentinel2CloudMask]`
- `cloud_probabilities`: `List[Sentinel2CloudProbability]`
- Parâmetros: `window_size`, `cloud_prob_threshold`, `min_area`, `max_extra_cloud`, `dilation`

## Outputs
- `merged_cloud_masks`: `List[Sentinel2CloudMask]`

## Lógicas e Cálculos
- Ordena máscaras por data e agrupa por `tile_id`
- Janela deslizante de tamanho `2*T+1`: se um pixel ficou nublado no S2Cloudless em > `max_extra_cloud` quadros dentro da janela, volta para a máscara nativa
- Remove componentes conectados < `min_area` e preenche buracos < `min_area`
- Aplica dilatação `disk(dilation)` se > 1
- Pixels fora da orbita são marcados como nuvem
- `compute_mask_with_missing_clouds` → `remove_small_components` → união com máscara original
