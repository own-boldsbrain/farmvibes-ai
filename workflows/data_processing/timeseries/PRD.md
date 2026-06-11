# PRD — Workflows `timeseries_aggregation` e `timeseries_masked_aggregation`

## JTBDs (Jobs To Be Done)
- Agregar estatísticas descritivas (média, desvio padrão, máximo, mínimo) de todas as regiões de um raster e organizá-las em uma série temporal.
- Computar séries temporais apenas para regiões mascaradas (ex.: ignorar nuvens).

## Casos de Uso
1. **Monitoramento sazonal**: Um pesquisador calcula a média mensal de NDVI para um talhão ao longo de 3 anos.
2. **Séries com máscara de nuvens**: Utilizar `timeseries_masked_aggregation` para excluir automaticamente pixels nublados da estatística.

## Faz / Não Faz
### timeseries_aggregation
- **Faz**: Calcula estatísticas zonais (mean, std, max, min) para cada região definida pela geometria de entrada.
- **Faz**: Agrega as estatísticas em uma série temporal ordenada por data.
- **Não Faz**: Não permite funções de agregação personalizadas além das 4 suportadas.

### timeseries_masked_aggregation
- **Faz**: Aplica uma máscara antes de calcular as estatísticas.
- **Faz**: Filtra rasters onde a proporção de área mascarada excede o threshold.
- **Não Faz**: Não gera a máscara — ela deve ser fornecida como entrada.

## Users Inputs

### timeseries_aggregation
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `raster` | Raster | Raster de entrada |
| `input_geometry` | Geometry | Geometria de interesse |

### timeseries_masked_aggregation
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `raster` | Raster | Raster de entrada |
| `mask` | Raster | Máscara (ex.: nuvens, sombras) |
| `input_geometry` | Geometry | Geometria de interesse |
| `timeseries_masked_thr` | float | Threshold máximo de conteúdo mascarado permitido (ex.: 0.3 = 30%) |

## System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `timeseries` | Timeseries | Série temporal das estatísticas agregadas |

## Outcomes Esperados
- Para cada data/raster, são computados: mean, std, min, max.
- Em `timeseries_masked_aggregation`, rasters com mais que `timeseries_masked_thr` de área mascarada são excluídos da série.
- A série temporal pode ser plotada ou exportada para análise downstream.

## APIs
- **Ops internas**: `summarize_raster`, `aggregate_statistics_timeseries` (e variante `summarize_masked_raster`)

## CRUD
- **Create**: Submeter `timeseries_aggregation` ou `timeseries_masked_aggregation`.
- **Read**: Sink `timeseries`.

## Bancos de Dados
Nenhum. Dados mantidos em memória/armazenamento do cluster.

## Datasets e JSON Files
Nenhum.

## Tabelas
Estrutura conceitual da série temporal:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `date` | datetime | Data do raster |
| `mean` | float | Média dos pixels na região |
| `std` | float | Desvio padrão |
| `min` | float | Valor mínimo |
| `max` | float | Valor máximo |
| `masked_fraction` | float | (Apenas masked) Fração de pixels mascarados |

## Lógicas e Cálculos
### timeseries_aggregation
1. `summarize_raster` — Para cada raster de entrada:
   - Para cada região dentro de `input_geometry`, calcula:
     - `mean = Σ(pixel_value) / N`
     - `std = sqrt(Σ(pixel_value - mean)² / N)`
     - `min = min(pixel_value)`
     - `max = max(pixel_value)`
2. `aggregate_statistics_timeseries` — Agrupa as estatísticas por data, criando uma série temporal ordenada.

### timeseries_masked_aggregation
1. `summarize_masked_raster` — Igual ao anterior, mas ignora pixels onde `mask != 0`.
2. Calcula `masked_fraction = (pixels_mascarados / total_pixels)`.
3. Se `masked_fraction > timeseries_masked_thr`, o raster é descartado da série.
4. `aggregate_statistics_timeseries` — Mesma agregação.

## Timeseries Aggregation — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Hidrelétrica | UHE, PCH | Agrega série temporal de NDWI e precipitação para monitoramento de volume de reservatórios | Subsidia previsão de disponibilidade hídrica para geração |
| Biomassa / Bioenergia | Cana, Floresta | Calcula média e desvio de NDVI por talhão ao longo do ciclo safra para estimativa de produtividade | Gera indicadores temporais de biomassa para bioenergia |
| Eficiência Energética | Irrigação | Série temporal de evapotranspiração e NDMI para manejo de irrigação por zona | Otimiza uso de água com base em estatísticas zonais |
| Mercado de Carbono | REDD+ | Séries de cobertura florestal por polígono para linha de base histórica de carbono | Evidencia trajetória de desmatamento para metodologias de crédito |
| Geração Solar Fotovoltaica | GD, GC | Estatísticas zonais de albedo e cobertura de nuvens sobre áreas de usinas solares | Suporta análise de degradação de performance ao longo do tempo |
