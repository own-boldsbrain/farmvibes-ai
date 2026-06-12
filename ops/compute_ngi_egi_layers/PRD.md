# JTBDs (compute_ngi_egi_layers)

## JTBDs

1. Calcular NGI (Normalized Green Index) e EGI (Evaporative Green Index)
2. Produzir camadas LST calibradas para modelo de irrigação

## Descrição

Processa bandas Landsat (green, nir, lwir11), NDVI e fração evaporativa para gerar NGI, EGI e LST, todas mascaradas por cloud_water_mask.

## Inputs

- `landsat_raster: LandsatRaster` — bandas green, nir, lwir11
- `ndvi_raster: Raster` — NDVI
- `evaporative_fraction: Raster` — fração evaporativa
- `cloud_water_mask_raster: Raster` — máscara

## Outputs

- `ngi: Raster` — NGI = NDVI * GI
- `egi: Raster` — EGI = EF / GI
- `lst: Raster` — LST calibrada

## Lógicas e Cálculos

- Aplica scale/offset: LST = lwir11 * 0.00341802 + 149; bandas = banda * 0.0000275 - 0.2
- Green Index (GI) = NIR / Green
- NGI = NDVI * GI; EGI = EF / GI
- Aplica cloud_water_mask nas três camadas de saída

## Use Cases
1. **Análise de Ngi Egi Layers**: Gerar camada derivada de Ngi Egi Layers para interpretação.
2. **Feature engineering**: Produzir insumos para modelos de machine learning.
3. **Monitoramento temporal**: Calcular o índice/variável para múltiplas datas e comparar.

## Faz / Não Faz

- **Faz**: Cálculo da variável/algoritmo sobre os dados de entrada.
- **Não Faz**: Não valida os resultados contra dados de campo/ground truth.
- **Não Faz**: Não modifica o raster de entrada — gera novo raster de saída.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `landsat_raster: LandsatRaster` | — | Conforme especificação da operação |
| `ndvi_raster: Raster` | — | Conforme especificação da operação |
| `evaporative_fraction: Raster` | — | Conforme especificação da operação |
| `cloud_water_mask_raster: Raster` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_ngi_egi_layers` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **USGS/EROS**: Catálogo e download de imagens Landsat.

## Datasets / Fontes de Dados

- **Landsat 5/7/8/9**: Reflectância de superfície, 30m (15m pancromático).

