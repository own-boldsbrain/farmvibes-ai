# JTBDs (compute_cloud_water_mask)

## JTBDs

1. Mascarar pixels contaminados por nuvem e corpos d'água
2. Produzir máscara binária "limpa" para análises posteriores

## Descrição

Combina a banda `qa_pixel` do Landsat (bits de nuvem) com um limiar de NDVI para identificar água, gerando máscara onde 1 = pixel válido e 0 = nuvem ou água.

## Inputs

- `landsat_raster: LandsatRaster` — raster Landsat com banda qa_pixel
- `ndvi_raster: Raster` — raster NDVI
- Parâmetro: `ndvi_threshold` (padrão 0.0)

## Outputs

- `cloud_water_mask: Raster` — máscara binária (1 = limpo, 0 = nuvem/água)

## Lógicas e Cálculos

- Extrai banda `qa_pixel` e verifica bit 6 (cloud dilated)
- Marca pixels com nuvem como NaN
- NDVI ≤ threshold → assume água → NaN
- Multiplica as duas máscaras: resultado 1 só onde ambas são 1

## Use Cases
1. **Análise de Cloud Water Mask**: Gerar camada derivada de Cloud Water Mask para interpretação.
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
| `ndvi_raster: Raster` | — | Conforme especificação da operação |
| `ndvi_threshold` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_cloud_water_mask` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **USGS/EROS**: Catálogo e download de imagens Landsat.

## Datasets / Fontes de Dados

- **Landsat 5/7/8/9**: Reflectância de superfície, 30m (15m pancromático).

