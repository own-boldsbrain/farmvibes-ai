# PRD — Workflow `raster_gradient`

## JTBDs (Jobs To Be Done)
- Calcular o gradiente espacial de cada banda de um raster para identificar bordas e transições em imagens de satélite.

## Casos de Uso
1. **Detecção de bordas**: Identificar limites entre diferentes tipos de cobertura do solo.
2. **Realce de feições**: Utilizar o gradiente como entrada para modelos de segmentação ou classificação.

## Faz / Não Faz
- **Faz**: Calcula o gradiente de cada banda do raster usando o operador Sobel.
- **Faz**: Gera um raster multibanda com as magnitudes dos gradientes.
- **Não Faz**: Não realiza pós-processamento como limiarização ou detecção de contornos.
- **Não Faz**: Não altera o raster original.

## Users Inputs
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `raster` | Raster | Raster de entrada (multibanda) |

## System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `gradient` | Raster | Raster com os gradientes calculados para cada banda |

## Outcomes Esperados
- Para cada banda de entrada, uma banda de gradiente é produzida.
- O gradiente é calculado via convolução com os kernels Sobel horizontal e vertical.
- A saída pode ser usada downstream para detecção de bordas ou como feature.

## APIs
- **Op interna**: `compute_raster_gradient`
- **Submissão**: `farmvibes-ai run raster_gradient`

## CRUD
- **Create**: Submeter workflow.
- **Read**: Sink `gradient`.

## Bancos de Dados
Nenhum.

## Datasets e JSON Files
Nenhum.

## Tabelas
Nenhuma.

## Lógicas e Cálculos
1. `compute_raster_gradient` — Para cada banda do raster de entrada:
   - Aplica o kernel Sobel 3×3 no eixo X: `Gx = [[-1,0,1],[-2,0,2],[-1,0,1]]`
   - Aplica o kernel Sobel 3×3 no eixo Y: `Gy = [[-1,-2,-1],[0,0,0],[1,2,1]]`
   - Magnitude do gradiente: `G = sqrt(Gx² + Gy²)`
2. Retorna raster multibanda com as magnitudes.

## Raster Gradient — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar Fotovoltaica | GC, GD | Detecta bordas de painéis solares e limites de usinas para contagem de módulos | Subsidia inventário automatizado de capacidade instalada |
| Distribuição de Energia | Concessionárias | Identifica bordas de vegetação avançando sobre faixas de servidão de linhas de transmissão | Alerta para poda programada com base na detecção de bordas |
| Óleo e Gás | Exploração, Transporte | Realça feições lineares de dutos e estradas de acesso para monitoramento de faixa | Permite detecção de movimentação de solo ou abertura de novas vias |
| Eficiência Energética | Irrigação | Detecta limites de pivôs centrais e sistemas de irrigação para mapeamento de áreas irrigadas | Auxilia na gestão hídrica por talhão |
| Eólico | Onshore | Identifica sombras de turbinas e acessos em parques eólicos via gradiente espectral | Suporta análise de sombreamento e planejamento de manutenção |
