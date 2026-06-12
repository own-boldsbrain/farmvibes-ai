# JTBDs (List Bing Maps)

## JTBDs
1. Listar tiles de basemap do Bing Maps que intersectam uma geometria em um nível de zoom
2. Obter URLs dos tiles para download posterior

## Descrição
Operação que consulta a API Bing Maps e lista tiles do conjunto `Aerial`/`Basemap` para um dado nível de zoom (0-20). Cada produto gerado contém a URL do tile, nível de zoom, tipo de imagem e camada.

## Inputs
- `user_input` (DataVibe): geometria de interesse

## Outputs
- `products` (List[BingMapsProduct]): tiles Bing Maps listados

## Lógicas e Cálculos
- Valida `zoom_level` (0-20), `imagery_set` (Aerial) e `map_layer` (Basemap)
- Consulta `BingMapsCollection.query_tiles()` com o bbox da geometria e zoom
- Gera ID único via SHA-256 combinando identificador do tile + imagery set + map layer
- Define time_range como horário atual da execução

## Use Cases
1. **Descoberta de dados**: Consultar produtos Bing Maps disponíveis para uma região.
2. **Planejamento de aquisição**: Verificar cobertura temporal e espacial antes de baixar.
3. **Curadoria de dataset**: Filtrar cenas por data, cobertura de nuvem e outros critérios.

## Faz / Não Faz

- **Faz**: Consulta a catálogos/fontes de dados para listar produtos disponíveis.
- **Faz**: Filtragem por geometria e intervalo de tempo.
- **Não Faz**: Não baixa os dados listados — apenas retorna metadados.
- **Não Faz**: Não modifica o catálogo de dados.

## Variáveis

N/A — parâmetros definidos no workflow que invoca esta operação.

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `list_bing_maps` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Catálogo remoto**: Consulta a API de catálogo de dados.

## Datasets / Fontes de Dados

- **Bing Maps**: Basemaps de satélite.

