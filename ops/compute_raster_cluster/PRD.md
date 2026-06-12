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

## Use Cases
1. **Análise de Raster Cluster**: Gerar camada derivada de Raster Cluster para interpretação.
2. **Feature engineering**: Produzir insumos para modelos de machine learning.
3. **Monitoramento temporal**: Calcular o índice/variável para múltiplas datas e comparar.

## Faz / Não Faz

- **Faz**: Cálculo da variável/algoritmo sobre os dados de entrada.
- **Faz**: Parametrização configurável pelo usuário.
- **Não Faz**: Não valida os resultados contra dados de campo/ground truth.
- **Não Faz**: Não modifica o raster de entrada — gera novo raster de saída.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_raster: Raster` | — | Conforme especificação da operação |
| `clustering_method` | — | Conforme especificação da operação |
| `number_classes` | — | Conforme especificação da operação |
| `half_side_length` | — | Conforme especificação da operação |
| `number_iterations` | — | Conforme especificação da operação |
| `stride` | — | Conforme especificação da operação |
| `warmup_steps` | — | Conforme especificação da operação |
| `warmup_half_side_length` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_raster_cluster` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

