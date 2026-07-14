---
owner: Divyaraj Murugan
feature: "[[Email]]"
version: 1
status: Done
priority: Low
tags:
  - sparrowcrm/features/contacts/email/v1
related:
  - "[[Email Integration_v1]]"
  - "[[Block Contact creation of Same Domain_v1]]"
  - "[[Email_Integrations_v2-Historical Import]]"
  - "[[Sparrowdesk_v1]]"
  - "[[prd-sparrowcrm-unified-filters]]"
  - "[[2-Product Strategy]]"
  - "[[Import_v1]]"
  - "[[1-Product Vision]]"
  - "[[filters_v1]]"
  - "[[First Principle for a CRM]]"
  - "[[Hygiene Agent_v1]]"
  - "[[GTM-Unified-Filters]]"
  - "[[Apolloio_v1]]"
  - "[[Email Integration_v1.2]]"
  - "[[CRM Intelligence]]"
---
## 1. Problem Statement

Sales reps working a contact's record in SparrowCRM have no way to view, compose, or send emails without leaving the CRM. Every email interaction forces a context switch to Gmail or Outlook, then back again — breaking flow, creating blind spots for teammates who can't see the conversation, and making CRM records feel like dead data instead of a living command center. The parent Email Integration spec (R1–R22) solves the sync and infrastructure layer; this PRD scopes the **Contacts Record Page UI** — the surface where reps actually read email threads, compose new messages, reply to threads, and use AI-assisted writing — which is the highest-frequency touchpoint for individual contact engagement.

The Figma designs for the Contacts Object, Deals Record Page (Emails tab), and Inbox Compose already define the interaction patterns. This spec translates those designs into buildable requirements with acceptance criteria, covering three capabilities the user asked for explicitly: **writing emails, sending emails, and AI writing**.

---

## 2. Jobs To Be Done

**Primary job statement:**

> When I'm working a contact's record — prepping for a call, following up after a meeting, or responding to an inbound ask — I want to read all email history and send my reply right here, so I can stay in the CRM and keep my momentum instead of bouncing between tabs.

**Functional dimension:** View all synced email threads for this contact, compose a new email or reply to an existing thread, optionally use AI to draft the message, and send it — all from the contact record page without navigating away.

**Emotional dimension:** The rep wants to feel in control and fast — like the CRM is their cockpit, not a spreadsheet they update after the real work happens somewhere else. AI writing should feel like a shortcut, not a crutch — the rep stays in the driver's seat.

**Social dimension:** Managers and teammates see the rep's email activity on the record timeline, which makes them look responsive and on top of their accounts. Using AI writing isn't visible to the recipient, so the rep looks polished without extra effort.

**Hiring criteria — why a rep would use this over Gmail/Outlook:**

- Thread history is pre-filtered to this contact — no inbox noise.
- Sending from CRM auto-logs the email on the timeline — zero manual logging.
- AI writing means a "follow up on the demo" email takes 20 seconds instead of 5 minutes.
- Teammates can see the conversation without asking for forwards.

**Firing criteria — why they'd stop:**

- If sent emails don't actually appear in their Gmail/Outlook sent folder (feels unreliable).
- If AI-generated content is generic, tone-deaf, or doesn't use CRM context (company name, deal stage).
- If the composer is slow to open, laggy to type in, or loses drafts.
- If they can't attach files or use their signature.

---

## 3. Goals

- **User goal:** A sales rep can view all email threads, compose a new email, reply to a thread, and send — without leaving the contact record page. Measured by: >60% of CRM-initiated emails originate from the record page (vs. the standalone Inbox module) within 60 days of launch.
- **User goal:** AI-assisted email drafting reduces median compose time for follow-up emails from ~4 minutes (manual) to under 45 seconds (AI draft → edit → send). Measured by: time-from-compose-open to send-click, sampled at 30 and 60 days post-launch.
- **Business goal:** Increase email logging completeness — the percentage of sales-relevant emails attached to a CRM contact record — from the current baseline (to be measured at launch) by 30% within 90 days, driven by reps sending directly from CRM instead of Gmail.
- **Business goal:** Reduce CRM context-switching (measured by tab-switch events within 2 minutes of viewing a contact record) by 40% within 60 days.

---

## 4. Non-Goals

- **Standalone Inbox module UX** — The Inbox module (All Mails, Starred, Sent, Drafts, Scheduled, Labels, Spam, Trash) is a separate surface with its own navigation and design. This PRD only covers the Emails tab and Compose modal within the Contacts Record Page. The Inbox module ships under its own spec.
- **Email sync infrastructure** — OAuth connection, two-way sync, webhook setup, contact matching, and attachment storage are covered by the parent Email Integration spec (R1, R2). This PRD assumes synced emails are available and focuses on presenting and interacting with them.
- **Email settings and account management** — Blocklists, aliases, signatures management, forwarding address config, and admin contact creation rules live in the Settings area (parent spec R4–R12). This PRD consumes those settings (e.g., the signature auto-appends) but doesn't manage them.
- **Email sequences / drip campaigns** — Automated multi-step email flows are a separate product initiative. This is one-to-one emailing from a contact record.
- **AI-generated subject lines** — v1 AI writing generates body content only. The user sets the subject manually. Subject-line AI is a fast-follow candidate but out of scope to limit surface area.
- **Rich text templates / saved templates** — Reusable email templates that reps can save and share are a separate feature. AI writing replaces the "start from a template" workflow for now.

---

## 5. User Stories

### Primary persona — Sales Rep

- As a sales rep viewing a contact record, I want to see an "Emails" tab showing all synced email threads with this contact so that I have full conversation history before I take action.
- As a sales rep, I want to search and filter emails within the Emails tab so that I can quickly find a specific thread (e.g., the proposal I sent last month).
- As a sales rep, I want to click "Compose" to open a new email addressed to this contact so that I can send an email without typing their address.
- As a sales rep, I want to click on an email thread to expand it and see the full conversation so that I can read what was said before replying.
- As a sales rep, I want to reply to an existing email thread from within the expanded view so that my reply maintains thread continuity in the recipient's inbox.
- As a sales rep, I want to add Cc and Bcc recipients when composing or replying so that I can include stakeholders or loop in my manager.
- As a sales rep, I want to attach files to my composed email so that I can send proposals, contracts, or collateral.
- As a sales rep, I want my email signature to auto-append when I compose so that my outbound emails look professional.
- As a sales rep, I want to click the "✦ Write with AI" sparkle button in the compose toolbar to open the AI writing panel so that I can generate a draft without writing from scratch.
- As a sales rep, I want to describe my goal in natural language (e.g., "follow up after the demo, mention pricing tiers") and select a tone, then click "Generate" so that AI produces a draft email body.
- As a sales rep, I want to use `{}` variable syntax in my AI prompt (e.g., `{Company name}`) so that the AI output includes dynamic CRM data.
- As a sales rep, I want to see the AI-generated content with "Retry" and "Insert content" options so that I can regenerate if unsatisfied or accept and continue editing.
- As a sales rep, after inserting AI content, I want to freely edit the text in the compose body before sending so that the final email is in my voice.
- As a sales rep, I want to click "Send email" to deliver the message through my connected mailbox so that it appears in both CRM and my Gmail/Outlook sent folder.
- As a sales rep, I want to see email open tracking indicators (green dot + relative timestamp) on sent emails in the Emails tab so that I can time my follow-ups.
- As a sales rep, I want to switch the "From" address in the compose modal by clicking my sender email and selecting from a dropdown of my connected accounts and verified aliases so that I can send from the right identity (e.g., marketing@gmail.com or my team alias) without leaving the compose flow.
- As a sales rep, when I select an alias to send from, I want the recipient to see the alias as the sender so that my outbound email matches the identity my team uses for this type of communication.

### Secondary persona — Sales Manager

- As a sales manager, I want to see email threads on a contact's record page that were sent by other reps on my team so that I have visibility into deal communication without asking for forwards.

### Edge cases

- As a sales rep with no connected email account, when I click "Compose" on a contact record, I want to see a clear message directing me to connect my email in Settings so that I'm not confused by a broken experience.
- As a sales rep, when I compose an email and my AI credits are exhausted, I want to see a clear "AI Credits Exhausted" state with a link to buy credits so that I understand why AI writing is unavailable and can still compose manually.
- As a sales rep, when the contact has no email address on record, I want the "Compose" button to be disabled with a tooltip explaining why so that I'm not confused.
- As a sales rep, when I have multiple connected email accounts, I want to select which account to send from in the compose modal, defaulting to my default account.
- As a sales rep, when I select an alias that my email provider doesn't support for send-as, I want to see a clear inline error explaining the issue so that I can pick another sending identity or fix my provider settings.
- As a sales rep, when I'm composing and accidentally close the modal, I want my draft to be preserved so that I don't lose work.

---

## 6. Requirements

### Must-Have (P0)

**R1. Emails tab on Contact Record Page**

- The Contacts Record Page displays an "Emails" tab in the horizontal tab bar (alongside Insights, Tasks, Activity, Meetings, Notes).
- The tab shows a count badge of total email threads for this contact.
- Clicking the tab displays a chronologically sorted list of email threads grouped by date (Today, Yesterday, This week, etc.).
- Each thread row shows: sender avatar/initials, sender name, thread count, subject line, body preview (truncated), timestamp, attachment indicator (paperclip icon + count), and open tracking indicator (green dot + relative time if opened).
- **Acceptance criteria:**
    - Given a contact with 12 synced email threads, When the rep clicks the Emails tab, Then all 12 threads are displayed with sender, subject, preview, timestamp, and the tab badge shows "12".
    - Given a thread has 3 messages, When viewing the thread row, Then the count "3" appears next to the sender name.
    - Given a sent email was opened by the recipient 2 hours ago, When viewing the Emails tab, Then a green dot with "Opened 2 hours ago" appears on that thread row.
    - Given a sent email has not been opened, When viewing the Emails tab, Then no open indicator is shown (absence of data, not "Not opened").

**R2. Email search and filter within Emails tab**

- A search bar at the top of the Emails tab allows keyword search across email subjects and body content for this contact.
- A filter icon opens filter options (by date range, sent/received, has attachment).
- A sort control allows toggling between newest-first (default) and oldest-first.
- **Acceptance criteria:**
    - Given a rep searches "proposal" in the Emails tab, When results load, Then only email threads containing "proposal" in subject or body are shown.
    - Given a rep filters by "has attachment," When applied, Then only threads with attachments are displayed.

**R3. Email thread expansion and reading**

- Clicking an email thread row expands it to show the full conversation (all messages in the thread, chronologically ordered).
- Each message shows: sender, recipients (To, Cc), timestamp, full body content, and attachments (downloadable).
- A "Collapse" action returns to the thread list view.
- **Acceptance criteria:**
    - Given a rep clicks on a thread with 3 messages, When the thread expands, Then all 3 messages are visible in chronological order with full body content.
    - Given a message has 2 attachments, When viewing the expanded message, Then both attachments are visible with filename, size, and a download action.

**R4. Compose new email (Compose modal)**

- A "Compose" button in the Emails tab toolbar opens the Compose Mail modal.
- A "Compose Email" button in the top-right action bar of the contact record also opens the same modal (visible from any tab).
- The modal pre-fills the "To" field with the contact's primary email address.
- **From / Sender field with alias selector:** The top of the compose modal shows the sender's connected email address (e.g., `brucewyane@gmail.com`) with a verified badge (✓). Clicking the sender email opens an inline dropdown listing all available sending identities — the connected account(s) and any verified aliases (e.g., `marketing@gmail.com`, `bliing@surveysparrow.com`). The rep selects which identity to send from. The default selection is the user's default connected account. When an alias is selected, the email is sent with that alias as the From address through the connected mailbox's SMTP.
- Fields: From (alias-switchable, see above), To (pre-filled, editable — contact name shows as a removable chip), Cc/Bcc (expandable), Subject (required), Body (rich text editor with placeholder "Add your message here").
- Bottom toolbar includes: bold (B), italic (I), underline (U), ordered list, unordered list, link (🔗), strikethrough (S), attachments (paperclip). AI write (sparkle ✦) is accessible from an additional toolbar area.
- "Send" button (purple, primary) in the bottom-right corner.
- **Acceptance criteria:**
    - Given a rep clicks "Compose" on a contact named David Jones with email david@acme.com, When the modal opens, Then the "To" field shows "David Jones" as a removable chip, the From field shows the rep's default connected email with a verified badge, and the cursor is in the Subject field.
    - Given a rep has a default email signature configured, When the compose modal opens, Then the signature is auto-appended to the body.
    - Given a rep adds a Cc recipient, When they send the email, Then the Cc recipient receives the email and the sent email on the contact timeline shows the Cc.
    - Given a rep has multiple connected accounts, When they compose, Then the From field defaults to their default account and clicking it reveals a dropdown with all connected accounts.
    - Given a rep has verified email aliases (e.g., marketing@gmail.com, bliing@surveysparrow.com) linked to their connected mailbox, When they click the From field, Then those aliases appear in the dropdown alongside connected accounts.
    - Given a rep selects an alias (e.g., marketing@gmail.com) from the From dropdown, When they send the email, Then the recipient sees the email as coming from marketing@gmail.com, and the email is delivered through the connected mailbox's SMTP.
    - Given a rep selects an alias and sends an email, When the email appears on the contact's timeline, Then the "From" on the timeline entry shows the alias address, not the connected account address.
    - Given a rep has no aliases configured, When they click the From field, Then only connected accounts appear in the dropdown (no empty alias section).
    - Given a rep clicks "Send," When the email is delivered, Then it appears on the contact's Emails tab timeline and in the rep's Gmail/Outlook sent folder.
- **Technical notes:** Alias send-as depends on the connected mailbox's provider API supporting sending from aliases with existing OAuth scopes (see parent spec R12). If the provider doesn't support send-as for a particular alias, the alias should still appear in the dropdown but show a tooltip or inline error on selection: "This alias cannot be used for sending. Check your email provider settings." Replies sent to the alias by the recipient will sync back to CRM and attach to the correct contact record per the parent spec's alias sync behavior.

**R5. Reply to email thread**

- Within an expanded email thread, a "Reply" action opens the compose area inline or as a modal, pre-filling the To field with the original sender and maintaining thread headers (In-Reply-To, References) for thread continuity.
- "Reply All" includes all original recipients in To/Cc.
- **Acceptance criteria:**
    - Given a rep clicks "Reply" on an email from ann@customer.com, When the compose area opens, Then "To" is pre-filled with ann@customer.com and the subject shows "Re: [original subject]".
    - Given a rep sends a reply from CRM, When the recipient receives it in Gmail/Outlook, Then the reply appears in the same thread as the original email (correct In-Reply-To headers).
    - Given a rep clicks "Reply All" on a thread with 3 recipients, When the compose area opens, Then all 3 recipients are pre-filled in the appropriate To/Cc fields.

**R6. AI-assisted email writing ("Write with AI")**

- Clicking the sparkle (✦) icon in the compose toolbar opens the "Write with AI" panel at the bottom of the compose modal.
- The panel contains:
    - A prompt input area with placeholder text: _"Describe your goal, and I'll generate a message that fits on 'enter'"_ and a helper note: _"use {} for variable"_.
    - A "Tone" dropdown (options: Professional, Casual, Formal — default set by admin, overridable by rep).
    - A "✦ Generate" button.
- **AI generation flow (4 states per Figma designs):**
    1. **Empty state:** Prompt input visible, no content generated yet. Tone selector and Generate button visible.
    2. **Generating state:** Skeleton loading lines animate in the panel. Tone shows the selected value (e.g., "Casual"). Generate button changes to "⟳ Generating" (disabled).
    3. **Generated state:** AI-generated content appears as preview text in the panel. Actions: "⟳ Retry" (regenerates) and "Insert content" (primary button, inserts into body).
    4. **Inserted state:** Content is placed in the compose body. The AI panel closes. The rep can freely edit the inserted text. The compose toolbar (formatting, attachments, emoji, signature, AI) remains available.
- Variable support: The rep can use `{Company name}`, `{First name}`, `{Deal stage}`, or other CRM field placeholders in their prompt. The AI resolves these against the current contact/company/deal context when generating.
- **Acceptance criteria:**
    - Given a rep clicks the sparkle icon, When the AI panel opens, Then the prompt input is empty with placeholder text, Tone defaults to the admin-configured default, and "✦ Generate" is active.
    - Given a rep types "Follow up on the demo, mention next steps and pricing" and selects "Casual" tone, When they click "✦ Generate," Then the panel transitions to the Generating state with skeleton lines, and within 5 seconds, generated content appears with "⟳ Retry" and "Insert content" buttons.
    - Given a rep types "Reach out with context — remind them what they're missing. Include {Company name}" and the contact's company is Google, When AI generates, Then the output includes "Google" in the text.
    - Given a rep clicks "⟳ Retry," When the generation completes, Then the previous content is replaced with a new generation.
    - Given a rep clicks "Insert content," When the content is inserted, Then it appears in the compose body at the cursor position, the AI panel closes, and the rep can edit the text freely.
    - Given a rep's AI credits are exhausted, When they click the sparkle icon, Then the AI panel shows "AI Credits Exhausted" with a "Buy Credits" link, and the compose body remains manually editable.
    - Given a rep clicks the ✕ (close) button on the AI panel, When it closes, Then no content is inserted and the compose body is unaffected.
- **Technical notes:** AI generation uses the existing SparrowCRM AI credits system. The prompt, tone, and CRM context (contact fields, company fields, recent activity) are sent to the AI backend. Variable resolution happens server-side before the prompt hits the LLM. Response streaming is not required for v1 — the full response is returned after generation completes.

**R7. Email attachments in compose**

- The attachments icon (paperclip) in the compose toolbar opens a file picker.
- Selected files are shown as attachment chips below the body with filename, size, and a remove (×) action.
- **Acceptance criteria:**
    - Given a rep attaches a 2MB PDF, When the attachment is added, Then it appears as a chip with "proposal.pdf — 2 MB" and a remove button.
    - Given a rep sends an email with an attachment, When the recipient receives it, Then the attachment is downloadable from their email client.
    - Given a rep attaches a file exceeding the size limit (25 MB for Gmail), When they try to send, Then an error message appears: "Attachment exceeds the maximum size. Please reduce the file size or use a link."

**R8. Email signature auto-append**

- When the compose modal opens, the user's default signature (from their connected account's Signatures settings) is auto-appended to the body.
- If the user has multiple signatures, they can switch via the signature (pen) icon in the toolbar.
- **Acceptance criteria:**
    - Given a rep has one signature configured, When compose opens, Then the signature appears at the bottom of the body.
    - Given a rep has no signature configured, When compose opens, Then the body is empty (no placeholder signature).

### Nice-to-Have (P1)

**R9. Draft auto-save**

- The compose modal auto-saves the current state (To, Subject, Body, Attachments) as a draft every 30 seconds and on modal close.
- Drafts are accessible from the Emails tab (a "Drafts" filter) and from the standalone Inbox module's Drafts folder.
- **Acceptance criteria:**
    - Given a rep is composing an email and accidentally closes the tab, When they return to the contact record and open compose, Then the draft is restored with all fields intact.
    - Given a rep has 2 unsent drafts for a contact, When they view the Emails tab with "Drafts" filter, Then both drafts are listed.

**R10. Email scheduling (send later)**

- A dropdown on the "Send email" button offers "Schedule send" with predefined options (Tomorrow morning, Tomorrow afternoon, Monday morning) and a custom date/time picker.
- **Acceptance criteria:**
    - Given a rep schedules an email for "Tomorrow morning," When the scheduled time arrives, Then the email is sent and appears on the contact timeline with a "Scheduled" → "Sent" status transition.

**R11. AI tone memory per rep**

- The AI writing panel remembers the rep's most recently used tone setting (not just the admin default) and pre-selects it for the next compose.
- **Acceptance criteria:**
    - Given a rep selected "Casual" last time, When they open AI writing on a new compose, Then "Casual" is pre-selected.

**R12. Inline AI rewrite**

- After content is inserted, the rep can select a portion of text in the body and invoke AI to rewrite just that selection (shorter, more formal, etc.).
- **Acceptance criteria:**
    - Given a rep selects a paragraph in the body and clicks "Rewrite with AI," When they choose "Make it shorter," Then only the selected text is replaced.

### Future Considerations (P2)

**R13. AI-generated subject lines**

- After the body is drafted (manually or via AI), the system suggests 2–3 subject lines based on the email content. The rep picks one or writes their own.
- v1 design implication: The Subject field is a standard text input. Don't build a custom component that would conflict with a future suggestion dropdown.

**R14. Email templates**

- Saved, reusable email templates (team-shared or personal) that auto-fill the compose body.
- v1 design implication: The compose body is a standard rich text editor. Template insertion would replace body content — don't build features that assume the body is always user-typed.

**R15. Smart send time (AI-recommended)**

- AI recommends the best time to send based on the contact's historical open patterns.
- v1 design implication: The AI addendum spec already defines admin settings for "Best send time" with data windows (30/60/90 days). The compose UI should be designed to accommodate a "Recommended: Send at 9:15 AM" callout above the Send button in future.

**R16. Conversation summary (AI)**

- A one-click AI summary of the full email thread shown at the top of the expanded thread view.
- v1 design implication: Leave vertical space above the first message in the expanded thread view for a future summary card.

---

## 7. Success Metrics

**Leading indicators (days–weeks post-launch):**

- **Emails tab visit rate:** % of contact record views that include an Emails tab click → Target: 40% within 30 days (baseline: 0%, new feature).
- **Compose-from-record rate:** % of CRM-sent emails originating from the contact record page (vs. Inbox module or browser extension) → Target: 50% within 30 days.
- **AI writing adoption:** % of compose sessions where "Write with AI" is invoked → Target: 25% within 30 days.
- **AI insert rate:** Of AI invocations, % that result in "Insert content" (not dismiss or retry-then-abandon) → Target: 60%.
- **Compose-to-send conversion:** % of compose modal opens that result in a sent email → Target: 70%.
- **Median compose time:** Time from compose modal open to "Send email" click → Target: <90 seconds for AI-assisted, <4 minutes for manual.

**Lagging indicators (weeks–months post-launch):**

- **Email logging completeness:** % of sales-relevant emails that are attached to a contact record → Target: +30% from baseline within 90 days.
- **CRM session duration:** Average time spent in SparrowCRM per session → Target: +15% (indicates reps are doing more work in-CRM).
- **Context-switch reduction:** Tab-switch events within 2 min of viewing a contact record → Target: -40% within 60 days.
- **Rep-reported satisfaction:** Qualitative feedback from 10 reps via structured interviews at 30 and 60 days.

**Targets**

- **Success threshold:** Compose-from-record rate >35%, AI insert rate >50%, and at least 5 of 10 interviewed reps say they "rarely" need to open Gmail to email a contact.
- **Stretch target:** Compose-from-record rate >60%, AI writing adoption >40%, median AI-assisted compose time <45 seconds.
- **Measurement:** PostHog events for tab clicks, compose opens, AI invocations, AI inserts, send clicks. Compose time = timestamp diff between compose_open and send_click events.
- **Evaluation cadence:** Weekly dashboard review for first 4 weeks, then monthly.

---

## 8. Open Questions

|#|Question|Owner|Blocking?|Needed by|
|---|---|---|---|---|
|1|What CRM context fields does the AI backend have access to when resolving `{}` variables? Is it limited to contact/company fields, or can it pull deal stage, recent activity, meeting notes?|Eng + AI team|Yes|Before R6 implementation|
|2|What is the AI credit cost per generation? Does a "Retry" consume an additional credit?|Product + AI team|Yes|Before launch (pricing/UX implication)|
|3|Should the compose modal support drag-and-drop file attachments, or file-picker only for v1?|Design|No|During implementation|
|4|How does the Emails tab handle contacts with >100 synced threads? Infinite scroll, pagination, or "Load more"?|Eng|No|During implementation|
|5|For Reply/Reply All, should the compose open inline below the thread or as a separate modal? Figma shows both patterns across different surfaces — which is canonical for Contacts?|Design|Yes|Before R5 implementation|
|6|~~If a rep sends from an alias, does the "From" field in the compose modal show the alias?~~ **RESOLVED** — Figma confirms: the sender email at the top of the compose modal is clickable, opening an inline dropdown listing connected accounts + verified aliases. Selecting an alias updates the From address. Remaining sub-question: when sending from an alias, does the connected account's signature still apply, or should we suppress it?|Design + Eng|No|During implementation|
|7|What happens if the connected mailbox's OAuth token expires mid-compose? Does the rep get an error on send, or do we validate connection status on compose open?|Eng|No|During implementation|
|8|Does the AI writing panel persist its prompt text if the rep closes and reopens it within the same compose session?|Design + Eng|No|During implementation|
|9|Current Figma shows the AI panel within the Inbox Compose view — confirm the identical component is used on the Contact Record Page compose modal (no divergent implementations).|Design|Yes|Before R6 implementation|

---

## 9. Timeline Considerations

- **Hard deadlines:** None identified. No contractual commitments or compliance dates tied to this feature.
- **Dependencies:**
    - **Email sync infrastructure (parent spec R1, R2):** Must be live and stable before this feature can ship. Emails tab has nothing to show without synced data.
    - **AI credits system:** Must be operational for AI writing to work. Credits exhaustion UI depends on the credits API.
    - **Email signatures (parent spec R9):** Must be implemented for auto-append in compose.
    - **Email open tracking (parent spec R10):** Must be live for the open indicator on the Emails tab.
    - **Connected accounts and aliases (parent spec R1, R12):** Must be implemented for the "From" account selector in compose.
- **Suggested phasing:**
    - **Phase 1 (P0 core):** Emails tab (R1), thread expansion (R3), compose modal (R4), send (R4), reply/reply all (R5). This delivers the core "view and send emails from the contact record" value.
    - **Phase 2 (P0 AI + polish):** AI writing (R6), search and filter (R2), attachments (R7), signature auto-append (R8). This adds the AI layer and completes the compose experience.
    - **Phase 3 (P1):** Draft auto-save (R9), scheduling (R10), AI tone memory (R11), inline rewrite (R12).