---
owner: Divyaraj Murugan
feature: "[[Meetings]]"
version: 1
status: Done
priority: High
tags:
  - sparrowcrm/features/meetings/v1
---
# Meeting Record — Field Descriptions

> Source: `crm-server/src/modules/core/meetings/core/services/meetings-attendee.service.ts` + `meeting-attendees.schema.ts` + relationship constants + meetings enums

## Field Categories

|Category|Meaning|
|---|---|
|**Primary**|Core field stored directly on the `meetings` table.|
|**Custom**|Field stored in the attribute values system or in related tables (attendees).|
|**AI**|Computed by AI agents. Non-editable by users.|

---

## Full [[Fields]] Reference

|Column Name|Field Type|Category|Editable|Required|Description|
|---|---|---|---|---|---|
|**Meeting Title**|Text|Primary|Yes|Yes|The name/subject of the meeting (e.g., "Discovery Call - Acme Corp", "Q 3 QBR with BigCo"). Displayed in the meeting list view and on associated contact/deal/company records.|
|**Start Time**|Timestamp|Primary|Yes|Yes|When the meeting begins. Stored with timezone information. Used for calendar views, scheduling conflict detection, and "upcoming meetings" displays on records.|
|**End Time**|Timestamp|Primary|Yes|Yes|When the meeting ends. Together with start time, determines the meeting duration.|
|**Meeting Type**|Select|Custom|Yes|No|Categorizes the meeting (e.g., Discovery Call, Demo, Negotiation, QBR, Kickoff, Check-in). Helps reps and managers filter meetings by purpose.|
|**Meeting Description**|Text|Custom|Yes|No|Free-text field for meeting agenda, notes, or additional context. Can be filled before the meeting (as an agenda) or after (as summary notes).|
|**Organizer**|User (reference)|Primary|Yes|Yes|The CRM user who scheduled this meeting. Automatically set to the creating user. In the `meeting_attendees` table, the organizer is stored with `role = ORGANIZER` and `attendeeType = USER`.|
|**Created By**|User (reference)|Primary|No|Auto|The CRM user who created the meeting record. Automatically set. Non-editable audit trail.|
|**Meeting Status**|Status|Custom|Yes|No|The current state of the meeting (e.g., Scheduled, Completed, Cancelled, No-show). Tracks whether the meeting actually happened.|
|**Location / Link**|Text/URL|Custom|Yes|No|Where the meeting takes place — a physical address, a Zoom/Google Meet link, or a conference room.|
|**AI Summary**|Text|AI|No|No|AI-generated summary of the meeting. If meeting notes or a transcript are available, the SUMMARIZE_RECORD agent synthesizes key points, decisions, and action items.|

---

## Attendees System

Meetings have a dedicated attendees model (`meeting_attendees` table) that is separate from the standard association system. This is because attendees need extra metadata that the generic reference values table doesn't support.

### Attendee Table Structure

|Column|Description|
|---|---|
|**meetingId**|FK → the meeting record|
|**attendeeType**|ENUM: `USER` (internal CRM user) or `CONTACT` (external contact from the CRM)|
|**attendeeId**|FK → either `users.id` or `contacts.id` depending on attendeeType (polymorphic)|
|**role**|ENUM: `ORGANIZER` or `ATTENDEE` |

### How It Works

When you add attendees to a meeting, the system creates rows in `meeting_attendees`. Each attendee is either an internal user (your team) or an external contact (the prospect/customer). The organizer is always a USER with `role = ORGANIZER`.

The `MeetingsAttendeeService` enriches attendee records with full details — for users it pulls their email, for contacts it pulls firstName, lastName, and email. This is done via lookup joins when fetching attendees, so the meeting view shows full names and details without extra API calls.

### Adding/Removing Attendees

- **Add**: Create new rows in `meeting_attendees` with the meeting ID, attendee type, and attendee ID
- **Remove**: The service handles organizer removal specially — you can't accidentally remove all organizers. Regular attendees (both users and contacts) are removed by matching meetingId + attendeeType + attendeeId
- **Bulk fetch**: For list views showing multiple meetings, `findBulkMeetingAttendees` fetches all attendees for a batch of meeting IDs in one query

---

## Association Fields (cross-object links)

| Column Name         | Field Type  | Category | Editable | Description                                                                                                                                                                                                                                      |
| ------------------- | ----------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Linked Contacts** | Association | Custom   | Yes      | Many-to-Many link to Contact records. All contacts attending this meeting. Attribute slug: `meeting_contacts` ↔ `contact_meetings`. Note: this is the association-level link, separate from the attendees table which carries the role metadata. |
| **Company**         | Association | Custom   | Yes      | Many-to-One link to a Company record. The company this meeting is associated with (useful for company-level meetings like QBRs). Attribute slug: `meeting_company` ↔ `company_meetings`.                                                         |
| **Linked Deals**    | Association | Custom   | Yes      | Many-to-Many link to Deal records. Deals this meeting is relevant to (e.g., a demo for a specific deal). Attribute slug: `meeting_deals` ↔ `deal_meetings`.                                                                                      |

---

## Key Design Note: Attendees vs. Associations

Meetings have **two** ways contacts are linked:

1. **Attendees table** (`meeting_attendees`) — carries the role (organizer vs. attendee) and type (user vs. contact). This is the structured, role-aware relationship.
2. **Association attributes** (`meeting_contacts` in `object_attribute_reference_values`) — the standard bidirectional link used across all objects.

Both exist because the generic association system doesn't support role metadata, but the CRM needs to know who organized vs. who attended. When a contact is added as an attendee, both systems are typically updated.