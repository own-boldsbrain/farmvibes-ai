# JTBDs (download_usda_soils)

## JTBDs
1. Obter classificação taxonômica de solos USDA (ordem/subordem) para uma região
2. Correlacionar tipos de solo com aptidão agrícola e manejo

## Descrição
Baixa raster global de classes de solo USDA (1/30 grau) a partir de URL pública do NRCS, extrai do ZIP e retorna raster categórico com metadados de classificação.

## Inputs
- `input_item`: `DataVibe` com bounding box da área
- `url`: URL do arquivo ZIP contendo o raster e metadados (default: NRCS global soil regions)
- `zip_file`: Nome do arquivo ZIP (default: `global_soil_regions_geoTIFF.zip`)
- `tiff_file`: Nome do TIFF dentro do ZIP (default: `so2015v2.tif`)
- `meta_file`: Arquivo de metadados com classes (default: `2015_suborders_and_gridcode.txt`)

## Outputs
- `downloaded_raster`: `CategoricalRaster` com classes de solo (ordem:subordem) e categorias mapeadas

## Lógicas e Cálculos
1. Baixa o arquivo ZIP da URL do NRCS via `download_file`
2. Extrai o TIFF e o arquivo de metadados do ZIP
3. Lê o arquivo de metadados com `pandas.read_table` e cria dicionário `{gridcode: "ORDEM:SUBORDEM"}`
4. Extrai geometria global a partir dos bounds do raster
5. Gera `CategoricalRaster` com asset do TIFF, asset JSON de categorias, bandas mapeadas e lista de categorias
