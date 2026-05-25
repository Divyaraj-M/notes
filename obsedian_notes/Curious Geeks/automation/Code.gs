// ============================================================
// Curious Geeks — Google Apps Script
// Handles: new product pages + comment appending via GitHub API
// ============================================================

// ── CONFIG ── paste your values here ────────────────────────
const GITHUB_TOKEN   = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
const GITHUB_OWNER   = 'YOUR_GITHUB_USERNAME';   // e.g. 'divyrak'
const GITHUB_REPO    = 'YOUR_REPO_NAME';          // e.g. 'curious-geeks'
const GITHUB_BRANCH  = 'main';

// Sheet tab names (must match exactly)
const PRODUCTS_SHEET = 'Products';
const COMMENTS_SHEET = 'Comments';

// Tally comment form URL (fill in after you create the form)
const COMMENT_FORM_URL = 'https://tally.so/r/YOUR_COMMENT_FORM_ID';
// ─────────────────────────────────────────────────────────────


// ============================================================
// TRIGGER 1 — New product submitted
// Set up: Triggers → onProductSubmit → From spreadsheet → On change
// ============================================================
function onProductSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  const lastRow = sheet.getLastRow();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Map row to object
  const data = {};
  headers.forEach((h, i) => { data[h.toString().trim()] = rowData[i]; });

  const productName = data['Product Name'] || '';
  const tagline     = data['Tagline'] || '';
  const description = data['Description'] || '';
  const productUrl  = data['Product URL'] || '';
  const makerName   = data['Your Name'] || '';
  const makerEmail  = data['Your Email'] || '';
  const tagsRaw     = data['Tags'] || '';
  const date        = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  if (!productName) return; // safety check

  const slug = toSlug(productName);
  const tags = tagsRaw.split(',').map(t => `  - ${t.trim()}`).join('\n');

  const content = `---
title: "${productName}"
tagline: "${tagline}"
description: "${description}"
url: "${productUrl}"
maker: "${makerName}"
maker_email: "${makerEmail}"
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

  // NOTE: vault folder is "Products" (capital P)
  const filePath = `Products/${slug}.md`;
  pushFileToGitHub(filePath, content, `feat: add product "${productName}"`);
}


// ============================================================
// TRIGGER 2 — New comment submitted
// Set up: Triggers → onCommentSubmit → From spreadsheet → On change
// ============================================================
function onCommentSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(COMMENTS_SHEET);
  const lastRow = sheet.getLastRow();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

  const data = {};
  headers.forEach((h, i) => { data[h.toString().trim()] = rowData[i]; });

  const productName   = data['Product Name'] || '';
  const commenterName = data['Your Name'] || 'Anonymous';
  const comment       = data['Comment'] || '';
  const date          = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  if (!productName || !comment) return;

  const slug     = toSlug(productName);
  const filePath = `Products/${slug}.md`;

  // Fetch the existing file from GitHub
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

  const updatedContent = existing.content + commentBlock;
  pushFileToGitHub(filePath, updatedContent, `comment: add comment on "${productName}"`, existing.sha);
}


// ============================================================
// GitHub helpers
// ============================================================

function pushFileToGitHub(path, content, commitMessage, sha) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const encoded = Utilities.base64Encode(content, Utilities.Charset.UTF_8);

  const payload = {
    message: commitMessage,
    content: encoded,
    branch: GITHUB_BRANCH
  };
  if (sha) payload.sha = sha; // required when updating an existing file

  const options = {
    method: 'put',
    contentType: 'application/json',
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();
  if (code !== 200 && code !== 201) {
    Logger.log(`GitHub push failed [${code}]: ${response.getContentText()}`);
  } else {
    Logger.log(`GitHub push OK: ${path}`);
  }
}

function getFileFromGitHub(path) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  const options = {
    method: 'get',
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) return null;

  const json = JSON.parse(response.getContentText());
  return {
    content: Utilities.newBlob(Utilities.base64Decode(json.content)).getDataAsString(),
    sha: json.sha
  };
}


// ============================================================
// Utility
// ============================================================

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}


// ============================================================
// HOW TO SET UP
// ============================================================
//
// 1. Open your Google Sheet → Extensions → Apps Script
// 2. Paste this entire file into Code.gs
// 3. Fill in GITHUB_OWNER and GITHUB_REPO at the top
// 4. Store your GitHub token:
//      Project Settings → Script Properties → Add property
//      Key: GITHUB_TOKEN   Value: ghp_xxxxxxxxxxxx
// 5. Set up triggers:
//      Triggers (clock icon) → Add Trigger
//      → onProductSubmit | From spreadsheet | On change
//      → onCommentSubmit | From spreadsheet | On change
// 6. Fill in COMMENT_FORM_URL after creating your Tally comment form
//
