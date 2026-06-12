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

## Use Cases
1. **Descoberta de dados**: Consultar produtos Cdl Products disponíveis para uma região.
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

- Operação atômica `list_cdl_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Catálogo remoto**: Consulta a API de catálogo de dados.

## Datasets / Fontes de Dados

- **Catálogo remoto**: Metadados de produtos disponíveis.

