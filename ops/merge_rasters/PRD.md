# JTBDs (Merge Rasters)

## JTBDs
1. Mesclar uma sequência de rasters em um único raster mosaico
2. Garantir que todos os rasters tenham mesmo CRS, dtype e número de bandas

## Descrição
Recebe um `RasterSequence` e mescla todos os rasters em um único arquivo GeoTIFF usando `rasterio.merge`. Suporta resampling bilinear e diferentes estratégias de resolução (`equal`, `lowest`, `highest`, `average`). A geometria de saída e o CRS são herdados da sequência.

## Inputs
- `raster_sequence`: `RasterSequence`
- Parâmetros: `resampling`, `resolution`

## Outputs
- `raster`: `Raster`

## Lógicas e Cálculos
- Valida que todos os rasters têm mesmo `crs`, `dtype` e `count`; erro se discrepantes
- Define resolução de saída conforme método escolhido (None para `equal`; média/min/max para os demais)
- Usa `rasterio.merge.merge()` com bounds projetados do CRS da sequência
- Compressão ZSTD com predictor adequado ao dtype (int ou float)

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
| `raster_sequence` | — | Conforme especificação da operação |
| `resampling` | — | Conforme especificação da operação |
| `resolution` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `merge_rasters` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Rasterio/GDAL**: Leitura e escrita de rasters geoespaciais.

## Datasets / Fontes de Dados

- **Múltiplos rasters**: Sequência de rasters para mesclagem.

