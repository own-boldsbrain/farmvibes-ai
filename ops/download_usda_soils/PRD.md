# JTBDs (download_usda_soils)

## JTBDs
1. Obter classificação taxonômica de solos USDA (ordem/subordem) para uma região
2. Correlacionar tipos de solo com aptidão agrícola e manejo

## Descrição
Baixa raster global de classes de solo USDA (1/30 grau) a partir de URL pública do NRCS, extrai do ZIP e retorna raster categórico com metadados de classificação.

## Inputs
- `input_item`: `DataVibe` com bounding box da área
- `url`: URL do arquivo ZIP contendo o raster e metadados (default: NRCS global soil regions)
- `zip_file`: Nome do arquivo ZIP (default: `global_soil_regions_geoTIFF.zip`)
- `tiff_file`: Nome do TIFF dentro do ZIP (default: `so2015v2.tif`)
- `meta_file`: Arquivo de metadados com classes (default: `2015_suborders_and_gridcode.txt`)

## Outputs
- `downloaded_raster`: `CategoricalRaster` com classes de solo (ordem:subordem) e categorias mapeadas

## Lógicas e Cálculos
1. Baixa o arquivo ZIP da URL do NRCS via `download_file`
2. Extrai o TIFF e o arquivo de metadados do ZIP
3. Lê o arquivo de metadados com `pandas.read_table` e cria dicionário `{gridcode: "ORDEM:SUBORDEM"}`
4. Extrai geometria global a partir dos bounds do raster
5. Gera `CategoricalRaster` com asset do TIFF, asset JSON de categorias, bandas mapeadas e lista de categorias

## Use Cases
1. **Ingestão de Usda Soils**: Baixar dados Usda Soils para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Usda Soils mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_item` | — | Conforme especificação da operação |
| `url` | — | Conforme especificação da operação |
| `zip_file` | — | Conforme especificação da operação |
| `global_soil_regions_geoTIFF.zip` | — | Conforme especificação da operação |
| `tiff_file` | — | Conforme especificação da operação |
| `so2015v2.tif` | — | Conforme especificação da operação |
| `meta_file` | — | Conforme especificação da operação |
| `2015_suborders_and_gridcode.txt` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_usda_soils` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Dados de solo**: SoilGrids, USDA, GNATSGO.

