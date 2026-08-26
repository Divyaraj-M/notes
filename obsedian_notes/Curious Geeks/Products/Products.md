---
description: "Things I've built: shipped products, side projects, and the experiments that went nowhere."
dg-publish: false
permalink: /products/
tags:
  - curious_geeks
---
Things I've built. Some shipped, some didn't. The ones that didn't are usually more interesting.

---

```dataview
TABLE WITHOUT ID
  ("[[Products/" + file.name + "|" + title + "]]") AS Product,
  tagline AS Tagline,
  tags AS Tags,
  date AS Added
FROM "Products"
WHERE file.name != "Products" AND file.name != "_template" AND dg-publish = true
SORT date DESC
```
