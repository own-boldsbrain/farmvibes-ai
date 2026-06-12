# JTBDs (compute_raster_gradient)

## JTBDs

1. Detectar bordas e transições no terreno
2. Produzir gradiente por banda como insumo para modelos de relevo

## Descrição

Computa o gradiente horizontal de cada banda do raster de entrada usando o operador Sobel, gerando um novo raster com as bandas originais sufixadas por `_gradient`.

## Inputs

- `input_raster: Raster` — raster de entrada

## Outputs

- `output_raster: Raster` — gradiente Sobel por banda

## Lógicas e Cálculos

- Para cada banda no mapeamento de entrada, aplica `compute_sobel_gradient`
- Preserva metadados e CRS do raster original
- Anexa visualização com colormap interpolado (intervalos 0-200)
- Inclui overviews no raster de saída

## Use Cases
1. **Análise de Raster Gradient**: Gerar camada derivada de Raster Gradient para interpretação.
2. **Feature engineering**: Produzir insumos para modelos de machine learning.
3. **Monitoramento temporal**: Calcular o índice/variável para múltiplas datas e comparar.

## Faz / Não Faz

- **Faz**: Cálculo da variável/algoritmo sobre os dados de entrada.
- **Não Faz**: Não valida os resultados contra dados de campo/ground truth.
- **Não Faz**: Não modifica o raster de entrada — gera novo raster de saída.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_raster: Raster` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `compute_raster_gradient` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

