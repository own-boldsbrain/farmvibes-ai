# JTBDs (compute_index)

## JTBDs

1. Calcular índices espectrais (NDVI, EVI, NDMI, etc.)
2. Produzir camadas derivadas para modelos de vegetação e solo

## Descrição

Calcula índices espectrais sobre rasters usando a biblioteca spyndex (NDVI, EVI, MSEVI, NDMI, etc.) ou implementações customizadas (methane, NDRE, PRI, RECI).

## Inputs

- `raster: Raster` — raster com bandas espectrais
- Parâmetro: `index` (padrão "ndvi")

## Outputs

- `index: Raster` — raster do índice calculado

## Lógicas e Cálculos

- Se índice está no spyndex: carrega bandas necessárias, aplica scale/offset, executa `spyndex.computeIndex`
- Índices custom: methane (anomalia em B12 via kNN + gaussian filter), NDRE, PRI, RECI
- Anexa asset de visualização com colormap e range

## Use Cases
1. **Análise de Index**: Gerar camada derivada de Index para interpretação.
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
| `raster: Raster` | — | Conforme especificação da operação |
| `index` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_index` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Spyndex**: Biblioteca Python para índices espectrais.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

