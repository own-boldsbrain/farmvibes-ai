# JTBDs (ghg_fluxes)

## JTBDs
1. Calcular emissões e sequestro de gases de efeito estufa (GEE) para uma cultura
2. Avaliar cenários de práticas agrícolas e seu impacto nas emissões
3. Gerar relatórios nos Escopos 1 e 3 do GHG Protocol
4. Exportar dados para Microsoft Sustainability Manager

## Descrição
Notebook que calcula fluxos de gases de efeito estufa (CO₂ equivalente) para uma cultura em local e período específicos, seguindo o GHG Protocol Agricultural Guidance. O usuário define geometria, cultura, práticas de preparo do solo, fertilizantes, combustível e transporte. O workflow retorna emissões e sequestro, com saída formatada para Excel e integração com Microsoft Sustainability Manager.

## Notebooks
- ghg_fluxes.ipynb: Cálculo de fluxos de GEE para culturas agrícolas

## Inputs
- Geometria da fazenda
- Período de análise
- Dados da cultura (tipo, nome)
- Práticas de preparo do solo (tillage)
- Fertilizantes (tipo, quantidade, método)
- Combustível usado em operações internas e transporte

## Outputs
- Fluxos de GEE (CO₂ equivalente) por escopo (1 e 3)
- Planilhas Excel para relatório
- Dados formatados para Microsoft Sustainability Manager

## Workflows Utilizados
- green_house_gas_fluxes
