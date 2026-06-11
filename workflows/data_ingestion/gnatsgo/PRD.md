# PRD — gNATSGO (Gridded National Soil Survey Geographic Database)

## Workflows

- `download_gnatsgo.yaml` — Baixa dados raster de solo do gNATSGO

---

## JTBDs (Jobs To Be Done)

1. **Baixar propriedades do solo gNATSGO** — O usuário precisa de dados raster de propriedades do solo (carbono orgânico, água disponível, produtividade etc.) para uma região nos EUA continental.

---

## Casos de Uso

- **C1:** Agrônomo quer mapa de carbono orgânico do solo (SOC) para planejar fertilização.
- **C2:** Engenheiro agrícola precisa de capacidade de armazenamento de água (AWS).
- **C3:** Economista calcula índice de produtividade (NCCPI) para avaliação de terras.

---

## Faz / Não Faz

### Faz

- Listar produtos gNATSGO do Planetary Computer.
- Baixar rasters para qualquer variável disponível (SOC, AWS, NCCPI, droughty, etc.).
- Suportar múltiplas profundidades (0–5cm, 0–20cm, ..., 150–999cm).
- Filtrar por EUA continental.

### Não Faz

- Não cobre fora dos EUA continental.
- Não faz interpolação de perfis de solo.
- Não gera relatórios tabulares.

---

## Users Inputs

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `pc_key` | string | Chave opcional da Planetary Computer |
| `variable` | string | Variável do solo (ex.: `soc0_5`, `aws0_20`, `nccpi3all`, `droughty`) |
| `user_input` | geometry | Geometria de interesse (time range arbitrário) |

### Variáveis disponíveis

- `aws{DEPTH}` — Armazenamento de água disponível
- `soc{DEPTH}` — Estoque de carbono orgânico
- `tk{DEPTH}a` / `tk{DEPTH}s` — Espessura dos componentes
- `mukey` — Chave do mapa de unidade
- `droughty` — Vulnerabilidade à seca
- `nccpi3all` / `nccpi3corn` / `nccpi3cot` / `nccpi3sg` / `nccpi3soy` — Índices de produtividade
- `pctearthmc` — Percentual de componentes terrosos
- `pwsl1pomu` — Área alagável
- `rootznaws` / `rootznemc` — Armazenamento/profundidade de raízes
- `musumcpct` / `musumcpcta` / `musumcpcts` — Soma de componentes

---

## System Outputs

- **sink:** `raster` — Raster com a variável solicitada.

---

## Outcomes Esperados

- Dados de solo disponíveis como raster local para a variável e profundidade desejadas.

---

## APIs

- **Planetary Computer STAC API**
- **Coleção:** `gnatsgo-rasters`

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos gNATSGO |
| GET (download) | Download do raster |

---

## Bancos de Dados

- **Externo:** Planetary Computer.
- **Interno:** Raster GeoTIFF.

---

## Datasets e JSON Files

- **gNATSGO:** Rasters derivados do SSURGO (Soil Survey Geographic Database).

---

## Tabelas

O `mukey` pode ser usado para juntar com tabelas SSURGO (component table, map unit table).

---

## Lógicas e Cálculos

- **Seleção de profundidade:** O `DEPTH` no nome da variável (ex.: `soc0_5`) define a profundidade do solo.
- **Fluxo:** `list_gnatsgo_products` → `download_gnatsgo`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação | Capacidade de armazenamento de água (AWS, rootznaws) | Subsidia planejamento de irrigação e balanço hídrico |
| Mercado de Carbono | Agricultura de baixo carbono | Carbono orgânico do solo (SOC) em múltiplas profundidades | Baseline de carbono no solo para certificação |
| Biomassa / Bioenergia | Cana-de-açúcar | Índices de produtividade (NCCPI) por cultura | Zoneamento de aptidão agrícola para bioenergia |
| Geração Solar | GC | Capacidade de suporte e engenharia de fundações | Dados de solo para viabilidade técnica de usinas |
| Distribuição de Energia | Concessionárias | Planejamento de fundações de torres | Propriedades geotécnicas para infraestrutura de rede |
