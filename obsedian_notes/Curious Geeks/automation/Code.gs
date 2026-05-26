// ============================================================
// Curious Geeks — Google Apps Script
// Handles: welcome emails, membership checks, product pages, comments
// ============================================================

// ── CONFIG ── fill these in ──────────────────────────────────
const GITHUB_TOKEN   = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
const GITHUB_OWNER   = 'YOUR_GITHUB_USERNAME';
const GITHUB_REPO    = 'YOUR_REPO_NAME';
const GITHUB_BRANCH  = 'main';

const MEMBERS_SHEET  = 'Members';
const PRODUCTS_SHEET = 'Products';
const COMMENTS_SHEET = 'Comments';

const JOIN_FORM_URL     = 'https://tally.so/r/YOUR_JOIN_FORM_ID';
const COMMENT_FORM_URL  = 'https://tally.so/r/YOUR_COMMENT_FORM_ID';
const GARDEN_BASE_URL   = 'https://YOUR_GARDEN_DOMAIN.com'; // e.g. https://curiousgeeks.netlify.app

const SENDER_NAME       = 'Curious Geeks';
// ─────────────────────────────────────────────────────────────


// ============================================================
// TRIGGER 1 — Someone joins the community
// Trigger: Members sheet → On change
// ============================================================
function onMemberSubmit() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MEMBERS_SHEET);
  const lastRow = sheet.getLastRow();
  const data = getRowAsObject(sheet, lastRow);

  const name  = data['Your Name'] || data['Name'] || 'there';
  const email = data['Email'] || '';

  if (!email) return;

  sendWelcomeEmail(name, email);
}


// ============================================================
// TRIGGER 2 — Product submitted
// Trigger: Products sheet → On change
// ============================================================
function onProductSubmit() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  const lastRow = sheet.getLastRow();
  const data = getRowAsObject(sheet, lastRow);

  const email       = (data['Email'] || '').trim().toLowerCase();
  const productName = data['Product Name'] || '';
  const wantsToJoin = (data['Join Community'] || '').toLowerCase().includes('yes');

  if (!email || !productName) return;

  // ── Membership check ────────────────────────────────────────
  const isMember = checkMembership(email);

  if (!isMember && !wantsToJoin) {
    // Not a member, didn't opt in — send nudge email
    GmailApp.sendEmail(email, `You need to join Curious Geeks first`, `
Hi there,

Thanks for submitting "${productName}" to Curious Geeks!

It looks like you're not a member yet. Join the community first and then resubmit your product — it only takes a minute.

👉 Join here: ${JOIN_FORM_URL}

See you on the inside,
${SENDER_NAME}
    `.trim(), { name: SENDER_NAME });
    return;
  }

  if (!isMember && wantsToJoin) {
    // Add them as a member and send welcome email
    const memberName = data['Your Name'] || data['Name'] || '';
    addMember(memberName, email);
    sendWelcomeEmail(memberName, email);
  }

  // ── Create the product page ──────────────────────────────────
  const tagline     = data['Tagline'] || '';
  const description = data['Description'] || '';
  const productUrl  = data['Product URL'] || '';
  const makerName   = data['Your Name'] || data['Name'] || '';
  const category    = data['Category'] || '';
  const tagsRaw     = data['Tags'] || category;
  const date        = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const slug        = toSlug(productName);
  const tags        = tagsRaw.split(',').map(t => `  - ${t.trim()}`).join('\n');

  const content = `---
title: "${productName}"
tagline: "${tagline}"
description: "${description}"
url: "${productUrl}"
maker: "${makerName}"
maker_email: "${email}"
tags:
${tags}
date: ${date}
dg-publish: true
permalink: /products/${slug}/
---

# ${productName}

> ${tagline}

[Visit ${productName} →](${productUrl})

---

## About

${description}

---

## Made by

${makerName}

---

## Comments

> [!tip] Got thoughts on this?
> [Add a comment →](${COMMENT_FORM_URL}?product=${encodeURIComponent(productName)})

`;

  pushFileToGitHub(`Products/${slug}.md`, content, `feat: add product "${productName}"`);

  // Notify the maker their product is live (allow ~5 min for Obsidian Git pull + publish)
  GmailApp.sendEmail(email, `Your product is live on Curious Geeks 🎉`, `
Hi ${makerName},

"${productName}" is now live on Curious Geeks!

View it here (may take a few minutes to publish):
${GARDEN_BASE_URL}/products/${slug}/

Thanks for sharing,
${SENDER_NAME}
  `.trim(), { name: SENDER_NAME });
}


// ============================================================
// TRIGGER 3 — Comment submitted
// Trigger: Comments sheet → On change
// ============================================================
function onCommentSubmit() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(COMMENTS_SHEET);
  const lastRow = sheet.getLastRow();
  const data = getRowAsObject(sheet, lastRow);

  const email       = (data['Email'] || '').trim().toLowerCase();
  const productName = data['Product Name'] || '';
  const comment     = data['Comment'] || '';
  const wantsToJoin = (data['Join Community'] || '').toLowerCase().includes('yes');

  if (!email || !productName || !comment) return;

  // ── Membership check ────────────────────────────────────────
  const isMember = checkMembership(email);

  if (!isMember && !wantsToJoin) {
    GmailApp.sendEmail(email, `Join Curious Geeks to leave a comment`, `
Hi there,

Thanks for your comment on "${productName}"!

You need to be a member to comment. Join here and resubmit — takes a minute:

👉 ${JOIN_FORM_URL}

See you inside,
${SENDER_NAME}
    `.trim(), { name: SENDER_NAME });
    return;
  }

  if (!isMember && wantsToJoin) {
    const commenterName = data['Your Name'] || data['Name'] || '';
    addMember(commenterName, email);
    sendWelcomeEmail(commenterName, email);
  }

  // ── Append comment to product page ──────────────────────────
  const commenterName = data['Your Name'] || data['Name'] || 'Anonymous';
  const date          = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const slug          = toSlug(productName);
  const filePath      = `Products/${slug}.md`;

  const existing = getFileFromGitHub(filePath);
  if (!existing) {
    Logger.log(`Product file not found: ${filePath}`);
    return;
  }

  const commentBlock = `
---

**${commenterName}** · *${date}*

${comment}
`;

  pushFileToGitHub(filePath, existing.content + commentBlock, `comment: "${productName}" by ${commenterName}`, existing.sha);
}


// ============================================================
// Membership helpers
// ============================================================

function checkMembership(email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MEMBERS_SHEET);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const emailCol = getColumnIndex(sheet, 'Email');
  if (emailCol === -1) return false;

  const emails = sheet.getRange(2, emailCol, lastRow - 1, 1).getValues().flat();
  return emails.map(e => e.toString().trim().toLowerCase()).includes(email);
}

function addMember(name, email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MEMBERS_SHEET);
  const date  = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  // If sheet is empty, add headers first
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Your Name', 'Email', 'Joined']);
  }
  sheet.appendRow([name, email, date]);
}

function sendWelcomeEmail(name, email) {
  const firstName = name ? name.split(' ')[0] : 'there';
  GmailApp.sendEmail(email, `Welcome to Curious Geeks, ${firstName}!`, `
Hi ${firstName},

You're in. Welcome to Curious Geeks 👋

A few things you can do now:

→ Share a product you've built: ${GARDEN_BASE_URL}/products/
→ Read what others are building: ${GARDEN_BASE_URL}

This is a community of people who notice things — products, patterns, and small decisions that matter. You'll fit right in.

See you around,
${SENDER_NAME}
  `.trim(), { name: SENDER_NAME });
}


// ============================================================
// GitHub helpers
// ============================================================

function pushFileToGitHub(path, content, commitMessage, sha) {
  const url     = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const encoded = Utilities.base64Encode(content, Utilities.Charset.UTF_8);
  const payload = { message: commitMessage, content: encoded, branch: GITHUB_BRANCH };
  if (sha) payload.sha = sha;

  const response = UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  if (code !== 200 && code !== 201) {
    Logger.log(`GitHub push failed [${code}]: ${response.getContentText()}`);
  } else {
    Logger.log(`GitHub push OK: ${path}`);
  }
}

function getFileFromGitHub(path) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) return null;

  const json = JSON.parse(response.getContentText());
  return {
    content: Utilities.newBlob(Utilities.base64Decode(json.content)).getDataAsString(),
    sha: json.sha
  };
}


// ============================================================
// Sheet helpers
// ============================================================

function getRowAsObject(sheet, rowNum) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
  const obj = {};
  headers.forEach((h, i) => { obj[h.toString().trim()] = rowData[i]; });
  return obj;
}

function getColumnIndex(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idx = headers.findIndex(h => h.toString().trim().toLowerCase() === headerName.toLowerCase());
  return idx === -1 ? -1 : idx + 1; // 1-indexed for Sheets
}

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
