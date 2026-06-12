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

## Use Cases
1. **Descoberta de dados**: Consultar produtos Sentinel1 Products disponíveis para uma região.
2. **Planejamento de aquisição**: Verificar cobertura temporal e espacial antes de baixar.
3. **Curadoria de dataset**: Filtrar cenas por data, cobertura de nuvem e outros critérios.

## Faz / Não Faz

- **Faz**: Consulta a catálogos/fontes de dados para listar produtos disponíveis.
- **Faz**: Filtragem por geometria e intervalo de tempo.
- **Não Faz**: Não baixa os dados listados — apenas retorna metadados.
- **Não Faz**: Não modifica o catálogo de dados.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_item` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `list_sentinel1_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.
- **Sentinel-1 (SAR)**: Radar C-band, GRD e RTC.

