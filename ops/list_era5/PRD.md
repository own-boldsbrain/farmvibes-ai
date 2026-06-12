# JTBDs (List ERA5)

## JTBDs
1. Listar produtos de reanálise ERA5 para uma variável, geometria e período
2. Obter dados horários (PC) ou médias mensais (CDS) conforme a origem

## Descrição
Operação que suporta dois sub-operadores: `list_era5` (dados horários do Planetary Computer, ~12 variáveis) e `list_era5_cds` (médias mensais via CDS, ~10 variáveis). Ambos listam um produto agregado por consulta contendo o dataset e a variável selecionada.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `era5_products` (List[Era5Product]): produtos ERA5 listados

## Lógicas e Cálculos
- Valida variável contra dicionário de variáveis suportadas
- `list_era5`: consulta `Era5Collection` no PC, filtra itens que contêm a variável, converte metadados
- `list_era5_cds`: constrói requisição mensal CDS com anos do intervalo e 12 meses
- Gera ID único via SHA-256 do dataset + request (CDS) ou combinação item_id + var (PC)
- Geometria global (-180,-90 a 180,90) para CDS

## Use Cases
1. **Descoberta de dados**: Consultar produtos Era5 disponíveis para uma região.
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

- Operação atômica `list_era5` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **ERA5**: Reanálise climática (0.25°, horária).

