# JTBDs (combine_chunks)

## JTBDs

1. Reconstruir raster completo a partir de chunks processados em paralelo
2. Montar cena final com todos os pedaços na posição correta

## Descrição

Combina uma lista de `RasterChunk` em um único `Raster`. Usa as informações de posição e limites de escrita de cada chunk para remontar a imagem final.

## Inputs

- `chunks: List[RasterChunk]` — chunks a serem combinados

## Outputs

- `raster: Raster` — raster completo reconstituído

## Lógicas e Cálculos

- Mapeia cada chunk pela posição `(chunk_pos)` e calcula limites absolutos de escrita
- Abre arquivo GeoTIFF de saída com metadados do chunk (0,0)
- Para cada chunk, lê a janela relativa e escreve na janela absoluta correspondente
- Calcula bounding box em EPSG:4326 a partir do CRS projetado
