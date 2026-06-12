# JTBDs (unpack_refs)

## JTBDs

1. Desempacotar uma lista de ExternalReferenceList em referências individuais
2. Extrair URLs de listas agrupadas para items avulsos

## Descrição

Desempacota uma lista de ExternalReferenceList (cada uma contendo múltiplas URLs) em uma lista plana de ExternalReference, uma por URL.

## Inputs

- `input_refs`: List[ExternalReferenceList] — lista de referências agrupadas

## Outputs

- `ref_list`: List[ExternalReference] — referências individuais, uma por URL

## Lógicas e Cálculos

1. Para cada ExternalReferenceList, itera sobre todas as URLs
2. Clona ExternalReference para cada URL individual com novo GUID
3. Retorna lista plana de todas as referências

## Use Cases
1. **Automação**: Desempacota uma lista de ExternalReferenceList (cada uma contendo múltiplas URLs) em uma lista plana de ExternalReference, uma por URL de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_refs` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `unpack_refs` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

