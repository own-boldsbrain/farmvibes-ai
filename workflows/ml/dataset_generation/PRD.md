# PRD — Workflow `datagen_crop_segmentation`

## JTBDs (Jobs To Be Done)
- Gerar um dataset pareado de imagens NDVI (SpaceEye) e mapas de referência CDL (Crop Data Layer) para treinamento de modelos de segmentação de culturas.

## Casos de Uso
1. **Criação de dataset de treinamento**: Um engenheiro de ML gera pares (NDVI, CDL) para uma região e período específicos para treinar um modelo de segmentção de culturas.
2. **Aumento de dados**: Coletar dados de múltiplas regiões e anos para aumentar a diversidade do dataset de treinamento.

## Faz / Não Faz
- **Faz**: Gera dados SpaceEye (Sentinel-2 livre de nuvens) para a região e período.
- **Faz**: Calcula NDVI sobre os dados SpaceEye.
- **Faz**: Faz download dos mapas CDL (USDA Crop Data Layer) para os anos no intervalo.
- **Não Faz**: Não empilha bandas nem prepara tensores — apenas gera rasters NDVI e CDL.
- **Não Faz**: Não executa aumento de dados (data augmentation).
- **Não Faz**: Não funciona fora dos EUA (CDL só cobre território americano).

## Users Inputs
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `user_input` | Geometry | Geometria e intervalo de tempo |
| `pc_key` | string | Chave de API do Planetary Computer (opcional) |

## System Outputs
| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `ndvi` | Raster | Rasters NDVI gerados a partir do SpaceEye |
| `cdl` | Raster | Mapas CDL para os anos no intervalo de tempo |

## Outcomes Esperados
- Para cada data no intervalo, um raster NDVI é gerado.
- Para cada ano, o mapa CDL correspondente é baixado.
- O dataset pode ser usado para treinar um modelo de segmentação (ex.: `crop_segmentation`).

## APIs
- **Workflows filhos**: `data_ingestion/spaceeye/spaceeye_interpolation`, `data_processing/index/index`, `data_ingestion/cdl/download_cdl`
- **Fonte externa**: USDA CDL via CropScape/Crockett, Planetary Computer para Sentinel-2

## CRUD
- **Create**: Submeter `farmvibes-ai run datagen_crop_segmentation`.
- **Read**: Sinks `ndvi` e `cdl`.

## Bancos de Dados
Nenhum.

## Datasets e JSON Files
- **CDL (Crop Data Layer)**: Dataset anual do USDA com resolução de 30m, classificação de culturas para os EUA.
  - Valores: números inteiros representando tipos de cultura (1=corn, 5=soybeans, etc.).

## Tabelas
**Tabela conceitual do dataset gerado:**

| Data | NDVI raster | CDL raster (ano) |
|------|-------------|-------------------|
| 2023-06-01 | ndvi_20230601.tif | cdl_2023.tif |
| 2023-06-11 | ndvi_20230611.tif | cdl_2023.tif |
| ... | ... | ... |

## Lógicas e Cálculos
1. `spaceeye` (sub-workflow `spaceeye_interpolation`):
   - Baixa série Sentinel-2 para a região.
   - Interpola para remover nuvens (SpaceEye).
2. `ndvi` (sub-workflow `index`):
   - Calcula NDVI: `(NIR - Red) / (NIR + Red)`.
3. `cdl` (sub-workflow `download_cdl`):
   - Baixa o CDL para cada ano presente no intervalo de tempo.
   - O CDL serve como ground truth/labels para treinamento supervisionado.
- Os sinks `ndvi` e `cdl` são independentes (não há edge entre eles) — o pareamento é feito externamente pelo usuário.

---

## Perfis Energéticos

### Datagen Crop Segmentation — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Biomassa / Bioenergia | Cana-de-açúcar | Gera dataset NDVI+CDL pareado para treinar modelos de classificação de culturas energéticas | Subsidia desenvolvimento de modelos para monitoramento de biomassa |
| Mercado de Carbono | Agricultura de baixo carbono | Cria dados de treinamento (NDVI temporal + mapas de referência CDL) para segmentação agrícola | Permite automação de MRV com aprendizado de máquina |
| Geração Solar | GD, GC | Dataset de NDVI + classificação de culturas para treinar modelos de mapeamento de uso do solo | Apoia seleção automatizada de áreas para usinas solares |
| Eficiência Energética | Irrigação | NDVI temporal com ground truth CDL para treinar modelos de detecção de irrigação | Subsidia automação de agricultura de precisão |
| Comercialização de Energia | Comercializadores | Mapas de cultura (CDL) para previsão de oferta agrícola e biomassa | Alimenta modelos de projeção de bioenergia |
