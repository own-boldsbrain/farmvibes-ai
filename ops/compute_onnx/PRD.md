# JTBDs (compute_onnx)

## JTBDs

1. Executar inferência de modelos ONNX arbitrários sobre rasters
2. Processar rasters inteiros, sequências ou chunks com sliding window

## Descrição

Operação genérica de inferência ONNX. Suporta três modos: raster completo (`compute_onnx`), chunks (`compute_onnx_from_chunks`) e sequências (`compute_onnx_from_sequence`).

## Inputs

- `input_raster: Raster | RasterSequence | List[Raster]` — dados de entrada
- `chunk: RasterChunk` (opcional, modo chunks)
- Parâmetros: `model_file`, `window_size`, `overlap`, `batch_size`, `num_workers`, `nodata`, `skip_nodata`, `resampling`, `downsampling`

## Outputs

- `output_raster: Raster | RasterChunk` — resultado da inferência

## Lógicas e Cálculos

- Converte entrada para lista de rasters (se RasterSequence)
- Cria `StackOnChannelsChipDataset` com sliding window
- Inferência via ONNX Runtime em batches
- Reamostragem para resolução original (bilinear ou nearest)
- Retorna Raster ou RasterChunk conforme modo

## Use Cases
1. **Análise de Onnx**: Gerar camada derivada de Onnx para interpretação.
2. **Feature engineering**: Produzir insumos para modelos de machine learning.
3. **Monitoramento temporal**: Calcular o índice/variável para múltiplas datas e comparar.

## Faz / Não Faz

- **Faz**: Cálculo da variável/algoritmo sobre os dados de entrada.
- **Faz**: Parametrização configurável pelo usuário.
- **Não Faz**: Não valida os resultados contra dados de campo/ground truth.
- **Não Faz**: Não modifica o raster de entrada — gera novo raster de saída.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_raster: Raster | RasterSequence | List[Raster]` | — | Conforme especificação da operação |
| `chunk: RasterChunk` | — | Conforme especificação da operação |
| `model_file` | — | Conforme especificação da operação |
| `window_size` | — | Conforme especificação da operação |
| `overlap` | — | Conforme especificação da operação |
| `batch_size` | — | Conforme especificação da operação |
| `num_workers` | — | Conforme especificação da operação |
| `nodata` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_onnx` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **ONNX Runtime**: Inferência de modelos de machine learning.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

