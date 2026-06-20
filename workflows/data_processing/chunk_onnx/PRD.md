# PRD — Workflows `chunk_onnx` e `chunk_onnx_sequence`

## JTBDs (Jobs To Be Done)

- Aplicar um modelo ONNX sobre uma série temporal de rasters sem exceder a memória disponível.
- Processamento paralelo de grandes coleções de imagens de satélite dividindo-as espacialmente em blocos (chunks).

## Casos de Uso

1. **Análise de séries temporais**: Um cientista de dados aplica um modelo ONNX treinado (ex.: detecção de ciclos de cultura) sobre uma lista de rasters que cobrem múltiplas datas.
2. **Processamento em lote**: Um engenheiro de ML executa inferência ONNX sobre grandes áreas geográficas sem estourar recursos de memória.

## Faz / Não Faz

- **Faz**: Divide rasters em chunks espaciais que abrangem todas as bandas temporais.
- **Faz**: Aplica modelo ONNX em cada chunk em paralelo.
- **Faz**: Recombina os chunks processados em um único raster de saída.
- **Faz**: Aceita uma lista de rasters (`chunk_onnx`) ou uma sequência de rasters (`chunk_onnx_sequence`).
- **Não Faz**: Não treina modelos ONNX.
- **Não Faz**: Não faz download de dados — espera rasters já disponíveis no cluster.

## Users Inputs

### chunk_onnx.yaml

| Parâmetro    | Tipo   | Default | Descrição                                                             |
| ------------ | ------ | ------- | --------------------------------------------------------------------- |
| `rasters`    | list   | —       | Lista de rasters de entrada                                           |
| `model_file` | string | —       | Caminho para o modelo ONNX (deploy com `farmvibes-ai local add-onnx`) |
| `step`       | int    | 100     | Tamanho do chunk em pixels                                            |

### chunk_onnx_sequence.yaml

| Parâmetro    | Tipo   | Default | Descrição                   |
| ------------ | ------ | ------- | --------------------------- |
| `rasters`    | list   | —       | Lista de rasters de entrada |
| `model_file` | string | —       | Caminho para o modelo ONNX  |
| `step`       | int    | 100     | Tamanho do chunk em pixels  |

## System Outputs

| Sumidouro | Tipo   | Descrição                                 |
| --------- | ------ | ----------------------------------------- |
| `raster`  | Raster | Raster único resultado da inferência ONNX |

## Outcomes Esperados

- O modelo ONNX é aplicado a cada chunk e os resultados são combinados corretamente.
- O processamento não excede a memória disponível graças à divisão em chunks.
- O raster final mantém a extensão geográfica e resolução dos dados de entrada.

## APIs

- **Ops internas**: `chunk_raster`, `list_to_sequence`, `compute_onnx_from_chunks`, `combine_chunks`.
- **Submissão**: `farmvibes-ai run chunk_onnx` ou `farmvibes-ai run chunk_onnx_sequence`.

## CRUD

- **Create**: Submeter workflow com parâmetros.
- **Read**: Resultado via sink `raster`.
- **Update / Delete / Approve / Reject**: Não se aplica.

## Bancos de Dados

Nenhum. Dados transitórios em memória/armazenamento do cluster.

## Datasets e JSON Files

- Modelo ONNX deve ser registrado previamente no cluster via comando `add-onnx`.

## Tabelas

Nenhuma.

## Lógicas e Cálculos

### chunk_onnx

1. `chunk_raster` — Divide cada raster de entrada em tiles (step_x × step_y) que também abrangem todas as bandas temporais.
2. `list_to_sequence` — Converte a lista de rasters em sequência.
3. `compute_onnx_from_chunks` — Aplica o modelo ONNX a cada chunk usando `window_size = step`.
4. `combine_chunks` — Reagrupa todos os chunks processados em um único raster de saída.

### chunk_onnx_sequence

1. `chunk_sequence_raster` — Divide um raster de sequência em chunks.
2. `compute_onnx_from_chunks` — Inferência ONNX em cada chunk.
3. `combine_chunks` — Recombina os chunks.

- Diferença principal: `chunk_onnx_sequence` espera um raster de sequência (com múltiplas bandas temporais empilhadas), enquanto `chunk_onnx` recebe uma lista de rasters individuais e os converte internamente.

## Chunk ONNX — Perfis Energéticos

| Perfil (Classe)            | Subclasse                           | Aplicação do Workflow                                                          | Valor Gerado                                                                   |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Geração Solar Fotovoltaica | GD, GC                              | Aplica modelos ONNX de detecção de painéis solares em imagens de satélite      | Subsidia inventário de ativos solares e estimativa de capacidade instalada     |
| Geração Eólica             | Onshore, Offshore                   | Executa modelos de wake detection em imagens de radar para análise de turbinas | Permite monitoramento de desempenho e detecção de anomalias em parques eólicos |
| Biomassa / Bioenergia      | Cana-de-açúcar, Floresta energética | Aplica modelos ONNX de estimativa de biomassa a partir de índices espectrais   | Automatiza a predição de produtividade de bioenergia em larga escala           |
| Distribuição de Energia    | Concessionárias                     | Executa modelos de detecção de invasão de vegetação em faixas de servidão      | Reduz custos de inspeção de campo com inferência automatizada                  |
| Eficiência Energética      | Irrigação, Estufas                  | Aplica modelos ONNX de saúde de cultivo para manejo localizado de insumos      | Otimiza aplicação de água e fertilizantes em agricultura de precisão           |
