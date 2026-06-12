# JTBDs (compute_irrigation_probability)

## JTBDs

1. Identificar pixels com irrigação ativa
2. Produzir mapa de probabilidade de irrigação para agricultura

## Descrição

Aplica regressão logística otimizada com coeficientes pré-definidos sobre as camadas NGI, EGI e LST para estimar probabilidade de irrigação por pixel.

## Inputs

- `landsat_raster: LandsatRaster` — raster de referência Landsat
- `ngi: Raster` — NGI (Normalized Green Index)
- `egi: Raster` — EGI (Evaporative Green Index)
- `lst: Raster` — temperatura da superfície
- `cloud_water_mask_raster: Raster` — máscara de nuvem/água
- Parâmetros: `coef_ngi`, `coef_egi`, `coef_lst`, `intercept`

## Outputs

- `irrigation_probability: Raster` — probabilidade de irrigação (0-1)

## Lógicas e Cálculos

- Pré-processa valores (NaN/Inf → 0)
- Padroniza com StandardScaler
- Aplica `LogisticRegression` com coeficientes fixos e intercept
- Multiplica probabilidade pela máscara cloud_water_mask

## Use Cases
1. **Análise de Irrigation Probability**: Gerar camada derivada de Irrigation Probability para interpretação.
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
| `ngi: Raster` | — | Conforme especificação da operação |
| `egi: Raster` | — | Conforme especificação da operação |
| `lst: Raster` | — | Conforme especificação da operação |
| `cloud_water_mask_raster: Raster` | — | Conforme especificação da operação |
| `coef_ngi` | — | Conforme especificação da operação |
| `coef_egi` | — | Conforme especificação da operação |
| `coef_lst` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_irrigation_probability` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

