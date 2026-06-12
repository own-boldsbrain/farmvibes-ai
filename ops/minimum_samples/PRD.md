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

## Use Cases
1. **Automação**: Agrupa valores de índices espectrais de um raster (ex: bandas de satélite) usando Gaussian Mixture Models para determinar zonas homogêneas e sugerir pontos de amostragem de solo representativos de forma programática e escalável.
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
| `raster` | — | Conforme especificação da operação |

## Outcomes Esperados

- Arquivo compactado (ZIP) com resultados prontos para download.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `minimum_samples` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Scikit-learn (GMM)**: Clusterização Gaussiana.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

