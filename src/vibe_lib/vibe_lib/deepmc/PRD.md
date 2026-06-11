# PRD — DeepMC (Deep-learning Monte Carlo)

## JTBDs

1. **Processar séries temporais multivariadas com arquitetura encoder–decoder** — O modelo transforma múltiplas sequências de entrada (ex.: bandas de sensoriamento remoto ao longo do tempo) em uma predição escalar por amostra.

2. **Aplicar atenção multi-cabeça para capturar dependências temporais** — Usar `MultiHeadAttention` com `EncoderLayer` empilhado para modelar relações de longo prazo entre timesteps.

3. **Extrair features locais com camada locally-connected 1D** — A camada `LocallyConnected1d` aprende filtros espaciais com pesos independentes por posição temporal (diferente de convolução com pesos compartilhados).

4. **Processar entradas heterogêneas com encoders dedicados** — O primeiro input usa encoder com atenção + locally-connected; os demais inputs usam encoder com locally-connected + LSTM, permitindo tratar cada variável de entrada com arquitetura distinta.

5. **Decodificar features concatenadas para predição final** — Concatenar as saídas dos encoders e passar por um decoder MLP + LSTM que reduz a dimensionalidade até uma saída escalar.

6. **Aplicar transformação temporal batch-first reutilizável** — O wrapper `TimeDistributed` aplica qualquer módulo nn.Module a cada timestep individualmente, achatando a dimensão temporal no batch.

7. **Gerar positional encoding senoidal para injeção de ordem temporal** — Criar embeddings posicionais via seno/cosseno em frequências geométricas, seguindo o esquema clássico de transformers.

## Descrição do Módulo

Arquitetura DeepMC (Deep-learning Monte Carlo) para predição a partir de séries temporais multivariadas. Combina encoder baseado em transformer (atenção multi-cabeça + feed-forward), camadas locally-connected 1D para extração local de features, LSTMs para modelagem sequencial, e um decoder MLP para regressão escalar final.

## Inputs

| Classe / Função | Parâmetros |
|---|---|
| `DeepMCModel.__init__` | `first_channels`, `rest_channels`, `first_encoder_channels`, `rest_encoder_channels: tuple`, `sequence_length`, `kernel_size`, `num_inputs`, `encoder_layers`, `encoder_features`, `encoder_heads`, `encoder_ff_features`, `encoder_dropout`, `decoder_features: tuple`, `dropout`, `batch_first`, `return_sequence` |
| `DeepMCModel.forward` | `x: Union[Tensor, List[Tensor]]` — lista de tensores, um por input, shape `(B, L, C_i)` |
| `Encoder.__init__` | `in_features`, `num_layers`, `d_model`, `num_heads`, `d_ff`, `max_seq_len`, `dropout` |
| `Encoder.forward` | `x: Tensor (B, L, in_features)`, `mask: Optional[Tensor]` |
| `EncoderLayer.__init__` | `d_model`, `num_heads`, `d_ff`, `rate` (dropout) |
| `LocallyConnected1d.__init__` | `in_channels`, `out_channels`, `seq_len`, `kernel_size`, `stride`, `padding`, `bias` |
| `MultiHeadAttention.__init__` | `d_model`, `num_heads` |
| `MultiHeadAttention.forward` | `v, k, q: Tensor`, `mask: Tensor` |
| `TimeDistributed.__init__` | `module: nn.Module`, `batch_first: bool` |
| `positional_encoding` | `position: int`, `d_model: int` |

## Outputs

| Classe / Função | Retorno |
|---|---|
| `DeepMCModel.forward` | `Tensor` — shape `(B, 1)` (predição escalar por amostra) |
| `Encoder.forward` | `Tensor` — shape `(B, L, d_model)` |
| `EncoderLayer.forward` | `Tensor` — shape `(B, L, d_model)` |
| `LocallyConnected1d.forward` | `Tensor` — shape `(B, out_channels, out_seq_len)` |
| `MultiHeadAttention.forward` | `Tensor` — shape `(B, L, d_model)` |
| `TimeDistributed.forward` | `Tensor` — mesmo batch-first da entrada, com saída do módulo interno |
| `positional_encoding` | `Tensor` — shape `(1, position, d_model)` |
| `attn(q, k, v, mask)` | `Tensor` — saída da atenção escalada einsum |
| `point_wise_feed_forward_network` | `Sequential` — `Linear → ReLU → Linear` |
| `get_angles(pos, i, d_model)` | `NDArray` — ângulos para positional encoding |

## Lógicas e Cálculos

1. **Encoder do primeiro input** (`self.encoders[0]`): Rearrange `(B, L, C) → (B, C, L)` → `LocallyConnected1d` (kernel_size) → BatchNorm → Rearrange `(B, C', L') → (B, L', C')` → `Encoder` transformer (N layers de multi-head attention + FFN) → Flatten. Output shape: `(B, L' * encoder_features)`.

2. **Encoders dos demais inputs** (`self.encoders[1:]`): Rearrange `(B, L, C) → (B, C, L)` → `LocallyConnected1d` (C → re1) → ReLU → BatchNorm → `LocallyConnected1d` (re1 → re2) → ReLU → BatchNorm → Rearrange → `MyLSTM` (hidden=re3) → pega `x[:, -1]`. Output shape: `(B, re3)`.

3. **Decoder**: Concatena saídas de todos os encoders → BatchNorm → LSTM (hidden=df1) → ReLU → BatchNorm → `Linear(df1, df2)` → ReLU → `Linear(df2, 1)`. Output shape: `(B, 1)`.

4. **MultiHeadAttention**: Projeta Q, K, V com `nn.Linear(d_model, d_model)`. Divide em `num_heads` com `einops.rearrange` para `(B*H, L, d_head)`. Aplica escala `d_head^-0.5`. Chama `attn` (einsum + softmax). Reconcatena com `rearrange` para `(B, L, d_model)` e projeta com `dense`.

5. **LocallyConnected1d**: Paddings → `unfold` para extrair janelas → einsum `"b i l k, i o k l -> b o l"` com peso `(in_channels, out_channels, kernel_size, out_seq_len)` → soma bias.

6. **Positional encoding**: `get_angles(pos, i, d_model)` = `pos * 10000^(-2i/d_model)`. Aplica `sin` nos índices pares e `cos` nos ímpares. Retorna tensor `(1, position, d_model)`.

7. **TimeDistributed**: Achata `(B*T, ...)`, aplica módulo, remonta `(B, T, ...)` ou `(T, B, ...)` conforme `batch_first`.
