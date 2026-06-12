# JTBDs (List Airbus Products)

## JTBDs
1. Encontrar imagens de satélite Airbus disponíveis para uma região e período específicos
2. Filtrar produtos por constelação (PHR/SPOT) e cobertura máxima de nuvens

## Descrição
Operação que consulta a API da Airbus para listar produtos de imageamento disponíveis (constelações PHR e SPOT) que intersectam a geometria e o intervalo de tempo fornecidos. Cada produto listado carrega metadados de aquisição e geometria real do raster.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `airbus_products` (List[AirbusProduct]): produtos Airbus disponíveis

## Lógicas e Cálculos
- Converte as constelações de string para enum `Constellation`
- Consulta a API AirBus com geometria, time range e `max_cloud_cover` (10%)
- Converte cada resultado para `AirbusProduct` com ID único, geometria real do raster e metadados da aquisição

## Use Cases
1. **Descoberta de dados**: Consultar produtos Airbus Products disponíveis para uma região.
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

- Operação atômica `list_airbus_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Catálogo remoto**: Consulta a API de catálogo de dados.

## Datasets / Fontes de Dados

- **Airbus**: Imagens de satélite de alta resolução.

