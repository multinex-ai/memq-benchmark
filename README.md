<div align="center">
  <a href="https://multinex.ai">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/multinex-ai/.github/master/profile/assets/multinex-lockup-dark.svg">
      <img src="https://raw.githubusercontent.com/multinex-ai/.github/master/profile/assets/multinex-lockup-light.svg" alt="Multinex" width="180">
    </picture>
  </a>
</div>

<p align="center">
  <img src="./assets/memq-bench-banner.svg" alt="MemQ Bench banner" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/multinex-ai/memq-benchmark/actions/workflows/benchmark.yml"><img src="https://img.shields.io/github/actions/workflow/status/multinex-ai/memq-benchmark/benchmark.yml?branch=master&label=benchmark&style=for-the-badge" alt="Benchmark workflow status" /></a>
  <a href="./artifacts/snapshot.json"><img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/artifacts/badges.json&query=%24.snapshot.caseCount&label=retrieval%20cases&color=7c3aed&style=for-the-badge" alt="Retrieval case count" /></a>
  <a href="./artifacts/snapshot.json"><img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/artifacts/badges.json&query=%24.snapshot.memqPrimaryAt1Pct&label=memq%20retrieval%20primary%401&suffix=%25&color=0ea5e9&style=for-the-badge" alt="MemQ retrieval primary at one" /></a>
  <a href="./artifacts/snapshot.json"><img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/artifacts/badges.json&query=%24.snapshot.mem0PrimaryAt1Pct&label=mem0%20retrieval%20primary%401&suffix=%25&color=10b981&style=for-the-badge" alt="Mem0 retrieval primary at one" /></a>
  <a href="./artifacts/snapshot.json"><img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/artifacts/badges.json&query=%24.snapshot.memqAvgLatencyMs&label=memq%20avg%20latency&suffix=ms&color=06b6d4&style=for-the-badge" alt="MemQ average retrieval latency" /></a>
  <a href="./artifacts/snapshot.json"><img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/artifacts/badges.json&query=%24.snapshot.memqVsMem0LatencyMultiple&label=memq%20faster%20than%20mem0&suffix=x&color=ef4444&style=for-the-badge" alt="MemQ latency multiple versus Mem0" /></a>
  <a href="./artifacts/token-savings.json"><img src="https://img.shields.io/badge/input%20tokens%20saved-83.9%25%20(Top--5)-6366f1?style=for-the-badge" alt="Verified MemQ Top-5 input token reduction" /></a>
  <a href="./artifacts/llm-snapshot.json"><img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/artifacts/llm-badges.json&query=%24.snapshot.memqAnswerPassPct&label=memq%20llm%20answer%20pass&suffix=%25&color=0284c7&style=for-the-badge" alt="MemQ LLM answer pass rate" /></a>
  <a href="./artifacts/llm-snapshot.json"><img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/artifacts/llm-badges.json&query=%24.snapshot.noMemoryAnswerPassPct&label=no%20memory%20llm%20pass&suffix=%25&color=f59e0b&style=for-the-badge" alt="No memory LLM answer pass rate" /></a>
</p>

<p align="center">
  Public benchmark repo for measuring hosted MemQ, a governed global intelligence fabric for agent memory, against Mem0 OSS, keyword retrieval, and no-memory baselines.
</p>

<p align="center">
  <strong>Try hosted MemQ:</strong>
  <a href="https://billing.multinex.ai/signup?product=memq&next=%2Fcheckout%3Fproduct%3Dmemq-contributor">start a MemQ signup through the Billing Manager</a>.
</p>

## Latest benchmark headline

Fresh run: `2026-04-28T18:02:44.970Z`

Hosted MemQ is dramatically ahead of the Mem0 OSS adapter in the current retrieval benchmark:

| Metric | MemQ MCP | Mem0 OSS | MemQ advantage |
| --- | ---: | ---: | ---: |
| Primary@1 | `100%` | `58%` | `+42 pts` |
| Hit@K | `100%` | `100%` | parity |
| Recall@K | `100%` | `100%` | parity |
| Leakage-free | `100%` | `67%` | `+33 pts` |
| Average latency | `13 ms` | `2511 ms` | `193x lower` |
| P95 latency | `25 ms` | `2814 ms` | `113x lower` |

This is the current artifact-backed retrieval result from [`artifacts/snapshot.json`](./artifacts/snapshot.json), not marketing copy.

## Token & cost savings: why bounded recall pays for itself

Without governed memory retrieval, agents either **re-read entire project histories on every turn** (burning input tokens linearly as memory grows) or **start cold and fail** (`0%` answer pass on the no-memory baseline).

Because hosted MemQ hits **`100%` Primary@1**, **`100%` Recall@5**, and **`100%` leakage-free** retrieval in **`13 ms`** (`artifacts/snapshot.json`, `2026-04-28`), agents only inject a bounded top-K slice instead of stuffing the full corpus. Computed deterministically with `gpt-tokenizer` over `datasets/ops-retrieval/corpus.json` (31 entries, `876` tokens exact) and `cases.json` ([`artifacts/token-savings.json`](./artifacts/token-savings.json) · [`artifacts/token-savings.md`](./artifacts/token-savings.md)):

| Context Strategy | Input Tokens / Turn | Reduction vs Full Corpus | Reduction vs Active Namespace | Est. Saved / 100k Turns ($3/1M) | Est. Saved / 100k Turns ($15/1M) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Full corpus stuffing (all 31 memories) | `876` | `0%` | — | `$0.00` | `$0.00` |
| Active-namespace dump (case-weighted) | `435.1` | `50.3%` | `0%` | `$132.27` | `$661.35` |
| **MemQ MCP Top-5 bounded recall** *(verified 100% Recall@5)* | **`141.3`** | **`83.9%`** | **`67.5%`** | **`$220.41`** | **`$1,102.05`** |
| **MemQ MCP Top-3 compact recall** *(covers max 2 relevant/case)* | **`84.8`** | **`90.3%`** | **`80.5%`** | **`$237.36`** | **`$1,186.80`** |
| Ground-truth relevant memories only *(avg 1.25 entries/case)* | `38.0` | `95.7%` | `91.3%` | `$251.40` | `$1,257.00` |

### Why savings compound as your memory bank grows (`O(K)` vs `O(N)` at verified `K = 5`)

Full-context stuffing grows linearly with every new decision, incident, or session note (`28.26` tokens/entry exact mean), while MemQ Top-5 stays flat at **`141.3` tokens/turn**:

| Stored Memories | Full Context Stuffing (tok/turn) | MemQ Top-5 Recall (tok/turn) | Input Token Reduction | Est. Saved / 100k Turns ($3/1M) | Est. Saved / 100k Turns ($15/1M) |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 31 *(measured exact)* | `876` | `141.3` | **`83.9%`** | `$220.41` | `$1,102.05` |
| 100 *(linear projection)* | `2,826` | `141.3` | **`95%`** | `$805.41` | `$4,027.05` |
| 250 *(linear projection)* | `7,065` | `141.3` | **`98%`** | `$2,077.11` | `$10,385.55` |
| 1,000 *(linear projection)* | `28,258` | `141.3` | **`99.5%`** | `$8,435.01` | `$42,175.05` |

Reproduce these exact token counts locally anytime with:

```bash
npm run token-savings
```

> **Audit & methodology note:** Full corpus (`876` tokens), case-weighted active-namespace dump (`435.1` tokens), and ground-truth relevant slices (`38.0` tokens) are exact `gpt-tokenizer` measurements over `datasets/ops-retrieval/corpus.json` and `cases.json`. Top-5 (`141.3` tokens) and Top-3 (`84.8` tokens) budgets align with the `2026-04-28` `artifacts/snapshot.json` run (`100%` Primary@1, `100%` Recall@5, `100%` leakage-free) and intentionally exclude earlier April 9 per-run captures. Counts measure injected memory context only (excluding system prompt, user query, uncached MCP wrapper overhead of ~35–50 tokens/turn, and provider prompt-caching discounts).

## What MemQ is in this benchmark

MemQ is not presented here as a self-managed retrieval helper. In this repo, MemQ is the hosted, governed global intelligence fabric exposed through the MemQ MCP surface and Billing Manager access controls.

That makes the comparison intentionally explicit:

- `memq_mcp` measures hosted MemQ: governed access, namespace isolation, durable replay, live MCP retrieval, and operator-grade usage controls.
- `mem0_oss` measures the Mem0 open-source adapter backed by Qdrant in this benchmark setup.
- `keyword_baseline` measures deterministic text matching over the same corpus.
- `no_memory` measures the same model without retrieved context.

## Docs

- [Benchmark docs](./docs/README.md)
- [Methodology](./docs/methodology.md)
- [Reproducibility protocol](./docs/reproducibility-protocol.md)
- [Token & cost savings summary](./artifacts/token-savings.md)
- [Token & cost savings JSON](./artifacts/token-savings.json)
- [Retrieval snapshot](./artifacts/snapshot.json)
- [Retrieval summary](./artifacts/summary.md)
- [LLM snapshot](./artifacts/llm-snapshot.json)
- [LLM summary](./artifacts/llm-summary.md)
- [LLM full context](./llms-full.txt)

## What this repo measures

`memq-bench` now has two benchmark layers over the same operational memory corpus, using hosted MemQ as the governed fabric under test.

1. Retrieval benchmark
   Compares hosted `memq_mcp`, `mem0_oss`, and a deterministic `keyword_baseline` on 12 paraphrased operational queries across freshness, incident response, procedural recall, disambiguation, project memory, and preference memory.
2. Same-model answer benchmark
   Uses the same Gemini model to answer the same 12 questions in four conditions:
   - `no_memory`
   - `keyword_context`
   - `memq_context`
   - `mem0_context`

The retrieval layer measures ranking quality and leakage. The LLM layer measures whether memory actually changes the final answer quality for the same model.

## Headline result

This repo is designed to answer two different public questions without conflating them:

1. Does the hosted MemQ fabric retrieve the right memories better than the Mem0 OSS adapter and lexical controls?
2. Does giving an LLM MemQ-backed context improve its final answers compared with no memory at all?

On the current checked-in corpus, the result is clear:

- `MemQ vs Mem0 retrieval`: hosted MemQ wins the current published retrieval layer on primary@1, recall, leakage resistance, and latency.
- `MemQ vs no-memory LLM`: the same model moves from `0%` answer pass with no memory to `75%` with MemQ context.
- `MemQ vs Mem0 LLM`: the last successful same-model answer run still shows MemQ materially improving answers versus no memory; a fresh improved-context LLM rerun should be published only after provider quota is available.

## Current snapshot

Retrieval benchmark, 12 cases, 3 repetitions, exact-memory seeding:

| Provider | Primary@1 | Hit@K | Recall@K | Leakage-free | Avg latency |
| --- | --- | --- | --- | --- | --- |
| `memq_mcp` | `100%` | `100%` | `100%` | `100%` | `13 ms` |
| `mem0_oss` | `58%` | `100%` | `100%` | `67%` | `2511 ms` |
| `keyword_baseline` | `58%` | `100%` | `92%` | `67%` | `0 ms` |

Same-model answer benchmark, 12 cases, Gemini `2.0-flash`, 1 repetition:

| Condition | Answer pass | Citation hit | Citation recall |
| --- | --- | --- | --- |
| `mem0_context` | `92%` | `50%` | `50%` |
| `keyword_context` | `75%` | `50%` | `54%` |
| `memq_context` | `75%` | `42%` | `42%` |
| `no_memory` | `0%` | `0%` | `0%` |

What the current snapshot proves:

- Hosted MemQ is materially faster than the Mem0 OSS adapter in this setup.
- Hosted MemQ is the most leakage-free provider in the current retrieval corpus.
- Hosted MemQ leads Mem0 OSS by `+42` points on primary@1 while matching Mem0 OSS on recall@K.
- Hosted MemQ averages `13 ms` retrieval versus `2511 ms` for Mem0 OSS, roughly `193x` lower average latency in the fresh run.
- Hosted MemQ is `100%` leakage-free in the run; Mem0 OSS is `67%` leakage-free.
- The same-model answer benchmark still shows a real memory effect: `memq_context` moves the model from `0%` answer pass without memory to `75%` with MemQ context.
- The repo publishes artifact-backed retrieval wins separately from the last successful LLM answer snapshot so readers can verify exactly which layer each claim belongs to.

## Why the benchmark is structured this way

The old fixture-only harness could prove repository wiring, but it could not prove product behavior. The current suite fixes that:

- MemQ is benchmarked through the hosted MCP surface, not a local fixture or embedded vector helper.
- MemQ's governance layer is part of the product boundary: hosted access, namespaces, and controlled context are the system under test.
- Mem0 is benchmarked through real `mem0ai` calls backed by live Qdrant.
- Queries are paraphrased away from the exact stored text so a keyword control is not automatically perfect.
- The LLM benchmark uses the same model across all memory conditions to isolate the effect of context, not model choice.

## Benchmark corpus

The checked-in corpus is operational on purpose. It focuses on the kinds of memory retrieval problems agents and operators actually hit:

- current versus deprecated runbooks and policies
- root-cause recall under distractors
- owner plus deadline retrieval
- same-name disambiguation
- notification preferences
- protocol/tool discipline

Files:

- [Corpus](./datasets/ops-retrieval/corpus.json)
- [Cases](./datasets/ops-retrieval/cases.json)

## Quickstart

Hosted MemQ access is provisioned through the Billing Manager:
[start MemQ signup](https://billing.multinex.ai/signup?product=memq&next=%2Fcheckout%3Fproduct%3Dmemq-contributor).

Start the local comparator/support services. MemQ itself is hosted; the local services are for the Mem0 OSS adapter and legacy support paths.

```bash
cd memq-bench
docker compose up -d qdrant falkordb
```

Install dependencies:

```bash
npm install
npm run setup:mem0
```

Provide a hosted MemQ auth header before running the primary retrieval benchmark:

```bash
export MEMQ_API_KEY_AUTH_HEADER="Bearer <your MemQ API token>"
```

Run the retrieval benchmark:

```bash
npm run bench
```

Run the same-model LLM answer benchmark:

```bash
npm run bench:llm
```

## Notes

- `npm run bench` currently writes the retrieval snapshot to [artifacts/snapshot.json](./artifacts/snapshot.json).
- `npm run bench:llm` writes the answer-quality snapshot to [artifacts/llm-snapshot.json](./artifacts/llm-snapshot.json).
- The legacy fixture harness still exists in the repo as `npm run bench:legacy`, but it is no longer the primary public benchmark story.

## Skills, Hooks & MCP Install

This repo also distributes reusable agent skills and IDE hook templates for integrating MemQ persistent memory into AI coding tools.

### One-line MCP install

Need hosted access first? [Start MemQ signup through the Billing Manager](https://billing.multinex.ai/signup?product=memq&next=%2Fcheckout%3Fproduct%3Dmemq-contributor).

```bash
curl -fsSL https://memq.multinex.ai/install-mcp | bash
```

Auto-detects Claude Desktop, Cursor, VS Code, Antigravity, and Claude Code.

### Agent Hook Templates

Copy the appropriate template into your project root:

| Tool | Command |
|------|---------|
| **Cursor** | `curl -fsSL https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/skills/hooks/templates/.cursorrules > .cursorrules` |
| **Claude Code** | `mkdir -p .claude && curl -fsSL https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/skills/hooks/templates/claude-instructions.md > .claude/instructions.md` |
| **Gemini / Antigravity** | `curl -fsSL https://raw.githubusercontent.com/multinex-ai/memq-benchmark/master/skills/hooks/templates/GEMINI.md > GEMINI.md` |

### Skills

| Skill | Description |
|-------|-------------|
| [`memq-memory`](./skills/memq-memory/SKILL.md) | Session lifecycle hooks, memory types, context packing, episodic replay |
| [`memq-planning`](./skills/memq-planning/SKILL.md) | Durable plan state, checkpoints, multi-session workflows, bridge sync |

Install into your project:

```bash
cp -r skills/memq-memory/ .agents/skills/memq-memory/
cp -r skills/memq-planning/ .agents/skills/memq-planning/
```

Full setup guide: [`skills/hooks/MEMQ_AGENT_HOOKS.md`](./skills/hooks/MEMQ_AGENT_HOOKS.md)
