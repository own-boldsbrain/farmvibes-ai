# JTBDs (download_from_ref)

## JTBDs
1. Baixar arquivos a partir de referências externas (URLs remotas ou locais)
2. Converter referências externas em datasets tipados (Raster, GeometryCollection, etc.)

## Descrição
Baixa arquivos de URLs remotas ou caminhos locais referenciados por `ExternalReference`. A operação é genérica e parametrizada pelo tipo de saída (`out_type`): pode produzir `Raster`, `GeometryCollection` ou qualquer tipo registrado no `data_registry`. O hash SHA-256 do arquivo é usado como identificador do asset.

## Inputs
- `input_ref`: `ExternalReference` com URL ou caminho local do arquivo

## Outputs
- `downloaded`: Tipo definido por `out_type` (ex: `Raster`, `GeometryCollection`) com asset baixado

## Lógicas e Cálculos
- Se URL é local (`file://`), copia o arquivo via `shutil.copy`; caso contrário, faz download via `download_file`
- Calcula hash SHA-256 do arquivo em chunks de 1MB para usar como ID do asset
- Verifica extensão do arquivo e registra MIME type se necessário (ex: .geojson)
- Constrói saída tipada clonando metadados da referência com campos vazios preenchidos para o tipo destino

## Use Cases
1. **Ingestão de From Ref**: Baixar dados From Ref para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados From Ref mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_ref` | — | Conforme especificação da operação |
| `ExternalReference` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_from_ref` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

