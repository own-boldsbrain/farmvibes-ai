# JTBDs (land_degradation)

## JTBDs

1. Estimar tendência linear do NDVI ao longo do tempo usando imagens Landsat para avaliar degradação da vegetação
2. Correlacionar tendências de NDVI com dados de precipitação (CHIRPS) para identificar causas climáticas vs. antrópicas

## Descrição

Este notebook computa tendências lineares de NDVI pixel a pixel com imagens Landsat via workflow `farm_ai/land_degradation/landsat_ndvi_trend` e baixa estimativas de chuva CHIRPS para verificar correlação entre declínio vegetativo e precipitação.

## Use Cases

1. **Monitoramento de degradação**: Um órgão ambiental identifica áreas com declínio vegetativo para priorizar recuperação.
2. **Atribuição de causas**: Um pesquisador distingue degradação climática (correlação com chuva) de degradação antrópica (sem correlação).
3. **Planejamento de restauração**: Uma ONG prioriza áreas com tendência negativa de NDVI para projetos de restauração ecológica.

## Faz / Não Faz

- **Faz**: Cálculo de tendência linear NDVI pixel a pixel (inclinação, p-value, R²).
- **Faz**: Download e correlação com precipitação CHIRPS.
- **Faz**: Geração de gráficos de tendência temporal.
- **Não Faz**: Não identifica causas específicas (fogo, desmatamento, pastoreio excessivo).
- **Não Faz**: Requer série temporal mínima de 3+ anos para tendência significativa.

## Notebooks

- land_degradation.ipynb: Tendência NDVI Landsat + precipitação CHIRPS

## Inputs

- input_region.wkt: polígono da região de interesse (ex.: Amazônia)
- Intervalo de datas (anos)

## Outputs

- Raster de tendência linear NDVI (inclinação, p-value, R²)
- Rasters NDVI por período
- Séries temporais de precipitação CHIRPS
- Gráficos de tendência de chuva

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_region.wkt` | string | Polígono da região de interesse (WKT) |
| `time_range` | tuple | Intervalo de datas (anos) |

## Lógicas / Cálculos

1. Download de série temporal Landsat, cálculo de NDVI para cada data.
2. Regressão linear pixel a pixel: `NDVI(t) = β₀ + β₁·t + ε`, gerando rasters de inclinação, p-value e R².
3. Download de precipitação CHIRPS para mesma área/período.
4. Correlação entre tendência NDVI e precipitação para identificar causas climáticas vs. antrópicas.

## Outcomes Esperados

- Mapa de tendência de degradação vegetativa (NDVI declinante).
- Diagnóstico de causa: degradação climática (correlacionada com chuva) vs. antrópica (não correlacionada).
- Série histórica de NDVI e precipitação para validação.

## APIs / Conectores

- **USGS/Planetary Computer**: Download de imagens Landsat.
- **CHIRPS**: Dados de precipitação (UCSB/Climate Hazards Center).

## Datasets / Fontes de Dados

- Landsat 5/7/8: reflectância de superfície (30m).
- CHIRPS: precipitação diária (0.05°).

## Workflows Utilizados

- `farm_ai/land_degradation/landsat_ndvi_trend`
