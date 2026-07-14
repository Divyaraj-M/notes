---
related:
  - "[[Week 1]]"
  - "[[Mathematics]]"
  - "[[hybrid-thinking-worksheet]]"
  - "[[Hybrid Thinking — Discovery Cycle Worksheet]]"
  - "[[ERD]]"
  - "[[ECHS – Knowledge Transfer (KT) Document]]"
  - "[[Domain diagram]]"
  - "[[Product thinking]]"
  - "[[Elastic Search]]"
  - "[[Past RFP Similarity Score (PRS)]]"
  - "[[Workflows_v1]]"
  - "[[Product thinking]]"
  - "[[Domain Diagram Questions]]"
  - "[[Proposal Conversion]]"
  - "[[Design diagram]]"
---
# IIT BS Mathematics – Final Exam Formula & Memory Sheet

This is a **last‑mile, exam‑ready summary**. No explanations. Only what you must recall under stress.

---

## WEEK 1 — SETS, RELATIONS, FUNCTIONS

### Sets

- Union: $(A \cup B)$ → all elements in A or B
- Intersection: $(A \cap B)$ → common elements
- Difference: $(A - B)$ → in A but not in B
- Cardinality: (|A|) = number of elements

### Number systems

- **Integers (Z)** → discrete
- **Rationals (Q)** → dense
- **Reals (R)** → uncountable

### Prime

- Prime = exactly **two factors**
- **1 is NOT prime**

### Relations

- Reflexive: (a,a) ∈ R
- Symmetric: (a,b) ⇒ (b,a)
- Transitive: (a,b) & (b,c) ⇒ (a,c)
- Equivalence relation = all three

### Function

- One input → **exactly one output**

---

## WEEK 2 — COORDINATE GEOMETRY

### Distance formula

$[ d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2} ]$

### Slope

$[ m = \frac{y_2-y_1}{x_2-x_1} = \tan\theta ]$

- Horizontal line: slope = 0
- Vertical line: slope undefined

### Line forms

- Point–slope: $(y-y_1 = m(x-x_1))$
- Slope–intercept: (y=mx+c)
- General: (Ax+By+C=0) (works for vertical lines)

### Perpendicular lines

$[ m_1 m_2 = -1 ]$

---

## WEEK 3 — QUADRATIC FUNCTIONS

### Standard form

$[ f(x)=ax^2+bx+c,; a\neq0 ]$

### Vertex

- x‑coordinate: $(x = -\frac{b}{2a})$
- Vertex gives **max or min**

### Axis of symmetry

$[ x = -\frac{b}{2a} ]$

### Nature of parabola

- a > 0 → opens up → minimum
- a < 0 → opens down → maximum

### Discriminant

$[ D=b^2-4ac ]$

- D>0 → two real roots
- D=0 → one real root
- D<0 → no real roots

### Quadratic formula

$[ x=\frac{-b\pm\sqrt{b^2-4ac}}{2a} ]$

---

## WEEK 4 — POLYNOMIALS

### Degree

- Highest power with non‑zero coefficient
- Degree n → max turning points = n−1

### Multiplicity

- Odd → graph **crosses** x‑axis
- Even → graph **touches & turns back**

### End behaviour

Depends only on **leading term**

---

## WEEK 5 — FUNCTIONS

### Tests

- Vertical line test → function?
- Horizontal line test → one‑to‑one?

### Composite function

$[ (f\circ g)(x)=f(g(x)) ]$
Domain rules:

1. x ∈ domain of g
2. g(x) ∈ domain of f

### Inverse

$[ f(f^{-1}(x))=x ]$

---

## WEEK 6 — LOGARITHMS

### Definition

$[ y=\log_a x \iff a^y=x ]$

### Conditions

- a>0, a≠1
- Argument >0

### Laws

- Product: $(\log(MN)=\log M+\log N)$
- Quotient: $(\log(M/N)=\log M-\log N)$
- Power: $(\log(M^r)=r\log M)$

### Change of base

$[ \log_a x = \frac{\ln x}{\ln a} ]$

---

## WEEK 7 — LIMITS & CONTINUITY

### Limit exists if

$[ \lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x) ]$

### Continuity at x=a

$[ \lim_{x\to a}f(x)=f(a) ]$

### Differentiability

Differentiable ⇒ Continuous

Example:

- |x| at 0 → continuous ❌ differentiable
    

---

## WEEK 8–9 — CALCULUS

### Derivative

$[ f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h} ]$

### Power rule

$[ \frac{d}{dx}(x^n)=nx^{n-1} ]$

### Integration rules

- $(\int x^n dx = \frac{x^{n+1}}{n+1}+C)$
    
- $(\int c dx = cx + C)$
    

### Definite integral (FTC)

If (F'(x)=f(x)), then  
$[ \int_a^b f(x)dx = F(b)-F(a) ]$

### Riemann sum

- **Approximation**, not exact
    

---

## WEEK 10 — GRAPH THEORY BASICS

### Degree rule (undirected)

$[ \sum \text{degrees} = 2E ]$

### Directed graph

- Sum in‑degree = sum out‑degree = E
    

### BFS vs DFS

- BFS → shortest path (unweighted)
    
- DFS → cycles, structure
    

### Cycle (directed)

- **Back edge ⇒ cycle**
    

### DAG

- No cycles
    
- Topological sort exists **iff DAG**
    

---

## WEEK 11 — SHORTEST PATH & MST

### Shortest path

- Unweighted → BFS
    
- Weighted (no −ve edges) → Dijkstra
    
- Negative cycle → shortest path undefined
    

### Dijkstra

- All weights ≥ 0 (mandatory)
    

### MST

- Undirected, weighted
    
- No cycles
    
- Connects all vertices
    

---

## WEEK 12 — FINAL TOPICS

### Floyd–Warshall

- All‑pairs shortest path
    
- Allows negative edges
    
- ❌ negative cycles
    

### Transitive closure

- Reachability only
    
- Ignores weights
    

### Matrix multiplication

If A = m×n, B = n×p → result = m×p

### Even / Odd functions

- Even: $f(−x)=f(x)$ → y‑axis symmetry
    
- Odd: $f(−x)=−f(x)$ → origin symmetry
    

---

## LAST‑MINUTE EXAM MINDSET

- Read question → identify **topic first**
    
- Decide formula → then calculate
    
- Don’t mix MST with shortest path
    
- Vertex = midpoint of roots
    
- Integrate first, apply limits later
    

---

**This sheet + mock practice = 75%+ achievable.**