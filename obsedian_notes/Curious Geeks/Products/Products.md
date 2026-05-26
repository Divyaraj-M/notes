---
title: "Products"
description: "Tools, apps, and products shared by the Curious Geeks community."
dg-publish: true
tags:
  - curious_geeks
permalink: /products/
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
	