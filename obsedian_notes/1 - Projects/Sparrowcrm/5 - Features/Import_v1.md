---
owner: Divyaraj Murugan
feature: "[[Imports]]"
version: 1
status: Draft
priority: Low
tags:
  - sparrowcrm/features/import/v1
---
# SparrowCRM Data Import Feature Spec

Table of Content
- [[#Problem Statement|Problem Statement]]
- [[#JTBD|JTBD]]
- [[#Goals|Goals]]
- [[#Non-Goals|Non-Goals]]
- [[#Requirements|Requirements]]
- [[#Technical Considerations|Technical Considerations]]
- [[#Success Metrics|Success Metrics]]
- [[#Open Questions|Open Questions]]
- [[#Edge Cases|Edge Cases]]


Wireframe: [Balsamiq](https://balsamiq.cloud/sfwp3yg/pyg45on)

## Problem Statement

Users collect leads and company data in bulk from event registrations, webinar signups, trade show badge scans, partner lead lists, Apollo/Clay/LinkedIn exports, and sales ops spreadsheets. Today, there is no way to upload this data into SparrowCRM in one go. Users have to manually create contacts and companies one by one, which is slow, repetitive, and creates unnecessary friction.

With the Data Import feature, any user with write access can upload a CSV or Excel file, map columns to CRM fields through a guided wizard, fix data issues inline, preview what will be created or updated, and execute the import in the background.

Once imported, records are deduplicated, owned, enriched (optionally), and ready to work.

This is NOT a CRM-to-CRM migration tool. Direct connectors to Salesforce, HubSpot, Pipedrive are a separate module.

---

## JTBD

### [[Sales Rep]]

- [ ] Upload a csv of leads from the Contacts table view or a specific list.
- [ ] See which records will be created vs updated before the import runs.
- [ ] Fix dropdown values or add new options during the import without leaving the wizard.
- [ ] Import leads directly into a specific list so records are created and added to the list in one step.
- [ ] Upload a file and map columns through a guided wizard without engineering help.
- [ ] Import files that contain both contact and company columns in a single upload.
- [ ] Detect and update duplicate records using unique identifiers instead of creating duplicates.
- [ ] See exactly which rows failed and why, download failed rows, fix, and re-import.
- [ ] See the history of the previous imports with status 
#### Import Management
- [ ] Start import from Object table view, List page, or Settings → Imports
- [ ] Resume draft imports
- [ ] View import history with status, counts, and user info
- [ ] Download error reports
- [ ] Cancel in-progress imports
### [[Admin]]

- [ ] Control which roles have import permission for specific objects.
### [[Sales Manager]]

- [ ] Same as Rep. No special import capabilities unless given permission.

---

## Goals

### Business Goals

- Eliminate manual record creation friction for bulk data.
- Enable self-service data operations without engineering or admin help.
- Maintain CRM data quality during imports through validation and dedup.
- Support multi-object imports (Contacts + Companies + Deals + lists) in a single file.


---

## Non-Goals

- We are not building a CRM-to-CRM migration tool. Direct connectors are a separate module.
- We are not supporting vCard (.vcf) files. Not supported by HubSpot, Pipedrive, or Attio.
- We are not building scheduled or recurring imports. V2.
- We are not building saved mapping templates. V2.
- We are not building undo for updated records. Requires field-level change tracking. V2.
- We are not building AI-assisted mapping for non-English headers. V2.

---

##  Requirements

### Must-Have (P0)

#### 1. File Upload (Step 1)

Users must be able to upload a file to start the import.

**Acceptance Criteria**

- [ ] User can upload CSV, XLS, or XLSX files.
- [ ] File size limit is 100 MB.
- [ ] Row limit is 100,000 rows.
- [ ] Column limit is 100 columns.
- [ ] File is parsed within 5 seconds for files up to 50 MB.
- [ ] File card shows file name, size, column count, and row count after parsing.
- [ ] Excel files with multiple sheets prompt the user to select one sheet.
- [ ] File type not supported  error message
- [ ] Empty files are rejected with: "The file contains no data."
- [ ] First row is always treated as headers.
- [ ] Downloadable CSV templates are available for Contacts, Companies, Deals, Contacts+Companies, and Deals+Companies.

---

#### 2. Column Mapping (Step 2)

Users must be able to map each file column to a CRM field.

**Layout**

- Left side: "Data extracted from file" — shows each file column name with up to 4 sample values and "+20 more" count.
- Right side: "Mapping" — a "Choose attribute" dropdown per column.
- Top bar: breadcrumb showing File upload → Column mapping → Review values → Preview. File name shown with a delete icon.
- Top right: search bar and a filter icon with chips: Unmapped, Mapped by…, Mapped = Manually, Mapped = Automatically.

**Acceptance Criteria**

_Mapping Dropdown_

- [ ]  Each column has a "Choose attribute" dropdown. Default state shows "– Choose attribute –" as placeholder.
- [ ]  Clicking the dropdown opens a searchable list with a "Search Attributes" field at the top.
- [ ]  Dropdown shows a "Suggested" section at the top with the most likely matches for that column (e.g., Name > first name, Email, Contacts > Title).
- [ ]  Below suggestions, all available attributes are listed and searchable.
- [ ]  Relationship fields are shown with nested notation: "Contact > Company name", "Contact > Company domain", "Contact > Company Industry."
- [ ]  Bottom of dropdown shows "+ Create Attribute" to create a new field inline.
- [ ]  System/read-only fields are excluded from the dropdown (AI-managed, behavioural, calculated, Created Date, Created By, Modified Date, Modified By, Source).
- [ ]  Record ID is allowed for lookup purposes.

_Auto-Mapping_

- [ ]  Auto-mapping applies three tiers in order: exact match (case-insensitive), normalized match (strips spaces/underscores/hyphens), synonym dictionary.
- [ ]  Auto-mapping completes within 2 seconds for up to 100 columns.
- [ ]  Auto-mapped columns show green "Automatically mapped" label below the dropdown.
- [ ]  Manually mapped columns show "Manually mapped by you" label below the dropdown.
- [ ]  Unmapped columns show orange "Unmapped" label below the dropdown.

_Mapping Status and Filters_

- [ ]  Top-right filter icon opens filter chips: Unmapped, Mapped by…, Mapped = Manually, Mapped = Automatically.
- [ ]  Filters allow user to quickly find unmapped columns or review auto-mapped ones.
- [ ]  At least one column must be mapped to enable the Continue button.
- [ ]  If no columns are mapped, Continue button is disabled with tooltip: "You need to map atleast one column to continue."

_Duplicate Mapping Error_

- [ ]  If two columns are mapped to the same attribute, both show an inline error tooltip: "This mapping is invalid because multiple mappings have been added for the same attribute. Please remove one of the mappings."
- [ ]  Continue button shows tooltip: "Fix the issues to Continue" and is disabled until the duplicate is resolved.

_Skipping Columns_

- [ ]  To skip a column, the user does not map any field to it, or clicks the x to remove an auto-mapped one.
- [ ]  Unmapped columns are ignored during import

---

#### 3. Permission-Aware Mapping

Mapping must respect the user's object-level permissions.

**Acceptance Criteria**

#### 3. Permission-Aware Mapping

Mapping must respect the user's object-level permissions.

**Acceptance Criteria**

- [ ]  When user searches for a field on a related object they do not have write access to, the field appears in search results but is disabled.
- [ ]  Disabled fields show tooltip: "You don't have access to update this object. Please contact your admin."
- [ ]  Company association fields (Domain, Record ID) used only for lookup/linking remain selectable even without Company write access.
- [ ]  Company mutation fields (Name, Industry, ARR, etc.) are disabled with the permission tooltip if user lacks Company write access.
- [ ]  Backend enforces permission even if frontend is bypassed.
- [ ]  If user maps Company Domain for association and no matching company is found, contact is created without company association and error report notes the reason.

---

#### 4. Unique Identifier Enforcement

The system must detect duplicates using unique identifiers per object. If the user clicks Continue without mapping a unique identifier, a blocking modal appears.

**Modal: "Map unique fields"**

- Title: "Map unique fields"
- Body: "Map a unique identifier so existing records can be matched. Importing without a unique identifier will create new records instead."
- Subtext: "To prevent duplicates, map one of the following columns:"

|Object|Unique Identifier|
|---|---|
|Contact|Record ID or Email|
|Company|Record ID or Domain|
|Deal|Record ID or Deal name + Deal stage + Deal owner|

- Checkbox: "I understand this import may create duplicates"
- Buttons: Cancel | Proceed
- Proceed button is disabled until the checkbox is checked.

**Acceptance Criteria**

- [ ]  If user clicks Continue without mapping a unique identifier, the "Map unique fields" modal appears.
- [ ]  Modal shows the unique identifier table for Contact, Company, and Deal.
- [ ]  Checkbox "I understand this import may create duplicates" is unchecked by default.
- [ ]  "Proceed" button is disabled until the checkbox is checked.
- [ ]  Clicking "Cancel" returns user to the mapping page to map a unique field.
- [ ]  Clicking "Proceed" (after checkbox) continues the import with all rows treated as Create.
- [ ]  If unique identifier is mapped and a row matches an existing record, Preview shows Update.
- [ ]  If unique identifier is mapped and no match, Preview shows Create.
- [ ]  If no unique identifier mapped and user proceeded via modal, all rows show Create.
---

#### 5. Review Values with Inline Editing (Step 3)

Users must be able to review and fix data issues before import.

**Layout**

- Left sidebar: "Columns" — lists all mapped columns. Each shows the file column name, the mapped CRM field type below it (e.g., "Email addresses", "Name > Last", "Primary location", "Angel.id", "Twitter", "Job title"). Columns with errors show a red dot indicator. Clicking a column selects it and loads its values on the right.
- Right panel: "Sorted by Raw value" — shows a table with "Raw data" and "Mapped value" columns. Top section: "⚠ Needs review [count]" accordion showing invalid values. Each row shows the raw value, an arrow →, and the mapped/validated result with a status tag.
- Top: breadcrumb showing File upload → Column mapping → Review values → Preview. Search bar for filtering values.

**Acceptance Criteria**

_Column Sidebar_

- [ ]  All mapped columns are listed in the left sidebar.
- [ ]  Each column shows the file column name and the mapped CRM field type below it.
- [ ]  Columns with validation errors show a red dot indicator next to the name.
- [ ]  Clicking a column highlights it and loads its values in the right panel.

_Value Table_

- [ ]  Right panel header shows "Sorted by Raw value."
- [ ]  Values are grouped under "⚠ Needs review [count]" accordion (errors at top) and valid values below.
- [ ]  Each row shows: raw value → mapped value with status tag.
- [ ]  Invalid values show a red error tag (e.g., "Invalid email", "Invalid Phone").
- [ ]  Valid values show a green checkmark or the correctly mapped value.
- [ ]  Clicking an invalid value row opens an inline edit popover.

_Inline Edit by Field Type_

- [ ]  **Email:** Popover shows "Invalid email" tag, an editable text field, "Add value" button, and "+ Create new email" option.
- [ ]  **Phone:** Popover shows "Invalid Phone" tag and "Add value" button.
- [ ]  **Date:** Popover shows a calendar date picker with month/year navigation, Cancel and OK buttons.
- [ ]  **Select:** Popover shows a searchable dropdown of existing options with "Search options" field.
- [ ]  **Multi-select:** Popover shows a searchable dropdown of existing options with "Search options" field. Multiple values can be selected.
- [ ]  **Yes/No:** Popover shows a searchable dropdown with Yes/No values and "Search values" field.
- [ ]  **Status:** Popover shows a searchable dropdown of existing statuses with "Search values" field.
- [ ]  **User:** Popover shows a searchable dropdown of workspace members with "Search values" field.
- [ ]  **Pipeline Stage:** Popover shows a searchable dropdown of stages with "Search values" field.
- [ ]  **Location:** Popover shows a searchable dropdown with "Search values" field.

_General Editing Behavior_

- [ ]  Changes re-validate immediately and update the "Needs review" count.
- [ ]  User edits a value and introduces a new error → re-validated and flagged immediately.
- [ ]  For select/multi-select: user can remap invalid value to an existing option or add as new option.
- [ ]  Adding a new dropdown option that already exists (case difference) → auto-matches to existing option.
- [ ]  Invalid values do not block import. Unfixed values are skipped for that field/row during execution.
- [ ]  Error report after import includes skipped values with reasons.
- [ ]  Unique values for a column load within 1 second.

**Validation by Field Type**

|Field Type|Key Validations|Error Tag|Edit Control|
|---|---|---|---|
|Text|Max length, invalid characters, formula injection, required|"This field is required."|Text field|
|Email|Format, multiple emails, separator, duplicates, required|"Invalid email"|Text field + "Add value" + "+ Create new email"|
|Phone|Format, length, invalid characters, separator, country code, multiple numbers|"Invalid Phone"|Text field + "Add value"|
|Date|Format match, impossible date, ambiguous date|"Invalid date"|Calendar date picker|
|Number|Numeric, decimals, range (min/max), negative, decimal separator|"Invalid number"|Text field|
|Currency|Amount, mixed currencies, unsupported currency|"Invalid Currency"|Text field|
|Select|Option exists, archived, typo|"Option not exist"|Searchable dropdown ("Search options")|
|Multi-select|Option exists, separator, duplicates, too many|"Option not exist"|Searchable dropdown ("Search options")|
|Yes/No|Boolean value recognition|"Option not exist"|Searchable dropdown ("Search values")|
|URL|Valid URL, LinkedIn URL, Twitter/X URL|"Enter a valid URL."|Text field|
|Domain|Valid domain, email-in-domain, URL-in-domain, public domain|"Invalid domain"|Text field|
|User/Owner|User exists, active, ambiguous match|"Invalid user"|Searchable dropdown ("Search values")|
|Status|Status exists, archived|"Option not exist"|Searchable dropdown ("Search values")|
|Pipeline Stage|Stage exists, stage in pipeline, archived|"Option not exist"|Searchable dropdown ("Search values")|
|Relationship|Record found, multiple matches, duplicate association|"No matching record found."|Searchable dropdown|
|Rating|Valid rating, range|"Invalid rating"|Text field|
|Timestamp|Valid datetime, timezone|"Invalid timestamp"|Text field|
|Location|Valid location, country recognition|"Enter a valid location."|Searchable dropdown ("Search values")|
|Blank|Optional skip, required error, blank row skip|"Empty values will be skipped."|Text field|

---

#### 6. Preview & Enrichment (Step 4)

Users must see exactly what will happen before importing.

**Acceptance Criteria**

- [ ]  Summary cards show: "X will be created", "Y will be updated", "Z will be skipped."
- [ ]  Multi-object imports show separate tabs per object with per-tab counts.
- [ ]  Data table shows each record with Create (+) or Update (pencil) icon.
- [ ]  Enrichment toggle lets user choose whether to enrich after import.
- [ ]  Enrichment only fills empty fields, never overwrites.
- [ ]  If active workflows would fire, a warning shows workflow names and option to suppress.

---

#### 7. Import Execution (Step 5)

The import must run in the background with progress visibility.

**Acceptance Criteria**

- [ ]  Import job starts within 2 seconds.
- [ ]  Progress bar shows percentage and "Processing record X of Y."
- [ ]  Live counters show Created / Updated / Failed.
- [ ]  "You can safely close this page" message is shown.
- [ ]  Cancel button stops import. Already-processed records are kept.
- [ ]  One bad row does not roll back the entire import.
- [ ]  Job is idempotent per row. Crash and restart does not reprocess rows.
- [ ]  Max 1 active import per workspace. Additional imports are queued with position and wait time.

**Completion States**

- [ ]  Success: "Import complete. [X] rows created, [Y] rows updated."
- [ ]  Partial success: "Import completed with issues. [X] created, [Y] updated, [Z] failed."
- [ ]  Failed rows message: "[Z] rows couldn't be imported. Download the failed rows file to review errors and re-import after fixing them."
- [ ]  Error CSV includes original data + "Error Reason" and "Failed Field" columns.
- [ ]  In-app notification on completion.
- [ ]  Email notification with per-object breakdown and link to import history.

---

#### 8. Multi-Object Import

A single file must support creating and linking records across multiple objects.

**Acceptance Criteria**

- [ ]  When relationship fields are mapped, system detects multi-object scope.
- [ ]  Related objects (Companies) are created first, then primary records (Contacts), then child entities (Deals, Notes, Tasks).
- [ ]  Entities on the same row are linked to each other.
- [ ]  If company domain matches an existing company, contact is linked to it.
- [ ]  If company domain does not match, a new company is created (if user has permission).
- [ ]  Company data conflicts across rows: single-value fields → last row wins (unless Don't Overwrite on). Multi-value fields → additive.
- [ ]  Public email domains (gmail, outlook) do not auto-create companies.
- [ ]  Preview shows separate tabs per affected object.

---

#### 9. Import into a List

Users must be able to import directly into a static list.

**Acceptance Criteria**

- [ ]  Import from list page targets the list's parent object.
- [ ]  Destination shown as "Importing into [List Name] (Object)."
- [ ]  Extra setting: "For records already in this list: Add again / Update existing."
- [ ]  New fields created via "+ Create new field" are added to the parent object.
- [ ]  Successfully created/updated records are added to the list.
- [ ]  Only works with static lists.

---

#### 10. Post-Import System Rules

System must apply consistent rules to all imported records.

**Acceptance Criteria**

- [ ]  Source field auto-set to "CSV Import" on all created records. Not mappable.
- [ ]  Record owner defaults to importing user unless Owner column is mapped and resolved.
- [ ]  Owner resolution matches by email first, then full name.
- [ ]  Activity timeline entry on every affected record: "Record created/updated via import — [file name]."
- [ ]  Empty cells never overwrite existing data.
- [ ]  Multi-value fields are additive (existing values preserved, new values added).
- [ ]  Intra-file duplicates: warning shown, last occurrence wins.

---

#### 11. Import History

Users must be able to view and manage past imports.

**Location**

Settings → Objects → [Object name] → Imports tab.

Page shows two sections:

- "Imports" — "Set defaults for service object imports"
- "Recent Imports" — "View and manage recent import activities"

**Table Columns:** IMPORT NAME | Imported by | DATE | STATUS | RECORDS

**Statuses:**

|Status|Icon|Description|
|---|---|---|
|In Progress|↗️ arrow icon|Import currently running|
|Done|✅ green dot|Import completed successfully|
|Draft|✏️ pencil icon|Import saved but not executed|

**Row Actions (context menu):**

- "Download" — download the imported file
- "Delete Import" — delete the import record (shown in red)
- "Imported file cannot be deleted" — shown grayed out when the file is not deletable

**Acceptance Criteria**

- [ ]  Import history is accessible from Settings → Objects → [Object name] → Imports tab.
- [ ]  "Recent Imports" table shows: Import Name, Imported by (with user avatar and name), Date, Status, Records count.
- [ ]  Status column shows correct icon: arrow for In Progress, green dot for Done, pencil for Draft.
- [ ]  Each row has a context menu (three dots) with "Download" and "Delete Import" options.
- [ ]  "Download file" link is shown inline for In Progress imports.
- [ ]  Completed imports show "Done" status with green dot.
- [ ]  Draft imports show pencil icon. Clicking a draft row resumes the import from the step where user left off.
- [ ]  "Delete Import" is shown in red text in the context menu.
- [ ]  If an imported file cannot be deleted, the context menu shows "Imported file cannot be deleted" grayed out.
- [ ]  Admins see all imports. Reps see only their own.

---

### Future Considerations (P2)

- [ ]  Scheduled/recurring imports.
- [ ] Import API
- [ ]  Saved mapping templates for reuse across imports.
- [ ]  Fuzzy duplicate matching beyond exact unique identifiers.
- [ ]  AI-assisted mapping for non-English headers.
- [ ]  Same-object associations (contact-to-contact relationships).
- [ ]  ZIP file multi-file import for migration scenarios.

---

## Technical Considerations

### Data Handling

- Files uploaded to object storage via pre-signed URL. Never held in app memory.
- Import state auto-saved at each step. Drafts are resumable.
- Failed rows exported as CSV with error reasons appended.

### Architecture

- Dedicated worker pool for import jobs (separate from CRM UI workers).
- Background job queue supports creation, progress, cancellation, retry.
- Row-level processing: transform → validate → deduplicate → create or update.
- One bad row does not roll back the batch.
- Job is idempotent per row.

### Performance

- File upload and parsing: under 5 seconds for files up to 50 MB.
- Auto-mapping: under 2 seconds for up to 100 columns.
- Import execution: minimum 100 rows/second at p50.
- Review Values: unique values per column in under 1 second.
- Row-level processing: under 500ms at p95.

### Reliability

- Failed after 3 retries → marked "Failed," user notified.
- Max 1 active import per workspace. Others queued.
- imports table indexed on: workspace_id, created_at DESC, status.
- import_rows table indexed on: import_id, row_index, status.

### Security

- Import requires role-based permission: Settings → Roles → "Import Data."
- API requires Bearer token authentication.
- All imports logged in workspace audit trail.

---

##  Success Metrics

### Leading Metrics

- Import wizard completion rate.
- Auto-mapping accuracy (user override rate).
- Average time to complete for files under 1K rows.
- Import error rate (failed rows / total rows).
- Number of imports per workspace per week.

### Lagging Metrics

- Support tickets about import as percentage of total volume.
- Manual record creation rate reduction post-launch.
- Retention impact for accounts using import.

### Targets

- Wizard completion rate above 80% within 60 days.
- Auto-mapping accuracy above 70% within 30 days.
- Average time to complete (under 1K rows) under 5 minutes.
- Import error rate under 5% within 60 days.
- Support tickets under 2% of total volume within 60 days.
- API adoption: 10+ workspaces within 90 days.

---

## Open Questions

### Blocking

- Engineering: What is the exact list of public email domains that suppress company auto-creation?
- Engineering: What are the field length limits per field type for validation?
- Product: What is the workspace record limit enforcement behavior — hard stop or warning only?
- Product: How does enrichment credit consumption work — per record or per field? What if credits run out mid-enrichment?

### Non-Blocking

- Product: Should the synonym dictionary be admin-configurable per workspace or hardcoded?
- Product: Should intra-file duplicate behavior (last row wins) be configurable?
- Product: Should the "Don't Overwrite" toggle default be configurable at workspace level?
- Engineering: What APIs are needed for post-import enrichment?
- Design: What is the exact layout for the Review Values inline editing panel?
- Data: How will we track import funnel drop-off per step?

---

## Edge Cases

| Scenario                                                    | Expected Behavior                                                                   |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| File has no header row                                      | First row treated as headers. User must fix and re-upload if values look like data. |
| One field cell is empty                                     | Value skipped. Rest of row imported.                                                |
| Two columns mapped to same field                            | Inline error. Continue disabled.                                                    |
| Select value doesn't match options                          | Flagged in Review. User can remap or add. If unfixed, field skipped for that row.   |
| Date format not selected                                    | Continue disabled until resolved.                                                   |
| Pipeline not selected for Deal Stage                        | Pipeline selector appears. Must confirm.                                            |
| User edits value in Review and creates new error            | Re-validated on blur. Flagged immediately.                                          |
| Dropdown option added that already exists (case difference) | Auto-matches to existing option.                                                    |
| Owner value doesn't match workspace member                  | Flagged in Review. Defaults to importing user if unfixed.                           |
| European number format (1.000,50)                           | User selects decimal separator via dropdown.                                        |
| Currency symbols in number fields                           | Stripped before parsing. Mixed currencies flagged.                                  |
| Record ID mapped but not found                              | Row skipped. Error: "No record found with ID [value]."                              |
| File exceeds limits                                         | Rejected at upload with specific error.                                             |
| ZIP file uploaded                                           | Rejected with migration redirect message.                                           |
| Encoding issues                                             | Warning with UTF-8 re-save suggestion.                                              |
| Import canceled mid-way                                     | Partial import kept. Status = "Canceled."                                           |
| Another import running                                      | Queued with position and estimated wait time.                                       |
| All values in column invalid                                | Warning: "All values invalid. Column will be skipped."                              |
| Company column mapped but no unique attribute               | Warning: "New company created for each record. May create duplicates."              |
| Company data conflicts across rows                          | Single-value: last row wins. Multi-value: additive.                                 |
| Three objects in one file                                   | Entities on same row linked. Preview shows 3 tabs.                                  |
| Network disconnect during import                            | Import continues server-side. Resume from Settings → Imports.                       |
| Public email domain                                         | Company NOT auto-created.                                                           |
| Multi-select field already has values                       | New values added. Existing preserved.                                               |
| Multi-value comma-separated                                 | Split on commas. Each stored separately.                                            |
| Target object deleted during import                         | Import fails gracefully. Queued rows marked failed.                                 |
| User has read-only access                                   | Import button hidden. API returns 403.                                              |
| Intra-file duplicates                                       | Warning. Last occurrence wins.                                                      |
| Import triggers active workflows                            | Warning in Preview with names and suppress option.                                  |
| Import exceeds workspace record limit                       | Warning in Preview with capacity info.                                              |
| Formula injection (=, +, -, @)                              | Sanitized. "Formula values are not supported."                                      |
| Unicode and accents                                         | UTF-8 supported. Garbled characters trigger warning.                                |
| Very long text                                              | Truncated if exceeds field max length.                                              |
| Blank row                                                   | Skipped entirely.                                                                   |
