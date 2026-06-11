# PRD — Workflow `clip`

## JTBDs (Jobs To Be Done)
- Recortar um raster de entrada para a extensão geográfica exata de uma geometria de referência.
- Preparar dados de sensoriamento remoto para processamento subsequente restrito a uma área de interesse (AOI).

## Casos de Uso
1. **Recorte por talhão agrícola**: Um usuário fornece o perímetro de uma fazenda e recorta imagens de satélite para aquela área exata.
2. **Pré-processamento**: Um pipeline maior (ex.: `ordinal_trend_detection`, `heatmap`) utiliza `clip` como etapa interna para limitar a área de análise.

## Faz / Não Faz
- **Faz**: Calcula a interseção entre a geometria do raster de entrada e a geometria de referência.
- **Faz**: Copia o raster de entrada com metadados geométricos atualizados para a interseção.
- **Faz**: Suporta `hard_clip` (descarta dados fora da interseção) e `soft_clip` (apenas ajusta metadados).
- **Não Faz**: Não reprojeta o raster.
- **Não Faz**: Não altera resolução, bandas ou valores dos pixels.

## Users Inputs
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `raster` | Raster | — | Raster de entrada a ser recortado |
| `input_geometry` | Geometry | — | Geometria de referência (AOI) |
| `hard_clip` | bool | false | Se `true`, mantém apenas dados na interseção; senão, apenas ajusta metadados |

## System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `clipped_raster` | Raster | Raster recortado conforme a geometria de referência |

## Outcomes Esperados
- O raster de saída cobre exatamente a área de interseção.
- Erro é levantado se não houver interseção entre as geometrias.
- Com `hard_clip=true`, pixels fora da interseção são descartados; com `false`, apenas a máscara/geometria é ajustada.

## APIs
- **Op interna**: `clip_raster`
- **Workflows dependentes**: `ordinal_trend_detection`, `automatic_segmentation`, `prompt_segmentation`

## CRUD
- **Create**: Submeter `farmvibes-ai run clip`.
- **Read**: Sink `clipped_raster`.
- **Update / Delete / Approve / Reject**: Não se aplica.

## Bancos de Dados
Nenhum. Processamento puramente em memória/armazenamento do cluster.

## Datasets e JSON Files
Nenhum.

## Tabelas
Nenhuma.

## Lógicas e Cálculos
1. `clip_raster` — Recebe `raster` e `input_geometry`.
2. Calcula a geometria de interseção entre o bounding box/extensão do raster e `input_geometry`.
3. Se `hard_clip=true`, recorta fisicamente os pixels para a região de interseção.
4. Se `hard_clip=false`, apenas ajusta os metadados geométricos sem descartar pixels.
5. Lança erro se a interseção for vazia.

## Clip — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar Fotovoltaica | GD, GC | Recorta imagens de satélite para os limites de usinas solares para inspeção de ativos | Permite análise automatizada de painéis por planta sem processar áreas externas |
| Distribuição de Energia | Concessionárias | Recorta faixas de servidão para monitoramento de vegetação próximo a linhas de transmissão | Reduz área processada e foca análise no corredor crítico de ativos |
| Biomassa / Bioenergia | Cana-de-açúcar | Recorta imagens para limites de talhões agrícolas para estimativa de produtividade | Prepara dados específicos por gleba para modelos de biomassa |
| Hidrelétrica | PCH, CGH | Recorta áreas de reservatório para monitoramento de lâmina d'água e assoreamento | Subsidia operação hidrológica com dados restritos ao espelho d'água |
| Mercado de Carbono | REDD+ | Recorta área de projeto florestal para MRV de carbono | Garante que análises fiquem restritas ao perímetro do projeto de carbono |
