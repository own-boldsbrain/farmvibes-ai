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
