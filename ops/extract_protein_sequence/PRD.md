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

## Use Cases
1. **Automação**: Extrai lista de sequências FASTA de um `FoodVibe`, padroniza para 3 entradas e salva em CSV de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `food_item: FoodVibe` | — | Conforme especificação da operação |

## Outcomes Esperados

- Estrutura de dados organizada para encadeamento em workflows.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `extract_protein_sequence` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

