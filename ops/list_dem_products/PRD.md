# JTBDs (List DEM Products)

## JTBDs
1. Listar tiles de modelo digital de elevação (DEM) que intersectam uma geometria
2. Selecionar resolução (10m ou 30m) e provedor (ex: USGS3Dep)

## Descrição
Operação que consulta provedores de DEM (como USGS 3DEP) e lista tiles que intersectam a geometria de entrada unificada, filtrando pela resolução desejada. Utiliza coleções do Planetary Computer.

## Inputs
- `input_items` (List[DataVibe]): geometrias e/ou intervalos de tempo de interesse

## Outputs
- `dem_products` (List[DemProduct]): produtos DEM listados

## Lógicas e Cálculos
- Faz união geométrica de todos os `input_items` via `unary_union`
- Valida provedor e resolução com `validate_dem_provider()`
- Filtra itens da coleção cujo `gsd` (ground sample distance) corresponda à resolução
- Cria `DemProduct` com `tile_id`, `resolution` e `provider`

## Use Cases
1. **Descoberta de dados**: Consultar produtos Dem Products disponíveis para uma região.
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
| `input_items` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `list_dem_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **USGS/EROS**: Catálogo e download de imagens Landsat.

## Datasets / Fontes de Dados

- **DEM**: Modelo digital de elevação.

