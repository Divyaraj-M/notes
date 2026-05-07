---
owner: Divyaraj Murugan
feature: "[[SparrowDesk]]"
version: 1
status: Done
priority: High
tags:
  - sparrowcrm/features/integrations/sparrowdesk/v1
---
# SparrowDesk Integration Feature Spec

Wireframe : [Balsamiq](https://balsamiq.cloud/sfwp3yg/pyg45on)
## 1. Problem Statement

Sales reps currently need to switch to SparrowDesk to view tickets related to contacts or companies. This slows down workflows and makes it harder to get customer context quickly.

With the SparrowDesk integration, admins can connect SparrowDesk to SparrowCRM, and required ticket fields will be automatically created inside the CRM.

Once connected, sales reps can view related tickets directly from Contact and Company pages in SparrowCRM.

---

## 2. JTBD

### Sales Rep

- [ ] View contact-related tickets inside contacts records page.
- [ ] View company-related tickets by the association of contacts in the company record page.

### Admin

- [ ] Connect SparrowDesk with SparrowCRM.
- [ ] Auto-create required ticket fields inside the CRM.
- [ ] Manage integrations.

#### Integration Management

- [ ] Activate / Deactivate
- [ ] Reconnect
- [ ] Delete
- [ ] View documentation
- [ ] View the integration creator and created date
- [ ] Handle reconnections and failures
- [ ] Sync fields manually

### Platform Admin

- [ ] Request new integrations.
- [ ] Manage feature flags from Area 51
- [ ] Control sync rollout behaviour by pricing plan

---

## 3. Goals

### Business Goals

- Bring SparrowDesk customers and leads into SparrowCRM through integrations.
- Increase integration adoption among existing customers.
- Improve retention by giving sales teams support visibility.
- Help sales teams identify renewal and upsell opportunities using ticket history.

### Success Metrics

- Increase the number of SparrowDesk integrations connected.
- Increase leads/customers coming through integrations.
- Ticket data loads within 2–3 seconds.
- Admin completes setup in under 10 minutes.
- Increase renewal and upsell conversations using ticket data.

---

## 4. Non-Goals

- We are not storing SparrowDesk ticket data permanently inside SparrowCRM.
- We are not building a ticket sync engine.
- We are not displaying ticket counts in CRM tables or list views.
- We are not building a field mapping screen.
- We are not supporting ticket creation or editing from SparrowCRM.
- We are not building bi-directional sync between SparrowCRM and SparrowDesk.

---

## 5. User Stories

### P 0 User Stories

- As an admin, I want to connect SparrowDesk with SparrowCRM so that ticket data can be shown inside the CRM.
- As an admin, I want SparrowCRM to auto-create required ticket fields so that I do not need to configure fields manually.
- As a sales rep, I want to view tickets related to a contact so that I can understand customer issues without opening SparrowDesk.
- As a sales rep, I want to view tickets related to a company so that I can understand account-level support issues.
- As a sales manager, I want to view company-level ticket activity so that I can identify accounts that need attention.

### P 1 User Stories

- As an admin, I want to reconnect an integration so that I can fix expired or broken connections.
- As an admin, I want to activate or deactivate an integration so that I can control whether it is used.
- As an admin, I want to delete an integration so that unused connections can be removed.
- As an admin, I want to see who created the integration and when so that I can track ownership.
- As an admin, I want to view documentation so that I can understand how the integration works.

### P 2 User Stories

- As an admin, I want to request new integrations so that more tools can be supported in the future.
- As a sales rep, I want to see ticket trends over time so that I can understand customer health better.

---

## 6. Requirements

### Must-Have (P 0)

#### 1. Connect SparrowDesk Integration

Admins must be able to connect SparrowDesk from SparrowCRM.

**Acceptance Criteria**

- [ ] Admin can start the SparrowDesk connection.
- [ ] Admin can complete authentication.
- [ ] Integration status shows as connected after success.
- [ ] An error is shown if the connection fails.

---

#### 2. Auto-Create CRM Fields

SparrowCRM must pull required fields from SparrowDesk and create them inside the CRM.

**Acceptance Criteria**

- [ ] Required ticket fields are created after successful connection.
- [ ] Duplicate fields are not created if the integration is reconnected.
- [ ] Field creation failure shows a clear error.

---

#### 3. Show Tickets on Contact Page

Sales reps must be able to view tickets related to a contact.

**Acceptance Criteria**

- [ ] Contact page shows tickets from SparrowDesk.
- [ ] Tickets are fetched based on the selected contact.
- [ ] Tickets are fetched based on the associated email for the selected contact
- [ ] An empty state is shown if no tickets exist.
- [ ] An error state is shown if SparrowDesk data cannot be fetched.

---

#### 4. Show Tickets on Company Page

Sales reps and managers must be able to view tickets related to a company.

**Acceptance Criteria**

- [ ] Company page shows tickets from SparrowDesk.
- [ ] Tickets are fetched based on the selected company.
- [ ] Tickets are fetched based on the associated domain for the selected company
- [ ] An empty state is shown if no tickets exist.
- [ ] An error state is shown if SparrowDesk data cannot be fetched.

#### **5. Ticket Field Sync Behaviour**

Field synchronization behaviour should vary based on pricing plan.

|**Plan**|**Behaviour**|
|---|---|
|Free|Manual sync only|
|Basic|Auto-sync every 1 day|
|Mid|Auto-sync every 2 hours|
|Pro|Auto-sync every 30 minutes|

### **Acceptance Criteria**

- [ ] Sync intervals follow workspace pricing plan
- [ ] Manual sync available for all plans
- [ ] Failed syncs surface retry options
- [ ] Sync timestamps are visible

#### **6. Feature Flag Support (Area 51)**

Integration rollout and sync behaviour should be controlled using feature flags managed through Area 51.

### **Acceptance Criteria**

- [ ] Feature can be enabled/disabled per workspace
- [ ] Rollout can be controlled by plan
- [ ] Sync behaviour configurable via flags
- [ ] Experimental rollout supported

#### **7. Show Tickets on Contact Page**

Sales reps should be able to view tickets related to a contact.

### **Acceptance Criteria**

- [ ] Tickets displayed inside Contact page
- [ ] Tickets fetched using associated contact email
- [ ] Loading state shown
- [ ] Empty state shown if no tickets exist
- [ ] Error state shown if fetch fails
- [ ] Ticket load time under 2–3 seconds

---

#### **8. Show Tickets on Company Page**

Sales reps and managers should be able to view company-related tickets.

### **Acceptance Criteria**

- [ ] Tickets displayed inside Company page
- [ ] Tickets fetched using company domain
- [ ] Empty state shown if no tickets exist
- [ ] Error state shown if fetch fails
- [ ] Ticket load time under 2–3 seconds

---

### Nice-to-Have (P 1)

#### 8. Manage Existing Integration

Admins should be able to manage the connected SparrowDesk integration.

**Acceptance Criteria**

- [ ] Admin can activate the integration.
- [ ] Admin can deactivate the integration.
- [ ] Admin can reconnect the integration.
- [ ] Admin can delete the integration.

---

#### 9. View Integration Details

Admins should be able to view basic integration details.

**Acceptance Criteria**

- [ ] Admin can see who created the integration.
- [ ] Admin can see when the integration was created.
- [ ] Admin can view relevant documentation.
- [ ] Admins should be able to request new integrations.

---

#### 10. Request New Integrations

Admins should be able to request new integrations.

**Acceptance Criteria**

- [ ] Admin can submit an integration request.
- [ ] Request is captured for internal review.

### Future Considerations

- [ ] Identify customers with frequent support issues before renewals or upsells.

---

## **8. Technical Considerations**

### **Data Handling**

- Ticket data should be fetched on-demand
- CRM should not permanently store ticket payloads
- Cached responses may be used temporarily for performance

### **Integration Architecture**

- Pull-based integration
- API-driven retrieval from SparrowDesk
- Workspace-level integration configuration

### **Performance**

- Ticket widget response within 2–3 seconds
- Graceful fallback handling
- Retry support for failed fetches

### **Reliability**

- Prevent duplicate field creation
- Handle expired authentication
- Surface actionable errors to admins

## 8. Success Metrics

### Leading Metrics

- Number of SparrowDesk integrations connected.
- Percentage of admins completing setup successfully.
- Average setup completion time.
- Ticket widget/page load time.
- Number of contact/company pages where ticket data is viewed.

### Lagging Metrics

- Increase in leads/customers from integrations.
- Increase in renewal and upsell conversations using ticket data.
- Higher retention for accounts using the integration.
- Increased adoption of the SparrowDesk integration.

### Targets

- Admin setup completed in under 10 minutes.
- Ticket data loads within 2–3 seconds.
- 70% reduction in switching between SparrowCRM and SparrowDesk.
- Increase SparrowDesk integration adoption after launch

---

# 8. Open Questions

## Blocking

- Engineering: What SparrowDesk APIs are available for contact and company ticket lookup?
- Engineering: Which ticket fields should be auto-created in SparrowCRM?
- Product: What exact fields should be shown on Contact and Company pages?
- Engineering: How do we match SparrowCRM contacts/companies with SparrowDesk records?

## Non-Blocking

- Design: Where should ticket data appear on Contact and Company pages?
- Product: Should admins see documentation inside the app or through an external link?
- Data: How will we track integration adoption and ticket view usage?
- Stakeholder: What integrations should be supported next after SparrowDesk?

---

