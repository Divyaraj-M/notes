
## The Two Docs

| Doc                  | Who writes it  | When                     | Who reads it        | Jira tickets                        |
| -------------------- | -------------- | ------------------------ | ------------------- | ----------------------------------- |
| [[PRD Feature Name]] | PM             | Before design starts     | Designer + everyone | Story Definition + Design sub-tasks |
| [[FRD Template]]     | PM + Tech Lead | After design is approved | Devs + QA           | Dev Stories + atomic sub-tasks      |

## The Flow

```
PRD (PM writes problem + goals + screens + flows)
  ↓
  ├── Jira: Story Definition ticket created
  ├── Jira: Design sub-tasks created (one per screen)
  ↓
Designer works from PRD §6-8 (Flows, Screens, Constraints)
  ↓
Design Review → Approved in Figma
  ↓
FRD (PM + Tech Lead translate Figma into granular specs)
  ↓
  ├── Jira: Dev Story tickets created (one per screen/slice)
  ├── Jira: Atomic sub-tasks (BE endpoint, FE build, FE states, QA)
  ↓
Development begins
```

## What Goes Where

**"Should we build this?"** → PRD §1-5 (Problem, Goals, Stories, Requirements)

**"What screens does this need?"** → PRD §6-8 (Flows, Screens, Constraints)

**"How exactly should each interaction work?"** → FRD §2 (Screen Specs with interaction tables)

**"What API do I call?"** → FRD §3 (API Contracts)

**"What could break?"** → FRD §5 (Blast Radius)

**"What tickets do I work on?"** → PRD §12 (Design tickets) + FRD §11 (Dev tickets)

## Jira Ticket Structure

```
Epic: [Feature Name]
  │
  ├── Story: [Feature] — Story Definition       ← created with PRD
  │     ├── Sub-task: Design — Screen 1          ← designer works these
  │     ├── Sub-task: Design — Screen 2
  │     └── Sub-task: Design — Flow review
  │
  ├── Story: [Screen 1] — Dev                   ← created with FRD
  │     ├── Sub-task: BE — API endpoint
  │     ├── Sub-task: BE — Migration
  │     ├── Sub-task: FE — Build populated state
  │     ├── Sub-task: FE — Build empty + error states
  │     ├── Sub-task: FE — Wire to API
  │     ├── Sub-task: FE — Validations
  │     ├── Sub-task: FE — Analytics events
  │     └── Sub-task: QA — Test cases
  │
  └── Story: [Screen 2] — Dev
        ├── Sub-task: ...
        └── ...
```

## Rules

1. **PRD owns the "what" and "why."** Screens and flows live here so the designer has one doc to work from.
2. **FRD owns the "how."** Every interaction, validation, API call, error state. Written after design is approved.
3. **Tickets trace back to spec sections.** Every Jira sub-task references the section it implements (e.g., "FRD §2 Screen 1"). No orphan tickets.
4. **Sub-tasks should be atomic.** Completable in under a day without needing full feature context.
5. **Full Ticket Tracker in the FRD is the single source of truth.** All tickets across both phases in one table.
6. **Don't duplicate content.** FRD links to PRD for problem/goals, links to Figma for visuals, only adds implementation detail.
    

## AI-Assisted Workflow

1. **PRD first** — give Claude the problem + goals. It drafts stories, requirements, screens, flows, and design Jira tickets.
2. **After design approval** — describe Figma screens to Claude. It generates the FRD with interaction tables, API contracts, and atomic dev tickets referencing back to spec sections.


Delete the gray placeholder text in both templates once you fill in real content.