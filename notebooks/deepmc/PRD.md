# JTBDs (deepmc)

## JTBDs
1. Treinar modelo de previsão microclimática (temperatura, velocidade do vento)
2. Realizar inferência de 24h usando dados históricos de estação meteorológica
3. Combinar observações históricas + previsões numéricas (HRRR) para melhor acurácia
4. Classificar cenários como relevantes ou não-relevantes com base na correlação dos dados

## Descrição
Notebook de previsão microclimática (DeepMC) que treina modelos para temperatura e velocidade do vento usando dados históricos de estações (ex: AGWeatherNet) e previsões numéricas HRRR (via pacote Herbie). Suporta dois modos: (1) com dados históricos + forecast relevantes, (2) apenas dados históricos. Requer mínimo de 2 anos de dados históricos para treinamento e 528 pontos para inferência.

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

## Workflows Utilizados
- deep_weather/deepmc/training
- deep_weather/deepmc/inference
- data_ingestion/herbie/download_hrrr_data
