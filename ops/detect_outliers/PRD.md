# JTBDs (detect_outliers)

## JTBDs
1. Detectar pixels anômalos em séries temporais de rasters usando Gaussian Mixture Models
2. Segmentar rasters em clusters de comportamento espectral semelhante
3. Visualizar a verossimilhança de cada pixel como heatmap contínuo
4. Extrair as médias dos componentes da mistura como séries temporais
5. Classificar cada pixel como normal ou outlier baseado em limiar de log-verossimilhança
6. Suportar pré-processamento configurável (StandardScaler) sobre as curvas temporais

## Descrição
Ajusta um Gaussian Mixture Model (GMM) monocomonente sobre os rasters de entrada para detectar outliers conforme o parâmetro de limiar. Produz segmentação (rótulos de cluster), heatmap de log-verossimilhança, máscara binária de outliers e séries temporais das médias dos componentes.

## Inputs
- `rasters: List[Raster]` — lista de rasters ordenados por data
- `threshold: float = -60` — limiar de log-verossimilhança para classificar outlier

## Outputs
- `segmentation: List[CategoricalRaster]` — rótulos de cluster por pixel
- `heatmap: List[Raster]` — log-verossimilhança por pixel
- `outliers: List[CategoricalRaster]` — máscara binária (normal/outlier)
- `mixture_means: List[TimeSeries]` — médias dos componentes no espaço original

## Lógicas e Cálculos
1. Ordena rasters por data e unroll para matriz (n_pixels × n_timesteps)
2. Aplica StandardScaler e treina GMM com busca automática de componentes
3. Atribui rótulos de cluster e calcula log-verossimilhança
4. Aplica limiar threshold para classificar outliers
5. Reconstroi as médias no espaço original via inverse_transform
