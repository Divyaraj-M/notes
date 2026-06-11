---
owner: Divyaraj Murugan
feature: "[[Integrations]]"
version: 1
status: Done
priority: Medium
tags:
  - sparrowcrm/features/integrations/apolloio
---
## 1. Problem Statement

Today SparrowCRM treats Apollo as a **native enrichment provider**: the server calls Apollo using one SparrowCRM-owned API key (`CONTACT_ENRICHMENT_CONFIG.APOLLO.APOLLO_API_KEY`) and meters every enrichment against the customer's SparrowCRM enrichment-credit pool. Apollo also acts as the **silent fallback** for ZoomInfo — when ZoomInfo returns no match, `enrichContactWithZoominfo()` calls `enrichContactWithApollo()` on the same shared key.

This model isn't viable. Apollo's API ToS (§2 "internal business purposes", §3 third-party integration authorization) do not permit a platform to enrich third parties' records on a single shared account and resell that as credits. To use Apollo legitimately, **each customer must bring their own Apollo account**. We're pre-launch, so there is no data to migrate — but enrichment cannot ship in its current shape. We need to move Apollo out of native enrichment and into the existing `integration/native` framework before GA.

**Evidence:** Apollo API ToS (apollo.io/terms/api, reviewed 2026-06-10); existing code paths in `contact-enrichment.service.ts` confirm the shared-key model and the ZoomInfo→Apollo fallback. Competitive: HubSpot and Attio ship enrichment in-box; a CRM with permanently empty fields loses evaluations.

## 2. Jobs To Be Done

**Primary job statement:**

> When I'm working a contact or list that has missing firmographic and contact data, I want to fill in the gaps from my own enrichment provider, so I can act on complete records without breaking my data-provider contract or paying twice.

**Functional dimension:** Auto-fill empty contact/company fields (title, phone, industry, size, revenue, socials) from Apollo using the customer's own Apollo entitlement. **Emotional dimension:** In control — legitimately sourced data, no surprise credit burn, never overwrites what the team typed. **Social dimension:** Admin is seen by team and security as running a compliant, properly licensed stack; reps look prepared on every call.

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
2. **API-key connect flow in v1** — OAuth only. _(Decision 2026-06-10; reverses v1 draft.)_ Credential storage stays auth-agnostic so an API-key variant (P2) needs no schema change.
3. **Multiple enrichment integrations at once** — if Apollo is connected, ZoomInfo/others cannot be connected simultaneously. One enrichment provider per workspace; multi-provider waterfall is future. _(Decision 2026-06-10 — recorded.)_
4. **AI-enrichment interplay** — AI enrichment is not shipping alongside this; precedence rules deferred until it does. _(Decision 2026-06-10 — recorded.)_
5. **Auto-creating CRM fields from Apollo fields** — mapping targets existing fields only; admins create custom fields manually first. Prevents schema bloat.
6. **Auto-enriching bulk imports** — imports are excluded from "Auto enrich all records" to protect customers' Apollo credit pools. _(Decision 2026-06-10. P1: post-import prompt with credit estimate.)_
7. **Personal email reveal** — GDPR-blocked for EU persons; work emails only in v1.

## 5. User Stories

**Primary persona — Workspace Admin (Sales Ops / RevOps)**

1. As an admin, I want to connect our Apollo account via OAuth from the Integrations page, so that the whole team's records enrich from the account we already pay for.
2. As an admin, I want to map Apollo fields to SparrowCRM fields with a per-field overwrite rule, so that enrichment never destroys data my team entered.
3. As an admin, I want to see connection status (who connected, when, healthy/expired), get alerted when it breaks, and reconnect in one click, so that enrichment never silently stops.
4. As an admin, I want to remove the integration and be told exactly what happens (data stays, mapping deleted, enrichment stops), so that disconnecting isn't scary.

**Secondary persona — Sales Rep** 5. As a rep, I want new contacts I create to be enriched automatically within minutes, so that I can qualify without manual research. 6. As a rep, I want a source badge and timestamp on enriched fields, so that I know what came from Apollo and how fresh it is. 7. As a rep, when Apollo returns no match, I want a quiet "no additional data found" state, so that I'm not misled into thinking something broke.

**Edge cases** 8. As a rep, when Apollo is not connected and I try to enrich, I want a "Connect Apollo" prompt instead of an error, so that I know it's a setup state, not a bug. 9. As a non-admin Apollo user attempting to authorize, I want a clear "you need Apollo admin permissions" message (Apollo redirects back with `status_code=403`), so that I escalate instead of retrying. 10. As an admin, when an enrichment value fails validation for the mapped field type, I want it skipped and logged per record, so that bad data never lands silently.

## 6. Requirements

### Must-Have (P0)

- **Register Apollo as an integration provider.** Apollo appears in the Integrations marketplace under Data Enrichment, using the existing `integration/native` framework (`INTEGRATION_PROVIDER`, `INTEGRATION_PROVIDER_MAP`, `INTEGRATION_REDIRECT_MAP`). Card subtext: "Enrich contacts and companies with verified B2B data from Apollo io."
    
    - Given an admin on Integrations, When they view the marketplace, Then they see the Apollo card with Connect; when connected, a Connected badge + Manage.
    - Given Apollo is connected, When the admin opens any other enrichment provider's card, Then Connect is disabled with "Only one enrichment integration can be active." _(single-provider rule)_
- **Connect via OAuth 2.0 (workspace-level, admin-only).** Authorization-code flow against Apollo's OAuth server; tokens stored encrypted as account-level integration credentials (`user-integrations` / `IntegrationDetails`), never returned to the client.
    
    - Given an admin clicks Connect with Apollo, When they authorize in Apollo, Then the Connections tab shows `Active · Connected by [user] on [date]`.
    - Given a non-admin Apollo user authorizes, When Apollo redirects back with `status_code=403`, Then SparrowCRM shows "You need admin permissions in Apollo to connect this integration."
    - Given any user's record triggers enrichment, Then calls use the single workspace token — no per-user auth (this is shared CRM data, not personal data like email/calendar).
    - **Dependency (external, gating):** Apollo partner/OAuth registration approval. **Scopes are locked at registration** — finalize scope list before submitting.
- **Token lifecycle & connection health.** Apollo access tokens expire every 30 days; refresh tokens are single-use (old pair revoked on refresh).
    
    - Given a token near expiry, When the refresh job runs, Then refresh executes behind a per-tenant lock (concurrent refresh must be impossible).
    - Given refresh fails permanently, Then card + Connections tab show an error state with Reconnect, admins are notified, and pending enrichment jobs are skipped (not queued infinitely) with the skip logged.
- **Field mapping with overwrite rules.** Mapping screen (Contacts / Companies tabs): Apollo field → existing SparrowCRM field (type-compatible options only) → overwrite rule: `Fill empty values only` (default) / `Fill empty and overwrite existing` / `Do not fill`.
    
    - Given a fresh connection, When the admin lands on Mapping, Then a suggested default mapping is pre-populated so "save and leave" works.
    - Given a value manually entered by a user, When enrichment runs under any rule, Then the manual value is never replaced — "overwrite existing" applies only to previously enriched values. _(Locked guardrail; dropdown helper text states this.)_
    - Mapping changes apply to future enrichment only.
    - Validation at write time follows the field-validation matrix (`apollo-enrichment-field-validations.md`); invalid values are skipped and logged per record, never partially written.
- **Enrichment engine & triggers.** Triggers configured in Settings → Data Enrichment: `Auto enrich all records` (default) or `Manually enrich selective records`; optional `Continuously enrich existing records` (every 14 days, only records with last engagement ≤ 2 months, default off).
    
    - Given a record created via manual entry, form, or API/integration, When auto-enrich is on, Then it is enriched within 5 minutes. **Bulk-imported records are excluded.**
    - Given a contact with email or LinkedIn URL, When enrichment runs, Then `people/match` is called with all available identifiers, and the embedded `organization` object enriches the associated company per company mapping — one call, both records, one credit.
    - Given a company with a domain and no contact-driven data, Then `organizations/enrich` is called.
    - Given HTTP 200 with no matched person, Then the record shows `No match found`, nothing is written, and retry waits ≥30 days. _(200 ≠ enriched — assert on payload, not status.)_
    - Per-tenant rate-budget queue with exponential backoff on 429 (reference limit: ~600 calls/hr, plan-dependent); bursts must never brick the connection.
    - Settings copy must say enrichment uses **the customer's Apollo credits** — remove "All enrichments use AI credits."
- **Provenance & visibility.** Every enriched value stores source (`apollo`), `enriched_at`, and a raw-payload reference.
    
    - Record page shows a source badge + "Enriched [date]" on enriched fields; values render normally in table views.
    - Every enrichment writes an Activity entry: fields filled, fields skipped + reason. _(Carried from existing spec.)_
    - Raw payload retained per record; unmappable data (employment history, funding events, tech categories) surfaces in an "Enrichment details" panel, not CRM fields.
- **Remove integration.** Confirm dialog states: enriched values remain on records, mapping config is deleted, all enrichment stops. On confirm, tokens revoked and deleted.
    
- **Kill the shared-key paths.** Apollo removed from `CONTACT_ENRICHMENT_PROVIDERS` as a platform-key option; the ZoomInfo→Apollo fallback on the platform key is deleted (moot under the single-provider rule).
    
    - Given the codebase, When searched, Then no customer-facing enrichment path depends on `APOLLO_API_KEY`.

### Nice-to-Have (P1)

- **Manual "Enrich now"** on the record page, gated by Data Enrichment permissions; respects mapping rules.
- **Phone enrichment opt-in** (`reveal_phone_number`): webhook receiver (public HTTPS, idempotent, multi-tenant routing); record shows "Phone pending — may take a few minutes"; toggle copy warns of additional Apollo credits.
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

|#|Question|Owner|Blocking?|Needed by|
|---|---|---|---|---|
|1|Apollo partner/OAuth registration: submit + approval ETA. Final scope list (locked once set).|PM (Divi) + Eng|**Yes**|This week|
|2|% of target customers on Apollo plans with OAuth/API access (design-partner survey).|PM|**Yes** for GTM sizing, not build|This week|
|3|Real match rate on a 100-contact sample from a design partner (geography risk).|PM + Eng (trial key)|**Yes** for goal targets|This week|
|4|ZoomInfo: does it stay native, get removed, or become BYO later? Single-provider rule decided; ZoomInfo's own fate isn't.|PM / Legal|No (fallback path is deleted regardless)|Before GA|
|5|Does removing Apollo from the credit model change pricing/plan copy mentioning "enrichment credits"?|PM / Growth|No|GA copy freeze|
|6|`annual_revenue` arrives in USD — convert to workspace currency or label as USD?|Product / Eng|No|Build|
|7|`keywords`/`technology_names`: auto-create Select options (capped) or skip with "Option not exist"?|Product|No|Build|
|8|Strip emojis from Apollo titles/headlines?|Design|No|Build|
|9|Apollo master-ToS data retention after a customer cancels Apollo — affects disconnect copy.|Legal|No|GA copy freeze|
|10|Webhook infra for P1 phone enrichment — own receiver or existing gateway?|Eng|No (P1)|Phase 3|

## 9. Timeline Considerations

- **Hard gate:** native Apollo on a shared key cannot ship publicly (ToS exposure) — this conversion blocks GA.
- **External dependency:** OAuth-only decision means the connect flow cannot ship before Apollo approves partner registration. Submit immediately; no SLA exists.
- **Phasing:**
    - **Phase 1 (no Apollo approval needed):** mapping UI + validation matrix, enrichment engine + triggers + queue, provenance/badges, activity logging, shared-key removal — built and tested against a trial API key internally; auth layer swaps to OAuth tokens later.
    - **Phase 2 (on OAuth approval):** connect flow, token lifecycle, health states, GA.
    - **Phase 3 (fast follow):** P1 set — manual enrich, phone webhook, import prompt, credits counter, cross-links.
- **Design dependency:** two screen sets still unwireframed — connect-flow states (empty/connecting/403) and record-page enrichment states (badge, enriching, no-match, phone-pending). Needed before Phase 1 ends.
- **Scope guard:** any P0 addition requires a P0 removal or a date move. Parking lot = P2.