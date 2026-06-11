# JTBDs (compute_raster_cluster)

## JTBDs

1. Segmentar a cena em clusters locais (ex.: agrícola vs. não-agrícola)
2. Produzir mapa categórico de classes para análises contextuais

## Descrição

Aplica algoritmo de overlap clustering em janelas locais para agrupar pixels similares. Parâmetros ajustam número de classes, tamanho da vizinhança e stride.

## Inputs

- `input_raster: Raster` — raster de entrada (ex.: NDVI, reflectance)
- Parâmetros: `clustering_method`, `number_classes`, `half_side_length`, `number_iterations`, `stride`, `warmup_steps`, `warmup_half_side_length`, `window`

## Outputs

- `output_raster: CategoricalRaster` — raster com labels dos clusters

## Lógicas e Cálculos

- Converte uint8 para float dividindo por 255
- Executa `overlap_clustering.run_clustering` com parâmetros configuráveis
- Anexa colormap categórico (tab10) para visualização
- Retorna `CategoricalRaster` com lista de categorias
