# JTBDs (Merge Geometry and Time Range)

## JTBDs
1. Combinar geometria de um item com intervalo de tempo de outro em um único item

## Descrição
Cria um novo `DataVibe` sem assets que carrega a geometria do primeiro item de entrada (`geometry`) e o `time_range` do segundo (`time_range`). Útil para compor metadados de diferentes fontes em um único item.

## Inputs
- `geometry`: `DataVibe` (fonte da geometria)
- `time_range`: `DataVibe` (fonte do intervalo de tempo)

## Outputs
- `merged`: `DataVibe`

## Lógicas e Cálculos
- Gera `id` hash SHA-256 a partir dos IDs dos dois itens de entrada
- Cria novo `DataVibe(id, geometry, time_range, assets=[])` diretamente, sem clonagem de item existente
