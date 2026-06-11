# PRD — Workflows de Agricultura (farm_ai/agriculture)

## 1. Canopy Cover (`canopy_cover.yaml`)

### JTBDs (Jobs To Be Done)

- Estimar a cobertura do dossel vegetativo (canopy cover) pixel a pixel para uma região agrícola e intervalo de datas.
- Fornecer séries temporais de NDVI e de cobertura de dossel para subsidiar decisões de manejo.

### Casos de Uso

- Agricultor quer monitorar o desenvolvimento da cultura ao longo da safra.
- Consultor agrícola avalia a homogeneidade do dossel para recomendar ajustes de irrigação ou fertilização.

### Faz / Não Faz

- **Faz**: baixa imagens Sentinel-2 via Planetary Computer; computa NDVI; aplica regressor linear com features polinomiais (3º grau) treinado previamente com dados de drone; gera estatísticas agregadas temporais.
- **Não Faz**: não treina o modelo de regressão em tempo real; não classifica tipos de cultura; não detecta pragas.

### Users Inputs

- `pc_key`: chave opcional da API Planetary Computer.
- `user_input`: geometria (polígono) e intervalo de datas.
- `input_geometry`: geometria para agregação temporal.

### System Outputs

- `ndvi`: raster NDVI.
- `estimated_canopy_cover`: raster de cobertura de dossel estimada.
- `ndvi_timeseries`: série temporal com estatísticas agregadas de NDVI.
- `canopy_timeseries`: série temporal com estatísticas agregadas de cobertura de dossel.

### Outcomes Esperados

- Produtor recebe mapas de cobertura de dossel para tomar decisões de manejo baseadas em dados objetivos.

### APIs

- **Planetary Computer API** (via `pc_key`) para download de imagens Sentinel-2.

### CRUD

- **POST**: submissão do workflow com parâmetros e geometria.
- **GET**: consulta de status da execução e resultados (sinks).

### Bancos de Dados

- Não há bancos de dados persistentes definidos no YAML. Os dados transitam via sinks do FarmVibes.

### Datasets e JSON

- Dados de entrada: GeoJSON com geometria de interesse.
- Dados de saída: rasters GeoTIFF e séries temporais em formato compatível com FarmVibes.

### Tabelas

- Séries temporais agregadas com estatísticas (média, desvio padrão, máximo, mínimo).

### Lógicas e Cálculos

- Cálculo de NDVI a partir das bandas do Sentinel-2.
- Aplicação de regressor linear com polynomial features (até 3º grau) sobre NDVI para estimar canopy cover.
- Coeficientes e intercepto obtidos previamente de ortofotos de drone.

---

## 2. Change Detection (`change_detection.yaml`)

### JTBDs

- Identificar mudanças e outliers no NDVI ao longo do tempo para uma região agrícola.
- Detectar anomalias temporais na vegetação.

### Casos de Uso

- Pesquisador quer identificar áreas que sofreram estresse hídrico ou danos.
- Seguradora avalia perdas de safra comparando NDVI histórico.

### Faz / Não Faz

- **Faz**: gera imagens SpaceEye (livre de nuvens); computa NDVI; agrega estatísticas temporais; detecta outliers com GMM (Gaussian Mixture Model) de um componente.
- **Não Faz**: não classifica o tipo de mudança (natural vs. antrópica); não faz previsão futura.

### Users Inputs

- `pc_key`: chave opcional da Planetary Computer.
- `user_input`: geometria e intervalo de datas.
- `input_geometry`: geometria para agregação temporal.

### System Outputs

- `spaceeye_raster`: rasters SpaceEye sem nuvens.
- `index`: rasters NDVI.
- `timeseries`: estatísticas agregadas de NDVI.
- `segmentation`: mapas de segmentação baseados em likelihood do GMM.
- `heatmap`: mapas de probabilidade.
- `outliers`: mapas de outliers.
- `mixture_means`: médias do GMM.

### Outcomes Esperados

- Identificação precoce de anomalias vegetativas para intervenção rápida.

### APIs

- **Planetary Computer API** para obtenção de imagens de radar e ópticas.

### CRUD

- **POST**: submissão do workflow.
- **GET**: resultados de segmentação e heatmaps.

### Bancos de Dados

- N/A no YAML; dados transitórios em memória no cluster.

### Datasets e JSON

- Input: GeoJSON com geometria e datas.
- Output: rasters GeoTIFF (segmentação, heatmap, outliers).

### Tabelas

- Estatísticas temporais de NDVI (média, std, max, min).

### Lógicas e Cálculos

- Geração de SpaceEye (fusão SAR-óptico para remoção de nuvens).
- Cálculo de NDVI.
- Gaussian Mixture Model (1 componente) para detecção de outliers.

---

## 3. Emergence Summary (`emergence_summary.yaml`)

### JTBDs

- Calcular estatísticas de emergência de culturas usando MSAVI threshold para uma região e período.

### Casos de Uso

- Agrônomo avalia taxa de emergência de plantio direto.
- Produtor verifica falhas no estande inicial.

### Faz / Não Faz

- **Faz**: baixa Sentinel-2; aplica máscara de nuvens; computa MSAVI; aplica threshold (0.2); agrega estatísticas temporais.
- **Não Faz**: não detecta espécies; não calcula densidade populacional exata.

### Users Inputs

- `pc_key`: chave opcional.
- `user_input`: geometria e intervalo de datas.
- `input_geometry`: geometria para agregação.

### System Outputs

- `timeseries`: série temporal com média, std, max e min do MSAVI threshold.

### Outcomes Esperados

- Produtor obtém dados quantitativos da emergência para validar práticas de semeadura.

### APIs

- **Planetary Computer API**.

### CRUD

- **POST**: submissão.
- **GET**: série temporal de emergência.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: GeoJSON.
- Output: séries temporais agregadas.

### Tabelas

- Estatísticas temporais de MSAVI threshold.

### Lógicas e Cálculos

- Cálculo de MSAVI = (2 * NIR + 1 - sqrt((2 * NIR + 1)^2 - 8 * (NIR - Red))) / 2.
- Threshold fixo em 0.2 para classificar pixels como "emergidos".
- Máscara de nuvens combinada (modelo ML + máscara do Planetary Computer).

---

## 4. Green House Gas Fluxes (`green_house_gas_fluxes.yaml`)

### JTBDs
- Computar fluxos de gases de efeito estufa (GEE) seguindo as diretrizes do GHG Protocol para o Brasil (baseado em IPCC).

### Casos de Uso
- Fazenda precisa reportar emissões de GEE para certificação de carbono.
- Consultor ambiental calcula sequestro versus emissão para diferentes culturas.

### Faz / Não Faz
- **Faz**: calcula fluxos de GEE para culturas suportadas (trigo, milho, algodão, soja).
- **Não Faz**: não aceita culturas não listadas; não faz inventário completo do ciclo de vida.

### Users Inputs
- `crop_type`: tipo de cultura ("corn", "wheat", "cotton", "soybeans").
- `user_input`: dados de entrada para computação GHG (práticas agrícolas, área, período).

### System Outputs
- `fluxes`: fluxos de GEE calculados (emissão vs. sequestro).

### Outcomes Esperados
- Relatório de emissões para compliance ambiental e geração de créditos de carbono.

### APIs
- N/A (cálculo local via operador `compute_ghg_fluxes`).

### CRUD
- **POST**: submissão com crop_type e dados agrícolas.
- **GET**: resultados de fluxos.

### Bancos de Dados
- N/A.

### Datasets e JSON
- Input: metadados da cultura e práticas de manejo.
- Output: fluxos computados.

### Tabelas
- Tabela de fatores de emissão por cultura (embutida no operador).

### Lógicas e Cálculos
- Segue GHG Protocol Brasil (baseado em IPCC).
- Calcula balanço entre sequestro e emissão com base nas práticas agrícolas reportadas.

---

## 5. Heatmap Using Classification (`heatmap_using_classification.yaml`)

### JTBDs
- Gerar heatmaps de nutrientes a partir de amostras de solo fornecidas pelo usuário, utilizando classificação supervisionada.

### Casos de Uso
- Agricultor coleta amostras de solo e quer visualizar a variabilidade espacial de nutrientes.
- Consultor delineia zonas de manejo específico baseado em mapas de nutrientes.

### Faz / Não Faz
- **Faz**: ingere amostras georreferenciadas do usuário; aplica algoritmo de classificação (Random Forest); gera heatmap com bins.
- **Não Faz**: não coleta amostras automaticamente; não determina quais nutrientes analisar.

### Users Inputs
- `input_samples`: referências externas para amostras de solo (GeoJSON).
- `input_raster`: raster de entrada para cálculo de índices.
- `attribute_name`, `buffer`, `index`, `bins`, `simplify`, `tolerance`, `data_scale`, `max_depth`, `n_estimators`, `random_state`.

### System Outputs
- `result`: arquivo ZIP com geometrias dos clusters (shapefile).

### Outcomes Esperados
- Mapas de fertilidade do solo para aplicação localizada de insumos.

### APIs
- N/A (dados do usuário via data_ingestion).

### CRUD
- **POST**: submissão com amostras e parâmetros.
- **GET**: download do ZIP com shapefiles.

### Bancos de Dados
- N/A.

### Datasets e JSON
- Input: GeoJSON com amostras (geometria + atributos de nutrientes).
- Output: shapefiles em ZIP.

### Tabelas
- Atributos dos nutrientes das amostras.

### Lógicas e Cálculos
- Classificação via Random Forest.
- Definição de bins para discretização do heatmap.
- Simplificação geométrica opcional.

---

## 6. Heatmap Using Classification ADMAG (`heatmap_using_classification_admag.yaml`)

### JTBDs
- Integrar com ADMAG (Azure Data Manager for Agriculture) para baixar prescrições e gerar heatmaps de nutrientes via classificação.

### Casos de Uso
- Usuário do ADMAG quer gerar mapas de nutrientes automaticamente a partir de dados de prescrição armazenados na nuvem.

### Faz / Não Faz
- **Faz**: autentica no ADMAG via OAuth2; baixa prescrições; gera heatmap com Random Forest.
- **Não Faz**: não funciona sem credenciais ADMAG; não edita prescrições no ADMAG.

### Users Inputs
- `admag_input`: credenciais e parâmetros de conexão ADMAG (base_url, client_id, client_secret, authority, default_scope).
- `input_raster`: raster para índice.
- `attribute_name`, `buffer`, `index`, `bins`, `simplify`, `tolerance`, `data_scale`, `max_depth`, `n_estimators`, `random_state`.

### System Outputs
- `result`: ZIP com shapefiles dos clusters/heatmap.

### Outcomes Esperados
- Integração direta com ADMAG elimina necessidade de upload manual de amostras.

### APIs
- **ADMAG API** (Azure Data Manager for Agriculture).
- **Microsoft Identity Platform** (OAuth2).

### CRUD
- **POST**: submissão com credenciais e parâmetros.
- **GET**: download do resultado.
- (via ADMAG) **GET**: listagem de prescrições.

### Bancos de Dados
- ADMAG armazena prescrições e dados agrícolas.

### Datasets e JSON
- Input: prescrições do ADMAG (JSON).
- Output: shapefiles em ZIP.

### Tabelas
- Atributos de nutrientes extraídos das prescrições.

### Lógicas e Cálculos
- Autenticação OAuth2 no ADMAG.
- Download de prescrições.
- Random Forest para classificação e geração de heatmap.

---

## 7. Heatmap Using Neighboring Data Points (`heatmap_using_neighboring_data_points.yaml`)

### JTBDs
- Criar heatmaps de nutrientes usando interpolação espacial por vizinhança (cluster overlap, nearest neighbor, kriging neighbor).

### Casos de Uso
- Agricultor com amostras de solo esparsas quer interpolar valores de nutrientes (C, N, P) para toda a área.
- Pesquisador valida diferentes algoritmos de interpolação.

### Faz / Não Faz
- **Faz**: ingere amostras e clusters (boundaries); aplica algoritmo de interpolação espacial; utiliza raster Sentinel-2 como base.
- **Não Faz**: não determina localizações ótimas de amostragem (usa workflow `optimal_locations` para isso).

### Users Inputs
- `input_raster`: raster Sentinel-2.
- `input_samples`: amostras de sensores com nutrientes (GeoJSON).
- `input_sample_clusters`: boundaries dos clusters de amostras.
- `attribute_name`, `simplify`, `tolerance`, `algorithm`, `resolution`, `bins`.

### System Outputs

- `result`: ZIP com shapefiles do heatmap.

### Outcomes Esperados

- Mapa de nutrientes interpolado para aplicação de insumos em taxas variáveis.

### APIs

- N/A (dados do usuário via ingestão).

### CRUD

- **POST**: submissão.
- **GET**: download ZIP.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: GeoJSON de amostras e clusters.
- Output: shapefiles.

### Tabelas

- Atributos de nutrientes (Carbono, Nitrogênio, Fósforo, pH, etc.).

### Lógicas e Cálculos

- Algoritmos de interpolação: `cluster overlap`, `nearest neighbor`, `kriging neighbor`.
- Definição de resolução baseada no raster de entrada.
- Binning para discretização.

---

## 8. Methane Index (`methane_index.yaml`)

### JTBDs

- Computar índice de metano para identificação de superemissores em uma região e período.

### Casos de Uso

- Agência ambiental monitora emissões de metano em áreas agrícolas.
- Pesquisador identifica fontes pontuais de metano.

### Faz / Não Faz

- **Faz**: baixa Sentinel-2; normaliza bandas; aplica filtro Gaussiano anti-aliasing; usa KNN não supervisionado para identificar banda similar à banda 12; computa índice como diferença entre banda 12 e mediana das K bandas similares.
- **Não Faz**: não quantifica a massa de metano emitida; não identifica a fonte da emissão.

### Users Inputs

- `pc_key`: chave opcional.
- `user_input`: geometria e intervalo de datas.

### System Outputs

- `index`: raster do índice de metano.
- `s2_raster`: raster Sentinel-2.
- `cloud_mask`: máscara de nuvens.

### Outcomes Esperados

- Identificação de plumas de metano para mitigação de emissões.

### APIs

- **Planetary Computer API**.

### CRUD

- **POST**: submissão.
- **GET**: rasters de índice.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: GeoJSON.
- Output: rasters GeoTIFF.

### Tabelas
- N/A.

### Lógicas e Cálculos

- Normalização de bandas.
- Filtro Gaussiano anti-aliasing.
- KNN não supervisionado para seleção de bandas similares à banda 12.
- Índice = banda12 - mediana_pixel_das_K_bandas_similares.

---

## 9. NDVI Summary (`ndvi_summary.yaml`)

### JTBDs

- Calcular estatísticas de NDVI (média, desvio padrão, máximo, mínimo) para uma região agrícola ao longo do tempo.

### Casos de Uso

- Produtor monitora saúde da cultura durante a safra.
- Agrônomo compara NDVI entre talhões.

### Faz / Não Faz

- **Faz**: baixa Sentinel-2; aplica máscara de nuvens; computa NDVI; agrega estatísticas temporais filtrando tiles muito nublados.
- **Não Faz**: não estima produtividade; não faz classificação de cultura.

### Users Inputs

- `pc_key`: chave opcional.
- `user_input`: geometria e intervalo de datas.

### System Outputs

- `timeseries`: série temporal com estatísticas de NDVI.

### Outcomes Esperados

- Série temporal de NDVI para análise fenológica da cultura.

### APIs

- **Planetary Computer API**.

### CRUD

- **POST**: submissão.
- **GET**: série temporal.

### Bancos de Dados
- N/A.

### Datasets e JSON
- Input: GeoJSON.
- Output: séries temporais.

### Tabelas
- Estatísticas de NDVI (média, std, max, min).

### Lógicas e Cálculos
- NDVI = (NIR - Red) / (NIR + Red).
- Máscara de nuvens combinada (modelo ML + Planetary Computer).
- Filtro de tiles com alta cobertura de nuvens.

---

## 10. Weed Detection (`weed_detection.yaml`)

### JTBDs
- Detectar e mapear ervas daninhas (ou regiões com coloração similar) em imagens de satélite/drone utilizando GMM.

### Casos de Uso
- Agricultor quer localizar focos de plantas daninhas para aplicação localizada de herbicidas.
- Consultor mapea áreas de infestação.

### Faz / Não Faz
- **Faz**: ingere raster remoto; treina GMM sobre subconjunto dos dados; clusteriza todos os pixels; converte clusters para polígonos; simplifica geometrias; gera shapefiles por cluster.
- **Não Faz**: não identifica espécies específicas de ervas; não recomenda herbicidas.

### Users Inputs
- `user_input`: referência externa ao raster.
- `buffer`, `no_data`, `clusters`, `sieve_size`, `simplify`, `tolerance`, `samples`, `bands`, `alpha_index`.

### System Outputs
- `result`: ZIP com shapefiles por cluster.

### Outcomes Esperados
- Mapa de infestação para aplicação diferenciada de defensivos.

### APIs
- N/A (ingestão de raster do usuário).

### CRUD
- **POST**: submissão.
- **GET**: download ZIP.

### Bancos de Dados
- N/A.

### Datasets e JSON
- Input: raster remoto (GeoTIFF).
- Output: shapefiles em ZIP.

### Tabelas
- N/A.

### Lógicas e Cálculos
- Treinamento de Gaussian Mixture Model (GMM) sobre amostras do raster.
- Clusterização de todos os pixels.
- Conversão de pixels em polígonos (conectividade).
- Sieve (remoção de polígonos menores que área mínima).
- Simplificação de bordas (Douglas-Peucker ou convex hull).
- Separação por cluster em shapefiles individuais.

---

## Perfis Energéticos

### Canopy Cover — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar | GC, GD | Fornece séries temporais de NDVI e cobertura de dossel para análise de sombreamento e interferência vegetativa | Subsidia estudos de viabilidade de usinas solares |
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | Estima cobertura do dossel e NDVI para monitoramento de culturas energéticas | Permite estimativa de produtividade de biomassa |
| Eficiência Energética | Irrigação | Monitora desenvolvimento da cultura para otimização de manejo hídrico e fertilização | Reduz consumo energético em irrigação |
| Mercado de Carbono | Agricultura de baixo carbono | Fornece séries temporais de cobertura vegetal para estabelecimento de linhas de base | Subsidia cálculos de sequestro de carbono |
| Distribuição de Energia | Concessionárias | Mapeia cobertura vegetal para avaliação de risco em faixas de servidão | Apoia planejamento de podas preventivas |

### Change Detection — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Mercado de Carbono | REDD+, Agricultura de baixo carbono | Detecta mudanças e anomalias no NDVI para identificação de desmatamento ou degradação | Gera evidências para metodologias de créditos de carbono |
| Geração Solar | GD, GC | Identifica anomalias vegetativas que podem indicar interferência sobre painéis solares | Subsidia manutenção de áreas de usinas solares |
| Óleo e Gás | Exploração, Transporte | Monitora mudanças ambientais em áreas de exploração e faixas de dutos | Detecta impactos ambientais não-conformes |
| Distribuição de Energia | Concessionárias | Identifica anomalias temporais em faixas de servidão e áreas de risco vegetativo | Subsidia programas de poda e manutenção de redes |
| Eficiência Energética | Estufas | Detecta alterações no NDVI em estufas para alerta precoce de estresse vegetativo | Permite intervenção reduzindo perdas de produção |

### Emergence Summary — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Biomassa / Bioenergia | Cana-de-açúcar | Avalia taxa de emergência de culturas para planejamento de colheita e produtividade | Otimiza cronograma de colheita de biomassa |
| Eficiência Energética | Irrigação | Monitora emergência de culturas para ajuste fino de irrigação e insumos | Reduz desperdício de água e energia elétrica |
| Mercado de Carbono | Agricultura de baixo carbono | Valida práticas de plantio direto e emergência uniforme | Subsidia metodologias de carbono no solo |
| Geração Solar | GC | Mapeia estágio inicial de culturas para previsão de sombreamento futuro | Apoia planejamento de usinas solares em áreas agrícolas |
| Comercialização de Energia | Comercializadores | Gera dados de emergência de safra para previsão de oferta de bioenergia | Alimenta modelos de projeção de geração |

### Green House Gas Fluxes — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Mercado de Carbono | Agricultura de baixo carbono | Calcula balanço de GEE entre emissão e sequestro por cultura e práticas agrícolas | Gera relatórios auditáveis para certificação de créditos de carbono |
| Biomassa / Bioenergia | Cana-de-açúcar, Resíduos agrícolas, Biogás | Computa emissões associadas a diferentes práticas em culturas energéticas | Subsidia análise de ciclo de vida de bioenergia |
| Eficiência Energética | Armazenamento | Avalia pegada de carbono de diferentes práticas agrícolas | Apoia estratégias de produção de baixo carbono |
| Geração Hidrelétrica | PCH, CGH | Monitora emissões de GEE em áreas de contribuição de reservatórios | Apoia licenciamento ambiental de PCHs |
| Comercialização de Energia | Autoprodutores, Consumidores Livres | Fornece dados de pegada de carbono da produção agrícola | Subsidia comercialização de energia com atributos ambientais |

### Heatmap Using Classification — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação | Mapeia variabilidade espacial de nutrientes para aplicação localizada de insumos | Reduz consumo de fertilizantes e energia associada |
| Biomassa / Bioenergia | Cana-de-açúcar | Gera zonas de manejo a partir de amostras de solo para culturas energéticas | Otimiza insumos e aumenta produtividade energética |
| Geração Solar | GD, GC | Classifica uso do solo a partir de amostras para seleção de áreas | Subsidia due diligence ambiental e fundiária |
| Distribuição de Energia | Concessionárias | Mapeia atributos do solo para planejamento de torres e postes | Apoia projetos de linhas de distribuição rural |
| Mercado de Carbono | Agricultura de baixo carbono | Delineia zonas de manejo para adoção de práticas de baixo carbono | Subsidia metodologias de carbono no solo |

### Heatmap Using Classification ADMAG — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação | Integra prescrições do ADMAG para geração automatizada de mapas de nutrientes | Automatiza agricultura de precisão conectada à nuvem |
| Biomassa / Bioenergia | Cana-de-açúcar | Conecta dados de manejo do ADMAG a mapas de fertilidade para culturas energéticas | Integra planejamento de biomassa com Azure |
| Geração Solar | GD, GC | Classificação de solo integrada com prescrições agrícolas do ADMAG | Subsidia seleção de áreas para GD solar |
| Distribuição de Energia | Concessionárias | Acessa prescrições agrícolas para planejamento de faixas de servidão | Integra dados de distribuição com plataforma ADMAG |
| Comercialização de Energia | Autoprodutores | Dados de manejo integrados para rastreabilidade da produção | Subsidia certificação de energia renovável |

### Heatmap Using Neighboring Data Points — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação | Interpola dados esparsos de solo para mapas contínuos de fertilidade | Otimiza aplicação localizada de insumos e reduz consumo energético |
| Biomassa / Bioenergia | Cana-de-açúcar | Interpola amostras de C, N, P para zonas de manejo de precisão | Aumenta acurácia na estimativa de produtividade de biomassa |
| Geração Solar | GC | Cria mapas contínuos de atributos do solo para avaliação fundiária | Subsidia planejamento de grandes usinas solares |
| Distribuição de Energia | Concessionárias | Interpola dados de campo para mapeamento contínuo de áreas de risco | Apoia planejamento de redes de distribuição |
| Mercado de Carbono | Agricultura de baixo carbono | Gera mapas interpolados de carbono orgânico do solo | Subsidia metodologias de MRV de carbono no solo |

### Methane Index — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Mercado de Carbono | REDD+, Agricultura de baixo carbono | Identifica plumas de metano para quantificação de emissões fugitivas | Subsidia inventários de GEE e projetos de carbono |
| Óleo e Gás | Exploração, Transporte | Detecta vazamentos de metano em áreas de exploração e faixas de dutos | Permite resposta rápida a fugas de gás natural |
| Biomassa / Bioenergia | Biogás | Identifica emissões de metano de atividades agropecuárias e aterros | Mapeia potencial de captura e aproveitamento de biogás |
| Geração Hidrelétrica | UHE | Monitora emissões de metano de reservatórios hidrelétricos | Apoia licenciamento ambiental e relatórios de sustentabilidade |
| Distribuição de Energia | Concessionárias | Detecta vazamentos em redes de distribuição de gás | Subsidia programas de manutenção e redução de perdas |

### NDVI Summary — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | Fornece séries temporais de NDVI para monitoramento fenológico de culturas energéticas | Subsidia estimativas de produtividade e programação de colheita |
| Geração Solar | GD, GC | Monitora ciclo vegetativo sazonal para previsão de sombreamento em painéis | Apoia operação e manutenção de usinas solares |
| Eficiência Energética | Irrigação | Avalia saúde da cultura ao longo da safra para manejo hídrico otimizado | Reduz consumo de água e energia em irrigação |
| Mercado de Carbono | Agricultura de baixo carbono | Histórico de NDVI como proxy de produtividade para linha de base | Subsidia metodologias de carbono agrícola |
| Distribuição de Energia | Concessionárias | Monitora crescimento vegetativo em faixas de servidão | Planeja podas preventivas em redes elétricas |

### Weed Detection — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação | Mapeia plantas daninhas para aplicação localizada de herbicidas | Reduz consumo de defensivos, água e energia |
| Biomassa / Bioenergia | Cana-de-açúcar | Detecta infestação de ervas em culturas energéticas | Aumenta eficiência e produtividade de biomassa |
| Geração Solar | GD, GC | Mapeia vegetação invasora em áreas de usinas solares | Subsidia plano de manejo vegetativo periódico |
| Distribuição de Energia | Concessionárias | Detecta vegetação em faixas de servidão para programação de manutenção | Subsidia podas seletivas em redes elétricas |
| Mercado de Carbono | Agricultura de baixo carbono | Identifica áreas com competição vegetal para manejo integrado | Apoia práticas agrícolas sustentáveis de baixo carbono |
