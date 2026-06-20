# PRD — Workflows de Degradação do Solo (farm_ai/land_degradation)

---

## 1. Landsat NDVI Trend (`landsat_ndvi_trend.yaml`)

### JTBDs

- Estimar a tendência linear do NDVI ao longo do tempo usando imagens Landsat para avaliar degradação ou recuperação da vegetação.

### Casos de Uso

- Pesquisador monitora desertificação em biomas brasileiros.
- Órgão ambiental avalia tendências de degradação em APPs (Áreas de Preservação Permanente).
- Agrônomo avalia histórico de produtividade de uma região.

### Faz / Não Faz

- **Faz**: baixa dados Landsat via Planetary Computer; computa NDVI; estima tendência linear sobre chunks, combinando em raster final com estatísticas de teste.
- **Não Faz**: não faz previsão futura; não identifica causas da degradação; não separa tendência natural de antrópica.

### Users Inputs

- `user_input`: geometria e intervalo de datas.
- `pc_key`: chave opcional Planetary Computer.

### System Outputs

- `ndvi`: rasters NDVI.
- `linear_trend`: raster com tendência linear e estatísticas de teste (p-value, inclinação).

### Outcomes Esperados

- Identificação de áreas com tendência de declínio (degradação) ou melhora (recuperação) da vegetação.

### APIs

- **Planetary Computer API**: download de imagens Landsat.

### CRUD

- **POST**: submissão do workflow.
- **GET**: rasters de tendência e NDVI.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: GeoJSON.
- Output: rasters GeoTIFF (tendência + estatísticas).

### Tabelas

- N/A.

### Lógicas e Cálculos

- Processamento Landsat (calibração, correção atmosférica).
- Cálculo de NDVI.
- Subworkflow `ndvi_linear_trend` para cálculo chunked de tendência linear pixel a pixel.

---

## 2. NDVI Linear Trend (`ndvi_linear_trend.yaml`)

### JTBDs

- Calcular a tendência linear pixel a pixel do NDVI a partir de um raster de entrada multi-temporal.

### Casos de Uso

- Subworkflow utilizado internamente por `landsat_ndvi_trend`.
- Pesquisador com raster próprio quer computar tendência de NDVI.

### Faz / Não Faz=

- **Faz**: recebe raster multi-temporal; computa NDVI; divide em chunks (512x512); calcula regressão linear pixel a pixel em cada chunk; combina chunks em raster final.
- **Não Faz**: não aceita dados não-rasters; não faz detecção de breakpoints.

### Users Inputs

- `raster`: raster multi-temporal de entrada.

### System Outputs

- `ndvi_raster`: raster NDVI.
- `linear_trend`: raster com tendência linear e estatísticas de teste.

### Outcomes Esperados

- Raster de tendência NDVI para análise de degradação.

### APIs

- N/A (processamento local).

### CRUD

- **POST**: submissão.

- **GET**: raster de tendência.

### Bancos de Dados

- N/A.

### Datasets e JSON

- Input: raster GeoTIFF multi-temporal.
- Output: raster GeoTIFF (tendência + p-value + inclinação).

### Tabelas

- N/A.

### Lógicas e Cálculos

- NDVI = (NIR - Red) / (NIR + Red).
- Regressão linear pixel a pixel via `chunked_linear_trend` com chunk_step_x=512, chunk_step_y=512.
- Combinação de chunks em raster único contínuo.
- Estatísticas de teste: inclinação, intercepto, p-value, R².

---

## Perfis Energéticos

### Landsat NDVI Trend — Perfis Energéticos

| Perfil (Classe)         | Subclasse              | Aplicação do Workflow                                                                   | Valor Gerado                                                   |
| ----------------------- | ---------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Mercado de Carbono      | REDD+, Reflorestamento | Estima tendência NDVI multitemporal para avaliar degradação ou recuperação da vegetação | Subsidia linhas de base e MRV de projetos de carbono florestal |
| Geração Solar           | GC                     | Analisa tendência histórica de vegetação para seleção de áreas com baixa interferência  | Apoia estudos de viabilidade ambiental de usinas solares       |
| Geração Hidrelétrica    | UHE, PCH               | Monitora tendências de degradação em bacias hidrográficas                               | Subsidia programas de conservação de mananciais                |
| Distribuição de Energia | Concessionárias        | Avalia tendência de crescimento vegetativo em faixas de servidão                        | Planeja programas de manutenção preventiva de redes            |
| Óleo e Gás              | Exploração             | Monitora recuperação de vegetação em áreas pós-exploração                               | Apoia planos de descomissionamento e recuperação ambiental     |

### NDVI Linear Trend — Perfis Energéticos

| Perfil (Classe)         | Subclasse       | Aplicação do Workflow                                                       | Valor Gerado                                          |
| ----------------------- | --------------- | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| Mercado de Carbono      | REDD+           | Calcula tendência NDVI pixel a pixel para estabelecimento de linhas de base | Subsidia MRV de projetos de carbono florestal         |
| Geração Solar           | GC              | Fornece tendência histórica de vegetação para avaliação de sítios           | Apoia seleção de áreas para usinas solares            |
| Geração Hidrelétrica    | PCH             | Analisa tendência de cobertura vegetal em bacias de contribuição            | Subsidia planejamento de conservação de reservatórios |
| Distribuição de Energia | Concessionárias | Computa tendência de crescimento vegetativo para risco de interferência     | Apoia programas de manutenção de rede elétrica        |
| Óleo e Gás              | Exploração      | Gera indicadores de regeneração vegetal para áreas impactadas               | Subsidia relatórios ambientais de fechamento de poços |
