# PRD — `vibe_core.testing`

## 1. JTBD (Jobs To Be Done)

| # | Job | Ator | Motivação | Critério de sucesso |
|---|-----|------|-----------|---------------------|
| 1 | **Comparar dois objetos `DataVibe` estruturamente** | Desenvolvedor de operações | Garantir que o output de uma operação tem mesmos tipos, campos e geometria que o esperado | `assert_all_close` levanta exceção se tipos diferirem ou campos não baterem |
| 2 | **Comparar campos específicos de `DataVibe` ignorando metadados voláteis** | Desenvolvedor de testes | Validar apenas campos semânticos (geometria, time_range) ignorando `id` e `assets` | `assert_all_fields_close` aceita lista de campos a ignorar e falha apenas nos campos relevantes |
| 3 | **Validar equivalência de geometria com tolerância numérica** | Desenvolvedor de operações geoespaciais | Comparar polígonos/points que podem sofrer pequenas variações numéricas | `shpg.shape.equals_exact(..., SHAPE_TOL)` aprova geometrias dentro de 1e-6 |
| 4 | **Comparar rasters TIFF pixel a pixel com tolerância** | Desenvolvedor de sensoriamento remoto | Assegurar que dois rasters de saída são equivalentes (valores de pixel + metadados) | `np.allclose` com `rtol=1e-5`, `atol=1e-8` e `equal_nan=True` + checagem de `meta` |
| 5 | **Comparar rasters TIFF diretamente por caminho (output de teste)** | Desenvolvedor de testes de regressão | Verificar que um raster gerado num teste equivale a um raster de referência salvo em disco | `ensure_equal_output_images` lê ambos os arquivos e compara arrays + profiles |
| 6 | **Garantir que assets de tipos diferentes não sejam comparados** | Desenvolvedor de testes | Evitar falsos positivos comparando TIFF com JSON, por exemplo | Verificação `a1.type == a2.type` antes de abrir os rasters |
| 7 | **Manter tolerâncias padronizadas em todo o ecossistema de testes** | Tech lead / QA | Consistência nas comparações numéricas entre todos os testes do core | Constantes `RTOL`, `ATOL` e `SHAPE_TOL` definidas centralmente |

## 2. Descrição do Módulo

Utilitários de teste para comparar objetos `DataVibe` e rasters TIFF. Provê funções `assert_all_close`, `assert_all_fields_close` e `ensure_equal_output_images` que permitem validação estrutural, geométrica e de pixels com tolerâncias configuráveis.

## 3. Inputs

| Função | Parâmetros |
|--------|-----------|
| `assert_all_fields_close` | `x: DataVibe`, `y: DataVibe`, `ignore_fields: List[str] = ["id", "assets"]` |
| `assert_all_close` | `x: DataVibe`, `y: DataVibe` |
| `ensure_equal_output_images` | `expected_path: str`, `actual_path: str` |
| Constantes | `RTOL = 1e-5`, `ATOL = 1e-8`, `SHAPE_TOL = 1e-6`, `IGNORE_FIELDS = ["id", "assets"]` |

## 4. Outputs

| Função | Retorno |
|--------|---------|
| `assert_all_fields_close` | `None` — levanta `AssertionError` com mensagem descritiva se campos diferirem |
| `assert_all_close` | `None` — levanta `AssertionError` se tipos, campos, metadados TIFF ou valores de pixel diferirem |
| `ensure_equal_output_images` | `None` — levanta `AssertionError` se arrays ou profiles TIFF diferirem |

## 5. Lógicas e Cálculos

**`assert_all_fields_close`:**
1. Obtém todos os campos da dataclass `DataVibe` via `dataclasses.fields`.
2. Filtra campos presentes em `ignore_fields` (padrão: `id`, `assets`).
3. Para cada campo restante:
   - Se `geometry`: converte ambos para shape `shpg.shape` e chama `equals_exact(..., SHAPE_TOL)`.
   - Senão: compara com `==` direto.

**`assert_all_close`:**
1. Verifica `type(x) is type(y)` — tipos exatos.
2. Chama `assert_all_fields_close`.
3. Para cada par de assets (ziplado):
   - Verifica igualdade de `type` (mimetype).
   - Se `image/tiff`: abre ambos com `rasterio.open`, compara `meta` (dict de metadados), lê arrays com `.read()` e chama `np.allclose(ar1, ar2, rtol=1e-5, atol=1e-8, equal_nan=True)`.

**`ensure_equal_output_images`:**
1. Abre ambos caminhos com `rasterio.open`.
2. Lê arrays completos (bands × height × width).
3. Compara arrays com `np.allclose`.
4. Compara `profile` (metadados de geolocalização, compressão, tiling).
