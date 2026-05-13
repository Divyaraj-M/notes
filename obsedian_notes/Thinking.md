
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

| Scenario                  | Error Message                      | User Action                | Needs Dropdown? |
| ------------------------- | ---------------------------------- | -------------------------- | --------------- |
| Invalid email format      | Invalid email                      | Edit value                 | Yes             |
| Multiple emails detected  | Multiple email addresses detected. | Split emails automatically | Yes             |
| Wrong separator           | Invalid email                      | Replace separator          | Yes             |
| Duplicate email in file   | -                                  | Keep latest and merge      | Yes             |
| One invalid email in list | Invalid email                      | Remove invalid email       | Yes             |
| Empty required email      | Invalid email                      | Add email                  | Yes             |

---

## Phone

| Scenario                         | Error Message | User Action                       | Needs Dropdown? |
| -------------------------------- | ------------- | --------------------------------- | --------------- |
| Invalid phone number             | Invalid phone | Edit value                        | Yes             |
| Too short                        | Invalid phone | Edit value                        | Yes             |
| Invalid characters               | Invalid phone | Remove invalid characters         | Yes             |
| Wrong separator                  | Invalid phone | Replace separator                 | Yes             |
| Missing country code             | Invalid phone | Add country code                  | Yes             |
| Multiple phone numbers detected  | Invalid phone | Split phone numbers automatically | Yes             |
| One invalid phone number in list | Invalid phone | Remove invalid phone number       | Yes             |


---

## Date

| Scenario        | Error Message | User Action           | Needs Dropdown? |
| --------------- | ------------- | --------------------- | --------------- |
| Invalid date    | Invalid date  | Edit date             | Date picker     |
| Wrong format    | Invalid date  | Change format or edit | Date picker     |
| Impossible date | Invalid date  | Edit date             | Date picker     |
| Ambiguous date  | Invalid date  | Select date format    | Date picker     |


---

## Number

| Scenario                   | Error Message                     | User Action         | Needs Dropdown? |
| -------------------------- | --------------------------------- | ------------------- | --------------- |
| Invalid number             | Invalid number                    | Edit value          | No              |
| Too many decimals          | Invalid number                    | Round or edit value | No              |
| Number below allowed range | Value is below the allowed range. | Edit value          | No              |
| Number above allowed range | Value exceeds the allowed range.  | Edit value          | No              |
| Wrong decimal separator    | Invalid number                    | Edit value          | No              |

---

## Currency

| Scenario               | Error Message    | User Action        | Needs Dropdown? |
| ---------------------- | ---------------- | ------------------ | --------------- |
| Invalid currency value | Invalid Currency | Edit value         | No              |




---

## Select

| Scenario         | Error Message    | User Action            | Needs Dropdown? |
| ---------------- | ---------------- | ---------------------- | --------------- |
| Option not found | Option not exist | Map or add option      | Yes             |
| Archived option  | Option not exist | Select another option  | Yes             |
| Typo detected    | Option not exist | Map to existing option | Yes             |
| Duplicate option | Option not exist | Use existing option    | Yes             |

---

## Multi-select

| Scenario         | Error Message    | User Action                | Needs Dropdown? |
| ---------------- | ---------------- | -------------------------- | --------------- |
| Invalid option   | Option not exist | Map or add invalid options | Yes             |
| Wrong separator  | Option not exist | Replace separator          | No              |
| Too many values  | Option not exist | Remove extra values        | No              |
| Duplicate values | Option not exist | Remove duplicates          | No              |

---

## Yes/No

| Scenario              | Error Message        | User Action  | Needs Dropdown? |
| --------------------- | -------------------- | ------------ | --------------- |
| Invalid boolean value | Option not exist     | Map value    | Yes             |
| Unknown value         | Option not exist     | Map value    | Yes             |
| Empty required value  | A value is required. | Select value | Yes             |

---

## URL

| Scenario             | Error Message               | User Action | Needs Dropdown? |
| -------------------- | --------------------------- | ----------- | --------------- |
| Invalid URL          | Enter a valid URL.          | Edit URL    | No              |
| Invalid LinkedIn URL | Enter a valid LinkedIn URL. | Edit URL    | No              |
| Invalid twitter URL  | Enter a valid twitter URL.  | Edit URL    | No              |


---

## Domain

| Scenario                | Error Message  | User Action           | Needs Dropdown? |
| ----------------------- | -------------- | --------------------- | --------------- |
| Invalid domain          | Invalid domain | Edit domain           | Yes             |
| Email instead of domain | Invalid domain | Extract domain        | Yes             |
| Website URL entered     | Invalid domain | Auto-clean URL        | Yes             |
| Public email domain     | Invalid domain | Skip company matching | Yes             |

---

## User

| Scenario             | Error Message | User Action         | Needs Dropdown? |
| -------------------- | ------------- | ------------------- | --------------- |
| User not found       | Invalid user  | Select another user | Yes             |
| Multiple users match | Invalid user  | Choose correct user | Yes             |
| Inactive user        | Invalid user  | Select active user  | Yes             |

---

## Status

| Scenario        | Error Message    | User Action           | Needs Dropdown? |
| --------------- | ---------------- | --------------------- | --------------- |
| Invalid status  | Option not exist | Select valid status   | Yes             |


---

## Pipeline Stage

| Scenario              | Error Message    | User Action        | Needs Dropdown? |
| --------------------- | ---------------- | ------------------ | --------------- |
| Stage not found       | Option not exist | Map stage          | Yes             |



---

## Relationship

| Scenario              | Error Message                     | User Action             | Needs Dropdown? |
| --------------------- | --------------------------------- | ----------------------- | --------------- |
| Record not found      | No matching record found.         | Select or create record | Yes             |
| Multiple matches      | Multiple matching records found.  | Choose record           | Yes             |
| Duplicate association | This relationship already exists. | Ignore duplicate        | No              |

---

## Rating

| Scenario            | Error Message         | User Action | Needs Dropdown? |
| ------------------- | --------------------- | ----------- | --------------- |
| Invalid rating      | Enter a valid rating. | Edit value  | No              |
| Rating out of range | Option not exist      | Edit value  | No              |

---

## Timestamp

| Scenario             | Error Message                | User Action     | Needs Dropdown? |
| -------------------- | ---------------------------- | --------------- | --------------- |
| Invalid timestamp    | Enter a valid date and time. | Edit value      | No              |
| Unsupported timezone | Timezone is not supported.   | Change timezone | Yes             |


---

## Location

| Scenario         | Error Message                    | User Action    | Needs Dropdown? |
| ---------------- | -------------------------------- | -------------- | --------------- |
| Invalid location | Enter a valid location.          | Edit location  | No              |
| Unknown country  | Country could not be recognized. | Select country | Yes             |

---

