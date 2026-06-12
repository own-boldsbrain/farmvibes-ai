# JTBDs (download_soilgrids)

## JTBDs
1. Obter mapas de propriedades do solo (carbono, textura, pH, densidade, etc.) para uma área
2. Cruzar camadas de solo com talhões para zoneamento e recomendação de insumos

## Descrição
Baixa camadas de mapeamento digital de solo do SoilGrids via WCS para a geometria de entrada, retornando raster recortado.

## Inputs
- `input_item`: `DataVibe` com bounding box da área
- `map`: Mapa SoilGrids (ex.: `"soc"`, `"clay"`, `"sand"`, `"phh2o"`, `"bdod"`, `"cec"`, etc.)
- `identifier`: Identificador completo da camada (ex.: `"soc_0-5cm_mean"`)

## Outputs
- `downloaded_raster`: `Raster` com a camada de solo recortada para a área de interesse

## Lógicas e Cálculos
1. Conecta ao WCS do mapa selecionado via `WebCoverageService` com retry (5 tentativas)
2. Valida se o `identifier` existe entre as coberturas disponíveis
3. Solicita `getCoverage` com subsets de longitude/latitude a partir do bbox e CRS EPSG:4326
4. Baixa o GeoTIFF da resposta e salva em diretório temporário
5. Gera `Raster` com banda mapeada como `"{map}:{identifier}"` e data dummy (2022)

## Use Cases
1. **Ingestão de Soilgrids**: Baixar dados Soilgrids para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Soilgrids mais recentes.
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
| `map` | — | Conforme especificação da operação |
| `"soc"` | — | Conforme especificação da operação |
| `"clay"` | — | Conforme especificação da operação |
| `"sand"` | — | Conforme especificação da operação |
| `"phh2o"` | — | Conforme especificação da operação |
| `"bdod"` | — | Conforme especificação da operação |
| `"cec"` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_soilgrids` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Dados de solo**: SoilGrids, USDA, GNATSGO.

