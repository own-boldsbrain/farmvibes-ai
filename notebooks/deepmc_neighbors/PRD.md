# JTBDs (deepmc_neighbors)

## JTBDs

1. Inferir previsão do tempo para estações sem dados ou com dados limitados
2. Utilizar redes neurais gráficas (GNN) para aprendizado cruzado entre estações vizinhas
3. Capturar relações espaciais entre estações meteorológicas próximas (< 25 km)

## Descrição

Extensão do notebook deepmc que usa Graph Neural Networks (GNN) para prever variáveis climáticas em estações sem dados históricos, explorando dados de estações vizinhas. Cada estação é um nó no grafo; arestas conectam estações próximas (< 25 km). O pipeline inclui: download de dados de estações vizinhas (AGWeatherNet), pré-processamento (wavelet), treinamento DeepMC para estações vizinhas, criação de embeddings (DeepMC + HRRR), treinamento GNN e inferência.

## Use Cases

1. **Previsão em áreas sem estação**: Um produtor em região remota obtém previsão microclimática usando dados de estações vizinhas.
2. **Expansão de rede**: Uma empresa de energia estima condições climáticas em locais de interesse sem estação instalada.
3. **Pesquisa em GNN**: Um cientista de dados valida técnicas de aprendizado em grafos para problemas climáticos.

## Faz / Não Faz

- **Faz**: Download de dados de estações vizinhas (AGWeatherNet, < 25 km).
- **Faz**: Pré-processamento wavelet para denoising.
- **Faz**: Treinamento DeepMC para cada estação vizinha.
- **Faz**: Criação de embeddings espaço-temporais (DeepMC + HRRR).
- **Faz**: Treinamento GNN e inferência para estação alvo.
- **Não Faz**: Não funciona sem ao menos uma estação vizinha com dados.
- **Não Faz**: Requer mínimo 2 anos de dados das estações vizinhas.

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

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `target_station_id` | string | Identificação da estação alvo (sem dados) |
| `max_distance_km` | int | 25 | Distância máxima para considerar vizinhança |
| `chunk_size` | int | — | Tamanho do chunk para processamento |

## Lógicas / Cálculos

1. Download de dados de estações vizinhas (AGWeatherNet, distância < 25 km, mínimo 2 anos).
2. Pré-processamento wavelet para remoção de ruído.
3. Treinamento DeepMC para cada estação vizinha (modelo de correção de forecast).
4. Criação de embeddings combinando saídas DeepMC + HRRR.
5. Treinamento GNN: grafo onde nós = estações, arestas = distância < 25 km.
6. Inferência GNN para estação alvo (nó sem dados históricos).

## Outcomes Esperados

- Previsões microclimáticas para estações sem dados históricos.
- Modelo GNN que captura relações espaciais entre estações.
- Embeddings espaço-temporais reutilizáveis.

## APIs / Conectores

- **AGWeatherNet**: Dados históricos de estações meteorológicas.
- **HRRR / Herbie**: Previsões numéricas de alta resolução.
- **DeepMC**: Algoritmo de correção microclimática.

## Datasets / Fontes de Dados

- AGWeatherNet: dados de estações vizinhas (temperatura, vento, umidade).
- HRRR: previsões numéricas.
- Modelos DeepMC treinados por estação vizinha.

## Workflows Utilizados

- deep_weather/deepmc/training
- deep_weather/deepmc/inference
- data_ingestion/herbie/download_hrrr_data
