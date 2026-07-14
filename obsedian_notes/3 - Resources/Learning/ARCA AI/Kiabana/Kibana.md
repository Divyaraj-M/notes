#arca_ai/learning/Kibana
# Kibana – Visualization & Decision Design Syllabus

## Objective

Learn to:

- Explore data
- Build clean visualizations
- Design decision-driven dashboards
- Avoid decorative analytics


You are learning how to **communicate analytical insight clearly**.

---

# Phase 1 – Data Exploration

## 1. Discover Module

- Filtering
- Searching
- Inspecting raw documents
- Field statistics
- Debugging aggregation mistakes

### Outcome

Comfortable exploring unknown datasets.

---

# Phase 2 – Visualization Building

## 2. Core Visualizations

Build confidently:

- Line chart
- Bar chart
- Data table
- Metric panel

Avoid:

- Decorative pie charts unless justified

---

## 3. Aggregation Mapping in UI

Understand how:

- Bucket = X-axis grouping
- Metric = Y-axis calculation
- Split rows
- Split series
- Breakdowns

Be able to map:  
Raw aggregation query → Visual builder steps

---

# Phase 3 – Dashboard Construction

## 4. Dashboard Design Framework

Before building, define:

- Primary decision
- Core KPI
- Supporting breakdown
- Time range
- Risk of misinterpretation

Rule:  
If a panel doesn’t drive a decision, remove it.

---

# Phase 4 – Professional Dashboard Thinking

## 5. Signal vs Noise

- Avoid over-segmentation
- Avoid high-cardinality splits
- Limit number of panels
- Avoid duplicate insights

## 6. Dashboard Review Checklist

For every dashboard:

- What decision does this drive?
- What could be misread?
- What happens if data is delayed?
- Can this metric be gamed?

---

# Practice Projects (Apply Both Together)

Build these in Kibana using proper ES queries:

1. Revenue trend with regional breakdown
2. SLA compliance monitor
3. Error rate over time
4. User activity by segment
5. Category contribution analysis

Each must:

- Use date_histogram
- Use nested aggregation
- Be decision-focused

---

# What Not To Learn Yet

For Elasticsearch:

- Cluster scaling
- Sharding internals
- Security config

For Kibana:

- Advanced plugins
- Complex Canvas design
- Alerting automation

---

# Final Mental Model

Elasticsearch = Analytical brain  
Kibana = Storytelling layer

If Elasticsearch logic is weak → Kibana dashboard lies.  
If Kibana design is weak → Good data becomes noise.