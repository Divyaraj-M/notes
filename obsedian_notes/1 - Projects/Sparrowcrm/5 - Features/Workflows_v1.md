---
owner: "[[@Nayan Jain]]"
---
## 1. Overview

### What It Is

Workflows is a no-code visual automation builder inside SparrowCRM. A workflow starts with one **trigger** (the event that starts the automation) and executes one or more sequential **action blocks**. Every input field inside any block is **dynamic** — available fields and selectable values change based on the object or list selected in that block, and can be filled with either static values or **variables** passed down from prior blocks.

### Core Design Principle: Everything Is Dynamic

This is the single most important concept for QA to understand:

> **Action block inputs are never static. Every field the user sees is driven by the object or list they select in that block — including all attribute names, types, and allowed values.**

When a user picks **People** as the object in a "Create Record" block, the attribute fields shown are exactly the attributes defined on the People object (Name, Email, Phone, Company, Stage, etc.). If they instead pick **Companies**, all the fields change to Company attributes (Domain, Name, Revenue, Industry, etc.). The same applies to Lists: when a user picks a list like "Sales Pipeline", the list attribute fields (Stage, Owner, Deal Value, Close Date, etc.) are the attributes defined on _that specific list_, not on any generic template.

Variables work the same way — the variable picker only surfaces values that are type-compatible with the field being filled.

---

## 2. Data Model Fundamentals (Required Context for QA)

Understanding the SparrowCRM data model is essential before writing test cases for workflows.

### Objects

Objects are the core record types in SparrowCRM (e.g., People, Companies, Deals, or custom objects). Each object has a set of **attributes** — some system-defined (e.g., Name, Email for People), and some custom-defined by the workspace admin. Attributes have types: text, number, currency, date, select, multi-select, checkbox, email, phone, etc.

### Lists

A list is a curated collection of records from a **single parent object**. A list called "Sales Pipeline" may have People as its parent object. A list has two kinds of attributes:

- **Object attributes** — inherited from the parent object (e.g., Name, Email from People)
- **List attributes** — additional fields defined specifically on this list entry (e.g., Stage, Owner, Deal Value, Close Date — these exist only in the context of that list entry, not on the People record itself)

**QA implication:** When a workflow action block targets a list, the field picker must show both the parent object's attributes AND the list's own attributes. A workflow targeting only an object should not show list attributes.

### Variables

Variables are runtime values passed from one block to the next. When a trigger fires, it emits a set of typed variable outputs (e.g., "Triggered record", "Who triggered", "Timestamp", "New value", "Previous value"). Each subsequent block can use these variables in any compatible field — the variable picker is type-aware and only offers variables matching the expected field type.

---

## 3. Entry Points

- Left sidebar nav: **Automation → Workflows** (Sequences is a sibling item)
- URL: `/workflows`

---

## 4. Workflow Listing Page

### 4.1 Empty State

- Shown when no workflows exist in the workspace
- Illustration + message: _"No workflows yet! Create your first workflow to get started."_
- CTAs: **+ New Workflow** (top right and center of empty state)
- Search bar ("Search for workflows...") and filter icon visible

### 4.2 Populated Table View

|Column|Type|Notes|
|---|---|---|
|Workflow Name|Text link|Clickable — opens workflow builder|
|Runs|Number|Total execution count (formatted: 3.2 k, 124)|
|Status|Badge|Active (green) / Draft (grey)|
|Created by|Avatar + Name|Creator of the workflow|
|Last published|Date|Timestamp of last publish action|
|Last failed run|Date|Timestamp of the most recent failed run|

**Hover behaviour:** Hovering a table row shows a popover with:

- Total Runs
- Failed Runs count
- Owner name

### 4.3 Row Context Menu (3-dot)

- **Duplicate workflow** — copies the workflow into Draft state
- **Archive workflow** — soft-deletes; workflow stops running
- **Delete workflow** — hard-delete, shown in red (destructive, requires confirmation)
- **Edit workflow**

### 4.4 Header Controls

- Search — filters list by workflow name in real time
- Filter icon — filter by Status, Created by, date range
- **+ New Workflow** — opens the builder

---

## 5. Workflow Builder — Layout

The builder is a full-page editor with two zones:

**Left: Canvas**

- The visual flow diagram — a vertical chain of connected blocks
- Each block is a card with an icon, name, and a "Records" badge
- Blocks are connected by lines/arrows showing execution order
- Zoom controls (percentage) at the bottom
- Grid view toggle
- Pan mode toggle (`H` key or hand icon)

**Right: Configuration Panel**

- Context-sensitive panel for the currently selected block
- Shows all inputs, dropdowns, and variable pickers for that block
- Changes entirely when a different block is selected on the canvas

**Builder Header:**

- Workflow name (editable inline, defaults to "Untitled workflow")
- Edit (pencil), Refresh, Delete (trash) icon buttons
- Permission notice banner — shown when the user lacks write access to an object or list used in a block
- **Publish Workflow** button (primary CTA, top right)

---

## 6. Trigger Blocks

A workflow has exactly **one trigger**. Triggers define the starting condition and emit typed **variable outputs** that all downstream blocks can use.

When no trigger is configured, the canvas shows:

- Prompt: _"Set a trigger in the sidebar"_
- Alternative: _"Start with a template"_

### 6.1 Record Triggers

Used when the workflow is based on a specific **object** (e.g., People, Companies, Deals, or any custom object).

### Record Command (v 2)

- Adds a "Run workflow" button to every record of the selected object
- Can also be triggered by bulk-selecting records in a table view → Run workflow
- **Config:** Object (required) — dropdown of all available objects
- **Variable outputs:** Triggered record data

### Record Created

- Fires every time a new record is created for the selected object
- **Config:** Object (required) — dropdown of all available objects
- **Variable outputs:** Record data, who triggered, when triggered

### Record Updated

- Fires every time a record of the selected object is updated
- **Config:**
    - Object (required) — dropdown of all available objects
    - Attribute (optional) — if selected, only fires when _that specific attribute_ changes. Dropdown shows only the attributes defined on the selected object
- **Variable outputs:** Record data, who triggered, when triggered, new value + previous value (only when a specific attribute is selected)
- **Note:** Does NOT fire when a list attribute (not object attribute) is updated

### 6.2 List Triggers

Used when the workflow is based on entries in a specific **list**.

### List Entry Command (v 2)

- Adds a "Run workflow" button to entries in the selected list
- Can be triggered via checkbox selection + Run workflow in any list view
- **Config:** List (required) — dropdown of all lists the user has access to
- **Variable outputs:** List entry data

### List Entry Updated

- Fires every time an entry within the selected list is modified
- **Config:**
    - List (required) — dropdown of all accessible lists
    - Attribute (optional) — dropdown shows only the **list attributes** of the selected list (not parent object attributes)
- **Variable outputs:** Entry data, who triggered, when triggered, new value + previous value (only when attribute selected)
- **Note:** Only monitors list attributes, NOT object attributes. For object attribute changes, use Record Updated

### Record Added to List

- Fires every time any new record is added to the selected list
- **Config:** List (required)
- **Variable outputs:** Entry data, who triggered, when triggered

### 6.3 Data Trigger

### Attribute Updated

- Fires when a specific attribute on any object or list is modified. Also fires when the attribute is first set during record/entry creation.
- **Config:**
    - Object or List (required) — first pick type (object vs list), then pick the specific object/list
    - Attribute (required) — dropdown shows only attributes of the selected object/list
- **Variable outputs:** Parent record data (for object attr) or entry data (for list attr), new value, previous value, who triggered, when triggered
- **Key difference from Record Updated:** Also triggers on record creation when the attribute is first populated

### 6.4 Tasks Trigger

### Task Created

- Fires when any new task is created
- No config inputs
- **Variable outputs:** Task data, who triggered, when triggered

### 6.5 Utilities Triggers

### Manual Run

- Runs the workflow on-demand via a "Trigger workflow" button on the workflow's detail page
- No record/entry context is passed — use a Find Records or Find List Entries block after this trigger to select what the workflow should act on
- **Variable outputs:** Who triggered, when triggered

### Recurring Schedule

- Fires on a defined schedule
- **Config:**
    - Frequency: Daily / Weekly / Monthly / Advanced (Cron expression)
    - Timezone
    - Daily: time of day
    - Weekly: day(s) of week + time of day
    - Monthly: day(s) of month + time of day
- **Variable outputs:** When triggered

### Webhook Received

- Fires when an HTTP POST request is sent to a generated webhook URL
- Content-Type of incoming request must be `application/json`
- **Variable outputs:** Webhook Payload Body (raw JSON string), when triggered
- Should be followed by a **Parse JSON** block to extract structured fields from the payload

---

## 7. Action Blocks

After the trigger, users add action blocks. Each block has:

- A **type** (e.g., Create Record, Add Record to List)
- **Inputs** — configuration fields whose available options change dynamically based on the object/list selected within that block
- **Variable outputs** — data it emits for use by subsequent blocks
- A **"+ Select block"** button at the bottom to chain the next step

All input fields offer a ** `{$} Use variable` ** option, which opens a variable picker showing all type-compatible variables emitted by prior blocks in the workflow.

---

## 8. Action Block Specifications

### 8.1 Records Actions

### Create or Update Record

Checks if a record already exists; updates it if so, creates it if not.

**Inputs:**

- **Object** (required) — dropdown of all available objects. _Once selected, all other fields below change to match the selected object's attributes._
- **Matching attribute** (required) — dropdown of unique attributes on the selected object (e.g., Email for People, Domain for Companies, ID for custom objects). Used to look up whether a record already exists.
- **Object attributes** (optional) — for each attribute on the selected object, user can optionally set a value. Each attribute field respects its type (text input for text, date picker for date, dropdown for select, etc.). Any field accepts a variable via `{$}`.
- **Overwrite multi-select values** (optional toggle) — when OFF (default), new values are added to existing multi-select values; when ON, existing values are replaced.

**Variable outputs:** Created/updated record data

---

### Create Record

Creates a new record. Does not check for duplicates.

**Inputs:**

- **Object** (required) — dropdown of all available objects. _All attribute fields below are driven by the selected object._
- **Object attributes** (optional) — same as above: attribute fields dynamically rendered for the selected object, each accepting static values or variables.

**Variable outputs:** Created record data

---

### Find Records

Finds existing records matching filter conditions, for use in later blocks.

**Inputs:**

- **Object** (required) — dropdown of all available objects. _The Condition filter fields below are driven by the selected object's attributes._
- **Condition** (required) — filter builder. Each filter rule allows selecting:
    - Attribute (dropdown of the selected object's attributes)
    - Operator (is, is not, contains, is greater than, etc. — operators shown depend on attribute type)
    - Value (field type matches attribute type; supports variable input)
    - Multiple conditions can be combined with AND/OR logic
    - Conditions can be grouped for advanced filtering
- **Limit** (required) — max records to return (max 100)

**Variable outputs:** Matching Records (list), Number of matches

---

### Update Record

Updates attribute values on an existing record.

**Inputs:**

- **Object** (required) — dropdown of all available objects. _Attribute checkboxes below are driven by the selected object._
- **Record** (required) — static record picker OR variable from a prior block
- **Attributes to update** (required) — checklist of all attributes on the selected object. Only checked attributes are written. For each checked attribute, user sets the new value (static or variable).
- **Overwrite multi-select values** (optional toggle) — same behaviour as Create or Update Record

---

### 8.2 Lists Actions

### Add Record to List

Adds a record as a new entry to a list.

**Inputs:**

- **List** (required) — dropdown of all lists the workflow has access to. _Once selected, the List attributes section below changes to show only the attributes defined on this specific list (not the parent object attributes)._
- **Record** (required) — the record to add. Must match the list's parent object type. Accepts static record or variable.
- **List attributes** (optional) — one field per attribute defined on the selected list. Each field is rendered according to attribute type. All support variable input.
    - Example: If the selected list is "Sales Pipeline" (parent: Companies), list attributes shown might be: Stage (select), Owner (user), Close Date (date), Deal Value (currency), Notes (text)
    - Example: If the selected list is "Key Partner Contacts" (parent: People), list attributes might be: Relationship type (select), Topics (multi-select), Contact owner (user)

**Variable outputs:** Created list entry data

---

### Delete List Entry

Removes an entry from a list. Does not delete the underlying record.

**Inputs:**

- **List** (required) — dropdown of all accessible lists
- **Entry** (required) — must be a list entry reference (not a record). Typically set via a variable from a prior block. Static selection also available.

---

### Find List Entries

Finds list entries matching filter conditions.

**Inputs:**

- **List** (required) — dropdown of all accessible lists. _Condition filter attributes below change to the selected list's attributes (both object and list attributes)._
- **Condition** (required) — filter builder. Attribute dropdown shows all attributes visible on that list (both the parent object's attributes and the list's own attributes). Same AND/OR and grouping logic as Find Records.
- **Limit** (required) — max entries to return (max 100)

**Variable outputs:** Matching list entries, Number of matches

---

### Update List Entry

Modifies attribute values on an existing list entry.

**Inputs:**

- **List** (required) — dropdown of all accessible lists. _Attribute checklist below changes to the selected list's attributes._
- **Entry** (required) — list entry reference. Variable from a prior block or static selection. Must be an entry, not a record.
- **Attributes to update** — checklist of list attributes for the selected list. Only checked attributes are written. For each checked attribute, set new value (static or variable). Only list attributes appear here (not the parent object's attributes).

---

### 8.3 Sequences Actions

### Enroll in Sequence

Adds a person record as a recipient to an email sequence.

**Inputs:**

- **Sequence** (required) — dropdown of all Sequences in the workspace
- **Recipient** (required) — must be a People record. Variable from a prior block. Cannot enroll Companies, list entries, or other entity types.
- **Sender** (required) — workspace member who sends the emails. Static user or variable.
    - The selected sender must have delegated sending enabled for the chosen sequence, or the run will fail.

**Variable outputs:** Enrolled successfully (true/false)

---

### Exit from Sequence

Removes a person from receiving future emails in a sequence.

**Inputs:**

- **Sequence** (required) — dropdown of all Sequences
- **Recipient** (required) — People record. Variable from a prior block.

**Variable outputs:** Exited successfully (true/false). Does not fail if recipient is not enrolled.

---

### 8.4 Tasks Actions

### Create Task

**Inputs:**

- **Task name** (required) — text or variable
- **Due date** (optional) — date picker or variable (date type)
- **Linked records** (optional) — record picker or variable. Links the task to a CRM record.
- **Assignees** (optional) — workspace user picker or variable. Assigned user is notified when the task is created.

**Variable outputs:** Created task data

---

### Complete Task (ignore, v 2)

Marks an existing task as complete.

**Inputs:**

- **Task** (required) — variable from a prior "Create Task" block, or static task selection

---

### 8.5 Conditions Actions

### Filter

Stops the workflow run if conditions are not met. If conditions are met, the run continues to the next block.

**Inputs:**

- **Condition** — filter builder. Attribute dropdown shows variables available from prior blocks (typed). Operators are type-dependent. Multiple conditions with AND/OR and grouping supported.

No variable outputs. Run either continues or stops.

---

### If / Else

Branches the workflow into two paths: **Is true** and **Is false**.

**Inputs:**

- **Condition** — same filter builder as Filter block

Each path (Is true / Is false) gets its own "Select block" to continue independently. Both paths can have their own subsequent action chains.

---

### Switch

Branches the workflow into multiple named paths. A Default path is always present.

**Inputs:**

- One condition per path. Each condition uses the same filter builder.
- Paths are evaluated in order (Condition 1, 2, 3, then Default). The first matching condition's path is taken.
- If no conditions match, the Default path runs. If Default has no blocks, the run stops silently.

---

### 8.6 Delays Actions

### Delay

Pauses the workflow for a specified duration before continuing.

**Inputs:**

- **Delay amount** (required) — number (static or variable)
- **Unit** (required) — Seconds / Minutes / Hours / Days / Weeks

---

### Delay Until

Pauses the workflow until a specific date/time.

**Inputs:**

- **Delay until** (required) — specific date/time (static or variable of date type)

---

### 8.7 Calculations Actions

### Adjust Time

Shifts a timestamp forward or backward by a defined offset. Useful for computing relative due dates.

**Inputs:**

- **Timestamp** (required) — fixed datetime or variable of date type
- **Offset** (required) — positive (forward) or negative (backward) number
- **Unit** (required) — Seconds / Minutes / Hours / Days / Weeks / Months / Years

**Variable outputs:** Adjusted timestamp

---

### Aggregate Values

Aggregates a list of numbers using sum, average, min, or max.

**Inputs:**

- **Values** (required) — variable pointing to a numeric attribute that may have multiple values
- **Type** (required) — Sum / Average / Min / Max

**Variable outputs:** Aggregated numeric result

---

### Formula

Evaluates a mathematical expression. Supports +, −, ×, ÷.

**Inputs:**

- **Formula** (required) — mathematical expression using numeric or currency variables from prior blocks

**Variable outputs:** Numeric result

---

### Random Number

Generates a random number between a min and max.

**Inputs:**

- **Minimum** (required) — number or variable
- **Maximum** (required) — number or variable

**Variable outputs:** Random number (numeric)

---

### 8.8 AI Actions

### Classify Record

Uses AI to classify a record into one or more tags based on all its attributes. Checks records and adds tag to them.

**Inputs:**

- **Record** (required) — variable from a prior block. Must be a record, not a list entry.
- **Tags** (required) — user-defined list of classification tags (press Enter after each)
- **Allow multiple tags** (optional toggle) — when ON, AI can assign more than one tag

**Variable outputs:** Selected tag(s)  
**Note:** Output is not saved automatically. Must be followed by an Update Record block to persist the tags to an attribute of type select/multi-select with matching tag values.

---

### Classify Text

Uses AI to classify input text into tags.

**Inputs:**

- **Input** (required) — text string or variable
- **Tags** (required) — user-defined list of tags
- **Allow multiple tags** (optional toggle)

**Variable outputs:** Selected tag(s)

---

### Prompt Completion (not to be added)

Uses AI to generate text based on a prompt.

**Inputs:**

- **Prompt** (required) — free text with optional variable references

**Variable outputs:** Generated text (string)

---

### Summarize Record

Uses AI to generate a text summary of a record's attributes.

**Inputs:**

- **Record** (required) — variable or static record selection
- **Guidance** (optional) — instructions on what aspects to summarize; supports variable references

**Variable outputs:** Summary text (string)

---

### 8.9 Agents Actions

### Research Record

Deploys an AI agent to research a record across the web and answer questions about it.

**Inputs:**

- **Record** (required) — must be a record (not a list entry), variable or static
- **Questions** (required, repeatable) — one or more free-text questions for the agent to answer. "Add question" button adds additional questions.

**Variable outputs:** One answer per question (string)  
**Note:** Output must be explicitly saved using a subsequent Update Record block.

---

### 8.10 Workspace Actions

### Broadcast Message (Not to be added)

Sends a notification popup to selected workspace members.

**Inputs:**

- **Style** (required) — Error (red) / Neutral (grey) / Success (green) / Warning (yellow)
- **Target** (required) — select which workspace users should see it
- **Title** (required) — text or variable
- **Description** (optional) — text or variable
- **Duration in seconds** (required) — how long popup stays visible; number or variable

---

### Round Robin (Not to be added)

Selects workspace users in rotation across successive workflow runs.

**Inputs:**

- **Users** (required) — select 2+ workspace members to rotate through

**Variable outputs:** Selected user (workspace member)

---

### 8.11 Utilities Actions

### Celebration

Shows a celebration animation to workspace members in the table view page.

**Inputs:**

- **Type** (required) — Confetti / Cannons / Fireworks (preview shown on selection in workflow itself)
- **Target** (All users/specific) — (All users is default)
    - select workspace users who see the animation (shows list of Users in the CRM)

---

### Loop

Iterates a set of child action blocks over a list of items.

**Inputs:**

- **Iterable** (required) — variable pointing to a multi-value attribute or a list of records/entries from a prior block
    - In the context of the Loop block, **Iterable** is the input that defines **what list of items the loop should cycle through**.
    - Since a loop's job is to repeat the same action(s) for multiple items, it needs to know _what those multiple items are_. The Iterable is that source — it must be a variable from a prior block that resolves to a **collection of values**, not a single value.
    - Two things can be an iterable:
        1. **A multi-value attribute on a record**  
            For example, a Company record might have a "Associated contacts" attribute that holds multiple people. Setting that as the iterable means the loop runs once per team member.
        2. **A list of records/entries from a Find block**  
            For example, a "Find Records" block returns "Matching Records" — a collection. Setting that as the iterable means the loop runs once per matched record.
- **Limit** (optional) — max iterations

On the canvas, loop child blocks are enclosed in a dotted rectangle. Blocks inside the dotted border run on each iteration; blocks placed after the dotted border run once after all iterations complete.

Variables available inside a loop:

- Current item
- Item position (integer)
- Number of items (integer)

---

### Parse JSON

Extracts structured fields from a raw JSON string (e.g., from a Webhook Received or HTTP Request block).

**Inputs:**

- **Raw JSON string** (required) — static JSON text or variable (string type from prior block)
- **Fields** (repeatable) — each field defines:
    - Path — JavaScript-style dot notation to the value (e.g., `contact.email[0]`)
    - Output type — Boolean / Number / Number Array / String / String Array
    - Alias (optional) — friendly name for the extracted value

**Variable outputs:** One typed variable per defined field

---

### Send HTTP Request

Makes an outbound HTTP request to an external system.

**Inputs:**

- **Method** (required) — DELETE / GET / HEAD / PATCH / POST / PUT
- **URL** (required) — text or variable (supports mixed static + variable)
- **Headers** (optional) — key/value pairs; values support variables
- **Content-Type header** (optional, required for POST/PUT) — text or variable
- **Body** (optional) — text with variable interpolation (e.g., JSON body with `{$}` values)

**Timeout:** 20 seconds  
**Variable outputs:** Response status code (number), Response body (string)

---

## 9. Variables System

### How Variables Work

Every block in a workflow can emit typed outputs. All downstream blocks can reference those outputs as variables in any input field that accepts a matching type.

### Variable Picker Behaviour

- Accessed by clicking `{$}` or the variable icon on any input field
- Shows only variables from **prior blocks** in the workflow (not from blocks that come after)
- Shows only variables whose type is compatible with the target field type
    - Example: a "Due date" field (date type) only shows date-type variables
    - Example: a "Record" field for an Update Record block only shows record-type variables matching the selected object
- Variables are named by block + field (e.g., "Record Created → Triggered record → Email")

### Variable Traversal

For object/record variables, users can traverse nested relationships:

- Record → Attribute (e.g., "Triggered record → Name")
- Record → Associated object → Attribute (e.g., "Triggered record → Associated Company → Domain")
- List entry → Object attribute OR List attribute (e.g., "List entry → Stage", "List entry → Record → Email")

---

## 10. Dynamic Field Loading

### When an Object is Selected in a Block

- All attribute input fields in that block are **re-rendered** to match the selected object
- Attributes shown = system attributes + all custom attributes defined on that object
- Attribute field types match their data type (date → date picker, select → dropdown with list values, multi-select → tag input, text → text field, etc.)
- If the user changes the object after already filling in attribute values, **all attribute fields clear and re-render for the new object**

### When a List is Selected in a Block

- For **"Add Record to List"** and **"Update List Entry"**: the list attribute section shows only the attributes defined on the selected list (not the parent object attributes for Add Record; only list attributes for Update)
- For **"Find List Entries"**: the filter attribute picker shows both the list's own attributes and the parent object's attributes (since both are filterable)
- For **"List Entry Updated" trigger**: the optional attribute filter shows only list attributes
- Changing the list selection clears and re-renders all list attribute fields

---

## 11. Workflow States & Lifecycle

|State|Description|Transitions|
|---|---|---|
|**Draft**|Being configured; does not run|→ Active (via Publish)|
|**Active**|Live; runs on trigger events|→ Draft (via Pause toggle), → Archived|
|**Archived**|Soft-deleted; stops running|Moves to Archived tab. Can be unarchived|

- Publish action: transitions Draft → Active. Shows confirmation popup.
- Pause toggle: transitions Active ↔ paused (shown as Active but suspended)
- Archive: available from listing row context menu
- Delete: hard-delete from context menu (requires confirmation dialog)

---

## 12. Publish Flow

1. User clicks **Publish Workflow** button
2. Confirmation popup appears listing:
    - Workflow name
    - Trigger summary
    - Number of action blocks
3. User confirms → workflow status changes to Active
4. Listing shows Active badge + Last published timestamp
5. Workflow begins responding to trigger events immediately

**Validation before publish:** The system should flag:

- Incomplete required inputs on any block
- Blocks with no connection to a trigger
- Type mismatches in variable assignments
- Missing list access permissions

---

## 13. Templates

- Accessible from the new workflow screen ("Start with a template")
- Pre-built trigger + action chain configurations
- On selection, the builder is pre-populated with the template's blocks, all editable
- Templates are not published immediately — user must configure and publish manually

---

## 14. Run History & Monitoring

### Listing Page Indicators

- **Runs** column: total executions
- **Last failed run** column: timestamp of most recent failure
- **Hover tooltip**: total runs + failed runs count + owner

### Expected Run Detail View (per workflow)

_(Scoped for a subsequent phase — not yet visible in current Figma)_

- List of individual runs with timestamp, status (success / failed / in-progress)
- Per-run detail: which block failed, error message, input values at time of failure
- Ability to re-run or debug a failed run

---

## 15. Permissions & Access

- A **permission notice banner** appears in the builder when the user lacks access to an object or list used in a workflow block
- Workflows need explicit **list access** granted in list permission settings before they can read/write a list
- Permission prompt appears inline when a list is selected: _"Do you want to grant this workflow read & write access to [list name]?"_
- Role-based gates (admin vs. member) for who can create, publish, archive, and delete workflows — exact permission matrix to be defined

---

## 16. QA Test Coverage Areas

The following are the key areas QA should prioritise for test case authoring:

### Dynamic Field Rendering

- Selecting a different object in any block re-renders all attribute fields correctly
- Selecting a different list in a list action block re-renders list attributes correctly
- Changing from object to another object clears previously filled values
- Correct input controls render for each attribute data type
- Multi-select vs. select shows appropriate controls

### Variable System

- Variable picker only shows prior-block variables (not downstream)
- Variable picker is type-filtered per target field
- Variables resolve correctly at runtime across different trigger types
- Traversal of nested relationships (record → associated record → attribute)
- Variables from conditional branches are scoped correctly (not accessible outside their branch)

### Trigger Behaviour

- Record Created fires only on creation, not on update
- Record Updated fires only on update, not on creation (unless attribute has no prior value)
- Attribute Updated fires on both creation and update (differs from Record Updated)
- List Entry Updated fires on list attribute changes, NOT on object attribute changes
- Recurring Schedule: daily/weekly/monthly fires at correct times and timezones
- Webhook Received: only fires on valid JSON POST; parses body correctly with Parse JSON block

### Action Block Inputs

- Required inputs block publish if empty
- "Create or Update Record" correctly upserts based on matching attribute
- "Overwrite multi-select" toggle: OFF adds, ON replaces
- "Add Record to List" correctly maps list attributes on different lists
- "Update List Entry" only shows and writes list attributes (not object attributes)
- "Find Records" / "Find List Entries" filter builder produces correct results; limit is enforced (max 100)
- Sequence enrollment fails gracefully if sender doesn't have delegated sending enabled
- AI blocks (Classify, Summarize, Prompt) do not auto-save — subsequent Update Record required
- "Send HTTP Request" timeout at 20 seconds; response body and status code available as variables

### Conditions & Branching

- Filter block: run stops when condition not met; run continues when met
- If/Else: run correctly routes to Is-true or Is-false path
- Switch: first matching condition's path taken; default fires when no condition matches
- Variable access is path-scoped (variables from Is-true branch not visible in Is-false branch)

### Loop Block

- Iterates the correct number of times
- "Current item", "Item position", "Number of items" variables available only inside the loop
- Steps after the loop border execute once after all iterations, not per iteration
- Limit is respected when set

### Workflow Listing

- Status badges (Active/Draft) reflect actual state
- Run count and last failed run timestamp update after workflow executions
- Hover tooltip shows correct counts
- Duplicate creates a Draft copy; does not inherit Active status
- Archive removes from active list; workflow stops running

### Publish & Validation

- Publish is blocked when required inputs are missing
- Publish is blocked when list access is not granted
- Confirmation dialog appears before publish
- Pausing an active workflow stops future runs
- Re-activating a paused workflow resumes runs

---

## 17. Out of Scope (v 1 — Not in Current Design)

- Per-run execution log / drill-down view
- Workflow versioning and rollback
- Workflow analytics dashboard (run volume over time, error rates)
- Multi-trigger workflows (more than one trigger per workflow)
- Cross-workspace sharing of workflows

---

_End of Document_