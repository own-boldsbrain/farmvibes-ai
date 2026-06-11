# JTBDs (extract_protein_sequence)

## JTBDs
1. Extrair sequências de proteínas de itens alimentícios
2. Armazenar dados de sequência FASTA para análise nutricional

## Descrição
Extrai lista de sequências FASTA de um `FoodVibe`, padroniza para 3 entradas e salva em CSV.

## Inputs
- `food_item: FoodVibe` — item alimentício com sequências FASTA

## Outputs
- `protein_sequence: ProteinSequence` — sequências de proteínas em CSV

## Lógicas e Cálculos
- Recebe lista de sequências FASTA do FoodVibe
- Padroniza para 3 elementos (preenche com " 0" se necessário)
- Salva DataFrame em CSV com coluna "protein_list"
