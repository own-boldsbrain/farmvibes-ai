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
