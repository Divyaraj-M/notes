# Setup guide — Curious Geeks community system

Everything you need to wire up the full flow. Do these in order.

---

## Step 1 — Create the Google Sheet

1. Create a new Google Sheet called **Curious Geeks**
2. Add three tabs, named exactly:
   - `Members`
   - `Products`
   - `Comments`

Leave them empty — Tally adds the headers automatically on first submission.

---

## Step 2 — Create the three Tally forms

---

### Form A — Join community
**Connects to:** Google Sheet → Members tab

| Field | Type | Required |
|-------|------|----------|
| Your Name | Short text | Yes |
| Email | Email | Yes |

On submit → Apps Script fires → **sends a welcome email automatically** from your Gmail.

After creating: copy the form URL and paste it into `Curious Geeks.md` where it says `TALLY_JOIN_FORM_URL`. Also paste it into `Code.gs` where it says `JOIN_FORM_URL`.

---

### Form B — Submit a product
**Connects to:** Google Sheet → Products tab

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Email | Email | Yes | Used to check membership |
| Your Name | Short text | Yes | |
| Product Name | Short text | Yes | |
| Tagline | Short text | Yes | One line, what it does |
| Product URL | Website | Yes | |
| Description | Long text | Yes | |
| Category | Dropdown | Yes | Sales, Marketing, Productivity, AI, Design, Engineering, Other |
| Tags | Short text | No | Comma separated, e.g. "AI, productivity" |
| Join Community | Multiple choice | Yes | Options: "Yes, add me as a member" / "I'm already a member" |

**How the membership check works (no action needed from you):**
- Email in Members sheet → product page created ✅
- Email not in sheet + "Yes, add me" selected → added as member, welcome email sent, product page created ✅
- Email not in sheet + "I'm already a member" selected → rejection email sent with link to join form, no product created ❌

After creating: copy the form URL and paste it into `Products/Products.md` where it says `TALLY_PRODUCT_FORM_URL`.

---

### Form C — Comment on a product
**Connects to:** Google Sheet → Comments tab

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Product Name | Hidden field | Yes | Pre-filled via URL param `?product=` |
| Email | Email | Yes | Used to check membership |
| Your Name | Short text | Yes | |
| Comment | Long text | Yes | |
| Join Community | Multiple choice | Yes | Options: "Yes, add me as a member" / "I'm already a member" |

**How to set up the hidden pre-fill in Tally:**
1. Add a **Hidden Fields** block to the form
2. Name the field exactly: `product`
3. Tally auto-populates it when the URL contains `?product=ProductName`

The "Add a comment" button on each product page already has this URL pattern — Apps Script builds it automatically when it creates the product page.

After creating: copy the base form URL and paste it into:
- `Code.gs` → `COMMENT_FORM_URL`
- `Products/_template.md` → `TALLY_COMMENT_FORM_URL`

---

## Step 3 — Set up the Apps Script

1. Open your Google Sheet → **Extensions → Apps Script**
2. Delete any existing code in `Code.gs`
3. Paste the full contents of `automation/Code.gs`
4. Fill in your values at the top of the script:

```
GITHUB_OWNER   = 'your-github-username'
GITHUB_REPO    = 'your-repo-name'
JOIN_FORM_URL  = 'https://tally.so/r/YOUR_JOIN_FORM_ID'
COMMENT_FORM_URL = 'https://tally.so/r/YOUR_COMMENT_FORM_ID'
GARDEN_BASE_URL = 'https://your-garden-domain.com'
```

### Store your GitHub token securely

1. Go to github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → scope: `repo`
3. Copy the token (`ghp_xxxxxxxxxxxx`)
4. In Apps Script: **Project Settings** (gear icon) → **Script Properties** → Add property:
   - Key: `GITHUB_TOKEN`
   - Value: `ghp_xxxxxxxxxxxx`

### Set up the three triggers

Click the clock icon (Triggers) → Add Trigger for each:

| Function | Sheet | Event type |
|----------|-------|------------|
| `onMemberSubmit` | Members | On change |
| `onProductSubmit` | Products | On change |
| `onCommentSubmit` | Comments | On change |

> [!tip] Each trigger needs to be set to fire from the **specific sheet** it watches. In the trigger setup, choose "From spreadsheet" → "On change".

---

## Step 4 — Install Obsidian Git plugin

1. Obsidian → Settings → Community plugins → Browse
2. Search **Obsidian Git** → Install → Enable
3. Settings → Obsidian Git:
   - Auto pull interval: `5` minutes
   - Pull on startup: on
   - Auto push: off (you push manually)

Make sure your vault is the cloned GitHub repo:
```
git clone https://github.com/YOUR_USERNAME/YOUR_REPO /path/to/vault
```

---

## Step 5 — Test the full flow

**Test 1 — Join flow:**
1. Submit the join form with a test email
2. Check Members tab — new row appears
3. Check your inbox — welcome email arrives

**Test 2 — Product submission (member):**
1. Submit the product form using the email from Test 1
2. Check Products tab — new row appears
3. Wait ~10 seconds — Apps Script fires, GitHub gets a new `Products/test-product.md`
4. Wait up to 5 min — Obsidian Git pulls it down, product appears in vault
5. Check your inbox — "your product is live" email arrives

**Test 3 — Product submission (non-member, wants to join):**
1. Submit product form with a new email, select "Yes, add me as a member"
2. Both Members and Products tabs get a new row
3. Welcome email + product live email both arrive

**Test 4 — Comment:**
1. Go to `Products/test-product.md` in your vault, find the comment form URL
2. Submit a comment with the member email
3. Check Comments tab — new row appears
4. Apps Script appends the comment to the product `.md` file on GitHub
5. Obsidian Git pulls it, comment appears at the bottom of the product page

---

## URL reference

| Where | Pattern |
|-------|---------|
| Join form | `tally.so/r/JOIN_FORM_ID` |
| Product form | `tally.so/r/PRODUCT_FORM_ID` |
| Comment form (pre-filled) | `tally.so/r/COMMENT_FORM_ID?product=ProductName` |
| Product page | `yourdomain.com/products/product-slug/` |

---

*Apps Script logs → Extensions → Apps Script → Executions (left sidebar). If something breaks, that's the first place to look.*
