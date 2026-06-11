# PRD — Solo (SoilGrids + USDA)

## Workflows

- `soilgrids.yaml` — Baixa mapas digitais de solo do SoilGrids (ISRIC)
- `usda.yaml` — Baixa classificação de solos USDA global

---

## JTBDs (Jobs To Be Done)

1. **Baixar propriedades do solo (SoilGrids)** — O usuário precisa de rasters com propriedades do solo (classes WRB, densidade, carbono, pH etc.) para uma região.
2. **Baixar classificação USDA** — O usuário precisa de um raster global com classes de solo USDA.

---

## Casos de Uso

- **C1:** Agrônomo quer mapa de pH do solo para corrigir acidez.
- **C2:** Cientista do solo analisa distribuição de classes WRB.
- **C3:** Pesquisador global usa classificação USDA para modelagem.

---

## Faz / Não Faz

### Faz

- Baixar qualquer mapa SoilGrids (wrb, bdod, cec, clay, nitrogen, phh2o, sand, silt, soc, ocs, ocd).
- Baixar identificador específico (MostProbable, classes WRB, profundidades).
- Baixar classificação USDA global (1/30 grau).

### Não Faz

- Não faz interpolação de perfis.
- Não cobre solos locais fora dos datasets globais.
- Não valida dados com campo.

---

## Users Inputs

### `soilgrids`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `map` | string | Mapa: `wrb`, `bdod`, `cec`, `cfvo`, `clay`, `nitrogen`, `phh2o`, `sand`, `silt`, `soc`, `ocs`, `ocd` |
| `identifier` | string | Identificador (ex.: `MostProbable`, `Acrisols`, ou profundidade) |
| `input_item` | geometry | Geometria de interesse |

### `usda`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `ignore` | string | Campos a ignorar: `"all"`, `"time_range"`, `"geometry"` |
| `input_item` | geometry | Geometria de entrada (pode ser dummy) |

---

## System Outputs

### `soilgrids`

- **sink:** `downloaded_raster` — Raster com o mapa e identificador solicitados.

### `usda`

- **sink:** `downloaded_raster` — Raster com classes de solo USDA.

---

## Outcomes Esperados

- Dados de solo globais disponíveis como rasters locais para a propriedade desejada.

---

## APIs

- **SoilGrids (ISRIC):** `https://files.isric.org/soilgrids/latest/data/`
- **USDA:** Raster global pré-processado.

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (download) | Download direto dos rasters |

---

## Bancos de Dados

- **Externo:** ISRIC SoilGrids, USDA.
- **Interno:** Rasters GeoTIFF.

---

## Datasets e JSON Files

- **SoilGrids v2:** Mapas globais 250m.
- **USDA Soil Taxonomy:** Global 1/30 grau.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Nomenclatura SoilGrids:** Parâmetros seguem a [documentação ISRIC](https://www.isric.org/explore/soilgrids/faq-soilgrids).
- **Filtro USDA:** `datavibe_filter` ignora campos selecionados pelo parâmetro `ignore`.
- **Fluxo SoilGrids:** `download_soilgrids` com map + identifier.
- **Fluxo USDA:** `datavibe_filter` → `download_usda_soils`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação | pH, textura, capacidade de campo (SoilGrids) | Planejamento de irrigação e fertilização em taxa variada |
| Mercado de Carbono | Agricultura de baixo carbono | Carbono orgânico do solo (SOC, ocs, ocd) | Baseline de carbono no solo para projetos de certificação |
| Biomassa / Bioenergia | Cana-de-açúcar | Fertilidade e aptidão agrícola (nitrogen, phh2o) | Zoneamento de solos aptos para culturas bioenergéticas |
| Geração Solar | GC | Capacidade de suporte do solo | Dados geotécnicos para fundações de usinas solares |
| Distribuição de Energia | Concessionárias | Propriedades geotécnicas para obras | Dados de solo para planejamento de torres e linhas |
