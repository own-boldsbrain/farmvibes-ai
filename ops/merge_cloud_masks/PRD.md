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

## Use Cases
1. **Mosaico de imagens**: Unir múltiplos rasters adjacentes em uma única cena contínua.
2. **Fusão de dados**: Combinar coberturas de diferentes datas ou sensores.
3. **Preparação de dado único**: Consolidar sequência de rasters para análise integrada.

## Faz / Não Faz

- **Faz**: Mesclagem de múltiplos rasters em um único arquivo.
- **Faz**: Validação de compatibilidade entre rasters (CRS, dtype, bandas).
- **Não Faz**: Não faz interpolação entre rasters sobrepostos — usa o primeiro disponível.
- **Não Faz**: Não recorta ou reprojeta — opera no CRS herdado da entrada.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `masks` | — | Conforme especificação da operação |
| `List[Sentinel2CloudMask]` | — | Conforme especificação da operação |
| `cloud_probabilities` | — | Conforme especificação da operação |
| `List[Sentinel2CloudProbability]` | — | Conforme especificação da operação |
| `window_size` | — | Conforme especificação da operação |
| `cloud_prob_threshold` | — | Conforme especificação da operação |
| `min_area` | — | Conforme especificação da operação |
| `max_extra_cloud` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `merge_cloud_masks` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

