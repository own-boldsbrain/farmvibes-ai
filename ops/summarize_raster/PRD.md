# JTBDs (summarize_raster / summarize_masked_raster)

## JTBDs

1. Calcular estatísticas descritivas (média, desvio, min, max) de um raster
2. Calcular estatísticas apenas em regiões não mascaradas de um raster

## Descrição

Computa média, desvio padrão, mínimo, máximo e proporção mascarada de um raster, opcionalmente aplicando uma máscara booleana para excluir regiões.

## Inputs

- `raster`: Raster — raster a ser sumarizado
- `input_geometry`: DataVibe — geometria de interesse
- `mask`: Raster (opcional) — máscara booleana para exclusão

## Outputs

- `summary`: DataSummaryStatistics — estatísticas em CSV

## Lógicas e Cálculos

1. Recorta raster pela geometria de interseção com input_geometry
2. Carrega como masked array
3. Se mask fornecida, combina máscaras (dados OR mask)
4. Calcula mean, std, min, max, masked_ratio
5. Salva em CSV indexado por data

## Use Cases
1. **Automação**: Computa média, desvio padrão, mínimo, máximo e proporção mascarada de um raster, opcionalmente aplicando uma máscara booleana para excluir regiões de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Faz**: Suporte a geometrias delimitadoras para recorte espacial.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `raster` | — | Conforme especificação da operação |
| `input_geometry` | — | Conforme especificação da operação |
| `mask` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `summarize_raster` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

