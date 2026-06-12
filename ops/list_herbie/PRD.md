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

## Use Cases
1. **Descoberta de dados**: Consultar produtos Herbie disponíveis para uma região.
2. **Planejamento de aquisição**: Verificar cobertura temporal e espacial antes de baixar.
3. **Curadoria de dataset**: Filtrar cenas por data, cobertura de nuvem e outros critérios.

## Faz / Não Faz

- **Faz**: Consulta a catálogos/fontes de dados para listar produtos disponíveis.
- **Faz**: Filtragem por geometria e intervalo de tempo.
- **Não Faz**: Não baixa os dados listados — apenas retorna metadados.
- **Não Faz**: Não modifica o catálogo de dados.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_item` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `list_herbie` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Herbie/HRRR**: Acesso a previsões numéricas do NOAA.

## Datasets / Fontes de Dados

- **NOAA HRRR/GFS**: Previsões numéricas meteorológicas.

