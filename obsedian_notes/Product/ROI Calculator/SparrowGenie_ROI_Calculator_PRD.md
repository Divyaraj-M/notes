# Product Requirements Document: SparrowGenie ROI Calculator

**Product:** SparrowGenie ROI Calculator & Report Generator
**Author:** Product Team
**Date:** March 8, 2026
**Status:** Living Document
**Version:** 1.0

---

## 1. Problem Statement

Prospects evaluating SparrowGenie need a concrete, personalized way to understand the financial return they can expect from the platform. Sales teams currently rely on generic claims ("you'll win more deals") without tailoring the value proposition to each prospect's specific RFP volume, deal size, and win rate. This makes it harder to justify the investment internally, slows down deal cycles, and reduces conversion rates.

The ROI Calculator solves this by taking a prospect's actual business inputs and producing a branded, two-page ROI Impact Report that quantifies the dollar value of using SparrowGenie — making the business case self-evident.

---

## 2. Goals

- **Shorten sales cycles** by giving prospects a personalized financial justification they can share with internal stakeholders and budget holders.
- **Increase conversion rate** by making the ROI tangible and specific rather than abstract.
- **Enable self-serve evaluation** so prospects can run their own numbers before (or instead of) a sales call.
- **Standardize value messaging** across the sales team with a consistent, data-backed methodology.
- **Generate qualified leads** by capturing prospect inputs (company name, RFP volume, deal size) in exchange for the report.

---

## 3. Non-Goals

- **Custom pricing engine:** The calculator uses a simplified pricing model (flat annual plan cost by volume tier). It does not replace the actual quoting process. (Separate initiative owned by RevOps.)
- **Multi-year projections:** V1 calculates annual ROI only. Compounding effects, churn, or deal expansion over multiple years are out of scope. (Premature — need baseline data first.)
- **Per-industry benchmarks:** The +10 percentage point win rate lift is a single conservative benchmark. Industry-specific lift rates are not yet validated. (Not enough data.)
- **Interactive input form:** The current HTML is a static report template. A live web calculator with real-time input fields is a separate frontend project. (Separate initiative.)
- **CRM integration:** Auto-populating prospect data from Salesforce/HubSpot is a future enhancement. (Too complex for V1.)

---

## 4. User Stories

**As a sales rep**, I want to generate a personalized ROI report for a prospect so that I can attach it to my outreach or follow-up and give them a concrete reason to buy.

**As a prospect (VP of Sales / Head of Proposals)**, I want to see how SparrowGenie's impact translates to my specific deal pipeline so that I can build a business case for my CFO or procurement team.

**As a sales leader**, I want all my reps using a consistent ROI methodology so that our value messaging is uniform and credible across every deal.

**As a prospect reviewing the report**, I want to understand exactly how each number was calculated so that I trust the projections and can defend them internally.

**As a sales rep**, I want to toggle between verdict tiers (Strong ROI / Solid ROI / Early Stage) so that I can preview the report for different prospect profiles before sending.

---

## 5. Feature Description & Full Calculation Methodology

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
| **SparrowGenie Annual Cost** | $10,000/year | Determined by the prospect's RFP volume tier. Treated as a flat annual cost in the model. |
| **Pricing Tier Basis** | Based on RFP volume | The plan cost scales with how many RFPs the team handles. Specific tier breakpoints are not defined in the calculator — the $10,000 figure is used as the example. |

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

| # | Metric | Formula | Example |
|---|---|---|---|
| 1 | Current Deals Won | `RFPs/Year × Current Win Rate` | 12 × 20% = **2.4** |
| 2 | Current RFP Revenue | `Current Deals Won × Avg Deal Size` | 2.4 × $100K = **$240,000** |
| 3 | New Win Rate | `Current Win Rate + 10pp` | 20% + 10% = **30%** |
| 4 | Projected Deals Won | `RFPs/Year × New Win Rate` | 12 × 30% = **3.6** |
| 5 | Additional Deals | `Projected Deals − Current Deals` | 3.6 − 2.4 = **+1.2** |
| 6 | New Revenue | `Additional Deals × Avg Deal Size` | 1.2 × $100K = **$120,000** |
| 7 | Projected Revenue | `Current Revenue + New Revenue` | $240K + $120K = **$360,000** |
| 8 | ROI Multiplier | `New Revenue ÷ Annual Cost` | $120K ÷ $10K = **12x** |

---

### 5.5 Verdict Classification System

The report dynamically applies one of three "verdict" tiers based on the calculated ROI. The verdict changes the visual styling, messaging tone, and recommendation language throughout both pages of the report.

| Verdict | Trigger Condition (Inferred) | Hook Tag | Headline Color | Verdict Label | CTA Tone |
|---|---|---|---|---|---|
| **Strong ROI** | High ROI multiplier (e.g. ≥8x) | "You're leaving revenue on the table" | Teal/Green | "Strong ROI. Great fit." | Urgency — significant revenue at stake |
| **Solid ROI** | Moderate ROI multiplier (e.g. 3x–8x) | "Good opportunity ahead" | Gold/Yellow | "Solid ROI. Focus on priority deals first." | Strategic — start with highest-value RFPs |
| **Early Stage** | Lower ROI multiplier (e.g. <3x) | "Your pipeline is building" | Blue | "Early stage fit. Better ROI as you grow." | Growth — ROI strengthens as volume/deal size increases |

Each verdict tier changes the following visual elements: hook tag text and color, ROI number color class, verdict box background and border, verdict icon (checkmark / arrow / diagonal arrow), verdict label and description text, and the switcher button highlight.

Note: In the current HTML, the verdict switcher is a manual preview control (top-right buttons). The actual threshold logic for automatically assigning a verdict based on computed ROI is not yet implemented in this template — it would need to be built into the calculator backend or JavaScript layer.

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

## 6. Requirements

### Must-Have (P0)

- **Three input fields** (RFPs/Year, Average Deal Size, Current Win Rate) drive all calculations
- **All 8 formulas** compute correctly and display on Page 2 in the step-by-step chapter format
- **Before vs. After comparison** on Page 1 shows current state and projected state side by side
- **Impact strip** displays Additional Deals, New Revenue, and ROI multiplier
- **Revenue Bridge** bar chart visualizes current → lift → projected revenue
- **Verdict system** with three tiers (Strong / Solid / Early Stage) that changes messaging and styling across the entire report
- **Assumptions disclosure** clearly states the +10pp lift, pricing tier basis, revenue formula, and ROI formula
- **Print-ready layout** with A4 page breaks and print-safe CSS
- **Branded design** with SparrowGenie logo, fonts (Outfit + Fraunces), and dark theme

### Nice-to-Have (P1)

- **Automatic verdict assignment** based on computed ROI thresholds (currently manual switcher only)
- **Dynamic data binding** so the report auto-fills from calculator inputs (currently hardcoded example values)
- **PDF export** button that triggers browser print-to-PDF
- **Payback period calculation** (months to recoup investment)
- **Sensitivity analysis** showing ROI at different win rate lifts (+5pp, +10pp, +15pp)

### Future Considerations (P2)

- **Live web calculator** with interactive sliders and real-time output preview
- **Multi-year projection** model with compounding deal flow
- **Industry-specific benchmarks** for win rate lift
- **CRM integration** to auto-populate prospect data
- **Email delivery** of the generated PDF report
- **A/B testing** different verdict thresholds and messaging variants

---

## 7. Success Metrics

### Leading Indicators (1–4 weeks post-launch)

- **Report generation volume:** Number of ROI reports generated per week by the sales team
- **Attachment rate:** % of outbound proposals or follow-ups that include the ROI report
- **Prospect engagement:** % of prospects who reference the ROI numbers in follow-up conversations

### Lagging Indicators (1–3 months post-launch)

- **Deal velocity:** Reduction in average days from first contact to closed-won for deals that received an ROI report vs. those that did not
- **Conversion rate lift:** Increase in prospect-to-customer conversion rate when ROI report is used
- **Average deal size:** Whether prospects who see the ROI report close at higher contract values
- **Sales team adoption:** % of reps who generate at least one report per week

---

## 8. Open Questions

| # | Question | Owner | Blocking? |
|---|---|---|---|
| 1 | What are the exact ROI thresholds for auto-assigning Strong / Solid / Early Stage verdicts? | Product + Sales | Yes — needed for automation |
| 2 | Should the win rate lift vary by input (e.g., higher lift for lower starting win rates)? | Product + Data | No — can iterate post-launch |
| 3 | What are the actual SparrowGenie pricing tiers by RFP volume? | RevOps | Yes — needed for accurate ROI |
| 4 | Should we cap the win rate at some maximum (e.g., 60%) to keep projections credible? | Product | No — design consideration |
| 5 | Do we need legal review of the disclaimer / assumptions language? | Legal | No — but should do before wide distribution |
| 6 | Will the report be generated server-side (PDF) or client-side (browser print)? | Engineering | Yes — determines architecture |

---

## 9. Assumptions & Methodology Notes

The model is intentionally simple and conservative:

- The **+10 percentage point lift** is an absolute increase applied uniformly. It does not vary by starting win rate, industry, or deal complexity. This was chosen to be defensible in sales conversations — it is easy to explain and hard to argue is aggressive.
- **Revenue is calculated on incremental wins only.** The model does not claim SparrowGenie increases deal size — only that it helps win more of the deals already in the pipeline.
- **Cost is treated as a flat annual figure.** Implementation costs, training time, and opportunity cost of onboarding are excluded from the model.
- **The model assumes constant RFP volume.** It does not account for SparrowGenie enabling teams to respond to more RFPs (which would increase the numerator further).
- **No time-value-of-money adjustment.** Revenue is not discounted. For annual calculations this is reasonable; for multi-year projections it would need adjustment.

---

## 10. Technical Notes

- The report is a single self-contained HTML file with inline CSS and JavaScript
- Fonts are loaded from Google Fonts (Outfit for body, Fraunces for numbers/headings)
- The verdict switcher is a preview-only control (hidden in print via `@media print`) that allows sales reps to see all three verdict variants before selecting the right one for the prospect
- The page is designed for `@page A4` print layout with explicit page breaks between Page 1 and Page 2
- All values in the current template are hardcoded for the example prospect ("Acme Corporation"). A dynamic version would require JavaScript templating or server-side rendering to populate from calculator inputs
