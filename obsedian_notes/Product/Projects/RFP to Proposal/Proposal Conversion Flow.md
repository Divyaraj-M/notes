---
name: RFP to Proposal — Conversion Flow
tags:
  - new_feature/dossiers/rfp_to_proposal/v1
  - product/flow
---

# RFP to Proposal — Conversion Flow

This document outlines the end-to-end flow for converting an RFP (Request for Proposal) into a finished Proposal within the platform.

---

## 1. Starting Point — Inside the RFP

The conversion process begins from within an existing RFP project. The RFP contains structured data organized as:

```
Project
 └── Section
      └── Sub Section
           └── Question → Answer
```

**Supported input file formats:** XLS, XLSX, CSV, DOC

**Associated documents** are also attached at the project level.

---

## 2. User Initiates Proposal Conversion

From inside the RFP, the user triggers the **"RFP to Proposal"** conversion flow. This kicks off a guided process.

---

## 3. User Selects Responses

The user chooses which responses from the RFP to include in the proposal.

> [!question] Open Questions
> - Do we need to let users select responses based on **section** and **question status** (Draft, Pending Review, Reviewed, Unanswered)?
> - How should responses be structured if **unanswered** responses are chosen?
> - AI has to get the context of the RFP and create the **subheadings** automatically.

---

## 4. Field Mapping

Selected responses and fields from the RFP are mapped to the proposal structure. See [[Field Mapping]] for details.

---

## 5. Proposal Format — User Decision

The user picks one of three proposal output formats:

| Format | Description |
|---|---|
| **Executive Conclusion + Q&A** | AI generates an executive summary, followed by the Q&A content from the RFP |
| **Q&A Verbatim Only** | Responses are carried over as-is from the RFP — no AI rewriting |
| **Draft as Fresh Proposal** | AI uses the RFP context to generate a completely new, polished proposal |

---

## 6. User Selects Template

The user picks a **proposal template** that defines the layout and formatting of the output document. See [[Proposal Template flow]] for template details.

---

## 7. AI Processing — Answering & Reviewing

The selected responses and user inputs are sent to the AI engine:

1. AI receives the **RFP context**, selected responses, and template structure
2. AI generates or structures the proposal content based on the chosen format (Step 5)
3. The user **reviews** the AI-generated output before finalizing

> [!info] Needs Work
> - Define the **AI prompt** for the Executive Summary and Fresh Proposal formats
> - Prepare **example outputs** for higher quality generation

---

## 8. Download or Create Proposal

Once the user is satisfied with the review, they can:

- **Download** the proposal as a document
- **Create** the proposal within the platform (see [[Proposal]])

---

## Open Questions & Decisions

> [!warning] To Resolve
> - Do we need **finished projects** only, or can in-progress projects also be converted?
> - If there are **no questions filled with answers**, what should happen? (Block conversion? Warn?)
> - Do we need the **section structure of the RFP** to create a proposal, or can it be flat?
> - **Knowledge Hub (KH)** should be inherited from the RFP automatically
> - Do we need an option for users to add **extra KH** sources? **Current decision: No**

---

## Flow Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Inside the RFP                        │
│          (Sections → Questions → Answers)                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  User Selects Responses │
          │  (by status / section)  │
          └────────────┬───────────┘
                       │
                       ▼
             ┌──────────────────┐
             │   Field Mapping   │
             └────────┬─────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │   Choose Proposal Format  │
        │  ┌────────────────────┐  │
        │  │ Exec Summary + Q&A │  │
        │  │ Q&A Verbatim Only  │  │
        │  │ Fresh Proposal     │  │
        │  └────────────────────┘  │
        └────────────┬─────────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │  Select Template     │
          └──────────┬──────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │   AI Processing &        │
        │   User Review            │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │  Download / Create       │
        │  Proposal                │
        └──────────────────────────┘
```

---

*Restructured from the original Excalidraw diagram in `Proposal Conversion.md`*
