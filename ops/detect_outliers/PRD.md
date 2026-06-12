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

## Use Cases
1. **Automação**: Ajusta um Gaussian Mixture Model (GMM) monocomonente sobre os rasters de entrada para detectar outliers conforme o parâmetro de limiar de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `rasters: List[Raster]` | — | Conforme especificação da operação |
| `threshold: float = -60` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `detect_outliers` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Scikit-learn (GMM)**: Clusterização Gaussiana.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

