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
