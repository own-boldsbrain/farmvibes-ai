# PRD — NAIP (National Agriculture Imagery Program)

## Workflows

- `download_naip.yaml` — Baixa imagens NAIP

---

## JTBDs (Jobs To Be Done)

1. **Baixar ortofotos NAIP** — O usuário precisa de imagens aéreas de alta resolução do NAIP para os EUA.

---

## Casos de Uso

- **C1:** Agrônomo quer imagens de alta resolução (~1m) para inspeção visual de talhões.
- **C2:** Analista de SIG usa NAIP como base para vetorização.
- **C3:** Pesquisador treina modelos de deep learning com imagens NAIP.

---

## Faz / Não Faz

### Faz

- Listar produtos NAIP no Planetary Computer.
- Baixar tiles que intersectam a geometria e período.

### Não Faz

- Não faz ortóretificação (já ortorretificadas).
- Não cobre fora dos EUA.
- Não faz composição de mosaicos.

---

## Users Inputs

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `pc_key` | string | Chave opcional da Planetary Computer |
| `user_input` | geometry + time range | Geometria e período de interesse |

---

## System Outputs

- **sink:** `raster` — Tiles NAIP.

---

## Outcomes Esperados

- Imagens NAIP de alta resolução (~1m) disponíveis como rasters locais.

---

## APIs

- **Planetary Computer STAC API**
- **Coleção:** `naip`

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos NAIP |
| GET (download) | Download dos tiles |

---

## Bancos de Dados

- **Externo:** Planetary Computer.
- **Interno:** Rasters GeoTIFF.

---

## Datasets e JSON Files

- **NAIP:** Ortofotos RGB/NIR de 1m de resolução, coletadas a cada 2-3 anos.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Fluxo:** `list_naip_products` → `download_naip`.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação, Estufas | Imagens de alta resolução (~1m) para inspeção | Ortofotos detalhadas para verificação de infraestrutura agrícola |
| Distribuição de Energia | Concessionárias | Inspeção visual de ativos de rede | Imagens aéreas para fiscalização de linhas e subestações |
| Geração Solar | GD | Mapeamento de telhados para GD | Ortofotos de alta resolução para identificação de áreas aptas |
| Biomassa / Bioenergia | Cana-de-açúcar | Verificação de culturas em campo | Imagens de alta resolução para amostragem e validação |
| Óleo e Gás | Transporte | Monitoramento de faixas de dutovias | Ortofotos para detecção de invasões e vazamentos |
