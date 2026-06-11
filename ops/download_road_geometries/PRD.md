# JTBDs (download_road_geometries)

## JTBDs
1. Obter malha viária de uma região para análise de acessibilidade a talhões
2. Calcular distâncias de estradas para logística de escoamento de safra

## Descrição
Baixa geometrias de vias do OpenStreetMap para uma região delimitada por bounding box, com tipo de rede e buffer configuráveis.

## Inputs
- `input_region`: `DataVibe` com bounding box da área de interesse
- `network_type`: Tipo de rede viária (ex.: `"all_private"`, `"drive"`, `"walk"`)
- `buffer_size`: Tamanho do buffer em metros ao redor da região para expandir a busca (default: 100m)

## Outputs
- `roads`: `GeometryCollection` contendo as edges da malha viária em formato GeoPackage

## Lógicas e Cálculos
1. Cria polígono a partir do bbox da região de entrada
2. Projeta para UTM, aplica buffer (`buffer_size`) e re-projeta para WGS84 para ampliar área de busca
3. Obtém grafo de vias do OSM via `osmnx.graph_from_polygon` com o `network_type` especificado
4. Converte grafo para GeoDataFrame de edges e filtra apenas as que interseccionam a geometria original
5. Converte listas nos metadados para strings e salva como GeoPackage
6. Retorna `GeometryCollection` com o asset GeoPackage
