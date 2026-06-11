# JTBDs (Group Tile Sequence)

## JTBDs
1. Agrupar rasters por tile MGRS e geometria de interseção com entrada do usuário
2. Criar sequências temporais com janelas deslizantes de duração e overlap configuráveis

## Descrição
Recebe rasters (S1, S2 ou cloudmask) e geometries de entrada, calcula interseção com tiles MGRS do KML de referência, agrupa por `(tile_id, bbox)` e cria `TileSequenceData` com chips temporais de `duration` dias e `overlap` entre janelas.

## Inputs
- `rasters`: `List[TileData]` (S1/S2/cloudmask)
- `input_data`: `List[DataVibe]`
- Parâmetros: `tile_geometry` (KML), `duration`, `overlap`

## Outputs
- `tile_sequences`: `List[TileSequenceData]`

## Lógicas e Cálculos
- Carrega KML de tiles MGRS com `fiona`/`geopandas`, filtra apenas tiles com produtos
- Para cada raster, testa `geom.intersects(tile_geom)` e data dentro do `time_range` de `input_data`
- Chave de agrupamento: `(tile_id, bounds(intersected_geom))`
- `make_chip_sequences`: calcula `read_intervals` e `write_intervals` com `duration` e `step = duration * overlap`
- Gera `sequence_id` hash SHA-256 dos itens + geometria + time_ranges
