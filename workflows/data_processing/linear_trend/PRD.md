# PRD — Workflow `chunked_linear_trend`

## JTBDs (Jobs To Be Done)

- Calcular a tendência linear pixel a pixel ao longo de uma série temporal de rasters (ex.: NDVI ao longo de vários anos).
- Detectar degradação ou melhora na vegetação em escala de sub-talhão.

## Casos de Uso

1. **Análise de degradação de terras**: Um pesquisador calcula a tendência do NDVI ao longo de 10 anos para identificar áreas com declínio de vegetação.
2. **Monitoramento de recuperação**: Avaliar se práticas de conservação estão melhorando a cobertura vegetal ao longo do tempo.

## Faz / Não Faz

- **Faz**: Divide os rasters em chunks espaciais para processamento paralelo.
- **Faz**: Ajusta uma regressão linear simples (pixel-wise) para cada pixel ao longo da dimensão temporal.
- **Faz**: Combina os chunks em um raster final com coeficiente angular (inclinação) e estatísticas de teste.
- **Não Faz**: Não ajusta modelos não-lineares.
- **Não Faz**: Não remove sazonalidade automaticamente.

## Users Inputs

| Parâmetro       | Tipo | Descrição                                        |
| --------------- | ---- | ------------------------------------------------ |
| `input_rasters` | list | Lista de rasters (ex.: NDVI de diferentes datas) |
| `chunk_step_y`  | int  | Tamanho do chunk no eixo Y (grid points)         |
| `chunk_step_x`  | int  | Tamanho do chunk no eixo X (grid points)         |

## System Outputs

| Sumidouro             | Tipo   | Descrição                                                    |
| --------------------- | ------ | ------------------------------------------------------------ |
| `linear_trend_raster` | Raster | Raster com a inclinação da tendência e estatísticas de teste |

## Outcomes Esperados

- Raster multibanda onde cada banda contém: inclinação (slope), intercepto, p-valor, R² ou estatísticas da regressão.
- Processamento eficiente em memória graças ao chunking.
- Possibilidade de detectar tendências positivas (recuperação) ou negativas (degradação).

## APIs

- **Ops internas**: `chunk_raster`, `linear_trend`, `combine_chunks`

## CRUD

- **Create**: Submeter `farmvibes-ai run chunked_linear_trend`.
- **Read**: Sink `linear_trend_raster`.

## Bancos de Dados

Nenhum.

## Datasets e JSON Files

Nenhum.

## Tabelas

Nenhuma.

## Lógicas e Cálculos

1. `chunk_raster` — Divide cada raster em tiles de tamanho `chunk_step_y × chunk_step_x`.
2. `linear_trend` — Para cada chunk:
   - Organiza os valores de cada pixel ao longo da dimensão temporal.
   - Ajusta regressão linear: `y = β₀ + β₁ * t + ε`, onde `t` é o tempo (índice da data).
   - Calcula: inclinação (β₁), intercepto (β₀), p-valor, R², erro padrão.
3. `combine_chunks` — Recombina todos os chunks no raster final.

- Saída típica: bandas = [slope, intercept, p_value, r_squared, std_error].

## Chunked Linear Trend — Perfis Energéticos

| Perfil (Classe)            | Subclasse              | Aplicação do Workflow                                                                   | Valor Gerado                                                            |
| -------------------------- | ---------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Mercado de Carbono         | REDD+, Reflorestamento | Detecta tendência de degradação ou recuperação florestal pixel a pixel ao longo de anos | Subsidia linha de base e monitoramento de projetos de carbono florestal |
| Biomassa / Bioenergia      | Floresta energética    | Avalia tendência de produtividade de biomassa para planejamento de colheita             | Identifica áreas com declínio ou melhora de produtividade energética    |
| Eficiência Energética      | Irrigação              | Monitora tendência de NDVI para avaliar eficácia de práticas conservacionistas          | Comprova melhoria da cobertura vegetal com manejo de precisão           |
| Geração Solar Fotovoltaica | GC                     | Detecta tendência de sombreamento ou regeneração vegetal sobre painéis solares          | Alerta para necessidade de manutenção em usinas solares                 |
| Hidrelétrica               | UHE, PCH               | Avalia tendência de cobertura vegetal em bacias hidrográficas de reservatórios          | Subsidia planejamento de controle de assoreamento                       |
