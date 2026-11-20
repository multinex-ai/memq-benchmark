# MemQ Measured Token & Cost Savings

Measured directly with `gpt-tokenizer (cl100k/o200k BPE via countTokens)` across `datasets/ops-retrieval/corpus.json` (31 operational memories, 876 tokens full corpus; 292 tokens average per namespace) and 12 completed `memq_mcp` retrieval runs in `artifacts/retrieval-results`.

## Measured per-turn context footprint (checked-in 31-entry ops corpus)

| Context Strategy | Avg Input Tokens / Turn | Saved vs Full Corpus | Saved vs Namespace Dump | Est. Saved / 100k Turns ($3/1M) | Est. Saved / 100k Turns ($15/1M) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Full corpus stuffing (no retrieval) | `876` | `0%` (0 tok) | `-200%` (-584 tok) | `$0.00` | `$0.00` |
| Namespace-only stuffing (no ranking) | `292` | `66.7%` (584 tok) | `0%` (0 tok) | `$175.20` | `$876.00` |
| MemQ MCP bounded recall (Top-5) | `142.3` | `83.8%` (733.7 tok) | `51.3%` (149.7 tok) | `$220.11` | `$1100.55` |
| MemQ MCP compact recall (Top-3) | `88.4` | `89.9%` (787.6 tok) | `69.7%` (203.6 tok) | `$236.28` | `$1181.40` |
| MemQ MCP precision recall (Top-1) | `31.8` | `96.4%` (844.2 tok) | `89.1%` (260.2 tok) | `$253.26` | `$1266.30` |

## Why savings compound as project memory grows (`O(K)` vs `O(N)`)

Because MemQ returns a bounded top-K slice (`O(K)`) with `100%` Primary@1 accuracy on the benchmark corpus, your prompt stays flat while raw history/memory stuffing scales linearly (`O(N)`) with corpus size (projected at the measured `28.3` tokens/entry average):

| Stored Memories | Full Context Stuffing (tok/turn) | MemQ Top-3 Bounded Recall (tok/turn) | Input Token Reduction | Est. Saved / 100k Turns ($3/1M) | Est. Saved / 100k Turns ($15/1M) |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 31 (measured corpus) | `877` | `88.4` | `89.9%` | `$236.58` | `$1,182.90` |
| 100 (projected) | `2,830` | `88.4` | `96.9%` | `$822.48` | `$4,112.40` |
| 250 (projected) | `7,075` | `88.4` | `98.8%` | `$2,095.98` | `$10,479.90` |
| 1000 (projected) | `28,300` | `88.4` | `99.7%` | `$8,463.48` | `$42,317.40` |

_Methodology note: Token counts for the 31-entry corpus and MemQ Top-1/Top-3/Top-5 slices are exact `gpt-tokenizer` measurements over checked-in artifacts. Multi-hundred-entry rows linearly scale the measured average entry size (`28.3` tokens/entry) against MemQ's constant Top-3 footprint. USD figures apply standard published input token rates (`$0.50`, `$3.00`, `$15.00` per 1M input tokens) and exclude prompt caching discounts._
