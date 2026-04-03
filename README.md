# Global Shell-Tracker: Cross-Border Fraud Detection AI

> A multi-signal detection system for identifying financial irregularities
> in cross-border transactions — integrating document, entity, and relationship
> signals into a unified risk scoring pipeline.

[![Status](https://img.shields.io/badge/status-in%20design-lightgrey)]()
[![Solo Project](https://img.shields.io/badge/built%20by-1%20person-lightgrey)]()

---

## The Problem

Cross-border financial fraud evades detection because no single signal is enough.

Traditional rule-based systems fail when fraud is distributed across:
- **Unstructured documents** — invoices and emails with subtle linguistic anomalies
- **Fragmented entity data** — inconsistent identities across jurisdictions
- **Hidden relationships** — indirect links between actors that only appear
  suspicious in aggregate

The gap isn't in any one detector. It's in the integration.

---

## Approach

The system is structured as a modular three-signal pipeline.
Each layer handles a distinct signal type;
the outputs are fused into a composite risk score.

### Document analysis
Extracts textual and structural signals from financial documents.
Flags anomalies in tone, formatting, and metadata patterns
that may indicate fabricated or manipulated records.

### Entity verification
Validates consistency across structured data sources.
Handles entity resolution across fragmented or jurisdiction-inconsistent records.
Detects red flags in identity attributes and cross-reference mismatches.

### Relationship modeling
Represents connections between entities and individuals as a graph structure.
Surfaces indirect or hidden links that may indicate shell company patterns
or coordinated fraud networks. *(Planned)*

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
    Signal Fusion Layer
          │
    ┌─────┴─────┐
 Risk Score   Explanation
  (0–100)    (text-based)
```

---

## Output

**Risk Score (0–100)** — composite score weighted across all three signal layers.

**Explanation** — human-readable reasoning surfaced alongside the score.
Example: `"Flagged due to inconsistent entity metadata and abnormal invoice formatting."`

The explanation layer follows the same interpretable fraud detection pattern
established in Dandi's expenditure alert system:
baseline modeling → threshold deviation → alert → rationale.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Core pipeline | Python |
| Data layer | SQL |
| Relationship modeling | Graph-based modeling *(planned)* |
| Explanation module | LLM-based reasoning *(planned)* |

---

## Current Status

- [x] Pipeline architecture design
- [x] Three-signal detection logic specification
- [ ] Synthetic data generation (normal vs. anomalous scenarios)
- [ ] Document and entity signal extractors
- [ ] Graph modeling layer
- [ ] LLM explanation module

---

## What I Learned

- Designing multi-signal fusion architectures for financial anomaly detection
- Structuring entity resolution as a standalone, reusable module
- Translating regulatory fraud patterns (shell companies, invoice manipulation)
  into engineering-level detection logic
- Scoping an MVP that remains honest about what is designed vs. implemented

---

> **Related projects**
>
> [Dandi](https://github.com/si3ae/Dandi-AI_Accounting_Automation_System) — the same anomaly detection pattern (baseline → deviation → alert),
> applied to small merchant financial health at the civic level
>
> [Financial Intelligence Terminal](https://github.com/si3ae/Financial_Intelligence_Terminal) — multi-source signal aggregation
> for cross-border market monitoring; shares the data normalization architecture

---

Built by Sinae Hong · [LinkedIn](https://www.linkedin.com/in/sinae-hong-583306216/)
