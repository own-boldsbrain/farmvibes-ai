# JTBDs (ensemble_cloud_prob)

## JTBDs
1. Combinar previsões de múltiplos modelos de nuvem em uma única máscara
2. Reduzir falsos positivos por ensemble (média)

## Descrição
Calcula a média pixel-a-pixel das probabilidades de nuvem de 5 modelos independentes, gerando uma máscara ensemble mais robusta.

## Inputs
- `cloud1..cloud5: Sentinel2CloudProbability` — 5 máscaras de probabilidade

## Outputs
- `cloud_probability: Sentinel2CloudProbability` — máscara ensemble

## Lógicas e Cálculos
- Carrega os 5 rasters de probabilidade
- Concatena ao longo do eixo "band" e calcula a média
- Salva raster resultante como novo asset
