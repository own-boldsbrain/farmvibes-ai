# PRD — Workflows de Carbono Local (farm_ai/carbon_local)

---

## 1. ADMAG Carbon Integration (`admag_carbon_integration.yaml`)

### JTBDs

- Integrar o Azure Data Manager for Agriculture (ADMAG) com a COMET-Farm API para calcular o sequestro de carbono baseado em práticas agrícolas (baseline vs. cenário futuro).
- Automatizar a avaliação de offset de carbono a partir de dados de manejo armazenados no ADMAG.

### Casos de Uso

- Fazenda quer gerar créditos de carbono comparando práticas históricas (baseline) com práticas planejadas (cenário).
- Consultor de carbono avalia diferentes cenários de manejo para maximizar sequestro de carbono.
- Empresa de agtech integra FarmVibes com ADMAG para oferecer serviço de crédito de carbono.

### Faz / Não Faz

- **Faz**: autentica no ADMAG via OAuth2; baixa listas de campos sazonais (baseline e cenário); constrói objetos `SeasonalFieldInformation`; envia requisições para COMET-Farm API via webhook (ngrok); retorna resultado de offset de carbono.
- **Não Faz**: não executa sem credenciais ADMAG e COMET-Farm válidas; não gerencia fila de requisições COMET (limite de 50/dia público); não armazena histórico de resultados.

### Users Inputs

- `baseline_admag_input`: lista de `ADMAgSeasonalFieldInput` para cenário baseline (práticas históricas — mínimo 2 anos).
- `scenario_admag_input`: lista de `ADMAgSeasonalFieldInput` para cenário futuro (práticas planejadas).
- `base_url`, `client_id`, `client_secret`, `authority`, `default_scope`: credenciais ADMAG.
- `comet_support_email`: e-mail registrado no COMET-Farm.
- `ngrok_token`: token para criar webhook URL pública e temporária.

### System Outputs

- `carbon_output`: resultado do sequestro de carbono para o cenário informado (baseline vs. scenario).

### Outcomes Esperados

- Relatório de offset de carbono comparando cenários, permitindo tomada de decisão sobre práticas de manejo e geração de créditos.

### APIs

- **ADMAG API** (Azure Data Manager for Agriculture): download de dados de campo sazonal.
- **Microsoft Identity Platform** (OAuth2): autenticação ADMAG.
- **COMET-Farm API**: avaliação de offset de carbono.
- **ngrok API**: criação de túnel/webhook público para receber resposta da COMET.

### CRUD

- **POST**: submissão do workflow com inputs baseline e cenário.
- **GET**: consulta de status e resultado do carbono.
- (via ADMAG) **GET**: leitura de seasonal fields.
- (via COMET) O resultado chega assincronamente via webhook; o usuário também pode consultar o e-mail de suporte.

### Bancos de Dados

- **ADMAG** (Azure): armazena dados de manejo agrícola (fertilização, preparo, colheita, aplicação orgânica).
- **COMET-Farm**: backend próprio para simulação de carbono.

### Datasets e JSON

- Input: `ADMAgSeasonalFieldInput` (JSON) — lista de campos com práticas agrícolas.
- Output: `carbon_output` — resultado da simulação COMET.

### Tabelas

- Dados sazonais: fertilizantes, preparo do solo, colheita, aplicação orgânica.
- Mínimo de 2 anos de baseline exigido.

### Lógicas e Cálculos

- Construção de objetos `SeasonalFieldInformation` a partir dos dados ADMAG.
- Envio assíncrono para COMET-Farm API via webhook (ngrok).
- Comparação baseline vs. cenário para cálculo de offset.
- Tempo de execução: 5 min a 2 h (assíncrono).
- COMET limita 50 requisições/dia para uso público.

---

## 2. Carbon What-If (`carbon_whatif.yaml`)

### JTBDs

- Computar o offset de carbono que seria sequestrado em um campo sazonal usando informações de baseline (histórico) e cenário (futuro) diretamente, sem dependência do ADMAG.

### Casos de Uso

- Agricultor já possui os dados de manejo estruturados e quer simular diferentes cenários de carbono.
- Pesquisador avalia impacto de diferentes práticas agrícolas no sequestro de carbono.

### Faz / Não Faz

- **Faz**: recebe listas de `SeasonalFieldInformation` para baseline e cenário; envia para COMET-Farm API via webhook; retorna offset de carbono.
- **Não Faz**: não obtém dados de fontes externas (é responsabilidade do usuário fornecer os dados); não gerencia fila ou cache de requisições.

### Users Inputs

- `baseline_seasonal_fields`: lista de campos sazonais históricos (mín. 2 anos) com fertilizantes, preparo, colheita e aplicação orgânica.
- `scenario_seasonal_fields`: lista de campos sazonais futuros com práticas planejadas.
- `comet_support_email`: e-mail registrado no COMET-Farm.
- `ngrok_token`: token ngrok para webhook.

### System Outputs

- `carbon_output`: offset de carbono calculado para o cenário.

### Outcomes Esperados

- Simulação "what-if" de carbono para planejamento de manejo sustentável e geração de créditos.

### APIs

- **COMET-Farm API**: avaliação de offset.
- **ngrok API**: webhook temporário.

### CRUD

- **POST**: submissão do workflow.
- **GET**: resultado final (após callback do COMET).

### Bancos de Dados

- N/A (dados fornecidos diretamente pelo usuário).

### Datasets e JSON

- Input: listas de objetos `SeasonalFieldInformation` (JSON).
- Output: `carbon_output`.

### Tabelas

- Baseline (mín. 2 anos): fertilização, preparo, colheita, aplicação orgânica.
- Cenário: mesmas categorias para o período planejado.

### Lógicas e Cálculos

- Delegação para operador `whatif_comet_local_op` (implementação local em `carbon_local`).
- Envio assíncrono para COMET-Farm com retorno via webhook ngrok.
- Tempo de resposta: 5 min a 2 h.
- Offset = carbono sequestrado no cenário menos carbono no baseline.

---

## Perfis Energéticos

### ADMAG Carbon Integration — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Mercado de Carbono | Agricultura de baixo carbono, REDD+ | Integra ADMAG com COMET-Farm para cálculo de offset de carbono entre baseline e cenário | Automatiza geração de créditos de carbono a partir de dados de manejo |
| Biomassa / Bioenergia | Cana-de-açúcar, Resíduos agrícolas | Calcula sequestro de carbono para diferentes cenários de manejo de biomassa | Subsidia projetos de bioenergia com créditos de carbono |
| Eficiência Energética | Irrigação, Armazenamento | Avalia offset de carbono entre práticas históricas e futuras | Apoia transição para agricultura de baixo carbono |
| Geração Hidrelétrica | PCH, CGH | Compara cenários de manejo em bacias de contribuição de reservatórios | Subsidia compensação ambiental em licenciamento |
| Comercialização de Energia | Autoprodutores, Consumidores Livres | Gera relatórios de offset para comercialização de atributos ambientais | Permite monetização de carbono no mercado livre |

### Carbon What-If — Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Mercado de Carbono | Agricultura de baixo carbono | Simula cenários what-if de sequestro de carbono sem dependência ADMAG | Apoia tomada de decisão em projetos de carbono |
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | Avalia impacto de diferentes práticas de manejo no balanço de carbono | Subsidia planejamento de culturas energéticas |
| Eficiência Energética | Irrigação | Simula cenários de manejo para maximizar sequestro e eficiência | Apoia estratégias integradas de produção sustentável |
| Geração Hidrelétrica | PCH, CGH | Avalia cenários de uso do solo em bacias hidrográficas | Subsidia programas de pagamento por serviços ambientais |
| Comercialização de Energia | Comercializadores | Gera projeções de offset para portfólio de créditos de carbono | Alimenta estratégia de comercialização de carbono |
