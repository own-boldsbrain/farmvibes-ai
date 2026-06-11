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
