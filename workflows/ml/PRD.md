# PRD — Workflows `crop_segmentation`, `driveway_detection` e `spectral_extension`

## 1. crop_segmentation

### JTBDs
- Segmentar áreas de cultivo agrícola em imagens de satélite usando um modelo ONNX treinado.
- Utilizar séries temporais de NDVI ao longo do ano como entrada para o modelo de segmentação.

### Casos de Uso
1. **Mapeamento de safras**: Um órgão governamental mapeia a extensão de diferentes culturas em uma região para estatísticas agrícolas.
2. **Agricultura de precisão**: Uma cooperativa identifica os limites exatos de cada talhão cultivado.

### Faz / Não Faz
- **Faz**: Gera dados SpaceEye (livre de nuvens) para a região e período.
- **Faz**: Calcula NDVI para cada data.
- **Faz**: Seleciona N bandas NDVI regularmente espaçadas ao longo do ano.
- **Faz**: Aplica modelo ONNX de segmentação com janela deslizante 256×256, overlap 25%.
- **Não Faz**: Não treina o modelo — espera um arquivo ONNX pronto.
- **Não Faz**: Não suporta outros índices além de NDVI.

### Users Inputs
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `user_input` | Geometry | — | Geometria e intervalo de tempo |
| `pc_key` | string | — | Chave de API do Planetary Computer (opcional) |
| `model_file` | string | — | Caminho para o modelo ONNX |
| `model_bands` | int | 37 | Número de bandas NDVI empilhadas |

### System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `segmentation` | Raster | Mapa de segmentação de culturas a 10m de resolução |

### Outcomes Esperados
- Raster de segmentação com labels por tipo de cultura ou cultivo/não-cultivo.
- Resolução espacial de 10m (Sentinel-2).

---

## 2. driveway_detection

### JTBDs
- Detectar automaticamente a presença de garagens/entradas de veículos em propriedades rurais ou residenciais a partir de imagens aéreas.

### Casos de Uso
1. **Cadastro imobiliário**: Identificar propriedades que possuem garagem para fins de avaliação.
2. **Planejamento urbano**: Mapear infraestrutura de acesso veicular em áreas rurais.

### Faz / Não Faz
- **Faz**: Segmenta a frente de casas usando ML.
- **Faz**: Obtém geometrias de vias do OpenStreetMap.
- **Faz**: Detecta regiões de garagem com base em NDVI, tamanho de região e detecção de veículos.
- **Não Faz**: Não identifica o proprietário da garagem.
- **Não Faz**: Não funciona sem imagens RGB+NIR.

### Users Inputs
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `input_raster` | Raster | Imagem aérea RGB+NIR da região |
| `property_boundaries` | Geometry | Limites das propriedades |
| `min_region_area` | float | Área mínima (m²) para considerar como garagem |
| `ndvi_thr` | float | Limiar NDVI para considerar área como não-vegetada |
| `car_size` | [int,int] | Tamanho esperado de um carro em pixels [h, w] |
| `num_kernels` | int | Número de kernels rotacionados para detectar carro |
| `car_thr` | float | Razão de pixels do kernel dentro da região para considerar "estacionável" |

### System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `properties` | Geometry | Limites das propriedades que contêm garagem |
| `driveways` | Geometry | Regiões dentro de cada propriedade onde a garagem foi detectada |

### Outcomes Esperados
- Lista de propriedades com garagem identificada.
- Polígonos delimitando cada garagem detectada.

### APIs
- **Dependência externa**: OpenStreetMap (via `data_ingestion/osm_road_geometries`)

---

## 3. spectral_extension

### JTBDs
- Gerar bandas Sentinel-2 de alta resolução (0.125m) combinando dados de UAV (RGB) com imagens Sentinel-2 através de um modelo de extensão espectral.

### Casos de Uso
1. **Fusão UAV-Satélite**: Um pesquisador combina a alta resolução espacial do UAV com a riqueza espectral do Sentinel-2.
2. **Geração de dados sintéticos**: Produzir bandas Sentinel-2 (NIR, RedEdge, etc.) em resolução de UAV para análise detalhada.

### Faz / Não Faz
- **Faz**: Faz download de raster UAV fornecido pelo usuário.
- **Faz**: Faz download e pré-processa Sentinel-2 correspondente.
- **Faz**: Reamostra Sentinel-2 para o grid do UAV.
- **Faz**: Aplica modelo ONNX de extensão espectral para gerar 8 bandas Sentinel-2 a 0.125m.
- **Não Faz**: Não aceita UAV com resolução diferente de 0.125m.
- **Não Faz**: O UAV deve ter exatamente 3 bandas (R, G, B) na ordem correta, valores 0–255.

### Users Inputs
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `raster` | Raster | — | Raster UAV (3 bandas RGB, 0.125m, 0–255) |
| `resampling` | string | nearest | Método de reamostragem |

### System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `s2_rasters` | Raster | Sentinel-2 original usado na extensão |
| `matched_raster` | Raster | Sentinel-2 reamostrado para o grid do UAV |
| `extended_raster` | Raster | 8 bandas Sentinel-2 geradas a 0.125m |

### Outcomes Esperados
- Raster com 8 das 12 bandas Sentinel-2 (incluindo NIR, RedEdge, SWIR) na resolução do UAV (0.125m).
- Preservação da resolução espacial do UAV com extensão espectral do Sentinel-2.

### APIs
- **Workflows filhos**: `data_ingestion/sentinel2/preprocess_s2`
- **Modelo ONNX**: Bundled em `/opt/terravibes/ops/resources/spectral_extension_model/spectral_extension.onnx`

---

## Gerais (todos os 3 workflows)

### CRUD
- **Create**: Submissão via `farmvibes-ai run <workflow_name>`.
- **Read**: Sinks conforme especificado.

### Bancos de Dados
Nenhum.

### Datasets e JSON Files
- Modelos ONNX registrados no cluster (crop_segmentation, spectral_extension).

### Tabelas
Nenhuma.

### Lógicas e Cálculos

#### crop_segmentation
1. `spaceeye` (sub-workflow `spaceeye_interpolation`) — Gera dados SpaceEye (Sentinel-2 sem nuvens).
2. `ndvi` (sub-workflow `index`) — Calcula NDVI para cada data.
3. `group` (`select_sequence_from_list`) — Seleciona `model_bands` rasters NDVI regularmente espaçados no ano.
4. `inference` (`compute_onnx_from_sequence`) — Inferência ONNX com janela 256×256, overlap 25%, 4 workers.

#### driveway_detection
1. `segment` (`segment_driveway`) — Segmenta a frente de casas na imagem.
2. `osm` (sub-workflow `osm_road_geometries`) — Obtém geometrias de vias (tipo drive_service, buffer 100m).
3. `detect` (`detect_driveway`) — Cruza segmentação, vias, limites de propriedade e imagem:
   - Filtra regiões por `ndvi_thr` (apenas áreas não-vegetadas).
   - Filtra por `min_region_area`.
   - Aplica `num_kernels` kernels rotacionados de tamanho `car_size` para detectar spots estacionáveis com razão `car_thr`.
   - Saída: propriedades com garagem + polígonos de garagem.

#### spectral_extension
1. `ingest_raster` — Baixa o raster UAV fornecido pelo usuário.
2. `s2` (sub-workflow `preprocess_s2`) — Baixa e pré-processa Sentinel-2 para mesma área.
3. `select` — Seleciona a primeira cena Sentinel-2 disponível.
4. `match` (`match_raster_to_ref`) — Reamostra Sentinel-2 para o grid do UAV.
5. `sequence` — Empilha UAV (RGB) + Sentinel-2 reamostrado em sequência.
6. `compute_onnx` — Aplica modelo ONNX (`spectral_extension.onnx`) que gera 8 bandas Sentinel-2 a 0.125m.

---

## Perfis Energéticos

### Crop Segmentation — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Biomassa / Bioenergia | Cana-de-açúcar | Segmenta culturas agrícolas a partir de séries temporais de NDVI | Subsidia projeções de oferta de biomassa para bioenergia |
| Mercado de Carbono | Agricultura de baixo carbono | Classifica áreas de cultivo vs. não-cultivo como insumo para linha de base | Gera mapas de referência para metodologias de carbono |
| Geração Solar | GD, GC | Mapeia extensão de culturas agrícolas para planejamento de usinas | Apoia estudos de impacto em áreas agrícolas |
| Eficiência Energética | Irrigação | Delimita talhões cultivados para manejo localizado de insumos | Subsidia agricultura de precisão e redução de consumo |
| Distribuição de Energia | Concessionárias | Identifica áreas cultivadas para planejamento de faixas de servidão | Apoia projetos de redes de distribuição rural |

### Driveway Detection — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Distribuição de Energia | Concessionárias, Cooperativas | Detecta garagens e acessos veiculares em propriedades para cadastro de consumidores | Apoia planejamento de conexão de rede e faturamento |
| Geração Solar | GD | Identifica propriedades com garagens para prospecção de microgeração solar | Subsidia mapeamento de potencial de GD em áreas rurais |
| Eficiência Energética | Armazenamento | Detecta infraestrutura de acesso para logística de armazenamento de grãos | Apoia planejamento de distribuição de insumos |
| Óleo e Gás | Transporte | Mapeia acessos veiculares em faixas de dutos e áreas operacionais | Subsidia cadastro de interferências em dutovias |
| Comercialização de Energia | Consumidores Livres | Identifica propriedades rurais com garagem como potenciais prossumidores | Alimenta base de prospecção de mercado livre |

### Spectral Extension — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | Gera bandas espectrais de alta resolução (0,125m) para análise detalhada de telhados e terrenos | Subsidia estudos de potencial solar com resolução de drone |
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | Estende bandas NIR e RedEdge para análise precisa de biomassa em escala de UAV | Permite monitoramento detalhado de culturas energéticas |
| Eficiência Energética | Irrigação | Gera bandas de alta resolução para avaliação de estresse hídrico e vigor vegetativo | Subsidia irrigação de precisão com dados de drone |
| Distribuição de Energia | Concessionárias | Cria imagens multiespectrais de alta resolução para inspeção de ativos e vegetação | Permite detecção precisa de vegetação em redes |
| Mercado de Carbono | REDD+, Reflorestamento | Combina resolução de drone com riqueza espectral de satélite para MRV de carbono | Gera dados de alta resolução para inventários florestais |
