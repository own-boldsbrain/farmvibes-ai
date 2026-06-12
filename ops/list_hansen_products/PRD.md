# JTBDs (List Hansen Products)

## JTBDs
1. Listar produtos Global Forest Change (Hansen) para uma região e camada específica
2. Selecionar camada (treecover2000, loss, gain, lossyear, datamask, first, last)

## Descrição
Operação que lista produtos do dataset Global Forest Change (Hansen) em resolução de 30m. Identifica tiles de 10°×10° que intersectam a geometria e verifica disponibilidade do arquivo .tif para a camada selecionada.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `hansen_products` (List[HansenProduct]): produtos Hansen listados

## Lógicas e Cálculos
- Carrega geometrias de tiles GLAD (mesmo sistema de tiling) e calcula interseção
- Extrai ano final e versão do dataset a partir da URL base
- Valida que ano inicial seja 2000 e ano final ≤ ano do dataset
- Gera asset template URL e verifica disponibilidade via `verify_url()` para cada tile
- Cria `HansenProduct` com URL do asset, time range e camada

## Use Cases
1. **Descoberta de dados**: Consultar produtos Hansen Products disponíveis para uma região.
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

- Operação atômica `list_hansen_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Catálogo remoto**: Consulta a API de catálogo de dados.

## Datasets / Fontes de Dados

- **Hansen**: Global Forest Change (30m).

