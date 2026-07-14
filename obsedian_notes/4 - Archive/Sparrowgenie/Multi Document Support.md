---
state: "[[Idea]]"
tags:
  - new_feature/projects/multi_doc_support
version: 1
related:
  - "[[Attachments in RFP response - Product Spec]]"
  - "[[Shihab Document]]"
  - "[[Genie Actions inside the Questions card]]"
  - "[[Getting started  with SparrowGenie]]"
  - "[[Genie Contribution]]"
  - "[[Project Share - RFx and Proposal]]"
  - "[[Routine]]"
  - "[[Friction points]]"
  - "[[First-Principles Product Template]]"
  - "[[Table view for question card PRD]]"
  - "[[Proposal Conversion Flow]]"
  - "[[WYSIWYG editor - First Principle]]"
  - "[[Final PRD -Rich Text Editor for Project Response Area]]"
  - "[[Create a project]]"
  - "[[RFP to Proposal]]"
---

## 1. Problem Statement

- While receiving the RFx users will receive more than one documents that needs to be answered, there's no premise in today's implementation to resolve this

## 2. Goals

- Ability to add one or more documents up to 5
- Ability to map all the documents one by one by clicking "Next"
- Ability to save the mapping once the diagnosis have zero issues by two ways
    - If the user clicks the "Another File"
    - If the user clicks the "Next"
- Ability to add more files during mapping before finish mapping
- Ability to remove the files during mapping before finish mapping
    - Given that if user map and delete then show the delete caution modal
- Ability to map with Genie AI in the file level
- Ability to upload different formats of file at the same time (XLSX, XLS, CSV and DOCX)
- Ability to unmap the mappings in file level
- Ability to undo and redo in file level
- Ability to see the Instructions, Sections and Sub-sections, Questions and Answers
- Ability to navigate from files to files, using the navigation tabs and navigation numbers
- Ability to view the mapped multi-documents in the Files pane in the left side nav bar
- Ability to filter the All Questions, Unassigned Questions, Unanswered Questions, Drafts, Pending Review, Reviewed
- Ability to download the filled answered files, by two options
    - Download as ZIP all the files max 5
    - Separate files

## 3. Non-Goals

- Ability to auto save the mapping by various methods caching or storing in the backend
- Ability to view the summarized version of all mapping how many Instructions, Sections and Sub-sections, Questions and Answers mapped
- Ability to delete the files after mapping
- Ability to add files after mapping
- Ability to view the recent downloads

## 4. User Stories

### File Upload & Management

- "As an RFx Response Manager, I want to upload up to 5 RFx documents in a single session so that I can manage an entire RFx package without creating separate responses"
- "As an RFx Response Manager, I want to upload documents in different formats (XLSX, XLS, CSV, DOCX) at the same time so that I can work with RFx packages regardless of the file formats the issuer chose"
- "As an RFx Response Manager, I want to add more files during the mapping process (before finishing) so that I can include documents I missed or received late"
- "As an RFx Response Manager, I want to remove a file during the mapping process so that I can correct mistakes if I uploaded the wrong document"
- "As an RFx Response Manager, I want to see a caution modal when I attempt to delete a file that already has mappings so that I do not accidentally lose completed work"
- "As an RFx Response Manager, I want to see a clear error message when I attempt to upload more than 5 files so that I understand the system limit"
- "As an RFx Response Manager, I want to see a clear error when I upload an unsupported file format so that I know which formats are accepted"

### Document Mapping Workflow

- "As an RFx Response Manager, I want to map documents one by one by clicking 'Next' so that I can work through each document in a structured, sequential flow"
- "As an RFx Response Manager, I want my mapping to be saved automatically when I click 'Another File' or 'Next' (provided diagnosis shows zero issues) so that my progress is preserved without a separate save action"
- "As an RFx Response Manager, I want the 'Save' action to be blocked when file diagnosis still has issues so that I do not save an incomplete or broken mapping"
- "As an RFx Response Manager, I want to use Genie AI to assist with mapping at the individual file level so that I can speed up the mapping process and reduce manual effort"
- "As an RFx Response Manager, I want to unmap all mappings for a specific file so that I can start over on a document without affecting other files in the package"
- "As an RFx Response Manager, I want to undo and redo mapping actions at the file level so that I can quickly correct mistakes without re-doing work from scratch"

### Navigation & Viewing

- "As an RFx Response Manager, I want to see the Instructions, Sections, Sub-sections, Questions, and Answers for each document so that I can understand the full structure of every RFx document"
- "As an RFx Response Manager, I want to navigate between files using tabs and numbered indicators so that I can quickly switch context between documents in the package"
- "As an RFx Response Manager, I want to view all mapped documents in a Files pane in the left sidebar so that I have a persistent overview of all documents and their mapping status"

### Filtering

- "As an RFx Response Manager, I want to filter questions by status (All, Unassigned, Unanswered, Drafts, Pending Review, Reviewed) so that I can focus on the work that still needs attention"

### Download & Export

- "As an RFx Response Manager, I want to download all answered files as a single ZIP archive so that I can quickly export the entire RFx response package"
- "As an RFx Response Manager, I want to download individual answered files separately so that I can share or review specific documents on their own"

## 5. Requirements

### Must-Have (P 0)

**P 0-1: Multi-file upload (1–5 documents)**

Description: Users can upload between 1 and 5 RFx documents in supported formats (XLSX, XLS, CSV, DOCX) in a single session.

Technical considerations: The upload service must handle concurrent multi-file parsing without blocking the UI. Each format requires a distinct parser (e.g., SheetJS for XLSX/XLS, CSV parser, DOCX parser).

Dependencies: Backend upload service, file parsing libraries.

---

**P 0-2: Sequential mapping via "Next"**

Description: Users can map documents one by one in sequence. Clicking "Next" advances to the next unmapped file.

Technical considerations: The "Next" action must trigger diagnosis validation before proceeding.

---

**P 0-3: Save mapping on zero-issue diagnosis**

Description: The mapping is automatically saved when the user clicks "Another File" or "Next," provided the file diagnosis shows zero issues.

Technical considerations: Diagnosis validation must run synchronously before the save action is committed.

---

**P 0-4: Mixed format support**

Description: The system accepts and correctly parses XLSX, XLS, CSV, and DOCX files, extracting the document structure (Instructions, Sections, Sub-sections, Questions, Answers) from each.

Technical considerations: CSV files lack native hierarchy; the system may need a convention or heuristic to detect structure. DOCX parsing relies on heading styles for hierarchy detection.

Dependencies: Engineering — confirm CSV structure-detection approach.

---

**P 0-5: File-level Genie AI mapping**

Description: Users can trigger Genie AI to auto-map questions and answers at the individual file level, without affecting other files.

Dependencies: AI Team — Genie AI endpoint must support a `file_id` scope parameter to restrict mapping to a single document.

---

**P 0-6: View document structure**

Description: For each uploaded file, users can see the full hierarchical structure: Instructions, Sections, Sub-sections, Questions, and Answers.

---

**P 0-7: File navigation tabs**

Description: Users can navigate between uploaded files using labeled tabs and numbered indicators.

---

**P 0-8: Left sidebar Files pane**

Description: The left sidebar displays a Files pane showing all uploaded documents and the mapped sections , subsections , and questions 

---

**P 0-9: Question status filter**

Description: Users can filter questions within a file by status: All Questions, Unassigned, Unanswered, Drafts, Pending Review, Reviewed after mapping

---

**P 0-10: Download as ZIP**

Description: Users can download all answered files as a single ZIP archive.

---

**P 0-11: Download individual files**

Description: Users can download individual answered files separately.

---

### Nice-to-Have (P 1)

**P 1-1: Add files during mapping**

Description: Users can add additional files (up to the 5-file limit) while in the mapping workflow, without losing existing mappings.

---

**P 1-2: Remove files during mapping (with caution modal)**

Description: Users can remove files during the mapping workflow. If the file has existing mappings, a caution modal is shown before deletion.

---

**P 1-3: File-level unmap**

Description: Users can clear all mappings for a specific file, resetting it to an unmapped state without affecting other files.

---

**P 1-4: File-level undo/redo**

Description: Users can undo and redo mapping actions scoped to the individual file level.

---

### Future Considerations (P 2)

**P 2-1: Auto-save with caching/backend persistence**

Design the mapping data model so that persisting partial state is straightforward to add later. Consider a session-level state object that can be serialized to local storage or a backend endpoint.

**P 2-2: Cross-document mapping summary**

The file data structure should include aggregate counts (total questions, mapped count, sections count, etc.) to support a future summary dashboard view across all files.

**P 2-3: Post-mapping file management (add/delete)**

Consider the data lifecycle so that post-finalization edits (adding or removing files after mapping is complete) can be supported without breaking download integrity.

**P 2-4: Recent downloads history**

The download action should log metadata (timestamp, files included, format) to support a future downloads history view.

## 6. Success Metrics

### Leading Indicators (days to weeks)

- **Adoption rate:** 40% of RFx sessions use 2+ files within 2 weeks of launch (stretch: 60%). Measured via analytics — count sessions with >1 file uploaded.
- **Activation rate:** 75% of multi-file sessions reach "Finish Mapping" (stretch: 90%). Measured via analytics — sessions reaching terminal mapping state vs. sessions started.
- **Genie AI usage per file:** 50% of individual files use Genie AI mapping (stretch: 70%). Measured via analytics — AI mapping trigger events per file.
- **Time to complete:** Average mapping time per file ≤15 minutes, down from current single-file baseline (stretch: ≤10 min). Measured via timestamp difference between file-start and file-save events.
- **Error rate:** <10% of "Next" clicks are blocked by diagnosis issues (stretch: <5%). Measured via blocked-save events / total next-click events.
- **Download completion rate:** 80% of fully-mapped sessions result in a download (stretch: 90%). Measured via download events / sessions with all files mapped.

### Lagging Indicators (weeks to months)

- **Support ticket reduction:** 20% fewer tickets related to multi-document RFx handling. Measured via support ticket tagging and count comparison (pre vs. post launch).
- **Retention impact:** 10% improvement in weekly active users on the RFx module. Measured via product analytics — WAU on RFx features.
- **NPS / satisfaction change:** +5 points on RFx-specific satisfaction survey. Measured via in-app survey post-mapping completion.

### Setting Targets

- Targets should be specific: "50% adoption within 30 days" not "high adoption"
- Base targets on comparable features, industry benchmarks, or explicit hypotheses
- Set a "success" threshold and a "stretch" target
- Define the measurement method: what tool, what query, what time window
- Specify when you will evaluate: 1 week, 1 month, 1 quarter post-launch

**Evaluation cadence:** Review leading indicators at 1 week and 2 weeks post-launch. Review lagging indicators at 1 month and 1 quarter post-launch.

## 7. Open Questions

- Questions that need answers before or during implementation
- Tag each with who should answer (engineering, design, legal, data, stakeholder)
- Distinguish between blocking questions (must answer before starting) and non-blocking (can resolve during implementation)

### Blocking (must answer before starting)

1. **What is the maximum file size per document? Are there different limits per format?** — Owner: Engineering. Impacts upload validation and parsing performance.
2. **How should diagnosis issues be displayed — inline per question, or as a summary panel?** — Owner: Design. Affects the save-blocking UX from P 0-3.
3. **Does Genie AI mapping need to be aware of other files in the same RFx package (e.g., to avoid duplicate answers), or is each file mapped in complete isolation?** — Owner: Engineering / AI Team. Impacts AI context window and prompt design.
4. **What happens to in-progress mapping if the user closes the browser or navigates away? (Given auto-save is out of scope for v 1.)** — Owner: Engineering / Product. Need to decide whether to show a "you will lose progress" warning or accept data loss in v 1.

### Non-Blocking (can resolve during implementation)

5. **Should the ZIP download preserve original filenames or rename them with a convention (e.g., `RFx-PackageName-File1.xlsx`)?** — Owner: Design / Product. Low-risk decision, can finalize during development.
6. **Should undo/redo (P 1-4) persist across file switches, or reset when the user navigates to another file?** — Owner: Engineering. Scoping this during implementation of P 1-4 is acceptable.
7. **Do we need analytics events for every mapping action, or only for key milestones (file start, save, complete, download)?** — Owner: Data / Product. Can instrument incrementally.
8. **For CSV files, how do we determine the document structure (Sections, Sub-sections) given CSVs have no native hierarchy?** — Owner: Engineering. May require a convention or a pre-mapping structure-detection step.

## 8. Timeline Considerations

- Hard deadlines (contractual commitments, events, compliance dates)
- Dependencies on other teams' work or releases
- Suggested phasing if the feature is too large for one release

### Sprint Plan (2-3 weeks)

**Week 1: Core Upload & Mapping Flow**

- Multi-file upload with format validation (P 0-1, P 0-4)
- Sequential "Next" mapping workflow (P 0-2)
- File navigation tabs and numbered indicators (P 0-7)
- Left sidebar Files pane with status indicators (P 0-8)
- Document structure view — Instructions, Sections, Sub-sections, Questions, Answers (P 0-6)

**Week 2: AI, Filtering, Save & Download**

- Genie AI file-level mapping integration (P 0-5)
- Save-on-zero-diagnosis logic for "Next" and "Another File" (P 0-3)
- Question status filtering (P 0-9)
- Download as ZIP and individual file download (P 0-10, P 0-11)

**Week 3 (Buffer / P 1 Stretch)**

- Add/remove files during mapping (P 1-1, P 1-2)
- File-level unmap (P 1-3)
- File-level undo/redo (P 1-4)
- QA, bug fixes, and polish

### Dependencies

- **AI Team:** Genie AI endpoint must support a `file_id` scope parameter to restrict mapping to a single document.
- **Backend:** Upload service must handle concurrent multi-file parsing without blocking the UI.
- **Design:** Final mockups for the file navigation tabs, left sidebar pane, and delete caution modal are needed before Week 1 development begins.

### Risks

- **Parsing complexity for mixed formats:** DOCX structure extraction differs significantly from XLSX/CSV. If parsing proves unreliable for a specific format, we may need to descope that format to P 1.
- **Sprint overrun on P 1 items:** Undo/redo at file level has hidden complexity (state management, memory). If Week 2 runs long, P 1 items should be deferred to a fast-follow sprint rather than delaying the P 0 launch.

---

## 9. Acceptance Criteria (UAT Checklist)

This section consolidates all acceptance criteria from the requirements above into a single checklist, classified by priority. Use this as a UAT sign-off sheet — each item is independently testable.

### Must-Have (P 0)

**P 0-1: Multi-file upload (1–5 documents)**

- [ ] Given the user is on the RFx upload screen, when they select 1 to 5 files in supported formats, then all files are uploaded and listed with their filenames and format icons
- [ ] Given the user has already uploaded 5 files, when they attempt to add a 6 th file, then the system displays an error message indicating the 5-file limit
- [ ] Given the user selects a file in an unsupported format (e.g., PDF, TXT), when they confirm the upload, then the system rejects the file and displays a clear error listing accepted formats
- [ ] Given the user selects a mix of XLSX, XLS, CSV, and DOCX files, when uploading, then each file is accepted and parsed according to its format

**P 0-2: Sequential mapping via "Next"**

- [ ] Given the user has uploaded multiple files, when they complete mapping on the current file and click "Next," then the system moves to the next unmapped file in order
- [ ] Given the user is on the last file in the sequence, when they click "Next," then the button label changes to "Finish Mapping" and clicking it completes the workflow
- [ ] Given the user has not completed mapping on the current file, when they click "Next" and the diagnosis shows issues, then navigation is blocked and the issues are displayed

**P 0-3: Save mapping on zero-issue diagnosis**

- [ ] Given the current file's diagnosis shows zero issues, when the user clicks "Another File," then the mapping is saved and a new file picker opens
- [ ] Given the current file's diagnosis shows zero issues, when the user clicks "Next," then the mapping is saved and the next file is loaded
- [ ] Given the current file's diagnosis has issues, when the user clicks "Another File" or "Next," then the save is blocked, and the issues are displayed inline
- [ ] Given the mapping is saved, when the user navigates back to that file, then the saved mappings are visible and intact

**P 0-4: Mixed format support**

- [ ] Given the user uploads an XLSX file, when parsing completes, then the system extracts and displays the correct hierarchical structure
- [ ] Given the user uploads a CSV file, when parsing completes, then the system maps rows/columns to the expected structure (Sections, Questions, etc.)
- [ ] Given the user uploads a DOCX file, when parsing completes, then headings are mapped to Sections/Sub-sections and body content is mapped to Questions/Answers
- [ ] Given a file is corrupted or unreadable, when parsing fails, then the system displays a clear error for that specific file without affecting other uploaded files

**P 0-5: File-level Genie AI mapping**

- [ ] Given the user is on a specific file's mapping view, when they trigger "Map with Genie AI," then the AI maps only that file's questions
- [ ] Given Genie AI is running on File A, when the user switches to File B, then File B's mappings are unaffected
- [ ] Given Genie AI completes mapping, when the user reviews results, then each mapped question shows the AI-suggested answer with a "Draft" status
- [ ] Given Genie AI fails or times out, when the error occurs, then a clear error message is shown and existing manual mappings are preserved

**P 0-6: View document structure**

- [ ] Given a file is uploaded and parsed, when the user views that file, then they see a hierarchical tree of Instructions, Sections, Sub-sections, Questions, and Answers
- [ ] Given a file has no Instructions section, when the user views the structure, then the Instructions section is omitted (not shown as empty)
- [ ] Given a file has deeply nested sub-sections, when the user views the structure, then all levels of nesting are displayed correctly

**P 0-7: File navigation tabs**

- [ ] Given multiple files are uploaded, when the mapping view loads, then a tab bar shows all files with their names and numbered indicators (1, 2, 3, etc.)
- [ ] Given the user clicks a file tab, when the view updates, then the selected tab is visually highlighted and the corresponding file's mapping is displayed
- [ ] Given the user clicks a numbered navigation indicator, when the view updates, then it navigates to the corresponding file
- [ ] Given a file has been fully mapped, when the user views the tabs, then that file's tab shows a visual "completed" indicator (e.g., checkmark)

**P 0-8: Left sidebar Files pane**

- [ ] Given the user is in the mapping workflow, when they open the left sidebar, then they see all uploaded files listed with filename, format icon, sections , and subsections 

**P 0-9: Question status filter**

- [ ] Given the user is viewing a file's questions, when they select "All Questions," then all questions for that file are displayed
- [ ] Given the user selects "Unassigned," when the filter is applied, then only questions with no assignee are shown
- [ ] Given the user selects "Unanswered," when the filter is applied, then only questions without any answer (manual or AI-drafted) are shown
- [ ] Given the user selects "Drafts," when the filter is applied, then only questions with draft answers are shown
- [ ] Given the user selects "Pending Review," when the filter is applied, then only questions awaiting review are shown
- [ ] Given the user selects "Reviewed," when the filter is applied, then only questions marked as reviewed are shown
- [ ] Given any filter is active, when the user views the filter bar, then a count of matching questions is displayed next to each filter option

**P 0-10: Download as ZIP**

- [ ] Given all files have completed mappings, when the user clicks "Download All as ZIP," then a ZIP archive containing all answered files (up to 5) is downloaded
- [ ] Given the ZIP is downloaded, when the user extracts it, then each file is in its original format (XLSX, XLS, CSV, or DOCX) with answers populated
- [ ] Given some files are not fully mapped, when the user clicks "Download All as ZIP," then only fully mapped files are included, and a warning indicates which files were excluded

**P 0-11: Download individual files**

- [ ] Given a file has a completed mapping, when the user clicks "Download" on that specific file, then the answered file is downloaded in its original format
- [ ] Given a file is not fully mapped, when the user attempts to download it, then the system warns the user that the file is incomplete and asks for confirmation before downloading

### Nice-to-Have (P 1)

**P 1-1: Add files during mapping**

- [ ] Given the user is in the mapping workflow and has fewer than 5 files, when they click "Add File," then a file picker opens
- [ ] Given the user selects a valid file, when the upload completes, then the new file is appended to the file list and tabs without affecting existing mappings
- [ ] Given the user already has 5 files, when they click "Add File," then the button is disabled or shows a tooltip explaining the limit

**P 1-2: Remove files during mapping (with caution modal)**

- [ ] Given the user clicks "Remove" on a file with existing mappings, when the modal appears, then it warns that all mappings for this file will be lost and asks for confirmation
- [ ] Given the user confirms deletion in the modal, when the action completes, then the file and its mappings are removed and the tab bar updates
- [ ] Given the user cancels deletion in the modal, when the modal closes, then the file and mappings remain unchanged
- [ ] Given the user clicks "Remove" on a file with no mappings, when the action completes, then the file is removed immediately without a modal

**P 1-3: File-level unmap**

- [ ] Given a file has completed or partial mappings, when the user clicks "Unmap All" on that file, then all mappings for that file are cleared
- [ ] Given the user unmaps a file, when the status updates, then the file returns to "unmapped" status in the sidebar and tabs
- [ ] Given the user unmaps File A, when they view File B, then File B's mappings are completely unaffected

**P 1-4: File-level undo/redo**

- [ ] Given the user has made mapping changes on a file, when they click "Undo," then the last mapping action on that file is reversed
- [ ] Given the user has undone an action, when they click "Redo," then the reversed action is reapplied
- [ ] Given the user switches from File A to File B and back to File A, when they click "Undo," then the undo applies to File A's action history
- [ ] Given no actions have been performed on the current file, when the user views the toolbar, then the "Undo" button is disabled
- [ ] Given no actions have been undone on the current file, when the user views the toolbar, then the "Redo" button is disabled

### Future Considerations (P 2)

**P 2-1: Auto-save with caching/backend persistence**

- [ ] To be defined when feature is scoped for implementation

**P 2-2: Cross-document mapping summary**

- [ ] To be defined when feature is scoped for implementation

**P 2-3: Post-mapping file management (add/delete)**

- [ ] To be defined when feature is scoped for implementation

**P 2-4: Recent downloads history**

- [ ] To be defined when feature is scoped for implementation

---

_Document version: 1.1 — Draft_ _Last updated: April 14, 2026_