# JTBDs (List Climatology Lab)

## JTBDs
1. Listar produtos climáticos TerraClimate ou GridMET para uma variável e período
2. Obter URLs dos arquivos NetCDF para download

## Descrição
Operação que suporta dois sub-operadores: `list_terraclimate` e `list_gridmet`. Consulta coleções do Climatology Lab e lista produtos anuais para a variável selecionada (ex: tmax, pr, vpd) no intervalo de tempo fornecido.

## Inputs
- `input_item` (DataVibe): intervalo de tempo de interesse

## Outputs
- `products` (List[ClimatologyLabProduct]): produtos climatológicos listados

## Lógicas e Cálculos
- Valida se a variável solicitada existe nas `asset_keys` da coleção
- TerraClimate: variáveis como aet, def, pet, ppt, q, soil, srad, swe, tmax, tmin, vap, ws, vpd, PDSI
- GridMET: variáveis como bi, erc, etr, fm100, pr, rmax, rmin, sph, srad, th, tmmn, tmmx, vpd, vs
- Define time_range de cada produto como ano completo (01/01 a 31/12)
- Armazena URL e nome da variável no produto
