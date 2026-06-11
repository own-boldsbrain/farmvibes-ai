# JTBDs (land_degradation)

## JTBDs
1. Estimar tendência linear do NDVI ao longo do tempo usando imagens Landsat para avaliar degradação da vegetação
2. Correlacionar tendências de NDVI com dados de precipitação (CHIRPS) para identificar causas climáticas vs. antrópicas

## Descrição
Este notebook computa tendências lineares de NDVI pixel a pixel com imagens Landsat via workflow `farm_ai/land_degradation/landsat_ndvi_trend` e baixa estimativas de chuva CHIRPS para verificar correlação entre declínio vegetativo e precipitação.

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

## Workflows Utilizados
- `farm_ai/land_degradation/landsat_ndvi_trend`
