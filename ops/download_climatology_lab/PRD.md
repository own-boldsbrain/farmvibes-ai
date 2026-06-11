# JTBDs (download_climatology_lab)

## JTBDs
1. Baixar produtos climáticos TerraClimate e GridMET do Climatology Lab
2. Obter séries temporais de variáveis meteorológicas (precipitação, temperatura, etc.)

## Descrição
Baixa produtos de dados climáticos do Climatology Lab (TerraClimate e GridMET) definidos pelo `ClimatologyLabProduct` de entrada. O download é feito a partir da URL do produto no formato NetCDF (.nc) e o resultado é retornado como asset local.

## Inputs
- `input_product`: `ClimatologyLabProduct` com URL do dado climático a ser baixado

## Outputs
- `downloaded_product`: `ClimatologyLabProduct` com asset NetCDF baixado localmente

## Lógicas e Cálculos
- Gera GUID único para o asset
- Faz download do arquivo NetCDF da URL fornecida usando `download_file`
- Clona metadados do produto de entrada e gera novo ID hash baseado no produto, geometria e período
