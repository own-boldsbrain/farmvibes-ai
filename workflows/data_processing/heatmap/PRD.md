# PRD — Workflow `classification` (heatmap)

## JTBDs (Jobs To Be Done)
- Gerar mapas de calor (heatmaps) de nutrientes do solo (Carbono, Nitrogênio, Fósforo, pH) a partir de imagens Sentinel-2 e amostras coletadas em campo.
- Reduzir a necessidade de amostragem densa de solo utilizando aprendizado de máquina para interpolação espacial.

## Casos de Uso
1. **Agricultura de precisão**: Um agrônomo coleta amostras de solo espaçadas (~50–200 pés) e utiliza o workflow para gerar um mapa contínuo de nutrientes para toda a fazenda.
2. **Tomada de decisão**: O produtor utiliza o heatmap para aplicar fertilizantes de forma localizada (taxa variável).

## Faz / Não Faz
- **Faz**: Calcula índices espectrais (NDVI, EVI, PRI, etc.) a partir de imagens Sentinel-2.
- **Faz**: Interpola valores de nutrientes das amostras para grupos de pixels vizinhos.
- **Faz**: Classifica os dados em bins (ex.: baixo, médio, alto).
- **Faz**: Treina um classificador Random Forest.
- **Faz**: Prediz nutrientes para toda a extensão do talhão.
- **Faz**: Gera um arquivo shapefile (zip) com os polígonos classificados.
- **Não Faz**: Não substitui análise laboratorial de solo.
- **Não Faz**: Não ingere dados do ADMAg — espera que as amostras já estejam carregadas como `prescriptions`.

## Users Inputs
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `input_raster` | Raster | Imagem Sentinel-2 da área |
| `samples` | ExternalReferences | Referências externas para amostras de solo (ADMAg) |
| `attribute_name` | string | Nome do nutriente (C, N, P, pH) |
| `buffer` | float | Distância de offset para interpolação |
| `index` | string | Índice espectral (ex.: evi, pri, ndvi) |
| `bins` | int | Número de grupos para classificação |
| `simplify` | string | Método de simplificação: 'simplify', 'convex' ou 'none' |
| `tolerance` | float | Tolerância para simplificação geométrica (na unidade do CRS) |
| `data_scale` | bool | Se `true`, aplica StandardScaler |
| `max_depth` | int? | Profundidade máxima da Random Forest |
| `n_estimators` | int | Número de árvores na floresta |
| `random_state` | int | Semente aleatória |

## System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `result` | Zip | Arquivo zip contendo shapefile com polígonos classificados por nutriente |

## Outcomes Esperados
- Mapa de calor contínuo do nutriente selecionado para a área da fazenda.
- Precisão proporcional à densidade de amostras (ideal: ~50 pés de espaçamento).
- Arquivo shapefile pronto para uso em sistemas de agricultura de precisão.

## APIs
- **Op interna**: `compute_index` (via workflow `index`), `soil_sample_heatmap_using_classification`
- **Dependência externa**: Azure Data Manager for Agriculture (ADMAg) para hierarquia Party → Field → Season → Crop e upload de prescriptions.
- **Submissão**: `farmvibes-ai run heatmap_intermediate`

## CRUD
- **Create**: Submeter workflow.
- **Read**: Sink `result` (zip com shapefile).
- **Update**: Reexecutar com novos parâmetros ou amostras.
- **Delete**: Não se aplica.

## Bancos de Dados
- **ADMAg**: Banco externo (Azure). Hierarquia: Party > Field > Season > Crop.
  - Tabela conceitual: `PrescriptionMap` → contém `prescription_map_id`, `party_id`, `field_id`, `season_id`, `crop_id`, `samples_geojson`.

## Datasets e JSON Files
- **Amostras de solo**: Enviadas como GeoJSON para ADMAg via API REST.
  - Schema: `{ "type": "FeatureCollection", "features": [{"geometry": {...}, "properties": {"attribute_name": <valor>}}] }`

## Tabelas
| Entidade | Atributos |
|----------|-----------|
| PrescriptionMap | id, party_id, field_id, season_id, crop_id, samples |

## Lógicas e Cálculos
1. `compute_index` (sub-workflow `index`) — Calcula o índice espectral escolhido (ex.: NDVI, EVI) a partir das bandas Sentinel-2.
2. `soil_sample_heatmap_using_classification`:
   a. **Leitura**: Lê raster Sentinel-2 e amostras do ADMAg.
   b. **Clip**: Recorta ambos usando o limite da fazenda.
   c. **Interpolação espacial**: Para cada pixel dentro da distância `buffer` de uma amostra, atribui o valor do nutriente.
   d. **Classificação**: Agrupa valores em `bins` usando `numpy.histogram`.
   e. **Treinamento**: Random Forest Classifier (`n_estimators`, `max_depth`, `random_state`). Se `data_scale=true`, aplica `StandardScaler`.
   f. **Predição**: Prediz a classe de nutriente para cada pixel do raster.
   g. **Pós-processamento**: Converte raster classificado para vetor, simplifica geometrias conforme parâmetro `simplify`/`tolerance`.
   h. **Saída**: Shapefile zipado com polígonos classificados.

## Classification (Heatmap) — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação, Estufas | Gera mapas de nutrientes do solo (C, N, P, pH) para aplicação localizada de fertilizantes | Reduz custos de insumos e aumenta produtividade com agricultura de precisão |
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | Mapeia fertilidade do solo para planejamento de cultivos energéticos | Subsidia seleção de áreas com maior potencial para bioenergia |
| Mercado de Carbono | Agricultura de baixo carbono | Estoque de carbono orgânico no solo (C) para linha de base de projetos de carbono | Gera evidência para créditos de carbono via manejo conservacionista |
| Geração Solar Fotovoltaica | GD, GC | Classifica aptidão do solo para instalação de usinas solares de solo | Apoia decisão de locação com base em atributos do terreno |
| Geração Hidrelétrica | PCH, CGH | Mapeia nutrientes em áreas de reservatório para avaliação de qualidade da água | Subsidia licenciamento ambiental de pequenas centrais hidrelétricas |
