# JTBDs (weed_detection)

## JTBDs

1. Detectar e mapear regiões com coloração similar em imagens de satélite/drone para identificar possíveis focos de ervas daninhas
2. Treinar Gaussian Mixture Model (GMM) sobre subconjunto amostrado dos pixels da imagem
3. Clusterizar todos os pixels da imagem e converter clusters em polígonos (shapefiles) para aplicação localizada de defensivos

## Descrição

Notebook que demonstra a detecção de ervas daninhas via clusterização não-supervisionada (GMM). O usuário fornece uma URL para um raster remoto (GeoTIFF) e uma geometria de interesse. O workflow baixa o raster, treina um GMM sobre uma amostra dos pixels, clusteriza a imagem completa e gera shapefiles por cluster. Ideal para identificar plantas daninhas ou regiões com assinatura espectral distinta sem necessidade de dados de treinamento rotulados.

## Use Cases

1. **Agricultura de precisão**: Um agricultor identifica focos de plantas daninhas para aplicação localizada de herbicidas, reduzindo custos e impacto ambiental.
2. **Mapeamento de infestação**: Um consultor mapeia áreas de infestação em lavouras para planejamento de manejo integrado.
3. **Monitoramento pós-aplicação**: Um agrônomo verifica a eficácia de herbicidas comparando mapas de cluster antes e depois da aplicação.

## Faz / Não Faz

- **Faz**: Ingestão de raster remoto via URL (SAS, armazenamento cloud).
- **Faz**: Treinamento de GMM sobre subconjunto amostrado dos pixels.
- **Faz**: Clusterização de todos os pixels da imagem.
- **Faz**: Conversão de clusters em polígonos (shapefiles) com simplificação geométrica.
- **Não Faz**: Não identifica espécies específicas de ervas daninhas.
- **Não Faz**: Não recomenda herbicidas ou dosagens.
- **Não Faz**: Não requer dados de treinamento rotulados (não-supervisionado).

## Notebooks

- `weed_detection.ipynb`: Detecção de ervas daninhas via GMM em imagens de drone/satélite

## Inputs

- URL do raster remoto (signed URL / SAS para GeoTIFF)
- Geometria da área de interesse (arquivo shapefile)
- Parâmetros: `buffer`, `no_data`, `clusters` (nº de clusters GMM), `sieve_size`, `simplify`, `tolerance`, `samples` (nº amostras para treino), `bands`, `alpha_index`

## Outputs

- ZIP com shapefiles por cluster (arquivos .shp, .shx, .dbf, .prj)

## Variáveis

| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| `clusters` | int | 3 | Número de clusters GMM |
| `samples` | int | 100000 | Nº de amostras para treino do GMM |
| `sieve_size` | int | 50 | Tamanho mínimo (pixels) para manter um polígono |
| `simplify` | float | 1.0 | Tolerância de simplificação de polígonos |
| `buffer` | int | 0 | Buffer em metros ao redor da geometria |
| `no_data` | int | 0 | Valor de no-data no raster |
| `bands` | list | todas | Bandas do raster a usar no GMM |

## Lógicas / Cálculos

1. `download_raster` — Baixa o raster remoto da URL fornecida.
2. `weed_detection` (GMM) — Amostra `samples` pixels, treina Gaussian Mixture Model com `clusters` componentes, clusteriza todos os pixels, converte regiões clusterizadas em polígonos, simplifica geometrias com `simplify` e aplica `sieve_size`.

## Outcomes Esperados

- Shapefiles delimitando regiões com assinatura espectral homogênea (prováveis focos de ervas daninhas).
- Mapa de infestação para aplicação diferenciada de defensivos agrícolas.
- Redução de insumos (herbicidas) com aplicação localizada.

## Workflows Utilizados

- `farm_ai/agriculture/weed_detection`

## APIs / Conectores

- **N/A** (ingestão de raster do usuário via URL/SAS).

## Datasets / Fontes de Dados

- Raster GeoTIFF fornecido pelo usuário (drone RGB ou satélite multiespectral).
- Nenhuma fonte de dados externa adicional.
