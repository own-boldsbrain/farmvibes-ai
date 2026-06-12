# JTBDs (gfs_preprocess)

## JTBDs
1. Determinar qual execução do modelo GFS (ciclo) é mais relevante para um dado instante
2. Calcular o horizonte de previsão e validade do forecast para o local de interesse

## Descrição
Obtém a data de publicação do modelo e o horizonte de previsão mais relevantes para o dia, hora e local fornecidos pelo usuário.

## Inputs
- `user_input`: List[DataVibe] — dados do usuário com geometria e time_range

## Outputs
- `time`: List[GfsForecast] — metadados do tempo de publicação e validade da previsão
- `location`: List[DataVibe] — geometria do local de interesse

## Lógicas e Cálculos
1. Converte input para UTC e determina data de publicação (agora para futuro, input para passado)
2. Arredonda hora para ciclo GFS (00, 06, 12, 18)
3. Calcula forecast_offset em horas entre publicação e tempo alvo
4. Varre ciclos anteriores se blob não existir, ajustando granularidade (3h além de 120h)
5. Retorna GfsForecast com publish_time e time_range de validade

## Use Cases
1. **Automação**: Obtém a data de publicação do modelo e o horizonte de previsão mais relevantes para o dia, hora e local fornecidos pelo usuário de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

N/A — parâmetros definidos no workflow que invoca esta operação.

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Arquivo compactado (ZIP) com resultados prontos para download.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `gfs_preprocess` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **NOAA HRRR/GFS**: Previsões numéricas meteorológicas.

