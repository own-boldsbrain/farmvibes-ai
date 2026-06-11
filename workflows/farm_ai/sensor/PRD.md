# PRD — Workflows de Sensor (farm_ai/sensor)

---

## 1. Optimal Locations (`optimal_locations.yaml`)

### JTBDs
- Identificar localizações ótimas para instalação de sensores de solo ou coleta de amostras, utilizando clustering (GMM) sobre índices espectrais calculados a partir de imagens de satélite.

### Casos de Uso
- Agricultor quer posicionar sensores de umidade/nutrientes em pontos representativos do talhão.
- Consultor define locais de amostragem de solo para análise de fertilidade.
- Pesquisador planeja malha de sensores para monitoramento de cultura.

### Faz / Não Faz
- **Faz**: computa índices espectrais (EVI, PRI, NDVI, etc. — suportados pela biblioteca spyndex); aplica Gaussian Mixture Model (GMM) para separar pixels em grupos de variância igual; seleciona localização representativa por cluster; gera shapefile com coordenadas (lat/lon).
- **Não Faz**: não instala sensores fisicamente; não coleta amostras; não analisa solo; não define qual índice usar (decisão do usuário).

### Users Inputs
- `user_input`: geometria e intervalo de datas.
- `input_raster`: raster de entrada para cálculo de índice.
- `n_clusters`: número de clusters/grupos (ex.: 5, 8).
- `sieve_size`: tamanho mínimo de agrupamento de vizinhos (ex.: 5, 10, 20).
- `index`: nome do índice espectral a ser usado (ex.: "EVI", "PRI", "NDVI").

### System Outputs
- `result`: arquivo ZIP com shapefile (.shp) contendo as localizações ótimas (latitude, longitude).

### Outcomes Esperados
- Mapa de pontos de amostragem/sensores representativos da variabilidade espacial do talhão, otimizando custo e qualidade da amostragem.

### APIs
- N/A (processamento local). O raster de entrada pode vir de workflow de ingestão de Sentinel-2.

### CRUD
- **POST**: submissão do workflow com parâmetros.
- **GET**: download do ZIP com shapefile.

### Bancos de Dados
- N/A (dados transitórios).

### Datasets e JSON
- Input: raster GeoTIFF (sentinel-2 ou outro).
- Output: shapefile em ZIP com pontos (Point geometry + atributos).

### Tabelas
- Tabela de atributos do shapefile: latitude, longitude, cluster_id.

### Lógicas e Cálculos
- Cálculo do índice espectral selecionado usando a biblioteca **spyndex**.
- **Gaussian Mixture Model (GMM)**: separa os valores do índice em `n_clusters` grupos de variância igual.
- Para cada cluster, seleciona uma localização representativa (centroide ou pixel mais próximo).
- **Sieve**: agrupa pixels vizinhos antes da seleção, controlado por `sieve_size`.
- Relação prática para 100 acres:
  - n_clusters=5, sieve_size=10 → ~20 locais.
  - n_clusters=5, sieve_size=20 → ~30 locais.
  - n_clusters=5, sieve_size=5 → ~80 locais.
  - n_clusters=8, sieve_size=5 → ~130 locais.
- Índices suportados: todos os índices da biblioteca spyndex (EVI, PRI, NDVI, etc.).

---

## Perfis Energéticos

### Optimal Locations — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação | Identifica locais ótimos para instalação de sensores de umidade do solo baseado em índices espectrais | Otimiza rede de monitoramento para irrigação de precisão |
| Geração Solar | GD, GC | Seleciona pontos representativos para instalação de estações solarimétricas | Subsidia rede de monitoramento de recurso solar |
| Biomassa / Bioenergia | Cana-de-açúcar | Define locais de amostragem para estimativa de biomassa usando EVI/NDVI | Otimiza custo e qualidade da amostragem de produtividade |
| Distribuição de Energia | Concessionárias | Posiciona sensores para monitoramento de vegetação em faixas de servidão | Apoia manutenção preditiva de redes elétricas |
| Mercado de Carbono | Agricultura de baixo carbono | Define pontos de amostragem de solo para verificação de estoque de carbono | Otimiza MRV de projetos de carbono agrícola |
