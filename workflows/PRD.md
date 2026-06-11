# PRD — Workflow: `helloworld`

## JTBDs (Jobs To Be Done)

- Validar que o ambiente FarmVibes.AI está operacional com um workflow mínimo de teste.
- Visualizar rapidamente a interseção de uma geometria de entrada com os países do globo terrestre.

## Casos de Uso

1. **Teste de sanidade**: Um operador executa o workflow para confirmar que o cluster, as ops e os pipelines estão funcionando.
2. **Demonstração**: Um novo usuário executa o workflow para entender o fluxo de fontes, tarefas e sumidouros.

## Faz / Não Faz

- **Faz**: Gera um raster simples com países destacados.
- **Faz**: Aceita uma geometria de entrada qualquer.
- **Não Faz**: Não realiza qualquer processamento real de sensoriamento remoto.
- **Não Faz**: Não persiste resultados em banco de dados.

## Users Inputs

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `user_input` | Geometry | Geometria de interesse para o recorte |

## System Outputs

| Sumidouro | Tipo | Descrição |
|-----------|------|-----------|
| `raster` | Raster | Imagem raster com países interseccionados destacados em laranja |

## Outcomes Esperados

- O operador confirma que o sistema está funcional.
- O novo usuário compreende o modelo de execução de workflows (sources → tasks → sinks).

## APIs

- **Endpoint interno**: Nenhum endpoint REST exposto diretamente.
- **Conector**: O workflow é submetido via `farmvibes-ai run helloworld`.

## CRUD

- **Create**: Submeter o workflow com `farmvibes-ai run`.
- **Read**: Consultar o resultado (raster) pelo client do FarmVibes.AI.
- **Update / Delete / Approve / Reject**: Não se aplica.

## Bancos de Dados

Nenhum. O resultado é mantido em memória/armazenamento interno do FarmVibes.AI.

## Datasets e JSON Files

Nenhum.

## Tabelas

Nenhuma.

## Lógicas e Cálculos

- **Operação**: `helloworld`
- Gera uma imagem raster do globo terrestre destacando os países que intersectam a geometria fornecida.
- Não há lógica de agregação, índice ou transformação espectral.

## Helloworld — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Geração Solar Fotovoltaica | GD, GC | Workflow de demonstração para validação de pipelines de dados geoespaciais | Acelera onboarding de novos usuários em projetos de solar |
| Eficiência Energética | Irrigação, Estufas | Teste de sanidade para ambientes de agricultura de precisão | Garante disponibilidade do cluster antes de executar workflows produtivos |
| Mercado de Carbono | REDD+ | Validação de integração de geometrias de projetos em pipeline de MRV | Assegura que dados geográficos fluem corretamente no sistema |
| Distribuição de Energia | Concessionárias | Demonstração de fluxo fonte → tarefa → sumidouro para equipes de distribuição | Facilita treinamento de analistas de redes elétricas |
| Comercialização de Energia | Comercializadores | Ambiente de teste para integração de dados de comercialização | Viabiliza prototipação rápida de novos modelos de previsão |
