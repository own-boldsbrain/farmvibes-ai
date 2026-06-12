# JTBDs (ghg_fluxes)

## JTBDs

1. Calcular emissões e sequestro de gases de efeito estufa (GEE) para uma cultura
2. Avaliar cenários de práticas agrícolas e seu impacto nas emissões
3. Gerar relatórios nos Escopos 1 e 3 do GHG Protocol
4. Exportar dados para Microsoft Sustainability Manager

## Descrição

Notebook que calcula fluxos de gases de efeito estufa (CO₂ equivalente) para uma cultura em local e período específicos, seguindo o GHG Protocol Agricultural Guidance. O usuário define geometria, cultura, práticas de preparo do solo, fertilizantes, combustível e transporte. O workflow retorna emissões e sequestro, com saída formatada para Excel e integração com Microsoft Sustainability Manager.

## Use Cases

1. **Relatório ESG**: Uma empresa agroindustrial calcula emissões Escopo 1 e 3 para relatório de sustentabilidade anual.
2. **Compliance**: Um exportador agrícola quantifica pegada de carbono para atender exigências regulatórias internacionais.
3. **Integração MS Sustainability Manager**: Um analista ambiental exporta dados diretamente para o Microsoft Sustainability Manager.

## Faz / Não Faz

- **Faz**: Cálculo de emissões e sequestro de GEE por cultura.
- **Faz**: Suporte a Escopos 1 e 3 do GHG Protocol.
- **Faz**: Geração de planilhas Excel formatadas.
- **Faz**: Exportação para Microsoft Sustainability Manager.
- **Não Faz**: Não calcula emissões de escopo 2.
- **Não Faz**: Não considera culturas múltiplas simultâneas.

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

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `crop_type` | string | Tipo de cultura |
| `tillage_practices` | string | Práticas de preparo do solo |
| `fertilizer_type` | string | Tipo de fertilizante |
| `fertilizer_amount` | float | Quantidade de fertilizante |
| `fuel_amount` | float | Combustível usado em operações |

## Lógicas / Cálculos

1. Definição de geometria, cultura, práticas de preparo do solo (tillage), fertilizantes (tipo, quantidade, método), combustível (interno + transporte).
2. Submissão ao workflow `green_house_gas_fluxes` que implementa GHG Protocol Agricultural Guidance.
3. Cálculo de emissões Escopo 1 (combustão direta, fermentação entérica, solos) e Escopo 3 (cadeia de fornecedores).
4. Formatação para Excel e Microsoft Sustainability Manager.

## Outcomes Esperados

- Relatório de fluxos de GEE em CO₂ equivalente.
- Dados segregados por escopo (1 e 3) e por fonte (solo, fertilizante, combustível).
- Exportação direta para Microsoft Sustainability Manager.

## APIs / Conectores

- **Microsoft Sustainability Manager**: Exportação de dados de emissões.
- **GHG Protocol Agricultural Guidance**: Metodologia de cálculo.

## Datasets / Fontes de Dados

- Dados de entrada fornecidos pelo usuário (cultura, práticas, fertilizantes, combustível).
- Fatores de emissão do GHG Protocol Agricultural Guidance.

## Workflows Utilizados

- green_house_gas_fluxes
