# JTBDs (estimate_canopy_cover)

## JTBDs
1. Estimar cobertura de dossel a partir de índices espectrais
2. Converter NDVI em fração de cobertura vegetal via calibração

## Descrição
Aplica regressor linear com features polinomiais de grau 3 sobre índices espectrais (ex.: NDVI) para estimar fração de cobertura de dossel, com pesos pré-computados.

## Inputs
- `indices: List[Raster]` — lista de rasters de índices espectrais
- Parâmetro: `index` (padrão "ndvi")

## Outputs
- `estimated_canopy_cover: List[Raster]` — cobertura de dossel estimada (0-1)

## Lógicas e Cálculos
- Constrói pipeline: `PolynomialFeatures(degree=3) + Ridge`
- Carrega coeficientes e intercept pré-treinados para o índice
- Aplica predict sobre valores não mascarados
- Clipping em [0, 1] e preservação de metadados geoespaciais

## Use Cases
1. **Automação**: Aplica regressor linear com features polinomiais de grau 3 sobre índices espectrais (ex de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `indices: List[Raster]` | — | Conforme especificação da operação |
| `index` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `estimate_canopy_cover` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

