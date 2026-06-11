# JTBDs (download_soilgrids)

## JTBDs
1. Obter mapas de propriedades do solo (carbono, textura, pH, densidade, etc.) para uma área
2. Cruzar camadas de solo com talhões para zoneamento e recomendação de insumos

## Descrição
Baixa camadas de mapeamento digital de solo do SoilGrids via WCS para a geometria de entrada, retornando raster recortado.

## Inputs
- `input_item`: `DataVibe` com bounding box da área
- `map`: Mapa SoilGrids (ex.: `"soc"`, `"clay"`, `"sand"`, `"phh2o"`, `"bdod"`, `"cec"`, etc.)
- `identifier`: Identificador completo da camada (ex.: `"soc_0-5cm_mean"`)

## Outputs
- `downloaded_raster`: `Raster` com a camada de solo recortada para a área de interesse

## Lógicas e Cálculos
1. Conecta ao WCS do mapa selecionado via `WebCoverageService` com retry (5 tentativas)
2. Valida se o `identifier` existe entre as coberturas disponíveis
3. Solicita `getCoverage` com subsets de longitude/latitude a partir do bbox e CRS EPSG:4326
4. Baixa o GeoTIFF da resposta e salva em diretório temporário
5. Gera `Raster` com banda mapeada como `"{map}:{identifier}"` e data dummy (2022)
