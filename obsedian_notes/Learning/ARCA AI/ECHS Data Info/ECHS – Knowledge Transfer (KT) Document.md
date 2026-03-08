
## For Client & Stakeholders

  
This document explains the ECHS data model, dashboards, and KPIs so that the client and stakeholders can understand what is being built, how it is calculated, and where the data comes from.


---

  

## 1. Deliverables Overview

  

| Deliverable | Purpose |

|-------------|---------|

| **ECHS_ER_Diagram.html** | Full Entity–Relationship diagram of the database; table/column listing; dashboard KPI definitions; dashboard-specific ER views. Open in a browser. |

| **ECHS_Dashboard_Wireframe.html** | Wireframe of all three dashboards with KPIs, sample charts, and date filters. Use to see how each KPI will look and behave. |

| **table and Column Names.json** | Complete list of tables and columns (from the database). Used by the ER diagram page for the “All tables and columns” section. |

  

**How to use:**  

- Open `ECHS_ER_Diagram.html` to explore the **data model** and **KPI logic**.  

- Open `ECHS_Dashboard_Wireframe.html` to see **dashboard layout**, **charts**, and **date filters**.

  

---

  

## 2. Database Overview

  

The ECHS application uses a relational database. The main areas are:

  

### 2.1 Core transaction tables (claims flow)

  

| Table | Purpose |

|-------|---------|

| **clm_intmtn** | Claim intimation (one row per claim). Tracks stage, status, beneficiary, hospital, region, etc. |

| **clm_submtn** | Claim submission (bill details): admission/discharge dates, net claim amount, approved amount, office. |

| **clm_stlmnt** | Settlement details: claim amount, payment, settlement date. |

| **claim_remarks** | Remarks/audit trail per claim (user, date, stage, status). Used for SLA and processor KPIs. |

  

**Key join:** `clm_intmtn.CI_INTIMATION_ID = clm_submtn.CS_INTIMATION_ID` (1:1).  

Settlement links as: `clm_intmtn.CI_INTIMATION_ID = clm_stlmnt.SD_INTIMATION_ID` (optional 1:0..1).

  

### 2.2 Master / reference tables

  

| Table | Purpose |

|-------|---------|

| **office_master** | Hospitals/offices (OM_OFFICE_ID, name, city, CGHS city, state, etc.). |

| **cghs_region_master_mstr** | CGHS regions/cities (CRM_CITY_ID, city name). |

| **state_mstr** | States. |

| **category_master_mstr** | Category/disease group (used for diagnosis-wise KPIs). |

| **patient_type_mstr** | Patient type codes. |

| **relation_master_mstr** | Relation of dependent to beneficiary. |

| **room_type_mstr** | Room type. |

| **discharge_type_mstr** | Discharge type. |

| **user_details** | Users (processor name, office, group, entity). |

| **user_group_mstr**, **user_entity_mstr** | User groups and entities. |

| **dashboard_det** | Stage/status descriptions for dashboard display. |

  

### 2.3 Other tables

  

- **referal_details** – Referral details per intimation.  

- **unlisted_procedure** – Unlisted procedure applications.  

- **daily_office_pendency**, **daily_region_pendency** – Aggregated pendency for reporting.  

- **parameter_master_mstr**, **parameter_range** – Configuration/parameters.  

- **financial_year_mstr** – Financial year dates.

  

A full list of **all tables and columns** is available in the ER diagram HTML (section “All tables and columns”) and in the JSON file.

  

---

  

## 3. Entity–Relationship (ER) Diagram

  

### 3.1 What the diagram shows

  

- **Boxes** = tables.  

- **Text inside** = key columns; **PK** = primary key, **FK** = foreign key.  

- **Lines** = relationships (e.g. one intimation → one submission, one intimation → many remarks).  

- **Labels on lines** = cardinality (1:1, 1:N, 1:0..1) and join condition.

  

### 3.2 Where to find it

  

- In **ECHS_ER_Diagram.html**:  

  - **High-level view** – business-friendly names (e.g. Claim Intimation, Claim Submission).  

  - **Full technical view** – all tables and columns used in the system.  

  - **Dashboard-specific ER diagrams** – only the tables and columns used for Dashboard 1, 2, and 3.

  

### 3.3 How stakeholders use it

  

- To see **which tables** feed each dashboard.  

- To understand **how tables connect** (e.g. claim → submission → office → region).  

- To validate **join conditions** and **keys** with the technical team.

  

---

  

## 4. Date Filters (for dashboards)

  

All dashboards support the same date filter options. Records are included if the **relevant date** (e.g. admission date or settlement date) falls **within** the chosen range:

  

| Filter | Start | End |

|--------|--------|-----|

| **Due today** | Today 00:00:00 | Today 23:59:59 |

| **Due tomorrow** | Tomorrow 00:00:00 | Tomorrow 23:59:59 |

| **This week** | Sunday 00:00:00 | Saturday 23:59:59 (current week) |

| **Next week** | Next Sunday 00:00:00 | Next Saturday 23:59:59 |

| **Last week** | Previous Sunday 00:00:00 | Previous Saturday 23:59:59 |

| **This month** | 1st of current month 00:00:00 | Last day of month 23:59:59 |

| **Next month** | 1st of next month 00:00:00 | Last day of next month 23:59:59 |

| **Last month** | 1st of previous month 00:00:00 | Last day of previous month 23:59:59 |

| **Custom date range** | User-selected start | User-selected end |

  

Week is **Sunday–Saturday**.

  

---

  

## 5. Dashboard 1 – Claims Processing (KPIs)

  

| KPI | Name | What we show (stakeholder) | How we calculate | Main tables | Key columns / filters |

|-----|------|----------------------------|------------------|-------------|-------------------------|

| **1.1** | Total Number of Claims Processed | Total count of claims that reached settlement in the selected period (by admission date or settlement date). | Count distinct intimations where stage = Settlement (13) and status is Settled (S) or In process (P), filtered by date range. | clm_intmtn, clm_submtn (or clm_stlmnt for settlement date) | CI_INT_STAGE=13, CI_INT_STATUS IN ('S','P'), CS_ADMISSION_DATE or SD_FINAL_SETTLE_DT in range |

| **1.2** | Total Claim Amount Processed | Sum of all claim amounts (₹) processed in the selected period. | Sum of CS_NET_CLAIM_AMT (or SD_CLAIM_AMT if by settlement date) for claims in stage 13, status S/P, in period. | clm_intmtn, clm_submtn / clm_stlmnt | Same filters; sum CS_NET_CLAIM_AMT or SD_CLAIM_AMT |

| **1.3** | Average Claim Amount | Average claim value per settled claim (typical ticket size). | AVG(CS_NET_CLAIM_AMT) for claims in stage 13, status S/P. | clm_intmtn, clm_submtn | CI_INT_STAGE=13, CI_INT_STATUS IN ('S','P') |

| **1.4** | Claims Processed Within SLA | Number and % of claims processed within 7 days (TAT) from bill submission. | Count claims where DATEDIFF(CR_UPDATE_DATE, CS_ADMISSION_DATE) ≤ 7. | clm_intmtn, clm_submtn, claim_remarks | CR_UPDATE_DATE, CS_ADMISSION_DATE |

| **1.5** | Claims in Progress | As-on-date count of claims still in process; breakdown by office/role. | Count where CI_INT_STATUS = 'P'. Can group by CS_SUB_OFFICE_ID. | clm_intmtn, clm_submtn, office_master | CI_INT_STATUS='P', CS_SUB_OFFICE_ID |

| **1.6** | Claims Aging Analysis | Claims grouped by how long they have been pending (0–7, 7–14, 15–30, 30+ days). | Bucket by DATEDIFF(CURDATE(), CS_ADMISSION_DATE) into 0–7, 7–14, 15–30, 30+ and count per bucket. | clm_intmtn, clm_submtn | CS_ADMISSION_DATE |

| **1.7** | Claims with Deductions Applied | Count and % of claims where approved amount is less than claimed. | Count where CS_NET_CLAIM_AMT ≠ CS_UTI_APP_AMT (stage 13, S/P). | clm_intmtn, clm_submtn | CS_NET_CLAIM_AMT, CS_UTI_APP_AMT |

| **1.8** | Claims Fully Approved | Count of claims where claimed amount equals approved amount (no deduction). | Count where CS_NET_CLAIM_AMT = CS_UTI_APP_AMT. | clm_intmtn, clm_submtn | Same as above |

| **1.9** | Claims Partially Approved | Percentage of claims that were partially approved (claim > approved). | (Count where CS_NET_CLAIM_AMT > CS_UTI_APP_AMT) / Total claims × 100. | clm_intmtn, clm_submtn | Same as above |

| **1.10** | Claims Rejected | Percentage of total claims that were rejected. | Count where CI_INT_STATUS = 'X' (or rejection stage codes) / Total intimations × 100. | clm_intmtn, clm_submtn | CI_INT_STATUS, CI_INT_STAGE |

  

---

  

## 6. Dashboard 2 – Demographic & Disease Metrics (KPIs)

  

| KPI | Name | What we show (stakeholder) | How we calculate | Main tables | Key columns / filters |

|-----|------|----------------------------|------------------|-------------|-------------------------|

| **2.1** | Gender-wise Claim Distribution | Share of claims by gender (Male / Female / Other) as % of total in the period. | Count distinct claims grouped by CI_SEX; divide by total claims for %. | clm_intmtn, clm_submtn (or clm_stlmnt) | CI_SEX, CS_ADMISSION_DATE or SD_FINAL_SETTLE_DT |

| **2.2** | Age Group-wise Claim Distribution | Claims spread across age buckets (0–18, 19–35, 36–50, 51–65, 65+) as %. | Bucket CI_AGE; count claims per bucket; show as % of total. | clm_intmtn, clm_submtn | CI_AGE |

| **2.3** | Region-wise Claim Distribution | Claim count by CGHS region/city. | Join submission → office → cghs_region; count claims by CRM_CITY_ID. | clm_intmtn, clm_submtn, office_master, cghs_region_master_mstr | CS_SUB_OFFICE_ID, OM_OFFICE_CGHS_CITY_ID, CRM_CITY_ID |

| **2.4** | Disease/Diagnosis Group-wise Distribution | Claims by disease/diagnosis category as count or %. | Join submission to category_master on cs_clam_category = cc_cat_id; count by category. | clm_intmtn, clm_submtn, category_master_mstr | cs_clam_category, cc_cat_id, cc_cat_desc |

| **2.5** | High Value / High Risk Claim Identification | Count of claims above a threshold (e.g. > ₹5 Lakh) for risk monitoring. | Count where CS_NET_CLAIM_AMT > 500000 (threshold configurable). | clm_intmtn, clm_submtn | CS_NET_CLAIM_AMT |

| **2.7** | Top Hospitals by Claim Volume | Top 10 or 20 hospitals by number of claims processed. | Group by CS_SUB_OFFICE_ID (join office_master); count claims; order by count DESC; limit 10/20. | clm_intmtn, clm_submtn, office_master | CS_SUB_OFFICE_ID, OM_OFFICE_ID |

| **2.8** | Top Hospitals by Claim Amount | Top 10 or 20 hospitals by total claim amount (₹) in the period. | Sum(CS_NET_CLAIM_AMT) by office; order by sum DESC; limit 10/20. | clm_intmtn, clm_submtn, office_master | CS_NET_CLAIM_AMT, CS_SUB_OFFICE_ID |

| **2.9** | Hospitals with High Deduction % | Top hospitals where a high % of claims had deductions applied. | Per hospital: count claims with CS_NET_CLAIM_AMT ≠ CS_UTI_APP_AMT; rank by count or %. | clm_intmtn, clm_submtn, office_master | CS_NET_CLAIM_AMT, CS_UTI_APP_AMT, CS_SUB_OFFICE_ID |

| **2.10** | Hospitals with High Rejection % | Top hospitals with highest rejection rate. | Per hospital: count where CI_INT_STATUS = 'X' / total claims; rank by rejection %. | clm_intmtn, clm_submtn, office_master | CI_INT_STATUS, CS_SUB_OFFICE_ID |

| **2.11** | Hospital Turnaround Time | Average days from admission/bill submission to processing (TAT) per hospital or overall. | AVG(DATEDIFF(CR_UPDATE_DATE, CS_ADMISSION_DATE)) per claim; can group by hospital. | clm_intmtn, clm_submtn, claim_remarks | CR_UPDATE_DATE, CS_ADMISSION_DATE |

  

---

  

## 7. Dashboard 3 – Processor & Operations Productivity (KPIs)

  

| KPI | Name | What we show (stakeholder) | How we calculate | Main tables | Key columns / filters |

|-----|------|----------------------------|------------------|-------------|-------------------------|

| **3.1** | Processor Productivity | Average claims processed per user in a period; which stage each user worked on. | Aggregate claim_remarks by CR_USER_ID, CR_INT_STAGE, CR_INT_STATUS in period; join to user_details; map stage/status via dashboard_det. | claim_remarks, user_details, dashboard_det | CR_UPDATE_DATE, CR_USER_ID, CR_INT_STAGE, CR_INT_STATUS, UD_USER_ID, dash_stage, dash_status |

| **3.2** | Time Spent Per Claim | Estimated working hours per day and number of claims processed to derive avg time per claim. | For each user and day: count claims (CR_UPDATE_DATE); assume working hours; compute time per claim. | claim_remarks, user_details | CR_UPDATE_DATE, CR_USER_ID |

| **3.3** | User-wise Productivity Heatmap | Top 10/20 users by claim volume; heatmap of claims by user and stage/period. | Count claims by CR_USER_ID (and optionally CR_INT_STAGE, period); display as heatmap. | claim_remarks, user_details, dashboard_det | CR_USER_ID, CR_INT_STAGE, CR_INT_STATUS |

| **3.4** | Query Raised vs Resolved | Count of NMI/queries raised and resolved; % of claims with query raised. | Use claim_remarks stages/statuses that indicate query raised vs resolved; count and % over total processed. | claim_remarks, user_details, dashboard_det | CR_UPDATE_DATE, CR_INT_STAGE, CR_INT_STATUS |

| **3.5** | Avg. Query Resolution Time | Average days from NMI raised to NMI reply per claim. | For each claim: find NMI raised and reply dates in claim_remarks; DATEDIFF; then AVG across claims. | clm_intmtn, clm_submtn, claim_remarks | CR_UPDATE_DATE, CI_INTIMATION_ID |

  

---

  

## 8. Glossary (for client & stakeholders)

  

| Term | Meaning |

|------|--------|

| **Intimation** | A claim registration (one record in clm_intmtn per claim). |

| **Submission** | Bill/submission details for that claim (clm_submtn); linked by intimation ID. |

| **Settlement** | Payment/settlement record (clm_stlmnt); optional per claim. |

| **Stage** | Workflow stage (e.g. 13 = Settlement). |

| **Status** | S = Settled, P = In process, X = Rejected (and other codes). |

| **TAT** | Turnaround time (e.g. days from admission/submission to processing). |

| **SLA** | Service-level agreement (e.g. process within 7 days). |

| **NMI** | Query/remark raised on a claim; “query raised vs resolved” refers to these. |

| **CGHS** | Central Government Health Scheme. |

  

---

  

## 9. Quick reference – where to look

  

- **“Which tables and columns does this KPI use?”** → This KT doc (sections 5–7) and the **Dashboard-specific ER diagrams** in ECHS_ER_Diagram.html.  

- **“What does this number mean for the business?”** → Column “What we show (stakeholder)” in the KPI tables above.  

- **“How is this number calculated technically?”** → Column “How we calculate” and the **Dashboards and KPIs** section in ECHS_ER_Diagram.html (with sample SQL where provided).  

- **“What does the full database look like?”** → ECHS_ER_Diagram.html (full ER diagram + “All tables and columns”).  

- **“How will the dashboard look and behave?”** → ECHS_Dashboard_Wireframe.html (wireframe with filters and sample charts).

  

---

  

*Document version: 1.0 – for client and stakeholder KT.*