# JTBDs (compute_shadow_prob)

## JTBDs

1. Detectar sombras em imagens Sentinel-2 L2A
2. Produzir máscara de probabilidade de sombra para correção radiométrica

## Descrição

Aplica modelo de segmentação convolutional (ONNX) FPN (Feature Pyramid Network) sobre Sentinel-2 L2A para estimar probabilidade de sombra por pixel.

## Inputs

- `sentinel_raster: Sentinel2Raster` — imagem Sentinel-2 L2A
- Parâmetros: `downsampling`, `model_path`, `window_size`, `overlap`, `batch_size`, `num_workers`, `in_memory`

## Outputs

- `shadow_probability: Sentinel2CloudProbability` — raster de probabilidade de sombra

## Lógicas e Cálculos

- Verifica nível de processamento L2A obrigatório
- Pré-processamento: escala o chip_data pelo factor de scale do raster
- Sliding window (512px, overlap 25%) com downsampling
- Inferência ONNX, sigmoid nas saídas
- Regiões nodata marcadas como 100% sombra
- Reamostragem bilinear para resolução original

## Use Cases
1. **Análise de Shadow Prob**: Gerar camada derivada de Shadow Prob para interpretação.
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

- Operação atômica `compute_shadow_prob` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.
- **ONNX Runtime**: Inferência de modelos de machine learning.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

