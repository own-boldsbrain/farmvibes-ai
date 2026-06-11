# PRD — Hansen (Global Forest Change)

## Workflows

- `hansen_forest_change_download.yaml` — Baixa e mescla dados de mudança florestal (Hansen)

---

## JTBDs (Jobs To Be Done)

1. **Baixar dados de mudança florestal** — O usuário precisa de rasters de cobertura, perda e ganho florestal do Global Forest Change (Hansen) para uma região.

---

## Casos de Uso

- **C1:** Pesquisador analisa desmatamento entre 2000 e 2022.
- **C2:** ONG monitora perda de cobertura florestal em áreas protegidas.
- **C3:** Carbon credit company verifica reflorestamento.

---

## Faz / Não Faz

### Faz

- Listar produtos Hansen do Google Cloud Storage.
- Baixar qualquer camada disponível (`treecover2000`, `loss`, `gain`, `lossyear`, `datamask`, `first`, `last`).
- Mesclar rasters automaticamente.

### Não Faz

- Não calcula métricas derivadas (taxa de desmatamento).
- Não suporta versões futuras do dataset sem atualizar `tiles_folder_url`.
- Não distingue tipos de perda florestal.

---

## Users Inputs

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `layer_name` | string | Camada: `treecover2000`, `loss`, `gain`, `lossyear`, `datamask`, `first`, `last` |
| `tiles_folder_url` | string | URL do dataset (padrão: GFC-2022-v1.10) |
| `input_item` | geometry + time range | Geometria e período de interesse |

---

## System Outputs

- **sink:** `merged_raster` — Raster mesclado da camada solicitada.
- **sink:** `downloaded_raster` — Rasters individuais antes do merge.

---

## Outcomes Esperados

- Dados de mudança florestal (Hansen) disponíveis como rasters locais, mesclados por ano.

---

## APIs

- **Google Cloud Storage:** `storage.googleapis.com/earthenginepartners-hansen`
- **Formato:** Tiles GeoTIFF em grade 10x10 graus.

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos que intersectam a geometria |
| GET (download) | Download dos tiles |

---

## Bancos de Dados

- **Externo:** Google Cloud Storage (Earth Engine Partners).
- **Interno:** Rasters GeoTIFF locais.

---

## Datasets e JSON Files

- **GFC-2022-v1.10:** Dataset anual com 30m de resolução (2000–2022).

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Seleção de camada:** O parâmetro `layer_name` define qual variável baixar.
- **Agrupamento:** `group_rasters_by_time` com critério "year".
- **Merge:** Rasters do mesmo ano são mesclados.
- **Fluxo:** `list_hansen_products` → `download_hansen` → `group` → `merge`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Mercado de Carbono | REDD+, Reflorestamento | Perda e ganho de cobertura florestal (2000–2022) | Histórico de mudança florestal para créditos de carbono |
| Biomassa / Bioenergia | Floresta energética | Cobertura florestal histórica e tendências | Baseline de biomassa para planejamento de manejo |
| Geração Hidrelétrica | UHE, PCH | Desmatamento em bacias hidrográficas | Monitoramento de perda florestal em áreas de contribuição |
| Óleo e Gás | Exploração | Mudança de uso do solo em concessões | Histórico de desmatamento para licenciamento ambiental |
| Geração Solar | GC | Identificação de áreas antropizadas persistentes | Zoneamento histórico para implantação de usinas |
