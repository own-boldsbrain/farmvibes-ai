# PRD — Workflows de Água (farm_ai/water)

---

## 1. Irrigation Classification (`irrigation_classification.yaml`)

### JTBDs

- Desenvolver mapas de probabilidade de irrigação em resolução de 30m utilizando imagens Landsat 8 e dados de elevação, com modelo de regressão logística otimizado.

### Casos de Uso

- Órgão gestor de recursos hídricos mapeia áreas irrigadas para outorga e fiscalização.
- Pesquisador identifica mudanças no padrão de irrigação ao longo do tempo.
- Agência de energia avalia demanda de irrigação para planejamento energético.

### Faz / Não Faz

- **Faz**: baixa imagens Landsat 8 SR (Surface Reflectance); baixa DEM (CopernicusDEM30 ou USGS 3DEP); computa NDVI; máscara de nuvens e água; estima fração evaporativa (ETRF); computa camadas NGI e EGI; aplica regressão logística para probabilidade de irrigação.
- **Não Faz**: não identifica tipo de irrigação (pivô, gotejo, etc.); não quantifica volume de água usado; não determina eficiência de irrigação.

### Users Inputs

- `user_input`: geometria e intervalo de datas.
- `pc_key`: chave opcional Planetary Computer.
- `ndvi_threshold`: threshold para máscara de água (default 0.0).
- `ndvi_hot_threshold`: threshold máximo de NDVI para seleção de pixel "hot" (default 0.02).
- `coef_ngi`, `coef_egi`, `coef_lst`, `intercept`: coeficientes do modelo logístico (obtidos previamente com dados de ground-truth de Nebraska, EUA, 2015).
- `dem_resolution`: resolução do DEM (default 30).
- `dem_provider`: provedor de DEM (default `CopernicusDEM30`, alternativa `USGS3DEP`).

### System Outputs

- `landsat_bands`: raster das bandas Landsat.
- `ndvi`: raster NDVI.
- `cloud_water_mask`: máscara de nuvens e corpos d'água.
- `dem`: raster DEM.
- `evaporative_fraction`: raster de fração evaporativa (ETRF).
- `ngi`: raster NGI (Normalized Green Index).
- `egi`: raster EGI (Enhanced Green Index).
- `lst`: raster de temperatura da superfície terrestre.
- `irrigation_probability`: raster de probabilidade de irrigação (30m).

### Outcomes Esperados

- Mapa de probabilidade de irrigação em 30m para suporte à gestão hídrica e planejamento agrícola.

### APIs

- **Planetary Computer API**: download Landsat 8 e DEM (CopernicusDEM30/USGS 3DEP).

### CRUD

- **POST**: submissão do workflow.
- **GET**: rasters de probabilidade, NDVI, LST, NGI, EGI, etc.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: GeoJSON com geometria e período.
- Output: múltiplos rasters GeoTIFF.

### Tabelas

- N/A.

### Lógicas e Cálculos

1. **Landsat 8 SR**: download e pré-processamento.
2. **NDVI**: (NIR - Red) / (NIR + Red).
3. **Merge Geometries**: combina geometrias de entrada.
4. **Merge Geometry + Time Range**: combina geometria e intervalo de datas para buscar DEM.
5. **Cloud & Water Mask** (`compute_cloud_water_mask`):
   - Utiliza banda `qa_pixel` do Landsat.
   - Aplica threshold de NDVI para detectar água.
6. **DEM**: download CopernicusDEM30 ou USGS 3DEP.
7. **Match DEM**: alinha DEM com rasters Landsat via `match_merge_to_ref`.
8. **Evaporative Fraction** (`compute_evaporative_fraction`):
   - Utiliza NDVI, LST, bandas verde e NIR, DEM.
   - Seleciona pixels "hot" e "cold" (com base em `ndvi_hot_threshold`).
   - Estima ETRF (fração evaporativa).
9. **NGI e EGI** (`compute_ngi_egi_layers`):
   - NGI = Green / (NIR + Red + Green).
   - EGI = (Green - Red) / (Green + Red).
   - LST derivado das bandas termais.
10. **Irrigation Probability** (`compute_irrigation_probability`):
     - Modelo de regressão logística: P(irrigação) = 1 / (1 + exp(-(intercept + coef_ngi * NGI + coef_egi * EGI + coef_lst * LST))).
     - Coeficientes otimizados previamente com dados de Nebraska, EUA, 2015.

---

## Perfis Energéticos

### Irrigation Classification — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Hidrelétrica | UHE, PCH | Mapeia áreas irrigadas em bacias hidrográficas para gestão de recursos hídricos | Subsidia planejamento de outorga e operação de reservatórios |
| Eficiência Energética | Irrigação | Classifica probabilidade de irrigação para auditoria de consumo energético rural | Subsidia programas de eficiência energética em irrigação |
| Distribuição de Energia | Concessionárias, Cooperativas | Identifica padrões de irrigação para previsão de demanda elétrica sazonal | Apoia planejamento energético de redes rurais |
| Geração Solar | GD, GC | Mapeia áreas irrigadas para avaliação de conflito de uso do solo | Apoia seleção de áreas para usinas solares |
| Comercialização de Energia | Comercializadores | Gera dados de irrigação para previsão de demanda de energia no setor agroindustrial | Alimenta modelos de load forecasting |
