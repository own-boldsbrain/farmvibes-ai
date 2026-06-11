# JTBDs (List ERA5)

## JTBDs
1. Listar produtos de reanálise ERA5 para uma variável, geometria e período
2. Obter dados horários (PC) ou médias mensais (CDS) conforme a origem

## Descrição
Operação que suporta dois sub-operadores: `list_era5` (dados horários do Planetary Computer, ~12 variáveis) e `list_era5_cds` (médias mensais via CDS, ~10 variáveis). Ambos listam um produto agregado por consulta contendo o dataset e a variável selecionada.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `era5_products` (List[Era5Product]): produtos ERA5 listados

## Lógicas e Cálculos
- Valida variável contra dicionário de variáveis suportadas
- `list_era5`: consulta `Era5Collection` no PC, filtra itens que contêm a variável, converte metadados
- `list_era5_cds`: constrói requisição mensal CDS com anos do intervalo e 12 meses
- Gera ID único via SHA-256 do dataset + request (CDS) ou combinação item_id + var (PC)
- Geometria global (-180,-90 a 180,90) para CDS
