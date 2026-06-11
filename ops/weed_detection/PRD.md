# JTBDs (Weed Detection)

## JTBDs

1. Detectar plantas daninhas em imagens multiespectrais via clusterização GMM
2. Converter regiões clusterizadas em polígonos vetoriais simplificados

## Descrição

Treina um Gaussian Mixture Model (GMM) sobre amostras aleatórias de pixels do raster (buffer interno para evitar bordas). Prediz a classe de todos os pixels, aplica filtro `sieve` para remover regiões pequenas, e converte cada cluster em shapes GeoJSON. As saídas são zipadas em um archive.

## Inputs

- `raster`: `Raster`
- Parâmetros: `buffer`, `clusters`, `sieve_size`, `simplify`, `tolerance`, `samples`, `bands`, `alpha_index`

## Outputs

- `result`: `DataVibe`

## Lógicas e Cálculos

- `OpenedRaster`: carrega raster com mask pela geometria, aplica `buffer_mask` e `alpha_mask`
- `train_model`: amostra `samples` pixels aleatórios, treina `GaussianMixture(n_components=clusters)`
- `predict`: classifica todos os pixels, `sieve(result, sieve_size)`, converte cada cluster para shapes
- Simplificação: `simplify(tolerance)`, `convex_hull` ou `none`
- Cria archive zip com todos os shapefiles de cluster
