# PRD — SpaceEye

## JTBDs

1. **Executar inferência do modelo SpaceEye em chips extraídos de rasters** — Dividir a região de interesse (RoI) em chips bidimensionais + temporais, processar cada chip no modelo ONNX e salvar as predições em disco sem carregar o raster inteiro em memória.

2. **Fornecer dados Sentinel-1 e Sentinel-2 normalizados como entrada para o modelo** — Ler janelas dos rasters S1 e S2, aplicar normalização (divisão por fator de quantificação, padronização S1), mascarar nuvens e montar tensores diários no formato `(C, T, H, W)`.

3. **Calcular e normalizar a iluminância multi-espectral para remover efeitos de iluminação** — Extrair a iluminância média por banda a partir de pixels sem nuvens, interpolar dias sem dado e dividir as bandas S2 pela iluminância para obter reflectância equivalente a albedo.

4. **Interpolar dados de sensoriamento remoto com DampedInterpolation (SpaceEye)** — Preencher lacunas temporais (dias com nuvem) minimizando uma função objetivo que equilibra fidelidade aos dados observados e suavidade temporal (regularização por diferenças finitas).

5. **Mascarar nuvens e controlar qualidade dos dados de entrada** — Usar cloud masks S2 para marcar pixels inválidos, descartar chips com pouca área livre de nuvens (`min_clear_ratio`) e propagar a máscara de nodata ao longo do pipeline.

6. **Montar predições parciais de volta em rasters completos** — Escrever cada chip de saída no local correto do arquivo GeoTIFF de destino, gerenciando sobreposição entre chips adjacentes e slices temporais.

7. **Gerenciar memória com leitura sob demanda e cache** — `ChipDataset` carrega dados apenas para a janela solicitada via `DataLoader` PyTorch. `InMemoryReader` faz cache do raster completo em RAM para acesso repetido sem I/O de disco (com downsampling opcional).

8. **Suportar múltiplos datasets empilhados por canais** — `StackOnChannelsChipDataset` coordena vários `ChipDataset` (ex.: S1 e S2) e concatena os dados e máscaras ao longo do eixo de canais, validando compatibilidade geométrica.

## Descrição do Módulo

Pipeline de inferência do modelo SpaceEye: carrega chips de rasters Sentinel-1 e Sentinel-2, aplica normalização espectral e de iluminância, mascara nuvens, executa modelo ONNX via DataLoader PyTorch e salva predições em disco. Inclui algoritmo de interpolação temporal DampedInterpolation para preenchimento de lacunas.

## Inputs

| Classe / Função | Parâmetros |
|---|---|
| `SpaceEyeReader.__init__` | `s1_items`, `s2_items: Sentinel2RasterTileSequence`, `cloud_masks: Sentinel2CloudMaskTileSequence`, `time_range: Tuple[datetime, datetime]`, `geometry: BaseGeometry`, `chip_size: Dims`, `overlap: Tuple[float, float, float]`, `s2_bands: List[int]`, `min_clear_ratio: float`, `normalize_illuminance: bool` |
| `ChipDataset.__init__` | `rasters: List[Raster]`, `chip_size: Dims`, `step_size: Dims`, `downsampling`, `nodata`, `geometry_or_chunk`, `reader`, `dtype` |
| `StackOnChannelsChipDataset.__init__` | `rasters: List[List[Raster]]`, `chip_size`, `step_size`, `downsampling`, `nodata`, `geometry_or_chunk`, `reader` |
| `InMemoryReader.__init__` | `downsampling: int` |
| `DampedInterpolation.__init__` | `num_bands: int`, `time_window: int`, `damping_factor`, `tol`, `max_iter`, `check_interval` |
| `predict_chips` | `model: ort.InferenceSession`, `dataloader: DataLoader`, `out_dir: str`, `skip_nodata: bool`, `pre_process`, `post_process` |
| `get_loader` | `dataset: ChipDataset`, `batch_size: int`, `num_workers`, `collate_fn` |
| `extract_illuminance` | `x: NDArray (C x T x H x W)`, `mask: NDArray` |
| `interpolate_illuminance` | `illuminance: NDArray (C x T x 1 x 1)`, `mask: NDArray`, `lambda_t: float` |

## Outputs

| Classe / Função | Retorno |
|---|---|
| `SpaceEyeReader.__getitem__` | `chip_data: Dict[str, NDArray]` com chaves `"S2"`, `"cloud_label"`, `"illuminance"`, opcionalmente `"S1"`, `"S1_mask"` + `write_info: Dict` |
| `ChipDataset.__getitem__` | `Tuple[NDArray, NDArray, Dict]` — `(data, mask, write_info)` |
| `StackOnChannelsChipDataset.__getitem__` | `Tuple[NDArray, NDArray, Dict]` — dados concatenados por canal |
| `predict_chips` | `List[str]` — caminhos dos arquivos de saída |
| `get_loader` | `DataLoader` configurado |
| `DampedInterpolation.forward` | `Tensor` — shape `(B, C, T, H, W)` interpolado |
| `extract_illuminance` | `Tuple[albedo, illuminance]` — `(CxTxHxW, CxTx1x1)` |
| `interpolate_illuminance` | `NDArray (C x T x 1 x 1)` — iluminância interpolada |

## Lógicas e Cálculos

1. **Geração de janelas de leitura/escrita** (`get_read_windows` / `get_write_windows`): Divide `width × height × time` em chips com `step = chip_size * (1 - overlap)`. `get_read_intervals` usa `linspace` para distribuir janelas com cobertura total. `get_write_intervals` calcula bordas de divisão no ponto médio entre janelas adjacentes para evitar sobreposição na escrita.

2. **Leitura de dados S2**: `SpaceEyeReader._read_s2` lê bandas selecionadas, divide por `QUANTIFICATION_VALUE = 10000`, calcula `nodata = soma(bandas) == 0`, lê cloud mask e converte: `1 → 2` (nuvem), `0 → 1` (limpo), `nodata → 2`.

3. **Leitura de dados S1**: `_read_s1` lê todas as bandas, detecta disponibilidade por `sum(abs) > 0`, normaliza com `(s1 + 20) / 40` e zera pixels indisponíveis.

4. **Montagem do tensor temporal**: `_get_data_array` aloca tensor `(C, T, H, W)` zerado, insere cada asset no índice de tempo correspondente (`index - read_start`). Se nenhum asset cair no intervalo, lança `RuntimeError`.

5. **Normalização de iluminância**: Em `__getitem__`, divide `S2_data` por `chip_illuminance + EPS` (expansão de broadcasting). A iluminância é pré-computada em `_get_illumination_array`.

6. **Cálculo de iluminância** (`masked_average_illuminance`): Soma ponderada de `x * mask` sobre eixos espaciais dividida pela soma da máscara. Resultado: `(C, T, 1, 1)`.

7. **Interpolação de iluminância** (`interpolate_illuminance`): Gera matriz de pesos exponenciais `exp(-lambda_t * |delta_t|)`. Faz `weight @ illuminance.reshape(C, T, -1) / weight @ mask.reshape(1, T, -1)`. Retorna `weighted * (1 - mask) + original * mask`.

8. **Extração relativa de iluminância** (`extract_illuminance_relative`): Encontra imagem âncora (maior % de pixels limpos), calcula iluminância relativa entre pares com sobreposição suficiente (`ratio_mask > MIN_OVERLAP`), usa método simples como fallback, interpola o resultado final.

9. **DampedInterpolation**: Minimiza `|| (X - S2) * M ||² + alpha || Delta * X ||²`. Pré-computa a inversa de `(I + alpha * Delta^T * Delta)`. Iteração: `X ← W @ (M * S2) + W @ ((1-M) * X)`. Critério de parada: variação relativa média < `tol`. Rearranja com `einops` entre shapes `(B, C, T, H, W)` e `(T, B*C*H*W)`.

10. **Pipeline de predição** (`predict_chips`): Para cada batch: se todo o chip é nodata e `skip_nodata=True`, executa modelo uma vez para obter output shape e preenche com nodata; senão, aplica `pre_process`, executa ONNX session, aplica `post_process`, chama `write_prediction_to_file`.

11. **Escrita de predições** (`write_prediction_to_file`): Para cada amostra no batch, recorta o slice temporal/espacial correspondente (`chip_slices`), combina máscara com `any(axis=0)`, e escreve no GeoTIFF via `write_window_to_file`.
