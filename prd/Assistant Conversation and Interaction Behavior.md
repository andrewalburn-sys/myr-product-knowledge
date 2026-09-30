---
kb_id: assistant-conversation-behavior
title: Assistant Conversation and Interaction Behavior
authority: canonical
status: working-product-contract
owner: Andrew Alburn
audience:
  - product
  - design
  - engineering
  - qa
  - coding-agents
applies_to:
  - production
  - demo
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code:
  - src/components/assistant
  - src/assistant/chatHistory.ts
  - src/assistant/chatTitle.ts
related_docs:
  - prd/PRD - MyRecipes Assistant.md
  - prd/PRD - Assistant Discovery MVP (Backend).md
  - prd/Assistant Discovery MVP - App Requirements.md
  - knowledge-base/DECISION_LOG.md
---

# Assistant Conversation and Interaction Behavior

**Status:** Working product contract
**Audience:** Product, design, app engineering, backend engineering, QA, and coding agents
**Owner:** Andrew Alburn
**Last updated:** September 30, 2026
**Parent:** `PRD - MyRecipes Assistant.md`
**Release requirements:** `PRD - Assistant Discovery MVP (Backend).md` and `Assistant Discovery MVP - App Requirements.md`

This document defines how a MyRecipes Assistant conversation should behave from the user's point of view. It is the first place to look when a question concerns turns, context, navigation, history, response presentation, or continuity rather than retrieval internals.

The core rule is simple: **the conversation is a durable object, not the current screen.** Dismissing the assistant or temporarily opening content must not erase it. Starting a new chat, changing the subject, and changing where the assistant searches are explicit state transitions with different consequences.

Feature-specific relevance and retrieval logic remain in the linked specifications. This document connects those systems into one interaction contract.

---

## 1. How to use this document

Requirements use these terms:

- **Must** is a product requirement.
- **Should** is the expected default, with room for a documented exception.
- **May** is optional.
- **Demo note** records how the current prototype represents the behavior. It is not automatically a production requirement.
- **Open decision** names a question that product and design still need to settle. Developers should not resolve one silently through implementation.

When documents conflict, use this order:

1. `PRD - MyRecipes Assistant.md` for product principles and trust promises.
2. The applicable release PRD for scope and service behavior.
3. This document for cross-feature conversation and interaction behavior.
4. Feature-specific relevance or execution specs for their own domain.
5. POC documents and implementation notes only as evidence of prototype behavior.

---

## 2. Conversation model

### Conversation

A conversation is the ordered set of user turns, assistant responses, active constraints, scope, shown results, tried suggestions, and enough state to interpret the next turn.

A conversation must not be inferred solely from which app screen is visible.

### Turn

A turn begins when the user submits text, voice, a photo, or a suggested action. The feed appends:

1. the user's visible action;
2. an inline working state;
3. the completed response or an honest failure.

A new turn must not replace or visually rewrite earlier turns. Only the latest completed response exposes active follow-up controls.

### Surface context

Surface context tells the assistant what the user is looking at when the conversation begins or when they explicitly bring new content into it.

- On a recipe, pronouns such as “it” refer to that recipe unless the conversation establishes another subject.
- In Saves, an unqualified discovery request searches the user's saved library.
- In Meal Plans, a request may act on the plan in view.
- On Home, discovery defaults to the complete recipe catalog.

An explicit user request overrides the starting surface. “Show me chicken recipes from my saves” is a Saves request even when asked from Home.

### Scope

Scope answers **where the assistant is searching or acting**. At minimum the system distinguishes the full catalog, Saves, the recipe in view, and the current plan.

The user must be able to understand the active scope when it changes the answer. The exact visual treatment is a design decision; scope cannot remain an invisible implementation detail.

---

## 3. Opening, dismissing, and starting over

### Opening

- The assistant opens only after an explicit user action.
- It overlays the current app experience rather than destroying or replacing it.
- Opening it again in the same active conversation restores the existing feed.
- The opening state may offer contextual suggested actions, but typing remains available.

### Dismissing

- Dismissing the assistant returns to the underlying screen exactly as the user left it.
- The conversation, active constraints, result set, draft state where supported, and scroll position must survive a temporary dismissal.
- Dismissal is not the same as **New chat**.

### New chat

Starting a new chat clears conversation-scoped state:

- prior turns;
- active discovery constraints other than profile-level restrictions;
- shown-result and suggestion history;
- temporary photo analysis;
- the current plan-editing thread unless it has been saved elsewhere.

Profile-level dietary restrictions and dislikes remain because they are not chat state.

The product must never silently start a new chat because a modal closed, a recipe opened, or a component remounted.

---

## 4. Context and constraint behavior

The assistant maintains one canonical interpretation of the active request. Response copy, retrieval, follow-up suggestions, and diagnostics must all use that same state.

### Additive refinements

Follow-ups such as “with chicken,” “it should also have mushrooms,” or “and cheese” add requirements to the existing request. They do not replace the subject.

Example:

1. “show me tacos”
2. “with chicken”
3. “and also cheese”
4. “only quick ones”

The fourth turn still means quick chicken-and-cheese tacos. “Quick” changes ranking unless the user gives a numeric threshold.

### Replacements

Language such as “actually make it vegetarian,” “use beef instead,” or “forget the mushrooms” replaces or removes the applicable part of the active request. Unrelated constraints remain.

### Hard and soft constraints

- Explicitly required ingredients, exclusions, stated diets, allergies, cuisines, and numeric time limits are hard constraints.
- Relative qualities such as quick, easy, healthy, cheap, comforting, or familiar guide interpretation and ranking unless made measurable.
- All hard constraints are conjunctive. A request for chicken, broccoli, rice, and soy requires all four for a complete match.
- Singular, plural, and known ingredient aliases must normalize without introducing substring errors.
- A cuisine selected from a pre-populated follow-up, such as “Something Italian,” has the same force as a typed cuisine request. It remains active through later refinements until the user replaces it or clearly changes topics.

### Topic changes

When the user clearly starts an unrelated request, transient dish, ingredient, occasion, and time context resets. Profile-level restrictions survive. A topic change must not be inferred from a short referential refinement.

The assistant should make a replacement legible in its response. It should not present a fresh result set as though prior context never existed.

### Context transparency

Response copy naturally summarizes the request now being fulfilled. It should sound like a direct response, not an internal query dump.

Good: “Here are some recipes with chicken, broccoli, rice, and soy.”

Avoid: “I looked for chicken broccoli rice soy.”

The summary and the returned results must agree. If the assistant cannot enforce everything named in the summary, it must use the partial-match behavior in §7.

---

## 5. Feed and working-state behavior

- Every submitted turn appears in the feed.
- Every request receives an immediate working state; the interface never hangs silently.
- A completed response replaces only its own working state.
- Earlier recipe sets and answers remain readable in the transcript.
- Follow-up suggestions appear only on the latest applicable response.
- A retry remains part of the same conversation unless the user explicitly starts over.
- Provider or model failure is shown as an honest response with a recovery action, not as an empty rail.

The assistant may automatically scroll to reveal a newly submitted or completed turn. It must not unexpectedly move the user while they are reading an earlier turn.

---

## 6. Opening a recipe and returning to chat

A recipe card inside the assistant behaves like the standard recipe card elsewhere in the app, with one additional continuity requirement.

When the user opens a recipe from the assistant:

1. the current conversation remains mounted and unchanged;
2. the assistant hides while recipe detail is visible;
3. the recipe opens through the normal recipe-detail route;
4. Back returns to the same assistant conversation;
5. the same turns, active context, latest result, and scroll position are restored.

Opening a recipe is not a new chat and is not a topic change.

If a user begins on recipe A, opens the assistant, and then opens recommended recipe B, Back restores recipe A beneath the same conversation.

Recipes opened outside the assistant keep the app's normal navigation behavior.

---

## 7. Recommendation and partial-match presentation

### Complete matches

- Complete discovery matches use the standard recipe-card treatment.
- Cards retain image, title, rating, review count, total time, source, and favorite affordance where available.
- Tapping anywhere designated as the card action opens the recipe.
- Returning fewer than the target count is valid. The app does not pad the set with weaker recipes.

### Partial matches

Partial matches are a recovery state, not ordinary recommendations.

- The response first says that no recipe satisfied every hard requirement.
- Each partial match names what it satisfies and what is missing.
- Partial matches must not be mixed invisibly into a complete-match carousel.
- The supporting explanation appears as normal text associated with its card, not as a promotional badge or purple explanation tile.
- The list-oriented card treatment is used so each explanation clearly belongs to one recipe.

Example:

> I couldn't find a recipe that verifies chicken, rice, soy, peppers, and pickles together. These are the closest matches; each card notes what's missing.

### Saved-library results

Saves results use a ranked list and never include catalog recipes that are not actually saved. If nothing qualifies, the response may offer a clearly labeled action to search the full catalog.

---

## 8. Cooking questions and citations

The answer format depends on the question, not on one universal template.

### Questions that benefit from expert guidance

Technique, doneness, food safety, health, nutrition, and meaningful dietary adaptation may use attributed editorial guidance when a source genuinely supports the claim.

- The source should be a substantial part of the answer, not a decorative quote appended to every response.
- The answer may introduce the guidance, present the source, and then explain how it applies to the recipe.
- Long answers break into readable paragraphs.
- Production citations must be real, attributable, and link to the supporting source.
- Production must never fabricate a contributor, quotation, article, or link.

### Mechanical questions

Conversions, scaling arithmetic, timer math, and other mechanical transformations normally do not need a quotation. Answer them directly and clearly.

### Demo note

The current prototype can simulate the visual form of an editorial answer using controlled contributors and generated source wording. That content must remain marked as demo-generated in implementation data. It is design demonstration, not evidence that a real quote exists and not a production citation strategy.

---

## 9. Recipe-specific suggested questions

Questions offered on a recipe page must be derived from the actual recipe. Before selecting them, the system considers available ingredients, quantities, directions, techniques, equipment, timing, and known failure points.

- Every displayed question has a concrete recipe anchor.
- Questions may address ingredient purpose, substitutions, technique, sensory cues, failure prevention, flavor balance, timing, storage, or a confusing step.
- Generic questions reused across unrelated recipes are not acceptable.
- Fewer useful questions are better than padding the interface to a fixed count.
- A missing or incomplete recipe payload should produce a grounded fallback or fewer questions, not unrelated prompts.

Detailed eligibility and scoring live in `Recipe-Specific Suggested Questions - Relevance Rules.md`.

---

## 10. Follow-up suggestions

Follow-up suggestions carry the current conversation forward; they do not begin a disconnected search.

- A suggestion keeps all active hard constraints unless it explicitly and safely replaces one.
- Suggestions are checked for evidence and viability before display.
- The interface shows zero to three; it never pads.
- Previously tried, contradictory, redundant, or dead-end suggestions are suppressed.
- Tapping a suggestion produces the same state transition as typing the equivalent request.

Detailed rules live in `Assistant Follow-Up Suggestions - Relevance Rules.md`.

---

## 11. Chat history

Chat history is a list of conversations, not a list of raw prompts.

### Titles

- A title summarizes the subject or outcome after the first completed response.
- It is concise, normally three to seven words.
- It does not copy the initial query verbatim when a clearer synthesis is available.
- Structured state should drive structured titles: “Chicken, Broccoli & Rice Recipes,” “Quickest Saved Recipes,” or “Caesar Pasta Salad Cooking Technique.”
- A title is stable after creation unless the product explicitly introduces retitling.

### Restoration

Opening a history item restores its transcript and the state required to continue it. Returning from history without selecting a different chat leaves the active conversation untouched. **New chat** creates a new empty conversation in the current app context.

### Photos

Uploaded photos are not stored in chat history without an explicit retention decision and consent model. A restored photo-derived conversation may retain safe text output but must state that the original photo was not saved.

### Demo note

The current prototype keeps the latest 25 compacted chats in local browser storage. This is a demo persistence mechanism, not the production retention, sync, privacy, or account model.

---

## 12. State transition reference

| User action | Same conversation? | Context effect | Expected return behavior |
|---|---:|---|---|
| Dismiss assistant | Yes | None | Reopen the same feed and position |
| Open a recipe result | Yes | None | Back restores the same feed and position |
| Submit a follow-up | Yes | Merge, replace, or remove constraints | Append a new turn |
| Tap a follow-up suggestion | Yes | Same as equivalent typed follow-up | Append a new turn |
| Retry a failed turn | Yes | Preserve valid prior context | Replace or append recovery in the same thread |
| Open chat history | Yes | None until another chat is selected | Back leaves active chat untouched |
| Select a history item | Switch | Restore selected conversation state | Continue selected chat |
| Tap New chat | No | Reset conversation-scoped state | Show contextual opening state |
| Clearly change the subject | Yes | Reset transient topic context; keep profile restrictions | Append a response for the new subject |
| Sign out | No | End authenticated session | Do not expose prior account conversation |

---

## 13. Acceptance sequences

These are compact interaction checks, not retrieval-quality benchmarks.

### Recipe drill-in continuity

1. Open the assistant on Home.
2. Ask for “chicken and rice.”
3. Open a returned recipe.
4. Tap Back.

Expected: the same assistant chat appears at the same position, with the query and results intact.

### Additive context

1. Ask for “chicken, broccoli, and rice.”
2. Follow with “it should also have soy.”

Expected: response copy names all four requirements. Complete results verify all four. If none exist, the assistant explains the miss and labels each close match's missing requirement.

### Relative refinement

1. Ask for tacos.
2. Add chicken.
3. Add cheese.
4. Ask for “only quick ones.”

Expected: taco, chicken, and cheese context remains active; quick reranks rather than replacing the subject.

### Cuisine refinement

1. Ask “What's for dinner tonight?”
2. Add “Should have chicken.”
3. Select “Something Italian.”

Expected: response copy acknowledges Italian, dinner, and chicken. Complete results satisfy the Italian cuisine taxonomy and contain chicken; Thai, Mediterranean, and unknown-cuisine recipes are not treated as complete matches. If no complete recipe exists, the assistant uses the transparent miss or partial-match behavior rather than silently relaxing Italian.

### Saves scope

1. Open from Saves.
2. Ask for the quickest chicken recipes.

Expected: only saved recipes appear, ordered by total time. The user can understand that Saves is the active scope.

### New chat

1. Complete any discovery turn.
2. Start a new chat.

Expected: the earlier feed and transient constraints are absent. Profile-level restrictions remain.

---

## 14. Current decisions and open decisions

### Current product decisions

- Conversation turns append; they do not replace earlier content.
- Explicit constraints persist until changed, removed, or reset by a clear topic change.
- Recipe drill-in and temporary dismissal preserve the conversation.
- Partial matches are transparent and visually separate.
- Response format follows the task.
- Mechanical answers do not receive unnecessary editorial quotes.
- History titles synthesize the conversation subject rather than copying the first prompt.
- Photos are not silently persisted.

### Open decisions

1. **Cross-surface continuity.** The production PRD says a conversation can continue across surfaces. The current demo intentionally mounts section-scoped chats when the user separately opens Assistant on Home, Saves, Planning, or a recipe. Recipe drill-in is already treated correctly as temporary navigation. Product and design still need to define how a user deliberately carries an active conversation from one top-level surface to another.
2. **Session end.** The behavior after app backgrounding, force quit, token expiry, and sign-out needs an explicit matrix.
3. **History persistence.** Production retention length, account sync, deletion, renaming, and privacy controls are undecided.
4. **Visible active context.** The user needs to understand scope and important carried constraints without turning the assistant into a filter panel. The final representation remains a design question.
5. **Title evolution.** Titles are currently created once. Whether an early material subject change may update a title is undecided.
6. **Draft preservation.** Whether unsent text survives dismissal, navigation, backgrounding, or app restart is undecided.

---

## 15. Related specifications

- `PRD - MyRecipes Assistant.md` — product principles, features, and trust standard
- `PRD - Assistant Discovery MVP (Backend).md` — service flows, constraints, failures, and response contract
- `Assistant Discovery MVP - App Requirements.md` — app ownership and release requirements
- `Assistant Discovery MVP - Design Brief.md` — required states and unresolved presentation questions
- `Assistant Semantic Retrieval - Elasticsearch Execution Spec.md` — retrieval compilation and diagnostics
- `Assistant Follow-Up Suggestions - Relevance Rules.md` — evidence and viability rules
- `Recipe-Specific Suggested Questions - Relevance Rules.md` — recipe-page question selection
- `Assistant Discovery - Golden Sequences.csv` — broader behavioral test set
- `poc/` — prototype detail only; not production authority
