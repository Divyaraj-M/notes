
- Impacting areas 
	- Assign modal will be now Artifacts based not on the global level - Design 
	- Share modal will be changed for both artifacts  - Design 
	- Project health - Design 
	- ability to add obligations from the proposal - Desgin 
	- Porgress bar - will be now artifact based not on global level 
	- Share modal will be similar to google doc to match with doc
		- Viewer
		- Commenter
		- Editor 
		- Owner
	- Due dates need to alinged with the proposals
	- ==Download preview screen==
	- PRoject Lisitng screen 
		- Document type 
		- Progress

	- Only Proposal 
	- RFx with proposal 
	- Only RFP
- No correct the temaplete shoudl live outside ,  If I want to create a teamplate wit dorrefnt bradn colors , i should be able to  So How it will be is and Account can have many brand themes and many temaplets but unliked , so that while creation they can choose freely the colors and brand temaplest  Now we will got throught the next unknows  the actually i can be one one signle docuemtn and under for each page page i cna mark as frond whatever it is not marked it is content page ,and last page is last page , 
- 
- - A layout container that holds sub-elements (text + image side by side)? any like gamma blokcs ,We are calling it is as section, each can have  Headersm(compulsary) sub heeaders text etih fonsts na riche text , iamages side by i can use it like taht isnde that 
- 
- 1. Who creates vs. who consumes? There are three types of temaplets where it eill lives which is Brand teamplates (company's temaptes),  My teamplate which the user can create thier own teamplets , and Geneie teamplates which We will rpovide as stadnrd temapltes
-     
-     1. each will created and consusumed b y diffenrent users , 
-         1. Bradn temaples will creatd and modifed by admins and used by users 
-         2. My temapletd creadte by them and used by them - it will lives insde the My temaplte section in Poroosal lsiiting page 
-         3. Genie temaplest will craeted by us and used by them 
- 2. . The AI boundary — what exactly is locked? so these are called section control where an AI User or admin who creates the temapletd can tell what blocks that ai can touch and rewirte and which it cannot there are two  types of it 
-     
-     1. Brand locked - AI cant edit this ?
-     2. Not brand lockerd - AI can rewrite these thing from the KH 
- 3. Versioning and inheritance: Since the useer will create a copy formt he teamplate not exaltly linked so the old one whch is create will be as same no changed if anythign changed in temaplete 
-     
- 4. Cover page "multiple pages" — is this variants or sequential? When you say a cover page can have multiple pages, do you mean:
-     
- 
- - Variants: 3 cover page designs, proposal manager picks one
- - Sequential: Cover page 1 (title), Cover page 2 (table of contents), Cover page 3 (executive summary intro) — all included in order
-     - I mean there here is a cover page can have conslusion appecides and something more on kidna that 
- 
- Can admins save blocks to a shared block library that can be reused across templates? Like "Legal Disclaimer block" — create once, insert into any template? Or is every block template-specific? no reaured for v1
Impact Areas
- Mapping screen - How to show multiple documents with different formats 
-  Download Preview screen
- Download options 
- Project Health Screen

[[Proposal Creation Flow]]
Action
- Create the proposal using ai
	- With themes , default KH , or all hubs selected with ablity to wiret promts iwht all th communication  and RFPs and attachments 
	- Templates - Just have the templates and creat with ai 
- Start with blank 
	- Templates 
[[Import_v1]]
- Should be thught through 
	- Permission sets 
	- Importing different data types 
	- Non supported files 
	- Template 
	- Review the changes 
- What is attio doing 
# SparrowCRM — Review Values Error Matrix (V1)

## Text

| Scenario            | Error Message           | User Action       | Needs Dropdown? |
| ------------------- | ----------------------- | ----------------- | --------------- |
| Empty required text | This field is required. | Add value or skip | No              |

---

## Email

| Scenario                  | Error Message                                    | User Action                      | Needs Dropdown? |
| ------------------------- | ------------------------------------------------ | -------------------------------- | --------------- |
| Invalid email format      | Enter a valid email address.                     | Edit value                       | Yes             |
| Multiple emails detected  | Multiple email addresses detected.               | Split emails automatically       | Yes             |
| Wrong separator           | Use commas to separate multiple email addresses. | Replace separator                | Yes             |
| Duplicate email in file   | This email appears multiple times in the file.   | Keep latest or review duplicates | Yes             |
| One invalid email in list | One or more email addresses are invalid.         | Remove invalid email             | Yes             |
| Empty required email      | Email address is required.                       | Add email                        | Yes             |

---

## Phone

| Scenario                         | Error Message                                   | User Action                       | Needs Dropdown? |
| -------------------------------- | ----------------------------------------------- | --------------------------------- | --------------- |
| Invalid phone number             | Enter a valid phone number.                     | Edit value                        | Yes             |
| Too short                        | Phone number is too short.                      | Edit value                        | Yes             |
| Invalid characters               | Phone number contains invalid characters.       | Remove invalid characters         | Yes             |
| Wrong separator                  | Use commas to separate multiple phone numbers.  | Replace separator                 | Yes             |
| Missing country code             | Add a country code or select a default country. | Add country code                  | Yes             |
| Multiple phone numbers detected  | Multiple phone numbers detected.                | Split phone numbers automatically | Yes             |
| One invalid phone number in list | One or more phone numbers are invalid           | Remove invalid phone number       | Yes             |


---

## Date

| Scenario        | Error Message                            | User Action           | Needs Dropdown? |
| --------------- | ---------------------------------------- | --------------------- | --------------- |
| Invalid date    | Enter a valid date.                      | Edit date             | Date picker     |
| Wrong format    | Date does not match the selected format. | Change format or edit | Date picker     |
| Impossible date | This date does not exist.                | Edit date             | Date picker     |
| Ambiguous date  | This date format is ambiguous.           | Select date format    | Date picker     |


---

## Number

| Scenario                   | Error Message                       | User Action         | Needs Dropdown? |
| -------------------------- | ----------------------------------- | ------------------- | --------------- |
| Invalid number             | Enter a valid number.               | Edit value          | No              |
| Too many decimals          | Too many decimal places.            | Round or edit value | No              |
| Number below allowed range | Value is below the allowed range.   | Edit value          | No              |
| Number above allowed range | Value exceeds the allowed range.    | Edit value          | No              |
| Wrong decimal separator    | Check the decimal separator format. | Edit value          | No              |

---

## Currency

| Scenario               | Error Message                                | User Action        | Needs Dropdown? |
| ---------------------- | -------------------------------------------- | ------------------ | --------------- |
| Invalid currency value | Enter a valid currency amount.               | Edit value         | No              |
| Mixed currencies       | Multiple currencies detected in this column. | Normalize currency | Yes             |
| Unsupported currency   | Currency is not supported.                   | Change currency    | Yes             |


---

## Select

|Scenario|Error Message|User Action|Needs Dropdown?|
|---|---|---|---|
|Option not found|This option does not exist.|Map or add option|Yes|
|Archived option|This option is archived.|Select another option|Yes|
|Typo detected|No matching option found.|Map to existing option|Yes|
|Duplicate option|This option already exists.|Use existing option|Yes|

---

## Multi-select

|Scenario|Error Message|User Action|Needs Dropdown?|
|---|---|---|---|
|Invalid option|One or more options do not exist.|Map or add invalid options|Yes|
|Wrong separator|Use commas to separate values.|Replace separator|No|
|Too many values|Too many values selected.|Remove extra values|No|
|Duplicate values|Duplicate values will be ignored.|Remove duplicates|No|

---

## Yes/No

|Scenario|Error Message|User Action|Needs Dropdown?|
|---|---|---|---|
|Invalid boolean value|Use Yes/No, True/False, or 1/0.|Map value|Yes|
|Unknown value|This value cannot be recognized as Yes or No.|Map value|Yes|
|Empty required value|A value is required.|Select value|Yes|

---

## URL

| Scenario             | Error Message               | User Action       | Needs Dropdown? |
| -------------------- | --------------------------- | ----------------- | --------------- |
| Invalid URL          | Enter a valid URL.          | Edit URL          | No              |
| Invalid LinkedIn URL | Enter a valid LinkedIn URL. | Edit URL          | No              |


---

## Domain

| Scenario                | Error Message                                             | User Action           | Needs Dropdown? |
| ----------------------- | --------------------------------------------------------- | --------------------- | --------------- |
| Invalid domain          | Enter a valid company domain.                             | Edit domain           | Yes             |
| Email instead of domain | Use a domain instead of an email address.                 | Extract domain        | Yes             |
| Website URL entered     | Only the domain is needed.                                | Auto-clean URL        | Yes             |
| Public email domain     | Public email domains cannot be used for company matching. | Skip company matching | Yes             |

---

## User

| Scenario             | Error Message                     | User Action         | Needs Dropdown? |
| -------------------- | --------------------------------- | ------------------- | --------------- |
| User not found       | No matching workspace user found. | Select another user | Yes             |
| Multiple users match | Multiple users match this value.  | Choose correct user | Yes             |
| Inactive user        | This user is inactive.            | Select active user  | Yes             |

---

## Status

|Scenario|Error Message|User Action|Needs Dropdown?|
|---|---|---|---|
|Invalid status|This status does not exist.|Select valid status|Yes|
|Archived status|This status is archived.|Select another status|Yes|

---

## Pipeline Stage

| Scenario              | Error Message                                        | User Action          | Needs Dropdown? |
| --------------------- | ---------------------------------------------------- | -------------------- | --------------- |
| Stage not found       | This stage does not exist.                           | Map stage            | Yes             |
| Stage not in pipeline | This stage does not belong to the selected pipeline. | Select valid stage   | Yes             |
| Archived stage        | This stage is archived.                              | Select another stage | Yes             |

---

## Relationship

|Scenario|Error Message|User Action|Needs Dropdown?|
|---|---|---|---|
|Record not found|No matching record found.|Select or create record|Yes|
|Multiple matches|Multiple matching records found.|Choose record|Yes|
|Duplicate association|This relationship already exists.|Ignore duplicate|No|

---

## Rating

|Scenario|Error Message|User Action|Needs Dropdown?|
|---|---|---|---|
|Invalid rating|Enter a valid rating.|Edit value|No|
|Rating out of range|Rating is outside the allowed range.|Edit value|No|

---

## Timestamp

|Scenario|Error Message|User Action|Needs Dropdown?|
|---|---|---|---|
|Invalid timestamp|Enter a valid date and time.|Edit value|No|
|Unsupported timezone|Timezone is not supported.|Change timezone|Yes|

---

## Location

|Scenario|Error Message|User Action|Needs Dropdown?|
|---|---|---|---|
|Invalid location|Enter a valid location.|Edit location|No|
|Unknown country|Country could not be recognized.|Select country|Yes|

---

