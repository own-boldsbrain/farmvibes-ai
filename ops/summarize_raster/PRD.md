# JTBDs (summarize_raster / summarize_masked_raster)

## JTBDs

1. Calcular estatísticas descritivas (média, desvio, min, max) de um raster
2. Calcular estatísticas apenas em regiões não mascaradas de um raster

## Descrição

Computa média, desvio padrão, mínimo, máximo e proporção mascarada de um raster, opcionalmente aplicando uma máscara booleana para excluir regiões.

## Inputs

- `raster`: Raster — raster a ser sumarizado
- `input_geometry`: DataVibe — geometria de interesse
- `mask`: Raster (opcional) — máscara booleana para exclusão

## Outputs

- `summary`: DataSummaryStatistics — estatísticas em CSV

## Lógicas e Cálculos

1. Recorta raster pela geometria de interseção com input_geometry
2. Carrega como masked array
3. Se mask fornecida, combina máscaras (dados OR mask)
4. Calcula mean, std, min, max, masked_ratio
5. Salva em CSV indexado por data
