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
