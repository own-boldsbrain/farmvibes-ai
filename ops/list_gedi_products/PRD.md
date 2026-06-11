# JTBDs (List GEDI Products)

## JTBDs
1. Listar produtos GEDI (Global Ecosystem Dynamics Investigation) da NASA EarthData para uma região e período
2. Selecionar nível de processamento (ex: GEDI02_B.002)

## Descrição
Operação que consulta a API EarthData da NASA e lista produtos GEDI que intersectam a geometria e intervalo de tempo. Cada produto contém geometria (polígono ou multipolígono da órbita), número da órbita inicial/final e nível de processamento.

## Inputs
- `input_data` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `gedi_products` (List[GEDIProduct]): produtos GEDI listados

## Lógicas e Cálculos
- Valida `processing_level` contra `EarthDataAPI.concept_ids`
- Consulta EarthData API com geometria e time range
- Converte polígonos da resposta (string de coordenadas) para `shapely.Polygon` ou `MultiPolygon`
- Extrai `start_orbit_number` e `stop_orbit_number` do domínio orbital
- Deriva `processing_level` a partir do `collection_concept_id`
