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
