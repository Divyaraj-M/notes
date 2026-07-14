---
title: Products
description: Tools, apps, and products shared by the Curious Geeks community.
dg-publish: true
tags:
  - curious_geeks
permalink: /products/
related:
  - "[[_template]]"
  - "[[4 - Product Specs]]"
  - "[[2026-01-30]]"
  - "[[Create a project]]"
  - "[[First-Principles Product Template]]"
  - "[[Sparrowcrm]]"
  - "[[Feature Lens — How It Works]]"
  - "[[Next 90 Day objective - Feb 1 to Apr 30]]"
  - "[[Product Spec Template 2]]"
  - "[[Custom Agent builderv1]]"
  - "[[@Poonam singh]]"
  - "[[README]]"
  - "[[Table view for question card PRD]]"
  - "[[Project admin settings]]"
  - "[[laundry list]]"
---

Things built by people who notice. Submitted by the community — if it's here, someone thought it was worth sharing.

[+ Post your product](TALLY_PRODUCT_FORM_URL)

---

```dataview
TABLE WITHOUT ID
  ("[[Products/" + file.name + "|" + title + "]]") AS Product,
  tagline AS Tagline,
  maker AS Maker,
  tags AS Tags,
  date AS Added
FROM "Products"
WHERE file.name != "Products" AND file.name != "_template" AND dg-publish = true
SORT date DESC
```

---

*Built something worth sharing? Takes 2 minutes.*
	