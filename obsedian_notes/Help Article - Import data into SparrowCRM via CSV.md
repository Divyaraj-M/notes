# Import data into SparrowCRM via CSV

Bring your contacts, companies, and deals into SparrowCRM in bulk using a CSV (or Excel) file. Instead of creating records one by one, you upload a file, match its columns to CRM fields, fix any data issues inline, preview what will happen, and run the import in the background.

This guide walks you through the whole process, gives you ready-made templates, and calls out the things to watch for so your first import goes smoothly.

> **Who can import:** Anyone with write access to the object (Contacts, Companies, or Deals) they're importing into. If you don't see the Import option, ask your admin for access.

---

## What you can import

You can import into three objects:

- **Contacts** — people: names, emails, phone numbers, job titles, social links, and more.
- **Companies** — organizations: name, domain, industry, size, revenue, location, and more.
- **Deals** — opportunities: deal name, amount, owner, stage, close dates, and more.

You can also import a file that contains more than one object at once (for example, contacts *and* the companies they work at). SparrowCRM will create both and link them together. See [Importing more than one object in a single file](#importing-more-than-one-object-in-a-single-file).

> This is **not** a CRM-to-CRM migration tool. If you're moving from Salesforce, HubSpot, or Pipedrive, use the dedicated migration option instead.

---

## Download a template

The quickest way to start is with one of our templates. Each one already has the correct column headers for that object, plus example rows showing the expected format. Download the one you need, replace the example rows with your data, and save it as CSV.

- **Contacts template** — `Contacts_Import_Template.csv`
- **Companies template** — `Companies_Import_Template.csv`
- **Deals template** — `Deals_Import_Template.csv`

**What's in each template**

| Object | Columns included |
| --- | --- |
| Contacts | First Name, Last Name, Email, Mobile Phone, Contact Owner, Company, Secondary Email, Location, Job Title, Seniority, Department, Preferred Channel, Lifecycle Stage, LinkedIn URL, Twitter URL, Facebook URL, Instagram URL, GitHub URL, Office Phone, Headline, Profile Picture URL, Opt Out Email, Opt Out Call, UTM Source, UTM Medium, UTM Campaign |
| Companies | Company Name, Domain / Website, LinkedIn, Logo URL, Owner, Ownership Type, Industry, Company Size, Annual Revenue, Location, Main Phone, Average Deal Size, Customer Since, Lifecycle Stage, Company Status, Company Segment, Founding Year, Twitter URL, Facebook URL, Instagram URL, Language, Last Funding Date, Last Funding Amount, Company News, Funding Stage, Keywords, Crunchbase URL, Blog URL, Stock Symbol, AngelList URL, Market Cap, UTM Source, UTM Medium, UTM Campaign |
| Deals | Deal Name, Deal Amount, Deal Owner, Company, Contacts, Pipeline, Stage, Deal Type, Priority, Win Probability (%), Probability (%), Expected Close Date, Actual Close Date, Description, Annual Contract Value (ACV), Total Contract Value (TCV), Annual Recurring Revenue (ARR), Monthly Recurring Revenue (MRR), Forecast Amount, Potential ACV, Pre-discount Amount, Deal Lost, Lost Reason Description, Won Reason |

You don't have to use every column. Keep the ones you have data for and delete the rest — you can also add columns for any custom fields you've created. The only columns you *must* keep are the required and unique ones (below).

---

## Before you import: prepare your file

A little prep here prevents most errors later.

### File requirements

- **File type:** CSV, XLS, or XLSX.
- **Header row:** required. The first row must be your column names (e.g., Email, Company Name, Deal Name).
- **Rows:** up to 100,000.
- **Columns:** up to 100.
- **File size:** up to 10 MB. (A 10,000-row file with a dozen columns is only ~300 KB, so most files are well under this.)
- **Excel with multiple sheets:** you'll be asked to pick one sheet to import.
- **Empty files** are rejected.

### Always include required and unique fields

**Required fields** must have a value in every row, or the record won't import.

**Unique fields** are how SparrowCRM tells records apart. Mapping one lets the importer *update* an existing record instead of creating a duplicate. Including them is the single most important thing you can do to keep your data clean.

| Object | Required fields | Unique field (to match existing records) |
| --- | --- | --- |
| Contacts | First Name, Email | **Email** |
| Companies | Company Name | **Domain / Website** |
| Deals | Deal Name, Deal Owner, Stage | **Deal name + Stage + Deal owner** together |

> **Note on Record ID:** SparrowCRM does not use a Record ID column to match records on import. Matching is done using the unique fields above.

> **Enrichment tip:** including **email** (Contacts) and **domain** (Companies) also lets SparrowCRM enrich records with extra details like logos and social profiles.

### Formatting quick reference

| Field type | How to format it |
| --- | --- |
| Email | One valid address per cell (e.g., `jane@acme.com`). |
| Phone | Include country code where possible (e.g., `+14155550100`). |
| Date | Any consistent format — you'll confirm the exact format (e.g. DD/MM/YYYY) during review. |
| Number / Currency | Digits only. No currency symbols. Don't mix currencies in one column. |
| Yes/No | `TRUE` / `FALSE`. |
| Select / Status / Pipeline stage | Must match an existing option, or you can add it during review. |
| Multiple values (multi-select, tags, linked records) | Separate values with a comma, e.g. `SaaS, Technology`. |
| URL / LinkedIn / Domain | A valid web address; domains without `http` are fine (e.g. `acme.com`). |
| Owner | The person's email (preferred) or full name; must be a workspace member. |

---

## Step-by-step: how to import

### Step 1 — Start the import

1. In the left sidebar, open the object you're importing into (**Contacts**, **Companies**, or **Deals**), or open a specific **list**.
2. Click **Import** (top right).
3. Drag your file in, or click to browse and select it.
4. After it uploads, you'll see how many columns and rows were detected. Click **Continue**.

You can also start an import from **Settings → Imports**.

### Step 2 — Map your columns

This is where you tell SparrowCRM which CRM field each column in your file belongs to.

- Your file's columns appear on the left (with a few sample values each); the field you're mapping each to appears on the right.
- SparrowCRM **auto-maps** columns it recognizes — these show a green "Automatically mapped" label. Ones it isn't sure about show an orange "Unmapped" label.
- To change or set a mapping, click the dropdown and pick a field. You can search, and you can create a new field with **+ Create Attribute**.
- To **skip** a column, just leave it unmapped (or remove an auto-map). Skipped columns are ignored.

A few things the mapping step enforces:

- **At least one column** must be mapped to continue.
- **Two columns can't map to the same field** — you'll be asked to fix it.
- **Map a unique field** (Email / Domain, etc.). If you continue without one, you'll get a warning that the import will create new records instead of updating, and you'll have to confirm you understand before proceeding.
- **Permissions are respected.** Fields on objects you don't have access to appear disabled. Association fields you can't access are hidden at this step.

Click **Continue** when you're done.

### Step 3 — Review and fix values

SparrowCRM shows you how it interpreted your data, so you can catch problems before anything is written.

- The left panel lists your mapped columns. A **red dot** marks any column with values that need attention.
- The right panel shows each value as **raw value → how it will be saved**, grouped with a **"Needs review"** section at the top.
- Click any flagged value to fix it inline — correct an email, pick the right dropdown option, choose a date format, match an owner, and so on.
- For date and number columns, use the settings (gear) icon to tell SparrowCRM the exact format your file uses.
- For Select/Multi-select columns with new values, choose to **create the missing options** during import.

Good to know:

- **Invalid values don't block the import.** If you leave one unfixed, just that value is skipped — the rest of the record still imports.
- If a column has a very large number of distinct errors, SparrowCRM shows up to the first **100** and asks you to fix or skip the field, rather than listing thousands.

Click **Continue**.

### Step 4 — Preview

You'll see a summary of what's about to happen — which records will be **created** and which will be **updated** — before anything changes. If your file spans multiple objects, each object gets its own tab. Review it, go **Back** if you need to, then click **Start import**.

### Step 5 — Run

The import runs in the background:

- A progress bar shows how far along it is.
- **You can safely close the page** — the import keeps running, and you can check on it later.
- You can **cancel** mid-way; anything already imported is kept.
- One bad row never rolls back the whole import.

When it finishes, you'll see a confirmation with any errors that occurred (see below).

---

## Updating existing records vs. creating new ones

- If you **map a unique field** (Email for contacts, Domain for companies) and a row matches an existing record, that record is **updated**. If nothing matches, a new record is **created**.
- If you **don't** map a unique field, every row is treated as a **new record** — which can create duplicates.
- **Empty cells never overwrite** existing data. A blank in your file leaves the current value untouched.
- **Only the columns you mapped** are updated. Everything else on the record stays as-is.
- **Multi-value fields add, not replace.** If a company already has the tag `SaaS` and your file has `Technology`, it ends up with both.

---

## Importing more than one object in a single file

If your file has, say, contacts and their companies together:

- Import into **Contacts**, one row per person, and include a unique company field (like **Domain**) so each person links to the right company.
- If the company domain matches an existing company, the contact links to it. If not, a new company is created (when you have permission).
- SparrowCRM creates companies first, then the contacts, then links them.
- **Public email domains** (gmail.com, outlook.com, icloud.com, etc.) will **not** auto-create a company.

For deals with their companies, import into **Deals** and include a unique company field (Domain) to link them. If you have all three — companies, contacts, and deals — run two imports: one into **Contacts** and one into **Deals**.

---

## After the import

### If some rows fail

You'll get an **error file** to download. It contains:

- **Error Reason** — why the row didn't import
- **Row Number** — which row in your original file
- **All your original columns** — so you can fix and re-upload just the failed rows

Fix the issues in that file and import it again.

### Import history

Go to **Settings → Imports** (also available per object under **Settings → Objects → [Object] → Imports**) to see your past imports with their status (In progress, Done, or Draft), record counts, and who ran them. From here you can resume a draft, download the original file, or delete an import record.

- You see **your own** imports.
- **Super admins** see everyone's.

---

## Things to keep in mind (caveats)

- **Headers are required** and the first row is always treated as headers.
- **Map a unique field** or you'll create duplicates. Record ID is not used for matching.
- **Empty cells are skipped** — they never erase existing values.
- **Only mapped columns are updated.**
- **Multi-value fields are additive**; separate multiple values with commas.
- **Select / Status / Pipeline stage values** must match existing options, or be added during review.
- **Owner** must be an existing workspace member (matched by email, then name); otherwise it defaults to you.
- **Source** is automatically set to "CSV Import" on new records — you can't map it.
- **Dates and numbers:** confirm the format during review so they aren't misread (e.g., European `1.000,50`).
- **Currency:** no symbols; mixed currencies in one column are flagged.
- **Public email domains** don't auto-create companies.
- **Formulas** (cells starting with `=`, `+`, `-`, `@`) are not supported and are sanitized for safety.
- **One import runs at a time** per workspace; additional ones queue automatically.
- **List imports** work with static lists only, and you can choose whether existing list records are updated or added again.
- **Enrichment** (if enabled) only fills empty fields — it never overwrites what you already have.

---

## FAQ

**Can I import notes, tasks, or call recordings?**
No — this import is for Contacts, Companies, and Deals records.

**I imported rows but don't see my new columns.**
Check the **Map columns** step — a column only imports if it was mapped to a field. Unmapped columns are ignored.

**I accidentally created duplicates.**
This usually means no unique field was mapped. Re-import with **Email** (contacts) or **Domain** (companies) mapped so existing records are matched and updated instead.

**How do I import first and last names?**
Use separate **First Name** and **Last Name** columns (as in the Contacts template).

**If I close the page mid-import, do I lose progress?**
No. The import keeps running in the background, and you can track it from **Settings → Imports**.

---

*Need help? If an import doesn't complete as expected, download the error file, fix the flagged rows, and re-import — or reach out to support.*
