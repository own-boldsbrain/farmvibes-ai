# JTBDs (download_chirps)

## JTBDs
1. Baixar dados de precipitação acumulada do CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data)
2. Obter rasters COG de precipitação para análises hidrológicas e agronômicas

## Descrição
Baixa produtos de precipitação CHIRPS a partir de URLs de Cloud Optimized GeoTIFFs (COG) listados em `ChirpsProduct`. Extrai o nome do arquivo COG da URL, faz o download e retorna um `ChirpsProduct` com o asset local.

## Inputs
- `chirps_product`: `ChirpsProduct` contendo URL do dado CHIRPS a ser baixado

## Outputs
- `downloaded_product`: `ChirpsProduct` com asset TIFF baixado localmente

## Lógicas e Cálculos
- Extrai nome do arquivo COG da URL usando regex (`chirps-.*cog`)
- Faz download do arquivo via `download_file`
- Gera ID hash único combinando nome do arquivo, geometria e período
- Clona metadados do produto de entrada no produto baixado
