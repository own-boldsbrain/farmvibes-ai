# JTBDs (download_gedi_product)

## JTBDs
1. Baixar produtos GEDI (Global Ecosystem Dynamics Investigation) para análises de estrutura florestal
2. Obter dados LiDAR de altura da vegetação e biomassa da NASA EarthData

## Descrição
Baixa produtos GEDI da NASA via EarthData API. A operação consulta o produto pelo nome no nível de processamento especificado (L1B, L2A, L2B), obtém a URL de download do resultado da query, autentica com token bearer e salva o arquivo no formato HDF5.

## Inputs
- `gedi_product`: `GEDIProduct` com nome do produto e nível de processamento

## Outputs
- `downloaded_product`: `GEDIProduct` com asset HDF5 baixado

## Lógicas e Cálculos
- Instancia EarthData API com o nível de processamento do produto
- Consulta EarthData pelo nome do produto (deve retornar exatamente 1 resultado)
- Extrai URL do primeiro link do resultado da consulta
- Faz download do arquivo .h5 com autenticação Bearer token via cabeçalho HTTP
- Clona produto de entrada com novo GUID e asset referenciando o arquivo HDF5

## Use Cases
1. **Ingestão de Gedi Product**: Baixar dados Gedi Product para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Gedi Product mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `gedi_product` | — | Conforme especificação da operação |
| `GEDIProduct` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_gedi_product` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

