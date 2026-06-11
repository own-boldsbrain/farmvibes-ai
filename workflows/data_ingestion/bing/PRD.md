# PRD — Bing Maps (Basemaps)

## Workflows

- `basemap_download.yaml` — Baixa tiles de basemap do Bing Maps
- `basemap_download_merge.yaml` — Baixa e mescla tiles em um único raster

---

## JTBDs (Jobs To Be Done)

1. **Baixar basemaps Bing** — O usuário precisa de imagens de base (basemap) do Bing Maps para uma região em um nível de zoom específico.
2. **Mesclar basemaps** — O usuário precisa unificar múltiplos tiles de basemap em um único raster contínuo.

---

## Casos de Uso

- **C1:** Agrônomo quer um mapa de fundo de alta resolução para sobrepor dados de talhões.
- **C2:** Analista de SIG precisa de mosaico de imagem de satélite para referência visual.
- **C3:** Engenheiro de visão computacional usa basemaps como fundo para anotações.

---

## Faz / Não Faz

### Faz

- Listar tiles Bing que intersectam a geometria de entrada.
- Baixar basemaps no nível de zoom informado.
- Mesclar basemaps em raster único com resolução configurável.

### Não Faz

- Não suporta outros provedores de mapas (Google Maps, Mapbox).
- Não faz georreferenciamento (os tiles já são georreferenciados).

---

## Users Inputs

| Parâmetro | Workflow | Tipo | Descrição |
|-----------|----------|------|-----------|
| `api_key` | Ambos | string | Chave de API do Bing Maps |
| `zoom_level` | Ambos | int | Nível de zoom (ex.: 10–18) |
| `merge_resolution` | `*merge*` | string | Resolução do merge ("highest" ou valor específico) |
| `input_geometry` | Ambos | geometry | Geometria de interesse |

---

## System Outputs

### `basemap_download`

- **sink:** `basemaps` — Rasters individuais de basemap.

### `basemap_download_merge`

- **sink:** `merged_basemap` — Raster único mesclado.

---

## Outcomes Esperados

- Basemaps baixados e disponíveis como assets locais.
- Mosaico contínuo sem linhas de borda entre tiles.

---

## APIs

- **Bing Maps API:** Requer `api_key`.
- **Tile system:** Quad-tree (XYZ tiles).
- **Conector:** REST API da Microsoft Bing Maps.

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista tiles que intersectam a geometria |
| GET (download) | Download de cada tile |

---

## Bancos de Dados

- **Externo:** Bing Maps (Microsoft).
- **Interno:** Rasters GeoTIFF locais.

---

## Datasets e JSON Files

N/A.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Listagem de tiles:** Cálculo dos tiles XYZ que cobrem a geometria no zoom informado.
- **Merge:** União dos rasters com corte pela geometria de união de todos os tiles.
- **Resolução:** Parâmetro `merge_resolution` define a resolução do raster final (ex.: "highest").
- **Fluxo:** `list_bing_maps` → `download_bing_basemap` → `list_to_sequence` → `merge_rasters`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Distribuição de Energia | Concessionárias | Mapa base para monitoramento de faixa de servidão | Contexto visual para fiscalização de vegetação em linhas |
| Geração Solar | GD, GC | Mapa de fundo para planejamento de instalação | Referência visual para análise de área disponível |
| Óleo e Gás | Transporte | Mapeamento de faixas de dutovias | Imagens base para monitoramento de right-of-way |
| Eficiência Energética | Irrigação, Estufas | Base cartográfica para SIG agrícola | Contexto visual para planejamento de irrigação |
| Comercialização de Energia | Consumidores Livres | Análise regional de localização | Mapa de fundo para decisões de instalação |
