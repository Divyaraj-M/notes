---
state: "[[Drafting]]"
---
# Field mapping

Use this checklist to align requester templates to SparrowGenie fields so AI and reporting work correctly.

## Mapping rules
- Normalize section names (e.g., `Security` vs `InfoSec`) before mapping to avoid duplicates.
- Keep question text concise—strip numbers and excess punctuation.
- Use `Category` for workstream grouping and `Subcategory` for finer breakdowns.
- Mark required fields; AI will not skip them.
- Add hints or constraints (word count, format, URL) to guide AI fill and reviewers.

## How to map quickly
1) Import the requester template.  
2) Auto-suggest mappings; accept what looks right, then bulk edit the rest.  
3) Deduplicate: merge any questions that say the same thing.  
4) Flag tricky items (SLAs, DPAs, pricing) with `Needs legal` or `Needs product` labels.  
5) Save the mapping preset if you expect similar templates later.

## Quality checks
- Run search for placeholders like `TBD` or `??` and clear them before exporting.
- Validate URLs and email addresses where requested.
- Preview the export to ensure numbering and formatting remain intact.



