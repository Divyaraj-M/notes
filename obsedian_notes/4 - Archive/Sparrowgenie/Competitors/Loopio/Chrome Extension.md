---
related:
  - "[[Chrome Extension - Responsive IO]]"
  - "[[Loopio]]"
  - "[[Chrome Extension]]"
  - "[[Arphie.ai]]"
  - "[[Apolloio_v1]]"
  - "[[Integrations]]"
  - "[[Attachments - Loopio]]"
  - "[[howto]]"
  - "[[Competitors Info PRD]]"
  - "[[README]]"
  - "[[agent-browserskillsagent-browserSKILL.md at main]]"
  - "[[Attachments in RFP response - Product Spec]]"
  - "[[Salesforce Integration]]"
  - "[[a-generative-AI-prompt-builder-for-product-professionals]]"
  - "[[CRM Metrics Framework]]"
---
#competitor_analysis 

Ref : [Chat gpt Convo](https://chatgpt.com/share/69428c4b-b78c-800e-8d3c-2601eeedc907)
Support article: [Chrome Extension ](https://support.loopio.com/hc/en-us/sections/43394481804947-Loopio-Extension-New)
 [Article 1](https://support.loopio.com/hc/en-us/articles/43157003799187-How-Can-I-Set-Up-the-Loopio-Extension-new-with-SmartFill) , [Article 2](https://support.loopio.com/hc/en-us/articles/43396550627091-How-Can-I-Use-the-Loopio-Extension-new-to-Respond-in-Webpages-and-Portals) [Article 3](https://support.loopio.com/hc/en-us/articles/43547177678995-How-Can-I-Create-a-Project-in-the-Loopio-Extension-new) [Article 4](https://support.loopio.com/hc/en-us/articles/43547177678995-How-Can-I-Create-a-Project-in-the-Loopio-Extension-new)

## How Loopio’s Chrome Extension Works (Summary)

### 1. Setup & Access

- User installs the Loopio Extension (new)
- Logs in once and connects it to their Loopio workspace
- Extension works in **Chrome and Edge**

---

### 2. Two Core Capabilities

Loopio’s extension is built around **two main engines**:

#### A. [[SmartScan]] (capture)

- Scans a web portal or page
- Automatically detects:
    - Sections
    - Subsections
    - Questions
- Creates a Loopio Project in real time
- Shows a preview of what was captured
- User reviews and fixes structure if needed

If SmartScan fails:

- User can **manually select text**
- Mark it as Section / Subsection / Question

---

#### B. [[SmartFill]] (respond)

- Pulls approved answers from Loopio Projects
- Inserts answers back into the portal
- Supports:
    - Fill all answers
    - Fill a section/subsection
    - Paste a single answer
- Falls back to copy–paste when auto-fill isn’t possible

---

### 3. Project Handling

- Projects are **created from inside the extension**
- Once created:
    - Full answering happens in Loopio web app
    - Extension stays in sync via Refresh
- Extension is not the main editor
- It’s a bridge between portal ↔ Loopio

---

### 4. Library Access

- Users can search the Loopio Library from the extension
    
- Search by:
    - Selecting text on a page
    - Typing in the extension search bar
- Each result shows:
    - Answer preview
    - Usage count
    - Attachments
- Users can:
    
    - Copy answers
    - Generate summaries
    - Open the full entry in Loopio

---

### 5. Editing & Control

- Limited edits inside the extension:
    - Rename sections
    - Reorder items
    - Delete entries
- Final answers and approvals happen in the web app
- Permissions apply exactly as in Loopio

---

### 6. Design Philosophy

- Extension = **capture + deploy**
- Web app = **author, review, approve**
- Automation (SmartScan/SmartFill) is:
    - Optional
    - Experimental
    - Clearly labeled

---

### One-line takeaway

**Loopio uses the extension to pull questions out of portals and push approved answers back, while keeping the real work inside the web product.**