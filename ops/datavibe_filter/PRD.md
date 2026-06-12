# JTBDs (datavibe_filter)

## JTBDs

1. Remover informações de geometria e/ou time_range de um DataVibe
2. Sanitizar metadados espaciais/temporais para cenários de teste ou anonimização

## Descrição

Filtra informações de geometria e/ou time_range de um DataVibe de entrada, substituindo por valores dummy quando solicitado.

## Inputs

- `input_item`: DataVibe — item com geometria e time_range originais

## Outputs

- `output_item`: DataVibe — item com campos filtrados

## Lógicas e Cálculos

1. Se `filter_out="geometry"` ou `"all"`: substitui geometria por bbox global (0,-90,360,90)
2. Se `filter_out="time_range"` ou `"all"`: substitui time_range por data dummy (2022-01-01)
3. Gera novo hash ID a partir dos campos filtrados
4. Retorna clone do DataVibe com assets vazios e metadados modificados

## Use Cases
1. **Automação**: Filtra informações de geometria e/ou time_range de um DataVibe de entrada, substituindo por valores dummy quando solicitado de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_item` | — | Conforme especificação da operação |

## Outcomes Esperados

- Arquivo compactado (ZIP) com resultados prontos para download.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `datavibe_filter` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

