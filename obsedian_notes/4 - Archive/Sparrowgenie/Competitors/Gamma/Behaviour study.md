---
tags:
  - competitor_analysis/gamma/editor
related:
  - "[[FRD Template]]"
  - "[[Answer types templates]]"
  - "[[company-profile-executive-insights-research]]"
  - "[[Product Spec Template 2]]"
  - "[[Feature Template]]"
  - "[[Doc Workflow Two-Doc System]]"
  - "[[Spec Template]]"
  - "[[recommendation-canvas-template]]"
  - "[[Custom Agent builderv1]]"
  - "[[QorusDocs]]"
  - "[[user-story-splitting-prompt-template]]"
  - "[[pestel-analysis-prompt-template]]"
  - "[[Help Article Template]]"
  - "[[proto-persona-profile]]"
  - "[[Edge case Analysis]]"
---

# Gamma Study: Template Creator & Export Behavior

**Objective:** Understand how Gamma's template creation system works — how admins set up templates, how it differs from document creation, how template inheritance behaves, and how export/PDF/page breaks are handled.

---

## 1. Template Creator vs Document Creator — Feature Delta

Compare what's available in each mode side by side.

### Toolbar & Controls

| Feature / UI Element     | Template Creator | Doc Creator | Both? | Notes |
| ------------------------ | ---------------- | ----------- | ----- | ----- |
| Block types available    |                  |             |       |       |
| Text formatting options  |                  |             |       |       |
| Image insertion options  |                  |             |       |       |
| Embed / media options    |                  |             |       |       |
| Layout / column controls |                  |             |       |       |
| Theme / styling panel    |                  |             |       |       |
| AI assist features       |                  |             |       |       |

### Placeholder & Variable Fields

| Feature / UI Element            | Template Creator | Doc Creator | Both? | Notes |
| ------------------------------- | ---------------- | ----------- | ----- | ----- |
| Placeholder text fields         |                  |             |       |       |
| Editable vs locked sections     |                  |             |       |       |
| Dynamic / variable fields       |                  |             |       |       |
| Required vs optional markers    |                  |             |       |       |
| Instructions for template users |                  |             |       |       |

### Settings & Configuration

|Feature / UI Element|Template Creator|Doc Creator|Both?|Notes|
|---|---|---|---|---|
|Naming / title options|||||
|Category / tagging|||||
|Visibility / sharing settings|||||
|Preview mode|||||
|Version / save options|||||

### Canvas & Layout

|Feature / UI Element|Template Creator|Doc Creator|Both?|Notes|
|---|---|---|---|---|
|Page / card structure|||||
|Section reordering (drag)|||||
|Grid / snap behavior|||||
|Background / theme options|||||
|Header / footer controls|||||

---

## 2. Admin Template Lifecycle

Walk through the full admin journey from creation to maintenance.

### Creation

|Step|Stage|What to Observe|Clicks|Notes|
|---|---|---|---|---|
|1|Start new template|Entry point — where do you go to create?|||
|2|Choose base / blank|Options: blank, from existing doc, from template?|||
|3|Name & describe template|Title, description, category fields|||
|4|Build template content|Adding blocks, placeholders, structure|||

### Configuration

|Step|Stage|What to Observe|Clicks|Notes|
|---|---|---|---|---|
|5|Set permissions / visibility|Who can use this template?|||
|6|Add tags / categories|How is it organized for discovery?|||
|7|Preview as end user|Can you preview before publishing?|||

### Publishing

|Step|Stage|What to Observe|Clicks|Notes|
|---|---|---|---|---|
|8|Publish template|Publish button, confirmation flow|||
|9|Template appears in library|Where does it show up for users?|||

### Maintenance

|Step|Stage|What to Observe|Clicks|Notes|
|---|---|---|---|---|
|10|Edit published template|Can you edit after publishing?|||
|11|Version history|Does it track versions / changes?|||
|12|Deprecate / archive|Can you retire a template?|||

---

## 3. Template Inheritance Behavior

Test what carries over when a user creates a doc from your template.

### Structure Inheritance

|Test Scenario|Result (Y/N)|Severity|Observations|
|---|---|---|---|
|Does doc keep template's section order?||||
|Can user add new sections?||||
|Can user delete template sections?||||
|Can user reorder template sections?||||
|Are locked sections enforced?||||

### Style & Theme Inheritance

|Test Scenario|Result (Y/N)|Severity|Observations|
|---|---|---|---|
|Does doc inherit template theme?||||
|Can user override fonts/colors?||||
|Do brand elements (logo, colors) persist?||||
|Does changing template theme update existing docs?||||

### Content Inheritance

|Test Scenario|Result (Y/N)|Severity|Observations|
|---|---|---|---|
|Are placeholder texts carried over?||||
|Are sample images carried over?||||
|Do pre-filled blocks stay editable?||||
|Are instructions/hints visible to doc creator?||||

### Post-Creation Sync

|Test Scenario|Result (Y/N)|Severity|Observations|
|---|---|---|---|
|Updating template — does it affect existing docs?||||
|Deleting template — what happens to docs?||||
|Is there a "reapply template" option?||||
|Can user detach doc from template?||||

---

## 4. Export & Page Break Handling

### Export Formats Available

|Check Item|Finding|Rating (1-5)|Notes|
|---|---|---|---|
|PDF export available?||||
|PPTX export available?||||
|DOCX export available?||||
|Image export (PNG/JPG)?||||
|Share as link only?||||
|Other formats?||||

### PDF Export Quality

|Check Item|Finding|Rating (1-5)|Notes|
|---|---|---|---|
|Does text render correctly?||||
|Do images maintain resolution?||||
|Are fonts preserved or substituted?||||
|Do colors match the editor?||||
|Are hyperlinks clickable in PDF?||||
|File size reasonable?||||

### Page Break Behavior

|Check Item|Finding|Rating (1-5)|Notes|
|---|---|---|---|
|Are page breaks automatic or manual?||||
|Can you insert manual page breaks?||||
|Do breaks respect block boundaries?||||
|Does content get cut mid-image?||||
|Does content get cut mid-text?||||
|Is there a page break preview?||||
|Card-based vs continuous page model?||||

### Editor vs Export Comparison

|Check Item|Finding|Rating (1-5)|Notes|
|---|---|---|---|
|Layout matches editor?||||
|Spacing / margins consistent?||||
|Image positions unchanged?||||
|Block alignment preserved?||||
|Header/footer in export?||||
|Page numbering available?||||

---

## 5. Summary & Key Takeaways

### Findings by Outcome Area

|#|Outcome Area|Key Findings & SparrowGenie Implications|
|---|---|---|
|1|Template Creator vs Doc Creator Delta||
|2|Admin Template Lifecycle||
|3|Template Inheritance Behavior||
|4|Export & Page Break Handling||

### Top 3 Things to Steal for SparrowGenie

### Top 3 Gaps / Opportunities We Can Beat Them On