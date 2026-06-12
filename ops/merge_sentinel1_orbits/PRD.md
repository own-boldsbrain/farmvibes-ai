# JTBDs (Merge Sentinel-1 Orbits)

## JTBDs
1. Mesclar rasters da mesma orbita absoluta Sentinel-1 em um único raster por tile MGRS
2. Reprojetar dados para o CRS UTM apropriado do tile

## Descrição
Recebe um `Sentinel1RasterOrbitGroup` (raster da mesma orbita/tile) e mescla usando `rasterio.merge` com `WarpedVRT` para reprojeção ao CRS UTM do tile. A ordem dos assets no grupo define prioridade no merge.

## Inputs
- `raster_group`: `Sentinel1RasterOrbitGroup`
- Parâmetro: `resampling`

## Outputs
- `merged_product`: `Sentinel1Raster`

## Lógicas e Cálculos
- Obtém CRS UTM do `tile_id` via `tile_to_utm()`
- Projeta bounds da geometria para o CRS UTM
- Abre cada raster com `rasterio.open` + `WarpedVRT` para reprojetar para o CRS destino
- `merge()` com bounds, resampling e `FLOAT_COMPRESSION_KWARGS` (blocos 512x512)

## Use Cases
1. **Mosaico de imagens**: Unir múltiplos rasters adjacentes em uma única cena contínua.
2. **Fusão de dados**: Combinar coberturas de diferentes datas ou sensores.
3. **Preparação de dado único**: Consolidar sequência de rasters para análise integrada.

## Faz / Não Faz

- **Faz**: Mesclagem de múltiplos rasters em um único arquivo.
- **Faz**: Validação de compatibilidade entre rasters (CRS, dtype, bandas).
- **Não Faz**: Não faz interpolação entre rasters sobrepostos — usa o primeiro disponível.
- **Não Faz**: Não recorta ou reprojeta — opera no CRS herdado da entrada.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `raster_group` | — | Conforme especificação da operação |
| `Sentinel1RasterOrbitGroup` | — | Conforme especificação da operação |
| `resampling` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `merge_sentinel1_orbits` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.
- **Rasterio/GDAL**: Leitura e escrita de rasters geoespaciais.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.
- **Sentinel-1 (SAR)**: Radar C-band, GRD e RTC.

