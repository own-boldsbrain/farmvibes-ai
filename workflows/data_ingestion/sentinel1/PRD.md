# PRD — Sentinel-1 (SAR)

## Workflows

- `preprocess_s1.yaml` — Baixa e pré-processa imagens Sentinel-1 (RTC) no sistema de tiling do Sentinel-2

---

## JTBDs (Jobs To Be Done)

1. **Processar Sentinel-1 no grid Sentinel-2** — O usuário precisa de rasters Sentinel-1 (radar) processados (RTC) e alinhados ao sistema de tiles Sentinel-2 para uso combinado.

---

## Casos de Uso

- **C1:** Cientista quer combinar dados ópticos (S2) e radar (S1) para classificação.
- **C2:** Agrônomo analisa umidade do solo usando retroespalhamento SAR.
- **C3:** Pipeline SpaceEye precisa de S1 pré-processado para remoção de nuvens.

---

## Faz / Não Faz

### Faz

- Listar produtos Sentinel-1 no Planetary Computer.
- Selecionar tiles com cobertura mínima (`min_cover`) agrupados por `orbit_number`.
- Baixar produtos S1.
- Tilear rasters S1 no grid Sentinel-2.
- Mesclar orbits diferentes.

### Não Faz

- Não faz calibração radiométrica avançada.
- Não corrige terreno além do RTC padrão.
- Não suporta modo TOPSAR bruto.

---

## Users Inputs

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `pc_key` | string | Chave opcional da Planetary Computer |
| `min_cover` | float | Cobertura mínima da ROI (default: 0.4) |
| `dl_timeout` | int | Timeout de download (segundos) |
| `user_input` | time range | Período de interesse |
| `s2_products` | S2 products | Produtos Sentinel-2 para definir geometria |

---

## System Outputs

- **sink:** `raster` — Rasters Sentinel-1 RTC no sistema de tiling Sentinel-2.

---

## Outcomes Esperados

- Dados Sentinel-1 processados e alinhados ao grid Sentinel-2, prontos para uso conjunto.

---

## APIs

- **Planetary Computer STAC API**
- **Coleção:** `sentinel-1-rtc`

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos S1 disponíveis |
| GET (download) | Download dos produtos |

---

## Bancos de Dados

- **Externo:** Planetary Computer.
- **Interno:** Rasters GeoTIFF no grid S2.

---

## Datasets e JSON Files

- **Sentinel-1 RTC:** Retroespalhamento em gamma0, bandas VV + VH.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Seleção de tiles:** Filtra por `min_cover` da ROI, agrupa por `orbit_number`.
- **Tile:** Reamostragem para o grid Sentinel-2.
- **Merge por órbita:** `group_sentinel1_orbits` → `merge_sentinel1_orbits`.
- **Fluxo:** `merge_geometries` → `merge_geometry_and_time_range` → `list_sentinel1_products_pc` → `select_necessary_coverage_items` → `download_sentinel1` → `tile_sentinel1_rtc` → `group_sentinel1_orbits` → `merge_sentinel1_orbits`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação | Umidade do solo via retroespalhamento SAR (VV/VH) | Dados de radar para estimativa de umidade e manejo de irrigação |
| Distribuição de Energia | Concessionárias | Deformação do solo com InSAR | Monitoramento de subsidência em áreas de infraestrutura de rede |
| Biomassa / Bioenergia | Floresta energética | Estrutura da vegetação por retroespalhamento | Estimativa de biomassa florestal via SAR |
| Geração Hidrelétrica | UHE, PCH | Umidade de superfície em bacias | Monitoramento hídrico complementar a dados ópticos |
| Geração Solar | GC | Cobertura independente de nuvens | Dados SAR para locais com alta nebulosidade |
