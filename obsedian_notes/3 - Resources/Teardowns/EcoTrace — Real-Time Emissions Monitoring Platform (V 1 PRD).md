 

## 1. Problem Statement

Sustainability, finance, and compliance teams manually assemble emissions data from utility bills, fuel logs, and vendor spend each reporting cycle — a process that typically takes 2-4 weeks of skilled staff time per quarter. Data lives in disconnected spreadsheets and PDFs with no shared source of truth, so numbers are hard to verify and easy to challenge. The cost of not solving this: late or inaccurate disclosures create audit findings and regulatory exposure (CSRD, SEC climate rule, customer ESG questionnaires), erode investor and customer trust, and burn staff time that should go toward actually reducing emissions rather than reconciling them. Auditors increasingly flag "unable to trace source" as their top finding on voluntary climate disclosures — spreadsheets can't produce a defensible audit trail.

## 2. Target Users

- **Sustainability leads** — own the reporting process end-to-end; need one place to see emissions across all sources instead of chasing spreadsheets.
- **Finance & compliance teams** — need numbers they can defend in disclosures and filings, and that reconcile with financial records.
- **Auditors** — need traceability: every reported number linked to a source document, without requesting extra evidence.
- **Operations teams** — own the underlying activity data (energy, fuel, travel, procurement) and need low-friction ways to supply it without extra manual work.

## 3. Jobs To Be Done

**Primary job statement:** When my company needs to report emissions for a compliance deadline or investor request, I want to pull accurate, traceable emissions numbers without weeks of manual reconciliation, so I can submit a defensible report on time and spend my remaining time on reduction, not data wrangling.

- **Functional dimension:** Assemble Scope 1, Scope 2, and key Scope 3 emissions data from multiple sources into one accurate, categorized, exportable report.
- **Emotional dimension:** Confident the numbers are right and won't be challenged by an auditor, regulator, or the board.
- **Social dimension:** Seen by leadership and auditors as running a credible, well-controlled sustainability program — not scrambling every quarter.

**Hiring criteria:**

- Current process (spreadsheets + manual data pulls) is slow, error-prone, and doesn't scale as reporting requirements grow.
- Rising regulatory pressure (CSRD, SEC climate rule, customer ESG questionnaires) makes "good enough" spreadsheets a growing liability.
- Auditors are asking for traceability that spreadsheets structurally can't provide.

**Firing criteria:**

- Data connectors that require constant manual fixing push users back to spreadsheets.
- Numbers that don't reconcile with what finance already reports break trust immediately.
- Anomaly flags that are mostly noise get muted and ignored, defeating the purpose.

## 4. Goals

**User goals**

1. Reduce time to produce a quarterly emissions report by 50%+ vs. the customer's prior manual process.
2. Give sustainability and finance teams a live view of emissions completeness and gaps at any time — not just at reporting deadlines.
3. Let auditors trace any reported number back to its source document without a back-and-forth evidence request.

**Business goals** 4. Reach 80%+ data completeness (known sources connected) for active customers within two quarters of onboarding — the core proof point for expanding into more Scope 3 categories and credits later. 5. Establish weekly active use (not just quarterly log-in at reporting time) as evidence the platform is becoming the system of record.

## 5. Non-Goals

- **Full Scope 3 (all 15 categories)** — data availability is inconsistent industry-wide; attempting all categories now would blow up scope and hurt quality. We'll expand by category based on demand once travel and procurement are solid.
- **Carbon credit purchasing/matching** — recommending offsets before real-time measurement is trusted undermines credibility. This is a deliberate, separate initiative after V 1.
- **Predictive/forecasting emissions models** — needs at least a full year of clean historical data per customer to be reliable; premature before the data pipeline is proven.
- **Multi-framework reporting (CSRD + TCFD + SEC simultaneously)** — too much complexity for V 1. One framework (GHG Protocol-aligned) first; expand once trusted.
- **Automated remediation actions** (e.g., auto-adjusting contracts) — AI recommends in V 1, it doesn't act. Autonomy is a separate, higher-trust-bar initiative.

## 6. User Stories

1. As a **sustainability lead**, I want to connect our utility and fuel data sources in one place so that I don't have to manually collect them every quarter.
2. As a **sustainability lead**, I want a live dashboard of emissions by scope, site, and business unit so that I always know where we stand, not just at report time.
3. As a **sustainability lead**, I want to export an audit-ready report mapped to GHG Protocol categories so that I can submit disclosures without reformatting data.
4. As a **sustainability lead**, I want to see which emission sources are missing or incomplete so that I know exactly what to chase down before a deadline.
5. As a **finance/compliance manager**, I want emissions numbers tied to the same source documents used in financial audits so that ESG and financial disclosures are consistent.
6. As a **compliance manager**, I want an audit trail for every reported number so that I can answer auditor questions without re-collecting evidence.
7. As an **auditor**, I want to click into any number on a report and see its source document and calculation so that I can verify it without requesting additional evidence.
8. As an **operations manager**, I want to upload utility bills or fuel logs without entering data line by line so that reporting doesn't become extra work on top of my job.
9. As an **operations manager**, I want to be notified when my site's data is missing or looks unusual so that I can fix it before it affects a report.
10. _(Edge case)_ As a **sustainability lead**, I want a clear "unmapped data" queue so that data the AI couldn't confidently categorize doesn't silently disappear from the report.
11. _(Edge case)_ As a **finance manager**, I want a clear error and retry option when a data connector sync fails so that I know immediately rather than discovering a gap at report time.
12. _(Edge case)_ As a **first-time user**, I want an empty-state view that clearly shows which data sources still need to be connected so that I know how to get to a complete picture.

## 7. Requirements

**P 0 — Must-Have**

- **Data connectors**: bill/energy upload + API integration for 3-5 common providers; fuel/fleet import; spend-based Scope 3 estimate for travel and procurement.
    - _AC:_ Given a supported provider, when connected via API, data syncs on a defined schedule. Given an unsupported provider, when a CSV/PDF is uploaded, the system extracts and maps line items without manual re-entry.
- **AI document extraction**: pull usage/spend data from PDFs, invoices, CSVs.
    - _AC:_ Given a bill upload, when extraction completes, extracted fields (usage, cost, date, provider) are shown for user confirmation before being added to totals.
- **AI data mapping**: match incoming data to the correct emission factor/category; route low-confidence matches for human review.
    - _AC:_ Given an incoming record, when mapping confidence is below threshold, it appears in an "unmapped" queue rather than being silently included or dropped.
- **Anomaly detection**: flag data points that deviate significantly (e.g., 3 x) from historical patterns.
    - _AC:_ Given a new data point, when it exceeds the deviation threshold vs. the site's trailing average, it's flagged in a review queue with the deviation shown.
- **Emissions dashboard**: live view by source, scope, site, and business unit, with last-sync timestamp per source.
- **Audit trail**: every data point traceable to source document, timestamp, and edit history.
    - _AC:_ Given any reported number, when clicked, the source document and calculation are displayed.
- **One-click audit-ready export**: PDF/CSV mapped to GHG Protocol categories.
    - _AC:_ Export includes only fully mapped, reviewed data; unresolved items are excluded and listed separately as "pending."
- **AI next-action recommendations**: suggested causes for anomalies and top sources to target for reduction.
    - _AC:_ Recommendations are advisory only — no automated action is taken without explicit user approval.

**P 1 — Should-Have (fast follows)**

- Role-based permissions (view-only auditor role vs. edit role for ops/sustainability)
- Scheduled report generation and email delivery
- Additional native connectors beyond the initial 3-5 providers
- Configurable anomaly thresholds per site/customer

**P 2 — Future Considerations**

- Additional Scope 3 categories (waste, upstream transportation, etc.)
- Multi-framework export (CSRD, TCFD, SEC)
- Forecasting/predictive emissions modeling
- Carbon credit purchase/matching workflow
- Automated remediation actions

## 8. Success Metrics

**Leading indicators (days–weeks)**

- Adoption: 70% of connected accounts complete at least one data source connection within week 1
- Activation: 60% of customers generate their first audit-ready report within 30 days
- Time to complete: 50%+ reduction in median time to produce a quarterly report vs. reported manual baseline
- Error rate: <5% of connector syncs fail and require manual retry
- Usage frequency: 3+ weekly active users per active account by month 2

**Lagging indicators (weeks–months)**

- Data completeness: 80%+ of known emission sources connected and reporting by end of Q 2 post-onboarding
- Anomaly resolution time: median <5 business days from flag to resolution (stretch: <2 days)
- Audit-ready acceptance: 90%+ of exported reports accepted without rework by month 6
- Retention: % of customers still actively connecting sources or generating reports after 2 quarters
- Support tickets related to data reconciliation trending down post-launch

_Measurement method:_ in-app analytics (connector status, export logs, WAU) plus structured interviews with sustainability leads and a pilot auditor at 1 month and 1 quarter post-launch.

## 9. Open Questions

- Which 3-5 providers get native API integration first? _(Product + Eng — blocking, determines V 1 connector scope)_
- What confidence threshold routes a record to the "unmapped" queue vs. auto-include? _(Data/ML — blocking, affects report accuracy)_
- Will our audit trail model satisfy an external auditor's actual requirements? _(Product + pilot auditor partner — blocking, validates the "audit-ready" claim before GA)_
- Which emission factor database will we license, and how often is it updated? _(Data — blocking)_
- How do we handle customers migrating from existing spreadsheets/tools — parallel run or hard cutover? _(Product — non-blocking, resolve during onboarding design)_
- Should anomaly thresholds be global defaults or customer-configurable in V 1? _(Product — non-blocking, P 1 candidate)_

## 10. Timeline Considerations

- No fixed external deadline, but early design partners are targeting an upcoming disclosure cycle — aim for a pilot-ready version 6-8 weeks before their filing deadline.
- **Dependency:** emission factor database licensing must be secured before Scope 1/2 calculations can be finalized.
- **Dependency:** at least one external auditor must be engaged early to validate the audit trail approach before GA — this can gate the "audit-ready" claim in sales and marketing.
- **Suggested phasing:** Phase 1 (connectors + extraction + dashboard) → Phase 2 (anomaly detection + recommendations + audit export) → Phase 3 (P 1 items: permissions, scheduled reports, additional connectors).