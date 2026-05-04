---
owner: Divyaraj Murugan
feature: "[[Deals]]"
version: 1
status: Done
priority: Medium
tags:
  - sparrowcrm/features/deals/v1
---
# Deal Record — Field Descriptions

> Source: `crm-server/src/modules/core/objects/core/services/stage/object-stage-records.service.ts` + `deal-events.types.ts` + relationship constants + pipeline.model.ts + client constants

## Field Categories

|Category|Meaning|
|---|---|
|**Primary**|Core field stored directly on the `deals` table.|
|**Custom**|Field stored in the attribute values system (not a direct column on the deals table). Includes pipeline/stage attributes.|
|**AI**|Computed by AI agents. Non-editable by users.|

---

## Full [[Fields]] Reference

|Column Name|Field Type|Category|Editable|Required|Description|
|---|---|---|---|---|---|
|**Deal Name**|Text|Primary|Yes|Yes|The name of the opportunity/deal (e.g., "Acme - Enterprise Plan Renewal Q 4"). This is the display name shown in pipeline views, list views, and on the Kanban board cards.|
|**Deal Value**|Currency|Custom|Yes|No|The monetary value of this deal. Stored in the attribute values system as a currency type. Displayed on Kanban cards and used for pipeline aggregations (e.g., total value per stage). Supports different currencies.|
|**Pipeline**|Pipeline (reference)|Custom|Yes|Yes|Which sales pipeline this deal belongs to. A pipeline is a sequence of stages representing your sales process. Each deal lives in exactly one pipeline at a time. Stored via `value_pipeline_id` in `object_attribute_reference_values`. The `pipelines` table holds: name, description, and is linked to an object and attribute.|
|**Pipeline Stage**|Pipeline Stage (reference)|Custom|Yes|Yes|The current stage of this deal within its pipeline. Stored via `value_stage_id` in `object_attribute_reference_values`. Stages have a name, color code, and position (order). Moving a deal between stages is tracked in the timeline, synced to ClickHouse for stage-duration analytics, and recalculates any aggregations (like total value per stage).|
|**Deal Owner**|User (reference)|Primary|Yes|No|The CRM user (sales rep) responsible for closing this deal. FK to the `users` table. Used for forecasting, territory views, and rep-level pipeline reports.|
|**Close Date**|Date|Custom|Yes|No|The expected or actual close date for this deal. Used for forecasting, pipeline aging reports, and sales velocity calculations.|
|**Created By**|User (reference)|Primary|No|Auto|The CRM user who created this deal record. Automatically set at creation time. Non-editable audit trail.|
|**Deal Status**|Status|Custom|Yes|No|The overall status of the deal. Typically tracks whether the deal is Open, Won, or Lost — distinct from the pipeline stage which tracks where the deal is in the process.|
|**Probability**|Number|Custom|Yes|No|The likelihood (0-100%) that this deal will close. Often auto-set based on the pipeline stage but can be manually overridden by the rep. Used in weighted forecasting.|
|**Fit Score**|Number (0-100)|AI|No (non-editable)|No|AI-computed score measuring how well this deal aligns with your ideal deal profile. Same scoring engine as Contact/Company Fit.|
|**AI Summary**|Text|AI|No|No|An AI-generated deal summary synthesizing the deal's properties, linked contacts, associated company, meeting history, and email activity. Created by the SUMMARIZE_RECORD agent.|
|**Linked Contacts**|Association|Custom|Yes|No|Many-to-Many link to Contact records. A deal typically has multiple contacts — the buyer, champion, decision-maker, technical evaluator, etc. Attribute slug: `deal_contacts` ↔ `contact_deals`. Bidirectionally synced.|
|**Company**|Association|Custom|Yes|No|Many-to-One link to a Company record. Each deal is tied to one company (the account being sold to). Attribute slug: `deal_company` ↔ `company_deals`.|
|**Linked Meetings**|Association|Custom|Yes|No|Many-to-Many link to Meeting records. Meetings tagged to this deal — discovery calls, demos, negotiation sessions, etc. Attribute slug: `deal_meetings` ↔ `meeting_deals`.|

---

## How Pipelines & Stages Work

Pipelines are defined per account in the `pipelines` table, each linked to an object type (Deal) and a specific attribute (`object_attribute_id`). Stages live in the `stage_attribute_values` table as children of a pipeline (`pipeline_id`).

Each stage has a **name**, **color_code**, and **position** (order). When a deal moves stages, the system records the move in the object timeline, updates ClickHouse analytics (for stage duration metrics), and recalculates any view aggregations (like summing deal value per stage on the Kanban board).

The Kanban board view groups deals by stage. Each stage column shows its records plus an aggregation header (e.g., total deal value in that stage). Pagination is per-stage — you can scroll within a stage column independently.

---

## Deal Events (Message Queue)

When deals are created or updated, events are published to the message queue:

- **DealCreatedMessage**: `{ accountId, payload: { dealId, objectId, createdBy } }`
- **DealsBulkCreatedMessage**: `{ accountId, payload: { deals: [{ dealId, objectId, createdBy }] } }`
- **DealUpdatedMessage**: Fired on every attribute change, includes the attribute details

These events trigger downstream consumers: ClickHouse analytics sync, OpenSearch index update, and any automation workflows.