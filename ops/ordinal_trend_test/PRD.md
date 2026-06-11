# JTBDs (ordinal_trend_test)

## JTBDs
1. Detectar tendência de aumento/declínio em classes ordinais ao longo do tempo
2. Testar significância estatística com Cochran-Armitage

## Descrição
Aplica teste de tendência Cochran-Armitage sobre contagens de pixels categóricos ao longo de múltiplas datas. Retorna p-valor e z-score para determinar se há tendência significativa.

## Inputs
- `pixel_count: List[RasterPixelCount]` — contagens de pixels por data

## Outputs
- `ordinal_trend_result: OrdinalTrendTest` — p-valor e z-score

## Lógicas e Cálculos
- Ordena pixel counts por data
- Constrói tabela de contingência (categorias × tempo)
- Calcula z-score: (Σ w_i·T_i - E) / √Var, onde w_i = índices ordinais
- p-valor = 2 · Φ(-|z|) (bicaudal)
- H₀: sem tendência; H₁: com tendência (z > 0 crescente, z < 0 decrescente)
