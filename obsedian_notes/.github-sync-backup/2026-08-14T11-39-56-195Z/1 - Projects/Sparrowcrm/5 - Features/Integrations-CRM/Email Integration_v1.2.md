
## 1. Summary of Changes

Two changes to how contacts get created from email:

1. **Remove the "All contacts" mode.** Contact creation now offers only **Engaged contacts (Selective)** and **None**. "Create records for everyone found in synced emails" is gone.
2. **Move the creation-mode choice from admin to rep level.** The admin no longer picks Selective/All/None for the whole workspace. Instead:
    - **Admin** keeps a single permission gate: **"Allow users to create contacts from emails"** (on/off), plus the existing **company-creation** toggle and **private recipients**.
    - **Rep** chooses **Engaged contacts** or **None** for their own mailbox — in the connect/import popup and in a "Manage how contacts are created" control on their Email Settings.

Net model: **admin sets whether creation is allowed at all; each rep decides how their own inbox creates contacts (Engaged or None) within that permission.**

---

## 2. Why

**Why remove "All contacts":**

- In an **outbound-first motion** (reps email the customer first), "Engaged = sent or replied" already creates every real contact — the rep's first send creates the record. "All" adds essentially no real contacts.
- What "All" _does_ add is CC'd strangers and personal/non-business humans = noise, cost (per-contact billing/quotas), and a data-minimization (GDPR) liability for people who never engaged.
- The obvious junk (no-reply, promotional) is already filtered, so "All" wasn't catching leads — just clutter.
- Over the debate it failed the test: it couldn't name a contact it would create that the team actually wants and "Engaged" wouldn't already catch.

**Why move the choice to rep level:**

- Contact creation from a mailbox is inherently personal to that inbox — the rep knows which of their conversations are real business vs. personal.
- A single workspace-wide mode forces one policy on very different mailboxes. Rep-level control lets each rep keep their own CRM clean without an admin round-trip.
- Admin still holds the ceiling (allow / don't allow), so governance is preserved; reps only choose _within_ that.

---

## 3. New Control Model

| Layer            | Who       | Control                                           | Options                         |
| ---------------- | --------- | ------------------------------------------------- | ------------------------------- |
| Permission gate  | **Admin** | Allow users to create contacts from emails        | On / Off                        |
| Company creation | **Admin** | Create company records from contact email domains | On / Off                        |
| Exclusions       | **Admin** | Private recipients (locked for reps)              | list                            |
| Creation mode    | **Rep**   | How contacts are created for _their_ mailbox      | **Engaged contacts** / **None** |

Rules:

- If admin gate is **Off** → the rep's creation mode is forced to **None** and the control is disabled with a reason.
- If admin gate is **On** → the rep chooses **Engaged contacts** (recommended) or **None**.
- A rep can always be more restrictive (pick None) but can never create beyond "Engaged."
- "All contacts" is not an option anywhere.

---

## 4. Requirements

### P 0

**R 1 — Remove "All contacts" everywhere** Engaged/Selective and None are the only creation options in admin, rep settings, and the connect/import popup.

- **Acceptance criteria:**
    - Given any contact-creation control (admin, rep settings, connect popup), Then only "Engaged contacts" and "None" are shown; "All contacts" does not appear.
    - Given a workspace that previously had "All contacts" selected, When the change ships, Then it is migrated to "Engaged contacts" (see R 5).

**R 2 — Admin permission gate replaces admin mode** The admin page shows "Allow users to create contacts from emails" (on/off) instead of the Selective/All/None picker. Company-creation toggle and private recipients remain.

- **Acceptance criteria:**
    - Given the admin Email Settings, Then the Selective/All/None picker is replaced by a single "Allow users to create contacts from emails" toggle.
    - Given the toggle is Off, Then no rep can create contacts from email regardless of their own setting.
    - Given the toggle is On, Then reps may choose their own creation mode.

**R 3 — Rep-level creation mode** Each rep sets "Create contacts for new people" → Engaged contacts / None, both in the connect/import popup and in a persistent "Manage how contacts are created" control on their Email Settings.

- **Acceptance criteria:**
    - Given the admin gate is On, When the rep opens the connect popup, Then they see "Create contacts for new people" with Engaged contacts (default/recommended) and None.
    - Given a connected rep, When they open "Manage how contacts are created," Then they can switch between Engaged contacts and None at any time; the change applies going forward.
    - Given the admin gate is Off, When the rep views the control, Then it is disabled/forced to None with: "Your admin has turned off contact creation from emails."

**R 4 — "Sync to existing contacts" stays independent** Attaching emails to contacts that already exist is separate from creating new ones (the connect popup keeps "Sync to existing contacts" as its own toggle). Turning creation to None still logs to existing contacts.

- **Acceptance criteria:**
    - Given creation mode = None, When emails are synced/imported, Then they still attach to existing contacts; no new contacts are created.

### P 0 — Migration

**R 5 — Migrate existing settings**

- Workspaces with admin mode **All** → migrate to: admin gate **On**, rep default **Engaged contacts**.
- Workspaces with admin mode **Selective** → admin gate **On**, rep default **Engaged contacts**.
- Workspaces with admin mode **None** → admin gate **Off** (reps forced to None).
- **Acceptance criteria:**
    - Given any existing workspace, When the change deploys, Then its behavior maps per the table above with no manual admin action required, and no existing contacts/emails are deleted.

---

## 5. Acceptance Criteria (summary)

**Admin gate**

- [ ] Admin Email Settings shows a single "Allow users to create contacts from emails" toggle (no Selective/All/None picker).
- [ ] Gate Off → no rep creates contacts; rep control is disabled with "Your admin has turned off contact creation from emails."
- [ ] Gate Off retains already-created contacts (no deletion).
- [ ] Gate On → reps can choose their own mode.

**Remove "All contacts"**

- [ ] "All contacts" appears in no surface (admin, rep settings, connect popup).
- [ ] No code path creates contacts for participants the rep didn't send or reply to.

**Rep creation mode**

- [ ] With the gate On, rep sees "Create contacts for new people" → Engaged contacts (default) / None, in both the connect popup and "Manage how contacts are created."
- [ ] Changing the mode applies going forward, not retroactively.
- [ ] Setting is stored per connected account (works independently across multiple mailboxes).
- [ ] Mode = None still attaches emails to existing contacts (creation and attach-to-existing are independent).

**Engaged logic (regression guard)**

- [ ] Sent to a new address → contact created.
- [ ] Replied-to inbound → contact created (via reply), original inbound attaches.
- [ ] Never-replied inbound → skipped (no contact created).
- [ ] CC logs to existing contacts only; never creates from CC.
- [ ] BCC never logs or creates.
- [ ] Private recipients always excluded, in every mode.

**Migration**

- [ ] All → gate On + rep default Engaged.
- [ ] Selective → gate On + rep default Engaged.
- [ ] None → gate Off.
- [ ] No contacts, companies, or emails deleted; only future behavior changes.

**Edge cases**

- [ ] Reconnect uses the account's current mode; no re-import, no duplicates.
- [ ] Gate visibly communicates admin control to the rep when Off (not silently missing).
- [ ] _(Confirm with eng)_ behavior defined if the admin turns the gate Off mid-import.

---

## 6. Non-Goals

- **Re-introducing "All contacts"** in any form (capped or otherwise) — explicitly cut.
- **Per-thread "add participants"** to capture CC'd stakeholders — possible future answer to the buying-committee case, not in this change.
- **Changing the 3-month historical window, private recipients, or the import flow order** — unchanged by this spec.

---

## 7. Open Questions

- **(Product/Design)** Default rep mode when admin first turns the gate On for a brand-new workspace — Engaged (recommended) confirmed?
- **(Eng)** Does moving the mode to rep level require a per-user setting field on the email-account record? (Likely yes — `contact_creation_mode` per connected account.)
- **(Data/Migration)** Confirm the "All → Engaged" migration won't strip already-created "All"-era contacts (it shouldn't — migration changes future behavior only, retains existing records).
- **(Design)** Copy for the disabled rep control when the admin gate is Off.

---

## 8. What's Unchanged (for reviewers)

Engaged-contacts logic (sent/replied, thread-aware), 3-month historical window, "contact sales" for more history, private recipients (admin-locked), CC/BCC rules, reconnect behavior, and the choose → private recipients → authenticate → import flow all remain as specified in the main Historical Email Import PRD.