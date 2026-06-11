# JTBDs (download_gedi_product)

## JTBDs
1. Baixar produtos GEDI (Global Ecosystem Dynamics Investigation) para análises de estrutura florestal
2. Obter dados LiDAR de altura da vegetação e biomassa da NASA EarthData

## Descrição
Baixa produtos GEDI da NASA via EarthData API. A operação consulta o produto pelo nome no nível de processamento especificado (L1B, L2A, L2B), obtém a URL de download do resultado da query, autentica com token bearer e salva o arquivo no formato HDF5.

## Inputs
- `gedi_product`: `GEDIProduct` com nome do produto e nível de processamento

## Outputs
- `downloaded_product`: `GEDIProduct` com asset HDF5 baixado

## Lógicas e Cálculos
- Instancia EarthData API com o nível de processamento do produto
- Consulta EarthData pelo nome do produto (deve retornar exatamente 1 resultado)
- Extrai URL do primeiro link do resultado da consulta
- Faz download do arquivo .h5 com autenticação Bearer token via cabeçalho HTTP
- Clona produto de entrada com novo GUID e asset referenciando o arquivo HDF5
