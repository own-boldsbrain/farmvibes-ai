# PRD — LANDSAT

## Workflows

- `preprocess_landsat.yaml` — Baixa e pré-processa imagens LANDSAT do Planetary Computer

---

## JTBDs (Jobs To Be Done)

1. **Baixar e empilhar bandas LANDSAT** — O usuário precisa de rasters LANDSAT com múltiplas bandas empilhadas a 30m de resolução, com máscara de qualidade.

---

## Casos de Uso

- **C1:** Agrônomo quer analisar índices espectrais (NDVI, EVI) usando bandas LANDSAT.
- **C2:** Pesquisador de uso do solo classifica imagens LANDSAT.
- **C3:** Ambientalista monitora mudança na cobertura vegetal.

---

## Faz / Não Faz

### Faz

- Listar produtos LANDSAT no Planetary Computer.
- Baixar bandas e stack em único raster 30m.
- Aplicar máscara QA (`qa_mask_value`) para selecionar pixels "Clear".

### Não Faz

- Não faz correção atmosférica (os dados já são Collection 2).
- Não faz ortóretificação.
- Não suporta LANDSAT 4, 5, 7, 8, 9 individualmente — usa o catálogo geral.

---

## Users Inputs

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `pc_key` | string | Chave opcional da Planetary Computer |
| `qa_mask_value` | int | Bitmask QA (default: 64 = "Clear") |
| `user_input` | geometry + time range | Geometria e período |

---

## System Outputs

- **sink:** `raster` — LANDSAT raster com bandas empilhadas a 30m.

---

## Outcomes Esperados

- Raster LANDSAT multi-banda disponível localmente, com pixels nublados mascarados.

---

## APIs

- **Planetary Computer STAC API**
- **Coleções:** `landsat-c2-l2` (Collection 2 Level-2)

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos LANDSAT |
| GET (download) | Download e stack das bandas |

---

## Bancos de Dados

- **Externo:** Planetary Computer.
- **Interno:** Raster multi-banda GeoTIFF.

---

## Datasets e JSON Files

- **Coleção STAC:** `landsat-c2-l2`

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Máscara QA:** O parâmetro `qa_mask_value` (default: 64 = 1<<6) define quais pixels incluir baseado no bit index da banda QA. Veja [USGS docs](https://www.usgs.gov/media/images/landsat-collection-2-pixel-quality-assessment-bit-index).
- **Stack:** Bandas individuais são empilhadas em um único raster multi-banda.
- **Fluxo:** `list_landsat_products_pc` → `download_landsat_from_pc` → `stack_landsat`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | NDVI, EVI e índices espectrais para monitoramento | Série temporal multiespectral para fenologia de culturas bioenergéticas |
| Geração Solar | GD, GC | Análise de cobertura de nuvens e albedo | Bandas ópticas para estimativa de irradiância solar |
| Mercado de Carbono | Agricultura de baixo carbono, REDD+ | Mudança de cobertura e uso do solo | Classificação multiespectral para relatório de carbono |
| Geração Hidrelétrica | UHE, PCH | Monitoramento de reservatórios e bacias | Cobertura vegetal temporal para modelagem hidrológica |
| Eficiência Energética | Irrigação | Evapotranspiração (bandas térmicas) | Estimativa de demanda hídrica em áreas irrigadas |
| Distribuição de Energia | Concessionárias | Monitoramento de vegetação em faixa de servidão | Detecção de invasão vegetal em linhas de transmissão |
