---
owner: Divyaraj Murugan
feature: "[[Contacts]]"
version: 1
status: Draft
priority: Medium
tags:
  - sparrowcrm/features/contacts/v1
related:
  - "[[Contacts_v1]]"
  - "[[Deal_v1]]"
  - "[[Meetings_v1]]"
  - "[[Apollo.io Enrichment — Field Reference]]"
  - "[[Workflows_v1]]"
  - "[[Fields]]"
  - "[[Ai Fields]]"
  - "[[Project admin settings]]"
  - "[[Domain diagram]]"
  - "[[Import_v1]]"
  - "[[Ai Signals]]"
  - "[[Users tab]]"
  - "[[Enriched Fields]]"
  - "[[Hygiene Agent_v1]]"
  - "[[Known Unknown Matrix]]"
---
## Field Categories

|Category|Meaning|
|---|---|
|**Primary**|Core field stored directly on the `companies` table. User enters manually or via import/API.|
|**Enriched**|Auto-populated by the AI enrichment engine from the company domain. User can also edit manually.|
|**Custom**|Pre-configured dropdown/status fields or associations. Stored in the attribute values system.|
|**AI**|Computed by AI agents. Non-editable by users (system-generated).|

---

## [[Field Reference

| Column Name                | Field Type           | Category | Editable          | Required | Description                                                                                                                                                                                                                                                               |
| -------------------------- | -------------------- | -------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Company Name**           | Text                 | Primary  | Yes               | Yes      | The official name of the organization. This is the display name shown across the CRM — in list views, on deal records, and in contact associations.                                                                                                                       |
| **Company Domain**         | Text                 | Primary  | Yes               | Yes      | The company's primary web domain (e.g., `acme.com`). Used as the deduplication key for companies — two companies cannot share the same domain within an account. Also used to match contacts to companies automatically during enrichment.                                |
| **Company Owner**          | User (reference)     | Primary  | Yes               | No       | The CRM user (typically an account executive or CSM) responsible for this company. FK to the `users` table. Used for territory management, ownership-based views, and access control.                                                                                     |
| **Company LinkedIn URL**   | URL                  | Primary  | Yes               | No       | Link to the company's LinkedIn page. Can be entered manually or auto-populated by enrichment. Useful for quick research before calls.                                                                                                                                     |
| **Company Logo URL**       | URL                  | Primary  | No                | No       | URL to the company's logo image. Auto-populated by enrichment from the company's domain (typically pulled from Clearbit or similar). Displayed as an avatar in list views and record headers.                                                                             |
| **Company About Us**       | Text                 | Primary  | Yes               | No       | A free-text description of what the company does. Can be manually entered or pulled from enrichment data.                                                                                                                                                                 |
| **Company Timezone**       | Text                 | Primary  | Yes               | No       | The company's primary timezone. Useful for scheduling outreach and meetings at appropriate times.                                                                                                                                                                         |
| **Company Size**           | Text                 | Primary  | Yes               | No       | A label describing the company's size tier. May overlap with Employee Range from enrichment but is a user-editable field.                                                                                                                                                 |
| **Company Ownership Type** | Text                 | Primary  | Yes               | No       | The company's ownership structure (e.g., Public, Private, Government, Non-profit). Helps classify accounts for segmentation.                                                                                                                                              |
| **Created By**             | User (reference)     | Primary  | No                | Auto     | The CRM user who created this company record. Automatically set at creation time. Non-editable — serves as audit trail.                                                                                                                                                   |
| **Location**               | Location (composite) | Enriched | Yes               | No       | The company's HQ location. Composite field with sub-properties: Country, State, City, Zip, Address, Time Zone. Auto-filled by enrichment from the domain.                                                                                                                 |
| **Revenue**                | Currency             | Enriched | Yes               | No       | The company's annual revenue. Auto-populated by the enrichment engine. Stored as `companyRevenue` (text label like "$10M–$50M") and `companyRevenueNumeric` (actual number). Used for ICP scoring and segmentation.                                                       |
| **Employee Count**         | Number               | Enriched | Yes               | No       | The total number of employees at the company. Auto-populated by enrichment. Available as both an exact number (`companyEmployeeCount`) and a range (`companyEmployeeRange` like "51-200").                                                                                |
| **Primary Industry**       | Text                 | Enriched | Yes               | No       | The company's main industry vertical (e.g., "SaaS", "Healthcare", "Financial Services"). Auto-populated from enrichment data (`companyPrimaryIndustry`).                                                                                                                  |
| **Industries**             | Multi-value          | Enriched | Yes               | No       | All industries the company operates in. A company may span multiple verticals. Auto-populated from `companyIndustries`.                                                                                                                                                   |
| **Company Type**           | Text                 | Enriched | Yes               | No       | Classification of the company (e.g., "B2B", "B2C", "Marketplace"). Auto-populated by enrichment. Useful for filtering and segmentation.                                                                                                                                   |
| **Company Website**        | URL                  | Enriched | Yes               | No       | The company's full website URL. May differ from the domain (e.g., domain is `acme.com`, website is `https://www.acme.com/en`). Auto-populated by enrichment.                                                                                                              |
| **Company Phone**          | Phone Number         | Enriched | Yes               | No       | The company's main phone number. Auto-populated by the enrichment engine.                                                                                                                                                                                                 |
| **Company Country**        | Text                 | Enriched | Yes               | No       | The country where the company is headquartered. Part of the enrichment output.                                                                                                                                                                                            |
| **Company State**          | Text                 | Enriched | Yes               | No       | The state/region where the company is headquartered. Part of the enrichment output.                                                                                                                                                                                       |
| **Fit Score**              | Number (0-100)       | AI       | No (non-editable) | No       | Measures how closely this company matches your Ideal Customer Profile (ICP). Same scoring engine as Contact Fit Score — admin-configured parameters with High/Mid/Low importance weights. Supports multiple audience-filtered scores (e.g., "Enterprise Fit", "SMB Fit"). |
| **AI Summary**             | Text                 | AI       | No                | No       | An AI-generated summary of the company, synthesizing its profile data, linked contacts, active deals, and recent activity. Created by the SUMMARIZE_RECORD agent.                                                                                                         |
| **Linked Contacts**        | Association          | Custom   | Yes               | No       | One-to-Many link to Contact records. A company can have many contacts. Attribute slug: `company_contacts` ↔ `contact_company`. Bidirectionally synced — adding a contact here also sets the contact's Company field.                                                      |
| **Linked Deals**           | Association          | Custom   | Yes               | No       | One-to-Many link to Deal records. A company can have many deals across its lifetime. Attribute slug: `company_deals` ↔ `deal_company`.                                                                                                                                    |
| **Linked Meetings**        | Association          | Custom   | Yes               | No       | One-to-Many link to Meeting records. Company-level meetings (QBRs, kickoffs, etc.). Attribute slug: `company_meetings` ↔ `meeting_company`.                                                                                                                               |

---

## How Enrichment Fills Company Fields

When a company is created with just a domain, the enrichment engine can auto-fill: `companyName`, `companyWebsite`, `companyCountry`, `companyState`, `companyType`, `companyRevenue`, `companyRevenueNumeric`, `companyPhone`, `companyEmployeeCount`, `companyEmployeeRange`, `companyPrimaryIndustry`, `companyIndustries`.

Additionally, when a contact is enriched, any company-level fields discovered (companyName, companyWebsite, etc.) can be used to auto-create or link the contact to an existing Company record by domain matching.