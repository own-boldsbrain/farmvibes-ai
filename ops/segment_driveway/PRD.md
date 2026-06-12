# JTBDs (Segment Driveway)

## JTBDs
1. Segmentar frentes de casas em imagens de satélite usando modelo ONNX
2. Classificar pixels em Background, Driveway e Unknown

## Descrição
Executa inferência de um modelo ONNX de segmentação semântica (driveway.onnx) sobre um raster de entrada. O raster é recortado em chips com overlap, pré-processado (downsampling, seleção de bandas NIR-R-G, realce de contraste), passado pelo modelo, e pós-processado (argmax, reassemblagem). A saída é um `CategoricalRaster` com 3 categorias.

## Inputs
- `input_raster`: `Raster`
- Parâmetros: `downsampling`, `model_path`, `window_size`, `model_size`, `overlap`, `batch_size`, `num_workers`

## Outputs
- `segmentation_raster`: `CategoricalRaster`

## Lógicas e Cálculos
- `ChipDataset` com `chip_size` e `step_size = chip_size * (1 - overlap)`, downsampling configurável
- Reader lê bandas [4, 1, 2] (NIR, Blue, Green), máscara de nodata
- `pre_process`: redimensiona para `model_size` com `bilinear`, realce de contraste (percentis 2-98)
- `post_process`: redimensiona saída para `window_size`, `argmax(axis=1)` → classe
- `predict_chips` com ONNX Runtime InferenceSession
- Reamostra predição para resolução original com `resample_raster` (nearest)

## Use Cases
1. **Automação**: Executa inferência de um modelo ONNX de segmentação semântica (driveway de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_raster` | — | Conforme especificação da operação |
| `downsampling` | — | Conforme especificação da operação |
| `model_path` | — | Conforme especificação da operação |
| `window_size` | — | Conforme especificação da operação |
| `model_size` | — | Conforme especificação da operação |
| `overlap` | — | Conforme especificação da operação |
| `batch_size` | — | Conforme especificação da operação |
| `num_workers` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `segment_driveway` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **ONNX Runtime**: Inferência de modelos de machine learning.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

