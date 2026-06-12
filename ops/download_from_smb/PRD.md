# JTBDs (download_from_smb)

## JTBDs
1. Baixar rasters de um compartilhamento SMB (Windows File Share) para processamento
2. Importar imagens de servidores de arquivos remotos em infraestrutura de rede local

## Descrição
Conecta-se a um servidor SMB (Samba/Windows Share) usando credenciais configuradas, navega recursivamente por diretórios e baixa todos os arquivos de imagem encontrados. Os arquivos baixados são convertidos em `Raster` com bandas nomeadas (ex: red, green, blue) e retornados como lista.

## Inputs
- `user_input`: `DataVibe` com geometria e período (usado como template de metadados)

## Outputs
- `rasters`: Lista de `Raster` com assets das imagens baixadas e bandas configuradas

## Lógicas e Cálculos
- Estabelece conexão SMB com autenticação NTLMv2 via porta configurada
- Verifica se o caminho é diretório ou arquivo; se diretório, percorre recursivamente com `crawl_directory`
- Filtra apenas arquivos cujo MIME type começa com "image"
- Para cada arquivo, faz download via `retrieveFile` e cria `AssetVibe` com tipo MIME detectado
- Mapeia bandas nomeadas por índice (ex: red=0, green=1, blue=2) conforme parâmetro `bands`
- Gera ID hash único para cada raster combinando asset, geometria e período

## Use Cases
1. **Ingestão de From Smb**: Baixar dados From Smb para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados From Smb mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

N/A — parâmetros definidos no workflow que invoca esta operação.

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `download_from_smb` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

