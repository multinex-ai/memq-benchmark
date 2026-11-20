# MemQ Verified Input Token & Cost Savings

Computed deterministically with `gpt-tokenizer (BPE via src/tokenizer.ts)` over `datasets/ops-retrieval/corpus.json` (31 memories, `876` tokens exact; `28.26` tokens/entry) and `datasets/ops-retrieval/cases.json` (12 cases, `435.1` tokens case-weighted active-namespace dump), aligned with `artifacts/snapshot.json` (2026-04-28T18:02:44.970Z: **100% Primary@1**, **100% Recall@5**, **100% leakage-free**, **13 ms** avg latency).

## Verified per-turn input token footprint (31-entry ops corpus)

| Context Strategy | Input Tokens / Turn | Reduction vs Full Corpus | Reduction vs Active Namespace | Est. Saved / 100k Turns ($3/1M) | Est. Saved / 100k Turns ($15/1M) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Full corpus stuffing (all 31 memories) | `876` | `0%` (0 tok) | `-101.3%` (-440.9 tok) | `$0.00` | `$0.00` |
| Active-namespace dump (case-weighted) | `435.1` | `50.3%` (440.9 tok) | `0%` (0 tok) | `$132.27` | `$661.35` |
| MemQ MCP Top-5 bounded recall (verified 100% Recall@5) | `141.3` | `83.9%` (734.7 tok) | `67.5%` (293.8 tok) | `$220.41` | `$1102.05` |
| MemQ MCP Top-3 compact recall (covers max 2 relevant/case) | `84.8` | `90.3%` (791.2 tok) | `80.5%` (350.3 tok) | `$237.36` | `$1186.80` |
| Ground-truth relevant memories only (avg 1.25 entries/case) | `38` | `95.7%` (838 tok) | `91.3%` (397.1 tok) | `$251.40` | `$1257.00` |
| MemQ MCP Top-1 single-fact recall (verified 100% Primary@1) | `28.3` | `96.8%` (847.7 tok) | `93.5%` (406.8 tok) | `$254.31` | `$1271.55` |

## How savings scale as memory grows (`O(K)` vs `O(N)` at verified `K = 5`)

At the benchmark's verified `K = 5` (`100%` Recall@5, `141.3` tokens/turn), MemQ keeps memory context constant while full-context stuffing grows linearly at `28.26` tokens/entry:

| Stored Memories | Full Context Stuffing (tok/turn) | MemQ Top-5 Recall (tok/turn) | Input Token Reduction | Est. Saved / 100k Turns ($3/1M) | Est. Saved / 100k Turns ($15/1M) |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 31 *(measured exact)* | `876` | `141.3` | `83.9%` | `$220.41` | `$1,102.05` |
| 100 *(linear projection)* | `2,826` | `141.3` | `95%` | `$805.41` | `$4,027.05` |
| 250 *(linear projection)* | `7,065` | `141.3` | `98%` | `$2,077.11` | `$10,385.55` |
| 1,000 *(linear projection)* | `28,258` | `141.3` | `99.5%` | `$8,435.01` | `$42,175.05` |

## Audit & validation notes

- Full corpus (876 tokens), active-namespace dump (435.1 case-weighted tokens), and ground-truth relevant slices (38.0 tokens) are exact gpt-tokenizer measurements over datasets/ops-retrieval/corpus.json and cases.json.
- Top-5 (141.3 tokens), Top-3 (84.8 tokens), and Top-1 (28.3 tokens) budgets multiply K by the exact measured corpus mean (28.26 tokens/entry) and align with the 2026-04-28 artifacts/snapshot.json benchmark where MemQ MCP achieved 100% Primary@1, 100% Recall@5, and 100% leakage-free retrieval at K=5.
- Individual files in artifacts/retrieval-results/ are from an earlier 2026-04-09 run and are intentionally excluded from this report so token math stays aligned with the current 2026-04-28 snapshot.
- Token counts measure injected memory context only (excluding system prompt, user query, and uncached MCP tool-call framing of ~35-50 tokens/turn) and USD estimates exclude provider prompt-caching discounts.
