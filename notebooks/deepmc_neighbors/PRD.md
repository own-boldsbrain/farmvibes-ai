# JTBDs (deepmc_neighbors)

## JTBDs
1. Inferir previsão do tempo para estações sem dados ou com dados limitados
2. Utilizar redes neurais gráficas (GNN) para aprendizado cruzado entre estações vizinhas
3. Capturar relações espaciais entre estações meteorológicas próximas (< 25 km)

## Descrição
Extensão do notebook deepmc que usa Graph Neural Networks (GNN) para prever variáveis climáticas em estações sem dados históricos, explorando dados de estações vizinhas. Cada estação é um nó no grafo; arestas conectam estações próximas (< 25 km). O pipeline inclui: download de dados de estações vizinhas (AGWeatherNet), pré-processamento (wavelet), treinamento DeepMC para estações vizinhas, criação de embeddings (DeepMC + HRRR), treinamento GNN e inferência.

## Notebooks
- gnn_forecast.ipynb: Previsão microclimática com GNN usando estações vizinhas

## Inputs
- Dados históricos de estações vizinhas (mín. 2 anos)
- Previsões HRRR
- Coordenadas das estações
- Identificação da estação alvo (sem dados)

## Outputs
- Modelo GNN treinado
- Previsões para estação com dados limitados
- Embeddings espaço-temporais (DeepMC + HRRR)
- Métricas de validação

## Workflows Utilizados
- deep_weather/deepmc/training
- deep_weather/deepmc/inference
- data_ingestion/herbie/download_hrrr_data
