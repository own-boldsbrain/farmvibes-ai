# JTBDs (List Sentinel-1 Products PC)

## JTBDs
1. Listar produtos Sentinel-1 (GRD ou RTC) do Planetary Computer para uma região e período
2. Selecionar coleção: GRD (Ground Range Detected) ou RTC (Radiometric Terrain Corrected)

## Descrição
Operação que consulta o Planetary Computer para listar produtos Sentinel-1 que intersectam a geometria e intervalo de tempo. Suporta duas coleções: GRD (reflectância) e RTC (corrigida Radiometricamente e por terreno).

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `sentinel_products` (List[Sentinel1Product]): produtos Sentinel-1 listados

## Lógicas e Cálculos
- Valida coleção (`grd` ou `rtc`) contra dicionário `COLLECTIONS`
- Configura chave de assinatura do Planetary Computer via `pc.set_subscription_key()`
- Instancia coleção correspondente e faz query com geometria e time range
- Converte itens STAC para `Sentinel1Product` via `convert_to_s1_product()`
