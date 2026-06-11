# JTBDs (split_spaceeye_sequence)

## JTBDs
1. Desmembrar uma sequência de tiles em rasters individuais
2. Extrair assets ordenados de um TileSequence para itens avulsos

## Descrição
Divide uma lista de TileSequence (ex: SpaceEyeRasterSequence) de volta em uma lista de rasters individuais, um para cada asset na sequência.

## Inputs
- `sequences`: List[SpaceEyeRasterSequence] — sequências a serem divididas

## Outputs
- `rasters`: List[SpaceEyeRaster] — rasters individuais extraídos

## Lógicas e Cálculos
1. Para cada sequência, itera sobre assets ordenados
2. Para cada asset, cria um clone do tipo Sequence2Tile[type] com asset único
3. Preserva time_range individual de cada asset a partir do asset_time_range
