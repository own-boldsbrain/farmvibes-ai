# JTBDs (List Sentinel-2 Products PC)

## JTBDs
1. Listar cenas Sentinel-2 disponíveis no Planetary Computer para uma região e período
2. Obter metadados completos incluindo órbita absoluta

## Descrição
Operação que consulta a coleção Sentinel-2 do Planetary Computer e lista produtos que intersectam a geometria e intervalo de tempo. Utiliza processamento paralelo com `ThreadPoolExecutor` para acelerar a conversão dos itens (que requer fetch da órbita absoluta do arquivo SAFE).

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `sentinel_products` (List[Sentinel2Product]): produtos Sentinel-2 listados

## Lógicas e Cálculos
- Instancia `Sentinel2Collection` e faz query com bbox e time range
- Converte itens STAC para `Sentinel2Product` em paralelo via `ThreadPoolExecutor` (24 workers default)
- Cada conversão obtém a órbita absoluta do arquivo SAFE (operação de I/O intensiva)
- Retorna erro se nenhum produto for encontrado

## Use Cases
1. **Descoberta de dados**: Consultar produtos Sentinel2 Products disponíveis para uma região.
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

- Operação atômica `list_sentinel2_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

