# SparrowGenie Delivery Workflow

**Problem Statement & Defined Process States**

## Problem Statement

Today, SparrowGenie delivery lacks a **clearly defined, enforced workflow across Product, Design, Engineering, and QA**.

While Jira is used, there are:

- No explicit ownership boundaries between teams.
- No consistent Definition of Done for state transitions.
- No enforced handover mechanism to preserve context.
- No guaranteed single source of truth inside the Jira ticket.

As a result:

- Status checks require manual follow-ups and parallel sheets.
- Context is lost across handoffs.
- QA gets involved late.
- Releases feel rushed and reactive.

This document defines a **single-ticket, state-driven workflow** with **mandatory handovers** to eliminate ambiguity and ensure predictable delivery.

---

## Core Principles (Non-Negotiable)

1. **One Jira ticket = one source of truth**
    - PRD, designs, discussions, recordings, QA reports all live in the ticket.
2. **Each department owns specific states**
3. **No ticket moves without meeting its Definition of Done**
4. **Every cross-team transition requires a handover meeting**
5. **Every ticket must include handover meeting recordings**

No recording → no transition.

---

## End-to-End Workflow States

### 1. Product Stage

**States**

- Product To Do
- Product In Progress
- Product Done

**Owner**

- Product

**Definition of Done – Product Done**

- PRD attached or linked in the ticket
- Scope and non-scope clearly defined
- Acceptance criteria written
- Dependencies and assumptions documented
- Design brief added - wireframe 

**Mandatory Handover**

- Product → Design walkthrough (15–30 mins)

**Ticket Must Contain**

- Handover meeting recording link
- Summary of decisions
- Open questions (if any)

---

### 2. Design Stage

**States**

- Design To Do
- Design In Progress
- Design Done

**Owner**

- Design

**Definition of Done – Design Done**

- Final designs attached/linked
- All states covered (happy, empty, error, loading)
    
- Design walkthrough completed with Product
    
- Engineering handover notes added
    

**Mandatory Handover**

- Design → Engineering walkthrough
    

**Ticket Must Contain**

- Handover meeting recording link
    
- Final design links
    
- Known limitations or assumptions
    

---

### 3. Engineering Stage

**States**

- Engineering In Progress
    
- Engineering Done (Ready for UAT)
    

**Owner**

- Engineering
    

**Definition of Done – Engineering Done**

- Feature fully implemented
    
- All design specs reflected
    
- Acceptance criteria met
    
- No known P0 / P1 issues
    
- Reviewed by Product and Design
    

**Mandatory Handover**

- Engineering → QA demo & walkthrough

**Ticket Must Contain**

- Handover meeting recording link
- Test focus areas
- Known risks or gaps
---

### 4. QA Stage

**States**

- QA To Do
- QA In Progress
- QA Done

**Owner**

- QA

**Definition of Done – QA Done**

- Test cases executed and documented
- All defects logged and linked to parent tickets 
- Regression impact assesses
- QA sign-off added

**Mandatory Handover**

- QA → Release summary walkthrough

**Ticket Must Contain**

- Handover meeting recording link
- QA execution summary
- Known limitations / deferred issues

---

### 5. Release Stage

**States**

- Ready for Release
- Released

**Owner**

- Engineering / QA

**Definition of Done – Released**

- Feature deployed to production
- Release notes updated
- Post-release checks completed

---

## Jira Enforcement Rules

- Add a mandatory custom field: **Handover Recording Link**
- Block cross-team status transitions if the field is empty
- No parallel spreadsheets for tracking state or readiness

---

## Expected Outcomes

- Clear ownership at every stage
- Zero context loss across teams
- Early QA involvement
- Predictable releases
- One-click status visibility from Jira