# Global Shell-Tracker (BakerStreet)

> A multi-signal fraud detection system with a verifiable reasoning
> interface — integrating multi-signal detection into a verifiable
> reasoning interface for cross-border financial investigation.
>
> Currently in architecture design phase; synthetic data generation
> (Nemotron-4) starting.

[![Status](https://img.shields.io/badge/status-architecture%20defined-blue)](#)
[![Phase](https://img.shields.io/badge/phase-1%20implementation%20starting-orange)](#)

> **Detection finds signals. BakerStreet makes them inspectable.**

---

## Project Status

This repository currently holds the **system design and context**, not
working code. Implementation is starting in Phase 1 (synthetic data
generation via Nemotron-4).

The README is structured to make the design verifiable:
* What is being built and why
* Architectural decisions made so far
* Open questions still to resolve
* What is *not yet* implemented

---

## The Problem

Cross-border financial fraud evades single-signal detection because the
pattern is distributed across layers:

* **Unstructured documents** — invoices and emails with subtle linguistic
  anomalies that don't trigger keyword filters
* **Fragmented entity data** — inconsistent identities across jurisdictions,
  legitimate by themselves but suspicious in aggregate
* **Hidden relationships** — indirect links between entities (shared
  accounts, common IPs, recurring representatives) that surface only when
  modeled as a graph

The gap isn't in any one detector — it's in the integration. Existing
specialized tools (Palantir-class) handle this but require expert operators
and substantial licensing budgets. The goal here is to make the same
class of pattern recognition operable by junior investigators — by
externalizing the reasoning process itself, not just the result.

---

## Approach

A modular three-signal pipeline feeds into a fusion layer; outputs are
then externalized through a dedicated reasoning interface (BakerStreet)
rather than reduced to a single risk score.

### Signal layers

**Document analysis** — extracts textual and structural signals from
financial documents. Flags anomalies in tone, formatting, and metadata
patterns that may indicate fabricated or manipulated records.

**Entity verification** — validates consistency across structured data
sources. Handles entity resolution across jurisdiction-inconsistent records.
Detects red flags in identity attributes and cross-reference mismatches.

**Relationship modeling** — represents connections between entities,
accounts, and IPs as a graph structure. Surfaces indirect or hidden links
that may indicate shell company patterns or coordinated fraud networks
(e.g. circular fund flows: A → B → C → A).

### LLM-based reasoning (Gemma)

Gemma is not used as a standalone decision-maker, but as a reasoning
engine that structures evidence into an interpretable format.

Given multi-signal inputs (document, entity, relationship), Gemma:

* organizes connections into explicit relationships
* attaches human-readable evidence to each connection
* produces both structured graph outputs and textual summaries

Its role is not detection, but **externalization of reasoning** —
transforming signals into a form that investigators can inspect and verify.

### Interpretation Layer (BakerStreet)

A dedicated visualization and reasoning interface that externalizes the
inference process into a graph-based, human-verifiable structure.

The pipeline produces an **Inference Graph Layer** as its structural
output — a graph of nodes (entities, accounts, IPs), edges (relationships
backed by evidence strings), and pattern hints (e.g. cycle, hub,
dispersion). BakerStreet renders this graph directly:

* entities → nodes
* relationships → edges
* evidence → visual tags

This separation matters: the AI produces the graph, the UI renders the
graph, and there is no string parsing in between. Every visual element
(ripples, tags, lines) is a direct mapping of an LLM output token, not a
UI flourish. Investigators validate connections rather than trust
predictions.

---

## Pipeline Architecture

```
Input
  ├── Financial documents (invoices, emails)
  ├── Structured entity records
  └── Transaction metadata
          │
  ┌───────┼───────┐
  ▼       ▼       ▼
 Doc   Entity  Relationship
Analysis Verify  Modeling
  └───────┼───────┘
          │
   Gemma reasoning engine
   (signal → structured evidence)
          │
   Inference Graph Layer
   (nodes, edges, evidence)
          │
    ┌─────┴─────┐
 Risk Score   BakerStreet
  (0–100)    (graph + tags + rationale)
```

---

## Design Decisions

A few decisions worth being explicit about at this stage:

* **Separation of detection and interpretation** — the system
  distinguishes between signal generation (detection layers) and
  reasoning externalization (BakerStreet interface), ensuring that
  model outputs remain verifiable rather than opaque. This is the core
  philosophy of the project.

* **Synthetic data over real data, initially** — fraud datasets with
  ground-truth labels are scarce and licensing-heavy. Nemotron-4 generates
  three structural patterns (circular flows, multi-account dispersion,
  hub accounts) seeded from public Kaggle and government fraud datasets
  to preserve statistical similarity. This unblocks development without
  data access negotiations.

* **Graph reasoning over rule-based** — relationship signals matter more
  than any single transaction, so the relationship layer is graph-native
  from the start rather than retrofitted onto a tabular pipeline.

* **Interpretability as a first-class output, not a post-hoc explanation** —
  the rationale is generated from the same evidence chain used in
  detection, not reconstructed afterward. This is the same pattern
  established in [Dandi](https://github.com/si3ae/Dandi-AI_Accounting_Automation_System)
  for expenditure alerts: baseline → deviation → alert → rationale.

* **Modular signal layers** — each detector (document, entity,
  relationship) is independently testable and replaceable. Fusion is a
  separate layer, not entangled with detection.

---

## Open Questions

Things still being worked out:

* Weighting strategy in the fusion layer — equal, learned, or
  rule-prioritized
* Confidence calibration when only one or two signals fire
* Graph traversal depth limits for the relationship layer (false-positive
  trade-off)
* BakerStreet interface — animation timing and graph layout strategy
  for cases with 10+ entities

---

## Tech Stack

| Layer | Technology |
|---|---|
| Synthetic data | Nemotron-4 |
| Core pipeline | Python |
| Data layer | SQL |
| Relationship modeling | Graph-based (library TBD) |
| Reasoning engine | Gemma (via NVIDIA NIM) |
| Interpretation interface | React + SVG + Framer Motion (BakerStreet) |

---

## Phase 1 Scope

Currently starting:

* Nemotron-4 synthetic data generation — three pattern types
* Pattern fidelity validation against public fraud-data baselines
* Document signal extractor — initial prototype

Not yet started: entity verification module, relationship graph layer,
Gemma reasoning integration, BakerStreet interface implementation,
fusion logic.

---

## Related Projects

The same interpretability-first pattern, applied across financial domains:

> **[Dandi](https://github.com/si3ae/Dandi-AI_Accounting_Automation_System)** — civic-level financial AI for cash-heavy SMBs;
> shipped working prototype; same anomaly detection pattern (baseline →
> deviation → alert → rationale)
>
> **[Financial Intelligence Terminal](https://github.com/si3ae/Financial_Intelligence_Terminal)** — multi-source signal aggregation
> for cross-border market monitoring; shares the data normalization
> approach used here

---

Built by Sinae Hong · [LinkedIn](https://www.linkedin.com/in/sinae-hong-583306216/)
