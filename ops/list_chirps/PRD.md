# JTBDs (List CHIRPS)

## JTBDs
1. Listar produtos de precipitação CHIRPS para uma região e período
2. Selecionar frequência (diária ou mensal) e resolução (0,05° ou 0,25°)

## Descrição
Operação que consulta o repositório CHIRPS (Climate Hazards Group InfraRed Precipitation with Station Data) e lista arquivos COG disponíveis para a frequência e resolução selecionadas. Obtém o dado mais recente disponível e calcula o footprint global do dataset.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `chirps_products` (List[ChirpsProduct]): produtos CHIRPS listados

## Lógicas e Cálculos
- Valida `freq` (daily/monthly) e `res` (p05/p25); monthly só disponível em p05
- Varre do presente até 1981 para encontrar o CHIRPS mais recente via requisição HTTP
- Obtém bbox e footprint globais a partir do COG mais recente
- Gera lista de arquivos no intervalo de tempo, iterando dia a dia ou mês a mês
- Cria `ChirpsProduct` com URL, geometria global e time range específico

## Use Cases
1. **Descoberta de dados**: Consultar produtos Chirps disponíveis para uma região.
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

- Operação atômica `list_chirps` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Catálogo remoto**: Consulta a API de catálogo de dados.

## Datasets / Fontes de Dados

- **CHIRPS**: Precipitação acumulada (0.05°, diário).

