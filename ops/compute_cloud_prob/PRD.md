# JTBDs (compute_cloud_prob)

## JTBDs

1. Detectar nuvens em imagens Sentinel-2 L2A automaticamente
2. Produzir máscara de probabilidade de nuvem por pixel para filtragem

## Descrição

Aplica modelo de segmentação convolutional (ONNX) sobre Sentinel-2 L2A para estimar probabilidade de nuvem por pixel, utilizando window sliding com overlap.

## Inputs

- `sentinel_raster: Sentinel2Raster` — imagem Sentinel-2 L2A
- Parâmetros: `downsampling`, `model_path`, `window_size`, `overlap`, `batch_size`, `num_workers`, `in_memory`

## Outputs

- `cloud_probability: Sentinel2CloudProbability` — raster de probabilidade de nuvem

## Lógicas e Cálculos

- Verifica nível de processamento L2A obrigatório
- Cria `ChipDataset` com sliding window (tamanho 512, overlap 25%)
- Executa inferência via ONNX Runtime em batches
- Pós-processamento: softmax sobre logits + regiões nodata marcadas como 100% nuvem
- Reamostra para resolução original via bilinear

## Use Cases
1. **Análise de Cloud Prob**: Gerar camada derivada de Cloud Prob para interpretação.
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
| `sentinel_raster: Sentinel2Raster` | — | Conforme especificação da operação |
| `downsampling` | — | Conforme especificação da operação |
| `model_path` | — | Conforme especificação da operação |
| `window_size` | — | Conforme especificação da operação |
| `overlap` | — | Conforme especificação da operação |
| `batch_size` | — | Conforme especificação da operação |
| `num_workers` | — | Conforme especificação da operação |
| `in_memory` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_cloud_prob` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.
- **ONNX Runtime**: Inferência de modelos de machine learning.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

