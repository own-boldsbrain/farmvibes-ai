# PRD — Workflow `detect_outlier`

## JTBDs (Jobs To Be Done)
- Identificar pixels anômalos (outliers) em imagens de sensoriamento remoto com base na verossimilhança estatística.
- Segmentar regiões de alta e baixa probabilidade em relação a um modelo de mistura Gaussiana.

## Casos de Uso
1. **Detecção de nuvens/sombras**: Identificar pixels com assinatura espectral atípica em relação ao restante da cena.
2. **Controle de qualidade**: Sinalizar regiões com dados corrompidos ou artefatos de sensor.

## Faz / Não Faz
- **Faz**: Ajusta um Modelo de Mistura Gaussiana (GMM) de um único componente sobre os dados de entrada.
- **Faz**: Calcula mapas de verossimilhança, segmentação, outliers e médias.
- **Faz**: Aplica um threshold de verossimilhança para classificar outliers.
- **Não Faz**: Não suporta múltiplos componentes no GMM.
- **Não Faz**: Não remove automaticamente os outliers — apenas identifica.

## Users Inputs
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `rasters` | list | Lista de rasters de entrada |
| `threshold` | float | Limiar de verossimilhança para considerar um pixel como outlier |

## System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `segmentation` | Raster | Mapa de segmentação baseado na verossimilhança |
| `heatmap` | Raster | Mapa de verossimilhança |
| `outliers` | Raster | Mapa binário de outliers (thresholded) |
| `mixture_means` | Raster | Média do componente GMM |

## Outcomes Esperados
- Os 4 sumidouros são preenchidos e permitem ao usuário identificar visualmente e quantitativamente regiões anômalas.
- O threshold controla a sensibilidade da detecção (menor threshold → mais pixels classificados como outliers).

## APIs
- **Op interna**: `detect_outliers`

## CRUD
- **Create**: Submeter `farmvibes-ai run detect_outlier`.
- **Read**: Sinks `segmentation`, `heatmap`, `outliers`, `mixture_means`.

## Bancos de Dados
Nenhum.

## Datasets e JSON Files
Nenhum.

## Tabelas
Nenhuma.

## Lógicas e Cálculos
1. `detect_outliers` — Para cada pixel ao longo dos rasters de entrada:
   - Ajusta um Gaussian Mixture Model (GMM) com um único componente.
   - Calcula a verossimilhança (likelihood) de cada amostra pertencer ao componente.
   - **Segmentação**: Mapa onde cada pixel recebe um label de cluster.
   - **Heatmap**: Mapa contínuo com o valor de likelihood.
   - **Outliers**: Mapa binário onde `likelihood < threshold` → outlier (1), senão → inlier (0).
   - **Mixture Means**: Mapa com a média do componente Gaussiano.
2. Estatística: GMM estima média (μ) e variância (σ²) dos dados. A verossimilhança é a PDF Gaussiana avaliada em cada ponto.

## Detect Outlier — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Distribuição de Energia | Concessionárias | Detecta pixels anômalos de vegetação crescendo sobre condutores em faixas de servidão | Alerta riscos de curto-circuito e queimadas por contato com vegetação |
| Geração Solar Fotovoltaica | GD, GC | Identifica sombras de nuvens e painéis sujos/defeituosos como outliers espectrais | Subsidia programa de manutenção e limpeza de módulos |
| Óleo e Gás | Transporte | Sinaliza anomalias espectrais em dutos (vazamentos, solo contaminado) | Suporta detecção precoce de vazamentos em oleodutos |
| Geração Eólica | Onshore | Detecta turbinas com assinatura térmica anômala em imagens termais | Apoia manutenção preditiva de ativos eólicos |
| Eficiência Energética | Armazenamento | Identifica anomalias em séries de NDVI que indicam falhas em sistemas de irrigação | Permite correção rápida de irrigação localizada |
