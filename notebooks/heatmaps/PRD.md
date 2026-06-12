# JTBDs (heatmaps)

## JTBDs

1. Mapear variabilidade espacial de nutrientes do solo (C, N, P, pH) a partir de amostras georreferenciadas
2. Gerar mapas de fertilidade para aplicação localizada de insumos usando classificação ou interpolação

## Descrição

Três notebooks para criar heatmaps de nutrientes: classificação supervisionada (Random Forest) com amostras do usuário, classificação integrada com ADMAG, e interpolação espacial por vizinhança usando dados de sensores em locais ótimos.

## Use Cases

1. **Agricultura de precisão**: Um produtor mapeia variabilidade de nutrientes (C, N, P, pH) para aplicação localizada de fertilizantes.
2. **Consultoria agronômica**: Um consultor integra dados ADMAG com classificação Random Forest para recomendar correção de solo.
3. **Amostragem inteligente**: Um pesquisador usa interpolação espacial para reduzir número de amostras de solo necessárias.

## Faz / Não Faz

- **Faz**: Classificação supervisionada (Random Forest) de nutrientes do solo.
- **Faz**: Integração com ADMAG para heatmaps enriquecidos.
- **Faz**: Interpolação espacial (cluster overlap, nearest/kriging neighbor).
- **Não Faz**: Não coleta amostras de solo — depende de dados fornecidos pelo usuário.
- **Não Faz**: Não valida resultados com análise laboratorial.

## Notebooks

- nutrients_using_classification.ipynb: Heatmap por classificação com Random Forest
- nutrients_using_classification_admag.ipynb: Heatmap integrado com Azure Data Manager for Agriculture
- nutrients_using_neighbors.ipynb: Heatmap por interpolação espacial (cluster overlap, nearest/kriging neighbor)

## Inputs

- sensor_farm_boundary.geojson: limite da fazenda
- sensor_samples.geojson: amostras de solo com atributos (C, N, P, pH)
- Parâmetros: índice espectral (EVI, PRI), bins, algorithm, buffer

## Outputs

- ZIP com shapefiles dos clusters/heatmap por nutriente

## Variáveis

| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| `index` | string | EVI | Índice espectral (EVI, PRI) |
| `bins` | int | — | Número de bins para classificação |
| `algorithm` | string | random_forest | Algoritmo (classificação ou interpolação) |
| `buffer` | float | — | Buffer em metros |

## Lógicas / Cálculos

1. **Classificação (Random Forest)**: Treina modelo com amostras de solo + índices espectrais, prediz nutrientes para toda a área.
2. **Classificação ADMAG**: Mesmo pipeline com dados enriquecidos pelo Azure Data Manager for Agriculture.
3. **Interpolação espacial**: Cluster overlap + nearest/kriging neighbor para estimar nutrientes em locais não amostrados.

## Outcomes Esperados

- Mapas de fertilidade do solo (heatmaps) por nutriente.
- Recomendação de aplicação localizada de insumos.
- Redução de custos com fertilizantes via aplicação taxa variável.

## APIs / Conectores

- **Planetary Computer API**: Download de Sentinel-2 para índices espectrais.
- **ADMAG** (Azure Data Manager for Agriculture): Dados agronômicos enriquecidos (opcional).

## Datasets / Fontes de Dados

- Amostras de solo fornecidas pelo usuário (C, N, P, pH) em formato GeoJSON.
- Sentinel-2: índices espectrais (EVI, PRI) para classificação.
- ADMAG: dados agronômicos (opcional).

## Workflows Utilizados

- `farm_ai/agriculture/heatmap_using_classification`
- `farm_ai/agriculture/heatmap_using_classification_admag`
- `farm_ai/agriculture/heatmap_using_neighboring_data_points`
