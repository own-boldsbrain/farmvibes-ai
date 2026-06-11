# JTBDs (extract_gedi_rh100)

## JTBDs
1. Extrair altura de dossel (RH100) do GEDI L2B para uma região
2. Filtrar dados por qualidade e geometria de interseção

## Descrição
Extrai variável RH100 (altura relativa 100%) de produtos GEDI L2B (HDF5) que intersectam a região de interesse, gerando GeoPackage com geometria, feixe e valor RH100.

## Inputs
- `gedi_product: GEDIProduct` — produto GEDI L2B
- `roi: DataVibe` — região de interesse
- Parâmetro: `check_quality` (padrão true)

## Outputs
- `rh100: GeometryCollection` — pontos com RH100 e metadados

## Lógicas e Cálculos
- Itera sobre beams (BEAM0000 a BEAM1011) do HDF5
- Filtra por bounding box e within da geometria ROI
- Se `check_quality`, filtra por `l2b_quality_flag`
- Salva GeoDataFrame com colunas: geometry, beam, rh100 em formato GPKG
