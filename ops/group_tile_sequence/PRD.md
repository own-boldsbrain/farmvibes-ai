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

## Use Cases

1. **Organização de dados**: Agrupar rasters/produtos por critérios espaciais ou temporais.
2. **Preparação para merge**: Estruturar sequências antes de operações de mosaico.
3. **Redução de complexidade**: Simplificar listas grandes em grupos gerenciáveis.

## Faz / Não Faz

- **Faz**: Agrupamento de itens por critérios espaciais e/ou temporais.
- **Não Faz**: Não altera o conteúdo dos itens agrupados.
- **Não Faz**: Não modifica a ordem interna dos itens.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `rasters` | — | Conforme especificação da operação |
| `List[TileData]` | — | Conforme especificação da operação |
| `input_data` | — | Conforme especificação da operação |
| `tile_geometry` | — | Conforme especificação da operação |
| `duration` | — | Conforme especificação da operação |
| `overlap` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `group_tile_sequence` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.
