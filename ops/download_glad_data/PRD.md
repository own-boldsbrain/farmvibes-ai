# JTBDs (download_glad_data)

## JTBDs
1. Baixar dados GLAD (Global Land Analysis & Discovery) de alertas de desmatamento e cobertura florestal
2. Obter rasters de extensão florestal para monitoramento de mudanças na vegetação

## Descrição
Baixa produtos GLAD da Universidade de Maryland a partir de URLs fornecidas por `GLADProduct`. Extrai o nome do tile e ano do produto, faz download do GeoTIFF e retorna um raster categórico com classificação binária floresta/não-floresta.

## Inputs
- `glad_product`: `GLADProduct` com URL, tile_name, geometria e período

## Outputs
- `downloaded_product`: `CategoricalRaster` com banda "forest_extent" e categorias ["Non-Forest", "Forest"]

## Lógicas e Cálculos
- Concatena tile_name e ano para nomear o arquivo: `{tile_name}_{year}.tif`
- Faz download do arquivo GeoTIFF da URL do produto
- Gera ID hash único combinando nome do arquivo, geometria e período
- Clona metadados do produto de entrada mapeando banda 0 como "forest_extent" com categorias binárias

## Use Cases
1. **Ingestão de Glad Data**: Baixar dados Glad Data para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Glad Data mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `glad_product` | — | Conforme especificação da operação |
| `GLADProduct` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_glad_data` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **GLAD**: Extensão florestal global (30m).

