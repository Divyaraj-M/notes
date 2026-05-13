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

Wireframe: [Balsamiq](https://balsamiq.cloud/sfwp3yg/pyg45on)

## 1. Problem Statement

Users collect leads and company data in bulk from event registrations, webinar signups, trade show badge scans, partner lead lists, Apollo/Clay/LinkedIn exports, and sales ops spreadsheets. Today, there is no way to upload this data into SparrowCRM in one go. Users have to manually create contacts and companies one by one, which is slow, repetitive, and creates unnecessary friction.

With the Data Import feature, any user with write access can upload a CSV or Excel file, map columns to CRM fields through a guided wizard, fix data issues inline, preview what will be created or updated, and execute the import in the background.

Once imported, records are deduplicated, owned, enriched (optionally), and ready to work.

This is NOT a CRM-to-CRM migration tool. Direct connectors to Salesforce, HubSpot, Pipedrive are a separate module.

---

## 2. JTBD

### Sales Rep

- [ ] Upload a csv of leads from the Contacts table view or a specific list.
- [ ] See which records will be created vs updated before the import runs.
- [ ] Fix dropdown values or add new options during the import without leaving the wizard.
- [ ] Import leads directly into a specific list so records are created and added to the list in one step.

### Admin

- [ ] Upload a file and map columns through a guided wizard without engineering help.
- [ ] Import files that contain both contact and company columns in a single upload.
- [ ] Detect and update duplicate records using unique identifiers instead of creating duplicates.
- [ ] See exactly which rows failed and why, download failed rows, fix, and re-import.
- [ ] Undo an import by bulk-deleting created records.
- [ ] Control which roles have import permission.
- [ ] Use the Import API to automate recurring imports.

#### Import Management

- [ ] Start import from Object table view, List page, or Settings → Imports
- [ ] Resume draft imports
- [ ] View import history with status, counts, and user info
- [ ] Download error reports
- [ ] Undo completed imports
- [ ] Cancel in-progress imports

### Manager

- [ ] Same as Rep. No special import capabilities unless given permission.

---

## 3. Goals

### Business Goals

- Eliminate manual record creation friction for bulk data.
- Enable self-service data operations without engineering or admin help.
- Maintain CRM data quality during imports through validation and dedup.
- Support multi-object imports (Contacts + Companies + Deals) in a single file.
- Provide an Import API for developer automation.

### Success Metrics

- Import wizard completion rate above 80% within 60 days.
- Auto-mapping accuracy above 70% within 30 days.
- Average time to complete (under 1K rows) under 5 minutes within 30 days.
- Import error rate (failed rows / total) under 5% within 60 days.
- Support tickets about import under 2% of total volume within 60 days.
- API import adoption: 10+ workspaces within 90 days.

---

## 4. Non-Goals

- We are not building a CRM-to-CRM migration tool. Direct connectors are a separate module.
- We are not supporting vCard (.vcf) files. Not supported by HubSpot, Pipedrive, or Attio.
- We are not building scheduled or recurring imports. V2.
- We are not building saved mapping templates. V2.
- We are not building undo for updated records. Requires field-level change tracking. V2.
- We are not building AI-assisted mapping for non-English headers. V2.
- We are not building duplicate merge during import. V2.
- We are not building same-object associations (contact-to-contact). V2.

---

## 5. User Stories

### P0 User Stories

- As an admin, I want to upload a file and map columns through a guided wizard so that data lands in the right fields without engineering help.
- As an admin, I want the system to auto-suggest column mappings so that I do not need to manually match every column.
- As an admin, I want the system to detect duplicates using unique identifiers so that existing records are updated instead of duplicated.
- As an admin, I want to import a file with both contact and company columns so that both objects are created, linked, and deduplicated in one pass.
- As an admin, I want to see exactly which rows failed and download them so that I can fix and re-import only those rows.
- As an admin, I want to undo an import so that I can recover from mistakes by bulk-deleting created records.
- As a sales rep, I want to upload my trade show spreadsheet from the Contacts table view so that I can start working leads immediately.
- As a sales rep, I want to see a preview of what will be created vs updated before the import runs.
- As a sales rep, I want to fix invalid dropdown values or add new options during the import without leaving the wizard.
- As a sales rep, I want to import leads directly into a specific list so that records are created and added to the list in one step.

### P1 User Stories

- As an admin, I want to control which roles have import permission so that I can restrict imports to trusted users.
- As an admin, I want to use the Import API to automate imports from external systems.
- As a user, I want my import auto-saved as a draft if I navigate away so that I can resume without starting over.
- As a user, I want to be warned if my import would trigger active workflows so that I can suppress them if needed.

### P2 User Stories

- As an admin, I want to save and reuse column mapping templates across imports.
- As an admin, I want to schedule recurring imports from external sources.
- As a user, I want the system to fuzzy-match potential duplicates beyond exact unique identifiers.

---

## 6. Requirements

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
- [ ] Unsupported file types are rejected with a clear error.
- [ ] Password-protected files are rejected with: "We couldn't read this file. Try re-exporting it."
- [ ] ZIP files are rejected with: "ZIP files are not supported. To migrate from another CRM, go to Settings → Migration."
- [ ] Empty files are rejected with: "The file contains no data."
- [ ] First row is always treated as headers.
- [ ] Downloadable CSV templates are available for Contacts, Companies, Deals, Contacts+Companies, and Deals+Companies.

---

#### 2. Column Mapping (Step 2)

Users must be able to map each file column to a CRM field.

**Acceptance Criteria**

- [ ] Two-panel layout: mapping table on left, data preview (up to 100 sample values) on right.
- [ ] Each column gets an "Import As" dropdown (Contact, Company, Deal, Note, Task, Don't Import) and a "CRM Property" dropdown scoped to that object.
- [ ] Auto-mapping applies three tiers: exact match, normalized match, synonym dictionary.
- [ ] Auto-mapping completes within 2 seconds for up to 100 columns.
- [ ] Unmatched columns show "Select attribute" placeholder.
- [ ] User can create new fields inline via "+ Create new field."
- [ ] Two columns mapped to the same field shows an inline error and disables Continue.
- [ ] System/read-only fields are excluded from the mapping dropdown (AI-managed, behavioural, calculated, Created Date, Created By, Modified Date, Modified By, Source).
- [ ] Record ID is allowed for lookup purposes.

---

#### 3. Permission-Aware Mapping

Mapping must respect the user's object-level permissions.

**Acceptance Criteria**

- [ ] User with Contact write access but no Company write access sees Company association fields (Domain, Record ID) enabled.
- [ ] User with Contact write access but no Company write access sees Company mutation fields (Name, Industry, ARR, etc.) disabled with tooltip: "You don't have permission to edit Companies."
- [ ] Backend enforces permission even if frontend is bypassed.
- [ ] If user maps Company Domain for association and no matching company is found, contact is created without company association and error report notes the reason.

---

#### 4. Unique Identifier Enforcement

The system must detect duplicates using unique identifiers per object.

|Object|Unique Identifier|
|---|---|
|Contacts|Email Address|
|Companies|Domain|
|Deals|Deal Name + Deal Stage + Deal Owner (composite)|
|Custom Objects|Admin-configured field, or Record ID|
|Lists|Same as parent object|

**Acceptance Criteria**

- [ ] Info banner shown at top of mapping page explaining unique identifiers per object.
- [ ] If user clicks Continue without mapping a unique identifier, a blocking modal appears.
- [ ] Modal has checkbox "I understand — let the system create duplicate records."
- [ ] "Continue anyway" is disabled until checkbox is checked.
- [ ] If unique identifier is mapped and a row matches an existing record, Preview shows Update.
- [ ] If unique identifier is mapped and no match, Preview shows Create.
- [ ] If no unique identifier mapped, all rows show Create.

---

#### 5. Date Format and Pipeline Selection

Date format and pipeline must be selected at mapping time, not deferred.

**Acceptance Criteria**

- [ ] When a column is mapped to a Date field, a date format picker appears.
- [ ] Continue is disabled until date format is selected.
- [ ] When a column is mapped to Deal Stage, a pipeline selector appears.
- [ ] Pipeline defaults to workspace default but user must confirm.

---

#### 6. "Don't Overwrite" Toggle

Each mapped column must have a toggle to protect existing data.

**Acceptance Criteria**

- [ ] Toggle is off by default.
- [ ] When on, import only fills empty values on existing records.
- [ ] When on, existing non-empty values are never replaced.
- [ ] Empty cells in the import file never overwrite existing data regardless of toggle.

---

#### 7. Review Values with Inline Editing (Step 3)

Users must be able to review and fix data issues before import.

**Acceptance Criteria**

- [ ] Two-panel layout: column sidebar with alert icons and error counts, value table on right.
- [ ] Values grouped into "Needs Review" (errors) and "Valid" (clean).
- [ ] Each invalid value is editable inline.
- [ ] Changes re-validate on blur and update counts immediately.
- [ ] For select/multi-select: user can remap to existing option or add as new option.
- [ ] Bulk fix button adds all unrecognized values as new options.
- [ ] Invalid values do not block import. Unfixed values are skipped for that field/row.
- [ ] Unique values for a column load within 1 second.

**Validation by Field Type**

|Field Type|Key Validations|Error Message|Needs Dropdown?|
|---|---|---|---|
|Text|Max length, invalid characters, formula injection, required|"This field is required."|No|
|Email|Format, multiple emails, separator, duplicates, required|"Invalid email"|Yes|
|Phone|Format, length, invalid characters, separator, country code, multiple numbers|"Invalid phone"|Yes|
|Date|Format match, impossible date, ambiguous date|"Invalid date"|Date picker|
|Number|Numeric, decimals, range (min/max), negative, decimal separator|"Invalid number"|No|
|Currency|Amount, mixed currencies, unsupported currency|"Invalid Currency"|No|
|Select|Option exists, archived, typo|"Option not exist"|Yes|
|Multi-select|Option exists, separator, duplicates, too many|"Option not exist"|Yes|
|Yes/No|Boolean value recognition|"Option not exist"|Yes|
|URL|Valid URL, LinkedIn URL, Twitter/X URL|"Enter a valid URL."|No|
|Domain|Valid domain, email-in-domain, URL-in-domain, public domain|"Invalid domain"|No|
|User/Owner|User exists, active, ambiguous match|"Invalid user"|Yes|
|Status|Status exists, archived|"Option not exist"|Yes|
|Pipeline Stage|Stage exists, stage in pipeline, archived|"Option not exist"|Yes|
|Relationship|Record found, multiple matches, duplicate association|"No matching record found."|Yes|
|Rating|Valid rating, range|"Invalid rating"|No|
|Timestamp|Valid datetime, timezone|"Invalid timestamp"|No|
|Location|Valid location, country recognition|"Enter a valid location."|Yes (country)|
|Blank|Optional skip, required error, blank row skip|"Empty values will be skipped."|No|

---

#### 8. Preview & Enrichment (Step 4)

Users must see exactly what will happen before importing.

**Acceptance Criteria**

- [ ] Summary cards show: "X will be created", "Y will be updated", "Z will be skipped."
- [ ] Multi-object imports show separate tabs per object with per-tab counts.
- [ ] Data table shows each record with Create (+) or Update (pencil) icon.
- [ ] Enrichment toggle lets user choose whether to enrich after import.
- [ ] Enrichment only fills empty fields, never overwrites.
- [ ] If active workflows would fire, a warning shows workflow names and option to suppress.

---

#### 9. Import Execution (Step 5)

The import must run in the background with progress visibility.

**Acceptance Criteria**

- [ ] Import job starts within 2 seconds.
- [ ] Progress bar shows percentage and "Processing record X of Y."
- [ ] Live counters show Created / Updated / Failed.
- [ ] "You can safely close this page" message is shown.
- [ ] Cancel button stops import. Already-processed records are kept.
- [ ] One bad row does not roll back the entire import.
- [ ] Job is idempotent per row. Crash and restart does not reprocess rows.
- [ ] Max 1 active import per workspace. Additional imports are queued with position and wait time.

**Completion States**

- [ ] Success: "Import complete. [X] rows created, [Y] rows updated."
- [ ] Partial success: "Import completed with issues. [X] created, [Y] updated, [Z] failed."
- [ ] Failed rows message: "[Z] rows couldn't be imported. Download the failed rows file to review errors and re-import after fixing them."
- [ ] Error CSV includes original data + "Error Reason" and "Failed Field" columns.
- [ ] In-app notification on completion.
- [ ] Email notification with per-object breakdown and link to import history.

---

#### 10. Multi-Object Import

A single file must support creating and linking records across multiple objects.

**Acceptance Criteria**

- [ ] When relationship fields are mapped, system detects multi-object scope.
- [ ] Related objects (Companies) are created first, then primary records (Contacts), then child entities (Deals, Notes, Tasks).
- [ ] Entities on the same row are linked to each other.
- [ ] If company domain matches an existing company, contact is linked to it.
- [ ] If company domain does not match, a new company is created (if user has permission).
- [ ] Company data conflicts across rows: single-value fields → last row wins (unless Don't Overwrite on). Multi-value fields → additive.
- [ ] Public email domains (gmail, outlook) do not auto-create companies.
- [ ] Preview shows separate tabs per affected object.

---

#### 11. Import into a List

Users must be able to import directly into a static list.

**Acceptance Criteria**

- [ ] Import from list page targets the list's parent object.
- [ ] Destination shown as "Importing into [List Name] (Object)."
- [ ] Extra setting: "For records already in this list: Add again / Update existing."
- [ ] New fields created via "+ Create new field" are added to the parent object.
- [ ] Successfully created/updated records are added to the list.
- [ ] Only works with static lists.

---

#### 12. Post-Import System Rules

System must apply consistent rules to all imported records.

**Acceptance Criteria**

- [ ] Source field auto-set to "CSV Import" on all created records. Not mappable.
- [ ] Record owner defaults to importing user unless Owner column is mapped and resolved.
- [ ] Owner resolution matches by email first, then full name.
- [ ] Activity timeline entry on every affected record: "Record created/updated via import — [file name]."
- [ ] Empty cells never overwrite existing data.
- [ ] Multi-value fields are additive (existing values preserved, new values added).
- [ ] Intra-file duplicates: warning shown, last occurrence wins.

---

#### 13. Undo Import

Admins must be able to undo a completed import.

**Acceptance Criteria**

- [ ] Admin selects completed import from Settings → Imports.
- [ ] System shows: "This will permanently delete [X] records that were created. Updated records cannot be reverted. Type UNDO to confirm."
- [ ] Created records are bulk-deleted. Status changes to "Undone."
- [ ] Records updated by a subsequent import cannot be undone. Message explains why.

---

#### 14. Import History

Users must be able to view and manage past imports.

**Acceptance Criteria**

- [ ] Settings → Imports shows: Date, User, Object, File name, Created, Updated, Failed, Status.
- [ ] Statuses: Completed, Failed, Canceled, Draft, Queued.
- [ ] Drafts are resumable from the step where user left off.
- [ ] Admins see all imports. Reps see only their own.
- [ ] Completed imports archived after 90 days. Drafts auto-deleted after 30 days.

---

### Nice-to-Have (P1)

#### 15. Import API

Developers should be able to automate imports programmatically.

**Acceptance Criteria**

- [ ] POST /api/v1/imports accepts file + JSON payload (target object, mappings, dedup settings, list ID).
- [ ] Returns import ID immediately. Import runs asynchronously.
- [ ] GET /api/v1/imports/{importId} returns status, per-object counts, error report URL.
- [ ] Same validation pipeline as UI wizard.
- [ ] Rate limit: 10 imports/hour/workspace.
- [ ] Max file size: 100 MB.
- [ ] Webhook callback configurable per workspace.

---

#### 16. Workflow Trigger Warning

Users should be warned if their import would trigger active workflows.

**Acceptance Criteria**

- [ ] System checks active workflows with "Record created" or "Field updated" triggers before import.
- [ ] Warning shows workflow names and estimated trigger count.
- [ ] Option to suppress workflows for this import.

---

#### 17. Workspace Record Limit Warning

Users should be warned if the import would exceed workspace limits.

**Acceptance Criteria**

- [ ] Preview shows: "Your workspace has space for X records. This import creates Y."
- [ ] Warning does not block import but is clearly visible.

---

#### 18. CSV Delimiter and Encoding Handling

System should handle non-standard file formats gracefully.

**Acceptance Criteria**

- [ ] Auto-detect comma, semicolon, tab, and pipe delimiters.
- [ ] If delimiter is ambiguous, ask user.
- [ ] If encoding is not UTF-8, show warning: "Some characters may not display correctly. Try re-saving as UTF-8."
- [ ] User can continue or re-upload.

---

### Future Considerations (P2)

- [ ] Scheduled/recurring imports.
- [ ] Saved mapping templates for reuse across imports.
- [ ] Undo for updated records (requires field-level change tracking).
- [ ] Fuzzy duplicate matching beyond exact unique identifiers.
- [ ] AI-assisted mapping for non-English headers.
- [ ] Same-object associations (contact-to-contact relationships).
- [ ] ZIP file multi-file import for migration scenarios.

---

## 7. Technical Considerations

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

## 8. Success Metrics

### Leading Metrics

- Import wizard completion rate.
- Auto-mapping accuracy (user override rate).
- Average time to complete for files under 1K rows.
- Import error rate (failed rows / total rows).
- Number of imports per workspace per week.

### Lagging Metrics

- Support tickets about import as percentage of total volume.
- API import adoption (workspaces using Import API).
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

## 9. Open Questions

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

## 10. Edge Cases

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
| Undo on records updated by later import                     | Cannot undo. Message explains why.                                                  |
| Formula injection (=, +, -, @)                              | Sanitized. "Formula values are not supported."                                      |
| Unicode and accents                                         | UTF-8 supported. Garbled characters trigger warning.                                |
| Very long text                                              | Truncated if exceeds field max length.                                              |
| Blank row                                                   | Skipped entirely.                                                                   |