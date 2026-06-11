# PRD — DeepMC Notebook Utilities

## JTBDs (Jobs To Be Done)

1. **Baixar dados de previsão meteorológica de forma programática** — O usuário submete requisições de download de forecast para um worker remoto via `Forecast.submit_download_request()`, disparando workflows para cada tipo de parâmetro climático e monitorando a execução até conclusão.

2. **Limpar e estruturar dados forecast brutos** — O usuário consome CSVs retornados pelo worker, limpa o dataframe (remoção de colunas, parsing de datas, preenchimento de missing values via forward/backward fill e interpolação `from_derivatives`), e reorganiza os dados em séries temporais indexadas por data/hora.

3. **Converter dados forecast para formato tabular alignado por hora** — O usuário expande linhas de forecast agregadas em registros horários individuais, mescla com um range completo de datas esperadas (left join) e interpola descontinuidades, garantindo uma série temporal contínua e sem lacunas.

4. **Pré-processar séries temporais com transformada wavelet para inferência** — O usuário aplica `pywt.wavedec`/`pywt.waverec` com parâmetros configuráveis (wavelet, mode, level) para decompor o sinal de entrada em múltiplas bandas de frequência, alimentando o modelo ONNX com features no domínio wavelet.

5. **Executar inferência ONNX em lote com ensemble de 24 modelos** — O usuário carrega 24 modelos ONNX (um para cada hora de lookahead), executa predição sequencialmente, aplica pós-processamento com um segundo modelo ONNX, e inverte a normalização via `StandardScaler.inverse_transform` para obter predições na escala original.

6. **Calcular KPIs de acurácia entre valores reais e previstos** — O usuário invoca `calculate_KPI()` para obter RMSE, MAE e MAE% comparando arrays observados vs. preditos, validando a qualidade do forecast gerado.

7. **Preparar dados de treino com sliding window para deep learning** — O usuário utiliza `dl_preprocess_data()` no modo training para gerar pares (X, y) com janelas deslizantes de lookback/lookahead, com split opcional treino/validação, prontos para consumo por redes neurais.

8. **Fusão de dados observados com forecast (relevant mode)** — O usuário combina dados reais de estação com previsões meteorológicas externas (ex.: HRRR), alinha índices temporais, substitui NaN observados por valores forecast e gera features defasadas (shift) para alimentar o modelo com contexto adicional.

## Descrição do Módulo

Fornece utilitários de notebook para todo o pipeline DeepMC: download e limpeza de dados meteorológicos (`Forecast`), pré-processamento com wavelet (`Preprocess`), inferência ONNX com ensemble de 24 modelos (`InferenceWeather`), e funções auxiliares de ETL, normalização e cálculo de KPIs (`utils`). O módulo opera exclusivamente em ambiente Jupyter Notebook, assumindo display interativo (`IPython.display.clear_output`).

## Inputs

| Classe/Função | Parâmetros Principais |
|---|---|
| `Forecast.__init__` | `workflow_name: str`, `geometry: Point`, `time_range: Tuple[datetime, datetime]`, `parameters: List[Dict[str, str]]`, `date_column: str` |
| `Preprocess.__init__` | `train_scaler: StandardScaler`, `output_scaler: StandardScaler`, `is_training: bool`, `ts_lookahead: int (24)`, `ts_lookback: int (24)`, `chunk_size: int (528)`, `wavelet: str ("bior3.5")`, `mode: str ("periodic")`, `level: int (5)`, `relevant: bool` |
| `InferenceWeather.__init__` | `root_path: str`, `data_export_path: str`, `station_name: str`, `predicts: List[str]`, `total_models: int (24)`, `feed_interval_minutes: int (60)`, `chunk_size: int (528)`, `ts_lookback: int (24)`, `wavelet`, `mode`, `level`, `relevant: bool` |
| `get_csv_data()` | `path: str`, `date_attribute: str`, `columns_rename: Dict`, `frequency: str ("60min")`, `interpolate: bool`, `fill_na: bool` |
| `get_split_scaled_data()` | `data: pd.DataFrame`, `out_feature: str`, `split_ratio: float (0.92)` |
| `calculate_KPI()` | `y: NDArray`, `yhat: NDArray` |

## Outputs

| Função/Método | Retorno |
|---|---|
| `Forecast.get_downloaded_data()` | `pd.DataFrame` — séries temporais forecast indexadas por data/hora |
| `Forecast.clean_forecast_data()` | `pd.DataFrame` — dados forecast limpos, interpolados e com sufixo `_forecast` |
| `Preprocess.wavelet_transform_predict()` | `Tuple[NDArray, List, List]` — `test_X` (lista de arrays wavelet), `t_x_dates`, `t_y_dates` |
| `Preprocess.dl_preprocess_data()` | `Tuple[NDArray, Optional[NDArray], Optional[NDArray], Optional[NDArray], Optional[NDArray]]` — X, y, splits treino/teste, dates |
| `InferenceWeather.inference()` | `pd.DataFrame` — predições para cada feature em `predicts` |
| `InferenceWeather.inference_historical()` | `pd.DataFrame` — predições históricas para intervalo `start_datetime`–`end_datetime` |
| `get_csv_data()` | `pd.DataFrame` — dados lidos, interpolados e reamostrados por frequência |
| `get_split_scaled_data()` | `Tuple[StandardScaler, StandardScaler, pd.DataFrame, pd.DataFrame]` — scalers e dados escalados de treino/teste |
| `convert_forecast_data()` | `pd.DataFrame` — temperatura convertida de K para °F, vento calculado de componentes u/v |
| `clean_relevant_data()` | `pd.DataFrame` — fusão de dados observados com forecast, features defasadas inclusas |
| `clean_relevant_data_using_hrrr()` | `pd.DataFrame` — mesma fusão, mas usando HRRR para substituir NaN observados |

## Lógicas e Cálculos

- **Download e monitoramento**: `Forecast.submit_download_request()` itera sobre `parameters`, cria uma run por `weather_type`, coleta IDs e monitora execução via `client.monitor()`. `get_run_status()` bloqueia até que todas as runs atinjam status `"done"`, lançando exceção em caso de falha.

- **Limpeza de forecast**: `clean_forecast_data()` remove a coluna de data, reorganiza valores em lista, explode em linhas horárias (`df.explode`), faz merge com um range de datas completo (`pd.date_range(start, end + 1d, freq="h")` via left join), define índice de data, converte tipos para `np.float32`, renomeia colunas com sufixo `_forecast`, e interpola missing values com `method="from_derivatives"`.

- **Transformada wavelet**: `convert_df_wavelet_input()` aplica `pywt.wavedec` com `level` níveis, depois reconstrói sinais parciais com `pywt.waverec` descartando componentes de alta frequência progressivamente. Gera `level + 1` canais de entrada (sinal original + reconstruções parciais). No modo `relevant`, concatena dados forecast ao final do vetor observado antes da decomposição.

- **Sliding window**: `dl_preprocess_data()` no modo training percorre os dados com stride 1, extraindo janelas de `ts_lookback` timesteps como X e `ts_lookahead` timesteps como y. No modo predict, apenas gera X com lookback, ignorando y.

- **Inferência ensemble**: `run_individual_predict()` itera `total_models` (24) vezes, cada iteração carrega um ONNX session diferente (`model_idx`), executa predição → pós-processamento → coleta saída. O resultado `post_yhat` é um array 3D `[batch, lookahead, total_models]`. Apenas a última posição temporal (`-1`) de cada modelo é extraída e concatenada para formar a série forecast de 24 horas. `output_scaler.inverse_transform()` reverte a normalização.

- **Inferência histórica**: `inference_historical()` percorre todo o intervalo solicitado, processando chunks de dados com `wavelet_transform_predict` e acumulando predições em um dataframe único, removendo colunas duplicadas ao final.

- **Cálculo de KPI**: `calculate_KPI()` usa `sklearn.metrics.mean_absolute_error` e `mean_squared_error(squared=False)` para RMSE, além do MAE% = `100 * sum(|y - yhat|) / sum(y)`.

- **Preparação de dados relevant**: `clean_relevant_data_using_hrrr()` substitui NaN em colunas observadas pelo valor forecast correspondente (mesmo timestamp e nome da feature com sufixo `_forecast`), depois anexa colunas forecast com sufixo `Current` e versões defasadas via `shift_index`, produzindo um dataset rico em features para o modelo.
