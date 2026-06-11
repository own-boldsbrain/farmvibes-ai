# JTBDs (harvest_period)

## JTBDs
1. Inferir períodos de germinação e colheita a partir de séries temporais de NDVI
2. Ajustar curva gaussiana assimétrica ao NDVI diário para estimar datas fenológicas

## Descrição
Este notebook utiliza o workflow `farm_ai/agriculture/ndvi_summary` para baixar imagens Sentinel-2, computar NDVI diário sem nuvens e ajustar uma curva Skewed Gaussian para estimar o início da germinação e o fim da colheita.

## Notebooks
- ndvi_summary.ipynb: Estimativa de germinação e colheita via curva ajustada ao NDVI

## Inputs
- input_region.wkt: polígono da região de interesse (ex.: Iowa)
- Intervalo de datas cobrindo safra completa
- Parâmetros: ndvi_threshold (0.15), delta_threshold (0.1)

## Outputs
- CSV com série temporal NDVI diário
- Datas estimadas de início da germinação e fim da colheita
- Gráfico da curva ajustada vs. observações

## Workflows Utilizados
- `farm_ai/agriculture/ndvi_summary`
