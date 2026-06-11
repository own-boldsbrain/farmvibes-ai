# JTBDs (Heatmap Sensor)

## JTBDs
1. Gerar mapas de calor de nutrientes do solo a partir de amostras pontuais e imagens de satélite
2. Interpolar amostras de solo para área total do talhão usando algoritmos configuráveis

## Descrição
Recebe um raster de imagem, uma coleção de pontos de amostra de solo com atributo (ex: "C" = Carbono) e um polígono de boundary. Cria um mesh grid de `resolution` metros dentro do talhão e aplica algoritmo de interpolação (`nearest neighbor`, `cluster overlap` ou `kriging neighbor`). O resultado é rasterizado em faixas (bins) e exportado como GeoTIFF + shapefile.

## Inputs
- `raster`: `Raster`
- `samples`: `GeometryCollection` (amostras de solo com atributo)
- `samples_boundary`: `GeometryCollection` (clusters/boundary)
- Parâmetros: `attribute_name`, `simplify`, `tolerance`, `algorithm`, `resolution`, `bins`

## Outputs
- `result`: `DataVibe`

## Lógicas e Cálculos
- `create_mesh_grid`: gera grade de pontos com espaçamento `resolution` dentro do talhão
- Algoritmos: `nearest neighbor`, `cluster overlap` (média por cluster), `kriging neighbor`
- `rasterize_heatmap`: rasteriza shapes dos nutrientes com `MergeAlg.replace`
- `group_to_nearest`: discretiza valores em `bins` usando histograma, substitui por média do bin
- Aplica máscara do talhão (`ar.sum(axis=0) == 0 → 0`)
- Exporta shapefile + GeoTIFF como assets
