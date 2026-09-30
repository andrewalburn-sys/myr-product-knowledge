---
kb_id: assistant-semantic-query-planner
title: PRD — Assistant Semantic Query Planner
authority: canonical
status: approved-logic-implementation-pending
owner: Andrew Alburn
audience:
  - product
  - backend-engineering
  - qa
applies_to:
  - production
  - demo
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code:
  - src/assistant/semanticPlanner.ts
  - src/assistant/intent.ts
related_docs:
  - prd/PRD - MyRecipes Assistant.md
  - prd/Assistant Semantic Retrieval - Elasticsearch Execution Spec.md
  - prd/PRD - Assistant Discovery MVP (Backend).md
---

# PRD — Assistant Semantic Query Planner

**Status:** Approved product logic; implementation pending  
**Parent PRD:** [[PRD - Agentic Recipe Assistant]] (`poc/PRD - Agentic Recipe Assistant.md`)  
**Related feature:** [[PRD - Dinner Decision Engine]] (`poc/PRD - Dinner Decision Engine.md`)

## 1. Purpose

Every typed assistant query must be semantically understood before the system selects a tool, searches, changes a plan, or writes a response. The assistant must not treat a conversational request as a bag of keywords or insert parser fragments into user-facing copy.

This specification governs typed queries submitted through the assistant on every surface where the assistant appears, including:

- "Show me things for picky eaters."
- "Show me chicken recipes from my saves."
- "Add something my kids will like to this plan."
- "Make this recipe work for picky eaters."
- "What are some kid-friendly dinners?"
- "Food for the whole soccer team."
- "Something comforting that does not take much work."

The shared planner interprets and routes these requests. The selected tool remains responsible for domain-specific execution and output. The dedicated "What's for dinner tonight?" experience is additionally governed by `poc/PRD - Dinner Decision Engine.md`.

## 2. Product Goal

Turn natural-language input into the correct assistant job and a useful, natural response by:

1. Interpreting the user's semantic intent.
2. Resolving explicit action and data-source references.
3. Combining the request with current surface and session context.
4. Selecting the correct assistant tool and result format.
5. Translating discovery or planning intents into searches the current recipe MCP can answer well.
6. Combining real recipe results with mocked personalization signals where applicable.
7. Explaining the interpretation naturally and visibly.

The user should feel that the assistant understood the job, not that it repeated the request.

## 3. Scope

### In scope

- Typed queries in the assistant on Home, Saves, Meal Plans, an open meal plan, recipe detail, Search, and other surfaces where the assistant is available.
- Shared semantic interpretation before tool routing.
- Explicit-intent overrides that can route away from a surface's default tool.
- Surface-aware defaults when the user does not specify an action or data source.
- Real recipe retrieval through the existing MCP/local retrieval interface.
- Hybrid semantic planning using cached common plans plus an LLM fallback.
- Tool-specific execution plans for discovery, saved-library querying, planning, adding to a plan, and recipe-context questions.
- Multiple MCP searches, result merging, deduplication, ranking, and diversity when retrieval benefits from expansion.
- Mocked persona, save, cook-history, and pantry signals.
- Natural response framing based on interpreted intent.
- Session continuity for follow-up refinements.

### Out of scope

- Replacing the homepage's traditional search field.
- Production personalization or cross-session preference learning.
- Inferring allergies, dietary restrictions, or other safety constraints.
- Requiring every result to match every inferred retrieval strategy.
- Giving every tool the same output format.
- Using corpus discovery when the user explicitly asked to query only saved recipes.

## 4. Product Decisions

1. Explicit action language takes priority over surface defaults.
2. Explicit references such as "my saves," "this recipe," and "this plan" determine the data source or object in scope.
3. When neither is explicit, current surface context supplies the default job.
4. An unspecified meal type remains unspecified unless the selected feature has an explicit meal-type contract.
5. Only explicit meal-type language creates a meal-type requirement in open discovery.
6. The planner may issue multiple MCP searches and merge their results.
7. Common intents use versioned cached plans; unfamiliar intents use LLM planning.
8. Personalization influences query selection and ranking.
9. The UI briefly explains how the request was interpreted when doing so helps the user evaluate the result.
10. The assistant answers immediately unless ambiguity would make a useful answer impossible.
11. Inferred strategies influence retrieval and ranking but are not hard result filters.
12. Allergies and dietary restrictions are enforced only when explicitly stated.
13. A deliberate loading state is acceptable while planning and retrieval run.

## 5. Core Principles

### Interpret first, search second

The raw message is input to an intent planner. It is never used directly as a heading, blindly passed to retrieval, or interpreted independently by multiple tools.

### Explicit intent overrides location

The surface provides context, not a permanent routing restriction. "Show chicken recipes from my saves" means a saved-library query on Home. "Find new chicken recipes" means corpus discovery on Saves.

Routing priority is:

1. Explicit requested action
2. Explicit object or source reference
3. Current surface default
4. Best immediate assumption
5. Clarification only when a useful answer is impossible

### Separate requirements from strategies

- **Requirements** are explicit and enforceable: "with chicken," "under 30 minutes," "no dairy," "dinners."
- **Strategies** are inferred ways of satisfying a goal: familiar formats, mild flavors, customizable components, handheld foods.

Strategies improve retrieval and ranking. They do not become unspoken restrictions.

### Plan for the retrieval system that exists

When retrieval is required, the LLM should not merely restate a semantic concept as one broad search. It should formulate lexical, dish-level searches likely to work well with the current MCP.

### Generate copy from meaning, not tokens

Headings, interpretation text, and card explanations are generated from the structured intent and response frame. Search strings and parser fragments are never exposed as response copy.

### Keep the demo honest

Recipes and recipe content are real. Personalization depth remains mocked, consistent with the parent PRD.

## 6. End-to-End Flow

```text
Raw typed assistant query
  → semantic interpretation
  → explicit-constraint extraction
  → action, source, and object-reference resolution
  → surface-context resolution
  → tool and result-format selection
  → cached-plan lookup
  → LLM planning when needed
  → tool-specific execution
  → retrieval / library filtering / plan change / recipe-context answer
  → natural response synthesis
  → correct inline component + contextual follow-ups
```

## 7. Structured Semantic Intent

The planner produces an inspectable object conceptually shaped like:

```json
{
  "task": "recipe_discovery",
  "surface": "homepage",
  "requested_action": "discover_recipes",
  "referenced_source": "recipe_corpus",
  "referenced_object": null,
  "interpreted_need": "approachable options for picky eaters",
  "common_intent_key": "audience:picky_eaters",
  "meal_types": [],
  "explicit_constraints": [],
  "soft_strategies": [
    "familiar dishes",
    "mild flavors",
    "customizable components",
    "recognizable formats"
  ],
  "personalization_signals": [
    "saved recipe patterns",
    "frequently cooked proteins",
    "usual pantry ingredients"
  ],
  "search_queries": [],
  "response_frame": {
    "result_format": "recipe_carousel",
    "heading_concept": "approachable options for picky eaters",
    "interpretation_summary": "what the assistant looked for"
  },
  "confidence": "high"
}
```

For open discovery, an empty `meal_types` array means the user did not constrain the meal type. It does not mean "dinner." A specialized feature may still have an explicit default contract, such as the Dinner Decision Engine.

## 8. Hybrid Intent Planning

### 8.1 Common cached plans

The first plan library should include:

- Picky eaters
- Kid/family-friendly food
- Feeding a crowd
- Date night
- Comfort food
- Low-effort meals
- Budget-friendly meals
- Something new
- Pantry-oriented meals

Each plan defines:

- Semantic aliases that map to the plan.
- A concise interpreted need.
- Several retrieval strategies.
- MCP-friendly query templates.
- Natural heading and interpretation concepts.
- Optional diversification guidance.
- Valid tool contexts and result formats.

### 8.2 LLM fallback

If no common plan fits, the LLM creates the same structured plan. The plan is cached by normalized semantic intent for reuse.

The fallback must:

- Resolve requested action, source, and referenced object.
- Preserve every explicit constraint.
- Distinguish requirements from soft strategies.
- Produce a bounded set of purposeful searches when the selected tool requires retrieval.
- Avoid invented dietary or safety constraints.
- Produce response concepts, not final copy assembled from keywords.

### 8.3 Cache behavior

- Cache intent plans, not permanent recipe answers.
- Bundle/version common plans with the application for immediate use.
- Cache dynamically generated plans locally with a version and expiration policy.
- Apply explicit constraints and current personalization at request time.
- Continue retrieving recipes when asked so the result set can remain fresh.

## 9. Surface-Aware Routing and Tool Execution

The shared planner determines meaning and routing. The selected tool determines execution and output.

| Query and context | Tool behavior | Result format |
|---|---|---|
| Home: "Things for picky eaters" | Corpus discovery; mixed meal types allowed | Discovery carousel |
| Saves: "My recipes for picky eaters" | Filter and rank saved recipes | Saved-recipe list |
| Home: "Show chicken recipes from my saves" | Saved-library query despite Home context | Saved-recipe list |
| Saves: "Find me new chicken recipes" | Corpus discovery despite Saves context | Discovery carousel |
| Meal Plans: "Plan lunches for picky eaters" | Generate a plan from retrieved recipes | Plan view |
| Open plan: "Add something my kids will like" | Retrieve candidates, excluding plan duplicates | Add-to-plan cards |
| Recipe: "Make this work for picky eaters" | Answer using the recipe in context | Recipe answer |
| Recipe: "Find other picky-eater meals" | Corpus discovery because alternatives were requested | Discovery carousel |

### 9.1 Default behavior by surface

- **Home:** open recipe discovery unless the user explicitly invokes Saves or planning.
- **Saves:** query the saved library unless the user explicitly asks for new/discovery recipes or planning.
- **Meal Plans landing:** generate or query plans unless another action is explicit.
- **Open plan:** add to or refine that plan unless another action is explicit.
- **Recipe detail:** answer about or adapt the recipe unless the user asks to find alternatives.
- **Search or other assistant-enabled surfaces:** use explicit intent first; otherwise default to recipe discovery.

Surface defaults must never override explicit language.

### 9.2 Tool-specific planning

- **Discovery:** Generate one or more MCP-friendly searches, merge results, enforce explicit constraints, rank, diversify, and render recipe cards.
- **Saved library:** Search/filter only the user's saved set, using MCP data only to hydrate or enrich those saved records. Do not silently introduce unsaved recipes.
- **Plan generation:** Generate several searches suited to the requested plan, enforce course and dietary constraints, diversify the set, and render a plan.
- **Add to plan:** Search for candidates relevant to the semantic need, exclude recipes already in the plan, and expose an explicit Add action.
- **Recipe Q&A/adaptation:** Use the recipe in view as primary context. Do not invoke broad discovery unless the user asks for alternatives.
- **Refinement:** Apply the new instruction to the active semantic plan and retain prior explicit constraints.

## 10. MCP Search Planning

The planner should normally produce three to seven focused searches. It may use fewer when the request is already specific.

For "Show me things for picky eaters," a plan might use:

```text
grilled cheese recipe
chicken tenders recipe
cheeseburger recipe
mild pasta recipe
cheese quesadilla recipe
simple tacos recipe
kid-friendly snack
```

For "What are some kid-friendly dinners?" it may use similar dish strategies, but every search and final result must be dinner-eligible because the user explicitly said "dinners."

For "Food for the whole soccer team," it should recognize a crowd-serving goal and generate searches such as:

```text
casserole for a crowd
sheet-pan dinner for a crowd
party sandwiches
large-batch pasta
big-batch chili
```

Search expansion is a retrieval technique. It must remain invisible to the user unless exposed through an internal debug view.

## 11. Constraint Policy

### Hard requirements

Only explicitly stated constraints are hard-enforced:

- Required or excluded ingredients
- Dietary requirements
- Allergies
- Meal type
- Time limit
- Cuisine, method, or occasion when clearly requested

Examples:

- "Picky-eater recipes with chicken" requires chicken.
- "Kid-friendly dinners without dairy" requires dinner and dairy-free results.
- "Things my kids might like" does not infer dairy-free, nut-free, mild-only, or any allergy.

### Soft strategies

Inferred qualities such as familiar, mild, customizable, handheld, shareable, or low effort affect:

- Search expansion
- Semantic relevance scoring
- Personalization ranking
- Result diversity
- Response explanations

They do not need to be provable for every individual result.

## 12. Retrieval, Ranking, and Diversity

For tools that retrieve recipes, after running the planned searches:

1. Merge results into one candidate pool.
2. Deduplicate by recipe/document identifier.
3. Remove non-recipe results and invalid cards.
4. Enforce every explicit constraint.
5. Score semantic relevance to the interpreted need.
6. Add mocked personalization affinity.
7. Consider recipe quality and completeness.
8. Avoid recipes shown too recently when enough alternatives exist.
9. Diversify dishes, proteins, formats, and meal types where appropriate.

When meal type is unspecified, diversity across dinners, lunches, and snacks is desirable but not mandatory. Relevance and result quality take priority over forced category balance.

## 13. Response Synthesis

The response generator receives:

- The interpreted need
- Selected tool and result format
- Explicit constraints
- Soft strategies
- Selected recipes
- Personalization evidence
- Session context

It does not receive parser keywords as a heading template. The same semantic need may render differently depending on the selected tool:

- Discovery → recipe carousel
- Saves query → saved-recipe list
- Plan generation → plan view
- Add to plan → candidate cards with Add actions
- Recipe Q&A → recipe-context answer

### Picky-eater example

**User:** "Show me things for picky eaters."

**Heading:**  
"Here are a few familiar, low-pressure options for picky eaters."

**Visible interpretation:**  
"I looked for recognizable favorites, approachable flavors, and recipes that are easy to customize."

**Possible card explanations:**

- "Familiar flavors and easy to serve in smaller portions."
- "The toppings can be kept separate for selective eaters."
- "A recognizable format with very little unfamiliar mixed together."

The assistant must never produce copy such as:

- "Three things picky eaters dinners."
- "Three dinner picks featuring things picky eaters."
- "I searched for grilled cheese recipe."

### Follow-ups

Follow-up suggestions should derive from the interpreted intent and result set, for example:

- "Make them healthier"
- "Only show dinners"
- "More handheld options"
- "Show me three more"

The session retains the semantic intent and explicit constraints across these refinements.

## 14. Loading and Failure Behavior

### Loading

Use the assistant's general thinking state while:

- Interpreting an uncached request
- Resolving the correct tool and result format
- Generating a search plan
- Running multiple retrieval calls
- Ranking and composing the response

Cached common plans should skip unnecessary LLM planning and begin retrieval immediately.

### Failure

If a retrieval strategy performs poorly:

1. Continue with the other planned strategies.
2. Broaden within the interpreted need.
3. Preserve explicit constraints.
4. Return fewer strong results when necessary.
5. Explain the limitation naturally.

Never pad the result set with clearly unrelated recipes.

If the router is uncertain, it should make the best useful assumption using explicit language and surface context. It asks a clarifying question only when different interpretations would produce materially different actions and no safe default exists.

## 15. Acceptance Criteria

### Routing and context

- Explicit action language overrides the current surface's default.
- Explicit references to Saves, the current recipe, or an open plan select the corresponding source or object.
- Home "show chicken recipes from my saves" renders a saved-recipe list.
- Saves "find me new chicken recipes" renders corpus discovery results.
- Recipe "make this work for picky eaters" answers about the recipe in view.
- Recipe "find other picky-eater meals" returns discovery cards rather than a recipe answer.
- An open-plan query adds to or refines that plan unless another action is explicit.

### Semantic understanding

- "Show me things for picky eaters" produces natural picky-eater framing and may include lunches, dinners, and snacks.
- "What are some kid-friendly dinners?" returns dinner-eligible recipes only.
- "Food for the whole soccer team" is interpreted as a crowd-serving need.
- User-facing copy never exposes cleaned parser fragments or raw MCP queries.

### Search planning

- A broad semantic request can generate multiple MCP-friendly searches when the selected tool requires retrieval.
- Search results are merged and deduplicated.
- Explicit constraints survive every expansion and fallback.
- Cached common plans avoid repeat LLM planning.

### Personalization

- Saved, cooked, and pantry signals influence selection and explanations.
- Personalization does not override explicit user requirements.
- Mocked personalization is not presented as deeper account knowledge than the prototype possesses.

### Response quality

- The heading directly and naturally acknowledges the interpreted goal.
- A short visible explanation tells the user what the assistant considered.
- Card-level reasons are relevant to either the request or personalization evidence.
- The assistant answers immediately unless a useful answer is impossible without clarification.

### Safety and trust

- Allergies and dietary restrictions are never inferred.
- Only explicit restrictions become hard constraints.
- The system returns fewer results rather than knowingly violating an explicit constraint.

## 16. Evaluation Queries

Use these homepage queries for semantic-quality testing:

1. "Show me things for picky eaters."
2. "What are some kid-friendly dinners?"
3. "Picky-eater recipes with chicken."
4. "Kid-friendly meals with no dairy."
5. "Food for the whole soccer team."
6. "Something my kids will like."
7. "Something comforting that doesn't take much work."
8. "Lunches I can pack for a picky eater."
9. "Snacks for a crowd with no nuts."
10. "Show me things for picky eaters, but make them vegetarian."

Use these cross-surface pairs for routing regression testing:

1. Home: "Show chicken recipes from my saves."
2. Saves: "Find me new chicken recipes."
3. Saves: "What are my quickest chicken recipes?"
4. Meal Plans: "Plan five picky-eater lunches."
5. Open plan: "Add something vegetarian that kids will like."
6. Recipe: "Make this work for picky eaters."
7. Recipe: "Find other meals for picky eaters."
8. Any surface: "Create a meal plan from my saves."

## 17. Rollout

1. Build the shared semantic intent contract and inspectable debug output.
2. Validate semantic planning and natural response framing on homepage discovery first.
3. Add surface-aware routing and tool adapters for Saves, planning, open-plan, recipe, Search, and other assistant-enabled surfaces.
4. Run cross-surface regression tests to ensure explicit intent overrides location.
5. Review latency, retrieval success, response naturalness, and result-format correctness.
6. Keep the shared planner surface-agnostic so future assistant surfaces can adopt it without duplicating intent rules.
