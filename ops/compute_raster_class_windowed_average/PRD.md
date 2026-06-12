# JTBDs (compute_raster_class_windowed_average)

## JTBDs

1. Calcular elevação média por classe de solo em janelas deslizantes
2. Suavizar variações locais de elevação agrupadas por cluster

## Descrição

Calcula a média de elevação (z-score) por classe de cluster em janelas deslizantes, combinando DEM e raster de classificação via convoluções PyTorch.

## Inputs

- `input_dem_raster: Raster` — DEM (elevação)
- `input_cluster_raster: Raster` — raster de classes
- Parâmetro: `window_size` (padrão 41)

## Outputs

- `output_raster: Raster` — elevação média por classe por janela

## Lógicas e Cálculos

- Downscale 4x via interpolate (bilinear para DEM, nearest para cluster)
- Calcula z-score do DEM em janelas: `conv2d` com kernel ones
- Para cada classe: soma da elevação mascarada / contagem de pixels da classe na janela
- Upsample para resolução original via bilinear

## Use Cases
1. **Análise de Raster Class Windowed Average**: Gerar camada derivada de Raster Class Windowed Average para interpretação.
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
| `input_dem_raster: Raster` | — | Conforme especificação da operação |
| `input_cluster_raster: Raster` | — | Conforme especificação da operação |
| `window_size` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_raster_class_windowed_average` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

