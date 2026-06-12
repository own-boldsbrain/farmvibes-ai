# JTBDs (download_climatology_lab)

## JTBDs
1. Baixar produtos climáticos TerraClimate e GridMET do Climatology Lab
2. Obter séries temporais de variáveis meteorológicas (precipitação, temperatura, etc.)

## Descrição
Baixa produtos de dados climáticos do Climatology Lab (TerraClimate e GridMET) definidos pelo `ClimatologyLabProduct` de entrada. O download é feito a partir da URL do produto no formato NetCDF (.nc) e o resultado é retornado como asset local.

## Inputs
- `input_product`: `ClimatologyLabProduct` com URL do dado climático a ser baixado

## Outputs
- `downloaded_product`: `ClimatologyLabProduct` com asset NetCDF baixado localmente

## Lógicas e Cálculos
- Gera GUID único para o asset
- Faz download do arquivo NetCDF da URL fornecida usando `download_file`
- Clona metadados do produto de entrada e gera novo ID hash baseado no produto, geometria e período

## Use Cases
1. **Ingestão de Climatology Lab**: Baixar dados Climatology Lab para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Climatology Lab mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_product` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_climatology_lab` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

