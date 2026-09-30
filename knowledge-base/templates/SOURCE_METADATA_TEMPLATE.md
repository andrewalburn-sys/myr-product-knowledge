# Source metadata template

Copy this block to the first line of a governed Markdown source. Replace every placeholder and keep the existing body unchanged unless the task also calls for a product edit.

```yaml
---
kb_id: stable-kebab-case-id
title: Human-readable title
authority: canonical
status: active
owner: Andrew Alburn
audience:
  - product
applies_to:
  - production
last_reviewed: YYYY-MM-DD
supersedes: []
superseded_by: null
related_code: []
related_docs: []
---
```

Allowed authority values are `canonical`, `release`, `supporting`, `poc`, `generated`, and `archived`. Use repository-root-relative paths in `related_docs` and app-root-relative paths in `related_code`.
