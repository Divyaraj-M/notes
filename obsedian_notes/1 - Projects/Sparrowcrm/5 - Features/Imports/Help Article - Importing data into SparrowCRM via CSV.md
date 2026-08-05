---
type: help-article
tags:
  - sparrowcrm/help/import
---

# Importing your data into SparrowCRM

Got a spreadsheet of leads, accounts, or deals? Instead of typing them in one by one, upload the file and SparrowCRM will create everything for you. This page walks you through it in plain terms — and if something doesn't go the way you expected, jump to [[#When something goes wrong]] and open the situation that matches yours.

> [!info] Who can import
> You can import if you have access to the records you're creating. If you don't see an **Import** button, your admin controls who can import — just ask them to switch it on.

---

## Start here: what are you trying to bring in?

Pick the situation closest to yours. It decides which file you build and where you import it.

- **[[#A list of people (Contacts)]]** — event leads, sign-ups, a list of contacts
- **[[#A list of companies]]** — accounts or organizations
- **[[#A list of deals]]** — opportunities in your pipeline
- **[[#People and their companies, in one file]]** — contacts plus the company they work at
- **[[#Deals and their companies, in one file]]** — opportunities linked to accounts
- **[[#Updating records you already have]]** — fix or enrich existing data in bulk

### A list of people (Contacts)

Build one row per person. At minimum include a **First Name** and an **Email** — email is what stops the same person being added twice, and it lets SparrowCRM fill in extra detail like their photo and company automatically. Start from the [[#Grab a template|Contacts template]].

### A list of companies

One row per company. Always include the **Domain / Website** — it's what keeps companies from doubling up and powers auto-enrichment. Start from the [[#Grab a template|Companies template]].

### A list of deals

One row per deal. Deals need a **Deal Name**, a **Deal Owner**, and a **Stage** — without all three the row won't import. Start from the [[#Grab a template|Deals template]].

### People and their companies, in one file

Keep it as a Contacts file (one row per person) and add a company **Domain** column. SparrowCRM links each person to that company — creating the company if it doesn't exist yet — so you don't need a second file.

### Deals and their companies, in one file

Import as a Deals file and include the company **Domain** so each deal attaches to the right account. If you've got people, companies *and* deals all together, do it in two passes: import the people first, then the deals.

### Updating records you already have

Importing isn't just for new data — it's also the fastest way to fix or enrich records in bulk. As long as you include the matching field (**Email** for people, **Domain** for companies), SparrowCRM updates the existing record instead of making a new one. See [[#I'm ending up with duplicate records]] if that isn't happening.

---

## Grab a template

The easiest start is a ready-made template — the columns are already named correctly, with example rows showing the right format. Download one, swap in your data, delete the columns you don't need, and save as CSV.

- **Contacts** — `Contacts_Import_Template.csv`
- **Companies** — `Companies_Import_Template.csv`
- **Deals** — `Deals_Import_Template.csv`

You don't have to fill every column — keep the ones you have. Just don't drop the required or matching fields for your object.

---

## How the import works, step by step

The importer walks you through five short steps. You can leave and come back — nothing is saved to your CRM until the final step.

1. **Upload your file.** Open Contacts, Companies, or Deals (or a list), click **Import**, and drop your file in. CSV, XLS, and XLSX all work.
2. **Match your columns.** SparrowCRM guesses which CRM field each column is. Check the guesses, fix any that are off, and skip anything you don't want. Columns you don't match are simply ignored.
3. **Check and fix values.** Anything that looks off — a malformed email, an unfamiliar dropdown value — is flagged here so you can correct it before it lands. Nothing is imported yet.
4. **Preview.** See how many records will be created versus updated. This is your last look before committing.
5. **Import.** It runs in the background — you can close the tab and it keeps going. When it's done you'll get a confirmation, plus a downloadable file of anything that didn't make it.

---

## When something goes wrong

Most import hiccups are quick to fix. Open the one that sounds like what you're seeing.

> [!question]- I'm ending up with duplicate records
> This almost always means the file didn't include a field SparrowCRM can use to recognize an existing record, so it created a new one for every row.
>
> **Fix:** Re-import with the matching field mapped — **Email** for people, **Domain** for companies. When a row matches an existing record on that field, it updates it instead of duplicating. (Deals are matched on Deal name + Stage + Owner together.)
>
> Note: there's no "Record ID" column used for matching — stick to Email and Domain.

> [!question]- Some rows didn't import and I got an error file
> That's expected — one bad row never stops the rest of your import. SparrowCRM finishes everything it can and hands you a file listing only the rows that didn't make it.
>
> The error file has an **Error Reason** and **Row Number**, followed by all your original columns.
>
> **Fix:** Open the file, read the reason next to each row, correct those rows, and import that file again. You're only re-importing the handful that failed.

> [!question]- My dropdown, status, or stage values didn't come through
> Fields like Industry, Status, or Deal Stage only accept values that already exist in your workspace. If your file has a value that isn't set up yet, it gets flagged at the **Check and fix** step.
>
> **Fix:** At that step you can either map the value to an existing option, or turn on **Create missing options** to add it during import. If you skip it, that one field is left blank for those rows.

> [!question]- My dates or numbers look wrong
> SparrowCRM can't always tell whether `03/04` means March 4 or April 3, or whether `1.000` means one thousand or one-point-zero.
>
> **Fix:** At the **Check and fix** step, use the format setting on date and number columns to tell it exactly how your file is written. For money, remove currency symbols and don't mix currencies in one column.

> [!question]- The owner didn't get assigned to the right person
> An owner has to match a real member of your workspace. If the name or email in your file doesn't match anyone, SparrowCRM can't assign it.
>
> **Fix:** Use the person's **email** in the Owner column — it's matched most reliably. If a value can't be matched, the record is assigned to you by default, and you can reassign later.

> [!question]- My companies weren't created or linked to people
> Two common causes: the file didn't include a company **Domain** to link on, or the email domain is a public one.
>
> Personal email domains like `gmail.com`, `outlook.com`, and `icloud.com` never auto-create a company — otherwise everyone with a Gmail address would spawn a "Gmail" company.
>
> **Fix:** Add a company Domain column so people link to the correct account. If you only have work emails, that's enough — SparrowCRM can create and link companies from those automatically.

> [!question]- I imported successfully but don't see the columns I added
> A column only comes in if it was matched to a field at the **Match your columns** step. Anything left unmatched is ignored.
>
> **Fix:** Re-run the import and make sure each column you care about is mapped to a field (or use **+ Create Attribute** to make a new one on the spot).

> [!question]- My file won't upload
> Check it against these limits:
>
> | Must be | Detail |
> | --- | --- |
> | A CSV or Excel file | .csv, .xls, or .xlsx |
> | Under the size cap | Up to 10 MB (most files are far smaller — 10,000 rows is only a few hundred KB) |
> | Within the row/column limits | Up to 100,000 rows and 100 columns |
> | Have a header row | The first row must be your column names |
> | Not empty | Files with no data are rejected |
>
> If it's an Excel file with several sheets, you'll be asked which sheet to use.

> [!question]- My import seems stuck, or won't start
> Only one import runs per workspace at a time. If someone else is mid-import, yours waits in line and starts automatically after.
>
> **Fix:** Give it a moment — you can safely close the page and it keeps running. Check progress any time under **Settings → Imports**.

> [!question]- A column has hundreds of the same error
> To keep the fixing step usable, SparrowCRM shows up to the first 100 distinct problems in a column. Beyond that it asks you to fix the column's formatting or skip the field, rather than making you scroll through thousands.
>
> **Fix:** If a whole column is wrong (e.g., a bad date format), fixing it at the source in your file is faster than editing values one by one.

> [!question]- I can't find my past imports, or need to redo one
> Go to **Settings → Imports** to see your import history — status, record counts, and the original files. You can resume a draft you didn't finish, or download a file to re-import.
>
> You see your own imports; super admins can see everyone's.

> [!question]- Some fields were greyed out and I couldn't map them
> Mapping respects your permissions. If you don't have access to an object, its fields appear disabled, and related objects you can't touch are hidden at the mapping step.
>
> **Fix:** Ask your admin for write access to that object, then re-run the import.

---

## A few things worth knowing up front

These aren't errors — just how the importer behaves, so nothing surprises you:

- **Blank cells never erase existing data.** Leaving a cell empty keeps whatever's already on the record.
- **Only the columns you map are touched.** Everything else on a record stays as-is.
- **Multi-value fields add, they don't replace.** Separate multiple values with commas (e.g. `SaaS, Technology`); they're added to whatever's already there.
- **New records are tagged with a "CSV Import" source** automatically.
- **You can walk away.** Imports run in the background and survive you closing the tab or losing connection.

---

*Still stuck? Download the error file, fix the flagged rows, and re-import — or reach out to support with the file attached.*
