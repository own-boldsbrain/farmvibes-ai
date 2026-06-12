# JTBDs (compute_evaporative_fraction)

## JTBDs

1. Estimar fração evaporativa para cálculo de evapotranspiração
2. Identificar pixels quentes e frios para balanço de energia

## Descrição

Implementa o método SSEB (Senay et al., 2013) para calcular fração evaporativa usando LST corrigido por DEM, NDVI e máscara de nuvem/água.

## Inputs

- `landsat_raster: LandsatRaster` — banda lwir11 (LST)
- `dem_raster: Raster` — modelo digital de elevação
- `ndvi_raster: Raster` — NDVI
- `cloud_water_mask_raster: Raster` — máscara de nuvem/água
- Parâmetro: `ndvi_hot_threshold` (padrão 0.02)

## Outputs

- `evaporative_fraction: Raster` — fração evaporativa

## Lógicas e Cálculos

- LST = (lwir11 * 0.00341802) + 149; corrige com lapse rate (0.0065 * DEM)
- Seleciona hot pixels: LST entre P90 e P95 com NDVI < P01
- Seleciona cold pixels: LST entre P02 e P04 com NDVI > P90
- Remove agrupamentos menores que 9 pixels via connected components
- etrf = (NDVI * K1 / K2) + LP; EF = etrf * (hot - LST) / (hot - cold)

## Use Cases
1. **Análise de Evaporative Fraction**: Gerar camada derivada de Evaporative Fraction para interpretação.
2. **Feature engineering**: Produzir insumos para modelos de machine learning.
3. **Monitoramento temporal**: Calcular o índice/variável para múltiplas datas e comparar.

## Faz / Não Faz

- **Faz**: Cálculo da variável/algoritmo sobre os dados de entrada.
- **Faz**: Parametrização configurável pelo usuário.
- **Não Faz**: Não valida os resultados contra dados de campo/ground truth.
- **Não Faz**: Não modifica o raster de entrada — gera novo raster de saída.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `landsat_raster: LandsatRaster` | — | Conforme especificação da operação |
| `dem_raster: Raster` | — | Conforme especificação da operação |
| `ndvi_raster: Raster` | — | Conforme especificação da operação |
| `cloud_water_mask_raster: Raster` | — | Conforme especificação da operação |
| `ndvi_hot_threshold` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_evaporative_fraction` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

