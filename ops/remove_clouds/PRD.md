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

## Use Cases
1. **Automação**: Executa o modelo SpaceEye (ONNX ou interpolação) para remover nuvens de sequências Sentinel-2, combinando com dados Sentinel-1 SAR e máscaras de nuvem, produzindo uma SpaceEyeRasterSequence de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Faz**: Opera sobre sequências de dados de forma estruturada.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `s1_products` | — | Conforme especificação da operação |
| `s2_products` | — | Conforme especificação da operação |
| `cloud_masks` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `remove_clouds` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.
- **ONNX Runtime**: Inferência de modelos de machine learning.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

