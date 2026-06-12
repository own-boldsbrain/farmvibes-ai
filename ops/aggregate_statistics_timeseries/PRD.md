# JTBDs (aggregate_statistics_timeseries)

## JTBDs

1. Agregar estatísticas sumárias de múltiplas datas em uma série temporal
2. Filtrar observações com alta razão de dados mascarados

## Descrição

Concatena uma lista de `DataSummaryStatistics` em uma série temporal única, filtrando entradas com `masked_ratio` acima do limiar e ordenando por data.

## Inputs

- `stats: List[DataSummaryStatistics]` — estatísticas por data
- Parâmetro: `masked_thr` (padrão 0.8)

## Outputs

- `timeseries: List[TimeSeries]` — série temporal agregada (CSV)

## Lógicas e Cálculos

- Concatena CSVs de cada estatística em um DataFrame
- Filtra linhas com `masked_ratio <= masked_thr`
- Ordena por índice de data
- Salva CSV e define time_range com base nos extremos

## Use Cases
1. **Automação**: Concatena uma lista de `DataSummaryStatistics` em uma série temporal única, filtrando entradas com `masked_ratio` acima do limiar e ordenando por data de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `stats: List[DataSummaryStatistics]` | — | Conforme especificação da operação |
| `masked_thr` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `aggregate_statistics_timeseries` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

