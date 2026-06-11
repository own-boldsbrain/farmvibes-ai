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
