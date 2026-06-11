# PRD — DEM (Digital Elevation Model)

## Workflows

- `download_dem.yaml` — Baixa modelos digitais de elevação

---

## JTBDs (Jobs To Be Done)

1. **Baixar DEM** — O usuário precisa de dados de elevação do terreno para uma região, em resolução de 10m ou 30m.

---

## Casos de Uso

- **C1:** Agrônomo quer calcular declividade para planejar irrigação.
- **C2:** Engenheiro civil precisa de DEM para modelagem hidrológica.
- **C3:** Cientista ambiental analisa topografia para mapeamento de riscos.

---

## Faz / Não Faz

### Faz

- Baixar DEM do USGS 3DEP (EUA, 10m e 30m).
- Baixar DEM Copernicus GLO-30 (global, 30m).
- Usar Planetary Computer como fonte.

### Não Faz

- Não gera curvas de nível.
- Não faz análise de terreno (declividade, aspecto).
- Não mescla múltiplos tiles.

---

## Users Inputs

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `pc_key` | string | Chave opcional da Planetary Computer |
| `resolution` | int | 10 ou 30 metros |
| `provider` | string | "USGS3DEP" ou "CopernicusDEM30" |
| `user_input` | geometry + time range | Geometria e período de interesse |

---

## System Outputs

- **sink:** `raster` — Raster DEM.

---

## Outcomes Esperados

- Dados de elevação disponíveis como raster local, na resolução e provedor escolhidos.

---

## APIs

- **Planetary Computer STAC API**
- **Coleções:** `3dep-seamless`, `cop-dem-glo-30`

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos DEM disponíveis |
| GET (download) | Download dos tiles DEM |

---

## Bancos de Dados

- **Externo:** Planetary Computer.
- **Interno:** Raster GeoTIFF local.

---

## Datasets e JSON Files

- **Coleções STAC:**
  - `3dep-seamless` (USGS 3DEP)
  - `cop-dem-glo-30` (Copernicus GLO-30)

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Seleção de provedor:** Define qual catálogo STAC consultar.
- **Resolução:** Filtra produtos pela resolução solicitada (10m ou 30m).
- **Fluxo:** `list_dem_products` → `download_dem`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | Análise de declividade e orientação de terreno | Subsidia mapeamento de irradiação solar e viabilidade técnica |
| Geração Eólica | Onshore | Rugosidade do terreno e aceleração de vento | Modelo digital para simulação de escoamento de vento |
| Geração Hidrelétrica | UHE, PCH, CGH | Modelagem hidrológica e de drenagem | Declividade e relevo para cálculo de potencial hidrelétrico |
| Distribuição de Energia | Concessionárias | Perfil de elevação para rotas de transmissão | Dados topográficos para planejamento de linhas |
| Eficiência Energética | Irrigação | Planejamento de irrigação por gravidade | Topografia para dimensionamento de sistemas hídricos |
