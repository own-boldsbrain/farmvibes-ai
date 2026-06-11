# JTBDs (List NAIP Products)

## JTBDs
1. Listar tiles NAIP (National Agriculture Imagery Program) para uma região e período
2. Obter metadados de resolução e ano das imagens aéreas

## Descrição
Operação que consulta a coleção NAIP do Planetary Computer e lista tiles de imagens aéreas de alta resolução (tipicamente 0.6-1m) que intersectam a geometria e período fornecidos. Cada produto contém resolução (gsd) e ano de aquisição.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `naip_products` (List[NaipProduct]): produtos NAIP listados

## Lógicas e Cálculos
- Instancia `NaipCollection` e faz query com bbox e time range
- Converte datetime e propriedades `gsd` (ground sample distance) e `naip:year` do item
- Gera `NaipProduct` com tile_id, resolução e ano
