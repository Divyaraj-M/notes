#new_feature/attachements  #discovery #p1 
### TL; DR
SparrowGenie only supports text answers today, which forces teams to use workarounds to add images and documents, especially in Excel-based RFx responses. This creates manual work and weakens Projects.

This feature adds **[[Attachments in RFP response - Product Spec]]**. Users can attach images, PDFs, and documents to answers, view and manage them in the project, and export them either **embedded inside Excel cells** or as separate files.
## Context 

### Problem Stament 
- SparrowGenie only supports text answers today. This prevents sales teams from adding images, documents, and visuals that buyers expect in real proposals. As a result, teams rely on external tools and manual work, which weakens RFx answers and hurts win rates.

#### User Stories 
- As a SME , I want to attach images, infographics , documents attachments  for the answer to win the deal 
### Impact Areas 
- UI 
	- Import behaviour of the attachments  
	- Export behaviour of the attachments 
- UX
	- We have let the users to select the attachments from both [[4 - Archive/Sparrowgenie/Knowledge Hub/Knowledge Hub]]  and from the device 
	- We have to let the users to decide how the export behaviour should be if the 
		- Mark the area as inline like `{</File_Name/>}` and download it as zip


###  Competitive insights


|          **Dimension**          |                **Responsive**                |                  **Loopio**                  |
| :-----------------------------: | :------------------------------------------: | :------------------------------------------: |
|   Attachment support in Excel   |                     Yes                      |                     Yes                      |
|  Images embedded inside Excel   |                     Yes                      |                      No                      |
| Docs/PDFs embedded inside Excel |                     Yes                      |                      No                      |
|      Excel export behavior      | Attachments exported as separate files (ZIP) | Attachments exported as separate files (ZIP) |
|    How user references files    |              Filenames / links               |           Filenames / placeholders           |
|  Need post-export manual work   |                   ✅ Often                    |                   ✅ Often                    |
|      Evaluator experience       |      Disjointed (open ZIP, match files)      |                  Disjointed                  |
|   Excel as first-class format   |                     ❌ No                     |                     ❌ No                     |

For more Information  about competitor
- [[Attachments - Loopio]]
- [[Attachments - Responsive]]
## Implementation 

- **Excel-first requirement**  
    Does this work **only for Excel export** and not accidentally pull in Word or other formats?
- **Permission & access safety**  
    Does this respect existing **project, role, and attachment permissions** without introducing leaks?
- **Knowledge Hub compatibility**  
    Does this fit the current **knowledge hub structure** without creating orphaned or unsearchable assets?
## Scope

### **Must Have Requirements (Non-Negotiable)**

- Users can attach **documents, PDFs, and images** directly within the **response box**
- Attached files can be **embedded inside Excel cells** during export
- Users can **open/view attached files** from the project screen by clicking on them
- Users can **remove attached files** from a response at any time
- During Excel export, users can choose **one of the following behaviors**:
    - **Embed attachments inside Excel cells**
    - **Export attachments as separate files in a folder**

> If embedding fails, the export must not silently succeed.

---

### **Should Have Requirements**

- Users can **mark attachment locations in the spreadsheet** using a clear placeholder (for example: “Attachment: architecture-diagram.png”)
- Users can **download all attachments as a ZIP file** during export
#### References 
[How to embed the File Inside a Excel ](https://www.youtube.com/watch?v=wktR9AeI7Xc)
