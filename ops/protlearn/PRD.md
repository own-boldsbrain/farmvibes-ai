# JTBDs (ProtLearn)

## JTBDs
1. Extrair características físico-químicas de sequências de aminoácidos de alimentos
2. Combinar features proteicas com informações nutricionais e grupo alimentar

## Descrição
Recebe um `FoodVibe` (com dados nutricionais e de família proteica) e um `ProteinSequence` (CSV com sequências de aminoácidos FASTA). Usa a biblioteca `protlearn` para calcular descritores AAindex das 3 principais proteínas. Concatena com informações nutricionais (20 nutrientes) e categóricas (família proteica + grupo alimentar) em um CSV único.

## Inputs
- `food_item`: `FoodVibe`
- `protein_sequence`: `ProteinSequence`

## Outputs
- `food_features`: `FoodFeatures`

## Lógicas e Cálculos
- Lê CSV de sequências proteicas, extrai até 3 sequências FASTA
- `protlearn.features.aaindex1(sequence, standardize='zscore')` para cada sequência (1st, 2nd, 3rd)
- Filtra apenas 6 features AAindex selecionadas por SHAP
- Concatena: 20 nutrientes + 6 AAindex + 4 informações categóricas (3 famílias + food group)
- Codifica famílias e grupos via dicionários de mapeamento

## Use Cases
1. **Automação**: Recebe um `FoodVibe` (com dados nutricionais e de família proteica) e um `ProteinSequence` (CSV com sequências de aminoácidos FASTA) de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Opera sobre sequências de dados de forma estruturada.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `food_item` | — | Conforme especificação da operação |
| `FoodVibe` | — | Conforme especificação da operação |
| `protein_sequence` | — | Conforme especificação da operação |
| `ProteinSequence` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `protlearn` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

