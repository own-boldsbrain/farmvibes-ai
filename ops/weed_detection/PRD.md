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

## Use Cases
1. **Automação**: Treina um Gaussian Mixture Model (GMM) sobre amostras aleatórias de pixels do raster (buffer interno para evitar bordas) de forma programática e escalável.
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
| `raster` | — | Conforme especificação da operação |
| `buffer` | — | Conforme especificação da operação |
| `clusters` | — | Conforme especificação da operação |
| `sieve_size` | — | Conforme especificação da operação |
| `simplify` | — | Conforme especificação da operação |
| `tolerance` | — | Conforme especificação da operação |
| `samples` | — | Conforme especificação da operação |
| `bands` | — | Conforme especificação da operação |

## Outcomes Esperados

- Arquivo compactado (ZIP) com resultados prontos para download.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `weed_detection` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Scikit-learn (GMM)**: Clusterização Gaussiana.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

