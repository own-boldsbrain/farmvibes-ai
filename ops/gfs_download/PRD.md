# JTBDs (gfs_download)

## JTBDs
1. Baixar arquivos GRIB de previsão global GFS do Azure Blob Storage
2. Obter a previsão mais relevante para um dado tempo de publicação e offset de previsão

## Descrição
Faz o download de arquivos de previsão global do modelo GFS (Global Forecast System) armazenados no Azure Blob Storage, dado um tempo de publicação e horizonte de previsão.

## Inputs
- `time`: List[GfsForecast] — informação do tempo de publicação e horizonte desejado

## Outputs
- `global_forecast`: List[GfsForecast] — forecast com asset GRIB baixado

## Lógicas e Cálculos
1. Calcula o offset de previsão (horas entre publish_time e forecast_time)
2. Constrói URL do blob via `blob_url_from_offset`
3. Faz download do blob GRIB para diretório temporário
4. Retorna GfsForecast com asset apontando para o arquivo GRIB local

## Use Cases
1. **Automação**: Faz o download de arquivos de previsão global do modelo GFS (Global Forecast System) armazenados no Azure Blob Storage, dado um tempo de publicação e horizonte de previsão de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `time` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `gfs_download` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **NOAA HRRR/GFS**: Previsões numéricas meteorológicas.

