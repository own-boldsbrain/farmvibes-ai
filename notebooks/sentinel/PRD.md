# JTBDs (sentinel)

## JTBDs

1. Download e pré-processamento de dados Sentinel-2 para uma região e período
2. Cálculo de múltiplos índices espectrais (NDVI, EVI, NDMI, NDRE, RECI, NDWI, LSWI) a partir de Sentinel-2
3. Geração de imagens Sentinel-2 sem nuvens via SpaceEye
4. Listagem e download de produtos Sentinel-1 disponíveis
5. Visualização de timelapse SpaceEye + NDVI ao longo do tempo

## Descrição

Conjunto de 4 notebooks que demonstram o ecossistema de dados Sentinel no FarmVibes.AI: download e pré-processamento de Sentinel-2 (máscaras de nuvem, reflectância), cálculo de índices espectrais, aplicação de SpaceEye para remoção de nuvens, listagem de produtos Sentinel-1 e geração de timelapses animados.

## Use Cases

1. **Monitoramento agrícola**: Um produtor calcula NDVI semanal para acompanhar vigor vegetativo da safra.
2. **Detecção de desmatamento**: Um órgão ambiental gera timelapse SpaceEye para visualizar perda florestal ao longo de anos.
3. **Pesquisa agronômica**: Um pesquisador computa 7 índices espectrais simultaneamente para análise multivariada de culturas.
4. **Planejamento de imageamento**: Um consultor lista produtos Sentinel-1 disponíveis para uma área antes de contratar imageamento.

## Faz / Não Faz

- **Faz**: Download e máscara de nuvens/sombra de Sentinel-2.
- **Faz**: Cálculo de NDVI, EVI, NDMI, NDRE, RECI, NDWI, LSWI.
- **Faz**: Interpolação SpaceEye para imagens sem nuvens.
- **Faz**: Listagem de produtos Sentinel-1 disponíveis (via SciHub).
- **Faz**: Geração de timelapse animado (SpaceEye e NDVI).
- **Não Faz**: Não faz classificação ou segmentação automática.
- **Não Faz**: Não suporta sensores ópticos diferentes de Sentinel-2.

## Notebooks

- `spectral_indices.ipynb`: Cálculo de 7 índices espectrais com workflow customizado
- `field_level_spectral_indices.ipynb`: Evolução temporal de índices em nível de campo agrícola
- `sentinel_spaceeye.ipynb`: Download Sentinel-2/1 e SpaceEye para análise de desmatamento
- `timelapse_visualization.ipynb`: Geração de timelapse animado SpaceEye + NDVI

## Inputs

- Geometria de interesse (WKT ou shapely)
- Período de tempo (datatime range)
- Planetary Computer API key (pc_key)
- Parâmetros: índices espectrais desejados, buffer, max_cloud_cover
- Para Sentinel-1: scihub_user e scihub_password

## Outputs

- Rasters de reflectância Sentinel-2 (bandas individuais ou empilhadas)
- Rasters de índices espectrais (NDVI, EVI, NDMI, NDRE, RECI, NDWI, LSWI)
- Imagens SpaceEye (sem nuvens)
- Lista de produtos Sentinel-1 disponíveis
- GIF/MP4 de timelapse temporal

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `pc_key` | string | Chave de API do Planetary Computer |
| `index` | string | Nome do índice espectral (ndvi, evi, etc.) |
| `scihub_user` | string | Usuário Copernicus SciHub (Sentinel-1) |
| `scihub_password` | string | Senha Copernicus SciHub (Sentinel-1) |

## Lógicas / Cálculos

1. `preprocess_s2` — Download e pré-processamento Sentinel-2 com máscaras de nuvem.
2. `index` — Cálculo de índice espectral sobre raster (fórmula: (NIR - R) / (NIR + R) para NDVI, etc.).
3. `spaceeye_interpolation` — Interpolação temporal para remoção de nuvens.
4. `list_sentinel1_products` — Consulta ao catálogo SciHub para listar cenas S1 disponíveis.

## Outcomes Esperados

- Série temporal de reflectância e índices espectrais para análise multivariada.
- Imagens sem nuvens para qualquer período via SpaceEye.
- Visualização temporal da evolução da vegetação.
- Catálogo de produtos Sentinel-1 disponíveis para tomada de decisão.

## Workflows Utilizados

- `data_ingestion/sentinel2/preprocess_s2`
- `data_ingestion/sentinel2/preprocess_s2_improved_masks`
- `data_ingestion/spaceeye/spaceeye_interpolation`
- `data_processing/index/index`
- `data_ingestion/sentinel1/list_s1_products`
- `list_sentinel2_products` (listagem)

## APIs / Conectores

- **Planetary Computer API**: Download de cenas Sentinel-2.
- **Copernicus SciHub**: Listagem de produtos Sentinel-1.
- **SpaceEye**: Algoritmo proprietário de interpolação para remoção de nuvens.

## Datasets / Fontes de Dados

- Sentinel-2 (MSI, 10-60m, 13 bandas espectrais)
- Sentinel-1 (SAR C-band, GRD)
- SpaceEye (imagens diárias sem nuvens, geradas pelo FarmVibes.AI)
