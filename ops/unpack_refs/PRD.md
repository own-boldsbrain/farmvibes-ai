# JTBDs (unpack_refs)

## JTBDs

1. Desempacotar uma lista de ExternalReferenceList em referências individuais
2. Extrair URLs de listas agrupadas para items avulsos

## Descrição

Desempacota uma lista de ExternalReferenceList (cada uma contendo múltiplas URLs) em uma lista plana de ExternalReference, uma por URL.

## Inputs

- `input_refs`: List[ExternalReferenceList] — lista de referências agrupadas

## Outputs

- `ref_list`: List[ExternalReference] — referências individuais, uma por URL

## Lógicas e Cálculos

1. Para cada ExternalReferenceList, itera sobre todas as URLs
2. Clona ExternalReference para cada URL individual com novo GUID
3. Retorna lista plana de todas as referências
