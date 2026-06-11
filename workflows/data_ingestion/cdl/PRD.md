# PRD — CDL (Cropland Data Layer)

## Workflows

- `download_cdl.yaml` — Baixa mapas de cobertura vegetal (culturas) do USDA CDL

---

## JTBDs (Jobs To Be Done)

1. **Baixar classificação de culturas** — O usuário precisa de mapas de uso do solo específicos por cultura para os EUA continental em um determinado ano.

---

## Casos de Uso

- **C1:** Agrônomo quer saber quais culturas foram plantadas em uma região nos últimos anos.
- **C2:** Seguradora agrícola analisa risco baseado no tipo de cultura.
- **C3:** Pesquisador estuda rotação de culturas nos EUA continental.

---

## Faz / Não Faz

### Faz

- Listar produtos CDL disponíveis.
- Baixar rasters de classificação de culturas.
- Cobrir apenas EUA continental.

### Não Faz

- Não classifica imagens — apenas baixa dados prontos.
- Não cobre fora dos EUA continental.
- Não faz análise temporal.

---

## Users Inputs

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `user_input` | geometry + time range | Geometria e período de interesse (deve intersectar EUA continental) |

---

## System Outputs

- **sink:** `raster` — Raster CDL com classes de cobertura do solo (culturas).

---

## Outcomes Esperados

- Mapa de culturas disponível como raster local para a região e ano solicitados.

---

## APIs

- **USDA/NASS:** Dados CDL via HTTPS.
- **Conector:** Download direto de arquivos GeoTIFF do servidor público do USDA.

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos CDL disponíveis |
| GET (download) | Download do raster |

---

## Bancos de Dados

- **Externo:** Servidores do USDA NASS.
- **Interno:** Rasters GeoTIFF locais.

---

## Datasets e JSON Files

- **CDL:** Arquivos GeoTIFF anuais com resolução de 30m.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Fluxo:** `list_cdl_products` → `download_cdl`.
- **Recorte:** Apenas tiles que intersectam a geometria são baixados.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Biomassa / Bioenergia | Cana-de-açúcar | Identificação e mapeamento de culturas | Mapa de áreas cultivadas com cana para produção de bioenergia |
| Mercado de Carbono | Agricultura de baixo carbono | Rotação de culturas e histórico agrícola | Dados de práticas de manejo para certificação de carbono |
| Eficiência Energética | Irrigação | Identificação de áreas irrigadas | Mapa de culturas irrigadas para planejamento hídrico |
| Geração Solar | GC | Zoneamento de uso do solo para usinas | Histórico de cobertura para seleção de áreas antropizadas |
| Comercialização de Energia | Comercializadores | Previsão de safra e oferta de biomassa | Dados históricos de culturas para modelos de previsão |
