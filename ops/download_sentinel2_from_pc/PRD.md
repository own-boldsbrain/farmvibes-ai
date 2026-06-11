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
