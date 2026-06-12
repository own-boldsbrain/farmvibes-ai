# JTBDs (irrigation)

## JTBDs
1. Classificar campos agrícolas como irrigados ou não-irrigados usando imagens de satélite
2. Gerar mapas de probabilidade de irrigação em nível de pixel e de campo

## Descrição
Dois notebooks: um combina segmentação de campos com classificação de irrigação via balanço energético (LST, NDVI, GI, ETRF) e regressão logística; outro estima probabilidade de irrigação usando workflow específico em nível de campo segmentado.

## Use Cases

1. **Gestão de recursos hídricos**: Um órgão ambiental mapeia áreas irrigadas vs. não-irrigadas para outorga de uso da água.
2. **Agricultura de precisão**: Um produtor identifica campos irrigados para otimizar manejo hídrico.
3. **Planejamento energético**: Uma concessionária estima demanda de energia para bombeamento de irrigação.

## Faz / Não Faz

- **Faz**: Classificação de irrigação via balanço energético (LST, NDVI, GI, ETRF).
- **Faz**: Segmentação de campos antes da classificação.
- **Faz**: Regressão logística para probabilidade de irrigação.
- **Não Faz**: Não quantifica volume de água aplicado.
- **Não Faz**: Requer imagens Landsat 8 (banda térmica) para LST.

## Notebooks
- irrigation_classification.ipynb: Classificação de irrigação com Landsat 8, índices NGI/EGI e LST
- field_level_irrigation_classification.ipynb: Probabilidade de irrigação em campos segmentados

## Inputs
- Coordenadas (lat/lon) e data de interesse
- Buffer radius e max cloud cover
- Geometria do campo segmentado

## Outputs
- Mapa de probabilidade de irrigação (raster)
- Sumário por campo (estatísticas de probabilidade)

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `buffer_radius` | float | Raio de buffer em metros |
| `max_cloud_cover` | float | Máximo de cobertura de nuvens (%) |
| `lat` | float | Latitude do ponto de interesse |
| `lon` | float | Longitude do ponto de interesse |

## Lógicas / Cálculos

1. Segmentação de campos (workflow `segment_s2`) para delimitar talhões.
2. Cálculo de variáveis de balanço energético: LST (temperatura da superfície), NDVI, GI (greenness index), ETRF (fração evaporativa).
3. Regressão logística para classificar cada campo como irrigado ou não-irrigado.
4. Geração de mapa de probabilidade de irrigação em nível de pixel e campo.

## Outcomes Esperados

- Mapa binário (irrigado/não-irrigado) ou probabilístico de irrigação.
- Estatísticas por campo segmentado para tomada de decisão.
- Subsídio para gestão de recursos hídricos e outorga.

## APIs / Conectores

- **Planetary Computer API / USGS**: Download de imagens Landsat 8.

## Datasets / Fontes de Dados

- Landsat 8: bandas ópticas e termal (LST).
- Sentinel-2: índices espectrais.
- Shapefiles de campos segmentados (gerados pelo workflow).

## Workflows Utilizados
- `farm_ai/water/irrigation_classification`
- `farm_ai/segmentation/segment_s2`
