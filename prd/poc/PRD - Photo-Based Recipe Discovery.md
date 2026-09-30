# PRD — Photo-Based Recipe Discovery ("What Can I Make From This?")

**Status:** Draft v1 — POC/demo specification
**Parent PRD:** [[PRD - Agentic Recipe Assistant]]
**Author:** Andrew Alburn
**Last updated:** August 10, 2026
**Working feature name:** Photo-Based Recipe Discovery (internal sub-flow names: **Pantry Scan**, **Dish Match**)
**User-facing entry point:** Camera icon inside the assistant's text input, next to the mic

**Related:** `PRD - Agentic Recipe Assistant.md` · `PRD - Dinner Decision Engine.md` · `../PRD - Assistant Semantic Query Planner.md`

---

## 1. Overview

### 1.1 Feature Summary

Photo-Based Recipe Discovery lets a user point the assistant at a photo instead of typing or tapping a chip. The user taps a camera affordance inside the assistant, then either snaps a photo or uploads one from their library/computer. The assistant looks at the photo and does one of two things, depending on what it sees:

1. **Pantry Scan** — the photo is a fridge, pantry, or countertop full of ingredients. The assistant identifies what it can see, shows that list back to the user (so they know it understood correctly), and returns recipes that make good use of those ingredients.
2. **Dish Match** — the photo is a plated dish (e.g., something at a restaurant). The assistant forms a best-effort guess at what the dish is — a name and/or short description — shows that guess to the user, and returns recipes that match it.

The assistant decides which of these two flows applies automatically, from the photo itself. The user never has to declare "this is my fridge" vs. "this is a dish" up front.

This is a **new input modality** for the assistant, not a new tool category. It plugs into the same orchestrator, the same recipe search pipeline, the same recipe cards, and the same follow-up/refinement mechanics already defined in the master PRD and proven in the Dinner Decision Engine. What's new is the first step: turning a photo into a query the existing pipeline can act on.

### 1.2 Relationship to the Agentic Recipe Assistant

This is a feature-specific child specification of [[PRD - Agentic Recipe Assistant]], sibling to [[PRD - Dinner Decision Engine]].

The master PRD defines the persistent assistant shell, surface context, intent routing and tool orchestration, the shared recipe-card/chip/loading/input components, and trust/constraint-enforcement rules. This PRD defines the behavior, UI states, recognition logic, POC data, and success criteria for turning a photo into a recipe-search request.

### 1.3 Product Bet

Two of the highest-friction moments in "what should I cook" are visual, not verbal:

- Standing in front of an open fridge, unable to describe — quickly, in words — everything that's in it.
- Eating something great and wanting to recreate it, without knowing its name.

Typing or tapping chips is a poor interface for both. A camera is the natural interface for "here's what I'm looking at — help me with this."

The feature is successful when it creates a meaningful improvement in:

- **Effort:** the user reaches a useful result faster than they could by typing an equivalent description.
- **Trust:** the user can see exactly what the assistant thinks it saw, before or alongside acting on it.
- **Coverage:** a real, common moment (fridge-staring; restaurant-envy) gets a first-class answer instead of "type it in and see what comes up."

### 1.4 Strategic Guardrail

The feature must not imply the assistant has *certain* knowledge of what's in the photo. Vision analysis is probabilistic: ingredients can be missed, partially hidden, or misidentified; a plated dish is a visual guess at a name, not a lookup against a known menu.

The assistant must always show its interpretation as an interpretation, and must make it trivially easy to correct.

Use language such as:

- "Here are a few things you can make with what I see:"
- "Here are some recipes similar to your photo:"
- "I may have missed a few things — add or remove anything below."

Both of the above are single-line headings that fold the interpretation directly into the response, rather than showing the interpretation and the heading as two separate lines (see §5.3a/§5.3b, §8.3/§8.4).

**Dish Match specifically:** the guessed dish name/description is still captured and used internally — it drives the search query and is available in the tool's output for debugging — but it is **never rendered as literal text** in the response. The heading is always the fixed line above, regardless of confidence or what the guess was. This is a deliberate simplification over an earlier draft that named the guess (e.g., "Here are some recipes like Chicken Shawarma:"): naming a guess that turns out wrong (e.g., a confident-sounding "Pasta Salad" for a photo that wasn't very clearly that) reads as a mistake in a way a generic line doesn't, and a single consistent line is easier to trust across every confidence level.

Avoid:

- "You have these ingredients." (as fact)
- "This is [dish]." (as fact)
- Any result framing that hides the interpretation step, so the user can't tell what the assistant is reasoning from.

This mirrors the pantry-honesty guardrail already established in the Dinner Decision Engine PRD (§1.4 there), extended to a new input type.

---

## 2. Goals and Non-Goals

### 2.1 Goals

- Let a user get recipe recommendations from a photo of ingredients (fridge/pantry/counter) or a photo of a finished dish, without typing.
- Automatically determine which of the two flows applies; no manual mode selection.
- Make the assistant's visual interpretation legible and correctable before/alongside acting on it.
- Reuse the existing recipe search pipeline (live MCP / local corpus), recipe cards, why-chips, follow-ups, and session-constraint mechanics — a photo is a new way to *start* a turn, not a new result format.
- Support both live camera capture and upload (library/computer) on every supported platform.
- Fail conservatively and helpfully when a photo can't be confidently interpreted.

### 2.2 Non-Goals

- **Multi-photo stitching.** v1 analyzes exactly one photo per turn (one fridge/pantry shot, or one dish shot). "Add another angle" / multi-shot pantry scanning is a future enhancement (§7-equivalent, see §15).
- **Barcode / packaged-product recognition.** v1 identifies loose/visible ingredients and prepared dishes, not packaged product SKUs or nutrition labels.
- **Guaranteed exact dish identification.** The assistant produces its best-effort guess at a name/description; it does not claim to recognize a specific restaurant's exact recipe.
- **A live pantry inventory.** A Pantry Scan photo informs *this turn's* search; it does not create, update, or persist a standing pantry/inventory record. (Consistent with the Dinner Decision Engine's existing pantry-language guardrail.)
- **Photo persistence, history, or a photo gallery within the assistant.** Photos are used ephemerally for analysis and are not stored (see §6.6, §8).
- **Nutrition estimation, calorie counting, or health scoring from the photo.**
- **New write-actions.** A photo turn produces recipe recommendations exactly like any other discovery tool; it does not save, plan, or otherwise write anything beyond what the master PRD already permits (save-plan, add-to-plan, etc.).

---

## 3. Target User and Job to Be Done

### 3.1 Primary Personas

**Weeknight Reducer (Pantry Scan):** standing in front of the fridge, trying to avoid a wasted trip to the store, wants dinner ideas that use what's actually there.

**Enthusiast (Dish Match):** had something memorable while out, wants to try making a version of it at home, and doesn't know — or doesn't want to type — its name.

### 3.2 Core Jobs

> When I'm looking at food — in my fridge or on a plate — let me just show it to the assistant instead of describing it, and get recipes that make sense of what I'm looking at.

### 3.3 Secondary Users

- **System Thinker:** may photograph a fridge clear-out and use the results to fill out a meal plan for the week.
- **Established Home Cook:** unlikely to be the primary user of this entry point, but benefits from it being fully optional and out of the way when not in use (same low-profile principle as the rest of the assistant).

---

## 4. Experience Principles

### 4.1 Show Your Work

Whatever the assistant believes it saw — an ingredient list, a dish guess — must be visible to the user, not just used silently to drive a search. This is the feature's core trust mechanic and directly enables correction.

### 4.2 Correction Is Cheap

If the assistant gets it wrong, fixing it should take one tap or a few characters — not a retry from scratch. Pantry Scan supports removing/adding ingredients inline. Dish Match supports falling back to normal text if the guess is off.

### 4.3 One Photo, One Fast Path

The user takes one action (snap or upload) and gets one outcome (an interpretation + recipes) with no intermediate "what kind of photo is this?" question. Mode detection is the assistant's job, not the user's.

### 4.4 Same Recipe, Same Trust Signals

Recipes returned from a photo look and behave exactly like recipes returned from typing or tapping a chip: same card, same rating/time/source metadata, same "why this fits" line, same follow-ups. A photo is a different door into the same room.

### 4.5 Fail Like a Person Would

If a photo is blurry, empty of food, or ambiguous, the assistant should say so plainly and offer an easy next step (retake, upload a different photo, or just type it) — never a silent empty state or a fabricated confident answer.

---

## 5. Core User Flow

### 5.1 Entry

1. User opens the assistant (any in-scope surface).
2. In the assistant's text input row, a camera icon sits next to the mic icon.
3. User taps the camera icon.
4. A lightweight action sheet offers: **Take Photo** · **Choose from Library** · **Cancel** (platform-appropriate; see §8.4 for web behavior).
5. User captures or selects a photo.

### 5.2 Analysis

1. The photo appears as a small thumbnail in a query-bubble-equivalent position (so the user sees what was submitted).
2. The assistant shows an analyzing loading state (distinct copy/treatment from the text-query "thinking" state — see §8.2).
3. The assistant classifies the photo as **Pantry Scan**, **Dish Match**, or **Unclear** and extracts the relevant content (ingredient list, or dish name/description).

### 5.3a Pantry Scan Result

1. The assistant shows a single heading line that folds the interpretation and the offer together — "Here are a few things you can make with what I see:" — followed directly by the detected ingredients as a row of **editable chips** (each removable; a lightweight "+ add" affordance for anything missed).
2. Using the (initial) detected ingredient list plus active session constraints, the assistant runs a recipe search and returns **up to three** recipes, each with a "why this fits" line that references the ingredient overlap (e.g., "Uses the zucchini and lemon from your photo").
3. If the user edits the ingredient chips (remove/add), the assistant re-runs the search against the updated list and updates the results in place — same pattern as any other refinement.

### 5.3b Dish Match Result

1. The assistant shows a single, fixed heading line above the results — "Here are some recipes similar to your photo:" — regardless of confidence or what it thinks the dish is. The guess itself still drives the search (§7.1) but is not named in the response (see §4.1).
2. The assistant searches using that guess (and its richer cues — key ingredients, format) and returns **up to three** recipes, each with a "why this fits" line naming the specific terms it shares with the photo (e.g., "Shares the chicken, flatbread, and white sauce from your photo."), falling back to a generic close-match line only when nothing overlaps.
3. If the guess is wrong, the user can ignore the photo result and simply type a correction in the same input (e.g., "actually it's more like a gyro") — handled as a normal follow-up/refinement on the active result, not a special photo-correction UI.

### 5.4 Miss / Low Confidence

If the assistant can't classify the photo with reasonable confidence, or Pantry Scan/Dish Match analysis yields nothing usable:

1. The assistant says plainly that it couldn't tell what's in the photo.
2. It offers **Try another photo** and **Describe it instead** as follow-up chips.
3. No recipe results are shown in this state (no padding with generic recommendations).

### 5.5 Evaluation and Refinement

Same as every other discovery tool in the assistant: the user can open a recipe, save it, ask for more, tighten a constraint ("faster", "no dairy"), or provide the same lightweight negative feedback defined in the Dinner Decision Engine (§5.5 there). All of this reuses existing mechanics — a photo turn is not a separate conversational mode.

---

## 6. Functional Requirements

### FR1 — Camera Entry Point

A camera-icon affordance sits inside the assistant's input row, adjacent to the existing mic button, on every surface where the assistant input is already present.

- Tapping it opens a native/appropriate capture-or-upload chooser (§8.4).
- The icon is present but does not imply the feature is required; typing and chips remain fully functional without ever touching it.

### FR2 — Capture and Upload, Every Platform

The user can supply a photo via **live camera capture** or **upload from photo library/computer**, on iOS, Android, and web.

- Web capture may be satisfied by a file picker with a camera-capture hint where the browser/device supports it; a plain upload path must always work as the guaranteed fallback on web (see §8.4).
- Only one photo is accepted per turn (Non-Goal §2.2).

### FR3 — Automatic Mode Detection

A single vision analysis step classifies the photo into exactly one of: `pantry_scan`, `dish_match`, `unclear`. The user is never asked to pick a mode manually.

- Classification and extraction happen in the same analysis call (one round trip, not classify-then-extract as two separate user-visible steps).

### FR4 — Pantry Scan: Ingredient Extraction and Confirmation

- The assistant extracts a list of distinct, visually identifiable ingredients from the photo.
- The list is shown as removable chips plus an "add" affordance before/alongside the first results — never hidden.
- The ingredient list is a **soft-match / preference signal** for search, not a hard "recipe must contain every item" filter. A photo with 15 visible items should not require a recipe to use all 15; it should bias toward recipes that use several of them. (Same spirit as the Dinner Decision Engine's `ingredient_familiarity` scoring dimension.)
- Editing the chip list triggers a re-search using the updated list, following the same refinement pattern as text-based follow-ups.
- **Results should skew toward an entrée/main dish, not simple sides or snacks, for the first suggestions.** Retrieval tries an entrée-biased query variant (ingredients + "dinner"/"entree") alongside the plain ingredient query, and the top three prefer lunch/dinner-main-eligible results over simple sides/snacks/condiments when at least three such results exist. This is a **soft** preference, not a hard course gate like the Dinner Decision Engine's — a photo whose ingredients genuinely only support lighter fare still returns something rather than failing.

### FR4a — Add a Missed Ingredient

The "+ Add" chip is a functional control, not a placeholder. Tapping it must let the user add an ingredient the assistant missed, with the same low-friction feel as removing one.

- **Trigger:** tapping "+ Add" transforms it, in place, into an inline text field (same pill height/shape as the other ingredient chips) with placeholder copy "Add ingredient…" and an auto-focused cursor/keyboard.
- **Commit:** submitting (return/enter, or a small confirm affordance at the trailing edge of the field) with non-empty text:
  1. inserts a new removable chip for that ingredient, positioned immediately before the "+ Add" chip (so "+ Add" stays the trailing, always-available control);
  2. reverts the field back to the default "+ Add" chip, ready for another entry;
  3. immediately re-runs the search with the updated ingredient list — the same one-commit-one-refresh behavior already specified for removing a chip (FR4), not a batched "Update results" step.
- **Cancel:** tapping away, or submitting empty text, silently reverts to the "+ Add" chip with no change and no re-search.
- **Duplicate guard:** submitting an ingredient that already has a chip (case-insensitive match) is a no-op on the list — it does not add a second chip and does not trigger a redundant re-search.
- **Freeform in v1:** the field accepts freeform text; there is no ingredient autocomplete/typeahead in v1 (see Open Questions, §15).
- **Row limit:** the ingredient row supports a reasonable cap (e.g., ~12 chips) before "+ Add" is disabled, so the block can't grow unboundedly tall. Exact cap is a build-time constant, not a hard product requirement.

### FR5 — Dish Match: Guess and Search

- The assistant produces one best-effort **dish guess**: a name, a one-line description, 2-5 visually identifiable key ingredients/components, and a format/vessel (e.g. "salad," "bowl," "wrap," "curry") — all extracted in the same vision call as the name (§7.2). Only the name and description are part of the earlier product-facing guardrail language (§4.1); the key ingredients and format exist purely to make retrieval and ranking more precise, and are never shown to the user.
- **Retrieval is multi-query, not single-query.** Rather than searching once on the bare name, the tool tries several query variants built from the fuller guess (name alone; name + key ingredients; format + name; name + description) and merges the unique results — the same accumulate-until-enough pattern the Dinner Decision Engine uses (PRD - Dinner Decision Engine.md FR5/§7.1), so a generic or ambiguous name isn't the only shot at a good match.
- **Ranking is by overlap with the photographed dish, never by persona taste.** Candidates are scored by how much of the guess's vocabulary (name, format, key ingredients, description — name weighted highest) actually appears in each candidate's title/ingredients/description, and the top three are taken by that score. This is a deliberate divergence from other discovery tools' persona-affinity ranking (e.g. `personaScore` in Dinner Decision Engine/Pantry Scan): a photo match is judging *relevance to what's in the photo*, not *fit to a weeknight taste profile*, and conflating the two was the primary cause of "okay but not great" matches in early testing.
- The "why this fits" line per recipe names the specific overlapping terms (e.g. "Shares the shrimp and peanut sauce from your photo") rather than a generic "close match" line, falling back to a rotating generic line only when no terms overlap at all.
- The guess is never shown as literal text in the response — see §4.1 for why — but it fully drives retrieval and ranking as described above.

### FR6 — Shared Result Rules with Existing Discovery Tools

Photo-derived results inherit the same rules already specified for recommendation-style tools in this product, rather than re-specifying them:

- Default to **up to three** results; never pad a weak third (Dinner Decision Engine FR2).
- Results must pass the same dinner/course-appropriate eligibility gates already enforced elsewhere when the context implies a meal (Dinner Decision Engine FR1), where applicable to the detected content.
- Every result keeps standard conviction signals: image, title, rating, review count, time, source (Dinner Decision Engine FR9).
- A "why this fits" line is required per result and must be specific to that recipe and to what was seen in the photo — not a generic string (Dinner Decision Engine FR8, extended to reference photo-derived evidence).
- Session constraints and exclusions (time budget, excluded ingredients, "no chicken"-style asks, recently-shown recipes) apply to photo-derived searches exactly as they do to any other discovery tool (Dinner Decision Engine FR3, FR12). A photo does not start a constraint-free session.

### FR7 — Conservative Failure on Unclear Photos

When classification is `unclear`, or a classified photo yields no usable ingredients/guess:

- Say plainly that the photo couldn't be interpreted.
- Offer **Try another photo** and **Describe it instead** as the only follow-ups.
- Never fabricate a guess or ingredient list to avoid an empty state.

### FR8 — Analyzing Loading State

While the vision analysis call is in flight, show a photo-specific loading state (thumbnail of the submitted photo + task-specific copy, e.g., "Taking a look at your photo…") rather than the generic text-query "thinking" state. Never show generic fallback recommendations before real results are ready (Dinner Decision Engine FR13, extended).

### FR9 — Ephemeral Photo Handling

- The captured/uploaded photo is used only for the in-flight analysis request.
- The photo is not written to any persistent store, log, saved-recipe record, or plan.
- The photo is not retained by the client beyond the active assistant turn; navigating away or closing the assistant discards it.
- No production photo-retention decision is made by this PRD; see Open Questions (§15) for what a durable-history version would require (consent, storage, retention policy).

### FR10 — Availability Gating (Online / Authenticated Only)

Because vision analysis requires network access, the camera entry point is disabled (visibly, with a short explanatory state — not silently hidden) when the device is offline or the session is unauthenticated. This mirrors, but is stricter than, the recipe-search fallback pattern: unlike text search, there is no local/offline vision fallback in v1.

### FR11 — Native Component Reuse

The flow must use the existing assistant bottom sheet, query-bubble pattern, recipe cards, why-chip treatment, suggestion/follow-up chips, and loading-skeleton language. Net-new UI is limited to what's listed in §8.6; everything else reuses the established assistant component language.

---

## 7. Recognition and Recommendation Logic

### 7.1 Processing Sequence

1. User submits a photo (capture or upload).
2. Single vision analysis call: classify (`pantry_scan` / `dish_match` / `unclear`) and extract the relevant payload in the same call.
3. If `unclear` → conservative failure state (FR7); stop.
4. If `pantry_scan` → render editable ingredient chips; build a search using detected ingredients as soft-match terms + active session constraints.
5. If `dish_match` → build **several** search queries from the fuller guess (name; name + key ingredients; format + name; name + description), not just the bare name (FR5).
6. Run each query through the existing `searchRecipes` pipeline (live MCP when authenticated, else local corpus — same as every other tool) and merge unique results.
7. Apply the same hard gates and exclusions already used by other discovery tools, honoring active session constraints throughout.
8. Rank: Pantry Scan uses the existing persona-affinity ranking (unchanged); **Dish Match ranks by textual overlap with the guess's own vocabulary (name/format/key-ingredients/description), never by persona affinity** (FR5) — this is the one place photo-derived ranking deliberately differs from the rest of the assistant.
9. Generate a "why this fits" line per recipe, naming the specific overlapping terms for Dish Match, or the matched detected ingredients for Pantry Scan — never a generic string.
10. Return recipe cards + context-appropriate follow-ups (including, for Pantry Scan, the ability to edit the ingredient chips as a follow-up action).

### 7.2 Illustrative Vision Output

```json
{
  "mode": "pantry_scan",
  "confidence": "high",
  "ingredients": ["zucchini", "lemon", "eggs", "parmesan", "spinach", "garlic"],
  "dish_guess": null
}
```

```json
{
  "mode": "dish_match",
  "confidence": "medium",
  "ingredients": [],
  "dish_guess": {
    "name": "Chicken Shawarma",
    "description": "sliced spiced chicken with flatbread and a white sauce",
    "key_ingredients": ["chicken", "flatbread", "white sauce", "pickled vegetables"],
    "format": "wrap"
  }
}
```

`key_ingredients` and `format` are extracted in the same vision call as `name`/`description` (not a separate request) and exist purely to make retrieval and ranking more precise (FR5, §7.1) — they are never shown to the user, unlike `name`/`description` which inform the (unnamed) guess used to drive the search.

```json
{
  "mode": "unclear",
  "confidence": "low",
  "ingredients": [],
  "dish_guess": null
}
```

This shape is illustrative and internal; it is not exposed to the user (see §7.3 for what is user-facing vs. debug-only).

### 7.3 Confidence Handling

- `high` / `medium` confidence → proceed with the detected mode, phrasing per §4.1/§6 (tentative language at `medium`).
- `low` confidence, or a payload with no usable ingredients/guess → treat as `unclear` regardless of the raw mode label (FR7).
- Confidence level and raw model output are inspectable internally for debugging (consistent with the Dinner Decision Engine's inspectability requirement, §10.3 there) but never shown to the user as a score or percentage.

---

## 8. UX and Content Requirements

### 8.1 Entry Point Treatment

Camera icon, same visual weight and placement pattern as the existing mic icon, inside the assistant's input pill. Tapping opens the capture/upload chooser (§8.4). No badge, pulse, or attention-grabbing treatment — consistent with the assistant's low-profile principle.

### 8.2 Analyzing State

- Shows a thumbnail of the submitted photo (so the user has confirmation of what was sent).
- Copy specific to the task, e.g., "Taking a look at your photo…" — distinct from the text-query thinking copy ("Finding a few good options…").
- Skeleton/loading treatment otherwise matches the existing assistant loading language.

### 8.3 Pantry Scan Result Layout

1. Photo thumbnail (small, as the "query" for this turn).
2. **One heading line** that folds the interpretation and the offer together — "Here are a few things you can make with what I see:" — not a separate "what I see" line plus a separate "here's what you can make" heading.
3. Editable ingredient chip row directly below the heading (remove via ×; "+ Add" for anything missed — see FR4a for the add interaction).
4. Recipe cards with why-chips, same as any other recommendation result.
5. Follow-ups, including implicit support for "edit the ingredients and re-search."

**The "+ Add" interaction, specifically (FR4a):**

1. **Default:** "+ Add" renders as a chip like the others, but with a leading "+" instead of a trailing "×".
2. **Active:** tapping it swaps the chip for an inline text field of the same height/shape, placeholder "Add ingredient…", cursor focused immediately.
3. **Committed:** on submit, the typed word becomes a new removable chip inserted just before "+ Add" (which resets to its default state), and the recipe results below refresh in place using the updated ingredient list.
4. **Abandoned:** tapping away or submitting empty text just reverts to the default "+ Add" chip — no visible error, no re-search.

This is a single, low-ceremony loop (tap → type → submit → chip appears → results refresh) with no separate confirmation step and no modal.

### 8.4 Dish Match Result Layout

1. Photo thumbnail.
2. **One fixed heading line** — "Here are some recipes similar to your photo:" — used for every Dish Match result regardless of confidence or the guessed name. The guess is never named in the response text (§4.1); it's used only to build the search query (§7.1).
3. Recipe cards with why-chips.
4. Follow-ups, including the ability to type a correction directly.

### 8.5 Platform Capture Behavior

| Platform | Take Photo | Choose from Library/Computer |
|---|---|---|
| iOS / Android | Native camera | Native photo library picker |
| Web | Camera-capture-hinted file input where supported by the browser/device; otherwise falls through to upload | Standard file picker (guaranteed path) |

The action sheet always offers both options; on web, "Take Photo" may resolve to the same file picker as "Choose from Library" on browsers/devices without reliable camera-capture support. This is a known, acceptable limitation — v1 must not block the feature on web-native camera access.

### 8.6 Net-New UI Surface (for design handoff)

To scope the Figma design ask precisely:

**Net-new:**
- Camera icon in the input pill (alongside existing mic icon)
- Capture/upload action sheet (Take Photo / Choose from Library / Cancel)
- Photo-thumbnail treatment inside the query-bubble position
- Photo-analyzing loading state
- Editable ingredient chip row (chip + remove affordance), including its three states: default "+ Add" chip, active inline text-entry state, and the row after a new chip is committed (FR4a)
- Dish-guess context line above results
- Photo-specific miss/failure state (Try another photo / Describe it instead)
- Disabled-state treatment for the camera icon when offline/unauthenticated (FR10)

**Reused, unchanged:**
- Assistant bottom sheet shell, header, scrim
- Recipe cards, rating/time/source metadata, favorite affordance
- "Why this fits" chip treatment
- Suggestion/follow-up chip component
- Query-bubble pattern (photo thumbnail substitutes for text)
- Primary/secondary/ghost buttons

### 8.7 Tone

Consistent with the rest of the assistant: confident but not omniscient.

Use:
- "Here are a few things you can make with what I see:"
- "Here are some recipes similar to your photo:"
- "I couldn't quite tell what's in this one — want to try another?"

Avoid:
- "I know exactly what's in your fridge."
- "This is definitely [dish]."
- Any framing that treats the vision output as ground truth rather than a best-effort read.

---

## 9. POC / Demo Specification

### 9.1 POC Principle

Same principle as the Dinner Decision Engine: demonstrate the intended production experience with real recipes and a real (if simple) vision step; mock personalization depth, not the interaction or the recipe content.

### 9.2 Vision Analysis (POC)

- Powered by the assistant's existing OpenAI integration (`src/assistant/llm.ts`), extended to accept an image alongside a structured-output prompt, using a vision-capable model.
- One call performs classification + extraction (§7.1, step 2). No separate "confirm this is a fridge photo" round trip.
- No dedicated food-vision model or third-party vision API in v1; if the general-purpose LLM's accuracy proves insufficient during build, evaluating a specialized model is a fast-follow, not a v1 blocker.

### 9.3 Retrieval (POC)

Identical sourcing rule to every other discovery tool in the app:

| Condition | Source |
|---|---|
| Authenticated | Live `site_search` MCP |
| Not authenticated / live unavailable | Local offline corpus |

Photo-derived queries (ingredient list or dish guess) are passed into the same `searchRecipes` path already used by `dinnerDecision` and `recommendRecipes` — no parallel retrieval system.

### 9.4 POC Test Photos

Build and maintain a small fixture set covering:

- A clearly identifiable pantry/fridge photo with 5–10 common ingredients.
- A cluttered/low-light pantry photo (tests soft-match, not a hard requirement for perfect extraction).
- A clearly identifiable, well-known plated dish.
- An ambiguous/generic plated dish (tests tentative-guess phrasing).
- A photo with no food in it at all (tests `unclear` handling).
- A blurry or low-quality photo of food (tests `unclear` / low-confidence handling).

### 9.5 POC Honesty

Internal documentation and demos must state plainly that:

- Recipe content and metadata are real (live MCP when authenticated; local corpus offline) — same as the rest of the assistant.
- Vision classification/extraction is a best-effort general-purpose LLM read, not a specialized food-recognition model, and not a verified/ground-truth pantry inventory.
- Ingredient soft-matching is a simple overlap-oriented heuristic in the POC, not a production ranking model.

---

## 10. Data and Service Contract

### 10.1 Tool

A new tool, `photo_recommend`, registered alongside `dinner_decision` / `recommend_recipes` in the existing tool catalog (master PRD Appendix B), following the same `Tool` interface (`run(ctx): Promise<ToolResult>`).

### 10.2 Input

```json
{
  "surface": "home",
  "photo": { "source": "camera | library", "mime_type": "image/jpeg" },
  "session_exclusions": [],
  "active_constraints": { "max_time_minutes": null, "exclude_ingredients": [] }
}
```

The raw photo bytes are passed through to the vision analysis step and are not otherwise part of any persisted payload (FR9).

### 10.3 Output — Pantry Scan

```json
{
  "kind": "recipes",
  "mode": "pantry_scan",
  "heading": "Here are a few things you can make with what I see:",
  "detected_ingredients": ["zucchini", "lemon", "eggs", "parmesan", "spinach", "garlic"],
  "recipes": [
    {
      "recipe_id": "canonical-id",
      "title": "Lemon Zucchini Frittata",
      "url": "https://example.com/recipe",
      "image": "https://example.com/image.jpg",
      "source": "Food & Wine",
      "rating": 4.7,
      "review_count": 512,
      "total_time_minutes": 25,
      "why_this_fits": "Uses the zucchini, eggs, and parmesan from your photo."
    }
  ],
  "follow_ups": ["Show me three more", "Make it faster", "Show me lunch"],
  "metadata": { "route": "photo_recommend", "mode": "pantry_scan", "confidence": "high" }
}
```

**Editing the ingredient list (FR4a)** re-invokes the same tool in `pantry_scan` mode with `detected_ingredients` replaced by the user's edited list — it is not a new tool or a new response shape. Removing a chip drops that entry; committing "+ Add" appends the new entry (case-insensitive de-duped against the existing list) before re-invoking. The response is the same shape shown above, just recomputed against the edited list.

### 10.4 Output — Dish Match

```json
{
  "kind": "recipes",
  "mode": "dish_match",
  "heading": "Here are some recipes similar to your photo:",
  "dish_guess": { "name": "Chicken Shawarma", "description": "sliced spiced chicken with flatbread and a white sauce", "key_ingredients": ["chicken", "flatbread", "white sauce", "pickled vegetables"], "format": "wrap" },
  "recipes": [
    {
      "recipe_id": "canonical-id",
      "title": "Sheet-Pan Chicken Shawarma",
      "url": "https://example.com/recipe",
      "image": "https://example.com/image.jpg",
      "source": "Food & Wine",
      "rating": 4.8,
      "review_count": 902,
      "total_time_minutes": 40,
      "why_this_fits": "Shares the chicken, flatbread, and white sauce from your photo."
    }
  ],
  "follow_ups": ["Show me three more", "Make it faster", "Something different"],
  "metadata": { "route": "photo_recommend", "mode": "dish_match", "confidence": "medium" }
}
```

### 10.5 Output — Unclear / Miss

```json
{
  "kind": "error",
  "text": "I couldn't quite tell what's in this photo.",
  "suggestions": ["Try another photo", "Describe it instead"],
  "metadata": { "route": "photo_recommend", "mode": "unclear", "confidence": "low" }
}
```

### 10.6 Inspectability

For internal debugging only (never shown to the user):

- Raw vision-model output (mode, confidence, extracted payload).
- Ingredient soft-match scoring per candidate recipe.
- Session constraints applied.
- Candidates rejected by hard gates.

---

## 11. Measurement

### 11.1 Primary Production Metric

**Photo-turn acceptance rate:** percentage of photo submissions (Pantry Scan + Dish Match combined) in which the user opens or saves one of the recommended recipes.

### 11.2 Supporting Metrics

- Photo-entry-point tap rate (of assistant sessions, how many use the camera at all — a discoverability signal given the icon-only entry point).
- Classification distribution: `pantry_scan` vs `dish_match` vs `unclear`.
- Unclear/miss rate, and retry behavior after a miss (retake vs. describe-instead vs. abandon).
- Ingredient-edit rate for Pantry Scan (how often users correct the detected list).
- Correction-via-text rate for Dish Match (how often the guess is wrong enough that the user types a fix).
- Time from photo submission to recipe open/save.

### 11.3 POC Evaluation

Use moderated testing to answer:

- Do users understand, without instruction, that the camera icon starts a photo-based search?
- For Pantry Scan: does the detected ingredient list feel accurate enough to trust, and is editing it discoverable and easy?
- For Dish Match: does the guess feel like a reasonable attempt, and is the tentative phrasing well-received (vs. feeling evasive)?
- Does the miss state feel honest rather than broken?
- Do the resulting recipes feel connected to the photo, or generic?

---

## 12. Acceptance Criteria

The POC is ready to demonstrate when:

1. Tapping the camera icon offers Take Photo / Choose from Library / Cancel on iOS, Android, and web.
2. A clear pantry/fridge photo produces a visible, editable ingredient chip list and up to three real recipes whose "why this fits" line references the detected ingredients.
3. Editing the ingredient chips (remove or add) re-runs the search and updates results in place.
3a. Tapping "+ Add" opens an inline text field (not a modal or a separate screen); submitting a non-empty value adds a removable chip before "+ Add" and triggers the same re-search as 3; submitting empty or tapping away cancels with no change; adding an already-present ingredient (case-insensitive) does not create a duplicate chip or a redundant re-search.
4. A clear plated-dish photo produces a visible dish guess and up to three real recipes whose "why this fits" line ties back to that guess.
5. A blank/blurry/non-food photo produces the conservative miss state (§5.4) with retake/describe-instead follow-ups — never a fabricated guess or empty silent result.
6. All photo-derived results respect active session constraints/exclusions exactly as text-based results do (e.g., an active "no chicken" constraint is still honored).
7. No breakfast/dessert/side/beverage/roundup/non-recipe content appears where course-appropriateness gates already apply elsewhere in the assistant.
8. The camera icon is visibly disabled with an explanatory state when offline or unauthenticated.
9. No captured/uploaded photo is written to any persistent store, log, or history visible after the turn ends.
10. The flow uses the existing assistant sheet, recipe cards, chips, buttons, and loading language; net-new UI is limited to the items listed in §8.6.
11. Live MCP is used when authenticated; local corpus is used otherwise, without crashing — same as every other discovery tool.

---

## 13. Dependencies

- MyRecipes Assistant shell, orchestrator, and tool catalog (master PRD).
- Existing `searchRecipes` pipeline (live `site_search` MCP when authenticated, else local corpus).
- Existing OpenAI integration (`src/assistant/llm.ts`), extended to accept image input with a vision-capable model.
- Camera/photo-library access on iOS/Android (new dependency — e.g., an Expo image-picker/camera package) and a file-input/upload path on web.
- Session constraint/exclusion mechanics already used by `dinnerDecision` / `recommendRecipes`.
- Standard recipe-card, assistant-sheet, suggestion-chip, and loading components.

---

## 14. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Vision model misreads ingredients | Always show the detected list as editable, never silent; soft-match rather than hard-require every item |
| Dish guess is wrong or overconfident | Guess is never named in the response text at all (§4.1); easy text correction path; retrieval/ranking use the guess without asserting it as fact |
| Camera icon is undiscoverable (icon-only entry) | Track photo-entry tap rate in POC eval; flag as an open question (§15) if usage is too low |
| Vision call latency feels slow | Dedicated analyzing state with photo thumbnail so the wait feels attributed to "looking," not hung |
| Photo privacy concerns | Ephemeral-only handling in v1 (FR9); no persistence, no history, explicit non-goal on storage |
| Web camera capture inconsistency | Guaranteed upload fallback path on web (FR2, §8.5); camera capture is a bonus, not a requirement, on web |
| Feature looks broken when offline (vision needs network) | Explicit disabled state with explanation (FR10), not a silent failed request |
| Ingredient soft-match returns loosely-related recipes | Reuse the same fit-scoring and quality-threshold logic already validated in the Dinner Decision Engine rather than inventing a new one |
| Dish Match ranks by persona taste instead of relevance to the photo | Rank by textual overlap with the guess's own vocabulary (name/format/key-ingredients/description), not `personaScore` — a lesson learned from early testing where persona-affinity ranking produced "okay but not great" matches (FR5) |

---

## 15. Open Questions

1. Is an icon-only entry point sufficiently discoverable, or does v1 need a one-time coach-mark/tooltip the first time a user opens the assistant after this ships?
2. Should Pantry Scan ever assume implicit pantry staples (salt, oil, common seasonings) even when not visible in the photo, the way some cooking apps do — or would that violate the "must not imply knowledge it doesn't have" guardrail?
3. For Dish Match, should a second, lower-confidence alternate guess ever be offered (e.g., "or maybe X?"), or does that add noise for a marginal accuracy gain in v1?
4. What's the production posture on photo retention if this graduates beyond a POC — fully ephemeral forever, or session-visible history with explicit consent and a retention policy?
5. Should a Pantry Scan photo be reusable to seed a Dinner Decision Engine "use more of what I have" request in the same session, or are the two flows intentionally kept separate for now?
6. What confidence threshold in the real vision model output should map to `unclear` vs. a tentatively-phrased result — is this a fixed threshold, or tuned after seeing real model behavior?
7. Is there a future case for scanning a physical recipe card/cookbook page (text-in-image) as a third mode, or is that explicitly out of scope for this feature line?
8. Should "+ Add" (FR4a) get ingredient typeahead/autocomplete against a known ingredient taxonomy in a later iteration, to reduce free-text typos and improve match quality — or is freeform text sufficient indefinitely given this is a soft-match signal, not a hard filter?

---

## Appendix A — Example Pantry Scan Turn

**Photo:** counter with zucchini, lemon, eggs, parmesan, spinach, garlic.

**Heading:** Here are a few things you can make with what I see:

**Detected ingredients:** Zucchini · Lemon · Eggs · Parmesan · Spinach · Garlic *(each removable; + Add)*

| Recipe | Why this fits |
|---|---|
| Lemon Zucchini Frittata | Uses the zucchini, eggs, and parmesan from your photo. |
| Garlic Spinach Skillet Pasta | Built around the garlic and spinach you photographed. |
| Zucchini & Lemon Orzo | Matches the lemon and zucchini, plus pantry staples. |

**Follow-ups:** Show me three more · Make it faster · Show me lunch *("Show me lunch" re-searches biased toward lunch instead of dinner/entree — editing ingredients happens directly on the chip row above, FR4a, not via a follow-up)*

## Appendix B — Example Dish Match Turn

**Photo:** plated shawarma-style wrap.

**Internal guess (not shown):** name "Chicken Shawarma" · key ingredients chicken, flatbread, white sauce, pickled vegetables · format "wrap"

**Heading:** Here are some recipes similar to your photo: *(fixed line — the guess drives the search but is never named in the response)*

| Recipe | Why this fits |
|---|---|
| Sheet-Pan Chicken Shawarma | Shares the chicken, flatbread, and white sauce from your photo. |
| Chicken Shawarma Wraps | Shares the chicken and pickled vegetables from your photo. |
| Grilled Chicken Pita | Shares the chicken and flatbread from your photo. |

**Follow-ups:** Show me three more · Make it faster · Something different

## Appendix C — Required Regression Set

The test set must include:

- A well-lit, unambiguous pantry/fridge photo (happy path).
- A dark/cluttered pantry photo (tests soft-match under imperfect extraction).
- A well-known, unambiguous plated dish (happy path).
- A generic/ambiguous plated dish (tests tentative-guess phrasing).
- A photo containing no food at all (tests `unclear`).
- A blurry or low-quality photo (tests `unclear` / low-confidence handling).
- A photo containing both loose ingredients and a plated dish in the same frame (tests mode-detection tie-breaking).
- A pantry photo with 15+ visible items (tests soft-match, not an all-items-required filter).
- A dish photo where the correct real-world recipe is not in the corpus (tests conservative "closest match" framing rather than a false-confident exact claim).
