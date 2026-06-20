# PRD — Workflows de Segmentação (farm_ai/segmentation)

---

## 1. Auto Segment Basemap (`auto_segment_basemap.yaml`)

### JTBDs

- Segmentar automaticamente imagens de basemap (Bing Maps) utilizando o modelo Segment Anything Model (SAM) sem prompts manuais, gerando máscaras de segmentação.

### Casos de Uso

- Agrônomo quer segmentar campos agrícolas automaticamente para delimitar talhões.
- Pesquisador usa segmentação como etapa inicial para classificação de cobertura do solo.

### Faz / Não Faz

- **Faz**: baixa tiles do Bing Maps via API; mescla tiles em raster único; divide em chips de 1024x1024; aplica SAM automático com grid de pontos; combina máscaras via NMS (non-maximal suppression).
- **Não Faz**: não aceita prompts do usuário (segmentação automática); não classifica os segmentos; não funciona sem modelo SAM exportado para ONNX.

### Users Inputs

- `user_input`: geometria de interesse.
- `bingmaps_api_key`: chave da API Bing Maps.
- `basemap_zoom_level`: nível de zoom (default 14).
- Parâmetros SAM: `model_type` (vit_b, vit_l, vit_h), `spatial_overlap`, `points_per_side`, `n_crop_layers`, `crop_overlap_ratio`, `crop_n_points_downscale_factor`, `pred_iou_thresh`, `stability_score_thresh`, `stability_score_offset`, `points_per_batch`, `num_workers`, `in_memory`, `chip_nms_thr`, `mask_nms_thr`.

### System Outputs

- `basemap`: raster mesclado do basemap.
- `segmentation_mask`: máscaras de segmentação.

### Outcomes Esperados

- Máscaras de segmentação de alta qualidade para delimitação de feições agrícolas.

### APIs

- **Bing Maps API**: download de tiles de basemap.

### CRUD

- **POST**: submissão do workflow.
- **GET**: máscaras de segmentação.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: GeoJSON.
- Output: rasters GeoTIFF de máscaras.

### Tabelas

- N/A.

### Lógicas e Cálculos

- Download e merge de tiles Bing Maps.
- Divisão em chips 1024x1024 com overlap (`spatial_overlap`).
- SAM image encoder sobre cada chip.
- Geração de grids de pontos como prompts.
- Geração de máscaras por ponto.
- Non-maximal suppression em nível de chip (`chip_nms_thr`) e de máscara (`mask_nms_thr`).
- Modelo exportado para ONNX (necessário executar `scripts/export_prompt_segmentation_models.py` antes).

---

## 2. Auto Segment S2 (`auto_segment_s2.yaml`)

### JTBDs

- Segmentar automaticamente imagens Sentinel-2 utilizando o modelo SAM sem prompts manuais.

### Casos de Uso

- Pesquisador segmenta áreas agrícolas em imagens de satélite de média resolução.
- Mapeamento automático de corpos d'água, florestas ou áreas cultivadas.

### Faz / Não Faz

- **Faz**: baixa Sentinel-2 via Planetary Computer; processa com SAM automático (grid de pontos); gera máscaras.
- **Não Faz**: não aceita prompts; não funciona sem modelo ONNX; usa apenas bandas RGB.

### Users Inputs

- `user_input`: geometria e datas.
- `pc_key`: chave opcional Planetary Computer.
- `model_type`, `spatial_overlap`, `points_per_side`, `n_crop_layers`, `crop_overlap_ratio`, `crop_n_points_downscale_factor`, `pred_iou_thresh`, `stability_score_thresh`, `stability_score_offset`, `points_per_batch`, `num_workers`, `in_memory`, `chip_nms_thr`, `mask_nms_thr`.

### System Outputs

- `s2_raster`: raster Sentinel-2.
- `segmentation_mask`: máscaras de segmentação.

### Outcomes Esperados

- Segmentação automática de imagens de satélite para análise de cobertura do solo.

### APIs

- **Planetary Computer API**: download Sentinel-2.

### CRUD

- **POST**: submissão.
- **GET**: máscaras.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: GeoJSON.
- Output: rasters.

### Tabelas

- N/A.

### Lógicas e Cálculos

- Mesma lógica do `auto_segment_basemap` mas com dados Sentinel-2.
- Bandas utilizadas: R, G, B.
- Modelo SAM exportado para ONNX.

---

## 3. Segment Basemap (`segment_basemap.yaml`)

### JTBDs

- Segmentar imagens de basemap (Bing Maps) utilizando o modelo SAM com prompts do usuário (pontos e/ou bounding boxes).

### Casos de Uso

- Usuário deseja segmentar feições específicas fornecendo exemplos (pontos positivo/negativo).
- Delimitação manual assistida de talhões, estradas ou construções.

### Faz / Não Faz

- **Faz**: baixa Bing Maps; processa SAM com prompts; segmenta apenas chips que intersectam prompts.
- **Não Faz**: não faz segmentação automática sem prompts; não classifica segmentos.

### Users Inputs

- `user_input`: geometria.
- `prompts`: referências externas para prompts (GeoJSON com coordenadas, label foreground/background, prompt id).
- `bingmaps_api_key`, `basemap_zoom_level`, `model_type`, `spatial_overlap`.

### System Outputs

- `basemap`: raster mesclado.
- `segmentation_mask`: máscara de segmentação.

### Outcomes Esperados

- Segmentação guiada por prompts para feições específicas de interesse.

### APIs

- **Bing Maps API**.

### CRUD

- **POST**: submissão com prompts.
- **GET**: máscara.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: GeoJSON com geometria + prompts (GeoJSON com coordinates, label, prompt_id).
- Output: rasters.

### Tabelas

- N/A.

### Lógicas e Cálculos

- Download e merge de tiles Bing Maps.
- Divisão em chips 1024x1024.
- Filtro: apenas chips que intersectam prompts são processados.
- SAM: image encoder + prompt encoder + mask decoder.
- Modelo ONNX.

---

## 4. Segment S2 (`segment_s2.yaml`)

### JTBDs

- Segmentar imagens Sentinel-2 utilizando SAM com prompts do usuário.

### Casos de Uso

- Usuário segmenta áreas específicas em imagens de satélite fornecendo pontos de exemplo.
- Validação de campo com segmentação guiada.

### Faz / Não Faz

- **Faz**: baixa Sentinel-2; aplica SAM com prompts; retorna máscaras.
- **Não Faz**: não opera sem prompts; não classifica.

### Users Inputs

- `user_input`: geometria e datas.
- `prompts`: GeoJSON com coordenadas, label e prompt_id.
- `pc_key`, `model_type`, `spatial_overlap`.

### System Outputs

- `s2_raster`: raster Sentinel-2.
- `segmentation_mask`: máscara de segmentação.

### Outcomes Esperados

- Segmentação precisa de feições específicas em imagens de satélite.

### APIs

- **Planetary Computer API**.

### CRUD

- **POST**: submissão.
- **GET**: máscara.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: GeoJSON + prompts.
- Output: raster.

### Tabelas

- N/A.

### Lógicas e Cálculos

- Download Sentinel-2.
- Divisão em chips.
- SAM com prompt encoder + mask decoder.
- Bandas RGB.
- Modelo ONNX.

---

## Perfis Energéticos

### Auto Segment Basemap — Perfis Energéticos

| Perfil (Classe)         | Subclasse                    | Aplicação do Workflow                                                                 | Valor Gerado                                              |
| ----------------------- | ---------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Geração Solar           | GD, GC                       | Segmenta automaticamente talhões, estradas e edificações em imagens de alta resolução | Subsidia mapeamento de áreas potencial para GD e GC       |
| Distribuição de Energia | Concessionárias              | Delimita feições do terreno para planejamento de traçado de redes                     | Apoia projetos de distribuição rural                      |
| Eficiência Energética   | Estufas                      | Identifica estufas e estruturas agrícolas para auditoria energética                   | Mapeia infraestrutura para programas de eficiência        |
| Mercado de Carbono      | Agricultura de baixo carbono | Segmenta áreas de cultivo como etapa inicial para MRV automatizado                    | Gera máscaras de referência para monitoramento de carbono |
| Geração Hidrelétrica    | PCH                          | Delimita corpos d'água e cobertura do solo em áreas de contribuição                   | Subsidia mapeamento de bacias de PCHs                     |

### Auto Segment S2 — Perfis Energéticos

| Perfil (Classe)         | Subclasse       | Aplicação do Workflow                                                          | Valor Gerado                                              |
| ----------------------- | --------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Geração Solar           | GD, GC          | Segmenta imagens Sentinel-2 para mapeamento de áreas agricultáveis e vegetação | Apoia identificação de áreas para GD solar                |
| Distribuição de Energia | Concessionárias | Segmenta vegetação, água e solo para planejamento de faixas de servidão        | Subsidia projetos de redes de distribuição                |
| Eficiência Energética   | Estufas         | Identifica estufas em imagens de satélite para auditoria de consumo            | Mapeia consumidores potenciais para eficiência energética |
| Mercado de Carbono      | REDD+           | Segmenta cobertura florestal para monitoramento de desmatamento                | Gera insumos para inventários florestais e MRV            |
| Geração Hidrelétrica    | CGH             | Segmenta áreas de preservação permanente em bacias hidrográficas               | Apoia licenciamento ambiental de CGHs                     |

### Segment Basemap — Perfis Energéticos

| Perfil (Classe)         | Subclasse       | Aplicação do Workflow                                                 | Valor Gerado                                             |
| ----------------------- | --------------- | --------------------------------------------------------------------- | -------------------------------------------------------- |
| Geração Solar           | GD              | Segmenta telhados e feições específicas fornecendo exemplos pontuais  | Subsidia mapeamento de potencial de micro e minigeração  |
| Distribuição de Energia | Concessionárias | Delimita edificações e estruturas com prompts para cadastro de ativos | Apoia cadastro técnico de unidades consumidoras          |
| Eficiência Energética   | Armazenamento   | Delimita silos e armazéns indicados por prompts para auditoria        | Mapeia infraestrutura de armazenamento para eficiência   |
| Mercado de Carbono      | Reflorestamento | Segmenta áreas de reflorestamento com prompts de exemplo              | Subsidia MRV de projetos de carbono florestal            |
| Óleo e Gás              | Transporte      | Delimita dutos e estações com prompts específicos                     | Apoia cadastro de ativos de transporte de gás e petróleo |

### Segment S2 — Perfis Energéticos

| Perfil (Classe)         | Subclasse                           | Aplicação do Workflow                                                        | Valor Gerado                                          |
| ----------------------- | ----------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------- |
| Geração Solar           | GD                                  | Segmenta áreas específicas para avaliação de potencial solar em propriedades | Subsidia estudos de micro e minigeração distribuída   |
| Distribuição de Energia | Concessionárias                     | Segmenta corredores de servidão e áreas de risco em imagens S2               | Apoia planejamento de faixas de segurança             |
| Eficiência Energética   | Irrigação                           | Delimita pivôs centrais e áreas irrigadas com prompts                        | Subsidia auditoria de eficiência hídrica e energética |
| Mercado de Carbono      | REDD+, Agricultura de baixo carbono | Segmenta áreas amostrais para validação de carbono em campo                  | Gera insumos para metodologias de MRV                 |
| Geração Hidrelétrica    | PCH                                 | Segmenta áreas de contribuição e reservatórios com assistência de prompts    | Apoia monitoramento de áreas alagadas                 |
