# PRD — OSM Road Geometries (Open Street Maps)

## Workflows

- `osm_road_geometries.yaml` — Baixa geometrias viárias do OpenStreetMap

---

## JTBDs (Jobs To Be Done)

1. **Baixar geometrias de ruas** — O usuário precisa das geometrias de vias (ruas, estradas, caminhos) de uma região para análise espacial.

---

## Casos de Uso

- **C1:** Agrônomo quer calcular distância de talhões até estradas.
- **C2:** Logista analisa acessibilidade de áreas agrícolas.
- **C3:** Planejador urbano estuda rede viária rural.

---

## Faz / Não Faz

### Faz

- Baixar geometrias de ruas do OSM para uma região.
- Selecionar tipo de via (`network_type`): `drive`, `drive_service`, `walk`, `bike`, `all`, `all_private`.
- Aplicar buffer de busca em metros.

### Não Faz

- Não baixa outros elementos OSM (rios, edifícios, uso do solo).
- Não faz roteamento ou cálculo de distâncias.
- Não atualiza dados OSM — apenas baixa.

---

## Users Inputs

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `network_type` | string | Tipo de via (ex.: `"drive"`, `"all"`) |
| `buffer_size` | float | Buffer em metros para busca de nós |
| `user_input` | geometry | Região de interesse |

---

## System Outputs

- **sink:** `roads` — GeometryCollection com geometrias viárias.

---

## Outcomes Esperados

- Geometrias de ruas disponíveis como assets locais para análise espacial.

---

## APIs

- **OpenStreetMap (OSM):** API pública via pacote `osmnx`.
- **Documentação:** [osmnx.readthedocs.io](https://osmnx.readthedocs.io)

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| READ | Download de geometrias viárias |

---

## Bancos de Dados

- **Externo:** OpenStreetMap (OSM).
- **Interno:** GeometryCollection local.

---

## Datasets e JSON Files

- **OSM:** Geometrias viárias em GeoJSON.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Seleção de vias:** `network_type` define quais tipos de via incluir.
- **Buffer:** `buffer_size` define a distância em metros para buscar nós no OSM.
- **Bounding box:** Calcula bounding box da geometria de entrada.
- **Fluxo:** `download_road_geometries` com `network_type` + `buffer_size`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Distribuição de Energia | Concessionárias, Permissionárias | Mapeamento de acessibilidade a linhas de transmissão e subestações | Subsidia planejamento de rotas de inspeção e manutenção de rede |
| Geração Solar | GD, GC | Análise de acessibilidade para instalação de usinas | Fornece rede viária para logística de implantação de parques solares |
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | Logística de transporte de biomassa | Mapeia rotas de escoamento de produção |
| Eficiência Energética | Irrigação, Armazenamento | Acesso a infraestrutura agrícola | Suporte logístico para operações de precisão |
| Óleo e Gás | Transporte | Mapeamento de acessibilidade a dutovias e refinarias | Subsidia rotas de inspeção e fiscalização |
