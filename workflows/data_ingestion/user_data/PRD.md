# PRD — Dados do Usuário (Ingestão)

## Workflows
- `ingest_geometry.yaml` — Adiciona geometrias do usuário ao cluster
- `ingest_raster.yaml` — Adiciona rasters do usuário ao cluster
- `ingest_smb.yaml` — Adiciona rasters de compartilhamento SMB ao cluster

---

## JTBDs (Jobs To Be Done)

1. **Ingerir geometria externa** — O usuário precisa carregar geometrias de fontes externas (GeoJSON, Shapefile etc.) para uso em workflows.
2. **Ingerir raster externo** — O usuário precisa carregar rasters GeoTIFF de fontes externas.
3. **Ingerir rasters de SMB** — O usuário precisa carregar rasters de um compartilhamento Windows SMB.

---

## Casos de Uso

- **C1:** Agrônomo quer usar seus próprios shapefiles de talhões nos workflows.
- **C2:** Pesquisador carrega rasters de drone para análise.
- **C3:** Empresa tem servidor NAS (SMB) com imagens históricas.

---

## Faz / Não Faz

### Faz
- Baixar geometrias de referências URL/URI.
- Baixar rasters de referências URL/URI.
- Conectar a compartilhamento SMB (autenticado).
- Gerar objetos GeometryCollection e Raster locais.

### Não Faz
- Não valida geometrias (topologia).
- Não reprojeta rasters automaticamente.
- Não faz cache de downloads.
- Não suporta protocolos além de HTTP/HTTPS e SMB/CIFS.

---

## Users Inputs

### `ingest_geometry` / `ingest_raster`
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `user_input` | list | Lista de referências externas (URLs) |

### `ingest_smb`
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `server_name` | string | Nome do servidor SMB |
| `server_ip` | string | IP do servidor |
| `server_port` | int | Porta (default: 445) |
| `username` | string | Usuário SMB |
| `password` | string | Senha SMB |
| `share_name` | string | Nome do compartilhamento |
| `directory_path` | string | Caminho no compartilhamento (default: "/") |
| `bands` | list | Bandas selecionadas (default: ["red", "green", "blue"]) |
| `user_input` | DataVibe | Metadados de tempo e geometria |

---

## System Outputs

| Workflow | Sink | Descrição |
|----------|------|-----------|
| `ingest_geometry` | `geometry` | GeometryCollection com assets locais |
| `ingest_raster` | `raster` | Rasters com assets locais |
| `ingest_smb` | `rasters` | Rasters com assets locais |

---

## Outcomes Esperados

- Dados do usuário disponíveis como assets locais no cluster farmvibes-ai.
- Prontos para uso em workflows downstream.

---

## APIs

- **HTTP/HTTPS:** Download de URLs públicas/protegidas.
- **SMB/CIFS:** Protocolo de compartilhamento de arquivos Windows.

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| CREATE | Adiciona dados do usuário ao cluster |
| READ | Dados ficam disponíveis para leitura |

---

## Bancos de Dados

- **Interno:** Assets locais no cluster (GeoTIFF, GeoJSON, DataVibe).

---

## Datasets e JSON Files

- **Geometria:** GeoJSON, Shapefile (via URL).
- **Raster:** GeoTIFF (via URL ou SMB).

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Unpack de referências:** `unpack_refs` extrai lista de refs do DataVibe.
- **Download:** `download_geometry_from_ref` / `download_raster_from_ref` para URLs.
- **SMB:** `download_rasters_from_smb` monta share e copia arquivos.
- **Seleção de bandas:** Parâmetro `bands` filtra quais bandas carregar do SMB.

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética | Irrigação, Estufas, Armazenamento | Ingestão de dados proprietários (rasters de drone, shapefiles) | Integração de dados de campo para análise de precisão |
| Geração Solar | GD, GC | Ingestão de levantamentos topográficos e cadastrais | Dados de campo para viabilidade técnica de instalações |
| Distribuição de Energia | Concessionárias | Ingestão de dados de inventário de rede | Integração de ativos existentes no ambiente GIS |
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | Ingestão de geometrias de talhões e fazendas | Dados cadastrais para planejamento de suprimento |
| Mercado de Carbono | Agricultura de baixo carbono | Evidências de manejo e uso do solo | Ingestão de dados de campo para verificação de créditos |
