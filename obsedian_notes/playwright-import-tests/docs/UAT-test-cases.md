# UAT Test Cases — Contacts / Companies / Deals Import

Manual UAT checklist for the import feature. Each ID maps 1:1 to an automated
Playwright test in `tests/` (see the ID in the test title, e.g. `[C-12]`).

Prefixes: **C** = Contacts, **Co** = Companies, **D** = Deals.
Run the automated suite first, then use this doc to sign off edge cases a
human needs to eyeball.

Legend — Priority: P0 blocker, P1 high, P2 medium.

---

## 1. Happy path

| ID | Scenario | Steps | Expected result | Priority | Automated |
|----|----------|-------|-----------------|----------|-----------|
| C-01 / Co-01 / D-01 | Import a valid file | Open list → Import → upload `valid.csv` → map columns → Submit | All rows created; success summary shows correct count; records visible in list | P0 | ✅ |
| C-02 | Import valid XLSX (if supported) | As above with `.xlsx` | Same as CSV | P1 | ➖ manual |
| C-03 | UTF-8 / accented + non-Latin names | Upload file with "José", "Chandrā", emoji | Values stored intact, no mojibake | P1 | ➖ manual |

## 2. Validation / error cases (the focus)

| ID | Scenario | Steps | Expected result | Priority | Automated |
|----|----------|-------|-----------------|----------|-----------|
| C-10 / Co-10 / D-10 | Wrong file type | Upload `.txt` / `.pdf` | Clear error: only CSV/XLSX allowed; upload rejected | P0 | ✅ |
| C-11 / Co-11 / D-11 | Unrecognised / missing headers | Upload file with renamed headers | Wizard flags unmapped columns; cannot proceed without required fields | P0 | ✅ |
| C-12 / Co-12 / D-12 | Missing required field | Row with blank Email / Company Name / Deal Name | Row-level error; bad rows not imported; good rows may still import | P0 | ✅ |
| C-13 / Co-13 / D-13 | Duplicate records | Two identical rows / record already exists | Duplicate skipped or merged per rules; count reflects it; no silent overwrite | P0 | ✅ |
| C-14 | Invalid email format | `notanemail` in Email | Row flagged as invalid email | P0 | ✅ (in C-12 file) |
| D-14 | Invalid amount / date | `Amount = "fifteen thousand"`, bad date | Row flagged; type validation message shown | P0 | ✅ (invalid-amount.csv) |
| Co-14 | Invalid numeric (Employees) | `Employees = "not-a-number"` | Row flagged | P1 | ✅ (missing-name.csv) |
| C-15 | Empty file (headers only / 0 rows) | Upload file with header row only | Friendly "no rows to import" message, no crash | P1 | ➖ manual |
| C-16 | Completely empty file (0 bytes) | Upload empty file | Graceful error, no crash | P1 | ➖ manual |
| C-17 | Malformed CSV (unclosed quotes, ragged columns) | Upload broken CSV | Parser error surfaced clearly; no partial garbage import | P1 | ➖ manual |
| C-18 | Extra / unmapped columns | File has columns app doesn't know | Allowed; extra columns ignored or offered as custom fields | P2 | ➖ manual |
| C-19 | Leading/trailing whitespace, mixed case emails | ` Alice@Example.com ` | Trimmed & normalised (or documented behaviour) | P2 | ➖ manual |
| C-20 | Cancel mid-import | Start import, cancel before finish | No partial data committed / clearly rolled back | P1 | ➖ manual |
| C-21 | Network drop during import | Kill connection mid-upload | Error shown; retry possible; no duplicate records on retry | P1 | ➖ manual |
| C-22 | Permission / role restriction | Import as a user without import rights | Action blocked with permission message | P1 | ➖ manual |

## 3. Large file & limits

| ID | Scenario | Steps | Expected result | Priority | Automated |
|----|----------|-------|-----------------|----------|-----------|
| C-20L / Co-20 / D-20 | File over row limit | `npm run gen:data` then import `large-*.csv` | Either imports fully, or graceful "limit exceeded"; never hangs/crashes | P0 | ✅ |
| C-23 | File over size (MB) limit | Upload file above documented MB cap | Rejected with size-limit message | P1 | ➖ manual |
| C-24 | Import progress feedback | Import large file | Progress indicator; UI stays responsive | P1 | ➖ manual |
| C-25 | Partial import reporting | Large file with some bad rows | Summary shows created vs failed counts; failed rows downloadable | P1 | ➖ manual |

## 4. Column mapping

| ID | Scenario | Steps | Expected result | Priority | Automated |
|----|----------|-------|-----------------|----------|-----------|
| C-30 / Co-30 / D-30 | All columns shown | Upload valid file → mapping step | Every file column appears for mapping | P0 | ✅ |
| C-31 / Co-31 / D-31 | Required fields enforced | Leave required field unmapped → Submit | Submit blocked / error until mapped | P0 | ✅ |
| C-32 | Auto-mapping | Upload file with standard headers | Matching columns pre-mapped automatically | P1 | ➖ manual |
| C-33 | Re-map a column | Change a mapping then submit | New mapping honoured in imported data | P1 | ➖ manual |
| C-34 | Map two columns to same field | Point two columns at Email | Prevented or last-wins with warning | P2 | ➖ manual |
| C-35 | Skip a column | Mark a column "Do not import" | Column ignored, rest imported | P2 | ➖ manual |

---

### Sign-off

| Entity | Tester | Date | Build | Result (Pass/Fail) | Notes |
|--------|--------|------|-------|--------------------|-------|
| Contacts |  |  |  |  |  |
| Companies |  |  |  |  |  |
| Deals |  |  |  |  |  |

> ➖ manual = worth a human check; not covered by the automated suite (usually
> because it needs infra manipulation like network drops, or product decisions
> like de-dupe/normalisation rules that must be confirmed first).
