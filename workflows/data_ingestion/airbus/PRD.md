# PRD — Airbus (Imagery de Satélite)

## Workflows

- `airbus_download.yaml` — Baixa imagens Airbus que intersectam a geometria e período informados
- `airbus_price.yaml` — Calcula o preço agregado das imagens disponíveis

---

## JTBDs (Jobs To Be Done)

1. **Baixar imagens Airbus** — O usuário precisa obter imagens de satélite Airbus que cobrem uma região e período específicos, comprando-as se necessário.
2. **Consultar preço de imagens** — O usuário precisa saber o custo (em kB) das imagens disponíveis antes de comprá-las.

---

## Casos de Uso

- **C1:** Analista quer baixar imagens de alta resolução Airbus para monitorar uma área agrícola.
- **C2:** Gerente de frota precisa cotar o custo de imagens antes de aprovar a compra.
- **C3:** Pesquisador avalia disponibilidade de imagens para uma região remota.

---

## Faz / Não Faz

### Faz

- Listar produtos Airbus disponíveis via API REST.
- Comprar imagens que ainda não estão na biblioteca do usuário.
- Baixar imagens compradas.
- Calcular preço agregado desconsiderando imagens já na biblioteca.

### Não Faz

- Não faz ortóretificação ou correção atmosférica.
- Não suporta outros provedores de imagens.
- Não armazena cache local de imagens já baixadas.

---

## Users Inputs

| Parâmetro | Workflow | Tipo | Descrição |
|-----------|----------|------|-----------|
| `api_key` | Ambos | string | Chave de API Airbus |
| `user_input` | Ambos | geometry + time range | Região e período de interesse |

---

## System Outputs

### `airbus_download`

- **sink:** `raster` — Raster da imagem Airbus baixada.

### `airbus_price`

- **sink:** `price` — Preço agregado (em kB) para todas as imagens que intersectam a consulta.

---

## Outcomes Esperados

- Imagens disponíveis são identificadas, compradas (se necessário) e baixadas.
- Usuário pode decidir se vale a pena comprar baseado no preço.
- Dados geoespaciais prontos para uso em análises downstream.

---

## APIs

- **AirBus API (OneAtlas):** Requer `api_key`.
- **Endpoint:** `https://api.oneatlas.airbus.com/`
- **Operações:** `list_airbus_products`, `download_airbus`, `price_airbus_products`

---

## CRUD

| Operação | Workflow | Descrição |
|----------|----------|-----------|
| GET (list) | `airbus_download`, `airbus_price` | Lista produtos disponíveis |
| PURCHASE | `airbus_download` | Compra imagens não licenciadas |
| DOWNLOAD | `airbus_download` | Download dos produtos |
| PRICE | `airbus_price` | Consulta de preço |

---

## Bancos de Dados

- **Externo:** OneAtlas (Airbus) — catálogo de imagens.
- **Interno:** Assets locais (rasters GeoTIFF).

---

## Datasets e JSON Files

- **Lista de produtos:** JSON com metadados dos produtos disponíveis.
- **Preço:** Valor numérico em kB.

---

## Tabelas

N/A.

---

## Lógicas e Cálculos

- **Cálculo de preço:** Soma do custo (em kB) de todas as imagens que intersectam a geometria e período, **excluindo** imagens já na biblioteca do usuário.
- **Fluxo:** `list_airbus_products` → `airbus_products` → `download_airbus` (ou `price_airbus_products`).

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC, Minigeração | Imagens de alta resolução para identificação de telhados e áreas | Subsidia mapeamento de potencial fotovoltaico urbano e rural |
| Distribuição de Energia | Concessionárias | Inspeção visual de ativos de rede | Fornece imagens sub-métricas para fiscalização de infraestrutura |
| Óleo e Gás | Exploração, Transporte | Monitoramento ambiental de áreas de concessão | Imagens de alta resolução para detecção de mudanças |
| Geração Eólica | Onshore | Planejamento de parques eólicos | Imagens detalhadas para análise de terreno e uso do solo |
| Eficiência Energética | Estufas, Armazenamento | Monitoramento de estruturas agrícolas | Inspeção visual de estufas e armazéns |
