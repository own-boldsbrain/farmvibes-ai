# JTBDs (ordinal_trend_test)

## JTBDs
1. Detectar tendência de aumento/declínio em classes ordinais ao longo do tempo
2. Testar significância estatística com Cochran-Armitage

## Descrição
Aplica teste de tendência Cochran-Armitage sobre contagens de pixels categóricos ao longo de múltiplas datas. Retorna p-valor e z-score para determinar se há tendência significativa.

## Inputs
- `pixel_count: List[RasterPixelCount]` — contagens de pixels por data

## Outputs
- `ordinal_trend_result: OrdinalTrendTest` — p-valor e z-score

## Lógicas e Cálculos
- Ordena pixel counts por data
- Constrói tabela de contingência (categorias × tempo)
- Calcula z-score: (Σ w_i·T_i - E) / √Var, onde w_i = índices ordinais
- p-valor = 2 · Φ(-|z|) (bicaudal)
- H₀: sem tendência; H₁: com tendência (z > 0 crescente, z < 0 decrescente)

## Use Cases
1. **Automação**: Aplica teste de tendência Cochran-Armitage sobre contagens de pixels categóricos ao longo de múltiplas datas de forma programática e escalável.
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
| `pixel_count: List[RasterPixelCount]` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `ordinal_trend_test` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

