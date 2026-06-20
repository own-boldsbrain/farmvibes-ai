# Estimativa de Tamanho de Download para Recursos de Dados com Cobertura no Brasil

Este documento apresenta a estimativa detalhada em gigabytes para o download de cada recurso de dados (asset) com cobertura no território brasileiro. Esta análise baseia-se nas especificações de produtos e fluxos de trabalho de ingestão de dados mapeados no diretório de operadores do projeto.

Para assegurar a completude da análise, todos os recursos de dados mapeados no sistema foram incluídos. Os recursos que não possuem cobertura para o Brasil (sendo restritos ao território dos Estados Unidos da América) também são listados de forma explícita com tamanho igual a zero gigabytes.

Em conformidade estrita com as diretrizes do projeto, todos os termos técnicos, unidades de medida e siglas foram escritos por extenso, sem qualquer tipo de abreviação.

---

## Recursos de Dados com Cobertura no Brasil e Estimativas de Download

### 1. Sentinel-2

- **Descrição:** Imagens ópticas de média-alta resolução espacial com resolução de dez metros, obtidas por meio do catálogo do Computador Planetário.
- **Estimativa de Download por Grade (Tile):** Aproximadamente 1,0 gigabyte por imagem individual.
- **Estimativa de Download para Cobertura Completa do Brasil:** Aproximadamente 900,0 gigabytes por data de aquisição completa (considerando que são necessárias cerca de novecentas grades para cobrir a extensão territorial do país).

### 2. Sentinel-1

- **Descrição:** Imagens obtidas por radar de abertura sintética, úteis para análise de relevo, umidade e estrutura da vegetação de forma independente da cobertura de nuvens.
- **Estimativa de Download por Cena:** Aproximadamente 1,3 gigabytes por cena individual.
- **Estimativa de Download para Cobertura Completa do Brasil:** Aproximadamente 375,0 gigabytes por ciclo orbital completo (considerando cerca de trezentas cenas necessárias).

### 3. Landsat

- **Descrição:** Imagens ópticas de trinta metros de resolução obtidas a partir de satélites da série Landsat.
- **Estimativa de Download por Cena:** Aproximadamente 1,0 gigabyte por cena individual.
- **Estimativa de Download para Cobertura Completa do Brasil:** Aproximadamente 350,0 gigabytes por data de passagem orbital completa.

### 4. Moderate Resolution Imaging Spectroradiometer

- **Descrição:** Dados globais de reflectância da superfície e índices de vegetação com resoluções espaciais de duzentos e cinquenta ou quinhentos metros.
- **Estimativa de Download por Grade Regional (dez por dez graus):** Aproximadamente 0,2 gigabytes por grade.
- **Estimativa de Download para Cobertura Completa do Brasil:** Aproximadamente 3,0 gigabytes por período (composto por quatorze grades).

### 5. Modelo Digital de Elevação Copernicus

- **Descrição:** Modelo digital de elevação do terreno global com trinta metros de resolução espacial.
- **Estimativa de Download por Grade (um por um grau):** Aproximadamente 0,025 gigabytes por grade.
- **Estimativa de Download para Cobertura Completa do Brasil:** Aproximadamente 22,0 gigabytes para a cobertura estática de todo o território brasileiro.

### 6. Hansen Global Forest Change

- **Descrição:** Dados globais de perda, ganho e densidade de cobertura florestal com trinta metros de resolução espacial.
- **Estimativa de Download para Cobertura Completa do Brasil:** Aproximadamente 8,0 gigabytes para obter todas as quatro bandas analíticas principais sobre as grades brasileiras.

### 7. Global Land Analysis and Discovery

- **Descrição:** Dados globais de extensão florestal baseados na definição da Organização das Nações Unidas para a Alimentação e a Agricultura.
- **Estimativa de Download para Cobertura Completa do Brasil:** Aproximadamente 1,5 gigabytes para obter o mapa de extensão florestal.

### 8. Global Ecosystem Dynamics Investigation

- **Descrição:** Dados de estrutura e altura do dossel florestal obtidos por detecção e telemetria de luz a bordo da Estação Espacial Internacional (cobertura limitada às latitudes entre cinquenta e um vírgula seis graus norte e sul).
- **Estimativa de Download por Órbita:** Aproximadamente 1,5 gigabytes por arquivo de órbita bruta.
- **Estimativa de Download para o Histórico no Brasil:** Aproximadamente 200,0 gigabytes para o acervo histórico consolidado de dados sobre o território nacional.

### 9. Advanced Land Observing Satellite

- **Descrição:** Classificação florestal anual por radar (floresta versus não floresta) com vinte e cinco metros de resolução espacial.
- **Estimativa de Download para Cobertura Completa do Brasil:** Aproximadamente 10,0 gigabytes para consolidar a máscara anual do território nacional.

### 10. Climate Hazards Group InfraRed Precipitation with Station data

- **Descrição:** Dados diários e mensais de precipitação estimada por satélite e calibrada por estações meteorológicas terrestres.
- **Estimativa de Download Global Diário:** Aproximadamente 0,015 gigabytes por arquivo global.
- **Estimativa de Download Anual Diário para o Brasil:** Aproximadamente 5,5 gigabytes para uma série temporal diária completa de um ano.

### 11. European Centre for Medium-Range Weather Forecasts Reanalysis 5

- **Descrição:** Reanálise climática horária global com trinta quilômetros de grade espacial.
- **Estimativa de Download Global Diário (por variável):** Aproximadamente 0,3 gigabytes.
- **Estimativa de Download Anual Horário para o Brasil (por variável):** Aproximadamente 12,0 gigabytes para uma série temporal horária de uma única variável atmosférica em um ano.

### 12. TerraClimate

- **Descrição:** Dados hidroclimáticos globais mensais de alta resolução (quatro quilômetros) desde o ano de mil novecentos e cinquenta e fora até o presente.
- **Estimativa de Download Anual (todas as variáveis para o Brasil):** Aproximadamente 0,35 gigabytes.
- **Estimativa de Download do Histórico Completo para o Brasil (todas as quatorze variáveis):** Aproximadamente 21,0 gigabytes.

### 13. Global Forecast System

- **Descrição:** Previsões meteorológicas globais geradas pela Administração Nacional Oceânica e Atmosférica dos Estados Unidos da América.
- **Estimativa de Download por Ciclo de Previsão (executado a cada seis horas):** Aproximadamente 1,2 gigabytes por conjunto de dados de previsão.

### 14. Geometrias Viárias do OpenStreetMap

- **Descrição:** Redes de estradas, ruas e caminhos extraídas da base de dados global do OpenStreetMap.
- **Estimativa de Download do Arquivo Compactado (formato binário Protocolbuffer):** Aproximadamente 4,0 gigabytes para todo o território nacional.
- **Estimativa de Armazenamento das Geometrias Extraídas:** Aproximadamente 12,0 gigabytes.

### 15. Mapas de Fundo do Bing

- **Descrição:** Imagens aéreas de altíssima resolução espacial obtidas através de ladrilhos de imagem (tiles) do Bing.
- **Estimativa de Download por Área de Interesse Típica (cem quilômetros quadrados em nível de zoom dezoito, que equivale a trinta centímetros por pixel):** Aproximadamente 0,8 gigabytes.

### 16. Airbus

- **Descrição:** Imagens comerciais de satélite de altíssima resolução espacial (Spot e Pleiades).
- **Estimativa de Download por Área de Interesse Típica (cem quilômetros quadrados em resolução máxima):** Aproximadamente 1,5 gigabytes.

### 17. SoilGrids

- **Descrição:** Mapas globais de propriedades físicas e químicas do solo em múltiplas profundidades.
- **Estimativa de Download para o Brasil (por propriedade física e camada de profundidade):** Aproximadamente 0,3 gigabytes.

### 18. Azure Data Manager for Agriculture

- **Descrição:** Ingestão de prescrições de nutrientes, limites de fazendas e leituras de sensores inseridas pelo usuário na nuvem do Azure.
- **Estimativa de Download por Fazenda Típica:** Aproximadamente 0,01 gigabytes.

### 19. SpaceEye

- **Descrição:** Processamento de inteligência artificial que mescla dados ópticos e de radar para gerar imagens ópticas diárias livres de nuvens.
- **Estimativa de Saída por Grade (Tile) Sentinel-2 Livre de Nuvens:** Aproximadamente 1,0 gigabyte por grade gerada.

---

## Recursos de Dados Sem Cobertura no Brasil (Restritos a Outras Regiões)

Estes recursos de dados foram analisados e classificados como contendo zero cobertura no Brasil:

### 1. Cropland Data Layer

- **Geografia de Cobertura:** Exclusiva para o território continental dos Estados Unidos da América.
- **Estimativa de Download para o Brasil:** 0,0 gigabytes (não aplicável).

### 2. Gridded National Soil Survey Geographic Database

- **Geografia de Cobertura:** Exclusiva para o território continental dos Estados Unidos da América.
- **Estimativa de Download para o Brasil:** 0,0 gigabytes (não aplicável).

### 3. National Agriculture Imagery Program

- **Geografia de Cobertura:** Exclusiva para os Estados Unidos da América.
- **Estimativa de Download para o Brasil:** 0,0 gigabytes (não aplicável).

### 4. Programa de Elevação Tridimensional do Serviço Geológico dos Estados Unidos

- **Geografia de Cobertura:** Exclusiva para os Estados Unidos da América.
- **Estimativa de Download para o Brasil:** 0,0 gigabytes (não aplicável).

### 5. GridMET (Dados Diários de Clima da Universidade de Idaho)

- **Geografia de Cobertura:** Exclusiva para os Estados Unidos da América.
- **Estimativa de Download para o Brasil:** 0,0 gigabytes (não aplicável).
