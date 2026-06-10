Source: Apollo API docs (June 2026)

- People Enrichment: `POST /api/v1/people/match` — https://docs.apollo.io/reference/people-enrichment
- Organization Enrichment: `GET /api/v1/organizations/enrich` — https://docs.apollo.io/reference/organization-enrichment

Use this to design the SparrowCRM field-mapping config (Apollo field → CRM attribute).

---

## 1. People Enrichment (Contacts) — `people/match`

### Identity & Profile

| Apollo field     | Type   | Example                                        | CRM mapping candidate   |
| ---------------- | ------ | ---------------------------------------------- | ----------------------- |
| `id`             | string | Apollo person ID                               | store as provenance ref |
| `first_name`     | string | Tim                                            | Contact first name      |
| `last_name`      | string | Zheng                                          | Contact last name       |
| `name`           | string | Tim Zheng                                      | Full name               |
| `title`          | string | Founder & CEO                                  | Job title               |
| `headline`       | string | Founder & CEO at Apollo                        | Headline/bio            |
| `photo_url`      | string | LinkedIn photo URL                             | Avatar                  |
| `seniority`      | string | founder / c_suite / vp / director / manager... | Seniority               |
| `departments`    | array  | ["c_suite"]                                    | Department              |
| `subdepartments` | array  | ["executive", "founder"]                       | —                       |
| `functions`      | array  | ["entrepreneurship"]                           | Job function            |
|                  |        |                                                |                         |

### Contact Info

| Apollo field                    | Type        | Notes                                                                                                                                         |
| ------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`                         | string      | Work email                                                                                                                                    |
| `email_status`                  | string      | verified / guessed / unavailable                                                                                                              |
| `extrapolated_email_confidence` | number/null | Confidence score for guessed emails                                                                                                           |
| Personal emails                 | —           | Only returned if `reveal_personal_emails=true`; **blocked for GDPR-region persons**                                                           |
| Phone numbers                   | array       | Only via `reveal_phone_number=true` + **webhook (async delivery)**; includes `raw_number`, `sanitized_number`, `type`, `status`, `dnc_status` |

### Location

| Apollo field | Type                       |
| ------------ | -------------------------- |
| `city`       | string                     |
| `state`      | string                     |
| `country`    | string                     |
| `time_zone`  | string (on contact object) |

### Social

| Apollo field   |
| -------------- |
| `linkedin_url` |
| `twitter_url`  |
| `facebook_url` |
| `github_url`   |

### Employment

| Apollo field         | Type   | Notes                                                                                                                                    |
| -------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `employment_history` | array  | Per job: `organization_name`, `organization_id`, `title`, `start_date`, `end_date`, `current`, `degree`, `major` (education entries too) |
| `organization_id`    | string | Current employer's Apollo org ID                                                                                                         |

### Signals / Meta

|Apollo field|Type|Notes|
|---|---|---|
| `is_likely_to_engage` |boolean|Engagement likelihood signal|
| `intent_strength` / `show_intent` |—|Intent data (plan-dependent)|
| `revealed_for_current_team` |boolean|—|

### Embedded `organization` object

The person response embeds the full company object (same fields as Organization Enrichment below) — **one contact enrichment call also gives you the company data for free.**

### Match inputs (what we can send)

`first_name`, `last_name`, `name`, `email`, `hashed_email` (MD 5/SHA-256), `organization_name`, `domain`, `id`, `linkedin_url`. More inputs = better match rate.

---

## 2. Organization Enrichment (Companies) — `organizations/enrich`

Input: `domain` (required, e.g. `apollo.io`).

### Identity

|Apollo field|Type|Example|
|---|---|---|
| `id` |string|Apollo org ID|
| `name` |string|Apollo.io|
| `primary_domain` |string|apollo.io|
| `website_url` |string|http://www.apollo.io|
| `logo_url` |string|company logo|
| `founded_year` |integer|2015|
| `languages` |array|—|

### Classification

|Apollo field|Type|Example|
|---|---|---|
| `industry` |string|information technology & services|
| `industries` |array|—|
| `secondary_industries` |array|—|
| `keywords` |array|["sales engagement", "lead generation", ...]|

### Size & Financials

|Apollo field|Type|Example|
|---|---|---|
| `estimated_num_employees` |integer|1600|
| `departmental_head_count` |object|per-dept counts: engineering, sales, marketing, support, finance, legal, HR, ops, etc. (19 depts)|
| `annual_revenue` |integer|100000000|
| `annual_revenue_printed` |string|"100 M"|
| `retail_location_count` |integer|—|
| `publicly_traded_symbol` / `publicly_traded_exchange` |string|for public cos|
| `alexa_ranking` |integer|web traffic rank|

### Funding

|Apollo field|Type|Notes|
|---|---|---|
| `total_funding` / `total_funding_printed` |int / string|251200000 / "251.2 M"|
| `latest_funding_stage` |string|Series D|
| `latest_funding_round_date` |string|ISO date|
| `funding_events` |array|per round: `type`, `date`, `amount`, `currency`, `investors`, `news_url` |

### Location & Contact

|Apollo field|Type|
|---|---|
| `raw_address` |string (full address)|
| `street_address` |string|
| `city` / `state` / `postal_code` / `country` |string|
| `phone` / `primary_phone` |corporate phone|

### Social & Web

|Apollo field|
|---|
| `linkedin_url` |
| `twitter_url` |
| `facebook_url` |
| `blog_url` |
| `angellist_url` |
| `crunchbase_url` |

### Descriptions

|Apollo field|Notes|
|---|---|
| `seo_description` |short, meta-style|
| `short_description` |longer company blurb|

### Tech Stack

|Apollo field|Type|Notes|
|---|---|---|
| `technology_names` |array|flat list ("Salesforce", "Stripe", "Hubspot"...)|
| `current_technologies` |array|objects with `name` + `category` (CRM, Payments, Hosting...)|

### Hierarchy

|Apollo field|Notes|
|---|---|
| `suborganizations` / `num_suborganizations` |subsidiaries|
| `owned_by_organization_id` |parent org|

---

## 3. Implementation notes

- **One call, both records:** people/match embeds the full organization object → enriching a contact can also enrich its company without a second call/credit.
- **Phone numbers are async:** `reveal_phone_number=true` requires a public HTTPS `webhook_url`; Apollo delivers numbers minutes later. Our enrichment job must handle this second leg (idempotent webhook receiver).
- **GDPR:** Apollo will not return personal emails for persons in GDPR regions.
- **Credits:** every enrichment call consumes the customer's Apollo credits; personal emails/phones consume extra.
- **Rate limit example:** 600 calls/hour for people/match (plan-dependent) — returns 429 with message. Bulk variants (up to 10 records/call) exist for both endpoints.
- **No match ≠ error:** a 200 can come back with no enrichment if inputs were too vague — send email or linkedin_url + domain whenever available.

## 4. Suggested default mapping (v 1)

**Contact:** first_name, last_name, title, email (+email_status badge), linkedin_url, city, state, country, seniority, department, photo_url **Company:** name, primary_domain, logo_url, industry, estimated_num_employees, annual_revenue_printed, total_funding_printed, latest_funding_stage, phone, street_address, city, state, country, linkedin_url, short_description, technology_names

Everything else (employment_history, funding_events, departmental_head_count, keywords, tech categories) → keep in the raw enrichment payload store, surface in an "Enrichment details" panel rather than mapping to CRM attributes.