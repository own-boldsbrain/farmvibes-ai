# JTBDs (download_era5)

## JTBDs
1. Baixar variáveis climáticas globais do ERA5 (Copernicus)
2. Obter dados de reanálise atmosférica para modelos agronômicos e ambientais

## Descrição
Baixa produtos ERA5 do Copernicus Climate Data Store (CDS) ou da Planetary Computer. A operação suporta duas fontes: (1) Planetary Computer, baixando assets Zarr assinados para a variável solicitada; (2) CDS diretamente via API cdsapi. Em ambos os casos, converte o dado para NetCDF e retorna como `Era5Product`.

## Inputs
- `era5_product`: `Era5Product` com item_id, variável, geometria e período

## Outputs
- `downloaded_product`: `Era5Product` com asset NetCDF contendo a variável ERA5 solicitada

## Lógicas e Cálculos
- Se `item_id` não é vazio, acessa Planetary Computer: assina asset Zarr, abre com xarray usando kwargs específicos
- Se `item_id` é vazio, acessa CDS: usa cdsapi.Client com chave da API para fazer requisição e baixa resultado via fsspec
- Converte dataset xarray para NetCDF e persiste em arquivo local
- Gera ID hash único combinando ID do produto, geometria e período
