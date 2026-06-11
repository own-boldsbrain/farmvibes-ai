# PRD — Dados Meteorológicos (Weather)

## Workflows
- `download_chirps.yaml` — Precipitação acumulada (CHIRPS)
- `download_era5.yaml` — Variáveis horárias ERA5 (Planetary Computer)
- `download_era5_monthly.yaml` — Variáveis mensais ERA5 (Copernicus CDS)
- `download_gridmet.yaml` — Propriedades meteorológicas diárias GridMET (EUA)
- `download_herbie.yaml` — Dados de previsão NWP (Herbie)
- `download_terraclimate.yaml` — Clima/hidroclima mensal TerraClimate
- `get_ambient_weather.yaml` — Dados de estação Ambient Weather
- `get_forecast.yaml` — Previsão GFS (NOAA)
- `herbie_forecast.yaml` — Previsão meteorológica via Herbie

---

## JTBDs (Jobs To Be Done)

1. **Baixar precipitação (CHIRPS)** — O usuário precisa de dados de precipitação acumulada (diária ou mensal).
2. **Baixar variáveis atmosféricas (ERA5)** — O usuário precisa de dados horários/mensais de temperatura, vento, pressão, radiação.
3. **Baixar dados meteorológicos diários (GridMET)** — O usuário precisa de dados diários para os EUA (4km).
4. **Baixar dados climáticos mensais (TerraClimate)** — O usuário precisa de dados mensais globais (1958–presente).
5. **Baixar previsões NWP (Herbie)** — O usuário precisa de previsões de modelos HRRR, RAP, GFS, etc.
6. **Obter dados de estação (Ambient Weather)** — O usuário precisa de dados reais de estação meteorológica.
7. **Obter previsão GFS (NOAA)** — O usuário precisa de previsão global de 13km.

---

## Casos de Uso

- **C1:** Agrônomo calcula balanço hídrico com CHIRPS.
- **C2:** Pesquisador modela evapotranspiração com ERA5.
- **C3:** Fazendeiro acompanha previsão GFS para planejar plantio.
- **C4:** Hidrólogo analisa secas com TerraClimate.
- **C5:** Engenheiro usa GridMET para modelo de crescimento de cultura.

---

## Faz / Não Faz

### Faz
- Baixar CHIRPS nas resoluções p05 (0.05°) e p25 (0.25°), diário ou mensal.
- Baixar ERA5 horário do Planetary Computer (várias variáveis).
- Baixar ERA5 mensal do Copernicus CDS (requer CDS API key).
- Baixar GridMET (EUA, 4km, diário, 1979–presente).
- Baixar TerraClimate (global, mensal, 1958–presente).
- Baixar previsões Herbie (HRRR, RAP, GFS, RRFS, ECMWF) em GRIB2.
- Conectar a estação Ambient Weather via REST API.
- Baixar previsão GFS do blob storage Planetary Computer.

### Não Faz
- Não faz downscaling ou correção de viés.
- Não gera variáveis derivadas (ex.: GDD, ETo).
- Não faz interpolação espacial.
- Não cobre fora dos EUA para GridMET.

---

## Users Inputs

### CHIRPS
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `freq` | string | "daily" ou "monthly" |
| `res` | string | "p05" ou "p25" |
| `user_input` | geometry + time range | Região e período |

### ERA5 (PC)
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `variable` | string | `2t`, `100u`, `100v`, `10u`, `10v`, `2d`, `mn2t`, `msl`, `mx2t`, `sp`, `ssrd`, `sst`, `tp` |
| `pc_key` | string | Chave Planetary Computer |

### ERA5 Monthly (CDS)
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `variable` | string | Mesmas variáveis ERA5 |
| `cds_api_key` | string | Chave Copernicus CDS |

### GridMET
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `variable` | string | `bi`, `erc`, `etr`, `fm100`, `fm1000`, `pet`, `pr`, `rmax`, `rmin`, `sph`, `srad`, `th`, `tmmn`, `tmmx`, `vpd`, `vs` |

### TerraClimate
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `variable` | string | `aet`, `def`, `pet`, `ppt`, `q`, `soil`, `srad`, `swe`, `tmax`, `tmin`, `vap`, `ws`, `vpd`, `PDSI` |

### Herbie
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `model` | string | `hrrr`, `hrrrak`, `rap`, `gfs`, `gfs_wave`, `rrfs` |
| `product` | string | `sfc`, `prs`, `nat`, `subh` |
| `frequency` | int | Frequência em horas |
| `forecast_lead_times` | list | [start, end, increment] em horas |
| `forecast_start_date` | string | Data limite para análise |
| `search_text` | regex | Expressão regular para filtrar camadas GRIB2 |

### Ambient Weather
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `api_key` | string | Chave API Ambient Weather |
| `app_key` | string | Chave Application |
| `limit` | int | Máx. pontos (-1 = sem limite) |
| `feed_interval` | string | Intervalo entre amostras |

### GFS Forecast
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `noaa_gfs_token` | string | SAS token para blob storage |

### Herbie Forecast
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `forecast_lead_times` | list | Range de lead times |
| `search_text` | regex | Filtro GRIB2 |
| `weather_type` | string | Nome da variável (ex.: "temperature") |
| `model` | string | Modelo NWP |
| `product` | string | Tipo de produto |
| `overwrite` | bool | Forçar redownload |

---

## System Outputs

| Workflow | Sink | Descrição |
|----------|------|-----------|
| `download_chirps` | `product` | TIFF com precipitação acumulada |
| `download_era5` | `downloaded_product` | Variável ERA5 horária 30km |
| `download_era5_monthly` | `downloaded_product` | Variável ERA5 mensal 30km |
| `download_gridmet` | `downloaded_product` | Variável GridMET por ano |
| `download_herbie` | `forecast` | Arquivo GRIB2 |
| `download_terraclimate` | `downloaded_product` | Variável TerraClimate por ano |
| `get_ambient_weather` | `weather` | Dados da estação |
| `get_forecast` | `forecast` | Previsão GFS |
| `herbie_forecast` | `weather_forecast` | Previsão limpa/interpolada/horária |
| `herbie_forecast` | `forecast_range` | Período da previsão |

---

## Outcomes Esperados

- Dados meteorológicos históricos e de previsão disponíveis como assets locais.
- Suporte a múltiplas fontes (CHIRPS, ERA5, GridMET, TerraClimate, GFS, HRRR, estações).
- Previsões interpoladas para horários regulares.

---

## APIs

| Fonte | API / Protocolo |
|-------|-----------------|
| CHIRPS | Download direto de arquivos GeoTIFF |
| ERA5 (PC) | Planetary Computer STAC API |
| ERA5 (CDS) | Copernicus Climate Data Store (CDS API) |
| GridMET | Climatology Lab HTTP |
| TerraClimate | Climatology Lab HTTP |
| Herbie | Pacote Python Herbie (nuvem GRIB2) |
| Ambient Weather | REST API (`api_key` + `app_key`) |
| NOAA GFS | Azure Blob Storage (SAS token) |

---

## CRUD

| Operação | Descrição |
|----------|-----------|
| GET (list) | Lista produtos disponíveis para cada dataset |
| GET (download) | Download dos dados |

---

## Bancos de Dados

- **Externo:** Planetary Computer, Copernicus CDS, Climatology Lab, NOAA, Ambient Weather.
- **Interno:** Rasters GeoTIFF, arquivos GRIB2, dados tabulares.

---

## Datasets e JSON Files

- **CHIRPS:** Precipitação global 0.05°/0.25°, 1981–presente.
- **ERA5:** Reanálise horária 30km, 1950–presente.
- **ERA5 Monthly:** Médias mensais 30km.
- **GridMET:** EUA 4km diário, 1979–presente.
- **TerraClimate:** Global 4km mensal, 1958–presente.
- **HRRR/GFS/RAP:** Previsões NWP em GRIB2.
- **Ambient Weather:** JSON de estações meteorológicas.

---

## Tabelas

| Workflow | Colunas |
|----------|---------|
| `get_ambient_weather` | Timestamp, temperatura, umidade, pressão, precipitação, vento (depende da estação) |
| `herbie_forecast` | Timestamp, `weather_type`, latitude, longitude, valor |
| `get_forecast` | Timestamp, variáveis GFS, coordenadas |

---

## Lógicas e Cálculos

- **GridMET / TerraClimate:** Listagem por ano → download de cada ano.
- **Herbie:** Usa regex `search_text` para filtrar camadas específicas do GRIB2.
- **Herbie Forecast:** `forecast_range_split` determina período de download → `forecast_weather` baixa + limpa + interpola + mapeia para cada hora.
- **GFS Forecast:** `gfs_preprocess` → `gfs_download` → `read_grib_forecast`.
- **Ambient Weather:** Busca dispositivo dentro da geometria; falha se não encontrar.
- **CHIRPS:** `freq` determina se lista diário ou mensal; `res` define resolução.
- **ERA5 Monthly (CDS):** Requer chave do Copernicus CDS (diferente do Planetary Computer).

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Hidrelétrica | UHE, PCH, CGH | Precipitação (CHIRPS, ERA5, GridMET, TerraClimate) | Dados de recursos hídricos para potencial hidrelétrico |
| Geração Eólica | Onshore, Offshore | Velocidade e direção do vento (ERA5, GFS, HRRR) | Subsidia prospecção eólica e previsão de geração |
| Geração Solar | GD, GC | Radiação solar (ERA5 ssrd) e cobertura | Histórico de irradiância para potencial fotovoltaico |
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | Precipitação, temperatura e balanço hídrico | Condições climáticas para produtividade de culturas |
| Comercialização de Energia | Comercializadores, Consumidores Livres | Previsão meteorológica (GFS, HRRR, Herbie) | Previsão de geração e carga para operação do mercado |
| Eficiência Energética | Irrigação | Evapotranspiração (GridMET pet, ERA5) | Demanda hídrica para planejamento de irrigação |
