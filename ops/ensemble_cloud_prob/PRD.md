# JTBDs (ensemble_cloud_prob)

## JTBDs
1. Combinar previsões de múltiplos modelos de nuvem em uma única máscara
2. Reduzir falsos positivos por ensemble (média)

## Descrição
Calcula a média pixel-a-pixel das probabilidades de nuvem de 5 modelos independentes, gerando uma máscara ensemble mais robusta.

## Inputs
- `cloud1..cloud5: Sentinel2CloudProbability` — 5 máscaras de probabilidade

## Outputs
- `cloud_probability: Sentinel2CloudProbability` — máscara ensemble

## Lógicas e Cálculos
- Carrega os 5 rasters de probabilidade
- Concatena ao longo do eixo "band" e calcula a média
- Salva raster resultante como novo asset

## Use Cases
1. **Automação**: Calcula a média pixel-a-pixel das probabilidades de nuvem de 5 modelos independentes, gerando uma máscara ensemble mais robusta de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `cloud1..cloud5: Sentinel2CloudProbability` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `ensemble_cloud_prob` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

