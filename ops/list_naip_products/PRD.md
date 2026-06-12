# JTBDs (List NAIP Products)

## JTBDs
1. Listar tiles NAIP (National Agriculture Imagery Program) para uma região e período
2. Obter metadados de resolução e ano das imagens aéreas

## Descrição
Operação que consulta a coleção NAIP do Planetary Computer e lista tiles de imagens aéreas de alta resolução (tipicamente 0.6-1m) que intersectam a geometria e período fornecidos. Cada produto contém resolução (gsd) e ano de aquisição.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `naip_products` (List[NaipProduct]): produtos NAIP listados

## Lógicas e Cálculos
- Instancia `NaipCollection` e faz query com bbox e time range
- Converte datetime e propriedades `gsd` (ground sample distance) e `naip:year` do item
- Gera `NaipProduct` com tile_id, resolução e ano

## Use Cases
1. **Descoberta de dados**: Consultar produtos Naip Products disponíveis para uma região.
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

- Operação atômica `list_naip_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **NAIP**: Imagens aéreas RGB/NIR dos EUA (1m).

