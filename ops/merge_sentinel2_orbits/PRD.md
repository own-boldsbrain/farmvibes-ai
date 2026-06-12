# JTBDs (Merge Sentinel-2 Orbits)

## JTBDs
1. Mesclar rasters e máscaras de nuvem da mesma orbita Sentinel-2 em um único par raster+máscara
2. Consolidar tiles parciais divididos pelo movimento do satélite

## Descrição
Recebe `Sentinel2RasterOrbitGroup` e `Sentinel2CloudMaskOrbitGroup` e mescla cada grupo separadamente usando `rasterio.merge`. A ordem segue o discriminador de data do produto. Se houver apenas um asset, reutiliza o asset original sem merge.

## Inputs
- `raster_group`: `Sentinel2RasterOrbitGroup`
- `mask_group`: `Sentinel2CloudMaskOrbitGroup`

## Outputs
- `output_raster`: `Sentinel2Raster`
- `output_mask`: `Sentinel2CloudMask`

## Lógicas e Cálculos
- Obtém listas de assets ordenados de cada grupo
- Se len > 1: `merge(path_list, dst_path, dst_kwds={zstd_level:9, predictor:2})` para raster e mask
- Se len == 1: reutiliza asset original
- Clona novos itens com geometria atualizada do grupo, `id` = `gen_guid()`

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
| `Sentinel2RasterOrbitGroup` | — | Conforme especificação da operação |
| `mask_group` | — | Conforme especificação da operação |
| `Sentinel2CloudMaskOrbitGroup` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `merge_sentinel2_orbits` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.
- **Rasterio/GDAL**: Leitura e escrita de rasters geoespaciais.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

