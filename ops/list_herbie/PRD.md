# JTBDs (List Herbie)

## JTBDs
1. Listar produtos de previsão meteorológica (HRRR, RAP, GFS, RRFS) para uma região e período
2. Configurar lead times de previsão, frequência e campo de busca (search_text)

## Descrição
Operação que utiliza a biblioteca Herbie para listar produtos de modelos meteorológicos. Suporta forecast com lead times configuráveis ou determinação automática entre análises (lead time zero) e previsões progressivas.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `product` (List[HerbieProduct]): produtos meteorológicos listados

## Lógicas e Cálculos
- Gera lista de pares (timestamp, lead_time) baseada em `forecast_lead_times` ou `forecast_start_date`
- Se nenhum dos dois: usa `Herbie_latest` para encontrar a análise mais recente
- Para forecasts, itera por timesteps no intervalo e lead times incrementais
- Gera ID via SHA-256 combinando modelo, produto, lead_time, search_text, geometria e timestamp
-Cada produto armazena modelo, produto, lead_time_hours e search_text
