---
owner: Divyaraj Murugan
feature: "[[Email Integration]]"
version: 1
status: Done
priority: High
tags:
  - sparrowcrm/features/integrations/email_integration/v1
related:
  - "[[Block Contact creation of Same Domain_v1]]"
  - "[[Email_v1]]"
  - "[[Email_Integrations_v2-Historical Import]]"
  - "[[Sparrowdesk_v1]]"
  - "[[Import_v1]]"
  - "[[Email Integration_v1.2]]"
  - "[[2-Product Strategy]]"
  - "[[1-Product Vision]]"
  - "[[GTM-Unified-Filters]]"
  - "[[filters_v1]]"
  - "[[prd-sparrowcrm-unified-filters]]"
  - "[[Integrations-CRM]]"
  - "[[Project admin settings]]"
  - "[[Replace Email-Based User Display with Name and Team]]"
  - "[[First Principle for a CRM]]"
---
### Wireframe  - [Balsamiq](https://balsamiq.cloud/sfwp3yg/pyg45on/r1E86)
### 1. Problem Statement
- Sales reps and managers rely on email every day to manage customer conversations, but those interactions remain fragmented across individual inboxes instead of being visible inside SparrowCRM. As a result, users constantly switch between CRM and Gmail/Outlook to understand customer context, manually log emails, and track account activity, leading to incomplete records, missed follow-ups, reduced CRM adoption, and poor team visibility. Competitors like HubSpot and Attio already provide integrated email visibility and sending workflows, making email sync a critical expectation for modern CRM users.
## 2. Jobs To Be Done

### [[Sales Rep]] / [[Sales Manager]] JTBD

#### Conversation Visibility

- [ ] See all email conversations for a contact inside CRM
- [ ] View email conversations of other sales reps for shared records
- [ ] See all conversations at the account/company level/deal level
- [ ] View email association with contact/account/opportunity

#### Email Sending

- [ ] Send emails directly from CRM
- [ ] Reply to existing threads from CRM
- [ ] Connect multiple email accounts
- [ ] Set a default sending account
- [ ] Add email aliases
- [ ] Save and use email signatures

#### Data Hygiene

- [ ] delete irrelevant synced emails from CRM view
- [ ] Manually log emails if sync misses them
- [ ] Decide which emails are shared to CRM
- [ ] Maintain a personal email/domain blocklist

#### Sync Reliability

- [ ] Reconnect email account if sync breaks
- [ ] Remove connected accounts

#### Engagement Tracking

- [ ] Track email opens
---

### [[Admin]] JTBD

#### Record Creation Control

- [ ] Configure email-based record creation

Options:
- [ ] Create all records automatically
- [ ] Create only selected records
- [ ] Manual creation only
- [ ] Disable record creation
---
#### Organization-wide Blocklist

- [ ] Block specific emails/domains across the organization to protect the sensitive information
---

### 3. Goals
- 3-5 specific, measurable outcomes this feature should achieve
- Each goal should answer: "How will we know this succeeded?"
- Distinguish between user goals (what users get) and business goals (what the company gets)
- Goals should be outcomes, not outputs ("reduce time to first value by 50%" not "build onboarding wizard")

## 4. Non-Goals

- **Alias auto-detection from email provider** — v1 aliases are manually added by the user. Auto-detecting aliases from Gmail/Microsoft API adds OAuth scope complexity and provider-specific logic. Revisit in v1.5.
- **Alias-level signatures** — v1 signatures are per connected account, not per alias. If a user sends from an alias, the connected account's signature is used.
- **Multi-user alias conflict resolution** — If two users try to add the same alias, first-come-first-served. No admin-level alias assignment or shared alias ownership in v1.
- **Built-in email sequences / drip campaigns** — Separate initiative. v1 is about conversation visibility and one-to-one sending, not automation. Sequences are a distinct product surface.
- **Calendar sync and meeting scheduling** — Adjacent but separate. The wireframes show "Calendar Settings" as its own nav item. Will be its own PRD.
- **Email analytics / engagement dashboards** — v1 tracks opens at the individual email level. Aggregated analytics (response rates, rep activity leaderboards) are a future layer.
- **Shared inbox / team email** — v1 connects individual user mailboxes. Shared mailbox support (e.g., [sales@company.com](mailto:sales@company.com) as a shared inbox) is architecturally different and out of scope.

---

## 5. User Stories

### Primary persona — Sales Rep

- As a sales rep, I want to connect my Gmail or Microsoft account to SparrowCRM so that my sent and received emails sync automatically to the relevant CRM records.
- As a sales rep, I want to see all email conversations on a contact's timeline so that I have full context before a call or meeting without checking my inbox.
- As a sales rep, I want to send an email to a contact directly from the CRM so that I can work from one tool during my sales workflow.
- As a sales rep, I want to reply to an existing email thread from within CRM so that conversation continuity is maintained.
- As a sales rep, I want to connect multiple email accounts (e.g., work Gmail + secondary account) and set one as default so that I send from the right identity.
- As a sales rep, I want to add an email alias (e.g., [sales@company.com](mailto:sales@company.com)) linked to my connected mailbox so that I can send customer emails from the address my team uses.
- As a sales rep, I want replies sent to my alias to sync to CRM so that conversations initiated from a shared identity are still tracked on the right records.
- As a sales rep, I want to manage email signatures within CRM so that my outbound emails look professional without manual setup each time.
- As a sales rep, I want to block specific email addresses or domains from syncing to CRM so that newsletters, marketing emails, and personal conversations don't pollute my records.
- As a sales rep, I want to forward an email to a CRM logging address so that emails sent from my phone or outside CRM still get attached to the right contact.
- As a sales rep, I want to control the default sharing level of my synced emails (metadata only, subject + metadata, or full access) so that I can protect sensitive conversations while still giving my team visibility.
- As a sales rep, I want to see whether my sent email was opened so that I can time my follow-ups better.

### Secondary persona — Sales Manager

- As a sales manager, I want to see email activity on shared records (contacts, companies, deals) so that I have visibility into deal progress without asking reps for updates.

### Admin persona

- As an admin, I want to configure whether contacts are auto-created from synced emails (selective, all, or none) so that the CRM doesn't get cluttered with irrelevant records.
- As an admin, I want to enable automatic company record creation from contact email domains so that account-level data builds itself.
- As an admin, I want to toggle private recipients on or off so that I can control whether sensitive email conversations are excluded from CRM visibility.

### Edge cases

- As a sales rep, when my email sync breaks (token expiry, revoked permissions), I want a clear reconnect flow so that I can restore sync without re-adding the account from scratch.
- As a sales rep, when I forward an email to the logging address and the sender isn't a CRM contact, I want the system to follow the admin's contact creation rules (create, skip, or queue) so that behavior is consistent.
- As a sales rep, when I remove a connected email account, I want to clearly understand that sync will stop but previously synced conversations will remain in the CRM as company records, so that I'm not surprised by the behavior.
- As a new user with no connected email, I want to see a clear empty state on the email settings page that guides me to connect my account first.
- As a sales rep, when I try to add an alias that another user has already claimed, I want to see a clear error so that I understand why it can't be added and can resolve it with my team.

---

## 6. Requirements

### Must-Have (P0)

**R1. OAuth email account connection (Gmail + Microsoft)**

- User can connect a Gmail or Microsoft email account via OAuth from the Email Settings page.
- Multiple accounts can be connected per user.
- One account can be set as default for sending.
- **Acceptance criteria:**
    - Given a user on the Email Settings page with no connected account, When they click "Connect Google account," Then they are redirected to Google OAuth, and upon successful auth, the account appears as connected with "In Sync" status.
    - Given a user with one connected account, When they connect a second account, Then both appear in the connected accounts list.
    - Given a user with multiple connected accounts, When they select "Set as default" on one, Then that account is used as the default From address when composing.
    - Given a user whose OAuth token has expired, When they visit Email Settings, Then the account shows a degraded state with a "Reconnect" action.

**R2. Two-way email sync (full history)**

- All sent and received emails from the connected mailbox sync to CRM and attach to matching contact/company/deal records.
- **Multi-party emails:** If a synced email has multiple recipients and more than one is a CRM contact, the email is logged to every matching contact's timeline.
- **Attachments:** Email attachments are synced and stored in CRM — not just referenced. Attachments are accessible from the email entry on the contact timeline.
- Sync includes full email history — not capped at 3 months. At worst-case scale (50K emails/user, 100 users/account, 5 accounts = 25M emails), Gmail and Microsoft APIs don't charge per call. Launch volume will be a fraction of this.
- Initial historical sync runs on account connection. Ongoing sync is real-time via webhooks (Gmail push notifications / Microsoft Graph subscriptions).
- **Acceptance criteria:**
    - Given a user connects their Gmail account, When the initial sync completes, Then all historical emails matching CRM contacts appear on those contacts' timelines.
    - Given a user receives a new email from a known CRM contact, When the email arrives in their mailbox, Then the email appears on that contact's timeline in real-time via webhook-based sync.
    - Given a user sends an email from Gmail to a CRM contact, When sync runs, Then the sent email appears on the contact's timeline.
    - Given a synced email has 4 recipients and 2 of them are CRM contacts, When the email is synced, Then it is logged to both contacts' timelines.
    - Given a synced email has attachments, When viewing the email on a contact's timeline, Then attachments are visible and downloadable.
- **Technical notes:** Sync should be designed for idempotency — re-running sync on the same mailbox should not create duplicates. Rate limiting against Gmail/Microsoft API quotas must be handled gracefully with backoff.

**R3. Send and reply from CRM**

- Users can compose and send new emails to contacts from within CRM.
- Users can reply to existing email threads from CRM, maintaining thread continuity.
- Emails are sent through the connected mailbox (not a CRM-owned SMTP server).
- **Acceptance criteria:**
    - Given a user viewing a contact record, When they compose and send an email, Then the email is delivered via their connected mailbox and appears in both CRM and their Gmail/Outlook sent folder.
    - Given a user viewing an email thread on a contact's timeline, When they click reply and send, Then the reply maintains the thread (correct In-Reply-To / References headers).
    - Given a user with multiple connected accounts, When they compose an email, Then they can select which account to send from, defaulting to their default account.

**R4. Contact creation rules (admin setting)**

- Admin selects one of three modes for email-driven contact creation:
    - **Selective contact (recommended):** Create records only for people the team emails first or replies to.
    - **All contacts:** Create records for everyone found in synced emails and meetings.
    - **None:** Do not create records automatically.
- This setting applies globally to both connected sync and forwarded emails.
- **Acceptance criteria:**
    - Given the admin selects "Selective contact," When a synced email arrives from an unknown sender who the team has never emailed, Then no contact record is created.
    - Given the admin selects "Selective contact," When a rep sends an email to a new address from CRM, Then a contact record is created automatically.
    - Given the admin selects "All contacts," When a synced email contains an unknown email address, Then a new contact record is created.
    - Given the admin selects "None," When a synced email contains an unknown address, Then no contact is created; the email is only logged if the address matches an existing contact.

**R5. Automatic company creation**

- Toggle (admin-level) to automatically create company records from contact email domains.
- **Acceptance criteria:**
    - Given the toggle is on and a new contact is created from email sync with the domain acme.com, When no company record exists for acme.com, Then a company record is created and the contact is linked to it.
    - Given the toggle is off, When a new contact is created, Then no automatic company record is created.

**R6. Per-user blocklist**

- Individual users can maintain their own blocklist (email addresses and domains) from their connected account detail page (Blocklist tab).
- Blocked emails/domains are completely excluded from CRM — they are not synced, not logged, and not visible anywhere.
- Supports wildcard domain blocking (e.g., `*@newsletter.com`).
- Bulk add via text input (comma, newline, or space separated).
- **Acceptance criteria:**
    - Given a user adds `*@marketing-email.com` to their personal blocklist, When their sync encounters an email from that domain, Then it is not logged in CRM.
    - Given a user opens the "Add emails or domains" modal, When they enter multiple entries separated by commas, Then all entries are added to the blocklist.
    - Given a blocklisted domain entry already exists, When the user tries to add it again, Then a duplicate is prevented.

**R7. Manual email logging (forwarding address)**

- Each workspace gets a unique auto-generated forwarding address (e.g., `log-acme7k9@inbound.sparrowcrm.com`).
- Any workspace member can forward/BCC emails to this address to manually log them in CRM.
- The system parses the original to/from addresses from the forwarded email and matches against existing CRM contacts.
- Contact creation rules (R5) apply to forwarded emails — same behavior as connected sync.
- **Acceptance criteria:**
    - Given a user forwards an email from [john@customer.com](mailto:john@customer.com) to the workspace forwarding address, When [john@customer.com](mailto:john@customer.com) exists as a CRM contact, Then the email is logged on that contact's timeline.
    - Given a user forwards an email from an unknown address, When the admin has set contact creation to "All contacts," Then a new contact is created and the email is logged.
    - Given a user forwards an email from an unknown address, When the admin has set contact creation to "None," Then the email is not logged and no contact is created.
    - Given the forwarding address, When it is displayed in the Email Settings page, Then a "Copy" button allows the user to copy it to clipboard.
- **Technical notes:** Forwarding address is generated once per workspace at workspace creation time. One address shared across all users. Routing is scoped to the workspace — the address encodes the workspace identity.

**R8. Private recipients (admin)**

- Admin can manage a list of email addresses and/or domains that are blocked from syncing for all users in the workspace. This is the organization-level blocklist.
- When toggled on, any email to/from addresses or domains in the list will not be synced, logged, or visible anywhere in CRM.
- When toggled off, the list is preserved but not enforced (values remain for re-enabling later).
- Supports wildcard domain blocking (e.g., `*@newsletter.com`).
- Bulk add via text input (comma, newline, or space separated).
- **Acceptance criteria:**
    - Given private recipients is toggled on and `*@spam-email.com` is in the list, When any user's sync encounters an email from that domain, Then it is completely excluded from CRM — not synced, not logged, not visible.
    - Given private recipients is toggled on and no values are configured, When viewing the setting, Then the table is empty and editable.
    - Given private recipients is toggled on and has configured values, When toggled off, Then the table becomes disabled (values preserved but not enforced, previously blocked emails do not retroactively sync).
    - Given the admin opens the "Add emails or domains" modal, When they enter multiple entries separated by commas, Then all entries are added to the list.
    - Given a duplicate entry already exists, When the admin tries to add it again, Then it is prevented.

**R9. Email signatures**

- Users can create and manage email signatures from the connected account detail page (Signatures tab).
- Supports both simple text and HTML signatures.
- Rich text editor with formatting (bold, italic, underline, lists, links, images).
- Multiple signatures per account with named labels (e.g., "My signature," "Marketing mails").
- **Acceptance criteria:**
    - Given a user has no signatures, When they visit the Signatures tab, Then they see an empty state with "+ Add Signature" button.
    - Given a user creates a signature, When they compose an email from CRM, Then the signature is automatically appended.
    - Given a user has multiple signatures, When they compose an email, Then they can select which signature to use.
    - Given a user edits a signature, When they save, Then all future emails use the updated version (previously sent emails are not affected).

**R10. Email open tracking**

- Track when a recipient opens an email sent from CRM.
- Display open status as a green indicator with relative timestamp on the email in the contact timeline (Emails tab).
- Open status uses relative time labels that degrade gracefully:
    - `Opened just now` — within the last 60 seconds
    - `Opened 3 mins ago` — minutes, up to 59 mins
    - `Opened 1 hour ago` / `Opened 2 hours ago` — hours, up to 23 hours
    - `Opened yesterday` — previous calendar day
    - `Opened 2 days ago` — 2–6 days ago
    - `Opened 1 week ago` — 7–13 days ago
    - `Opened on May 19` — 14+ days ago, switches to absolute date
- **Acceptance criteria:**
    - Given a user sends an email from CRM, When the recipient opens it, Then a green "● Opened [relative time]" indicator appears next to the email on the contact's Emails tab.
    - Given a user sends an email and the recipient has not opened it, Then the email shows as "sent" without an open indicator.
    - Given a recipient opens an email multiple times, When viewing the timeline, Then the indicator shows the most recent open time.
    - Given an email was opened more than 14 days ago, When viewing the timeline, Then the label switches from relative time to absolute date format (e.g., "Opened on May 19").
    - Given the recipient's email client blocks tracking pixels, When viewing the timeline, Then the email shows as "sent" (no false positives — absence of open data is not displayed as "not opened").
- **Technical notes:** Implemented via tracking pixel (1x1 transparent image). Must handle privacy-respecting email clients that block images — open tracking will not work in all cases and should not be presented as guaranteed. Store the raw open timestamp server-side; relative time labels are computed client-side at render time. Supports GDPR and CAN-SPAM compliance — users can disable tracking per email or globally from settings.

**R11. Account removal**

- Users can disconnect (remove) a connected email account.
- On removal, sync stops and the OAuth token is revoked. **All previously synced data is retained as company records.** The rationale: synced emails become company data the moment they enter the CRM. A rep disconnecting, leaving, or being offboarded should not erase the company's customer conversation history.
- Specific data behavior on disconnect:
    - **Emails are retained** — All emails synced from that account remain on contact/company/deal timelines as company records. They are no longer editable by the disconnected user.
    - **Calendar events are retained** — All calendar events synced from that account remain visible.
    - **Contact and company records are retained** — Any records created from the synced account remain in the workspace.
    - **Communication intelligence stops updating** — Data like "Last interaction" and "Connection strength" persists but will no longer receive new data from that account.
    - **New emails stop syncing** — No new emails are pulled from the disconnected mailbox.
- Confirmation modal must clearly communicate the retention behavior before the user confirms.
    - Recommended copy: "Disconnecting this account will stop syncing new emails and calendar events. Previously synced conversations will remain in the CRM as part of your company's records. Contacts and companies created from this account will not be affected."
- **Acceptance criteria:**
    - Given a user clicks "Remove mail" on a connected account, When they see the confirmation modal, Then it clearly states that previously synced data will be retained as company records.
    - Given a user confirms removal, When the account is disconnected, Then sync stops, the OAuth token is revoked, and all previously synced emails and calendar events remain visible on their respective timelines.
    - Given a user removes an account, When a manager or teammate views a shared contact's timeline, Then emails synced from the removed account are still visible.
    - Given a user removes an account, When they later re-connect the same account, Then only new emails (since reconnection) are synced; previously retained emails are not duplicated.
    - Given a rep has left the company and an admin deactivates their account, When a new rep is assigned the same deals, Then all email history from the previous rep is visible on those records.

**R12. Email aliases (manual add, send-as, reply sync)**

- Users can manually add email aliases linked to their connected mailbox.
- Aliases enable send-as (selecting the alias as the From address when composing from CRM).
- Replies sent to an alias are synced and mapped to the correct CRM records when they arrive in the connected mailbox.
- Aliases are verified via email confirmation — system sends a verification email to the alias address, and if it lands in the connected mailbox, the user confirms it.
- One alias can only be claimed by one user. If another user tries to add the same alias, they see an error.
- No auto-detection from provider APIs. No alias-level signatures (uses the connected account's signature).
- **Acceptance criteria:**
    - Given a user with a connected email account, When they click "+ Add alias" and enter `sales@company.com`, Then the system sends a verification email to that address.
    - Given the verification email arrives in the user's connected mailbox, When the user confirms, Then the alias appears as active in the Email aliases section.
    - Given a user has an active alias, When they compose an email from CRM, Then they can select the alias as the From address.
    - Given a user sends an email from CRM using an alias, When the recipient replies to the alias, Then the reply syncs to CRM and attaches to the correct contact's timeline.
    - Given a user tries to add an alias that is already claimed by another user in the same workspace, When they submit, Then they see an error: "This email alias is already connected to another user."
    - Given a user enters an invalid email format, When they submit, Then they see an error: "Invalid email format."
    - Given a user has no connected email account, When they view the Email aliases section, Then they see: "Connect your inbox to start using email aliases."
- **Technical notes:** Verification flow avoids the need for additional OAuth scopes for alias detection. The send-as implementation depends on whether Gmail/Microsoft API supports sending from aliases with the existing OAuth scopes — eng must verify this before implementation begins. If the current scopes don't support send-as, the OAuth consent screen will need to be updated, which triggers re-auth for existing connected users.

---

### Nice-to-Have (P1)

**R13. Email search within CRM**

- Users can search across synced emails by keyword, sender, recipient, or date range from within the CRM.
- **Acceptance criteria:**
    - Given a user searches for "proposal," When results load, Then all synced emails containing "proposal" in subject or body are returned, linked to their CRM records.

**R14. Bulk actions on synced emails**

- Users can hide or archive irrelevant synced emails from CRM view without deleting the source email.

**R15. Forwarding address attribution**

- Track which user forwarded an email (via envelope sender headers) and display it as "Logged by [user]" on the timeline entry.

---

### Future Considerations (P2)

**R16. Shared inbox support**

- Support connecting shared mailboxes (e.g., [sales@company.com](mailto:sales@company.com)) as a team-level resource rather than an individual connection.
- **v1 design implication:** Keep the account connection model user-scoped. Shared inbox is a different entity type — don't overload the current per-user model.

**R17. Default sharing controls**

- Per-account sharing levels controlling what teammates can see on shared records (e.g., metadata only, subject + metadata, full access).
- **v1 design implication:** All synced emails are full access by default. Privacy is controlled via blocklist + private recipients. Only revisit if enterprise customers with compliance requirements request granular visibility controls.

**R18. Email sequences / automated follow-ups**

- Multi-step automated email sequences triggered by deal stage or contact activity.
- **v1 design implication:** The send infrastructure (SMTP via connected mailbox) should be designed to support programmatic sends in future, not just UI-initiated sends.

**R19. Alias auto-detection from provider**

- Automatically detect and surface aliases configured in Gmail/Microsoft instead of requiring manual entry.
- **v1 design implication:** The manual add flow is the right starting point. Auto-detection can replace it later without changing the alias data model.

**R20. Individual email deletion with permission controls**

- Allow users to delete specific synced emails from CRM records. This requires a permission set system for email data:
    - **Delete own emails** — Rep can delete emails they synced.
    - **Delete any emails** — Manager/admin can delete emails synced by any user.
    - **No delete** — Default for most roles. Emails are retained as company records.
- **v1 design implication:** v1 retains all synced data with no per-email deletion. The email data model should include a `synced_by_user_id` field to support ownership-based permissions later. Do not build deletion or permission sets in v1 — wait for real customer feedback on whether this is needed.

**R21. Admin offboarding flow**

- When a rep leaves the organization, admin can revoke their email connection, reassign their contacts/deals to another rep, and retain full email history on those records.
- **v1 design implication:** v1's retention-by-default approach already supports this passively — when an admin deactivates a user, their synced data stays. A formal offboarding UI (bulk reassign, connection revocation, activity audit) is a future feature but the data model supports it because nothing is deleted on disconnect.

**R22. Account removal behavior for email sequences**

- When a connected account is removed and that account was the sender for active email sequences, define the behavior for in-flight sequences (exit recipients, pause, reassign to another sender).
- **v1 design implication:** Email sequences are not in v1 scope. No sequence-related behavior needs to be built for account removal. This will be defined when the sequences feature ships.

---

## 7. Success Metrics

**Leading indicators (first 14–30 days post-launch):**

|Metric|Definition|Target|Measurement|
|---|---|---|---|
|Email connection rate|% of active users who connect at least one email account within 7 days of signup|60%|Product analytics|
|Sync reliability|% of connected accounts with "In Sync" status (no errors) at any given time|95%+|System monitoring|
|Send adoption|% of connected users who send at least one email from CRM in their first 14 days|40%|Product analytics|
|Forwarding address usage|% of workspaces where at least one email is logged via forwarding in first 30 days|20%|Inbound email logs|
|Time to first sync|Median time from OAuth completion to first emails visible on contact timelines|< 10 minutes|System metrics|

**Lagging indicators (60–90 days post-launch):**

|Metric|Definition|Target|Measurement|
|---|---|---|---|
|CRM daily active usage|Change in daily active CRM sessions among users with connected email|+25% vs pre-launch baseline|Product analytics|
|Competitive win rate|Removal of "no email integration" as a stated objection in lost-deal analysis|Eliminated as top-5 loss reason|Sales CRM / loss reason tracking|
|Email data completeness|% of closed-won deals with at least 5 synced email threads attached|70%|CRM reporting|

**Evaluation cadence:**

- Day 14: Leading indicators review
- Day 60: Full metrics review (leading + lagging)
- Day 90: Final v1 assessment, inform v1.5 priorities


---

## 8. Open Questions

No blocking open questions remain. All previously identified questions have been resolved and incorporated into the requirements above.

---

## 9. Timeline Considerations

**Hard deadlines:**

- None identified yet. This is a foundational feature — ship when it's solid, not rushed.


**Dependencies:**

- OAuth app registration and approval for Google Workspace and Microsoft 365 (can take 2–6 weeks for production approval, especially Microsoft).
- Email infrastructure: inbound email processing for the forwarding address (MX record setup, email parsing service).
- Tracking pixel infrastructure for open tracking.

**Suggested phasing:**

|Phase|Scope|Duration|
|---|---|---|
|Phase 1 — Core sync|OAuth connection (Gmail + Microsoft), two-way sync, full history, contact matching, contact creation rules|4–5 weeks|
|Phase 2 — Send + manage|Send/reply from CRM, signatures, email aliases (manual add + send-as + reply sync), default sending account|4–5 weeks|
|Phase 3 — Admin + logging|Private recipients, per-user blocklist, forwarding address, open tracking|2–3 weeks|
|Phase 4 — Polish + GA|Edge case handling, error states, reconnect flows, empty states, QA, beta|2 weeks|

**Total estimated timeline: 12–15 weeks** (engineering estimate needed to validate)