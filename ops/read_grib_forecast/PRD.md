# JTBDs (read_forecast)

## JTBDs
1. Extrair dados de previsão local de um arquivo GRIB global
2. Amostrar forecast no ponto exato de latitude/longitude de interesse

## Descrição
Lê um arquivo GRIB de previsão global GFS e extrai os dados meteorológicos para a latitude/longitude específica do local de interesse, exportando como CSV.

## Inputs
- `location`: List[DataVibe] — geometria do local (centroide para lat/lon)
- `global_forecast`: List[GfsForecast] — forecast global com asset GRIB

## Outputs
- `local_forecast`: List[GfsForecast] — forecast local com dados extraídos em CSV

## Lógicas e Cálculos
1. Extrai centroide da geometria do local (lon, lat)
2. Converte longitude para escala GFS (0-360)
3. Carrega GRIB com cfgrib, filtra por tipo de nível (surface) e stepType
4. Seleciona ponto mais próximo via `sel(latitude=lat, longitude=gfs_lon, method="nearest")`
5. Exporta para CSV e retorna como GfsForecast local

## Use Cases
1. **Automação**: Lê um arquivo GRIB de previsão global GFS e extrai os dados meteorológicos para a latitude/longitude específica do local de interesse, exportando como CSV de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `location` | — | Conforme especificação da operação |
| `global_forecast` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `read_grib_forecast` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

