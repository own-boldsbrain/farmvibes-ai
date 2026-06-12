# JTBDs (stack_sentinel2_bands)

## JTBDs

1. Empilhar bandas individuais de um produto Sentinel-2 baixado em raster multibanda
2. Gerar máscara de nuvens rasterizada a partir do GML de metadados

## Descrição

Para um produto Sentinel-2 baixado, empilha as bandas na ordem correta (B01-B12) em um único GeoTIFF e gera um raster de máscara de nuvens com categorias.

## Inputs

- `input_item`: DownloadedSentinel2Product — produto baixado com bandas e cloud mask

## Outputs

- `sentinel2_raster`: Sentinel2Raster — raster com bandas empilhadas
- `sentinel2_cloud_mask`: Sentinel2CloudMask — máscara de nuvens rasterizada

## Lógicas e Cálculos

1. Abre cada banda na ordem B01-B12 e reprojeta para referência B02 via WarpedVRT
2. Escreve todas as bandas no mesmo GeoTIFF (GTiff, COMPRESS)
3. Lê GML de nuvens, rasteriza polígonos com categorias: NO-CLOUD(0), OPAQUE(1), CIRRUS(2), OTHER(3)
4. Salva cloud mask como uint8 com nodata=100

## Use Cases
1. **Automação**: Para um produto Sentinel-2 baixado, empilha as bandas na ordem correta (B01-B12) em um único GeoTIFF e gera um raster de máscara de nuvens com categorias de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_item` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `stack_sentinel2_bands` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

