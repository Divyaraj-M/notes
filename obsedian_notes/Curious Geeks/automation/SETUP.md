# Setup guide — Curious Geeks community system

Everything you need to wire up the full flow. Do these in order.

---

## Step 1 — Create the Google Sheet

1. Create a new Google Sheet called **Curious Geeks**
2. Add three tabs, named exactly:
   - `Members`
   - `Products`
   - `Comments`

Leave them empty for now — Tally will add the headers automatically when the first submission comes in.

---

## Step 2 — Create the three Tally forms

### Form A — Join community
**Connect to:** Google Sheet → Members tab

| Field | Type | Required |
|-------|------|----------|
| Your Name | Short text | Yes |
| Email | Email | Yes |

After creating: copy the embed URL and paste it in `Curious Geeks.md` where it says `TALLY_JOIN_FORM_URL`.

---

### Form B — Submit a product
**Connect to:** Google Sheet → Products tab

| Field | Type | Required |
|-------|------|----------|
| Product Name | Short text | Yes |
| Tagline | Short text | Yes |
| Product URL | Website | Yes |
| Description | Long text | Yes |
| Tags | Short text | No — comma separated e.g. "productivity, AI" |
| Your Name | Short text | Yes |
| Your Email | Email | Yes |

After creating: copy the form URL and replace `TALLY_PRODUCT_FORM_URL` in `Products/Products.md`.

---

### Form C — Add a comment
**Connect to:** Google Sheet → Comments tab

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Product Name | Hidden field | Yes | Pre-filled via URL param `?product=` |
| Your Name | Short text | Yes | |
| Comment | Long text | Yes | |

**How to set up the hidden pre-fill in Tally:**
1. Add a Hidden Fields block to the form
2. Name it `product`
3. Tally will auto-populate it when the URL contains `?product=ProductName`

After creating: copy the base URL (without any `?`) and:
- Paste it in `automation/Code.gs` where it says `COMMENT_FORM_URL`
- Paste it in `Products/_template.md` where it says `TALLY_COMMENT_FORM_URL`

---

## Step 3 — Set up the Apps Script

1. Open your Google Sheet
2. Extensions → Apps Script
3. Delete any existing code in `Code.gs`
4. Paste the full contents of `automation/Code.gs`
5. Fill in your values at the top:
   ```
   GITHUB_OWNER = 'your-github-username'
   GITHUB_REPO  = 'your-repo-name'
   ```

### Store your GitHub token (do not hardcode it)

1. Go to github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → select scope: `repo`
3. Copy the token (`ghp_xxxxxxxxxxxx`)
4. Back in Apps Script: Project Settings (gear icon) → Script Properties → Add property
   - Key: `GITHUB_TOKEN`
   - Value: `ghp_xxxxxxxxxxxx`

### Set up triggers

1. In Apps Script: click the clock icon (Triggers)
2. Add Trigger:
   - Function: `onProductSubmit`
   - Event source: From spreadsheet
   - Event type: On change
3. Add another Trigger:
   - Function: `onCommentSubmit`
   - Event source: From spreadsheet
   - Event type: On change

---

## Step 4 — Install Obsidian Git plugin

1. In Obsidian: Settings → Community plugins → Browse
2. Search "Obsidian Git" → Install → Enable
3. Settings → Obsidian Git:
   - Auto pull interval: `5` (minutes)
   - Auto push: off
   - Pull on startup: on

Make sure your vault folder is the same as your cloned GitHub repo:
```
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME /path/to/vault
```

---

## Step 5 — Test the full flow

1. Submit a test product via Form B
2. Check the Products tab in Google Sheet — new row should appear
3. Wait ~10 seconds — Apps Script fires
4. Check your GitHub repo — new file at `Products/test-product.md` should exist
5. Wait up to 5 minutes — Obsidian Git pulls it down
6. New note appears in Obsidian under `Products/`
7. Digital Garden plugin publishes it automatically

---

## URL reference

| Where | Pattern |
|-------|---------|
| Join form | `tally.so/r/FORM_ID` |
| Product form | `tally.so/r/FORM_ID` |
| Comment form (pre-filled) | `tally.so/r/FORM_ID?product=ProductName` |
| Product page | `yourdomain.com/products/product-slug/` |

---

*Apps Script logs: Extensions → Apps Script → Executions (left sidebar)*
