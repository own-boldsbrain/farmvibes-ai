# JTBDs (List Climatology Lab)

## JTBDs
1. Listar produtos climáticos TerraClimate ou GridMET para uma variável e período
2. Obter URLs dos arquivos NetCDF para download

## Descrição
Operação que suporta dois sub-operadores: `list_terraclimate` e `list_gridmet`. Consulta coleções do Climatology Lab e lista produtos anuais para a variável selecionada (ex: tmax, pr, vpd) no intervalo de tempo fornecido.

## Inputs
- `input_item` (DataVibe): intervalo de tempo de interesse

## Outputs
- `products` (List[ClimatologyLabProduct]): produtos climatológicos listados

## Lógicas e Cálculos
- Valida se a variável solicitada existe nas `asset_keys` da coleção
- TerraClimate: variáveis como aet, def, pet, ppt, q, soil, srad, swe, tmax, tmin, vap, ws, vpd, PDSI
- GridMET: variáveis como bi, erc, etr, fm100, pr, rmax, rmin, sph, srad, th, tmmn, tmmx, vpd, vs
- Define time_range de cada produto como ano completo (01/01 a 31/12)
- Armazena URL e nome da variável no produto

## Use Cases
1. **Descoberta de dados**: Consultar produtos Climatology Lab disponíveis para uma região.
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

- Operação atômica `list_climatology_lab` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Catálogo remoto**: Consulta a API de catálogo de dados.

## Datasets / Fontes de Dados

- **Catálogo remoto**: Metadados de produtos disponíveis.

