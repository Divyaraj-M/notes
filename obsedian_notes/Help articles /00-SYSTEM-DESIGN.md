# SparrowGenie Help Center — System Design (v2)

## Design Philosophy

**This help center is organized around what users are trying to do, not what features exist.**

Every article answers a question a real user would type into a search bar or ask support. The structure follows the user's journey from "I just signed up" to "I need to submit this RFP response by Friday."

### Three Rules

1. **Every article title is a question or a task** — "How do I import my RFP?" not "Importing Your File"
2. **Articles link forward AND backward** — the user always knows what to do next, and can always find what they missed
3. **Troubleshooting lives next to the feature** — "My file won't upload" sits right beside "How to import a file," not buried in a separate FAQ

---

## Help Center Hierarchy

The help center covers the full SparrowGenie platform, not just Projects. Users need context before they touch a project.

```
SparrowGenie Help Center
│
├── Getting Started           ← "I just signed up, now what?"
│   ├── Account & setup
│   ├── Inviting your team
│   └── Understanding roles
│
├── Knowledge Hub             ← "How does the AI know things?"
│   ├── What it is & why it matters
│   ├── Uploading & organizing content
│   └── Improving AI accuracy
│
├── Projects                  ← "I have an RFP to respond to"
│   ├── Creating a project
│   ├── Importing your file
│   ├── Mapping your RFP
│   ├── AI answer fill
│   ├── Collaborating on answers
│   ├── Reviewing & approving
│   ├── Tracking progress
│   └── Exporting your response
│
└── Account & Settings        ← "I need to change something"
    ├── Notifications
    ├── Integrations
    └── Billing & plans
```

---

## How Articles Connect (Backlink Strategy)

### Layer 1: Inline links
Whenever you mention a concept that has its own article, link it the first time it appears. Not every mention — just the first.

Example: *"Genie AI pulls answers from your [Knowledge Hub](/knowledge-hub/what-is-the-knowledge-hub.md). If the answer isn't right, you can [edit it manually](/projects/ai-answer-fill/how-to-edit-an-ai-answer.md) or [flag it for a teammate](/projects/collaborating/how-to-assign-a-question.md)."*

### Layer 2: What to do next
Every article ends with a clear next step. Not a generic "Related Articles" dump — an actual sentence like: *"Now that your file is imported, the next step is [mapping your RFP questions](/projects/mapping/what-is-mapping.md)."*

### Layer 3: Related Articles
After the next step, list 2–4 genuinely related articles. Prioritize:
- The thing the user probably tried before this article
- The thing the user will probably need after
- The troubleshooting article for this same feature

### Layer 4: Category landing pages
Each category (Getting Started, Knowledge Hub, Projects, Account) has an index page that lists all articles in that section with one-line descriptions. These serve as navigation fallback.

---

## Folder Structure

```
Help articles/
├── 00-SYSTEM-DESIGN.md
├── 01-MASTER-INDEX.md
├── 02-ARTICLE-TEMPLATE.md
├── 03-WRITING-SCHEDULE.md
├── 04-TRACKER.xlsx
│
├── getting-started/
│   ├── _index.md                          ← Category landing page
│   ├── what-is-sparrowgenie.md
│   ├── setting-up-your-account.md
│   ├── how-to-invite-your-team.md
│   ├── understanding-roles.md
│   ├── owner-vs-manager-vs-participant.md
│   └── quick-start-your-first-project-in-10-minutes.md
│
├── knowledge-hub/
│   ├── _index.md
│   ├── what-is-the-knowledge-hub.md
│   ├── how-to-upload-documents.md
│   ├── supported-file-types.md
│   ├── how-to-organize-with-folders.md
│   ├── how-the-ai-learns-from-your-content.md
│   ├── how-to-test-knowledge-hub-coverage.md
│   └── how-to-improve-ai-answer-quality.md
│
├── projects/
│   ├── _index.md
│   │
│   ├── creating/
│   │   ├── what-is-a-project.md
│   │   ├── how-to-create-a-new-project.md
│   │   └── what-you-need-before-starting.md
│   │
│   ├── importing/
│   │   ├── how-to-import-your-rfp.md
│   │   ├── supported-import-formats.md
│   │   ├── how-to-clean-your-file-before-importing.md
│   │   └── my-file-wont-upload.md
│   │
│   ├── mapping/
│   │   ├── what-is-mapping-and-why-do-i-need-it.md
│   │   ├── how-to-map-sections-and-questions.md
│   │   ├── using-dropdown-vs-manual-mapping.md
│   │   ├── how-auto-map-works.md
│   │   ├── how-to-undo-redo-or-reset-mapping.md
│   │   ├── how-to-review-and-finish-mapping.md
│   │   └── the-ai-mapped-something-wrong.md
│   │
│   ├── ai-answer-fill/
│   │   ├── how-does-ai-answer-fill-work.md
│   │   ├── how-to-auto-fill-answers.md
│   │   ├── how-to-edit-an-ai-answer.md
│   │   ├── the-ai-answer-is-wrong-or-missing.md
│   │   └── how-to-improve-ai-answers.md
│   │
│   ├── collaborating/
│   │   ├── how-to-assign-a-question-to-someone.md
│   │   ├── how-to-share-a-section-with-another-team.md
│   │   ├── how-to-add-comments-and-mentions.md
│   │   └── how-do-notifications-work.md
│   │
│   ├── reviewing/
│   │   ├── how-to-request-a-review.md
│   │   ├── how-to-approve-or-reject-an-answer.md
│   │   ├── how-the-approval-workflow-works.md
│   │   └── how-to-see-activity-history.md
│   │
│   ├── tracking/
│   │   ├── how-to-track-project-progress.md
│   │   ├── how-to-set-deadlines.md
│   │   ├── how-to-see-overdue-and-blocked-items.md
│   │   ├── how-do-reminders-work.md
│   │   └── how-to-set-deal-value.md
│   │
│   └── exporting/
│       ├── how-to-export-your-completed-response.md
│       ├── how-to-export-in-word-pdf-or-excel.md
│       ├── how-to-export-a-single-section.md
│       └── how-to-include-or-exclude-comments.md
│
└── account-settings/
    ├── _index.md
    ├── how-to-manage-notification-preferences.md
    ├── how-to-connect-integrations.md
    └── how-to-manage-your-subscription.md
```

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Category folder | `kebab-case` | `knowledge-hub/` |
| Sub-category folder | `kebab-case` | `projects/mapping/` |
| Article file | Question in kebab-case | `my-file-wont-upload.md` |
| Landing page | `_index.md` | Always `_index.md` |

---

## Article Quality Standards

1. **200–400 words** — if it's longer, split it
2. **Title = the user's question** — "How to export in Word, PDF, or Excel" not "Export Formats"
3. **First sentence answers the question** — then explain how
4. **Steps are numbered** — start with the action verb
5. **Troubleshooting articles start with the symptom** — "If you see [error]…" or "If [thing] isn't working…"
6. **Screenshot placeholders** — `![Description](screenshots/placeholder.png)`
7. **Voice** — second person ("you"), present tense, direct, no jargon without linking to definition

---

## Daily Writing Process

1. Pick 5 articles from the schedule
2. Copy the template, rename to match the filename in the index
3. Write the article following the template
4. Add inline links to existing articles (use placeholder `[text](#todo)` for unwritten ones)
5. Add the "What to do next" and "Related Articles" section
6. Update the tracker spreadsheet
7. Go back to yesterday's articles and replace any `#todo` links with real links
