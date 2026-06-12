# JTBDs (List Landsat Products PC)

## JTBDs
1. Listar cenas Landsat disponíveis no Planetary Computer para uma região e período
2. Obter metadados dos tiles para download ou processamento posterior

## Descrição
Operação que consulta a coleção Landsat do Planetary Computer e lista produtos que intersectam a geometria e intervalo de tempo fornecidos. Cada produto contém ID, geometria e data da cena.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `landsat_products` (List[LandsatProduct]): produtos Landsat listados

## Lógicas e Cálculos
- Instancia `LandsatCollection` e faz query com bbox e time range
- Converte datetime do item STAC para time_range do produto
- Armazena o tile_id (ID original do item)
- Retorna erro se nenhum produto for encontrado

## Use Cases
1. **Descoberta de dados**: Consultar produtos Landsat Products Pc disponíveis para uma região.
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

- Operação atômica `list_landsat_products_pc` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **USGS/EROS**: Catálogo e download de imagens Landsat.

## Datasets / Fontes de Dados

- **Landsat 5/7/8/9**: Reflectância de superfície, 30m (15m pancromático).

