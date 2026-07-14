---
related:
  - "[[Edge case Analysis]]"
  - "[[Teardowns]]"
  - "[[Product thinking]]"
  - "[[Custom Agent builderv1]]"
  - "[[Product Spec Template 2]]"
  - "[[pestel-analysis-prompt-template]]"
  - "[[Atomic Habits and deliberate practice applied to product management]]"
  - "[[Zoom]]"
  - "[[company-profile-executive-insights-research]]"
  - "[[user-story_ai-enhanced_prompt-template]]"
  - "[[Table view for question card PRD]]"
  - "[[Elastic Search]]"
  - "[[README]]"
  - "[[Kibana]]"
  - "[[Hybrid thinking product framework]]"
---
#learning/simulation_Analysis


# Enhanced Edge Case Analysis Playbook — 5D × Smart FMEA for Product Logic

  

Google Sheets Template: [Edge Case analysis](https://docs.google.com/spreadsheets/d/1qohgSdPe7MFoBzZLhFMRftUpMPwc95CoXg5LQLuXcGs/edit?usp=sharing)

## 1. Purpose & Core Improvements

This guide helps you identify logical breakpoints in your product’s flow before they reach your users.  
It’s designed for product managers to:

- Think beyond the happy path and look for what could frustrate or confuse users.  
      
    
- Evaluate risks logically using a combination of 5 Dimensions (what can break in content, visuals, behavior, etc.) and FMEA (Failure Modes and Effects Analysis).  
      
    
- Score and prioritize issues so the team fixes the most impactful ones first.  
      
    
- Apply the same method across all product features for consistency.  
      
    

Key Improvements:

- ✅ Smart Scoring replaces broken RPN multiplication
- ✅ Behavioral Integration captures user psychology edge cases
- ✅ Continuous Monitoring replaces one-time assessments
- ✅ Data-Driven Validation reduces subjective bias
- ✅ Rapid Implementation fits agile development cycles

  

## 2. The Enhanced Framework: 5D × Smart FMEA

### 2.1 Enhanced 5 Dimensions (5D+) Lens

Each dimension now includes behavioral and contextual factors:

#### Words (Copy & Messaging)

- Technical failures: Wrong tone, misleading info, missing context
- Behavioral triggers: Cognitive load, choice paralysis, loss aversion cues
- Data source: A/B test copy performance, support ticket themes

#### Visual Representation (UI Design)

- Technical failures: Poor hierarchy, confusing layouts, unclear icons
- Behavioral triggers: Visual complexity, attention patterns, accessibility barriers
- Data source: Heatmap analysis, eye-tracking studies, accessibility audits

#### Behavior (Interactions)

- Technical failures: Wrong responses, broken links, unexpected changes
- Behavioral triggers: Decision fatigue, learned helplessness, habit disruption
- Data source: User session recordings, funnel analysis, error logs

#### Physical Objects (Hardware/Devices)

- Technical failures: Mobile vs desktop differences, hardware limitations
- Context factors: Usage environment, multitasking scenarios, network conditions
- Data source: Device analytics, performance monitoring, context sensors

#### Space & Time (Timing & Context)

- Technical failures: Bad timing, wrong timezone, context mismatch
- Behavioral timing: Peak cognitive load periods, emotional states, social context
- Data source: Usage patterns, temporal analytics, contextual surveys

### 2.2 Smart FMEA (Replaces Traditional RPN)

#### New Multi-Factor Risk Assessment

Instead of S × O × D = RPN, use weighted multi-criteria analysis:

Risk Score = (Technical Impact × 0.25) + (Business Impact × 0.30) + (User Impact × 0.20) + (Probability × 0.15) + (Behavioral Amplifier × 0.10)

#### Scoring Scales (1-10 continuous scale)

Technical Impact (TI):

- 1-3: Minor system hiccup
- 4-6: Feature degradation
- 7-8: Major functionality loss
- 9-10: System failure/security breach

  

Business Impact (BI):

- 1-3: Negligible revenue/reputation impact
- 4-6: Minor customer satisfaction hit
- 7-8: Significant churn or revenue loss
- 9-10: Major business disruption

  
  

User Impact (UI):

- 1-3: Slight inconvenience
- 4-6: Workflow interruption
- 7-8: Task completion failure
- 9-10: Complete user goal blocking

  

Probability (P):

- 1-3: Rare edge case (% users)
- 4-6: Occasional occurrence (1-10% users)
- 7-8: Common scenario (10-30% users)
- 9-10: Frequent occurrence (>30% users)

  

Behavioral Amplifier (BA):

- 1-3: Rational user response expected
- 4-6: Some emotional/irrational behavior likely
- 7-8: Strong psychological triggers present
- 9-10: Cognitive biases guarantee poor decisions

## 3. Step-by-Step Enhanced Process

### Step 1: Data Preparation (NEW)

Before starting analysis, gather:

- Last 30 days user analytics
- Recent support tickets for this flow
- A/B test results from similar features
- User interview insights (if available)
- Competitive analysis of similar flows

### Step 2: Define Scenario + Context

- Pick a single user role (Owner, Author, Approver, etc.)
- Pick a single system event
- Define the user's emotional/cognitive state
- Identify time/context constraints
- Write happy flow + expected user mindset

  

Example: "Stressed Owner needs to quickly review AI-generated RFP draft during busy afternoon while juggling client call."

### Step 3: Enhanced 5D Analysis

For each dimension, ask both technical + behavioral questions:

  

Technical Questions:

- How could this technically break?
- What system failures could occur?

  

Behavioral Questions:

- What psychological pressures exist?
- How might cognitive biases influence decisions?
- What emotional triggers could cause poor choices?

  

### Step 4: Smart FMEA Scoring

For each failure mode identified:

  

|   |   |   |
|---|---|---|
|Field|Description|Data Source|
|Failure Mode|How it breaks|5D analysis|
|Effect on User|Impact description|User empathy|
|Root Cause|Technical + behavioral reasons|Root cause analysis|
|Current Detection|How you'd know it happened|Monitoring capabilities|
|Technical Impact (TI)|System/feature impact (1-10)|Technical assessment|
|Business Impact (BI)|Revenue/reputation impact (1-10)|Business stakeholder input|
|User Impact (UI)|User experience impact (1-10)|UX research + data|
|Probability (P)|Likelihood based on data (1-10)|Analytics + patterns|
|Behavioral Amplifier (BA)|Psychology multiplier (1-10)|Behavioral analysis|
|Smart Risk Score|Weighted calculation|Automated formula|

  

### Step 5: Enhanced Prioritization

Priority Bands:

- P0 (8.0-10.0): Fix in next sprint
- P1 (6.0-7.9): Fix within 2 weeks
- P2 (4.0-5.9): Fix within quarter
- P3 (2.0-3.9): Monitor, fix when convenient
- P4 (0.0-1.9): Document only

### Step 6: Validation & Monitoring Setup (NEW)

For P0-P1 Issues:

1. Create monitoring alerts for failure conditions
2. Set up an A/B test to validate the fix effectiveness
3. Define success metrics (not just "doesn't break")
4. Schedule review in 2 weeks

  

For P2+ Issues:

1. Add to the monitoring dashboard
2. Set review trigger thresholds
3. Document for future reference

## 4. Enhanced Example Analysis

### Scenario: Owner Receives AI Draft Completion Email

Context: Busy executive, high stress, reviewing on mobile while in meeting

  

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|Dimension|Failure Mode|Effect|Root Cause|Smart Scoring|Priority|
|Words|Subject: "Your draft is ready" (generic)|Owner ignores, misses deadline|No personalization, competing priorities|TI:3, BI:7, UI:6, P:8, BA:7 = 6.4|P1|
|Behavior|Email link opens wrong draft|Wastes time, creates distrust|ID mapping bug + user rushing|TI:6, BI:5, UI:8, P:4, BA:8 = 6.0|P1|
|Space/Time|Sent during known meeting time|Buried under other notifications|No send-time optimization|TI:2, BI:4, UI:5, P:7, BA:6 = 4.6|P2|
|Visual|Email preview truncated on mobile|Can't assess urgency/importance|Mobile layout not tested|TI:4, BI:3, UI:7, P:9, BA:5 = 5.2|P2|

  

### Enhanced Mitigations:

P1 Actions (Fix before launch):

- Personalized subject lines with project name + urgency indicators
- Add email link validation + user-friendly error handling
- Implement mobile-optimized email templates with clear preview

  

P2 Actions (Fix within quarter):

- Smart send timing based on user calendar integration
- Comprehensive mobile email testing protocol

## 5. Implementation Quick Start

### Week 1: Setup

- Choose 1 critical user flow for pilot
- Set up basic analytics tracking
- Create simplified scoring spreadsheet
- Train 2-3 team members on process

### Week 2-3: First Analysis

- Run enhanced 5D analysis on pilot flow
- Score using Smart FMEA method
- Implement P0 fixes immediately
- Set up monitoring for P1 issues

### Week 4: Validation

- Launch with monitoring active
- Collect 1 week of user behavior data
- Compare predicted vs. actual edge cases
- Refine scoring weights based on results

### Month 2+: Scale

- Add more user flows
- Integrate with existing QA processes
- Train broader team
- Create automated monitoring dashboards

## 6. Tools & Templates

### Required Tools:

- Analytics: Mixpanel, Amplitude, or Google Analytics
- User Research: Hotjar, FullStory, or LogRocket
- Monitoring: Datadog, New Relic, or custom dashboards
- Documentation: Notion, Confluence, or shared spreadsheets

### Team Roles:

- PM: Owns process, prioritization decisions
- UX: Provides behavioral insights, user empathy
- Engineering: Technical impact assessment, monitoring setup
- QA: Validation planning, edge case testing
- Data: Analytics support, pattern identification

## 7. Success Metrics

Track framework effectiveness:

- Prediction Accuracy: % of predicted edge cases that occur
- Detection Speed: Time from edge case occurrence to team awareness
- Resolution Time: Average time to fix P0/P1 issues
- User Impact Reduction: Decrease in support tickets for analyzed flows
- Team Efficiency: Time spent on analysis vs. value delivered