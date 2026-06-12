# JTBDs (compute_fcover)

## JTBDs

1. Estimar fração de cobertura vegetal do solo (FCOVER)
2. Produzir insumo para modelos biofísicos de vegetação

## Descrição

Calcula FCOVER a partir de bandas Sentinel-2 (B03-B12, B8A) e ângulos de visada usando rede neural com pesos pré-treinados do S2Toolbox.

## Inputs

- `raster: Raster` — bandas reflectância Sentinel-2
- `angles: Raster` — ângulos zenitais e azimutais

## Outputs

- `fcover: Raster` — fração de cobertura vegetal (0-1)

## Lógicas e Cálculos

- Normaliza bandas e ângulos com parâmetros do S2Toolbox
- Concatena bandas (8) + ângulos (3: cos(zen), cos(rel_az))
- Rede neural: 11 entradas → 5 neurônios ocultos (tanh) → 1 saída (tanh)
- Denormaliza para [0, 1]

## Use Cases
1. **Análise de Fcover**: Gerar camada derivada de Fcover para interpretação.
2. **Feature engineering**: Produzir insumos para modelos de machine learning.
3. **Monitoramento temporal**: Calcular o índice/variável para múltiplas datas e comparar.

## Faz / Não Faz

- **Faz**: Cálculo da variável/algoritmo sobre os dados de entrada.
- **Não Faz**: Não valida os resultados contra dados de campo/ground truth.
- **Não Faz**: Não modifica o raster de entrada — gera novo raster de saída.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `raster: Raster` | — | Conforme especificação da operação |
| `angles: Raster` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_fcover` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

