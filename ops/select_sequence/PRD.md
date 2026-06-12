# JTBDs (Select Sequence)

## JTBDs
1. Selecionar N rasters de uma sequência garantindo comprimento fixo na saída
2. Oferecer diferentes critérios de seleção: primeiros, últimos ou regularmente espaçados

## Descrição
Recebe um `RasterSequence` (ou `List[Raster]`) e seleciona `num` entradas conforme critério (`first`, `last`, `regular`). Se a entrada for `RasterSequence`, primeiro converte para lista clonando cada asset individualmente. Erro se a sequência tiver menos entradas que `num`.

## Inputs
- `rasters`: `RasterSequence`
- Parâmetros: `num` (padrão 2), `criterion` (`"first"`, `"last"`, `"regular"`)

## Outputs
- `sequence`: `RasterSequence`

## Lógicas e Cálculos
- Se `RasterSequence`: clona cada asset em `Raster` individual com geometria e time_range específicos
- `first`: índices `0..num-1`
- `last`: índices `len-num..len-1`
- `regular`: `np.round(np.linspace(0, len-1, num)).astype(int)`
- Cria `RasterSequence.clone_from` com id = `select_{criterion}_{guid}`

## Use Cases
1. **Automação**: Recebe um `RasterSequence` (ou `List[Raster]`) e seleciona `num` entradas conforme critério (`first`, `last`, `regular`) de forma programática e escalável.
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
| `rasters` | — | Conforme especificação da operação |
| `num` | — | Conforme especificação da operação |
| `criterion` | — | Conforme especificação da operação |
| `"first"` | — | Conforme especificação da operação |
| `"last"` | — | Conforme especificação da operação |
| `"regular"` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `select_sequence` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

