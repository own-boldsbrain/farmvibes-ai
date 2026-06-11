# JTBDs (List Sentinel-2 Products PC)

## JTBDs
1. Listar cenas Sentinel-2 disponíveis no Planetary Computer para uma região e período
2. Obter metadados completos incluindo órbita absoluta

## Descrição
Operação que consulta a coleção Sentinel-2 do Planetary Computer e lista produtos que intersectam a geometria e intervalo de tempo. Utiliza processamento paralelo com `ThreadPoolExecutor` para acelerar a conversão dos itens (que requer fetch da órbita absoluta do arquivo SAFE).

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `sentinel_products` (List[Sentinel2Product]): produtos Sentinel-2 listados

## Lógicas e Cálculos
- Instancia `Sentinel2Collection` e faz query com bbox e time range
- Converte itens STAC para `Sentinel2Product` em paralelo via `ThreadPoolExecutor` (24 workers default)
- Cada conversão obtém a órbita absoluta do arquivo SAFE (operação de I/O intensiva)
- Retorna erro se nenhum produto for encontrado
