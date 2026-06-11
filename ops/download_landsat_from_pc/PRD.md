# JTBDs (download_landsat_from_pc)

## JTBDs
1. Obter todas as bandas espectrais de uma cena Landsat (qualquer missão) para processamento downstream
2. Ter acesso local às bandas de reflectância, termal e qualidade de uma cena

## Descrição
Baixa todas as bandas disponíveis de um produto Landsat (Landsat 4-9) do Planetary Computer e as anexa ao produto.

## Inputs
- `landsat_product`: Produto Landsat com ID do tile e geometria
- `api_key` (opcional): Chave de API do Planetary Computer

## Outputs
- `downloaded_product`: `LandsatProduct` com todas as bandas baixadas como assets locais

## Lógicas e Cálculos
1. Conecta ao `LandsatCollection` no Planetary Computer e consulta o item pelo `tile_id`
2. Itera sobre todas as chaves de asset da coleção e baixa cada banda
3. Trata bandas ausentes com log de aviso (sem interromper o fluxo)
4. Adiciona cada banda baixada ao produto via `add_downloaded_band`
