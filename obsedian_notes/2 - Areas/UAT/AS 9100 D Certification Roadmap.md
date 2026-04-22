

  

**Executive Summary:** AS 9100 D builds on ISO 9001:2015 with aerospace-specific requirements (risk management, product safety, counterfeit control, configuration management, etc. 【97†L 296-L 304】【55†L 320-L 328】). Achieving certification requires documenting a complete QMS: defining processes (inputs, outputs, owners, metrics), mandatory procedures/records, risk controls, and evidence of implementation. This report provides a detailed, actionable checklist and implementation plan (for Google Sheets) covering every required clause, documents, and activity. Key steps include a gap analysis, process mapping, risk register and controls, supplier management, production/inspection controls, CAPA and audit programs, culminating in the Stage 1/2 certification audits. We also compare major certification bodies and include sample checklists, timelines, and diagrams to guide small aerospace suppliers through AS 9100 D compliance.

  

## 1. Scope and Key Requirements

  

AS 9100 D is the **Aerospace Quality Management System** standard (covering aviation, space, defence) – essentially ISO 9001:2015 **plus** aerospace extensions. It preserves the ISO structure (Clauses 4–10) but adds explicit clauses on risk, product safety, counterfeit parts, configuration control, project management, critical characteristics, etc. 【97†L 296-L 304】【55†L 320-L 328】. In practice, this means *all* ISO 9001 requirements apply (context, leadership, planning, support, operations, performance evaluation, improvement), **plus** stringent controls for aerospace. For example, AS 9100 D explicitly requires:

  

- **Risk Management:** A proactive risk process across product planning and operations (Clause 6.1.2 planning actions for risks; Clause 8.1.1 “process for managing operational risks”【53†L 152-L 159】).

- **Product Safety (Clause 8.1.3):** Formal hazard analysis, management of safety-critical items, event reporting/training【59†L 22-L 31】.

- **Counterfeit Parts Prevention (Clause 8.1.4):** A Counterfeit Parts Prevention Plan requiring supplier vetting, incoming inspections, staff training, reporting/quarantine of suspect parts【57†L 199-L 208】.

- **Configuration Management:** Tracking of product configurations (parts revisions, build data) so any product can be compared to its design baseline【63†L 661-L 669】.

- **Special Requirements:** Identification/flowdown of critical characteristics and key features.

- **Supplier Control:** Structured selection, monitoring and evaluation of suppliers (clear specs, performance metrics, audits)【68†L 208-L 213】【68†L 229-L 235】.

  

Across these areas, top management commitment, clear scope (4.3), documented processes (4.4.2), and continual improvement remain fundamental【97†L 296-L 304】【83†L 132-L 134】.

  

## 2. Mandatory Documentation & Records

  

AS 9100 D requires certain **documented information** (manuals, procedures, records) by clause. Mandatory documents include: the QMS scope statement; a process description (process interactions, sequence, responsibilities)【12†L 643-L 652】; the **Quality Policy** (5.2) and quality objectives (6.2); processes for supplier control (8.4.1); nonconformance control (8.7.1); and the corrective action procedure (10.2.1)【12†L 643-L 652】. Key records include evidence that processes are implemented (audit reports, meeting minutes)【12†L 643-L 652】, calibration and maintenance records (7.1.5.1), personnel training/competence records (7.2), product requirements reviews (8.2.3.2), design input/output/change records (8.3) if applicable, inspection/test results (8.5.1, 8.6), traceability logs (8.5.2), customer property records (8.5.3), production changes logs (8.5.6), nonconformance logs (8.7.2/10.2.2), performance monitoring data (9.1.1), internal audit schedules/results (9.2.2), management review minutes (9.3), and corrective action records (10.2.2)【12†L 643-L 652】.

  

**Tip:** Maintain a *documentation register* (e.g. in Google Sheets) listing each required document/record, its owner, version/date, and location (hard copy or file path). Use standardized titles (e.g. “CAPA Procedure”, “Calibration Log”) to ensure nothing is missed. Every QMS document should be accessible, controlled (as per 7.5 Documented Information), and periodically reviewed.

  

## 3. Process Mapping (Inputs, Outputs, Owners, Metrics)

  

Implement a **process approach**. Identify all core QMS processes (e.g. Customer Requirements, Design, Purchasing, Production, Inspection, Nonconformance, etc.), define each with inputs/outputs, process owner, metrics, and related documented procedures. Draw cross-functional flowcharts (swimlane diagrams) to show handoffs between departments (for example, how Sales, Engineering and Manufacturing coordinate on a customer order)【44†embed_image】. Process definitions should include: inputs (customer specs, design documents, raw materials), outputs (deliverable products, documentation), responsible person/department, and performance measures (e.g. on-time delivery, process yield, scrap rate). Ensure every process links to AS 9100 clauses (e.g. Design controls to 8.3, Purchasing to 8.4, Production to 8.5).

  

【44†embed_image】 *Figure: Example cross-functional (swimlane) process map. Swimlanes show how departments interact on a process (inputs on left, outputs on right)【44†】.*

  

- **Assign process owners:** for each process, name one manager responsible. Owners ensure procedures exist and metrics are tracked.

- **Define inputs/outputs:** e.g. Production process – Input: production work order, drawings; Output: assembled unit, inspection report.

- **Select metrics:** typical examples include defect rates, first-pass yield, on-time delivery, customer satisfaction scores. These will feed the Management Review (Clause 9.3).

- **Ensure traceability:** link process steps back to requirements (e.g. use part numbers or serial numbers so each output is traceable to input materials/processes). See _Traceability_ below.

  

## 4. Risk Management

  

AS 9100 D mandates **risk-based thinking** throughout. You must identify, evaluate, and address risks affecting product conformity and process objectives (Clauses 6.1.2 and 8.1.1)【53†L 152-L 159】. Establish a *risk register* listing potential issues (e.g. late supplier delivery, machine breakdown, process variation), their likelihood and impact, and planned mitigation. A common approach is a 5×5 **risk heatmap** (Impact vs. Likelihood, scored 1–5)【27†embed_image】.

  

【27†embed_image】 *Figure: Example risk heat map. Each risk is plotted by likelihood (rows) and impact (columns), highlighting priorities.*

  

- **Method:** For each identified risk, assign scores 1–5 for severity and probability. Calculate a *risk level* (e.g. Risk Score = Impact × Likelihood). Many small suppliers treat score ≥12 as high risk.

- **Actions:** Plan proportionate controls (avoid, mitigate, or accept risks)【53†L 152-L 159】. For high risks, define concrete actions (e.g. alternate supplier for critical parts, extra inspections, maintenance plan). Document these in the risk register.

- **Review & update:** Risk management should be “woven through the product lifecycle”【53†L 152-L 159】. For example, repeat risk analysis after a major design change or process change (8.1.1). Record evidence of risk assessments (e.g. design FMEA, production risk review meeting minutes).

  

## 5. Product Safety & Counterfeit Parts Control

  

AS 9100 D adds focused clauses on safety and counterfeit parts:

  

- **Product Safety (Clause 8.1.3):** You must “plan, implement, and control processes needed to assure product safety throughout the product life cycle”【59†L 22-L 31】. Typical requirements include performing hazard analyses, identifying safety-critical items, recording safety incidents/near misses, and training relevant staff in safety practices. For example, if a part failure could endanger users, document how the risk is controlled (e.g. redundant design, warning labels). Any safety-related incidents must be logged and analyzed (continuous improvement).

  

- **Counterfeit Parts Prevention (Clause 8.1.4):** Establish a formal Counterfeit Parts Prevention Plan (CPPP)【57†L 199-L 208】. This typically includes:

- **Approved supplier controls:** Only purchase from authorized vendors or distributors; maintain an approved supplier list. Require suppliers to notify of changes (process, sub-supplier, location)【68†L 262-L 269】.

- **Inspection/verification:** Inspect incoming parts for authenticity (check lot codes, holograms, test samples) and document receipts.

- **Staff training:** Train purchasing and inspection staff to recognize suspect parts. Keep records of training (see 7.2 competence records).

- **Incident response:** Define a process for handling suspect counterfeit finds: quarantine the item, notify upstream/downstream customers, and root-cause the failure mode.

- **Flow-down:** Communicate to subcontractors and suppliers their responsibility to prevent counterfeit items (8.4.3, see Supplier Control).

  

Make sure these requirements are in your QMS documentation (e.g. a CPP procedure or part of purchasing procedures). Auditors will look for evidence of supplier verifications, inspection records of critical parts, and documented awareness of counterfeit risk【57†L 199-L 208】.

  

## 6. Configuration Control & Traceability

  

**Configuration Management (Clause 8.1.2 / 8.3.6):** Maintain complete configuration baselines for products/services. This means all design outputs (BOM, drawings, software versions) must be identified, and any changes controlled through formal change requests and approvals. When a nonconformance occurs, it must be evaluated against the correct configuration【78†L 146-L 154】. For example, label drawings with revision, keep revision histories, and ensure only the latest build instructions are used on the shop floor.

  

**Traceability (Clause 8.5.2):** Ensure each unit of product can be traced back through manufacturing to its raw materials and subcomponents【63†L 678-L 683】. This may involve:

- Assigning **serial or batch numbers** to outputs so you can track all constituent parts (batch/lot, serial numbers of assemblies)【63†L 678-L 683】.

- Recording **process route data** for each batch: which machine, operator, and procedure version was used at each stage.

- Maintaining a **traceability log** that links finished units to supplier lots or raw material batches. For aviation, legal requirements often demand mapping of each part’s serial to specific aircraft.

  

AS 9100 D has multiple clauses on “identification and traceability” emphasizing that products must be unambiguously identifiable and their status known at all times【63†L 678-L 683】. If your customers (or regulators) require special ID formats or trace records, incorporate those into your system.

  

## 7. Supplier Controls & Evaluation

  

Under Clause 8.4 (Control of Externally Provided Processes/Products), AS 9100 D requires a robust supplier management process. Key elements:

  

- **Selection/Evaluation Criteria:** Define how you qualify suppliers (e.g. AS 9100/NADCAP certification, quality history, audit results). For example, only approve vendors with recent aerospace-quality audits, or evaluate new suppliers with on-site assessment. Maintain records of all supplier evaluations and re-evaluations (at planned intervals) per Clause 8.4.1.

  

- **Flow-Down Requirements:** Ensure all critical requirements and safety/counterfeit clauses flow down to your suppliers【68†L 208-L 213】. When issuing purchase orders or contracts, clearly state the drawing/spec requirements, acceptance criteria, approval processes, and any special conditions (e.g. “no CND results allowed below X, report nonconformances to us”).

  

- **Communication of Expectations:** Give suppliers all needed technical data (drawings, specs, test methods) up front【68†L 208-L 213】. Specify qualifications needed (trained personnel, certifications)【68†L 222-L 227】.

  

- **Performance Monitoring:** Track supplier performance metrics: on-time delivery rate, quality (defect rates/PPM), responsiveness to issues. AS 9100 expects you to *monitor and evaluate* each external provider’s performance【68†L 229-L 235】. Implement corrective action or discontinue use if performance falls below criteria.

  

- **Verification and Audits:** AS 9100 allows (and often expects) you or your customer to audit critical suppliers. Clause 8.4.3 specifically notes the need for verification/validation at the supplier’s site as required【68†L 241-L 246】. For example, conducting supplier quality audits, or inspecting first-off parts at suppliers before accepting a production run.

  

Document all supplier control activities: approved supplier list, evaluation forms, purchase order clauses, supplier scorecards, and records of any supplier audits or corrective actions. AS 9100 audits will review evidence that you follow a structured supplier control process【68†L 229-L 235】【68†L 241-L 246】.

  

## 8. Production, Equipment Calibration & Environmental Controls

  

Production processes must be controlled to ensure conformity:

  

- **Equipment and Calibration (Clause 7.1.5):** Identify all measuring/inspection equipment. Each instrument/tool must be uniquely identified, regularly calibrated or verified, and maintained. For example, calipers, gauges, CMMs, test benches, and even software tools – each must have a calibration schedule (traceable to standards)【70†L 153-L 161】【70†L 165-L 173】. Keep calibration records (calibration certificates) for each item, noting date, results and next due date【70†L 153-L 161】【70†L 165-L 173】.

- Calibrate more critical instruments more frequently, justified by usage or risk.

- Indicate calibration status on the tool (tag or label showing “Calibrated” or due date)【70†L 179-L 184】.

- Protect instruments from damage (e.g. store sensitive gauges in cases; control temperature/humidity for precision tools)【70†L 172-L 178】【70†L 179-L 184】. Auditors often find nonconformance if calibration records are missing, out-of-date, or equipment used without valid calibration【70†L 185-L 190】.

  

- **Environmental Controls (Clause 7.1.4):** Control the production/inspection environment as needed. This may include controlling temperature, humidity, cleanliness (ESD-safe), lighting, etc., depending on processes. For instance, certain adhesives or electronic components require specific humidity levels; inspections may require controlled lighting conditions. Document any special environmental requirements in work instructions.

  

- **Production Process Control (Clause 8.5):** Implement standard work instructions or checklists for each production/assembly stage to ensure consistency. Control key process parameters and record them (time, pressure, temperature, machine settings, operator ID). Maintain records of in-process inspections and final acceptance (e.g. inspection forms or digital logs). If a rework or repair is done on a product, ensure it is re-verified (Clause 8.7 and 8.5.2) and update records accordingly【78†L 70-L 78】.

  

- **Material Control:** If applicable, control raw materials and customer-supplied property. Mark customer property and log its use (8.5.3). For incoming materials, perform receiving inspection and record results (e.g. incoming QC reports).

  

Overall, the QMS must ensure that only conforming product is released. Use checklists at key stages (first article, final inspection) to document compliance. Calibration, equipment maintenance, and environment checks are typically key audit points.

  

## 9. Nonconformance Control & Corrective Action

  

**Nonconformance Control (Clause 8.7):** Establish a formal procedure for handling nonconforming outputs. This should cover【78†L 68-L 77】:

- *Identification & Documentation:* Immediately tag or segregate any nonconforming parts/products so they cannot be used inadvertently. Create a record (NCR report) with details of the defect, how/where it was found, and what requirement was not met.

- *Disposition:* Assign responsibility (often the MRB or Quality) to decide the disposition: Scrap, rework (and re-inspect), use-as-is (with customer approval), or return to supplier. Record the decision and justification.

- *Customer/Regulatory Notification:* If required (e.g. for safety-critical items or continued airworthiness concerns), inform the customer or authorities before authorizing disposition. Obtain formal concessions for “use as is” cases.

- *Re-verification:* After rework or repair, verify the product against requirements again (8.7.2). Update the record to show it passed re-inspection.

- *Record-Keeping:* Keep nonconformance records (NCR log) and reference them in your CAPA or trending. Nonconformance data is fed into management review (Clause 9.3) as evidence of QMS health【78†L 118-L 122】.

  

**Corrective/Preventive Action (Clause 10.2):** A robust CAPA process is critical. Auditors expect a logical chain from problem to solution【74†L 43-L 52】【74†L 201-L 209】. Steps include:

1. **Identify Nonconformance or Cause of Concern:** From NCRs, audit findings, customer complaints, etc. Define the problem clearly (who, what, where, when)【74†L 113-L 121】.

2. **Containment (Correction):** Immediately control the issue (e.g. segregate suspect lots, stop shipment). Document any temporary fixes (but note: these are *corrections*, not *preventive* of recurrence)【74†L 83-L 92】.

3. **Evaluate Need for CAPA:** Assess severity and risk of recurrence (frequency, impact) to decide if full root-cause analysis is warranted【74†L 136-L 144】. Minor issues might be corrected with simple actions; major issues need formal CAPA.

4. **Root Cause Analysis:** Use systematic methods (5-Why’s, fishbone, fault trees) to find the underlying cause【74†L 147-L 156】. Auditors look for evidence that you looked beyond symptoms to real causes【74†L 147-L 156】.

5. **Corrective Action Plan:** Define specific actions to eliminate the cause. Actions must be SMART (specific, measurable, assignable, realistic, time-bound)【74†L 165-L 174】. Assign an owner and deadline for each. Common actions include revising procedures, retraining personnel, changing a process or material, or tightening controls.

6. **Implementation:** Carry out the plan. Keep records of completed actions (e.g. updated SOPs, revised training records, new inspection checklists)【74†L 175-L 183】. If action involves purchasing or engineering changes, ensure they go through formal change control.

7. **Effectiveness Verification:** After implementation, verify that the actions worked over time【74†L 191-L 200】. For example, run audits or monitor metrics (defect rates) to ensure the issue does not recur. Document this verification; do not close a CAPA immediately – require evidence of sustained prevention【74†L 191-L 200】.

  

All CAPA records should include: the nonconformity description, root cause, action plan, implementation evidence, and effectiveness outcome【74†L 201-L 209】. Maintain a CAPA log with status (open/closed), and report trends (e.g. number of CAPAs opened by category) during Management Review.

  

## 10. Internal Audit & Management Review

  

**Internal Audit (Clause 9.2):** Establish an audit program: plan audits (scope, frequency, auditors) to cover all QMS areas at least annually【83†L 132-L 134】. For AS 9100, ensure auditors are competent (training/experienced) and independent of the area audited. Use checklists keyed to AS 9100 clauses. Typical checklist items include: existence of procedure, evidence of implementation, record-keeping, and compliance to defined processes. Maintain audit schedules, checklists, and full reports (with findings and corrective actions). Audits provide “information on whether the QMS conforms to planned arrangements”【83†L 132-L 134】. Follow up on all findings to closure.

  

**Management Review (Clause 9.3):** Top management must meet at planned intervals (e.g. quarterly or biannually, but at least annually) to review the QMS【83†L 132-L 134】. The agenda must include all required inputs: customer feedback/satisfaction, audit results, process performance and product conformity, nonconformities and CAPA status, supplier performance, adequacy of resources, effectiveness of risk actions, fulfillment of objectives, and status of previous review actions【83†L 139-L 147】. Management Review outputs should document decisions and action items: needed improvements, resource changes, changes to risks/objectives, etc., with assigned owners and timelines. All discussions and resulting action items must be **recorded and retained**【83†L 148-L 151】 (this is often checked carefully by auditors).

  

In practice, compile performance metrics (KPIs, risk register, NCR and CAPA summaries, training status, etc.) in dashboard form for the meeting. Management Review meeting minutes are a key evidence artifact.

  

## 11. Pre-Certification and Audit Stages

  
Before seeking AS 9100 D certification, perform a gap analysis and pre-audit using your internal team or a consultant. Fix major gaps, then run a formal internal audit as a pilot.

  

Then the **Registrar’s two-stage audit** proceeds as follows【85†L 120-L 131】【85†L 153-L 161】:

  

- **Stage 1 (Readiness Review):** The CB reviews your documentation and readiness. The auditor examines your scope, documented processes, objectives, and key site conditions. They verify that internal audits and management reviews have been done, and that evidence (reports, records) exists for each part of the QMS【85†L 120-L 131】. The Stage 1 report will list any “nonconformities” (gaps) in your docs or implementation that must be closed before Stage 2.

  

- **Stage 2 (Full Certification Audit):** Usually 1–2 months later, auditors come on-site (or virtual) to verify that the QMS is actually implemented and effective【85†L 153-L 161】. They will tour facilities, interview personnel, review records, and sample processes (e.g. observe an in-process inspection, check calibration labels, trace a customer order through your system). They confirm that each AS 9100 clause is met in practice (including internal audit, management review, corrective actions)【85†L 153-L 161】. All nonconformances found are reported; these must be addressed (with evidence) before certification is granted.

  

Auditors also set up the **surveillance audit schedule** (typically annual visits) as part of Stage 2. The depth and duration of the audit depend on company size and complexity【85†L 148-L 154】. Be ready to show objective evidence (records, logs, forms) for every requirement.

  

## 12. Common Nonconformities (Audit Findings)

  

In recent audits, typical findings for AS 9100 D include the following【50†L 101-L 107】【50†L 121-L 129】:

  

- **Training & Competence (Clause 7.2):** Missing or incomplete training records; no evidence of evaluating training effectiveness【50†L 101-L 107】. *Solution:* Maintain a training matrix showing required skills per role, with dates of completed training. File attendance sheets or certificates.

  

- **Equipment Calibration (7.1.5):** Overdue or undocumented calibration on inspection equipment【50†L 121-L 129】. *Solution:* Update the calibration schedule, calibrate tools past due, and file all certificates.

  

- **Incoming Material Inspection (8.4/8.5.1):** Lack of records proving material was inspected/tested, or unauthorized use of raw material【50†L 121-L 122】. *Solution:* Implement and document receipt inspection; quarantine unapproved goods.

  

- **Control of Work Orders and Processes:** Deviations from documented processes not recorded (e.g. undocumented assembly changes)【50†L 121-L 123】. *Solution:* Use work orders/checklists at each step, and any deviation triggers an NCR entry.

  

- **Internal Audit (9.2):** Audit plan not fully executed (planned audits skipped), or lack of follow-up on open findings【50†L 121-L 129】. *Solution:* Complete the audit schedule. For any findings, assign CAPAs and show evidence of closure at next audit.

  

- **Management Review (9.3):** Missing agenda items (e.g. supplier performance, risk status) or no documented action items【83†L 139-L 147】【83†L 148-L 151】. *Solution:* Update your management review template to include all required topics, and save minutes that record discussions and assigned actions.

  

- **Nonconformance & CAPA (8.7, 10.2):** NCRs lack root-cause analysis or effectiveness checks; CAPA records not updated or closed【74†L 201-L 209】. *Solution:* For each NCR, require a documented root-cause and a verification entry after fixes.

  

These examples underscore the need for thorough record-keeping and follow-through. Addressing these proactively (during internal audit) will smooth certification.

  

## 13. Implementation Timeline & Resources

  

A practical AS 9100 D implementation can take **3–6 months for very small companies (<50 people)**, **6–10 months for mid-size (50–200)**, and longer for larger organizations【88†L 102-L 106】. Your schedule should allow time for gap analysis, process and document development, training, pilot testing, audits and corrections. For a small aerospace supplier, a rough timeline might be:

  

| Weeks | Activities                                                                                                                  |
| ----- | --------------------------------------------------------------------------------------------------------------------------- |
| 1–2   | Project kickoff, assign team (QMS Lead, Process Owners, SMEs)                                                               |
| 3–4   | Conduct gap analysis vs AS9100D (compare existing QMS to clauses)                                                           |
| 5–8   | Develop key documentation: Quality Manual (if used), procedures (document control, NCR/CAPA, purchasing), work instructions |
| 9–12  | Train staff on new processes (CAPA, risk management). Set up record templates (checklists, logs)                            |
| 13–16 | Implement processes: use new forms, collect records (inspections, audits). Populate risk register and process metrics       |
| 17–18 | Conduct internal audit; close findings. Perform management review. Update QMS based on feedback                             |
| 19–20 | Stage 1 audit (readiness review by Certification Body). Address nonconformities                                             |
| 21–22 | Stage 2 audit (full compliance audit). Address final findings for certification                                             |

  

**Resources:** Plan for a small project team (QMS Manager, process owners, subject-matter experts). Allocate hours (e.g. a few hours/week per team member) and possibly hire a consultant if expertise is lacking. Budget for certification body fees (varies by CB and scope) and training as needed. Use [88] as a guideline for scheduling – larger staffs can handle parallel work and may finish faster, but all must maintain compliance.

  

## 14. Google Sheets Implementation Plan

  

To track all tasks and records in Google Sheets, create the following tabs (with example columns and features):

  

- **Project Plan:** Columns: `Task Description` (e.g. “Update calibration log”), `Owner`, `Due Date`, `Status` (dropdown: Open/In Progress/Done). Use conditional formatting to highlight overdue tasks.

- **Document Register:** Track all QMS docs. Columns: `Document Title`, `Clause`, `Owner`, `Revision`, `Last Reviewed Date`, `Next Review Date`, `Location/URL`.

- **Process List:** `Process Name`, `Inputs`, `Outputs`, `Owner`, `KPIs` (e.g. On-time Delivery %). Possibly link to flowchart images.

- **Risk Register:** `Risk Description`, `Likely (1–5)`, `Impact (1–5)`, `Score` (formula `=B* C`), `Mitigation`, `Owner`. Set a data validation dropdown for Likelihood/Impact (1–5). Highlight high-risk scores (e.g. yellow/red).

- **Supplier Matrix:** `Supplier Name`, `Material/Service Provided`, `Certification (Y/N)`, `Last Audit Date`, `Performance Score`, `Re-evaluation Date`.

- **Equipment/Calibration Log:** `Equipment ID`, `Description`, `Last Cal Date`, `Next Cal Date`, `Status` (Calibrated/In Use/Out-of-Service), `Location`. Use formulas: `=IF(TODAY()>Next_Cal_Date, "OVERDUE","")` to flag overdue calibration.

- **Training Matrix:** `Employee`, `Role`, `Required Training`, `Completed (Date)`, `Next Due`.

- **Internal Audit Log:** `Audit Date`, `Auditor`, `Area (Clause)`, `Findings`, `Corrective Action Taken`, `Verification Date`, `Status`.

- **Nonconformance/CAPA Log:** `NCR/CAPA No.`, `Date`, `Process`, `Issue Description`, `Root Cause`, `Action(s)`, `Owner`, `Due Date`, `Status`, `Effectiveness Verified`. Possibly link NCR and CAPA logs. Use checkboxes or dropdowns for status.

  

**Form Input (Google Forms):** To simplify data entry, create Google Forms that feed into your Sheets. Examples:

- *NCR Reporting Form:* Allow any staff to report a nonconformity by filling a form (fields: date, product/part, defect description, inspector). Form responses populate the NCR log.

- *CAPA Initiation Form:* When a problem is identified, fill a form (date, description, severity, reporter). This can auto-create a CAPA entry in the sheet (with Apps Script).

  

**Automation (Apps Script):** Use Google Apps Script to automate routine checks:

- Send email reminders a week before due dates (for calibration, supplier eval, training).

- Auto-highlight risks above a threshold or overdue NCs.

- Generate periodic summary emails of open CAPAs or audit findings.

- Import form responses into logs and notify owners.

  

**Dashboard:** Create a “Dashboard” sheet with key metrics, using pivot tables or charts: number of open/closed NCRs, CAPAs; audit coverage; percentage of processes with metrics meeting targets; risk level distribution (e.g. count of High/Medium/Low risks)【83†L 132-L 134】. Use graphical charts if desired. This aids Management Review and shows continuous monitoring.

  

## 15. Certification Bodies Comparison

  

Various accredited registrars (cert bodies) offer AS 9100 D certification. Small suppliers often consider reputation, support, and cost. For example:

  

| Certification Body | Strengths                                                                 | Small-Business Focus                                                     |
|--------------------|---------------------------------------------------------------------------|---------------------------------------------------------------------------|
| NQA                | Global recognition, broad standards coverage                              | Structured guidance, competitive pricing                                  |
| BSI                | Strong brand credibility, widely recognized                               | Dedicated SME resources, strong authority                                 |
| DNV                | Strong technical support (training, gap analysis)                         | Step-by-step guidance for smaller firms                                   |
| Bureau Veritas     | Extensive sector coverage, international presence                         | Suitable for companies scaling across standards                           |
| SGS                | Large global presence, extensive audit network                            | Focus on performance improvement and consistency                          |
| Intertek           | Flexible audit approach, strong training and implementation support       | Staged certification approach (gap → audit)                               |
| LRQA               | Offers Small Business Scheme for ISO/AS standards                         | Tailored and accessible certification process for smaller organizations   |

  

*(Sources: independent comparisons of top cert bodies for SMEs【93†L 229-L 237】【93†L 270-L 277】.)* Each registrar has accredited status (IAF-member) so certificates are generally equivalent; choose based on cost, availability, and service style.

  

## 16. Sample Audit Checklist

  

Below is a **sample checklist** format for an internal audit of key areas. Adapt for each AS 9100 clause/process:

  

| Clause/Area          | Requirement/Check                                                                 | Evidence                                                         |
| -------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 4.3 – QMS Scope      | Scope documented and excludes only justified items                                | QMS scope statement                                              |
| 5.2 – Quality Policy | Policy exists, approved by top management, communicated, measurable               | Policy document, proof of communication (posters, emails)        |
| 6.2 – Objectives     | Quality objectives set at relevant levels, measured, and reviewed                 | Objective list, performance data, charts                         |
| 7.1.5 – Calibration  | All monitoring & measuring equipment identified and calibrated on schedule        | Calibration certificates, equipment ID tags                      |
| 7.2 – Training       | Training needs identified, competence evaluated, records maintained               | Training matrix, certificates, assessment records                |
| 8.2.3 – Review Reqs  | Customer and statutory requirements reviewed before order acceptance              | Contract review records (forms, approvals, meeting notes)        |
| 8.4 – External Prod. | Suppliers evaluated, selected, and monitored based on defined criteria            | Supplier evaluation forms, audit reports, approved supplier list |
| 8.5.1 – Production   | Production under controlled conditions (instructions, environment, resources)     | Work instructions, process sheets, environmental logs            |
| 8.5.6 – Changes      | Changes evaluated, approved, and controlled (ECN process)                         | Change request logs, ECN forms, approval records                 |
| 8.7 – Nonconformance | Nonconforming outputs identified, documented, controlled, and dispositioned       | NCR forms, segregation records, corrective action logs           |
| 9.2 – Internal Audit | Audit program defined and executed; findings tracked and closed                   | Audit plan, audit reports, NCR closure records                   |
| 9.3 – Mgmt Review    | Management reviews conducted with required inputs and outputs documented          | Management review minutes, action item tracker                   |
| 10.2 – CAPA          | CAPA process implemented: root cause, action, implementation, effectiveness check | CAPA forms, root cause analysis, follow-up verification records  |
  

*(This table is illustrative; expand as needed so every clause is covered.)* Audit checklists should reference the exact AS 9100 D clause and evidence location (document, record, interview notes).

  

## 17. Gantt-style Execution Timeline

  

| Week  | Milestone / Activity                                                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1–2   | Initiate Project: Define team and roles; purchase AS9100D standard. Plan gap analysis and initial training                                       |
| 3–4   | Gap Analysis: Map current QMS against AS9100D clauses; identify gaps; present findings to management                                             |
| 5–8   | Document Development: Create/update QMS documents (Scope, Policy, Procedures like document control, CAPA, calibration). Design forms and records |
| 9–12  | Process Implementation: Roll out procedures; calibrate equipment; establish registers (Training, Equipment, Supplier). Initialize risk register  |
| 13–14 | Training: Train staff on QMS processes (documentation, NCR handling, safety, counterfeit awareness)                                              |
| 15–16 | Internal Audit: Conduct full internal audit; document findings and nonconformities                                                               |
| 17    | Corrective Actions: Address audit findings; conduct Management Review meeting                                                                    |
| 18    | Stage 1 Audit Prep: Ensure closure of gaps; compile documentation and evidence for Certification Body                                            |
| 19    | Stage 1 Audit (Readiness): Certification Body reviews QMS readiness; address Stage 1 nonconformities                                             |
| 20–21 | Stage 2 Audit (Certification): Full AS9100 compliance audit by Certification Body                                                                |
| 22    | Follow-up: Close final findings; receive certification; plan surveillance audits                                                                 |
  

This timeline is a guideline – actual durations may vary by company size and resources【88†L 102-L 106】.

  

**Sources:** Where possible, this plan aligns with IAQG/AS 9100 resources and industry practice【85†L 120-L 131】【85†L 153-L 161】【88†L 102-L 106】.