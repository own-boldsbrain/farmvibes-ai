# JTBDs (List gNATSGO Products)

## JTBDs
1. Listar produtos de solo gNATSGO do Planetary Computer para uma geometria
2. Obter dados de solo para análises agrícolas (EUA continental)

## Descrição
Operação que consulta a coleção gNATSGO (Gridded National Soil Survey Geographic Database) do Planetary Computer e lista produtos de solo que intersectam a geometria de entrada. Limitado à área do EUA continental.

## Inputs
- `input_item` (DataVibe): geometria de interesse

## Outputs
- `gnatsgo_products` (List[GNATSGOProduct]): produtos gNATSGO listados

## Lógicas e Cálculos
- Instancia `GNATSGOCollection` e faz query com bbox da geometria
- Define time_range de cada produto como a data do item (datetime único)
- Valida que geometria esteja dentro do EUA continental; retorna erro caso contrário

## Use Cases
1. **Descoberta de dados**: Consultar produtos Gnatsgo Products disponíveis para uma região.
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

- Operação atômica `list_gnatsgo_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **Dados de solo**: SoilGrids, USDA, GNATSGO.

