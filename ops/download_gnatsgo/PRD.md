# JTBDs (download_gnatsgo)

## JTBDs
1. Obter raster de atributos de solo gNATSGO para uma variável específica em profundidade
2. Cruzar variáveis pedológicas (AWS, SOC, NCCPI, etc.) com a área de interesse do produtor

## Descrição
Baixa o raster de um atributo de solo do gNATSGO (ex.: capacidade de armazenamento de água, carbono orgânico, índice de produtividade) a partir do Planetary Computer e retorna o raster comprimido.

## Inputs
- `gnatsgo_product`: Produto gNATSGO contendo o tile e geometria de interesse
- `variable`: Variável desejada (ex.: aws0_20, soc0_30, nccpi3all, mukey, droughty, etc.)
- `api_key` (opcional): Chave de API do Planetary Computer

## Outputs
- `downloaded_raster`: Raster (`GNATSGORaster`) com a variável selecionada, comprimido em TIFF

## Lógicas e Cálculos
1. Conecta ao Planetary Computer via `GNATSGOCollection` e consulta o item pelo ID do produto
2. Baixa o asset da variável especificada para diretório temporário
3. Comprime o raster usando `compress_raster` com parâmetros `FLOAT_COMPRESSION_KWARGS`
4. Gera hash único e retorna como `GNATSGORaster` com banda mapeada para a variável

## Use Cases
1. **Ingestão de Gnatsgo**: Baixar dados Gnatsgo para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Gnatsgo mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `gnatsgo_product` | — | Conforme especificação da operação |
| `variable` | — | Conforme especificação da operação |
| `api_key` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_gnatsgo` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **Dados de solo**: SoilGrids, USDA, GNATSGO.

