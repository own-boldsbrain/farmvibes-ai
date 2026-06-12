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

## Use Cases
1. **Descoberta de dados**: Consultar produtos Glad Products disponíveis para uma região.
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

- Operação atômica `list_glad_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Catálogo remoto**: Consulta a API de catálogo de dados.

## Datasets / Fontes de Dados

- **GLAD**: Extensão florestal global (30m).

