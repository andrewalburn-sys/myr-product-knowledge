---
kb_id: assistant-semantic-retrieval
title: Assistant Semantic Retrieval — Elasticsearch Execution Spec
authority: canonical
status: draft-v0.1
owner: Andrew Alburn
audience:
  - product
  - backend-engineering
  - data-science
  - qa
applies_to:
  - production
  - demo
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code:
  - src/assistant/discovery
related_docs:
  - prd/PRD - Assistant Semantic Query Planner.md
  - prd/PRD - Assistant Discovery MVP (Backend).md
  - prd/Assistant Follow-Up Suggestions - Relevance Rules.md
---

# Assistant Semantic Retrieval — Elasticsearch Execution Spec

**Status:** Draft v0.1  
**Author:** Andrew Alburn  
**Parent PRD:** PRD - Assistant Semantic Query Planner.md  
**Release requirement:** PRD - Assistant Discovery MVP (Backend).md — Flow 5  
**Related spec:** Assistant Follow-Up Suggestions - Relevance Rules.md  
**Last updated:** September 29, 2026

---

## 1. Purpose

This document defines how an interpreted assistant request becomes reliable recipe retrieval against the production Elasticsearch-backed search system.

The parent Semantic Query Planner PRD establishes the product strategy: understand the situation, separate explicit requirements from inferred strategies, and produce several focused searches the existing retrieval system can answer. This companion spec defines the missing execution layer:

- The contract between semantic interpretation and retrieval.
- How abstract intent becomes bounded Elasticsearch-friendly query strategies.
- Which parts become hard filters, lexical queries, boosts, negative boosts, or application-level reranking.
- How results from several strategies are pooled, deduplicated, gated, reranked, and diversified.
- How the service fails honestly when the catalog cannot satisfy the request.
- What must be logged so a recommendation can be reconstructed.

The goal is not to have an LLM invent Elasticsearch JSON. The goal is to have an LLM or cached planner produce a small validated semantic plan that deterministic application code compiles into retrieval requests.

## 2. Scope

### In scope

- Open recipe discovery through the assistant.
- Abstract requests, such as “I need snacks for my son’s soccer team after practice.”
- Specific requests that still benefit from expansion, such as “something comforting that doesn’t take much work.”
- Explicit ingredient, diet, meal-type, cuisine, method, occasion, and numeric-time constraints.
- Several lexical or hybrid retrieval strategies per request.
- Elasticsearch candidate retrieval through the production search or Content API boundary.
- Hard gates, reranking, diversity, honest misses, and follow-up viability checks.

### Out of scope

- Choosing the production Elasticsearch cluster, client, gateway, or hosting arrangement.
- Replacing the company’s existing search or Content API.
- Defining the full recipe metadata enrichment program.
- Production taste-profile or makability modeling.
- Frontend layout.
- Allowing generated Elasticsearch Query DSL to execute without validation.

## 3. Known boundary and assumptions

The assistant should call an owned retrieval adapter, not Elasticsearch directly from a client. The adapter may ultimately call Elasticsearch, the Content API, or a company search service, but it exposes a stable assistant-facing contract.

The precise production index name, physical field names, analyzers, taxonomies, and semantic-search capabilities are not documented in the current project. Therefore:

- This spec uses logical field names.
- A field-binding table must map every logical field to the production index before implementation.
- Anything labeled required must exist or have an approved fallback before the corresponding behavior can be promised.
- Vector, sparse, or semantic fields may improve recall but are not required for the first version.

## 4. Core execution principles

### Interpret once; compile deterministically

The semantic planner produces meaning. A deterministic compiler turns that meaning into retrieval requests. Individual tools do not reinterpret the raw user message independently.

### Separate explicit constraints from inferred strategies

- Hard constraints must be true of every normal result. Examples: chicken, no mushrooms, dinner, vegetarian, under 30 minutes.
- Soft strategies are plausible ways to satisfy an abstract goal. Examples: handheld, shareable, mild, make-ahead, individual portions.

Soft strategies widen recall and influence ranking. They never silently become hard filters.

### Elasticsearch retrieves candidates; policy chooses the answer

Elasticsearch handles efficient recall, basic filters, and index-native relevance. The assistant application remains responsible for constraint semantics, ingredient validation, cross-strategy score normalization, situation fit, personalization, no-repeat behavior, diversity, and honest misses.

### Broaden queries, never constraints

When a strategy is thin, the service may issue a broader query expressing the same need. It may not remove chicken, ignore an exclusion, change dinner to any course, or drop a numeric time limit to fill three cards.

### The generated plan is data, not executable code

The planner may emit only values from a versioned schema and controlled vocabularies. It cannot emit arbitrary field names, scripts, index names, Query DSL, or boosts.

## 5. Planner-to-retrieval contract

The adapter accepts a validated semantic plan with these sections:

| Section | Contents |
|---|---|
| Identity | Plan version, request ID, interpreted need, and source |
| Topic | Primary dish, explicit meal types, and request type |
| Hard constraints | Required and excluded ingredient concepts, diets, numeric time, explicit cuisine or method |
| Situation | Audience, scale, occasion, eating context, portability, utensils, formats, and qualities |
| Strategies | One to seven bounded lexical searches with purpose and weight |
| Ranking | Relative qualities and requested diversity dimensions |
| History | Recipe IDs already shown or excluded |

Each retrieval strategy contains:

| Field | Meaning |
|---|---|
| ID | Stable trace identifier |
| Query text | Short, dish-oriented lexical query |
| Purpose | Which part of the interpreted need it explores |
| Positive signals | Controlled formats or qualities to boost |
| Negative signals | Controlled conflicts to penalize |
| Weight | Bounded relative importance |

Validation rules:

- One to seven strategies; three to five is normal for an abstract request.
- Query text is short and dish-oriented, not the original conversational paragraph.
- Ingredient, diet, cuisine, method, format, and quality values resolve against controlled registries.
- Strategy weights are bounded and normalized by the compiler.
- Hard constraints exist once at plan level and apply to every strategy.
- Unknown explicit constraints travel as unresolved. They are never discarded or treated as soft.
- No raw Query DSL or field names are accepted.

## 6. Logical recipe index contract

Engineering must bind these logical fields to the production index or document a fallback.

| Logical field | Purpose | Requirement | Safe fallback |
|---|---|---:|---|
| recipe_id | Deduplication and exclusion | Required | None |
| content_type or vertical | Exclude articles and non-recipes | Required | Content API type gate |
| title | Primary lexical relevance | Required | None |
| description | Secondary lexical relevance | Required | Empty value |
| ingredient_text | Recall and evidence | Required | Detail hydration |
| ingredient_concept_ids | Exact inclusion and exclusion | Strongly preferred | Over-retrieve, then validate normalized ingredient lines |
| course_tags | Explicit meal-type eligibility | Required for a strict promise | Application classifier; unknown excluded |
| diet_tags | Vegetarian, dairy-free, and related filters | Required for supported diets | Documented ingredient backstop only |
| cuisine_tags | Filters and boosts | Preferred | Lexical title or tag query |
| method_tags | Sheet pan, slow cooker, grilled, no-cook | Preferred | Lexical query plus inference |
| format_tags | Handheld, bowl, soup, sandwich, bar, bite | Preferred | Application classifier or title inference |
| total_time_minutes | Numeric gate and speed ranking | Required for time promises | Unknown excluded for a numeric limit |
| servings or yield | Crowd and portion signals | Preferred | Soft large-batch indicators |
| rating and review_count | Quality | Preferred | Neutral score |
| freshness | Optional freshness rank | Optional | Omit signal |
| brand or source | Card rendering and source balancing | Required for cards | Hydrate before response |
| image | Full card rendering | Required for cards | Approved fallback or drop card |
| semantic recipe field | Hybrid recall | Optional | Lexical multi-query retrieval |

Physical field bindings belong in adapter configuration, not an LLM prompt.

## 7. From an abstract request to retrieval strategies

### Interpret the situation

Example:

> I need to make snacks for my son’s soccer team after practice.

The planner should identify:

- Interpreted need: portable, crowd-friendly snacks for children after practice.
- Explicit topic: snack.
- Inferred audience: kids.
- Inferred scale: crowd.
- Inferred context: standing or on the go.
- Portability: important.
- Utensils: avoid.
- Useful formats: handheld, individual portion, bar, bite, wrap.
- Useful qualities: shareable, make-ahead, approachable.

“Snacks” is explicit and may constrain the course. Crowd, kids, portability, and no utensils are inferred strategies. They guide retrieval and ranking but do not independently disqualify every recipe lacking those tags.

### Generate focused strategies

Translate the situation into distinct dish families rather than synonyms:

1. Handheld snacks for kids.
2. Make-ahead snack bites.
3. Portable snack bars.
4. Party pinwheels and wraps.
5. Individual savory muffins.

A weak strategy set repeats “soccer snack,” “sports snack,” and “team snack” and expects Elasticsearch to infer the situation from one phrase.

### Add positive and negative signals

Positive signals:

- Handheld or individual portions.
- Bars, bites, muffins, pinwheels, small sandwiches, and wraps.
- Make-ahead or packable.
- Yield consistent with a group.
- Approachable formats and flavors.

Negative signals:

- Soup, stew, or liquid dishes.
- Plated entrées.
- Sauces, dressings, and condiments.
- Fragile dishes that depend on immediate service.
- Knife-and-fork formats.

These are scoring signals. Only the explicit snack course and explicit dietary or ingredient constraints are hard gates.

## 8. Compiling the plan for Elasticsearch

### Recommended first version

Use one bounded search per strategy, preferably through Elasticsearch multi-search or an equivalent company batch endpoint.

Reasons:

- Each strategy stays independently observable.
- A weak strategy cannot monopolize the candidate window.
- Raw scores do not need to be compared directly across unrelated queries.
- Strategy-level success can improve cached plans later.

Recommended initial defaults, subject to load testing:

- Three to five strategies; seven maximum.
- Up to 20 candidates per strategy.
- A deduplicated pool of approximately 40–60 candidates.
- Full validation for only the top 20–30 after cheap filters.
- One to three final recipes.

These are engineering defaults, not product commitments.

### Logical query shape

Every strategy request contains:

1. A recipe/content-type filter.
2. Every plan-level hard filter.
3. Session recipe exclusions.
4. A field-aware lexical query weighted toward title and structured metadata.
5. Optional positive-signal boosts.
6. No hard minimum on inferred soft signals.

For “party pinwheels and wraps,” the logical shape is:

- Filter: content type is recipe.
- Filter: course includes snack.
- Exclude: IDs already shown.
- Must match: party pinwheels and wraps.
- Highest lexical weight: title.
- Next: format tags and description.
- Lowest: raw ingredient text.
- Optional boosts: handheld, individual portion, wrap, make-ahead, packable, shareable.

This becomes Query DSL only inside the deterministic adapter after physical field binding.

### Hard-filter compilation

| Plan constraint | Elasticsearch behavior | Application backstop |
|---|---|---|
| Required ingredient | Exact all-of concept filter when IDs exist | Validate normalized ingredient evidence after hydration |
| Excluded ingredient | Exact concept exclusion | Validate token-safe normalized evidence |
| Diet | Exact taxonomy filter | Supported ingredient backstop; never claim unsupported diets |
| Meal type | Exact course or role filter | Exclude unknown classification |
| Numeric time | Range filter | Exclude unknown time |
| Explicit cuisine or method | Exact taxonomy filter when required | Validate metadata after hydration |

Ingredient requirements must never be expressed only as boosted text. Presence is a gate; centrality is a ranking signal.

### Lexical field priority

1. Title and normalized dish name.
2. Structured format, method, course, cuisine, and ingredient concepts.
3. Description.
4. Raw ingredient text.
5. Body text only if it will not introduce article noise.

Use field-aware boosts rather than repeating keywords.

### Optional hybrid recall

If the index exposes a supported semantic field, combine lexical and semantic retrieval per strategy. Merge with reciprocal-rank fusion or another rank-based method.

Semantic similarity is never a hard gate and cannot override explicit ingredients, exclusions, diet, meal type, source, or time.

## 9. Pooling and score normalization

Raw Elasticsearch scores from different strategies are not directly comparable. Merge by rank.

Recommended first approach:

1. Deduplicate by recipe ID.
2. Record every strategy and rank position that retrieved the recipe.
3. Compute reciprocal-rank fusion: sum strategy weight divided by a stable constant plus rank.
4. Start with a conventional fusion constant such as 60 and tune offline.
5. Add a small agreement bonus when a recipe appears through meaningfully different strategies.
6. Carry strategy provenance into diagnostics.

If the production search service returns a documented normalized score, it may be used after validation. Do not assume this.

## 10. Hard gates after retrieval

Every candidate passes deterministic gates before reranking:

1. Valid recipe and renderable card.
2. Correct source scope.
3. Explicit meal type.
4. Explicit dietary restrictions.
5. Explicit ingredient exclusions.
6. Every required ingredient.
7. Numeric time limit.
8. Session exclusions.

Record a reason code for every rejected candidate. Never reintroduce a rejected recipe because too few remain.

Unknown data follows the promise:

- Unknown time fails an explicit numeric-time gate.
- Unknown course fails an explicit meal-type gate.
- Missing ingredient evidence cannot prove an all-of requirement.
- Missing optional situation metadata creates a neutral score, not a failure.

## 11. Situation-aware reranking

After hard gates, rerank the bounded pool in application code:

    final score =
      retrieval relevance
      + explicit-topic centrality
      + situation fit
      + quality
      + personalization
      + freshness
      - situation conflicts
      - repetition

Weights are configuration, not planner output.

Situation fit may use audience, group size, eating context, portability, utensil needs, format, and service timing. Missing evidence contributes zero; it never becomes fabricated support.

Negative signals lower candidates that match keywords but fail the use case. For youth-sports snacks, soup and plated pasta should lose to bars, wraps, bites, and muffins. This prevents shallow matches without turning every inference into a brittle exclusion.

Personalization applies only after hard gates. It cannot rescue an ineligible candidate.

## 12. Set selection and diversity

- Return one to three recipes.
- Prefer strong results over filling all three slots.
- Avoid near-duplicate titles and substantially identical formats.
- Preserve useful diversity across dish family, method, or flavor when the request is broad.
- Do not force diversity that reduces relevance for a specific request.
- Exclude already-shown recipes when unseen qualifying alternatives exist.
- If no unseen alternatives remain, return an honest “nothing else matches” response rather than repeat the set.

## 13. Thin results, fallback, and clarification

Fallback order:

1. Continue with remaining planned strategies.
2. Add one controlled broader lexical strategy expressing the same need.
3. Increase the candidate window within limits.
4. Return fewer strong complete matches.
5. Return an explicit complete-match miss.

Never drop a hard constraint.

Ask one clarifying question only when:

- The planner cannot distinguish materially different request types.
- An explicit ingredient or dietary term cannot be normalized safely.
- Different interpretations require different tools or hard filters and no safe default exists.

Do not ask merely because a request is abstract. Abstract requests are the planner’s job.

## 14. Follow-up viability reuse

The same compiler should power follow-up viability:

1. Apply the suggestion’s structured state change to a copy of the active plan.
2. Compile an index-only count or small candidate request.
3. Preserve every hard constraint and excluded recipe ID.
4. Record estimated unseen qualifying results.
5. Offer the suggestion only when the threshold in the follow-up relevance spec is met.

Avoid full hydration when structured index fields can prove viability. If viability cannot be checked cheaply, suppress the suggestion or validate it from the current result set.

## 15. Caching

Cache semantic plans, compiled strategy templates, permitted retrieval responses, and short-lived follow-up viability counts separately. Every entry includes the planner, concept-registry, and field-binding versions required for invalidation.

## 16. Failure and timeout behavior

| Failure | Behavior |
|---|---|
| Planner timeout | Use a cached common plan or deterministic template; otherwise return a retryable interpretation failure |
| Invalid planner output | Reject it and use deterministic fallback; never execute unvalidated fields |
| One strategy fails | Continue with other strategies and record the failure |
| Retrieval unavailable | Return a retryable service response, not an empty set |
| Hard filtering empties the pool | Name the blocking constraint; never relax it silently |
| One result qualifies | Return it and mark it as the only complete match |
| Reranker fails | Use deterministic retrieval rank after hard gates |
| Diagnostics fail | Preserve the user response and emit an operational error |

## 17. Observability

Each request must be reconstructable. Record request/session ID; planner source and version; interpreted situation; hard constraints and unresolved terms; strategy IDs, queries, and weights; field-binding version; per-strategy counts and latency; pool size; gate rejection counts; ranking contributions; history suppression; selected recipe IDs and provenance; fallbacks; and follow-up viability counts.

Do not expose queries, Elasticsearch fields, scores, or model details in consumer copy.

## 18. Adapter response

The assistant-facing response contains:

- Status: complete, only match, partial fallback, miss, or retryable failure.
- One to three full recipe-card payloads.
- Separately labeled partial matches, if used, with missing ingredient concepts.
- Concise interpretation copy.
- Enforced-constraint summary.
- Inspectable retrieval diagnostics.

A miss is a normal typed response, never an empty array the client must interpret.

## 19. Worked example

For the soccer-team request:

- Explicit: snack.
- Inferred: kids, crowd, portable, standing, no utensils, approachable, make-ahead helpful.
- Strategies: handheld kids’ snacks, make-ahead bites, portable bars, party wraps, savory muffins.
- Retrieval: bounded searches with the snack course gate, pooled and deduplicated.
- Reranking: boost packable individual portions and group yield; penalize soups, plated entrées, and utensil-dependent dishes.
- User copy: “Looking for portable, crowd-friendly snacks kids can eat after practice.”

If no snack-classified recipes clear the threshold, return an honest miss. Do not return dinner casseroles merely because “for a crowd” matched.

## 20. Evaluation and acceptance

### Contract and retrieval tests

- Planner output never contains field names or Query DSL.
- Hard constraints compile into every strategy.
- Unknown explicit terms fail validation rather than becoming soft text.
- Required ingredients are all-of gates.
- Exclusions use exact concepts or token-safe fallback.
- Quick, easy, and cheap remain ranking qualities unless the user supplies a number.
- Abstract plans produce distinct strategies, not paraphrases.
- Multi-search results merge and deduplicate correctly.
- Rank fusion remains stable when raw scores differ widely.
- Failed strategies do not erase successful ones.
- No hard-gate failure reaches the normal result set.
- Unshown alternatives are preferred during refinement.

### Golden abstract requests

1. I need snacks for my son’s soccer team after practice.
2. Something cozy for a rainy weeknight.
3. Food for a casual backyard party where people will be standing.
4. A lunch I can carry on the train and eat without making a mess.
5. Something impressive for a date night that won’t keep me in the kitchen.
6. A make-ahead breakfast for houseguests.
7. Comfort food for a sick friend that reheats well.
8. A picnic dish that can sit out for a little while.

For each, evaluate interpretation, strategy diversity, hard constraints, top-three situation fit, incompatible-format suppression, honest misses, latency, and retrieval calls.

Initial quality target:

- Zero hard-constraint violations.
- Zero silent constraint relaxation.
- Correct structured interpretation for every approved golden request.
- At least two of the top three results judged useful for the situation.
- Every recommendation traceable to interpretation, strategy, and ranking evidence.

Product and search should set final relevance and latency thresholds after measuring the production index.

## 21. Implementation packages

1. **Field discovery and binding:** inventory production search, bind Section 6 fields, document gaps, and confirm batch/count/semantic capabilities.
2. **Validated compiler:** implement schemas and registries; compile deterministically; reject raw DSL.
3. **Multi-strategy retrieval:** add bounded batch retrieval, deduplication, rank fusion, and provenance.
4. **Hard gates and evidence:** implement ingredient, diet, course, time, source, and exclusion gates.
5. **Situation reranking and diversity:** add positive and negative situation signals, quality, personalization, diversity, and history.
6. **Failure, observability, and viability:** add typed misses, traces, dashboards, and follow-up preflight.
7. **Evaluation and rollout:** run golden requests, tune, shadow-test, and monitor.

## 22. Decisions required before engineering estimates

1. What is the supported production boundary: Elasticsearch, Content API search, or another service?
2. What are the real indices, mappings, analyzers, and supported query features?
3. Do canonical ingredient concept IDs exist, and at what coverage?
4. Are course, diet, cuisine, method, and format taxonomies reliable enough for hard filters or only boosts?
5. Can the search boundary execute multi-search, batching, or cheap count requests?
6. Does the index expose supported semantic, sparse, or vector fields?
7. Which fields can return in the first response so cards need no second call?
8. What latency and request-volume limits apply?
9. Who owns strategies, field bindings, concept registries, and ranking configuration?
10. What logging is permitted for raw queries and inferred situation attributes?

Until these are answered, this spec defines adapter behavior and evaluation—not a claim about the current production index.
