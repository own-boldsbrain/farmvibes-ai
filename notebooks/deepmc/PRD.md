# JTBDs (deepmc)

## JTBDs

1. Treinar modelo de previsão microclimática (temperatura, velocidade do vento)
2. Realizar inferência de 24h usando dados históricos de estação meteorológica
3. Combinar observações históricas + previsões numéricas (HRRR) para melhor acurácia
4. Classificar cenários como relevantes ou não-relevantes com base na correlação dos dados

## Descrição

Notebook de previsão microclimática (DeepMC) que treina modelos para temperatura e velocidade do vento usando dados históricos de estações (ex: AGWeatherNet) e previsões numéricas HRRR (via pacote Herbie). Suporta dois modos: (1) com dados históricos + forecast relevantes, (2) apenas dados históricos. Requer mínimo de 2 anos de dados históricos para treinamento e 528 pontos para inferência.

## Use Cases

1. **Previsão agrícola**: Um produtor obtém previsão microclimática localizada para planejar irrigação e aplicação de defensivos.
2. **Energia renovável**: Um operador de parque eólico prevê velocidade do vento em escala local para otimizar geração.
3. **Pesquisa**: Um climatologista valida modelos de downscaling estatístico com dados de estações reais.

## Faz / Não Faz

- **Faz**: Treinamento de modelo para temperatura e velocidade do vento.
- **Faz**: Inferência de 24h com dados históricos + HRRR.
- **Faz**: Classificação de cenários como relevantes ou não-relevantes.
- **Não Faz**: Não substitui previsão numérica convencional para grandes áreas.
- **Não Faz**: Requer mínimo 2 anos de dados históricos para treinamento.

## Notebooks

- mc_forecast.ipynb: Previsão microclimática com DeepMC (treinamento e inferência)

## Inputs

- Dados históricos da estação (datetime, umidade, vento, temperatura) — mínimo 2 anos
- Previsões HRRR (via Herbie)
- Coordenadas da estação
- Parâmetros: chunk_size, weather_type

## Outputs

- Modelo treinado para previsão de 24h
- Previsões de temperatura e velocidade do vento
- Métricas de erro (relevante vs. não-relevante)

## Variáveis

| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| `chunk_size` | int | — | Tamanho do chunk para processamento |
| `weather_type` | string | — | Tipo de variável (temperature, wind_speed) |
| `min_history_years` | int | 2 | Anos mínimos de dados históricos |

## Lógicas / Cálculos

1. Download de dados históricos da estação (AGWeatherNet) — mínimo 2 anos (datetime, umidade, vento, temperatura).
2. Download de previsões HRRR via pacote Herbie.
3. DeepMC training — Treinamento de modelo de correção de forecast usando dados históricos + HRRR.
4. DeepMC inference — Inferência de 24h para temperatura e velocidade do vento.
5. Classificação de cenários (relevante vs. não-relevante) com base na correlação dos dados.

## Outcomes Esperados

- Previsões microclimáticas localizadas (24h) com acurácia superior à previsão numérica bruta.
- Modelo treinado específico para a estação/locação.
- Métricas de erro segregadas por relevância dos dados de entrada.

## APIs / Conectores

- **AGWeatherNet**: Dados históricos de estações meteorológicas (API pública).
- **HRRR / Herbie**: Previsões numéricas de alta resolução (NOAA).
- **DeepMC**: Algoritmo proprietário de correção microclimática.

## Datasets / Fontes de Dados

- AGWeatherNet: dados históricos de estação (temperatura, vento, umidade).
- HRRR (High-Resolution Rapid Refresh): previsões numéricas a 3km.
- Modelo DeepMC treinado (salvo para reuso).

## Workflows Utilizados

- deep_weather/deepmc/training
- deep_weather/deepmc/inference
- data_ingestion/herbie/download_hrrr_data
