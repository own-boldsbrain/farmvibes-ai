# JTBDs (linear_trend)

## JTBDs
1. Detectar tendência linear pixel-a-pixel ao longo do tempo
2. Produzir mapa de declive e significância estatística da tendência

## Descrição
Ajusta modelo linear (`y = at + b`) para cada pixel ao longo de múltiplos rasters temporais, gerando duas bandas: coeficiente angular (trend) e estatística de teste t.

## Inputs
- `series: RasterChunk` — chunk de referência (define limites espaciais)
- `rasters: List[Raster]` — rasters ordenados no tempo

## Outputs
- `trend: RasterChunk` — trend e test_stat por banda

## Lógicas e Cálculos
- Lê série temporal de chunks via `read_chunk_series`
- Constrói matriz A (tempo normalizado em dias + bias)
- Estima β = (AᵀA)⁻¹AᵀB via mínimos quadrados, ignorando NaN
- Calcula estatística t: β₀ / (σ̂² · γ) onde γ = (AᵀA)⁻¹₀₀
- Bandas de saída: `trend_{band}` e `test_stat_{band}`

## Use Cases
1. **Automação**: Ajusta modelo linear (`y = at + b`) para cada pixel ao longo de múltiplos rasters temporais, gerando duas bandas: coeficiente angular (trend) e estatística de teste t de forma programática e escalável.
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
| `series: RasterChunk` | — | Conforme especificação da operação |
| `rasters: List[Raster]` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `linear_trend` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

