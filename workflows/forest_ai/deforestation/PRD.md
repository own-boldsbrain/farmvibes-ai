# PRD — Workflows `alos_trend_detection` e `ordinal_trend_detection`

## JTBDs (Jobs To Be Done)

- Detectar tendências de aumento ou diminuição de cobertura florestal ao longo do tempo em uma área de interesse.
- Aplicar o teste não-paramétrico de Cochran-Armitage para determinar significância estatística das tendências.

## Casos de Uso

1. **Monitoramento de desmatamento**: ONGs ambientais detectam áreas com perda florestal significativa ao longo dos anos usando dados ALOS PALSAR.
2. **Verificação de políticas públicas**: Governos avaliam se áreas de conservação estão tendo aumento ou diminuição de cobertura florestal.

## Faz / Não Faz

### ordinal_trend_detection

- **Faz**: Recodifica valores de pixel conforme mapeamento `from_values → to_values`.
- **Faz**: Recorta o raster para a geometria de interesse.
- **Faz**: Conta frequência de cada valor de pixel (tabela de contingência).
- **Faz**: Executa o teste de Cochran-Armitage para tendência ordinal.
- **Não Faz**: Não faz download de dados — espera rasters prontos.

### alos_trend_detection

- **Faz**: Compõe `alos_forest_extent_download_merge` + `ordinal_trend_detection`.
- **Faz**: Faz download dos mapas ALOS PALSAR 2.1 Forest/Non-Forest via Planetary Computer.
- **Faz**: Funde os mosaicos e aplica detecção de tendência.
- **Não Faz**: Não suporta outras fontes de dados além do ALOS PALSAR.

## Users Inputs

### ordinal_trend_detection

| Parâmetro        | Tipo     | Default | Descrição                               |
| ---------------- | -------- | ------- | --------------------------------------- |
| `raster`         | Raster   | —       | Raster ordinal a ser processado         |
| `input_geometry` | Geometry | —       | Geometria de referência                 |
| `from_values`    | list     | []      | Valores originais a serem recodificados |
| `to_values`      | list     | []      | Novos valores após recodificação        |

### alos_trend_detection

| Parâmetro     | Tipo     | Default     | Descrição                                               |
| ------------- | -------- | ----------- | ------------------------------------------------------- |
| `user_input`  | Geometry | —           | Geometria e intervalo de tempo                          |
| `pc_key`      | string   | —           | Chave de API do Planetary Computer                      |
| `from_values` | list     | [4,3,0,2,1] | Valores ALOS originais                                  |
| `to_values`   | list     | [0,0,0,1,1] | Valores para recodificação (0=não-floresta, 1=floresta) |

## System Outputs

### ordinal_trend_detection

| Sumidouro           | Tipo   | Descrição                             |
| ------------------- | ------ | ------------------------------------- |
| `recoded_raster`    | Raster | Raster com valores recodificados      |
| `clipped_raster`    | Raster | Raster recortado para a geometria     |
| `trend_test_result` | struct | Resultado do teste: p-valor e z-score |

### alos_trend_detection

| Sumidouro            | Tipo   | Descrição                             |
| -------------------- | ------ | ------------------------------------- |
| `merged_raster`      | Raster | Mosaico fundido do ALOS               |
| `categorical_raster` | Raster | Raster categórico antes da fusão      |
| `recoded_raster`     | Raster | Raster recodificado                   |
| `clipped_raster`     | Raster | Raster recortado                      |
| `trend_test_result`  | struct | Resultado do teste: p-valor e z-score |

## Outcomes Esperados

- O teste retorna p-valor e z-score.
- **Hipótese nula (H₀)**: Não há tendência nos níveis de pixel ao longo dos anos.
- **Hipótese alternativa (H₁)**: Há tendência.
  - Se `p-valor < α` (ex.: 0.05), rejeita-se H₀.
  - `z-score > 0` → tendência de aumento (reflorestamento/regeneração).
  - `z-score < 0` → tendência de diminuição (desmatamento/degradacão).

## APIs

- **Ops internas**: `recode_raster` (ordinal_trend_detection), `compute_pixel_count`, `ordinal_trend_test`
- **Workflows filhos**: `data_ingestion/alos/alos_forest_extent_download_merge`, `data_processing/clip/clip`
- **Fonte externa**: Planetary Computer (Microsoft) para ALOS PALSAR 2.1

## CRUD

- **Create**: Submeter `alos_trend_detection` ou `ordinal_trend_detection`.
- **Read**: Todos os sinks listados.

## Bancos de Dados

Nenhum local. Dados obtidos via Planetary Computer API.

## Datasets e JSON Files

- **ALOS PALSAR 2.1 Forest/Non-Forest Map**: Dataset global hospedado no Planetary Computer.
  - Resolução: ~25m.
  - Valores: 0=water, 1=non-forest, 2=forest, 3=non-forest (seasonal), 4=forest (seasonal) — configurável via `from_values`.

## Tabelas

**Tabela de contingência de frequência de pixels** (gerada internamente):

| Valor do pixel (recodificado) | Ano 1 | Ano 2 | ... | Ano N |
| ----------------------------- | ----- | ----- | --- | ----- |
| 0 (não-floresta)              | count | count | ... | count |
| 1 (floresta)                  | count | count | ... | count |

## Lógicas e Cálculos

### ordinal_trend_detection

1. `recode_raster` — Mapeia valores de pixel conforme `from_values → to_values`.
   - Ex.: ALOS original [4,3,0,2,1] → recodificado [0,0,0,1,1] (non-forest vs forest).
2. `clip` (sub-workflow) — Recorta o raster recodificado para `input_geometry`.
3. `compute_pixel_count` — Conta ocorrências de cada valor único de pixel por raster/data.
4. `ordinal_trend_test` — Teste de Cochran-Armitage:
   - Entrada: tabela de contingência N×K (N anos, K categorias ordinais).
   - Estatística: `z = (Σᵢ Σⱼ wⱼ (Oᵢⱼ - Eᵢⱼ)) / sqrt(Var)`
     onde `wⱼ` são pesos ordinais (escores de coluna), `Oᵢⱼ` são frequências observadas, `Eᵢⱼ` são frequências esperadas sob independência.
   - Saída: `{"p_value": float, "z_score": float}`.

### alos_trend_detection

1. `alos_forest_extent_download_merge`:
   - Download dos tiles ALOS PALSAR 2.1 via Planetary Computer.
   - Merge dos tiles em mosaico.
2. `ordinal_trend_detection` — Aplica recodificação, clip, contagem e teste conforme acima.

## Deforestation (Trend Detection) — Perfis Energéticos

| Perfil (Classe)       | Subclasse              | Aplicação do Workflow                                                                    | Valor Gerado                                                                 |
| --------------------- | ---------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Mercado de Carbono    | REDD+, Reflorestamento | Detecta tendência de perda ou ganho de cobertura florestal com significância estatística | Subsidia linha de base, MRV e quantificação de créditos de carbono florestal |
| Biomassa / Bioenergia | Floresta energética    | Monitora tendência de cobertura florestal para avaliação de sustentabilidade de biomassa | Verifica conformidade com critérios ESG de fornecimento de bioenergia        |
| Hidrelétrica          | UHE, PCH               | Avalia tendência de desmatamento em bacias hidrográficas a montante de reservatórios     | Estima risco de assoreamento e perda de capacidade de geração                |
| Eficiência Energética | Armazenamento          | Detecta tendência de supressão vegetal em áreas de proteção de mananciais                | Suporta programas de Pagamento por Serviços Ambientais (PSA)                 |
| Óleo e Gás            | Exploração             | Monitora abertura de clareiras e estradas associadas a atividades de exploração          | Apoia fiscalização ambiental e licenciamento de poços de petróleo e gás      |
