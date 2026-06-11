# JTBDs (List Bing Maps)

## JTBDs
1. Listar tiles de basemap do Bing Maps que intersectam uma geometria em um nível de zoom
2. Obter URLs dos tiles para download posterior

## Descrição
Operação que consulta a API Bing Maps e lista tiles do conjunto `Aerial`/`Basemap` para um dado nível de zoom (0-20). Cada produto gerado contém a URL do tile, nível de zoom, tipo de imagem e camada.

## Inputs
- `user_input` (DataVibe): geometria de interesse

## Outputs
- `products` (List[BingMapsProduct]): tiles Bing Maps listados

## Lógicas e Cálculos
- Valida `zoom_level` (0-20), `imagery_set` (Aerial) e `map_layer` (Basemap)
- Consulta `BingMapsCollection.query_tiles()` com o bbox da geometria e zoom
- Gera ID único via SHA-256 combinando identificador do tile + imagery set + map layer
- Define time_range como horário atual da execução
