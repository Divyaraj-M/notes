---
related:
  - "[[UTITSL_102 - Tech Doc]]"
  - "[[6 - Metrics & Dashboards]]"
  - "[[Kibana]]"
  - "[[Instructions from the Document]]"
  - "[[Elastic Search]]"
  - "[[Knowledge Hub]]"
  - "[[EN-Metrics & Dashboards]]"
  - "[[EcoTrace — Real-Time Emissions Monitoring Platform (V 1 PRD)]]"
  - "[[Training back Projects into Knowledge Hubs]]"
  - "[[Metrics & Dashboards]]"
  - "[[RFP training PRD]]"
  - "[[Jira Process]]"
  - "[[Domain diagram]]"
  - "[[Proposal Conversion Flow]]"
  - "[[RFP training]]"
---
# ECHS Data Model, Dashboards, and KPI Documentation

## Purpose

This document explains the **ECHS data model, dashboards, and KPIs** so that stakeholders understand:

- What is being built
- Where the data comes from
- How each KPI is calculated
- How dashboards will display insights

It acts as a **single reference for both business and technical teams**.

---

# 1. Deliverables Overview

|Deliverable|Purpose|
|---|---|
|**ECHS_ER_Diagram.html**|Full database Entity–Relationship diagram. Includes table relationships, columns, and dashboard-specific data views.|
|**ECHS_Dashboard_Wireframe.html**|Visual wireframe of all dashboards showing KPI layout, charts, and filters.|
|**table_and_column_names.json**|Complete list of tables and columns extracted from the database.|

### How to Use

To understand the system:

1. **Start with this document** to understand KPIs and logic.
2. **Open the ER diagram** to see how tables connect.
3. **Open the dashboard wireframe** to see how metrics appear visually.

---

# 2. System Overview

The ECHS system is built on a **relational database** where claims move through multiple stages:

1. **Claim Intimation**  
    Claim is registered.
2. **Claim Submission**  
    Bill details are submitted.
3. **Claim Processing**
4. **Claim Settlement**  
    Payment is completed.

Each claim flows through these stages and is tracked across multiple tables.

---

# 3. Database Structure

The database is organized into three major groups.

---

# 3.1 Core Claim Transaction Tables

These tables capture the **claim lifecycle**.

|Table|Description|
|---|---|
|**clm_intmtn**|Claim registration. One record per claim.|
|**clm_submtn**|Bill submission details including admission date and claim amount.|
|**clm_stlmnt**|Settlement and payment details.|
|**claim_remarks**|Claim audit trail including processor actions and remarks.|

### Key Relationships

Claim Intimation → Claim Submission

clm_intmtn.CI_INTIMATION_ID  
        =  
clm_submtn.CS_INTIMATION_ID

Claim Intimation → Settlement

clm_intmtn.CI_INTIMATION_ID  
        =  
clm_stlmnt.SD_INTIMATION_ID

Claim Intimation → Remarks

clm_intmtn.CI_INTIMATION_ID  
        =  
claim_remarks.CR_INTIMATION_ID

---

# 3.2 Master / Reference Tables

These provide **lookup information** used across claims.

|Table|Purpose|
|---|---|
|**office_master**|Hospitals / offices|
|**cghs_region_master_mstr**|CGHS regions and cities|
|**state_mstr**|State reference|
|**category_master_mstr**|Diagnosis / disease categories|
|**patient_type_mstr**|Patient classification|
|**relation_master_mstr**|Dependent relationship|
|**room_type_mstr**|Room classification|
|**discharge_type_mstr**|Discharge type|
|**user_details**|System users|
|**user_group_mstr**|User groups|
|**user_entity_mstr**|User entities|
|**dashboard_det**|Stage and status descriptions|

---

# 3.3 Supporting Tables

These tables support reporting and configuration.

|Table|Purpose|
|---|---|
|**referal_details**|Referral information|
|**unlisted_procedure**|Unlisted procedure approvals|
|**daily_office_pendency**|Office-level pending claims summary|
|**daily_region_pendency**|Region-level pending claims summary|
|**parameter_master_mstr**|Configuration parameters|
|**parameter_range**|Parameter ranges|
|**financial_year_mstr**|Financial year details|

---

# 4. Entity–Relationship Diagram

The ER diagram provides a **visual representation of the database structure**.

### Diagram Elements

|Element|Meaning|
|---|---|
|Box|Database table|
|PK|Primary key|
|FK|Foreign key|
|Lines|Table relationships|
|Labels|Relationship cardinality|

### Diagram Types Available

Inside **ECHS_ER_Diagram.html**

1. High-level business diagram
2. Full technical database diagram
3. Dashboard-specific diagrams

These help both **business stakeholders and developers understand the data flow**.

---

# 5. Dashboard Date Filters

All dashboards support the same date filters.

|Filter|Start|End|
|---|---|---|
|Due today|Today 00:00|Today 23:59|
|Due tomorrow|Tomorrow 00:00|Tomorrow 23:59|
|This week|Sunday|Saturday|
|Next week|Next Sunday|Next Saturday|
|Last week|Previous Sunday|Previous Saturday|
|This month|1st of month|Last day|
|Next month|Next month start|Next month end|
|Last month|Previous month start|Previous month end|
|Custom|User defined|User defined|

Week definition: **Sunday to Saturday**

---

# 6. Dashboard 1 — Claims Processing Metrics

This dashboard monitors **claim processing performance**.

### KPIs

|KPI|Metric|Calculation|
|---|---|---|
|Total Claims Processed|Count of claims settled|Stage = 13|
|Total Claim Amount|Sum of claim values|SUM(CS_NET_CLAIM_AMT)|
|Average Claim Amount|Average claim size|AVG(CS_NET_CLAIM_AMT)|
|Claims within SLA|Processed within 7 days|DATEDIFF ≤ 7|
|Claims in Progress|Claims currently processing|Status = P|
|Claim Aging|Pending claim duration buckets|0–7 / 7–14 / 15–30 / 30+|
|Claims with Deductions|Approved amount < claimed amount|Amount mismatch|
|Fully Approved Claims|Approved = claimed|Exact match|
|Partially Approved Claims|Approved < claimed|Percentage|
|Rejected Claims|Status = X|% of total|

---

# 7. Dashboard 2 — Demographic & Disease Metrics

This dashboard provides **population and hospital insights**.

### KPIs

|KPI|Metric|
|---|---|
|Gender-wise Claim Distribution||
|Age Group-wise Claim Distribution||
|Region-wise Claim Distribution||
|Diagnosis Category Distribution||
|High Value Claims||
|Top Hospitals by Claim Volume||
|Top Hospitals by Claim Amount||
|Hospitals with High Deduction %||
|Hospitals with High Rejection %||
|Hospital Turnaround Time||

---

# 8. Dashboard 3 — Processor Productivity

This dashboard evaluates **operations team efficiency**.

### KPIs

|KPI|Metric|
|---|---|
|Processor Productivity||
|Time Spent per Claim||
|User Productivity Heatmap||
|Queries Raised vs Resolved||
|Average Query Resolution Time||

---

# 9. Glossary

|Term|Meaning|
|---|---|
|Intimation|Claim registration|
|Submission|Claim bill submission|
|Settlement|Claim payment|
|Stage|Workflow stage|
|Status|Processing state|
|TAT|Turnaround time|
|SLA|Service level agreement|
|NMI|Query raised on claim|
|CGHS|Central Government Health Scheme|

---

# 10. Quick Reference

|Question|Where to Look|
|---|---|
|KPI definitions|Sections 6–8|
|Database relationships|ER Diagram|
|Table and column list|JSON file|
|Dashboard layout|Dashboard Wireframe|

---

## Why this structure is better

Three improvements:

1. **Narrative flow**
    - System → Data → Dashboards → KPIs

2. **Less repetition**
    - Removed duplicate KPI explanations
    
3. **Stakeholder friendly**
    - They understand business value before technical details