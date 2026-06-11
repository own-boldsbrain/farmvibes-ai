# PRD — Workflow `match_merge_to_ref`

## JTBDs (Jobs To Be Done)
- Reamostrar (resample) rasters de entrada para o grid de rasters de referência.
- Fundir múltiplos rasters reamostrados em um único raster por geometria de referência.

## Casos de Uso
1. **Integração de fontes heterogêneas**: Um analista possui dados de diferentes sensores com resoluções distintas e precisa unificá-los ao grid de um sensor de referência.
2. **Alinhamento temporal-espacial**: Preparar dados de diferentes datas e sensores para análise multivariada pixel a pixel.

## Faz / Não Faz
- **Faz**: Pareia rasters de entrada e referência com geometrias interseccionantes.
- **Faz**: Reamostra cada raster de entrada para o grid do seu par de referência.
- **Faz**: Agrupa rasters reamostrados por geometria de referência.
- **Faz**: Funde cada grupo em um único raster.
- **Não Faz**: Não altera o sistema de coordenadas além do necessário para o grid de referência.
- **Não Faz**: Não realiza correção atmosférica ou calibração.

## Users Inputs
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `rasters` | list | — | Rasters de entrada a serem reamostrados |
| `ref_rasters` | list | — | Rasters de referência (grid alvo) |
| `resampling` | string | bilinear | Método de reamostragem (ver rasterio.enums.Resampling) |

## System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `match_rasters` | Raster | Rasters com informação dos rasters de entrada no grid de referência |

## Outcomes Esperados
- Rasters de entrada são reamostrados para coincidir exatamente com a resolução, extensão e CRS dos rasters de referência.
- Rasters que caem na mesma geometria de referência são fundidos em um único raster.
- Perda mínima de informação, dependendo do método de reamostragem escolhido.

## APIs
- **Ops internas**: `pair_intersecting_rasters`, `match_raster_to_ref`, `group_rasters_by_geometries`, `merge_rasters`

## CRUD
- **Create**: Submeter `farmvibes-ai run match_merge_to_ref`.
- **Read**: Sink `match_rasters`.

## Bancos de Dados
Nenhum.

## Datasets e JSON Files
Nenhum.

## Tabelas
Nenhuma.

## Lógicas e Cálculos
1. `pair_intersecting_rasters` — Encontra pares (raster_entrada, raster_referência) cujas geometrias se intersectam.
2. `match_raster_to_ref` — Para cada par:
   - Reamostra o raster de entrada para o grid do raster de referência usando o método `resampling` (bilinear, nearest, cubic, etc.).
3. `group_rasters_by_geometries` — Agrupa os rasters reamostrados que estão contidos na geometria de um mesmo raster de referência.
4. `merge_rasters` — Para cada grupo, funde todos os rasters em um único raster (ex.: média, mediana, ou empilhamento conforme implementação).
- Métodos de reamostragem suportados: conforme rasterio.enums.Resampling (bilinear, nearest, cubic, lanczos, average, etc.).

## Match Merge to Ref — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar Fotovoltaica | GD, GC | Fusão de imagens multiespectrais com modelos digitais de elevação para modelagem de irradiância | Gera entrada completa para simulação de geração solar |
| Hidrelétrica | UHE, PCH | Integra dados de precipitação, cobertura do solo e elevação para análise de bacia hidrográfica | Subsidia modelo hidrológico de reservatórios |
| Geração Eólica | Onshore, Offshore | Reamostra dados de vento (modelo) e rugosidade do solo para grid único de referência | Prepara camadas de entrada para micrositing eólico |
| Biomassa / Bioenergia | Resíduos agrícolas | Funde múltiplos índices espectrais de diferentes sensores em raster multibanda único | Enriquece feature set para modelos de estimativa de biomassa |
| Distribuição de Energia | Concessionárias | Alinha imagens de diferentes datas e sensores ao grid de referência para séries temporais de vegetação | Permite análise multitemporal consistente em faixas de servidão |
