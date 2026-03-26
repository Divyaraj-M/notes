---
name: Genie Actions inside the Questions card
tags:
  - new_feature/question_card/Genie_actions
Wireframe: https://stunning-froyo-2bbc4c.netlify.app/
author: Divyaraj Murugan
published:
type: PRD
product: SparrowGenie
feature:
status: Done
priority: Medium
owner: Divyaraj Murugan
sprint:
version: 1
share_link: https://share.note.sx/gqpeuwat#6s8xbn+EvYbrNH1s40sjIC311wLiIsgvWxUhq980Ng4
share_updated: 2026-03-25T23:19:00+05:30
---
## 1. Problem statement

When SparrowGenie generates an RFP answer, users frequently need to adjust it before submission — the answer may be too short, too verbose, sourced from the wrong knowledge base, or missing key context. Currently there is no structured way to refine a generated answer without manually editing or starting from scratch.

This problem affects proposal managers, compliance teams, and sales teams who work with SparrowGenie daily across 5+ Knowledge Hubs per project. The cost of not solving it is significant: users default to copy-pasting into external tools, breaking the feedback loop that improves future answers. In competitive RFP scenarios, slow iteration directly impacts win rates.

---

## 2. Goals

|#|Goal|Metric|
|---|---|---|
|1|Reduce time from generated answer to final submitted answer|Decrease average answer refinement time by 40% within 60 days of launch|
|2|Increase user confidence in source attribution|80%+ of regenerations via KH source picker include at least one source change|
|3|Reduce manual answer editing|30% reduction in post-generation text edits measured by character-level diff|
|4|Enable ad-hoc regeneration with user's own documents|15% of regenerations use the Upload source flow within 60 days|
|5|Enable ad-hoc document usage without KH clutter|Uploaded documents are ephemeral — used for regeneration only, not persisted to any KH|

---

## 3. Non-goals

|Non-goal|Reason|
|---|---|
|Bulk answer actions (apply expand/shorten to multiple answers at once)|Too complex for v1; requires batch job architecture. Revisit after single-answer adoption is validated.|
|Custom prompt-based regeneration with full LLM chat (Ask GenieAI as a chat thread)|Separate initiative. v1 Ask GenieAI is a single-turn prompt.|
|Answer version history / diff view|Valuable but separate feature. Out of scope to keep the dropdown lightweight.|
|Source-level confidence scoring (showing match %)|Requires ML pipeline changes. Can be layered on later without changing the UI structure.|
|Auto-suggesting expansion/shortening strategies based on RFP question type|Premature optimization. Need usage data from free-text prompts first to understand common patterns.|

---

## 4. User stories

### Regenerate answer

**As a proposal manager**, I want to regenerate an answer using the same sources so that I get a fresh variation without changing the source material.

**As a proposal manager**, I want to regenerate an answer with specific Knowledge Hub sources so that I can control which documents inform the response — including excluding files that added irrelevant content.

**As a proposal manager**, I want to see which sources were used for the current answer (pre-checked) and uncheck any I want to exclude so that I have full visibility and control over what goes into the regeneration.

**As a proposal manager**, I want to filter available sources by Knowledge Hub and by source type (Files, Websites, Q&A, Integrations) so that I can quickly find the right source across 5+ KHs with hundreds of items.

**As a proposal manager**, I want to search across all sources by name or keyword so that I do not have to manually browse through every Knowledge Hub.

**As a compliance team member**, I want to regenerate an answer using my own uploaded document so that I can incorporate the latest policy update without needing to add it to the Knowledge Hub first.

**As a compliance team member**, I understand that uploaded documents are used for this regeneration only and are not saved to any Knowledge Hub, so that KHs remain clean and curated with only intentionally added sources.

### Expand answer

**As a sales team member**, I want to expand a generated answer by describing what to add (e.g. "include more technical detail about our security certifications") so that the expansion is targeted and relevant rather than generic padding.

### Shorten answer

**As a proposal manager**, I want to shorten a generated answer by describing what to keep or remove (e.g. "keep only the pricing points, remove implementation details") so that the most relevant content is preserved.

### Ask GenieAI

**As any user**, I want to ask GenieAI a free-form question about the current answer so that I can get clarification, request specific edits, or ask follow-up questions without leaving the answer context.

---

## 5. Requirements

### 5.1 Must-have (P0)

#### 5.1.1 Main dropdown menu

The answer action dropdown displays four top-level options: Regenerate answer (with chevron indicating sub-menu), Expand answer (with chevron), Shorten answer (with chevron), and Ask GenieAI. The dropdown opens from the existing caret/chevron button next to each generated answer.

**Acceptance criteria:**

- Given a generated answer is displayed, when the user clicks the action caret, then the dropdown appears with all four options.
- Given the dropdown is open, when the user clicks outside or presses Escape, then the dropdown closes.
- Given the dropdown is open, when the user hovers over a row, then the row highlights.

#### 5.1.2 Regenerate — normal

Clicking "Regenerate" (first option in the regenerate sub-menu) regenerates the answer using the exact same sources as the original generation. No additional UI required — fires immediately.

**Acceptance criteria:**

- Given the user clicks Regenerate, when the generation completes, then the previous answer is replaced with the new one.
- Given a regeneration is in progress, when the user views the answer area, then a loading state is shown.

#### 5.1.3 Regenerate — pick sources

A multi-KH, multi-source-type picker panel (labeled "Pick sources") that lets users control which sources feed the regeneration. The panel uses progressive disclosure: it first shows only the sources used for the current answer, with an "Add more sources" trigger to expand the full browse experience.

**Acceptance criteria:**

- Given the Pick sources panel is open, when the user views "Sources used for this answer", then all sources from the previous generation are listed and pre-checked.
- Given any source is checked, when the user unchecks it, then it is excluded from the next regeneration.
- Given the user wants to add new sources, when they click the "Add more sources" trigger, then the search bar (auto-focused), KH pill filters, source type tabs, and available sources list are revealed.
- Given the add more section is open, when the user clicks "Close", then the browse experience collapses back to just the used sources and the trigger.
- Given the add more section is open and multiple KHs exist, when the user taps a KH pill filter (e.g. "Compliance"), then only sources from that KH are shown in the browse list.
- Given the type tabs are visible, when the user taps a type tab (Files / Websites / Q&A / Integrations), then only sources of that type are shown in the browse list.
- Given both KH filter and type tab are active, when viewing the browse list, then both filters are applied (AND logic). Filters do not affect the "Sources used" list.
- Given the user types in the search bar, when results update, then sources matching by name or KH name are shown in the browse list only.
- Given N sources are selected, when the user views the CTA button, then it reads "Regenerate with N sources" and updates dynamically.
- Given 0 sources are selected, when the user views the CTA, then the button is disabled (opacity reduced).

**Technical considerations:**

- Source list must be fetched from the project's KH configuration API.
- Each source item requires: source ID, name, type (file/website/qna/integration), parent KH ID, and a flag indicating whether it was used in the current answer.
- KH pill filters and type tabs should be client-side filtering on the already-fetched list, not separate API calls.

#### 5.1.4 Regenerate — upload source

A panel that lets users upload their own document and use it for regeneration. Uploaded files are used for the current regeneration only and are not persisted to any Knowledge Hub. This keeps the upload flow lightweight and avoids polluting KHs with one-off documents (e.g. draft RFP responses, competitor PDFs, or client-specific materials that do not belong in a shared knowledge base).

**Acceptance criteria:**

- Given the upload panel is open, when the user drags a file onto the dropzone or clicks to browse, then the file is uploaded and shown in the "Uploaded files" list.
- Given a file is uploaded, when the user views it in the list, then the filename, file size, and a remove (X) button are shown.
- Given a file is uploaded, when the user clicks the remove button, then the file is removed from the list.
- Given files are uploaded and the user clicks "Regenerate with my source", when the regeneration completes, then the uploaded files are discarded and not saved to any Knowledge Hub.
- Given the user navigates away from the upload panel without regenerating, when they return, then the uploaded files are cleared.
- Supported file types: PDF, DOCX, XLSX, TXT. Maximum file size: 25 MB.

**Important:** There is no "Save to Knowledge Hub" option in this flow. If users want to add a document to a KH permanently, they should use the Knowledge Hub management interface directly. This separation is intentional — the upload source flow is for ad-hoc, one-time regeneration with ephemeral documents.

#### 5.1.5 Expand answer

A panel with a single prompt box where users describe how they want the answer expanded. There are no word count controls, presets, or sliders — the user communicates their intent in natural language, giving them full flexibility over what kind of expansion they want.

**Acceptance criteria:**

- Given the Expand panel is open, when the user views it, then a text area with the label "Describe how you want it expanded" and a placeholder (e.g. "Add more technical detail, include examples, focus on compliance section, elaborate on pricing...") is displayed.
- Given the user types a description, when they click "Expand answer", then the answer is expanded according to their instructions.
- Given the user leaves the prompt empty, when they click "Expand answer", then the answer is expanded with general additional detail (default behavior).
- Given the expansion completes, when the user views the answer area, then the previous answer is replaced with the expanded version.

**Design rationale:** Word count controls were removed because LLMs rarely hit exact targets, and the preset/slider UI added complexity without proportional value. A free-text prompt gives users more meaningful control — they can say "add two more paragraphs about security" or "double the length with examples" which communicates intent better than a number.

#### 5.1.6 Shorten answer

A panel with a single prompt box where users describe how they want the answer shortened. Same pattern as Expand — no word count controls, just a free-text prompt for maximum flexibility.

**Acceptance criteria:**

- Given the Shorten panel is open, when the user views it, then a text area with the label "Describe how you want it shortened" and a placeholder (e.g. "Keep only the key points, remove examples, focus on pricing, make it concise...") is displayed.
- Given the user types a description, when they click "Shorten answer", then the answer is shortened according to their instructions.
- Given the user leaves the prompt empty, when they click "Shorten answer", then the answer is shortened with general trimming (default behavior — removes redundancy, tightens language).
- Given the shortening completes, when the user views the answer area, then the previous answer is replaced with the shortened version.

**Design rationale:** Same reasoning as Expand — a prompt like "keep only pricing and compliance points" communicates what to preserve far better than a target word count. Users care about which content survives, not the exact number of words.

### 5.2 Nice-to-have (P1)

#### 5.2.1 Ask GenieAI

A single-turn free-form prompt input that lets users ask questions or request specific edits in natural language. Appears as a text input with a send button.

**Acceptance criteria:**

- Given the user types a question, when they press Enter or click send, then GenieAI responds with an updated answer or an inline response.
- Given Ask GenieAI is used, when a response is returned, then the user can accept the change or revert.

#### 5.2.2 Source type icons in KH picker

Each source in the KH picker shows a distinct icon based on its type: file icon for Files, globe for Websites, chat bubble for Q&A, plug/connector for Integrations.

#### 5.2.3 KH color-coded tags

Each source shows a colored pill tag indicating which Knowledge Hub it belongs to (e.g. Product = purple, Compliance = teal, Sales = amber). Colors are consistent across the application.

#### 5.2.4 Remember last used sources

When a user opens the KH source picker for a second regeneration in the same session, the previous source selection (including any changes they made) is remembered.

### 5.3 Future considerations (P2)

#### 5.3.1 Bulk answer actions

Apply expand/shorten/regenerate to multiple answers in an RFP simultaneously. Requires batch processing architecture.

#### 5.3.2 Answer diff view

Show a visual diff between the original and regenerated/expanded/shortened answer so users can see exactly what changed.

#### 5.3.3 Source confidence scoring

Display a relevance/confidence score next to each source in the KH picker so users can make more informed inclusion/exclusion decisions.

#### 5.3.4 Prompt suggestions / quick actions

Offer pre-built prompt suggestions (e.g. "Add examples", "Focus on compliance", "Make executive-friendly") as quick-tap chips above the prompt box to help users who are unsure what to type. Based on usage data from the free-text prompts.

#### 5.3.5 Multi-turn Ask GenieAI

Upgrade Ask GenieAI from a single-turn prompt to a conversational thread with context memory within the answer.

---

## 6. Success metrics

### Leading indicators (1–2 weeks post-launch)

|Metric|Target|Stretch|Measurement|
|---|---|---|---|
|Feature adoption (% of users who use any answer action)|40% of active users|60%|Product analytics — action dropdown open events|
|Regenerate with Pick sources usage|25% of all regenerations use the source picker|40%|Event tracking — regeneration events with source changes|
|Expand/Shorten usage|20% of generated answers are expanded or shortened|35%|Event tracking — expand/shorten CTA clicks|
|Upload source usage|10% of regenerations use "Upload source"|20%|Event tracking — file upload events in upload panel|
|Expand/Shorten prompt usage|60% of expand/shorten actions include a description|80%|Event tracking — CTA clicks where prompt textarea is non-empty|

### Lagging indicators (4–8 weeks post-launch)

|Metric|Target|Stretch|Measurement|
|---|---|---|---|
|Answer refinement time reduction|40% faster from generation to final submission|55%|Time delta between answer generation and answer lock/submit|
|Manual edit reduction|30% fewer character-level edits post-generation|45%|Diff analysis on answer text between generation and submission|
|Upload source adoption|10% of regenerations use uploaded documents|20%|Event tracking — regeneration events with file uploads|
|Support ticket reduction (answer quality complaints)|15% reduction|25%|Support ticket tagging|
|User satisfaction (in-app survey)|4.0/5.0 for answer action usefulness|4.5/5.0|Post-action micro-survey (sampled)|

---

## 7. Open questions

|#|Question|Owner|Blocking?|
|---|---|---|---|
|1|What is the maximum number of sources that can be selected for a single regeneration? Is there an API/LLM context window limit?|Engineering|Yes|
|2|For expand/shorten with an empty prompt (no user description), what should the default behavior be? Should the LLM use a general heuristic, or should we require the user to type something?|Product + Design|Yes|
|3|How do we handle regeneration when the user has unsaved edits to the current answer? Warn and overwrite, or offer to save a copy?|Design|Yes|
|4|For "Upload source", since files are ephemeral and not saved to KH, can we process them in-memory without indexing? What is the expected latency?|Engineering|No|
|5|Should Ask GenieAI have access to the same sources as the original answer, or should it use a broader context?|Product|No|
|6|Do we need to enforce per-KH access permissions in the source picker (i.e. can a user see sources from a KH they do not have access to)?|Product + Engineering|Yes|
|7|What analytics events do we need to fire for each action? Do we need to capture the prompt text for internal quality analysis?|Data + Legal|No|

---

## 8. Timeline considerations

**Dependencies:**

- KH source listing API must support returning source type metadata (file/website/qna/integration) — confirm with backend team.
- File upload endpoint must support temporary/ephemeral file processing for regeneration without persisting to KH.
- LLM prompt templates for expand/shorten need to handle both descriptive user prompts and empty prompts (default behavior) — to be authored and tested by the AI team.

**Suggested phasing:**

- **Phase 1 (v1 launch):** All P0 requirements — main dropdown, regenerate (normal + KH source + attachment), expand, shorten.
- **Phase 2 (fast follow, 2–3 weeks post-launch):** P1 items — Ask GenieAI, source icons, KH color tags, session memory.
- **Phase 3 (next quarter):** P2 items based on usage data — bulk actions, diff view, confidence scores.

**Hard deadlines:** None identified. This is a product-driven initiative, not tied to a contractual commitment.