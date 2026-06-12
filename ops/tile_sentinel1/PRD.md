# JTBDs (tile_sentinel1)

## JTBDs

1. Associar produtos Sentinel-1 aos tiles Sentinel-2 que eles intersectam
2. Preparar metadados de tiling para pré-processamento conjunto S1+S2

## Descrição

Para cada produto Sentinel-1, encontra todos os tiles Sentinel-2 com os quais ele intersecta espacialmente, gerando um item por combinação produto×tile. Apenas metadados — assets não são alterados.

## Inputs

- `sentinel1_products`: List[DownloadedSentinel1Product] | List[Sentinel1Raster]
- `sentinel2_products`: List[Sentinel2Product]

## Outputs

- `tiled_products`: List[TiledSentinel1Product] | List[Sentinel1Raster]

## Lógicas e Cálculos

1. Carrega KML de geometrias de tiles Sentinel-2
2. Filtra apenas tiles presentes nos produtos S2
3. Para cada produto S1, testa interseção com cada tile
4. Se intersecta, clona produto S1 com geometria do tile e tile_id
5. Gera hash único por combinação S1_id + tile_id

## Use Cases
1. **Automação**: Para cada produto Sentinel-1, encontra todos os tiles Sentinel-2 com os quais ele intersecta espacialmente, gerando um item por combinação produto×tile de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `sentinel1_products` | — | Conforme especificação da operação |
| `sentinel2_products` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `tile_sentinel1` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.
- **Sentinel-1 (SAR)**: Radar C-band, GRD e RTC.

