# JTBDs (List GLAD Products)

## JTBDs
1. Listar produtos florestais GLAD (Global Land Analysis) para uma região e período
2. Identificar tiles de 10°×10° disponíveis por ano

## Descrição
Operação que lista produtos florestais do laboratório GLAD da Universidade de Maryland. Determina quais tiles de 10×10 graus intersectam a geometria e quais anos possuem dados disponíveis, gerando um produto por combinação tile-ano.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `glad_products` (List[GLADProduct]): produtos GLAD listados

## Lógicas e Cálculos
- Carrega GeoJSON de geometrias de tiles GLAD (10°×10°)
- Calcula tiles que intersectam a geometria de entrada via `glad.intersecting_tiles()`
- Gera produto para cada par (tile, ano) no intervalo, validando disponibilidade via `glad.check_glad_for_year()`
- Gera ID único via SHA-256 e URL de download a partir do template GLAD
