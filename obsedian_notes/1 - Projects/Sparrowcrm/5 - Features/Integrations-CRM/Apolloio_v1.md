---
owner: Divyaraj Murugan
feature: "[[Integrations]]"
version: 1
status:
priority:
tags:
---
## 1. Problem Statement

Today SparrowCRM treats Apollo as a **native enrichment provider**: the server calls Apollo using one SparrowCRM-owned API key (`CONTACT_ENRICHMENT_CONFIG.APOLLO.APOLLO_API_KEY`) and meters every enrichment against the customer's SparrowCRM enrichment-credit pool. Apollo also acts as the **silent fallback** for ZoomInfo — when ZoomInfo returns no match, `enrichContactWithZoominfo()` calls `enrichContactWithApollo()` on the same shared key.

This model isn't viable. Apollo's API ToS (§2 "internal business purposes", §3 third-party integration authorization) do not permit a platform to enrich third parties' records on a single shared account and resell that as credits. To use Apollo legitimately, **each customer must bring their own Apollo account**. We're pre-launch, so there is no data to migrate — but enrichment cannot ship in its current shape. We need to move Apollo out of native enrichment and into the existing `integration/native` framework before GA.

**Evidence:** Apollo API ToS (apollo.io/terms/api, reviewed 2026-06-10); existing code paths in `contact-enrichment.service.ts` confirm the shared-key model and the ZoomInfo→Apollo fallback. Competitive: HubSpot and Attio ship enrichment in-box; a CRM with permanently empty fields loses evaluations.


## 2. Jobs To Be Done

**Primary job statement:**
> When I'm working a contact or list that has missing firmographic and contact data, I want to fill in the gaps from my own enrichment provider, so I can act on complete records without breaking my data-provider contract or paying twice.

**Functional dimension:** Auto-fill empty contact/company fields (title, phone, industry, size, revenue, socials) from Apollo using the customer's own Apollo entitlement.
**Emotional dimension:** In control — legitimately sourced data, no surprise credit burn, never overwrites what the team typed.
**Social dimension:** Admin is seen by team and security as running a compliant, properly licensed stack; reps look prepared on every call.

**Hiring criteria** — why a customer connects Apollo:
- They already pay Apollo and want that entitlement working inside SparrowCRM instead of tab-switching.
- One admin connects once via OAuth; the whole workspace benefits, with per-field mapping control.

**Firing criteria** — why they'd abandon it:
- Low match rate → "I connected it and nothing happened."
- Credit surprises → a bulk import drains thousands of Apollo credits overnight.
- Enriched values overwrite data they deliberately edited → trust gone.
- Connection silently expires and enrichment stops without anyone noticing.

## 3. Goals

1. **Self-serve connection:** an admin connects their Apollo account via OAuth in under 2 minutes with zero SparrowCRM involvement; ≥70% of users who open the connect screen reach Connected.
2. **Zero SparrowCRM credit coupling:** Apollo enrichment is billed by Apollo directly; SparrowCRM meters zero enrichment credits for Apollo-sourced calls, and no settings/billing copy claims otherwise.
3. **Automatic completeness:** in connected workspaces, ≥70% of newly created (non-import) contacts with an email or LinkedIn URL get ≥3 fields filled within 5 minutes.
4. **Trustworthy writes:** zero incidents of enrichment overwriting a manually entered value (hard invariant); every enriched field answers "where did this come from?" in one glance.
5. **Provider-agnostic core:** the enrichment path resolves credentials and mapping per account so the next BYO provider is additive, not a rewrite.

## 4. Non-Goals

1. **Native (SparrowCRM-licensed) enrichment data** — compliance decision, not a deferral. We do not resell B2B data.
2. **API-key connect flow in v1** — OAuth only. *(Decision 2026-06-10; reverses v1 draft.)* Credential storage stays auth-agnostic so an API-key variant (P2) needs no schema change.
3. **Multiple enrichment integrations at once** — if Apollo is connected, ZoomInfo/others cannot be connected simultaneously. One enrichment provider per workspace; multi-provider waterfall is future. *(Decision 2026-06-10 — recorded.)*
4. **AI-enrichment interplay** — AI enrichment is not shipping alongside this; precedence rules deferred until it does. *(Decision 2026-06-10 — recorded.)*
5. **Ongoing dynamic field creation** — field auto-creation happens **once at install** (missing default-mapping fields are created automatically with the correct type); enrichment never creates new fields after that. Admins create any additional custom fields manually. *(Revised 2026-06-10: install-time auto-create IS in scope; continuous auto-create is not.)*
6. **Auto-enriching bulk imports** — imports are excluded from "Auto enrich all records" to protect customers' Apollo credit pools. *(Decision 2026-06-10. P1: post-import prompt with credit estimate.)*
7. **Personal email reveal** — GDPR-blocked for EU persons; work emails only in v1.

## 5. User Stories

**Primary persona — Workspace Admin (Sales Ops / RevOps)**
1. As an admin, I want to connect our Apollo account via OAuth from the Integrations page, so that the whole team's records enrich from the account we already pay for.
2. As an admin, I want to map Apollo fields to SparrowCRM fields with a per-field overwrite rule, so that enrichment never destroys data my team entered.
3. As an admin, I want to see connection status (who connected, when, healthy/expired), get alerted when it breaks, and reconnect in one click, so that enrichment never silently stops.
4. As an admin, I want to remove the integration and be told exactly what happens (data stays, mapping deleted, enrichment stops), so that disconnecting isn't scary.

**Secondary persona — Sales Rep**
5. As a rep, I want new contacts I create to be enriched automatically within minutes, so that I can qualify without manual research.
6. As a rep, I want a source badge and timestamp on enriched fields, so that I know what came from Apollo and how fresh it is.
7. As a rep, when Apollo returns no match, I want a quiet "no additional data found" state, so that I'm not misled into thinking something broke.

**Edge cases**
8. As a rep, when Apollo is not connected, I should not see the "Enrich with Apollo" action at all — enrichment actions and badges render only when an enrichment integration is connected, so a setup gap never looks like a broken feature.
9. As a non-admin Apollo user attempting to authorize, I want a clear "you need Apollo admin permissions" message (Apollo redirects back with `status_code=403`), so that I escalate instead of retrying.
10. As an admin, when an enrichment value fails validation for the mapped field type, I want it skipped and logged per record, so that bad data never lands silently.

## 6. Requirements

### Must-Have (P0)

- **Register Apollo as an integration provider.** Apollo appears in the Integrations marketplace under Data Enrichment, using the existing `integration/native` framework (`INTEGRATION_PROVIDER`, `INTEGRATION_PROVIDER_MAP`, `INTEGRATION_REDIRECT_MAP`). Card subtext: "Enrich contacts and companies with verified B2B data from Apollo io."
  - Given an admin on Integrations, When they view the Integrations page, Then they see the Apollo card with a Connect action; when connected, the card shows a Connected badge and clicking the card opens the manage page (Connections / Configuration).
  - Given Apollo is connected, When the admin opens any other enrichment provider's card, Then Connect is disabled with "Only one enrichment integration can be active." *(single-provider rule)*

- **Connect via OAuth 2.0 (workspace-level, admin-only).** Authorization-code flow against Apollo's OAuth server; tokens stored encrypted as account-level integration credentials (`user-integrations` / `IntegrationDetails`), never returned to the client.
  - Given an admin clicks Connect with Apollo, When they authorize in Apollo, Then the Connections tab shows `Active · Connected by [user] on [date]`.
  - Given a non-admin Apollo user authorizes, When Apollo redirects back with `status_code=403`, Then SparrowCRM shows "You need admin permissions in Apollo to connect this integration."
  - Given any user's record triggers enrichment, Then calls use the single workspace token — no per-user auth (this is shared CRM data, not personal data like email/calendar).
  - **Dependency (external, gating):** Apollo partner/OAuth registration approval. **Scopes are locked at registration** — finalize scope list before submitting.

- **Field mapping with overwrite rules.** Mapping screen (Contacts / Companies tabs): Apollo field → existing SparrowCRM field (type-compatible options only) → overwrite rule: `Fill empty values only` (default) / `Fill empty and overwrite existing` / `Do not fill`.
  - Given OAuth completes, When the admin lands on the Configuration page, Then the default mapping for **both Contacts and Companies is already applied and active** — no save required; enrichment works immediately with defaults. The mapping screen exists to review and change, not to set up.
  - Given a default-mapping target field does not exist in the workspace, When the integration is installed, Then the field is **auto-created with the correct type** (per the validation matrix) and tagged as an enrichment field — install-time only; enrichment never creates fields after install.
  - Given the default mapping is active, When the admin edits any row (target field or overwrite rule), Then the change applies to future enrichment only.
  - Given a value manually entered by a user, When enrichment runs under any rule, Then the manual value is never replaced — "overwrite existing" applies only to previously enriched values. *(Locked guardrail; dropdown helper text states this.)*
  - Mapping changes apply to future enrichment only.
  - *Attribute picker (SparrowCRM field column):* searchable dropdown with "Search Attributes" input; a **Suggested** match on top (best type/name match for the Apollo field); below it, attribute **groups with counts** (Name 3 ›, Contact info 5 ›, Company 7 ›…) that expand on click; typing switches to flat results showing each attribute's group path. The **overwrite-rule dropdown stays flat** (3 options only).
  - *Caution dialog — overwrite rule:* Given an admin selects `Fill empty and overwrite existing`, Then a confirm dialog appears ("Apollo will replace values it previously enriched when newer data is found. Values your team entered manually are never overwritten.") — the rule applies only on confirm.
  - *Add enrichment field ("+" button):* Given the admin clicks **+ Add enrichment field** below the mapping table, Then a dropdown lists the Apollo io fields not yet mapped for that object (from the validation matrix, e.g., Headline, Photo URL, Time zone, Email status for contacts; Founded year, Total funding, Keywords, Technologies for companies). Selecting one appends a row tagged "Added" with a "Select custom field" target picker (existing fields incl. custom) and a default `Fill empty values only` rule; added rows can be removed (✕). Fields already in the default mapping don't appear in the list. Unmappable nested fields (employment_history, funding_events) stay excluded.
  - Validation at write time follows the field-validation matrix (`apollo-enrichment-field-validations.md`); invalid values are skipped and logged per record, never partially written.

- **Error visibility (mapping + enrichment).** Errors are always shown to the user — never log-only.
  - *Mapping-time:* largely prevented by design — default fields are auto-created with correct types at install, and the field dropdown only offers type-compatible targets when remapping. Residual case: a mapped field's type is changed later by an admin → that row shows an inline error with the matrix error tag and must be remapped or set to "Do not fill" before saving.
  - *Enrichment-time (per record):* Given an enrichment run where one or more values fail validation (data mismatch with the mapped field), When a user opens the record, Then an error indicator is visible and clicking it opens a dialog listing each failed field, the Apollo value, and the reason; the same details land in the activity entry.
  - *Run-level:* Given an enrichment fails entirely (no match, rate limit, provider error, connection error), Then the record shows the corresponding state ("No match found" / "Enrichment failed — will retry") instead of failing silently.
  - *Modal lifecycle for user-triggered enrichment:* Given a user triggers enrichment (single or bulk), Then it runs in a **modal — loading state and result in the same modal**, never a toast/loader alone. On failure, the modal states **why it failed** (e.g., "No match found — searched with name + company domain") and **how to fix it** ("add a work email or LinkedIn URL"), with a Try again action. On success, the modal shows fields filled and each skipped field with its reason.

  **Apollo field validation reference** (validations run at enrichment time, Apollo value → mapped field; full matrix in `apollo-enrichment-field-validations.md`). Global rules: null/empty Apollo value → skipped, "Empty values will be skipped."; array → scalar field → first compatible item, else "Invalid value type for this field."

  *Contacts (`people/match`):*

  | Apollo Field | CRM Field Type | Key Validations | Error Tag | Edit Control |
  |---|---|---|---|---|
  | first_name / last_name / name | Text | Max length, invalid characters, formula injection | "This field is required." | Text field |
  | title / headline | Text | Max length, emoji stripping (Apollo titles contain emojis), truncation flag | "This field is required." | Text field |
  | email | Email | Format, multiple emails (contact_emails[] → first verified), duplicates, email_status ≠ verified flag | "Invalid email" | Text field + "Add value" + "+ Create new email" |
  | phone_numbers[].sanitized_number | Phone | Format, length, country code, multiple numbers, DNC flag as metadata | "Invalid Phone" | Text field + "Add value" |
  | linkedin_url / twitter_url / facebook_url / github_url / photo_url | URL | Valid URL + platform-specific pattern (linkedin.com/in/, etc.) | "Enter a valid URL." | Text field |
  | city / state / country | Location | Valid location, country recognition | "Enter a valid location." | Searchable dropdown ("Search values") |
  | time_zone | Select | Option exists (IANA tz) | "Option not exist" | Searchable dropdown ("Search options") |
  | seniority | Select | Option exists (founder/c_suite/vp/director/manager/senior/entry), archived | "Option not exist" | Searchable dropdown ("Search options") |
  | departments / subdepartments / functions | Multi-select | Option exists, duplicates, too many | "Option not exist" | Searchable dropdown ("Search options") |
  | email_status | Select | Option exists (verified/guessed/unavailable) | "Option not exist" | Searchable dropdown ("Search values") |
  | is_likely_to_engage | Yes/No | Boolean value recognition | "Option not exist" | Searchable dropdown ("Search values") |
  | organization (embedded) | Relationship | Record found (match by domain), multiple matches, duplicate association | "No matching record found." | Searchable dropdown |

  *Companies (`organizations/enrich` or embedded org object):*

  | Apollo Field | CRM Field Type | Key Validations | Error Tag | Edit Control |
  |---|---|---|---|---|
  | name | Text | Max length, invalid characters, formula injection | "This field is required." | Text field |
  | primary_domain | Domain | Valid domain, email-in-domain, URL-in-domain, public domain rejected (gmail.com etc.) | "Invalid domain" | Text field |
  | website_url / blog_url / linkedin_url / twitter_url / facebook_url / crunchbase_url / angellist_url / logo_url | URL | Valid URL + platform pattern | "Enter a valid URL." | Text field |
  | phone / primary_phone | Phone | Format, length, country code | "Invalid Phone" | Text field + "Add value" |
  | industry | Select | Option exists (Apollo taxonomy → our options), archived | "Option not exist" | Searchable dropdown ("Search options") |
  | industries / secondary_industries / languages | Multi-select | Option exists, duplicates | "Option not exist" | Searchable dropdown ("Search options") |
  | keywords | Multi-select | Option exists (auto-create capped 25 — open Q7), duplicates | "Option not exist" | Searchable dropdown ("Search options") |
  | technology_names | Multi-select | Option exists (auto-create capped 50 — open Q7), duplicates | "Option not exist" | Searchable dropdown ("Search options") |
  | estimated_num_employees / retail_location_count / alexa_ranking | Number | Numeric, range, negative rejected | "Invalid number" | Text field |
  | founded_year | Number | Numeric, range 1600–current year | "Invalid number" | Text field |
  | annual_revenue / total_funding | Currency | Amount, USD source (convert or label — open Q6), unsupported currency | "Invalid Currency" | Text field |
  | latest_funding_round_date | Date | ISO 8601 format, impossible date | "Invalid date" | Calendar date picker |
  | latest_funding_stage | Select | Option exists (Seed/Series A–E/IPO/Other) | "Option not exist" | Searchable dropdown ("Search options") |
  | street_address / raw_address / postal_code / publicly_traded_symbol | Text | Max length, invalid characters | "This field is required." | Text field |
  | city / state / country | Location | Valid location, ISO country recognition | "Enter a valid location." | Searchable dropdown ("Search values") |
  | seo_description / short_description | Text | Max length (long text), truncation flag, formula injection | "This field is required." | Text field |
  | publicly_traded_exchange | Select | Option exists, archived | "Option not exist" | Searchable dropdown ("Search options") |
  | owned_by_organization_id | Relationship | Record found, multiple matches, duplicate association | "No matching record found." | Searchable dropdown |

  *Not mappable in v1 (raw payload panel only):* employment_history[], funding_events[], current_technologies[] (use technology_names), departmental_head_count, intent/org-chart meta fields.

  **Current code-level mapping (default mapping baseline).** These are the fields enrichment already writes today — `CONTACT_ENRICHMENT_OUTPUT_FIELDS` in `src/modules/intelligence/ai-insights/constants/contact-enrichment.constants.ts`, populated via `transformApolloResponse()` in `contact-enrichment-private.service.ts`. The auto-applied default mapping must cover these 22 fields, sourced from the Apollo response as follows:

  | SparrowCRM field (code) | Apollo source field |
  |---|---|
  | firstName | person.first_name |
  | lastName | person.last_name |
  | phone | person.contact.sanitized_phone / phone_numbers[0] |
  | jobTitle | person.title |
  | email | person.email |
  | country | person.country |
  | city | person.city |
  | jobFunction | person.functions[0] |
  | externalUrls | person.linkedin_url, twitter_url, facebook_url, github_url |
  | managementLevel | person.seniority |
  | companyName | person.organization.name |
  | companyWebsite | person.organization.website_url |
  | companyCountry | person.organization.country |
  | companyState | person.organization.state |
  | companyType | person.organization.publicly_traded_symbol ? public : private (derived) |
  | companyRevenue | person.organization.annual_revenue_printed |
  | companyRevenueNumeric | person.organization.annual_revenue |
  | companyPhone | person.organization.phone / primary_phone |
  | companyEmployeeCount | person.organization.estimated_num_employees |
  | companyEmployeeRange | derived from estimated_num_employees (bucketed) |
  | companyPrimaryIndustry | person.organization.industry |
  | companyIndustries | person.organization.industries |

  *Engineering note:* verify the exact source-field logic against `transformApolloResponse()` — the rows marked "derived" and the externalUrls/phone composition are inferred from the constants list and Apollo response shape, not read line-by-line from the transform.

- **Enrichment engine & triggers.** Triggers configured in Settings → Data Enrichment: `Auto enrich all records` (default) or `Manually enrich selective records`; optional `Continuously enrich existing records` (every 14 days, only records with last engagement ≤ 2 months, default off).
  - Given a record created via manual entry, form, or API/integration, When auto-enrich is on, Then it is enriched within 5 minutes. **Bulk-imported records are excluded.**
  - Given a contact with email or LinkedIn URL, When enrichment runs, Then `people/match` is called with all available identifiers, and the embedded `organization` object enriches the associated company per company mapping — one call, both records, one credit.
  - Given a company with a domain and no contact-driven data, Then `organizations/enrich` is called.
  - Given HTTP 200 with no matched person, Then the record shows `No match found`, nothing is written, and retry waits ≥30 days. *(200 ≠ enriched — assert on payload, not status.)*
  - Per-tenant rate-budget queue with exponential backoff on 429 (reference limit: ~600 calls/hr, plan-dependent); bursts must never brick the connection.
  - Settings copy must say enrichment uses **the customer's Apollo credits** — remove "All enrichments use AI credits."

- **Provenance & visibility.** Every enriched value stores source (`apollo`), `enriched_at`, and a raw-payload reference.
  - Record page shows a source badge + "Enriched [date]" on enriched fields; values render normally in table views.
  - Every enrichment (auto, continuous, or manual) writes an Activity timeline entry on the record: "This record was enriched with Apollo io" + actor (system or user who triggered), timestamp, fields filled, fields skipped + reason. *(Carried from existing spec: all enrichment registers as an Activity change.)*
  - Given a record is enriched, When any user opens its activity log, Then the Apollo enrichment entry is visible with the provider name — enrichment is never an invisible write.
  - Raw payload retained per record; unmappable data (employment history, funding events, tech categories) surfaces in an "Enrichment details" panel, not CRM fields.

- **Remove integration.** Confirm dialog states: enriched values remain on records, mapping config is deleted, all enrichment stops. On confirm, tokens revoked and deleted.

- **Kill the shared-key paths.** Apollo removed from `CONTACT_ENRICHMENT_PROVIDERS` as a platform-key option; the ZoomInfo→Apollo fallback on the platform key is deleted (moot under the single-provider rule).
  - Given the codebase, When searched, Then no customer-facing enrichment path depends on `APOLLO_API_KEY`.

### Nice-to-Have (P1)

- **Manual "Enrich now"** on the record page (visible only when connected), gated by Data Enrichment permissions; respects mapping rules.
  - Given the user clicks Enrich now, Then a modal opens with a loading state ("Enriching [name]… matching with email + company domain"), and the **result renders in the same modal**: success → "N fields filled, M skipped" with each skipped field + reason; failure → why it failed + how to improve matching + Try again.
- **Bulk "Enrich with Apollo"** from table view: select records → More → Enrich with Apollo (shown only when an enrichment integration is connected; gated by the same permissions).
  - Given N records selected, When the user clicks Enrich with Apollo, Then a confirm shows "Enrich N records? Uses your Apollo credits" before running.
  - Given the bulk job runs, Then a **progress modal** shows a live counter ("Enriching records… 2/4"); the modal is dismissible — enrichment continues in the background through the rate-budget queue (no burst 429s).
  - Given the bulk job completes, Then the **same modal shows the summary**: enriched / no match / skipped counts **plus a per-record result list with failure reasons** (e.g., "✗ Lars Nilsen — No match found. Searched with name + domain only; add a work email or LinkedIn URL. Auto-retry in 30 days."). Each enriched record gets its activity entry.
- **Phone enrichment opt-in** (`reveal_phone_number`): webhook receiver (public HTTPS, idempotent, multi-tenant routing); record shows "Phone pending — may take a few minutes".
  - Given the admin turns the toggle on, Then a **caution dialog** confirms first: costs additional Apollo credits per number; numbers arrive asynchronously and may take a few minutes. Toggle activates only on confirm.
- **Caution dialogs for credit-consuming/destructive settings** (all in prototype):
  - *Continuous enrichment toggle on* → confirm: "Runs every 14 days on recently engaged records. Each refresh uses your Apollo credits."
  - *Disconnect* (Connections row kebab) → confirm: "Enrichment stops until someone reconnects. Mapping configuration is kept; enriched values stay on records."
- **Post-import prompt:** "Enrich these N imported records? Uses ~N Apollo credits."
- **Credits-used counter** (this month) on the Connections tab.
- **Cross-links** between Data Enrichment settings and the Apollo integration page; settings show a disabled state with "Connect an enrichment integration" when nothing is connected.

### Future Considerations (P2)

- **Additional BYO providers (ZoomInfo, Clearbit)** behind the single-provider switch → v1 implication: provider-generic credential lookup + provider-tagged raw payload store + mapper interface.
- **Multi-provider waterfall and AI-enrichment precedence** — blocked on AI enrichment shipping; decision deliberately deferred (2026-06-10).
- **API-key auth variant** if OAuth approval stalls or customer plans demand it → v1 implication: auth-agnostic credential storage.
- **Change alerts** ("this field changed since last enrichment") from the original enrichment-agent spec.
- **Personal email reveal** with GDPR gating.

## 7. Success Metrics

**Leading (days–weeks):**
- **Connect completion:** ≥70% of admins who open the connect screen reach Connected (funnel on OAuth flow).
- **Activation:** ≥90% of connected workspaces have ≥1 successful enrichment in week 1 (job logs).
- **Match rate:** ≥60% success / 75% stretch — matched ÷ attempted on records with email or LinkedIn URL; cohort by geography (engine telemetry, weekly).
- **Fields filled per matched record:** median ≥4 / stretch ≥6.
- **Error-state cleanliness:** 0 thrown exceptions from not-connected or no-match paths — all typed states (logs).
- **Silent-failure rate:** <5% of broken connections unnoticed >7 days (health checks vs reconnect timestamps).
- **Overwrite incidents on manual values:** 0 — hard invariant, audit-log alert.

**Lagging (weeks–months):**
- **Connect rate:** ≥30% / stretch 50% of workspaces with Apollo-owning admins connect within 60 days of GA.
- **Data completeness trend:** avg empty fields filled per record, upward from launch baseline.
- **Support tickets** referencing enrichment: <2% of connected workspaces/month.
- **Compliance:** zero Apollo ToS escalations (binary — the core reason for this work).

**Evaluation:** 1 week (instrumentation sanity), 30/60 days (adoption), quarterly (completeness, retention of connected vs non-connected cohorts).

## 8. Open Questions

| # | Question | Owner | Blocking? | Needed by |
|---|----------|-------|-----------|-----------|
| 1 | Apollo partner/OAuth registration: submit + approval ETA. Final scope list (locked once set). | PM (Divi) + Eng | **Yes** | This week |
| 2 | % of target customers on Apollo plans with OAuth/API access (design-partner survey). | PM | **Yes** for GTM sizing, not build | This week |
| 3 | Real match rate on a 100-contact sample from a design partner (geography risk). | PM + Eng (trial key) | **Yes** for goal targets | This week |
| 4 | ZoomInfo: does it stay native, get removed, or become BYO later? Single-provider rule decided; ZoomInfo's own fate isn't. | PM / Legal | No (fallback path is deleted regardless) | Before GA |
| 5 | Does removing Apollo from the credit model change pricing/plan copy mentioning "enrichment credits"? | PM / Growth | No | GA copy freeze |
| 6 | `annual_revenue` arrives in USD — convert to workspace currency or label as USD? | Product / Eng | No | Build |
| 7 | `keywords`/`technology_names`: auto-create Select options (capped) or skip with "Option not exist"? | Product | No | Build |
| 8 | Strip emojis from Apollo titles/headlines? | Design | No | Build |
| 9 | Apollo master-ToS data retention after a customer cancels Apollo — affects disconnect copy. | Legal | No | GA copy freeze |
| 10 | Webhook infra for P1 phone enrichment — own receiver or existing gateway? | Eng | No (P1) | Phase 3 |

## 9. Timeline Considerations

- **Hard gate:** native Apollo on a shared key cannot ship publicly (ToS exposure) — this conversion blocks GA.
- **External dependency:** OAuth-only decision means the connect flow cannot ship before Apollo approves partner registration. Submit immediately; no SLA exists.
- **Phasing:**
  - **Phase 1 (no Apollo approval needed):** mapping UI + validation matrix, enrichment engine + triggers + queue, provenance/badges, activity logging, shared-key removal — built and tested against a trial API key internally; auth layer swaps to OAuth tokens later.
  - **Phase 2 (on OAuth approval):** connect flow, token lifecycle, health states, GA.
  - **Phase 3 (fast follow):** P1 set — manual enrich, phone webhook, import prompt, credits counter, cross-links.
- **Design dependency: resolved.** The clickable prototype (`apollo-integration-wireframe.html`) covers all screens and states: integrations list (connect/connected/expired/single-provider lock), Apollo detail (Connections empty/active/expired, OAuth modal incl. 403, Remove confirm), Configuration (grouped attribute picker, overwrite-rule caution, residual mapping error row, phone toggle caution), contact record (source badges, enrich-now modal with success/failure, no-match, phone-pending, connection-paused banner), contacts table (bulk enrich confirm → progress modal → per-record summary with failure reasons), and Data Enrichment settings (triggers, continuous caution, disconnected gate). Hi-fi design can trace it 1:1.
- **Scope guard:** any P0 addition requires a P0 removal or a date move. Parking lot = P2.
