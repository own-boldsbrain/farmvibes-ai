# JTBDs (find_soil_samples)

## JTBDs
1. Encontrar localizações mínimas para amostragem de solo em talhões
2. Agrupar pixels de raster por similaridade espectral via clustering

## Descrição
Agrupa valores de índices espectrais de um raster (ex: bandas de satélite) usando Gaussian Mixture Models para determinar zonas homogêneas e sugerir pontos de amostragem de solo representativos.

## Inputs
- `raster`: Raster — imagem de satélite com índices espectrais
- `user_input`: DataVibe — geometria da área de interesse

## Outputs
- `locations`: DataVibe — arquivos shapefile com boundaries dos clusters e localizações de amostra

## Lógicas e Cálculos
1. Recorta raster pela geometria de entrada usando máscara rasterio
2. Treina Gaussian Mixture Model (n_clusters) nos valores do raster
3. Prediz clusters e aplica sieve para agrupar pixels pequenos
4. Converte clusters em polígonos, calcula ponto representativo de cada zona
5. Exporta boundaries e sample locations como shapefile em zip
