# PRD — Workflow `threshold_raster`

## JTBDs (Jobs To Be Done)
- Aplicar um limiar (threshold) simples a um raster, zerando valores abaixo do limiar e mantendo valores acima.

## Casos de Uso
1. **Filtragem de ruído**: Remover pixels com valores irrelevantes (ex.: NDVI < 0) antes de análise.
2. **Mascaramento**: Criar uma máscara binária onde apenas pixels acima do limiar são mantidos.

## Faz / Não Faz
- **Faz**: Aplica threshold valor-a-valor em todas as bandas do raster.
- **Faz**: Valores acima do threshold são mantidos; valores iguais ou abaixo são zerados (ou substituídos por nodata).
- **Não Faz**: Não suporta thresholds por banda diferentes.
- **Não Faz**: Não aplica operações morfológicas pós-threshold.

## Users Inputs
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `raster` | Raster | Raster de entrada |
| `threshold` | float | Valor de limiar |

## System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `thresholded_raster` | Raster | Raster limiarizado |

## Outcomes Esperados
- Todos os pixels com valor ≤ threshold são convertidos para 0 (ou nodata).
- Os pixels com valor > threshold mantêm seu valor original.
- A saída pode ser usada como máscara ou filtro para próximas etapas.

## APIs
- **Op interna**: `threshold_raster`

## CRUD
- **Create**: Submeter `farmvibes-ai run threshold_raster`.
- **Read**: Sink `thresholded_raster`.

## Bancos de Dados
Nenhum.

## Datasets e JSON Files
Nenhum.

## Tabelas
Nenhuma.

## Lógicas e Cálculos
1. `threshold_raster` — Para cada pixel em cada banda:
   - Se `pixel_value > threshold`: mantém o valor original.
   - Se `pixel_value <= threshold`: substitui por 0 (ou nodata).
2. O raster de saída mantém a mesma resolução, CRS e extensão do raster de entrada.

## Threshold Raster — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar Fotovoltaica | GD, GC | Limiariza NDVI para mascarar nuvens e vegetação em imagens para avaliação de recurso solar | Gera máscara de céu limpo para séries de irradiância |
| Biomassa / Bioenergia | Cana, Floresta | Threshold em NDVI para classificação binária vegetação/solo para estimativa de área cultivada | Produz mapas de área colhível para bioenergia |
| Hidrelétrica | UHE, PCH | Limiar em índices de água (NDWI) para delimitação de lâmina d'água de reservatórios | Subsidia monitoramento de volume de água em reservatórios |
| Mercado de Carbono | REDD+ | Threshold em dados de biomassa para classificação floresta/não-floresta em linhas de base | Agiliza delimitação de áreas elegíveis para créditos de carbono |
| Eficiência Energética | Irrigação | Threshold em NDMI para mapeamento de áreas irrigadas vs. sequeiro | Apoia gestão hídrica e planejamento de irrigação |
