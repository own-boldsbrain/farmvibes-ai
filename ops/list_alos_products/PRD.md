# JTBDs (List ALOS Products)

## JTBDs
1. Encontrar produtos florestais ALOS disponíveis para uma região e período
2. Obter metadados dos itens do dataset ALOS Forest do Planetary Computer

## Descrição
Operação que consulta a coleção ALOS Forest do Planetary Computer e lista produtos que intersectam a geometria e intervalo de tempo fornecidos. Utiliza a biblioteca `vibe_lib.planetary_computer` para realizar a query STAC.

## Inputs
- `input_data` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `alos_products` (List[AlosProduct]): produtos ALOS disponíveis

## Lógicas e Cálculos
- Instancia `AlosForestCollection` e faz query com geometria e time range
- Valida que cada item STAC possui geometria
- Converte `start_datetime` e `end_datetime` do item para o time range do produto
- Retorna erro se nenhum item for encontrado

## Use Cases
1. **Descoberta de dados**: Consultar produtos Alos Products disponíveis para uma região.
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
| `input_data` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `list_alos_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **ALOS PALSAR**: Mosaico anual florestal (25m).

