---
share_link: https://share.note.sx/bqi2mqro#TqWXO7/dIFKo53t3l+HOk6aPTa6Fzt7jCCTSuiVGYGk
share_updated: 2026-03-09T00:03:16+05:30
---
#marketing/roi_calculator/v2 

**Product:** SparrowGenie ROI Calculator & Report Generator
**Author:** Product & Revenue Operations
**Date:** March 8, 2026
**Status:** Living Document
**Version:** 2.0

---

## 1. Overview

The SparrowGenie ROI Calculator helps potential buyers quickly estimate the financial impact of using SparrowGenie based on their RFP activity. It collects three simple inputs and produces a clear, CFO-friendly ROI estimate with a verdict classification.

The calculator serves two goals: demonstrate ROI to prospects on the website, and generate a downloadable PDF report that a sales champion can forward to decision-makers (Directors, VPs, CFOs) to justify the purchase.

### Problem Context

Prospects evaluating SparrowGenie need a concrete, personalized way to understand the financial return they can expect from the platform. Sales teams currently rely on generic claims ("you'll win more deals") without tailoring the value proposition to each prospect's specific RFP volume, deal size, and win rate. This makes it harder to justify the investment internally, slows down deal cycles, and reduces conversion rates.

---

## 2. Objectives

- **Provide a fast, credible ROI estimate** using only 3 inputs
- **Generate a PDF report** designed to convince decision-makers in 3 seconds
- **Collect prospect contact details** (first name, last name, work email) before PDF download
- **Send the PDF via email** with a download link (not attachment) for lead nurture tracking
- **Qualify prospects** by RFP volume, deal size, and ROI verdict

### Success Criteria

| Metric | Target |
|---|---|
| Calculator completion rate | > 60% |
| PDF download conversion rate | > 40% |
| Demo booking rate from email CTA | > 15% |

---

## 3. Non-Goals

- **Custom pricing engine:** The calculator uses a simplified pricing model (flat annual plan cost by volume tier). It does not replace the actual quoting process. (Separate initiative owned by RevOps.)
- **Multi-year projections:** V1 calculates annual ROI only. Compounding effects, churn, or deal expansion over multiple years are out of scope. (Premature need baseline data first.)
- **Per-industry benchmarks:** The +10 percentage point win rate lift is a single conservative benchmark. Industry-specific lift rates are not yet validated. (Not enough data.)
- **CRM auto-population:** Auto-populating prospect data from Salesforce/HubSpot into the calculator is a future enhancement. (Too complex for V2 lead capture pushes TO HubSpot but does not pull FROM it.)

---

## 4. User Stories

**As a sales rep**, I want to generate a personalized ROI report for a prospect so that I can attach it to my outreach or follow-up and give them a concrete reason to buy.

**As a prospect (VP of Sales / Head of Proposals)**, I want to see how SparrowGenie's impact translates to my specific deal pipeline so that I can build a business case for my CFO or procurement team.

**As a sales leader**, I want all my reps using a consistent ROI methodology so that our value messaging is uniform and credible across every deal.

**As a prospect reviewing the report**, I want to understand exactly how each number was calculated so that I trust the projections and can defend them internally.

**As a sales rep**, I want to toggle between verdict tiers (Strong ROI / Solid ROI / Early Stage) so that I can preview the report for different prospect profiles before sending.

---

## 5. Lead Capture 

After the calculator displays results on-screen (Page 1 of the report), the user must provide contact details to receive the full PDF report via email.

### Fields Collected

| Field | Type | Validation |
|---|---|---|
| First Name | Text (required) | Min 2 characters, no special characters |
| Last Name | Text (required) | Min 2 characters, no special characters |
| Work Email | Email (required) | Must be a work email. Reject personal domains (gmail, yahoo, hotmail, outlook). Validate format. |

**Important:** Only work email addresses are accepted. Personal email domains must be rejected with a friendly message: "Please use your work email so we can send your personalized report."

Lead data is sent to CRM (HubSpot) on form submission. The PDF is NOT attached to the email. Instead, the email contains a download button linking to a hosted PDF URL with a unique token for tracking.

---

## 6. Feature Description & Full Calculation Methodology

### 5.1 User Inputs (3 Required Fields)

The entire ROI model runs on three inputs provided by the prospect or sales rep:

| Input | Description | Example Value |
|---|---|---|
| **RFPs Per Year** | Number of RFP/proposal responses the prospect's team submits annually | 12 |
| **Average Deal Size** | Average contract value of a single won deal ($) | $100,000 |
| **Current Win Rate** | The prospect's current win rate on RFP submissions (%) | 20% |

### 5.2 Constants & Assumptions

| Constant | Value | Rationale |
|---|---|---|
| **Win Rate Lift** | +10 percentage points (absolute, not relative) | Conservative industry benchmark. This is added to the current win rate, not multiplied. A 20% win rate becomes 30%, not 22%. |
| **SparrowGenie Annual Cost** | Tiered by volume (see below) | Determined by the prospect's RFP volume tier using the pricing formula. |

### Pricing Tier Logic

The calculator recommends a pricing tier based on annual RFP volume. Pricing is hardcoded.

| RFP Volume | Plan Cost | Tier Name |
|---|---|---|
| ≤ 25 RFPs/year | $10,000/year | Starter |
| 26 – 50 RFPs/year | $15,000/year | Growth |
| > 50 RFPs/year | $30,000/year | Scale |

**Formula (Spreadsheet):**
```
Plan Cost = IF(RFPs ≤ 25, $10,000, IF(RFPs ≤ 50, $15,000, $30,000))
```

### 5.3 Complete Formula Chain (Step-by-Step)

The ROI calculation follows a six-step chain, presented in the report as three "chapters."

---

#### CHAPTER 1: Where You Are Today

**Step 1 — Current Deals Won**

```
Current Deals Won = RFPs Per Year × Current Win Rate
```

Example:
```
Current Deals Won = 12 × 0.20 = 2.4 deals
```

**Step 2 — Current RFP Revenue**

```
Current RFP Revenue = Current Deals Won × Average Deal Size
```

Example:
```
Current RFP Revenue = 2.4 × $100,000 = $240,000
```

---

#### CHAPTER 2: What SparrowGenie Changes

**Step 3 — New Win Rate (after SparrowGenie)**

```
New Win Rate = Current Win Rate + Win Rate Lift
```

Example:
```
New Win Rate = 20% + 10% = 30%
```

Important: The lift is an absolute addition of +10 percentage points, not a relative increase. This is a critical distinction — a 20% win rate goes to 30%, not to 22%.

**Step 4 — Projected Deals Won (with SparrowGenie)**

```
Projected Deals Won = RFPs Per Year × New Win Rate
```

Example:
```
Projected Deals Won = 12 × 0.30 = 3.6 deals
```

**Step 5 — Additional Deals Won (the delta)**

```
Additional Deals = Projected Deals Won − Current Deals Won
```

Example:
```
Additional Deals = 3.6 − 2.4 = 1.2 deals
```

Equivalent simplified formula:
```
Additional Deals = RFPs Per Year × Win Rate Lift
Additional Deals = 12 × 0.10 = 1.2 deals
```

---

#### CHAPTER 3: What You Gain

**Step 6 — Incremental Revenue (New Revenue)**

```
New Revenue = Additional Deals × Average Deal Size
```

Example:
```
New Revenue = 1.2 × $100,000 = $120,000
```

**Step 7 — Projected Total Revenue**

```
Projected Revenue = Current RFP Revenue + New Revenue
```

Example:
```
Projected Revenue = $240,000 + $120,000 = $360,000
```

**Step 8 — ROI Multiplier (Return on Investment)**

```
ROI = New Revenue ÷ SparrowGenie Annual Cost
```

Example:
```
ROI = $120,000 ÷ $10,000 = 12x
```

This is expressed as "12x return" — meaning for every $1 spent on SparrowGenie, the prospect gets $12 back in new revenue.

---

### 5.4 Complete Formula Summary Table

| Metric                | Formula                                              | Example                    |
| --------------------- | ---------------------------------------------------- | -------------------------- |
| RFPs per year         | User Input                                           | **12**                     |
| Average deal size ($) | User Input                                           | **$100,000**               |
| Current win rate (%)  | User Input                                           | **20%**                    |
| Win rate improvement  | 10% (hardcoded)                                      | **+10pp**                  |
| Current wins          | `= C2 × C4`                                          | 12 × 20% = **2.4**         |
| New win rate          | `= C4 + C5`                                          | 20% + 10% = **30%**        |
| Expected wins         | `= C2 × C7`                                          | 12 × 30% = **3.6**         |
| Additional wins       | `= C8 − C6`                                          | 3.6 − 2.4 = **+1.2**       |
| Incremental revenue   | `= C9 × C3`                                          | 1.2 × $100K = **$120,000** |
| Plan cost             | `= IF(C2≤25, 10K, IF(C2≤50, 15K, 30K))`              | **$10,000**                |
| ROI (multiplier)      | `= C10 ÷ C11`                                        | $120K ÷ $10K = **12x**     |
| Verdict               | `= IF(C12≥5, "Strong", IF(C12≥2, "Solid", "Early"))` | **Strong ROI**             |

---

### 5.5 Verdict Classification System

The report dynamically applies one of three "verdict" tiers based on the calculated ROI. The verdict changes the visual styling, messaging tone, and recommendation language throughout both pages of the report.

| Condition       | Verdict                                     | Hook Tag                              | Interpretation                                    |
| --------------- | ------------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| **ROI ≥ 5×**    | "Strong ROI. Great fit."                    | "You're leaving revenue on the table" | High confidence for immediate adoption.           |
| **ROI 2× – 5×** | "Solid ROI. Focus on priority deals first." | "Good opportunity ahead"              | Value depends on which teams adopt first.         |
| **ROI < 2×**    | "Early stage fit. Better ROI as you grow."  | "Your pipeline is building"           | ROI strengthens as deal volume or size increases. |

**Verdict Formula (Google Sheets):**
```
=IF(C12>=5, "Strong ROI. Great fit.", IF(C12>=2, "Solid ROI. Focus on priority deals first.", "Early stage fit. Better ROI as you grow."))
```

Each verdict tier changes the following visual elements: hook tag text and color, ROI number color class, verdict box background and border, verdict icon (checkmark / arrow / diagonal arrow), verdict label and description text, and the switcher button highlight.

Note: In the current HTML template, the verdict switcher is a manual preview control (hidden in print). The production calculator must implement the threshold logic above to auto-assign verdicts.

---

### 5.6 Report Structure (Two-Page Layout)

**Page 1 — "The Story" (Executive Summary)**

Designed to be understood in under 10 seconds. Contains:

- Brand header with company name and date
- 3-second hook with the ROI headline number
- Verdict badge with recommendation
- Before vs. After comparison card (win rate, deals won, RFP revenue)
- Impact strip with three KPIs: Additional Deals, New Revenue, ROI multiplier
- Revenue Bridge visualization (bar chart showing Current → Lift → Projected)

**Page 2 — "The Detail" (Full Methodology)**

For the analytical buyer who wants to see the math. Contains:

- Your Inputs section (the three input values displayed back)
- "The Math Behind Your ROI" — a 3-chapter narrative walkthrough of every calculation step with numbered rows
- ROI Punchline summary ("You invest $X. You gain $Y.")
- "How SparrowGenie Improves Win Rates" — four value prop cards (Respond Faster, Reuse Winning Answers, Consistent Messaging, More Time to Customize)
- Investment vs. Return summary (Plan Cost, Revenue Impact, Return)
- Assumptions & Methodology disclosure
- CTA: "Book a 15-Minute ROI Review"

---

## 7. Requirements

### Must-Have (P0)

- **Calculator form with 3 inputs** + real-time validation on the website
- **All formulas (C2–C20)** compute correctly including tiered pricing logic
- **Automatic verdict assignment** based on ROI thresholds (≥5x / 2x–5x / <2x)
- **Results page** renders Page 1 of the PDF in-browser after calculation
- **Before vs. After comparison** on Page 1 shows current state and projected state side by side
- **Impact strip** displays Additional Deals, New Revenue, and ROI multiplier
- **Revenue Bridge** bar chart visualizes current → lift → projected revenue
- **Lead capture form** (first name, last name, work email) gating the PDF download
- **Work email validation** — reject personal domains (gmail, yahoo, hotmail, outlook)
- **PDF generation** from calculator inputs (HTML-to-PDF or server-side rendering)
- **PDF hosted on CDN** with unique download token per lead
- **Email delivery** with download link (not attachment) triggered immediately on form submission
- **CRM integration** — push lead data + verdict to HubSpot on form submission
- **Download tracking** — log when PDF is accessed via unique token
- **Assumptions disclosure** clearly states the +10pp lift, pricing tier basis, revenue formula, and ROI formula
- **Print-ready layout** with A4 page breaks and print-safe CSS
- **Branded design** with SparrowGenie logo, fonts (Outfit + Fraunces), and dark theme
- **Verdict switcher** for dev/QA preview only (hidden in production)

### Nice-to-Have (P1)

- **Payback period calculation** (months to recoup investment)
- **Sensitivity analysis** showing ROI at different win rate lifts (+5pp, +10pp, +15pp)
- **Link expiry** — download token expires after 30 days
- **PDF update without resend** — if report template changes, hosted PDF reflects latest version

### Future Considerations (P2)

- **Multi-year projection** model with compounding deal flow
- **Industry-specific benchmarks** for win rate lift
- **CRM auto-population** — pull prospect data from HubSpot/Salesforce to pre-fill calculator
- **A/B testing** different verdict thresholds and messaging variants
- **Interactive sliders** with real-time output preview on the calculator page

---

## 8. Success Metrics

### Primary KPIs (Targets)

| Metric | Target | Measurement |
|---|---|---|
| Calculator completion rate | > 60% | `roi_calculator_submit` / `roi_calculator_start` |
| PDF download conversion rate | > 40% | `roi_pdf_downloaded` / `roi_lead_form_submit` |
| Demo booking rate from email CTA | > 15% | `roi_cta_book_call` / `roi_email_sent` |


---

## 9. Open Questions

| #   | Question                                                                                 | Owner           | Blocking? | Status                                           |
| --- | ---------------------------------------------------------------------------------------- | --------------- | --------- | ------------------------------------------------ |
| 1   | ~~What are the exact ROI thresholds for auto-assigning verdicts?~~                       | Product + Sales | —         | **RESOLVED:** ≥5x Strong, 2x–5x Solid, <2x Early |
| 2   | Should the win rate lift vary by input (e.g., higher lift for lower starting win rates)? | Product + Data  | No        | Open                                             |
| 3   | ~~What are the actual SparrowGenie pricing tiers by RFP volume?~~                        | RevOps          | —         | **RESOLVED:** ≤25→$10K, 26-50→$15K, >50→$30K     |
| 4   | Should we cap the win rate at some maximum (e.g., 60%) to keep projections credible?     | Product         | No        | Open                                             |
| 5   | Do we need legal review of the disclaimer / assumptions language?                        | Legal           | No        | Open — should do before wide distribution        |
| 6   | Which email service to use? (SendGrid / SES / HubSpot transactional)                     | Engineering     | Yes       | Open                                             |
| 7   | What is the blocked personal email domain list beyond gmail, yahoo, hotmail, outlook?    | Product         | No        | Open                                             |
| 8   | Should download link tokens expire? If so, after how many days?                          | Product         | No        | Open — 30 days suggested                         |

---

## 10. Assumptions & Methodology Notes

The model is intentionally simple and conservative:

- The **+10 percentage point lift** is an absolute increase applied uniformly. It does not vary by starting win rate, industry, or deal complexity. This was chosen to be defensible in sales conversations — it is easy to explain and hard to argue is aggressive.
- **Revenue is calculated on incremental wins only.** The model does not claim SparrowGenie increases deal size — only that it helps win more of the deals already in the pipeline.
- **Cost is treated as a flat annual figure.** Implementation costs, training time, and opportunity cost of onboarding are excluded from the model.
- **The model assumes constant RFP volume.** It does not account for SparrowGenie enabling teams to respond to more RFPs (which would increase the numerator further).
- **No time-value-of-money adjustment.** Revenue is not discounted. For annual calculations this is reasonable; for multi-year projections it would need adjustment.

---

## 11. Email Delivery Flow

After the user submits their contact details, the system:

1. Creates the PDF from calculator inputs + verdict
2. Uploads PDF to hosted storage (S3/CDN) with a unique download token
3. Sends an HTML email with a download button (not an attachment)
4. Logs the lead in CRM (HubSpot) with calculator inputs, verdict, and ROI multiplier
5. Tracks PDF download via the unique token

**Why download link, not attachment:** Tracks whether the prospect actually opens the PDF (download event), avoids email deliverability issues (large attachments trigger spam filters), allows the PDF to be updated if needed without resending, and enables optional expiry (link expires after 30 days).

---

## 12. Email Specification

| Field | Value |
|---|---|
| Subject line | Your SparrowGenie ROI Report is Ready |
| Preheader | Your ROI report shows {{ROI}}x return — here's your full breakdown. |
| Sender | SparrowGenie \<reports@sparrowgenie.com\> |
| Trigger | Immediately after lead form submission |

### Email Content Structure (from HTML template)


1. **Header** — SparrowGenie branded bar (dark background, logo, "ROI Impact Report" label)
2. **Personalized greeting** — "Hi {{FirstName}},"
3. **Intro copy** — "Thanks for exploring SparrowGenie. We crunched the numbers..."
4. **Two big numbers** — Additional Revenue (${{IncrementalRevenue}}/year) and ROI ({{ROI}}x)
5. **Verdict badge** — {{Verdict}} with green/gold/blue styling matching the PDF tier
6. **"Your full report includes"** — 3 bullet points: Before vs After, Revenue Impact Bridge, Full methodology
7. **Primary CTA** — Green button: "Download Your ROI Report" → links to `{{DownloadURL}}` (unique token URL)
8. **Secondary CTA** — Outlined button: "Book a 15-Minute ROI Review →" → links to `{{BookCallURL}}`
9. **Footer** — disclaimer, company info ({{CompanyName}} / {{CompanyAddress}}), unsubscribe + update preferences links

### Template Variables

| Variable | Source | Example |
|---|---|---|
| `{{FirstName}}` | Lead capture form | John |
| `{{ROI}}` | Calculator output (C12) | 12 |
| `{{IncrementalRevenue}}` | Calculator output (C10), formatted | 120,000 |
| `{{Verdict}}` | Calculator output (C20) | Strong ROI. Great fit. |
| `{{DownloadURL}}` | Backend — unique token URL | https://cdn.sparrowgenie.com/reports/abc123 |
| `{{BookCallURL}}` | Static or UTM-tagged | https://sparrowgenie.com/book-call |
| `{{CompanyName}}` | Config | SparrowGenie by SurveySparrow |
| `{{CompanyAddress}}` | Config | Chennai, India |
| `{{UnsubscribeURL}}` | Email service | Auto-generated |
| `{{PreferencesURL}}` | Email service | Auto-generated |

### Email Technical Notes

- Built as table-based HTML email with MSO/VML fallbacks for Outlook
- Mobile-responsive via `@media` queries (breakpoint: 620px)
- System font stack (no Google Fonts — email clients don't support them)
- Preheader text hidden via `display:none` for inbox preview optimization

---

## 13. Technical Requirements

### Frontend

- Calculator form with 3 inputs + real-time validation
- Results page renders Page 1 of the PDF in-browser
- Verdict switcher for preview (dev/QA only, hidden in production)
- Lead capture form: first name, last name, work email
- Email domain validation (reject personal domains)

### Backend

- PDF generation from calculator inputs (HTML-to-PDF or server-side rendering)
- PDF hosted on CDN with unique download token per lead
- Email service integration (SendGrid / SES / HubSpot transactional)
- CRM integration: push lead + inputs + verdict to HubSpot
- Download tracking: log when PDF is accessed via token

### Analytics Events

| Event | Trigger |
|---|---|
| `roi_calculator_start` | First input field interaction |
| `roi_calculator_submit` | Results computed and displayed |
| `roi_lead_form_shown` | Lead capture form displayed |
| `roi_lead_form_submit` | Contact details submitted |
| `roi_email_sent` | Email dispatched |
| `roi_pdf_downloaded` | Download link clicked |
| `roi_cta_book_call` | Book-a-call CTA clicked |

### PDF Template Notes

- The report template is a single self-contained HTML file with inline CSS and JavaScript
- Fonts are loaded from Google Fonts (Outfit for body, Fraunces for numbers/headings)
- The verdict switcher is a preview-only control (hidden in print via `@media print`)
- The page is designed for `@page A4` print layout with explicit page breaks between Page 1 and Page 2
- The current template uses hardcoded values for "Acme Corporation" — the production system must dynamically populate all fields from calculator inputs
