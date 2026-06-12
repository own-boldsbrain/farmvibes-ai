# JTBDs (compute_conservation_practice)

## JTBDs

1. Classificar pixels como terraço ou canal escoadouro gramado
2. Mapear práticas conservacionistas no terreno a partir de elevação

## Descrição

Usa modelo CNN (ONNX) sobre gradiente de elevação e elevação média para classificar cada pixel em terraços ou canais escoadouros gramados.

## Inputs

- `elevation_gradient: Raster` — gradiente de elevação
- `average_elevation: Raster` — elevação média
- Parâmetros: `downsampling`, `model_path`, `window_size`, `overlap`, `batch_size`, `num_workers`

## Outputs

- `output_raster: Raster` — raster classificado (argmax das probabilidades)

## Lógicas e Cálculos

- Empilha os dois rasters como canais de entrada
- Sliding window (512px, overlap 25%) com downsampling
- Inferência via ONNX Runtime
- Pós-processamento: argmax ao longo do eixo das classes
- Reamostragem nearest-neighbor para resolução original

## Use Cases
1. **Análise de Conservation Practice**: Gerar camada derivada de Conservation Practice para interpretação.
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
| `elevation_gradient: Raster` | — | Conforme especificação da operação |
| `average_elevation: Raster` | — | Conforme especificação da operação |
| `downsampling` | — | Conforme especificação da operação |
| `model_path` | — | Conforme especificação da operação |
| `window_size` | — | Conforme especificação da operação |
| `overlap` | — | Conforme especificação da operação |
| `batch_size` | — | Conforme especificação da operação |
| `num_workers` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_conservation_practice` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **ONNX Runtime**: Inferência de modelos de machine learning.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

