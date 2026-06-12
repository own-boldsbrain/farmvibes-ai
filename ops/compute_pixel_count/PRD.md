# JTBDs (compute_pixel_count)

## JTBDs

1. Contar frequência de valores de pixel em um raster
2. Produzir histograma de classes para análises de mudança

## Descrição

Conta valores únicos de pixel em todas as bandas do raster de entrada, gerando arquivo CSV com valores e contagens. Utiliza a geometria do raster para mascaramento.

## Inputs

- `raster: Raster` — raster a ser analisado

## Outputs

- `pixel_count: RasterPixelCount` — contagem de pixels por valor único (CSV)

## Lógicas e Cálculos

- Abre raster com rasterio, aplica máscara pela geometria
- Usa `np.unique(data, return_counts=True)` para contar
- Salva resultado em CSV com colunas `unique_values` e `counts`

## Use Cases
1. **Análise de Pixel Count**: Gerar camada derivada de Pixel Count para interpretação.
2. **Feature engineering**: Produzir insumos para modelos de machine learning.
3. **Monitoramento temporal**: Calcular o índice/variável para múltiplas datas e comparar.

## Faz / Não Faz

- **Faz**: Cálculo da variável/algoritmo sobre os dados de entrada.
- **Não Faz**: Não valida os resultados contra dados de campo/ground truth.
- **Não Faz**: Não modifica o raster de entrada — gera novo raster de saída.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `raster: Raster` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_pixel_count` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

