# PRD — Workflows `automatic_segmentation` e `prompt_segmentation`

## JTBDs (Jobs To Be Done)
- Segmentar objetos em imagens de sensoriamento remoto usando o modelo Segment Anything (SAM) da Meta.
- Suportar dois modos de operação: segmentação automática (grid de pontos) e segmentação guiada por prompts (pontos e/ou bounding boxes).

## Casos de Uso
1. **Segmentação automática**: Um analista segmenta automaticamente todos os objetos visíveis em uma imagem aérea (edificações, vegetação, corpos d'água) sem intervenção manual.
2. **Segmentação guiada**: Um especialista fornece pontos positivos/negativos ou bounding boxes para segmentar apenas objetos específicos de interesse.

## Faz / Não Faz

### automatic_segmentation
- **Faz**: Recorta o raster para a geometria de interesse.
- **Faz**: Divide o raster em chips de 1024×1024 pixels com overlap configurável.
- **Faz**: Define um grid regular de pontos como prompts para o SAM.
- **Faz**: Executa o encoder de imagem e decoder de máscara do SAM.
- **Faz**: Aplica supressão não-máxima (NMS) em múltiplos níveis (chip-level e mask-level).
- **Faz**: Combina máscaras em uma única saída.
- **Não Faz**: Não permite prompts manuais.
- **Não Faz**: Não treina o modelo — espera modelo ONNX exportado.

### prompt_segmentation
- **Faz**: Ingere geometrias de prompt (pontos, bounding boxes) via `ingest_geometry`.
- **Faz**: Recorta o raster para a geometria.
- **Faz**: Processa apenas chips que intersectam os prompts.
- **Faz**: Executa encoder de imagem + prompt encoder + mask decoder.
- **Não Faz**: Gera apenas as máscaras para os prompts fornecidos (não segmenta áreas sem prompt).

## Users Inputs

### automatic_segmentation
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `input_raster` | Raster | — | Raster de entrada |
| `input_geometry` | Geometry | — | Geometria de interesse |
| `model_type` | string | vit_b | Tipo do modelo SAM (vit_b, vit_l, vit_h) |
| `band_names` | list | null | Nomes das bandas no raster |
| `band_scaling` | list | null | Escalonamento por banda |
| `band_offset` | list | null | Offset por banda |
| `spatial_overlap` | float | 0.5 | Overlap entre chips (fração) |
| `points_per_side` | int | 16 | Pontos do grid por lado do chip |
| `n_crop_layers` | int | 0 | Camadas de recorte adicionais |
| `crop_overlap_ratio` | float | 0.0 | Overlap entre recortes |
| `crop_n_points_downscale_factor` | int | 1 | Fator de downscale para pontos em recortes |
| `pred_iou_thresh` | float | 0.88 | Threshold de IoU previsto |
| `stability_score_thresh` | float | 0.95 | Threshold de estabilidade |
| `stability_score_offset` | float | 1.0 | Offset do score de estabilidade |
| `points_per_batch` | int | 16 | Pontos por batch de inferência |
| `num_workers` | int | 0 | Workers para dataloader |
| `in_memory` | bool | True | Manter dados em memória |
| `chip_nms_thr` | float | 0.7 | Threshold NMS entre chips |
| `mask_nms_thr` | float | 0.5 | Threshold NMS entre máscaras |

### prompt_segmentation
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `input_raster` | Raster | — | Raster de entrada |
| `input_geometry` | Geometry | — | Geometria de interesse |
| `input_prompts` | ExternalReferences | — | Pontos/bbox como GeoJSON |
| `model_type` | string | vit_b | Tipo do modelo SAM |
| `band_names` | list | null | Nomes das bandas |
| `band_scaling` | list | null | Escalonamento por banda |
| `band_offset` | list | null | Offset por banda |
| `spatial_overlap` | float | 0.5 | Overlap entre chips |

## System Outputs

### automatic_segmentation
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `segmentation_mask` | Raster | Máscaras de segmentação combinadas |

### prompt_segmentation
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `segmentation_mask` | Raster | Máscaras de segmentação para os prompts |

## Outcomes Esperados
- Para `automatic_segmentation`: Máscara única com todos os objetos segmentados, tratando duplicatas via NMS em dois níveis.
- Para `prompt_segmentation`: Máscaras apenas para os objetos indicados pelos prompts.
- Modelo deve ser exportado previamente via `scripts/export_prompt_segmentation_models.py`.

## APIs
- **Ops internas**: `clip` (sub-workflow), `automatic_segmentation`, `combine_sam_masks` (auto), `prompt_segmentation` (prompt)
- **Workflows filhos**: `data_processing/clip/clip`, `data_ingestion/user_data/ingest_geometry`
- **Pré-requisito**: Modelo SAM exportado para ONNX e registrado no cluster.

## CRUD
- **Create**: Submeter `automatic_segmentation` ou `prompt_segmentation`.
- **Read**: Sink `segmentation_mask`.

## Bancos de Dados
Nenhum.

## Datasets e JSON Files
- **Modelo SAM**: Baixado do repositório oficial Meta SAM e exportado para ONNX via script.
- **Prompts (prompt_segmentation)**: GeoJSON com a seguinte estrutura:
  ```json
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [x, y]},
        "properties": {
          "label": 1,
          "prompt_id": "obj1"
        }
      }
    ]
  }
  ```
  - `label`: 1=foreground, 0=background
  - `prompt_id`: identifica a qual objeto o prompt pertence
  - Bounding boxes suportadas como `Polygon` ou `MultiPoint`.

## Tabelas
Nenhuma.

## Lógicas e Cálculos

### automatic_segmentation
1. `clip` (sub-workflow) — Recorta o raster para `input_geometry`.
2. `sam_inference` (`automatic_segmentation`):
   - Divide o raster em chips de 1024×1024 com overlap `spatial_overlap`.
   - Para cada chip:
     - Aplica o Image Encoder do SAM (ViT).
     - Gera grid de `points_per_side × points_per_side` pontos.
     - Para cada ponto, o Mask Decoder gera uma máscara candidata.
     - Filtra máscaras com `pred_iou_thresh` e `stability_score_thresh`.
   - Processa em batches de `points_per_batch`.
3. `combine_masks` (`combine_sam_masks`):
   - Aplica NMS entre máscaras de chips diferentes (`chip_nms_thr`).
   - Aplica NMS entre máscaras finais (`mask_nms_thr`).
   - Gera máscara única combinada.

### prompt_segmentation
1. `ingest_points` — Ingere prompts GeoJSON via `ingest_geometry`.
2. `clip` — Recorta raster para `input_geometry`.
3. `sam_inference` (`prompt_segmentation`):
   - Divide raster em chips 1024×1024 com overlap `spatial_overlap`.
   - Processa apenas chips que intersectam os prompts.
   - Para cada chip:
     - Image Encoder → embeddings.
     - Prompt Encoder → codifica pontos/bbox.
     - Mask Decoder → gera máscara para cada prompt.
   - Agrupa máscaras por `prompt_id`.

---

## Perfis Energéticos

### Automatic Segmentation — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | Segmenta automaticamente todas as feições visíveis (telhados, terrenos, vegetação) para mapeamento de potencial solar | Subsidia prospecção automatizada de áreas para usinas |
| Distribuição de Energia | Concessionárias | Segmenta edificações, vegetação e corpos d'água para planejamento de traçado de redes | Automatiza mapeamento de ativos e obstáculos |
| Eficiência Energética | Estufas, Irrigação | Identifica automaticamente estufas, pivôs de irrigação e estruturas agrícolas | Mapeia infraestrutura para programas de eficiência |
| Mercado de Carbono | REDD+, Reflorestamento | Segmenta cobertura florestal e mudanças de uso do solo sem intervenção manual | Automatiza monitoramento de projetos de carbono |
| Óleo e Gás | Exploração | Segmenta infraestrutura e áreas de vegetação em regiões de exploração | Apoia monitoramento ambiental automatizado |

### Prompt Segmentation — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD | Segmenta telhados específicos fornecendo exemplos pontuais para prospecção de microgeração | Subsidia prospecção comercial de GD solar |
| Distribuição de Energia | Concessionárias | Delimita feições específicas (postes, transformadores) com prompts para cadastro de ativos | Apoia cadastro técnico com supervisão humana |
| Eficiência Energética | Armazenamento | Segmenta silos e armazéns indicados por pontos para auditoria energética | Apoia programas de eficiência em pós-colheita |
| Óleo e Gás | Transporte | Segmenta dutos e estações a partir de prompts para cadastro georreferenciado | Subsidia geoprocessamento de ativos de transporte |
| Geração Hidrelétrica | CGH | Delimita estruturas de pequenas centrais hidrelétricas fornecendo exemplos pontuais | Apoia cadastro e manutenção de CGHs |
