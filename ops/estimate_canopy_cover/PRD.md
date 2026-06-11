# JTBDs (estimate_canopy_cover)

## JTBDs
1. Estimar cobertura de dossel a partir de índices espectrais
2. Converter NDVI em fração de cobertura vegetal via calibração

## Descrição
Aplica regressor linear com features polinomiais de grau 3 sobre índices espectrais (ex.: NDVI) para estimar fração de cobertura de dossel, com pesos pré-computados.

## Inputs
- `indices: List[Raster]` — lista de rasters de índices espectrais
- Parâmetro: `index` (padrão "ndvi")

## Outputs
- `estimated_canopy_cover: List[Raster]` — cobertura de dossel estimada (0-1)

## Lógicas e Cálculos
- Constrói pipeline: `PolynomialFeatures(degree=3) + Ridge`
- Carrega coeficientes e intercept pré-treinados para o índice
- Aplica predict sobre valores não mascarados
- Clipping em [0, 1] e preservação de metadados geoespaciais
