# JTBDs (Select Necessary Coverage Items)

## JTBDs
1. Selecionar subconjunto mínimo de itens que cobre espacialmente a geometria de bounds
2. Descartar grupos que não conseguem cobrir a geometria alvo com o limiar mínimo

## Descrição
Agrupa `items` por `group_attribute` (ex: `time_range`). Para cada `bounds_item`, verifica se o grupo cobre a geometria (`unary_union` ≥ `min_cover`). Então, gulosa e recursivamente, seleciona o subconjunto mínimo necessário de itens com overlap decrescente até atingir o limiar `within_threshold`.

## Inputs
- `bounds_items`: `List[DataVibe]`
- `items`: `List[DataVibe]`
- Parâmetros: `min_cover`, `within_threshold`, `max_items`, `group_attribute`

## Outputs
- `filtered_items`: `@INHERIT(items)`

## Lógicas e Cálculos
- Valida `0 < min_cover < within_threshold < 1`
- Agrupa items por `group_attribute`, limita a `max_items` por grupo ordenado por área de interseção
- `can_cover`: testa se `is_approx_within(geom, unary_union(item_geoms), threshold)`
- `filter_necessary_items`: guloso — pega o item com maior interseção, subtrai geometria, recursa até cobrir
- Desduplica por `item.id` no final

## Use Cases
1. **Automação**: Agrupa `items` por `group_attribute` (ex: `time_range`) de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `bounds_items` | — | Conforme especificação da operação |
| `items` | — | Conforme especificação da operação |
| `min_cover` | — | Conforme especificação da operação |
| `within_threshold` | — | Conforme especificação da operação |
| `max_items` | — | Conforme especificação da operação |
| `group_attribute` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `select_necessary_coverage_items` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

