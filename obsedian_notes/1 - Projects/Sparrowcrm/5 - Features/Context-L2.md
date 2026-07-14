
## 1. What this layer is

Layer 2 is the workspace's **structured working memory** — deliberately authored facts about who this customer is and how they operate. It answers **"who is this business, and what are its rules?"** and is _always injected_ into the reasoning that needs it, because it's small and cross-cutting.

Context is not about any single record (that's Layer 1) and not a pattern learned across records (that's Layer 3). It's the standing description of the business itself — stated once by an admin, true until changed.

---

## 2. What it holds

- **Business & product profile** — what the customer sells, to whom, how they position.
- **ICP definition** — what a good-fit account and contact look like. **Must be structured** (firmographic ranges, roles, industries as fields/values), not prose — because signals score against it and can't compute over a paragraph.
- **Process conventions** — pipeline stage definitions, stage-entry criteria, staleness thresholds, workflow norms. This is the slice deal hygiene depends on, and it must be **machine-usable** (stage → required fields, stage → staleness days), not descriptive text.
- **Terminology** — what custom fields and internal terms mean in this workspace.
- 

---

## 3. Why it's always-injected, not retrieved

Context is small and relevant to nearly everything, so it's cheaper and more reliable to inject it whole than to search for it. This is the defining difference from Layer 3: **Context is always present; the Knowledge Base is pulled on demand.** The retrieval model — not the content — is what separates L 2 from L 3.

---

## 4. Nature of this layer

|Property|Value|
|---|---|
|Altitude|Workspace — about the business as a whole|
|Origin|Deliberately authored by admins|
|Change rate|Rare, intentional|
|Retrieval|Always injected|
|Reasoned about or with|**With** — the lens for reasoning|
|If wrong|Every action using it is subtly and silently off|

Because a wrong ICP or stage rule distorts _every_ action that touches it, Context is high-leverage and needs a named owner and deliberate review — not crowdsourced edits.

---

## 5. Who consumes it (selective)

- **Deal hygiene** — process conventions only, for the stage-consistency check.
- **Research / prospecting** — ICP and business profile to judge fit.
- **ICP-dependent signals** — buying intent / buyer profile score against structured ICP attributes.
- **Zulie** — for fit/strategy questions, not record lookups.
- **Contact hygiene, behavioral signals** — do not use Context at all.

---

## 6. The structured-not-prose requirement

The single most important build note for this layer: **Context that agents compute against must be structured data, not free text.** HubSpot-style free-text Context ("we sell to mid-market SaaS") is fine for grounding _tone_ in a Zulie answer, but useless for a signal that needs to score "does this account's employee count fall in the ICP's ideal range?" or a hygiene agent evaluating "does this stage have its required fields?" Free-text describes; structure computes. The process-conventions and ICP slices must be structured; the profile/terminology slices can be prose.

---

_Companion docs: Knowledge (parent) · Layer 1 — Records · Layer 3 — Knowledge Base._