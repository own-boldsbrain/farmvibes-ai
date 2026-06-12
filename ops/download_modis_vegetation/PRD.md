# JTBDs (download_modis_vegetation)

## JTBDs
1. Obter índices de vegetação (NDVI/EVI) MODIS pré-processados para monitoramento de safra
2. Avaliar vigor vegetativo de talhões em intervalos de 16 dias

## Descrição
Baixa o índice de vegetação selecionado (NDVI ou EVI) de produtos MODIS (MOD13Q1/MYD13Q1) a partir do Planetary Computer.

## Inputs
- `product`: `ModisProduct` com ID, resolução e período
- `index`: Índice desejado — `"ndvi"` ou `"evi"`
- `pc_key` (opcional): Chave de API do Planetary Computer

## Outputs
- `index`: `Raster` com o índice de vegetação solicitado em banda única

## Lógicas e Cálculos
1. Conecta ao `Modis16DayVICollection` e consulta item único pelo ID e resolução
2. Filtra os assets do item para encontrar o que contém o índice (case-insensitive: "NDVI" ou "EVI" no nome)
3. Baixa o asset selecionado e retorna como `Raster` com a banda mapeada ao nome do índice

## Use Cases
1. **Ingestão de Modis Vegetation**: Baixar dados Modis Vegetation para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Modis Vegetation mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `product` | — | Conforme especificação da operação |
| `index` | — | Conforme especificação da operação |
| `"ndvi"` | — | Conforme especificação da operação |
| `"evi"` | — | Conforme especificação da operação |
| `pc_key` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_modis_vegetation` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **MODIS**: Vegetation indices e surface reflectance (250m-1km).

