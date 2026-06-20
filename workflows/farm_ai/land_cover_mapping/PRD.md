# PRD — Workflows de Mapeamento de Cobertura do Solo (farm_ai/land_cover_mapping)

---

## 1. Conservation Practices (`conservation_practices.yaml`)

### JTBDs

- Identificar e classificar práticas de conservação do solo (terraços e canais escoadouros gramados) usando dados de elevação e imagens aéreas.

### Casos de Uso

- Órgão ambiental mapeia práticas de conservação em propriedades rurais para fiscalização e incentivos.
- Consultor agrícola identifica áreas que necessitam de práticas conservacionistas.
- Pesquisador avalia a efetividade de terraços em uma bacia hidrográfica.

### Faz / Não Faz

- **Faz**: baixa imagens NAIP (National Agriculture Imagery Program); baixa dados de elevação USGS 3DEP; computa gradiente de elevação (filtro Sobel); executa clustering por sobreposição; calcula elevação média por cluster; classifica pixels como terraço, canal escoadouro ou nenhum via CNN.
- **Não Faz**: não detecta outras práticas (plantio direto, rotação); não funciona sem dados NAIP/USGS 3DEP disponíveis; não quantifica erosão.

### Users Inputs

- `user_input`: geometria de interesse e intervalo de datas.
- `clustering_iterations`: número de iterações para o método de overlap clustering.
- `pc_key`: chave opcional Planetary Computer.

### System Outputs

- `dem_raster`: tiles USGS 3DEP.
- `naip_raster`: tiles NAIP.
- `dem_gradient`: gradiente de elevação (filtro Sobel).
- `cluster`: raster de clusters (valores 1 a 4).
- `average_elevation`: elevação média por cluster (combinação gradiente + cluster).
- `practices`: raster classificado (0 = nenhum, 1 = terraço, 2 = canal escoadouro).

### Outcomes Esperados

- Mapa de práticas conservacionistas para planejamento de manejo e compliance ambiental.

### APIs

- **Planetary Computer API**: download de NAIP e USGS 3DEP.
- **NAIP**: imagens aéreas de alta resolução (1 m).
- **USGS 3DEP**: modelo digital de elevação (DEM).

### CRUD

- **POST**: submissão do workflow.
- **GET**: rasters de saída (clusters, gradiente, práticas).

### Bancos de Dados

- N/A (dados transitórios no cluster).

### Datasets e JSON

- Input: geometria GeoJSON.
- Output: rasters GeoTIFF multi-band.

### Tabelas

- N/A.

### Lógicas e Cálculos

- **Gradiente**: filtro Sobel sobre DEM.
- **Clustering**: overlap clustering method com `clustering_iterations` iterações; cada pixel recebe valor 1-4.
- **Elevação média por cluster**: média dos pixels de elevação que caem no mesmo cluster.
- **Classificação CNN**: modelo treinado para classificar pixels em terraço, canal escoadouro ou nenhum.
- Match e merge de rasters para alinhamento NAIP-DEM.

---

## Perfis Energéticos

### Conservation Practices — Perfis Energéticos

| Perfil (Classe)         | Subclasse                    | Aplicação do Workflow                                                        | Valor Gerado                                                                        |
| ----------------------- | ---------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Geração Hidrelétrica    | UHE, PCH                     | Identifica terraços e canais escoadouros para manejo de bacias hidrográficas | Subsidia programas de conservação de solo em áreas de contribuição de reservatórios |
| Geração Solar           | GC                           | Mapeia práticas conservacionistas para avaliação de uso e ocupação do solo   | Apoia due diligence ambiental de grandes usinas                                     |
| Distribuição de Energia | Concessionárias              | Identifica áreas com terraços e canais para planejamento de torres e postes  | Apoia projetos de linhas de transmissão e distribuição                              |
| Mercado de Carbono      | Agricultura de baixo carbono | Mapeia práticas de conservação que aumentam o sequestro de carbono no solo   | Gera evidências para metodologias de carbono                                        |
| Eficiência Energética   | Irrigação                    | Classifica canais escoadouros para planejamento de recursos hídricos         | Subsidia projetos de irrigação eficiente                                            |
