# JTBDs (List CDL Products)

## JTBDs
1. Listar mapas de uso do solo CDL (Cropland Data Layer) disponíveis para anos dentro de um intervalo
2. Verificar se a geometria de entrada intersecta a área de cobertura CDL (EUA continental)

## Descrição
Operação que verifica se a geometria de entrada está dentro da área de abrangência do CDL (continental US) e lista um produto por ano no intervalo de tempo fornecido, validando a disponibilidade do arquivo via URL.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `cdl_products` (List[CDLProduct]): produtos CDL anuais disponíveis

## Lógicas e Cálculos
- Carrega geometria de cobertura CDL de arquivo WKT
- Verifica interseção entre geometria de entrada e geometria CDL
- Gera anos entre `start_date.year` e `end_date.year`
- Para cada ano, valida disponibilidade via `verify_url()` no template de download
- Cria `CDLProduct` com time range de 01/01 a 31/12 do ano
