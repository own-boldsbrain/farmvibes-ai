# JTBDs (download_sentinel2_from_pc)

## JTBDs
1. Obter todas as bandas espectrais de uma cena Sentinel-2 L2A para análise multiespectral
2. Dispor de máscara de nuvens (GML) junto com os dados de reflectância

## Descrição
Baixa as bandas de um produto Sentinel-2 L2A do Planetary Computer e a máscara de nuvens GML, anexando ao produto.

## Inputs
- `sentinel_product`: `Sentinel2Product` com nome do produto e geometria
- `api_key` (opcional): Chave de API do Planetary Computer

## Outputs
- `downloaded_product`: `DownloadedSentinel2Product` com bandas baixadas e máscara de nuvens (se disponível)

## Lógicas e Cálculos
1. Conecta ao `Sentinel2Collection` e consulta itens pela geometria e período
2. Filtra correspondências pelo partial ID (remove sufixo de processamento e discriminator)
3. Se múltiplos matches, seleciona o mais recente pelo `discriminator_date`
4. Baixa cada banda listada em `asset_keys` da coleção via `download_asset`
5. Obtém máscara de nuvens GML via `get_cloud_mask` e baixa se o blob existir
6. Adiciona bandas e máscara ao `DownloadedSentinel2Product`

## Use Cases
1. **Ingestão de Sentinel2 From Pc**: Baixar dados Sentinel2 From Pc para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Sentinel2 From Pc mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `sentinel_product` | — | Conforme especificação da operação |
| `api_key` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_sentinel2_from_pc` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

