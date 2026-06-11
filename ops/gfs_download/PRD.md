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
