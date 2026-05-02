# Global Shell-Tracker (BakerStreet)

> A multi-signal fraud detection system with a verifiable reasoning
> interface — built for cross-border shell company and AML
> investigation across secrecy jurisdictions (BVI, Singapore, Delaware,
> Cayman, Switzerland).
>
> Currently in architecture design phase; synthetic data pipeline
> implementation starting.

[![Status](https://img.shields.io/badge/status-architecture%20defined-blue)](#)
[![Phase](https://img.shields.io/badge/phase-1%20implementation%20starting-orange)](#)

> **Detection finds signals. BakerStreet makes them inspectable.**

---

## Project Status

This repository currently holds the **system design and context**, not
working code. Implementation is starting in Phase 1 (synthetic data
pipeline using IBM AML-Data and ICIJ Offshore Leaks as seeds).

The README is structured to make the design verifiable:
* What is being built and why
* Architectural decisions made so far
* Open questions still to resolve
* What is *not yet* implemented

---

## The Problem

Cross-border shell company fraud evades single-signal detection because
the pattern is distributed across layers:

* **Unstructured documents** — invoices and emails with subtle linguistic
  anomalies that don't trigger keyword filters
* **Fragmented entity data** — inconsistent identities across
  jurisdictions, legitimate by themselves but suspicious in aggregate
* **Hidden relationships** — indirect links between entities (shared
  registered agents, common nominee directors, matching IP addresses)
  that surface only when modeled as a graph

The gap isn't in any one detector — it's in the integration. Existing
specialized tools (Palantir-class) handle this but require expert
operators and substantial licensing budgets. The goal here is to make
the same class of pattern recognition operable by junior compliance
analysts and investigative journalists — by externalizing the reasoning
process itself, not just the result.

---

## Approach

A modular pipeline separates **detection** (deterministic algorithms)
from **structuring** (LLM-based reasoning); outputs are then externalized
through a dedicated reasoning interface (BakerStreet) rather than reduced
to a single risk score.

### Signal layers

**Document analysis** — extracts textual and structural signals from
financial documents. Flags anomalies in tone, formatting, and metadata
patterns that may indicate fabricated or manipulated records.

**Entity verification** — validates consistency across structured data
sources. Handles entity resolution across jurisdiction-inconsistent
records. Detects red flags in identity attributes and cross-reference
mismatches.

**Relationship modeling** — represents connections between entities,
accounts, and IPs as a graph. Surfaces indirect links that may indicate
shell company patterns (e.g. circular fund flows: A → B → C → A).

### Pattern Detector — deterministic detection

Detection is **not** delegated to the LLM. A deterministic pattern
detector runs over the raw data and identifies three structural patterns:

* **cycle** — circular fund flows across jurisdictions
* **hub** — entities sharing a common nominee director or registered
  agent
* **dispersion** — single entity holding accounts across multiple
  jurisdictions

This separation ensures detection results are reproducible and
verifiable independently of the LLM.

### Gemma — structuring, not detection

Gemma's role is **not detection** — it's structuring. Given the
detector's output (suspect entities + pattern hints) and the relevant
raw records, Gemma produces:

* edges with explicit `(from, to, type, evidences)` structure
* each evidence carries a `kind` (e.g. "shared registered agent") and
  `refs` to specific raw record IDs
* a brief natural-language summary

The LLM's claims are not trusted blindly. Every evidence reference must
point to a record in the raw data layer, which is queried independently
by the frontend to verify consistency.

### Verification Loop

This is the core mechanism that distinguishes BakerStreet from generic
"explainable AI":

```
Gemma output: { kind: "shared registered agent", refs: ["reg_007"] }
        ↓
Frontend looks up reg_007 in the raw data store
        ↓
Checks: does this record actually link the claimed entities?
        ↓
Pass → render normally
Fail → demote evidence visually, log warning
```

Every visual element (ripples, tags, lines) is a direct mapping of a
verified evidence claim, not a UI flourish. Investigators can click any
tag and see the exact raw record that supports it. **The LLM produces
claims; the frontend verifies them against an independent source.**

### Interpretation Layer (BakerStreet)

A dedicated visualization interface that renders the **Inference Graph
Layer** as its structural output:

* entities → nodes
* `flow` edges → directed arrows (fund movement)
* `shared_attribute` edges → dashed lines (common agent, IP, nominee)
* evidence → clickable tags backed by raw records

The two edge layers are visually separated so investigators can see
fund flow and shared-attribute clusters as independent dimensions of
suspicion that reinforce each other.

---

## Pipeline Architecture

```
Input
  ├── Synthetic transactions (IBM AML-Data seed)
  ├── Synthetic entities (ICIJ Offshore Leaks seed, structure only)
  └── Synthesized narrative (Nemotron-4: names, transaction memos)
          │
          ▼
   Raw Data Layer  ── independent verification source
          │
          ▼
   Pattern Detector  ── deterministic (cycle / hub / dispersion)
          │
          ▼
   Pre-filter  ── extracts suspects + relevant records
          │
          ▼
   Gemma reasoning engine
   (structures evidence, attaches raw record refs, writes summary)
          │
          ▼
   Inference Graph Layer
   (nodes, edges, evidence with refs)
          │
          ▼ (verification: independent lookup in raw store)
          │
    ┌─────┴─────┐
 Risk Score   BakerStreet
  (0–100)    (graph + verified tags + rationale)
```

---

## Design Decisions

A few decisions worth being explicit about at this stage:

* **Detection vs. structuring separation** — detection is deterministic
  and reproducible; the LLM only structures already-detected suspicion
  into human-readable form. This avoids the trap of using an LLM to
  validate its own output.

* **Verification loop over post-hoc explanation** — every LLM claim
  carries raw record references that the frontend independently
  verifies. This is the project's core philosophy: the LLM produces
  claims, an independent layer checks them.

* **Synthetic data with public seeds, initially** — fraud datasets with
  ground-truth labels are scarce and licensing-heavy. The pipeline uses
  IBM AML-Data (transaction patterns + laundering labels) and ICIJ
  Offshore Leaks (entity structure, jurisdiction distribution,
  registered agent patterns) as seeds. Nemotron-4 synthesizes natural
  language elements (entity names, transaction memos) on top of this
  structure. Statistical similarity is bounded to marginal
  distributions; structural patterns (cycle, hub, dispersion) are
  imposed as explicit constraints rather than claimed as emergent.

* **Graph reasoning over rule-based** — relationship signals matter more
  than any single transaction, so the relationship layer is graph-native
  from the start rather than retrofitted onto a tabular pipeline.

* **Modular signal layers** — each detector (document, entity,
  relationship) is independently testable and replaceable. Fusion is a
  separate layer, not entangled with detection.

---

## Open Questions

Things still being worked out:

* Weighting strategy in the fusion layer — equal, learned, or
  rule-prioritized
* Confidence calibration when only one or two signals fire
* Graph traversal depth limits for the relationship layer
  (false-positive trade-off)
* BakerStreet interface — animation timing and graph layout strategy
  for cases with 10+ entities
* Tie-breaking rules in derived state (top accounts, hub nodes) when
  degree values collide

---

## Tech Stack

| Layer | Technology |
|---|---|
| Synthetic data seeds | IBM AML-Data (Kaggle), ICIJ Offshore Leaks |
| Narrative synthesis | Nemotron-4 (via NVIDIA NIM) |
| Core pipeline | Python |
| Pattern detection | Deterministic (Python, graph algorithms) |
| Reasoning engine | Gemma (via NVIDIA NIM) |
| Interpretation interface | React + Zustand + SVG + Framer Motion (BakerStreet) |

---

## Phase 1 Scope

Currently starting:

* Data acquisition — IBM AML-Data and ICIJ Offshore Leaks
* Synthetic data pipeline — entity/account/transaction merging,
  structural pattern injection, raw record cross-referencing
* Pattern Detector — cycle/hub/dispersion algorithms
* Document signal extractor — initial prototype

Not yet started: entity verification module, relationship graph layer,
Gemma reasoning integration, BakerStreet interface implementation,
fusion logic, Nemotron narrative synthesis.

---

## Related Projects

The same interpretability-first pattern, applied across financial
domains:

> **[Dandi](https://github.com/si3ae/Dandi-AI_Accounting_Automation_System)** — civic-level financial AI for cash-heavy SMBs;
> shipped working prototype; same anomaly detection pattern (baseline →
> deviation → alert → rationale)
>
> **[Financial Intelligence Terminal](https://github.com/si3ae/Financial_Intelligence_Terminal)** — multi-source signal aggregation
> for cross-border market monitoring; shares the data normalization
> approach used here

---

Built by Sinae Hong · [LinkedIn](https://www.linkedin.com/in/sinae-hong-583306216/)
