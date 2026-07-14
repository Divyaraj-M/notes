---
related:
  - "[[Domain diagram]]"
  - "[[Week 1]]"
  - "[[ECHS – Knowledge Transfer (KT) Document]]"
  - "[[Contacts_v1]]"
  - "[[Formulas Mathematics]]"
  - "[[eol-for-a-product-message]]"
  - "[[Workflows_v1]]"
  - "[[Companies_v1]]"
  - "[[Elastic Search]]"
  - "[[Deal_v1]]"
  - "[[Table view for question card PRD]]"
  - "[[Zoom]]"
  - "[[ERd]]"
  - "[[Ai Signals]]"
  - "[[Sales]]"
---
Entities 
Attributes 
relationships 
Cardinality 
![[Cardinality.jpg]]
## ERD Documentation

**Topic:** Entities, Attributes, Relationships, Cardinality

---

## 1. What is an ERD?

An **Entity Relationship Diagram (ERD)** is a visual model of how data is structured in a system.

It answers four basic questions:

- What objects are we storing? → **Entities**
- What details do we store about them? → **Attributes**
- How are they connected? → **Relationships**
- How many of one connect to how many of another? → **Cardinality**

Think of it as the blueprint of your database.

---

# 2. Entities

### What it means

An **Entity** is a real-world object or concept you want to store data about.

### Examples

- User
- Order
- Product
- Invoice
- Team

### In Database Terms

Each **entity becomes a table**.

Example:

|User|
|---|
|user_id|
|name|
|email|

---

# 3. Attributes

### What it means

Attributes are properties of an entity.

They describe the entity.

### Example – User Entity

|Attribute|Meaning|
|---|---|
|user_id|Unique identifier|
|name|Full name|
|email|Email address|
|created_at|Account creation date|

### Types of Attributes

- **Primary Key (PK)** → uniquely identifies a record
- **Foreign Key (FK)** → links to another entity
- **Simple attribute** → single value
- **Derived attribute** → calculated (e.g., age from DOB)

---

# 4. Relationships

### What it means

A **relationship** shows how two entities are connected.

### Example

- A User places an Order
- A Product belongs to a Category
- A Team has many Users

### In Database Terms

Relationships are implemented using **Foreign Keys**.

Example:

Order table:

|order_id|user_id|amount|
|---|---|---|

Here, `user_id` connects Order to User.

---

# 5. Cardinality

Cardinality defines **how many instances of one entity relate to another**.

This is what your image is explaining.

---

## Cardinality Types Explained

### 1. One (1)

A single instance.

Symbol: `|`

Meaning: Exactly one.

---

### 2. Many (N)

Multiple instances.

Symbol: Crow’s foot (fork-like symbol)

Meaning: Many records.

---

### 3. One and Only One (1..1)

Symbol: `||`

Meaning:

- Must exist
- Only one allowed

Example:  
Each Order must belong to exactly one User.

---

### 4. Zero or One (0..1)

Symbol: `O|`

Meaning:

- Optional
- At most one

Example:  
A User may or may not have a profile picture.

---

### 5. One or Many (1..N)

Symbol: `|<`

Meaning:

- At least one
- Possibly many

Example:  
A Team must have at least one User.

---

### 6. Zero or Many (0..N)

Symbol: `O<`

Meaning:

- Optional
- Can have many

Example:  
A User may have zero or many Orders.

---

# 6. Common Relationship Types

### 1. One-to-One (1:1)

Example:  
User ↔ UserProfile

- One user
- One profile

---

### 2. One-to-Many (1:N)

Example:  
User → Orders

- One user
- Many orders

Most common relationship.

---

### 3. Many-to-Many (M:N)

Example:  
Students ↔ Courses

- One student → many courses
- One course → many students

Implemented using a **junction table**.

Example:

Student_Course table:

- student_id
- course_id

---

# 7. Simple Example ERD (E-commerce)

Entities:

- User
- Order
- Product
- Order_Item

Relationships:

- User (1) → (N) Order
- Order (1) → (N) Order_Item
- Product (1) → (N) Order_Item

Why Order_Item?  
Because Order and Product is Many-to-Many.

---

# 8. How This Converts to Database Tables

|ERD Concept|Database Equivalent|
|---|---|
|Entity|Table|
|Attribute|Column|
|Primary Key|Primary Key|
|Relationship|Foreign Key|
|Cardinality|Constraint|

---

# 9. Why ERD Matters

Without ERD:

- Duplicate data
- Broken references
- Poor performance
- Confusing schema

With ERD:

- Clear structure
- Defined ownership
- Controlled relationships
- Scalable system

---



