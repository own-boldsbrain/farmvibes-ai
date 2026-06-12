# JTBDs (split_spaceeye_sequence)

## JTBDs
1. Desmembrar uma sequência de tiles em rasters individuais
2. Extrair assets ordenados de um TileSequence para itens avulsos

## Descrição
Divide uma lista de TileSequence (ex: SpaceEyeRasterSequence) de volta em uma lista de rasters individuais, um para cada asset na sequência.

## Inputs
- `sequences`: List[SpaceEyeRasterSequence] — sequências a serem divididas

## Outputs
- `rasters`: List[SpaceEyeRaster] — rasters individuais extraídos

## Lógicas e Cálculos
1. Para cada sequência, itera sobre assets ordenados
2. Para cada asset, cria um clone do tipo Sequence2Tile[type] com asset único
3. Preserva time_range individual de cada asset a partir do asset_time_range

## Use Cases
1. **Automação**: Divide uma lista de TileSequence (ex: SpaceEyeRasterSequence) de volta em uma lista de rasters individuais, um para cada asset na sequência de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Faz**: Opera sobre sequências de dados de forma estruturada.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `sequences` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `split_sequence` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

