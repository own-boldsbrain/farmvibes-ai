# JTBDs (compute_ghg_fluxes)

## JTBDs

1. Calcular emissões de gases de efeito estufa por cultura
2. Reportar CO₂, N₂O e CH₄ por escopo (1, 2, 3) segundo IPCC

## Descrição

Calcula fluxos de GEE baseado no protocolo GHG, usando fatores de emissão IPCC por tipo de cultura, fertilizante, combustível, mudança de uso da terra e queima de biomassa.

## Inputs

- `ghg: GHGProtocolVibe` — dados do protocolo (área, insumos, etc.)
- Parâmetro: `crop_type` (soybean, corn, etc.)

## Outputs

- `fluxes: List[GHGFlux]` — lista de fluxos com valor CO₂-eq por fonte

## Lógicas e Cálculos

- Identifica país via geometria para fatores de energia e mistura gasolina
- Calcula área em hectares a partir da geometria
- Emissões calculadas: combustível (escopo 1/3), fertilizantes (ureia, calcário, etc.), lixiviação, volatilização, decomposição de resíduos, queima de biomassa, captura de carbono (adubo verde), mudança de uso da terra
- Converte N₂O e CH₄ para CO₂-eq (GWP: 298 e 25)

## Use Cases
1. **Análise de Ghg Fluxes**: Gerar camada derivada de Ghg Fluxes para interpretação.
2. **Feature engineering**: Produzir insumos para modelos de machine learning.
3. **Monitoramento temporal**: Calcular o índice/variável para múltiplas datas e comparar.

## Faz / Não Faz

- **Faz**: Cálculo da variável/algoritmo sobre os dados de entrada.
- **Faz**: Parametrização configurável pelo usuário.
- **Não Faz**: Não valida os resultados contra dados de campo/ground truth.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `ghg: GHGProtocolVibe` | — | Conforme especificação da operação |
| `crop_type` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `compute_ghg_fluxes` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **Raster de entrada**: Fornecido pelo usuário ou por operação upstream.

