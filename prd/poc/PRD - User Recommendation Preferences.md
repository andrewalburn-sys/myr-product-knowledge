# PRD — User Recommendation Preferences

**Status:** Draft v1 — POC/demo specification
**Parent PRD:** [[PRD - Agentic Recipe Assistant]]
**Author:** Andrew Alburn
**Last updated:** August 11, 2026
**Working feature name:** User Recommendation Preferences
**User-facing entry point:** Account → Recommendation Preferences

**Related:** `PRD - Agentic Recipe Assistant.md` · `PRD - Dinner Decision Engine.md` · `PRD - Photo-Based Recipe Discovery.md` · `../PRD - Assistant Semantic Query Planner.md`

---

## 1. Overview

### 1.1 Feature Summary

User Recommendation Preferences is a user-editable settings surface, reached from **Account**, where a user tells the app who they are as a cook: dietary restrictions and disliked ingredients, cooking-style preferences (quick, kid-friendly, budget-conscious, etc.), favorite cuisines/flavors, and — the piece that started this — an editable list of **pantry staples**: ingredients they typically have on hand.

Today, every one of these signals exists only as a single **hardcoded, fixed mock** (`PERSONA` in `src/assistant/persona.ts`) shared by every user of the prototype, driving ranking behind the scenes with no way to see or change it. User Recommendation Preferences replaces that mock with something the user actually controls, and wires it into the tools that already claim to personalize: the Dinner Decision Engine's "what's for dinner" and "use what I have" flows, and Photo-Based Recipe Discovery's Pantry Scan.

### 1.2 Relationship to the Agentic Recipe Assistant

This is a child specification of [[PRD - Agentic Recipe Assistant]], but it introduces something the master PRD didn't originally scope: **Account as a first-class surface** with real settings, not just a sign-in mechanism. The master PRD's in-scope surfaces (Home, Recipe, Saves, Planning, Search) don't include Account — this PRD extends that list. The assistant itself does not open on the Account surface (consistent with how it's absent on Search/Collections today); User Recommendation Preferences is a traditional settings UI, not an assistant conversation.

The primary *consumers* of User Recommendation Preferences are assistant tools specified elsewhere:
- **Dinner Decision Engine** (`PRD - Dinner Decision Engine.md`) — pantry mode's "use what I have" topic pool and ranking currently reach into the mocked `PERSONA.pantry`/`tasteTags`; this PRD makes those real and user-controlled.
- **Photo-Based Recipe Discovery** (`PRD - Photo-Based Recipe Discovery.md`) — Pantry Scan currently only ever searches on *photo-detected* ingredients. This PRD adds the cross-reference the user asked for directly: stated pantry staples merge with what the photo shows, so a fridge photo that's missing something the user always has (garlic, olive oil, rice) still benefits from it.
- **Generic recommend / library query** — dietary restrictions and dislikes become the real hard-exclude list everywhere, not a currently-empty mock.

### 1.3 Product Bet

The assistant's whole pitch is that it "knows you." Right now that's not true for any real user — it's one fixed, invented persona. User Recommendation Preferences is the most direct way to make "knows you" true for the parts of personalization that don't require behavioral history (saves, cook counts): the things a user can just *tell* the product directly, once, and have it respected everywhere.

The feature is successful when it creates a meaningful improvement in:
- **Relevance:** stated diet/dislikes are never violated; stated pantry staples visibly show up in "why this fits" reasoning.
- **Trust:** the user can see and edit exactly what the app thinks it knows about them — no silent inference they can't inspect or correct.
- **Effort:** pantry staples set once are reused automatically by both "what's for dinner" and a fridge photo, so the user never has to repeat "I usually have garlic and rice" turn after turn.

### 1.4 Strategic Guardrail

Same honesty principle already established for the Dinner Decision Engine and Photo-Based Recipe Discovery: **a stated pantry-staples list is not a live inventory.** "I usually have eggs" does not mean there are eggs in the fridge today. Copy must never claim certainty the data doesn't support.

Use language such as:
- "Recipes that use what you usually have."
- "Based on your pantry staples and what's in this photo."

Avoid:
- "You have everything for this."
- "No shopping needed."

Dietary restrictions are the one category held to a *stricter* standard than "soft honesty" — see FR1/FR2: an **Allergy**-tier restriction is a hard, absolute exclude, enforced with the same rigor as any other hard constraint in this product (master PRD FR13).

---

## 2. Goals and Non-Goals

### 2.1 Goals

- Let a user set dietary restrictions/allergies, disliked ingredients, cooking-style preferences, cuisine/flavor affinities, and pantry staples, and have every one of them persist across sessions.
- Replace the fixed mocked `PERSONA` with the user's real profile as the single source of truth for these signals.
- Cross-reference stated pantry staples with **both** places "what can I make with what I have" already happens: Dinner Decision Engine's pantry mode, and Photo-Based Recipe Discovery's Pantry Scan.
- Make dietary restrictions/dislikes a real, always-enforced hard exclude across every discovery tool (Dinner Decision Engine, Photo-Based Recipe Discovery, generic recommend, library query) — not just a currently-empty mock.
- Establish Account as a real settings surface with a pattern (sectioned settings, list rows, edit sheets) other future settings can reuse.

### 2.2 Non-Goals

- **Multi-user / per-household-member profiles.** v1 is one profile per signed-in user, matching today's single-persona model — no separate "kid's allergies" sub-profile (tracked as an open question, §15).
- **A live pantry inventory.** Staples are stated preferences, not tracked stock; no expiration dates, quantities, or "I just used the last egg" updates.
- **Behavioral/history-derived personalization.** Cook counts, save patterns, and ratings (`LIBRARY_SIGNALS`) are a separate, already-existing mock this PRD doesn't touch.
- **Server-side account sync.** Persistence in v1 is local to the device/browser (§10), not synced across devices — see Open Questions.
- **A general-purpose Account/Settings redesign.** This PRD adds a Recommendation Preferences section and reorganizes just enough of Account to hold it (§8.1); broader account features (order history, notifications, etc.) are out of scope.

---

## 3. Target User and Job to Be Done

### 3.1 Primary Persona

**Every persona the master PRD defines**, since this is foundational personalization data, not a single-persona feature. Most directly:

- **Weeknight Reducer:** wants "what's for dinner" to already respect their diet and lean on what they usually have, without restating it every time.
- **Established Home Cook:** wants their real dietary restrictions genuinely never violated — this persona is the least tolerant of a "close enough" miss.

### 3.2 Core Job

> Let me tell the app once what I eat, what I don't, how I like to cook, and what I usually have around — and have every recipe conversation respect that automatically, instead of me repeating myself every time.

---

## 4. Experience Principles

### 4.1 Set It Once, Used Everywhere

A preference stated in User Recommendation Preferences applies to every discovery surface (Dinner Decision Engine, Pantry Scan, generic recommend, library query) without the user re-stating it in that turn's conversation. This mirrors the master PRD's session-continuity principle (FR5 there), extended from session-scoped to profile-scoped (persists beyond the session).

### 4.2 Editable Is Not Optional

Every field in the profile — including anything pre-filled from a first-run default — must be as easy to remove/change as it was to add. A wrong guess or an outdated preference should never require "contacting support" or living with it.

### 4.3 Hard Things Stay Hard

Allergy-tier restrictions get the strictest enforcement this product has: **never** shown, no exceptions, same rigor as any other hard constraint (master PRD FR13). Preferences and dislikes are strongly avoided but the product is honest that they're a step below an allergy (§6, FR1/FR2).

### 4.4 Staples Are a Signal, Not a Guarantee

Pantry staples bias search and ranking toward recipes that use them; they never become a hard "must contain" filter (same soft-match principle already established for Photo-Based Recipe Discovery's detected ingredients). A user who lists 20 staples should get recipes that use *several*, not recipes require to use *all*.

---

## 5. Core User Flow

### 5.1 Entry

1. User opens **Account**.
2. Account now shows sections: **Recommendation Preferences** and **Connection** (the existing sign-in/live-search debug tool, relabeled as a section rather than the whole screen — §8.1).
3. Tapping **Recommendation Preferences** opens the settings screen.

### 5.2 First Run (Empty State)

1. A first-time user sees all five sections (Dietary Restrictions, Disliked Ingredients, Cooking Style, Flavors & Cuisines, Pantry Staples) empty, each with a short explanation of what it's for and a clear "+ Add" affordance.
2. No fields are pre-filled from the old mocked persona (§9.2) — an empty profile is an honest starting point, not a silently-inherited fiction the user never chose.
3. The assistant continues to function with an empty profile: no restrictions, no staples, cooking-style/flavor ranking simply has nothing to bias toward yet (graceful, not broken).
4. The assistant does **not** proactively prompt the user toward User Recommendation Preferences at any point (e.g., on an empty-profile dinner request or pantry scan) — discovery relies entirely on the user finding Account on their own (resolved, §15).

### 5.3 Editing

1. **Dietary Restrictions:** tap "+ Add," pick from the fixed taxonomy list (FR1), choose severity (**Allergy** or **Preference**, FR2), confirm. Each restriction shows as a row with its severity visibly distinguished (e.g., a distinct badge/color for Allergy) and a remove affordance.
2. **Disliked Ingredients:** tap "+ Add," type freeform text, submit — same low-friction chip-add pattern already proven for Photo-Based Recipe Discovery's ingredient editing (FR4a there). Remove via the same per-chip control.
3. **Cooking Style:** a fixed multi-select list (FR3) — toggle on/off, no freeform entry.
4. **Flavors & Cuisines:** multi-select cuisines from a fixed list (aligned to what search can actually filter, §7) + freeform flavor/ingredient tags (aligned to the existing `tasteTags` concept) + a single spice-tolerance setting.
5. **Pantry Staples:** freeform tag list, same add/remove chip pattern as Disliked Ingredients and as Photo-Based Recipe Discovery's ingredient chips (FR4a there) — deliberately the *same* interaction pattern the user already learns from that feature.
6. Every edit saves immediately (no separate "Save" button) and persists across app restarts (FR9).

### 5.4 Using It (Cross-Reference in Existing Surfaces)

1. **"What's for dinner tonight?" / "Something quick with what I have":** the Dinner Decision Engine's ranking and pantry-mode topic pool now read from the user's real `pantry`/`tasteTags`/cooking-style prefs instead of the mocked `PERSONA` (FR6). Dietary restrictions/dislikes hard-exclude as before, now from real data.
2. **Pantry Scan (photo of a fridge/pantry):** the detected-ingredient list is merged with the user's stated staples before searching (FR7) — the response still shows the *detected* list as the primary, editable chip row (Photo-Based Recipe Discovery FR4/FR4a unchanged), with staples contributing silently to the search/ranking rather than appearing as a second, redundant chip row.
3. **Every other discovery tool** (generic recommend, library query, dish match): dietary restrictions/dislikes hard-exclude; cooking-style/flavor preferences softly bias ranking where relevant (FR8).

---

## 6. Functional Requirements

### FR1 — Dietary Restrictions: Fixed Taxonomy

- A multi-select list of dietary restrictions, drawn from the set the search pipeline can **actually hard-filter today** via the existing recipe-metadata taxonomy: Vegan, Vegetarian, Pescatarian, Gluten-free, Dairy-free, Nut-free, Egg-free, Low-carb/Keto, Soy-free, Shellfish-free, Sesame-free, Paleo, Kosher, Halal, Low-sodium.
- Freeform dietary restrictions are **not** supported here (that's what Disliked Ingredients, FR4, is for) — this list is deliberately closed so every entry maps to real, filterable data rather than a preference the search can't act on.
- A user can select any number of restrictions; there is no mutual-exclusivity enforcement (e.g., a user could select both Vegan and Gluten-free).

### FR2 — Dietary Restrictions: Severity

- Every selected restriction requires a severity choice: **Allergy** or **Preference**.
- **Allergy** is a hard, absolute exclude with zero tolerance — enforced with the same rigor as any existing hard constraint (master PRD FR13). A recipe that can't be confirmed to avoid an allergy is treated as violating it (conservative: when uncertain, exclude).
- **Preference** is strongly avoided (same hard-exclude mechanism as today's `PERSONA.dislikes`) but is not visually or behaviorally implying medical/safety stakes.
- The UI must make the distinction visible at a glance (e.g., a distinct badge/color for Allergy rows) — a user should never have to open an edit sheet to remember which of their restrictions is the serious one.

### FR3 — Cooking Style: Fixed Multi-Select

A closed set of toggleable preferences, each a **soft ranking signal**, never a hard filter:
- Quick / minimal time
- One-pan / one-pot / minimal cleanup
- Kid-friendly
- Cooking for a crowd
- Cooking for one
- Budget-conscious
- Meal-prep friendly
- Comfort-food leaning
- Adventurous / open to new cuisines
- Generally lighter/healthier

These map to existing `tasteTags`-style ranking signals and, where applicable, to the semantic planner's existing audience/strategy concepts (`audience:kid_friendly`, effort strategies) — this PRD does not invent a new ranking mechanism, it gives the existing one a real input.

### FR4 — Disliked Ingredients: Freeform List

- A freeform, user-typed tag list (same add/remove interaction as Photo-Based Recipe Discovery's ingredient chips, FR4a there) for ingredients the user wants to avoid but that aren't a taxonomy-mapped dietary restriction (e.g., mushrooms, cilantro, olives).
- Hard-excluded everywhere, same mechanism as today's `PERSONA.dislikes` (via `excludeTerms`), just user-editable and real.
- No practical cap beyond a reasonable UI limit (e.g., ~30 entries) to keep the list usable.

### FR5 — Flavors & Cuisines

- **Favorite cuisines:** multi-select from a fixed list aligned to what the search/metadata pipeline recognizes today (Italian, Mexican, Mediterranean, Asian — with sub-selects for Chinese/Thai/Japanese if useful, Greek, French, American, Indian, Middle Eastern).
- **Favorite flavors/ingredients:** freeform tags (extends the existing `tasteTags` concept — e.g., lemon, garlic, savory, one-pan) used as a soft ranking bonus.
- **Spice tolerance:** a single setting (Mild / Medium / Hot) — soft signal, not a hard filter.

### FR6 — Pantry Staples

- A freeform, user-editable ingredient tag list — "ingredients I usually have" — using the same add/remove chip interaction as Disliked Ingredients (FR4) and as Photo-Based Recipe Discovery's ingredient editing.
- Used as a **soft-match signal** (never a hard "must use" filter) in:
  - The Dinner Decision Engine's pantry-mode topic pool and ranking (replacing the current `PERSONA.pantry[0]`/`[3]` mock reference).
  - Photo-Based Recipe Discovery's Pantry Scan search (FR7).
- No day/freshness tracking — see Non-Goals (§2.2) and the honesty guardrail (§1.4).

### FR7 — Cross-Reference: Pantry Staples × Photo-Detected Ingredients

- When Pantry Scan (Photo-Based Recipe Discovery) detects ingredients from a photo, the search/ranking step also considers the user's stated pantry staples, merged with the detected list.
- **The detected-ingredient chip row shown to the user reflects only what the photo showed** (Photo-Based Recipe Discovery FR4/FR4a are unchanged) — staples contribute to retrieval/ranking without appearing as a second, potentially confusing chip row claiming to be "from your photo." (Open question on exact UI treatment if the user wants staples visible too — §15.)
- If the merged list changes which recipes are eligible/ranked, the "why this fits" line may cite a staple that wasn't in the photo (e.g., "Uses the zucchini and eggs from your photo, plus the rice you usually have") — copy must distinguish photo-sourced from staple-sourced provenance, never implying the staple was seen in the photo.

### FR8 — Hard Exclusion Everywhere

Dietary restrictions (both severities) and disliked ingredients are hard-excluded across **every** discovery tool: Dinner Decision Engine, Photo-Based Recipe Discovery (both Pantry Scan and Dish Match), generic recommend, and library query — using the existing `excludeTerms`/`applyExclusions` mechanism, now fed from the real profile instead of the empty mocked `dislikes` array. Allergy-tier restrictions additionally hard-filter using real diet-taxonomy metadata (M7) where available, not just keyword exclusion (conservative: exclude on uncertain metadata).

### FR9 — Persistence

- The full profile persists locally (device/browser) across app restarts — same mechanism already used for meal plans (`localStorage` on web; the equivalent on native) — see §10 for the schema.
- No server-side account sync in v1 (Non-Goals §2.2, Open Questions §15).

### FR10 — Retiring the Mocked Persona

- The fixed `PERSONA` mock (`tasteTags`, `dislikes`, `pantry`) is replaced by the real, user-editable profile as the single source of truth for these signals.
- `LIBRARY_SIGNALS`/`SAVED_DOC_IDS` (cook-history/rating mocks) are unaffected — out of scope for this PRD (Non-Goals §2.2).
- No fields are silently pre-filled from the old mock on first run (§5.2) — a new profile starts genuinely empty.

---

## 7. Alignment with Real, Filterable Data

Per the Photo-Based Recipe Discovery precedent of grounding UI choices in what retrieval can actually act on, the **closed-list** fields in User Recommendation Preferences (dietary restrictions and cuisines) are deliberately scoped to categories already recognized by the existing recipe-metadata taxonomy and search-intent parser, so every selection has a real effect. Categories that exist in the underlying taxonomy but aren't yet parsed by the search pipeline (e.g., Whole30, plant-based, high-protein, lactose-free) are candidates for a fast-follow once intent parsing is extended to recognize them (§15) — not included in v1's fixed list to avoid shipping a toggle that silently does nothing.

---

## 8. UX and Content Requirements

### 8.1 Account Restructure

- Account becomes a real settings screen with (at minimum) two sections: **Recommendation Preferences** and **Connection** (the existing sign-in/live-search tool, unchanged in function, just demoted from "the whole screen" to one section within it).
- This is the minimum restructure needed to host User Recommendation Preferences — not a general Account redesign (Non-Goals §2.2).

### 8.2 Recommendation Preferences Screen Layout

1. Header: "Recommendation Preferences" + short one-line explanation of what it's for and where it's used.
2. **Dietary Restrictions** section: list of added restrictions (each showing its severity badge) + "+ Add" → taxonomy picker + severity choice.
3. **Disliked Ingredients** section: chip row (same visual language as Photo-Based Recipe Discovery's ingredient chips) + "+ Add" inline entry.
4. **Cooking Style** section: toggle list (fixed set, FR3).
5. **Flavors & Cuisines** section: cuisine multi-select + flavor chip row + spice-tolerance selector.
6. **Pantry Staples** section: chip row (same pattern as Disliked Ingredients) + "+ Add" inline entry.
7. Each section's empty state explains its purpose in one line (§5.2) rather than showing a blank void.
8. Removing any entry — including an Allergy-tier restriction — is a single, immediate action with no confirmation step (resolved, §15); the severity badge (FR2) is the only differentiation Allergy rows get.

### 8.3 Net-New UI Surface (for design handoff)

**Net-new:**
- Account section navigation (Recommendation Preferences / Connection)
- Recommendation Preferences screen shell + five sections
- Dietary-restriction taxonomy picker + severity choice + severity badge treatment
- Cooking-style toggle list
- Cuisine multi-select + spice-tolerance selector

**Reused, unchanged:**
- The chip add/remove interaction pattern from Photo-Based Recipe Discovery's ingredient editing (FR4a there) — reused verbatim for Disliked Ingredients, Pantry Staples, and Flavor tags.
- Standard settings-row/list patterns, buttons, and tokens already established elsewhere in the app.

### 8.4 Tone

Consistent with the rest of the assistant's honesty principle:

Use:
- "Recipes that use what you usually have."
- "We'll never show you a recipe with an allergy you've listed."

Avoid:
- "We know exactly what's in your kitchen."
- Treating a Preference-tier dislike with the same "never, ever" language reserved for Allergy-tier restrictions.

---

## 9. POC / Demo Specification

### 9.1 POC Principle

Same principle as the other assistant child PRDs: real interaction, real data flow, mocked only where genuinely necessary. This feature is *specifically about* replacing a mock with something real — there is less to mock here than usual.

### 9.2 Migration from the Existing Mock

- `PERSONA`'s current hardcoded values (`tasteTags`, `dislikes: []`, `pantry`) are **not** carried over as a pre-filled default (§5.2, FR10) — they may be used as internal seed/test data during build (e.g., to populate a demo account) but must not silently become "the user's profile" without the user having set it.
- `LIBRARY_SIGNALS` and `SAVED_DOC_IDS` remain as-is; this PRD does not touch cook-history/rating mocks.

### 9.3 What's Real vs. Mocked

| Layer | v1 |
|---|---|
| Profile fields, editing, persistence | **Real** |
| Hard exclusion enforcement (diet/dislikes) | **Real** — existing mechanism, real data |
| Pantry-staples soft-match in Dinner Decision Engine / Pantry Scan | **Real** — existing mechanism, real data |
| Diet-taxonomy metadata backing "Allergy" hard-filtering | **Real where M7 metadata exists**; conservative exclude-on-uncertain otherwise |
| Cook-history / ratings (`LIBRARY_SIGNALS`) | **Still mocked** — unchanged, out of scope |
| Cross-device sync | **Not built** — local persistence only |

---

## 10. Data and Service Contract

### 10.1 Profile Shape (illustrative)

```json
{
  "dietaryRestrictions": [
    { "tag": "gluten-free", "severity": "allergy" },
    { "tag": "dairy-free", "severity": "preference" }
  ],
  "dislikedIngredients": ["mushrooms", "cilantro"],
  "cookingStyle": ["quick", "kid_friendly", "one_pan"],
  "favoriteCuisines": ["italian", "mediterranean"],
  "favoriteFlavors": ["lemon", "garlic", "savory"],
  "spiceTolerance": "medium",
  "pantryStaples": ["chicken", "pasta", "garlic", "olive oil", "rice", "eggs"]
}
```

### 10.2 Consumption by Existing Tools

- `excludeTerms(constraints)` (`rank.ts`) reads `dislikedIngredients` + all `dietaryRestrictions` tags (both severities) instead of the mocked `PERSONA.dislikes`.
- `personaScore(recipe)` reads `favoriteFlavors`/`cookingStyle`/`pantryStaples` instead of `PERSONA.tasteTags`/`PERSONA.pantry`.
- Dinner Decision Engine's pantry-mode topic pool (`DINNER_TOPICS_PANTRY`) reads from `pantryStaples` instead of `PERSONA.pantry[0]`/`[3]`.
- Photo-Based Recipe Discovery's `runPantryScan` merges `pantryStaples` into its query/ranking alongside photo-detected ingredients (FR7), while keeping the displayed chip row limited to detected ingredients only.
- Allergy-tier `dietaryRestrictions` additionally hard-filter via M7 diet-taxonomy metadata where available.

---

## 11. Measurement

### 11.1 Primary Metric

**Profile completion rate:** percentage of users who set at least one field across Dietary Restrictions, Cooking Style, or Pantry Staples within their first session in Account.

### 11.2 Supporting Metrics

- Pantry-staples list size distribution (are people actually maintaining a useful list, or leaving it empty).
- Rate of "why this fits" lines citing a stated staple vs. a photo-detected ingredient (Pantry Scan cross-reference actually firing, FR7).
- Zero-violation rate: no session in which a stated Allergy-tier restriction appears in a shown recipe.
- Edit frequency post-first-run (is the profile treated as a living thing, or set-once-and-ignored).

### 11.3 POC Evaluation

- Does setting a restriction/staple feel like it "sticks" the next time the user asks for dinner or scans a fridge, without restating it?
- Does the Allergy vs. Preference distinction feel meaningfully different in the UI, not just a label?
- Does a fridge photo missing an obvious staple (e.g., garlic) still get + credited via the merge (FR7) in a way that feels accurate, not confusing?

---

## 12. Acceptance Criteria

The POC is ready to demonstrate when:

1. A user can add/remove entries in all five profile sections, and every change persists across an app reload.
2. A dietary restriction set to Allergy never appears in any discovery tool's results; a Preference-tier restriction and a disliked ingredient are also never shown, with the same hard-exclude guarantee.
3. Pantry staples visibly influence the Dinner Decision Engine's "use what I have" results and why-chips (replacing the old mocked `PERSONA.pantry` reference).
4. A Pantry Scan photo's results reflect both the photo-detected ingredients (shown, editable — unchanged from Photo-Based Recipe Discovery's existing behavior) and the user's stated staples (used in search/ranking, not falsely shown as photo-detected).
5. A brand-new profile starts fully empty — nothing is silently pre-filled from the old mocked persona.
6. Account clearly separates Recommendation Preferences from the existing sign-in/connection tool.
7. The mocked `PERSONA` object is no longer read by any ranking/exclusion code path once a real profile exists.

---

## 13. Dependencies

- MyRecipes Assistant shell, `rank.ts` exclusion/scoring helpers, session mechanics (master PRD).
- Dinner Decision Engine's pantry-mode topic pool and ranking (`PRD - Dinner Decision Engine.md`).
- Photo-Based Recipe Discovery's Pantry Scan (`PRD - Photo-Based Recipe Discovery.md`).
- M7 recipe-metadata taxonomy (diet/cuisine/course tags) for real hard-filtering.
- A new local-persistence mechanism for Account settings (extending the pattern already used for meal plans).

---

## 14. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Allergy restriction silently violated due to missing/uncertain metadata | Conservative exclude-on-uncertain, same principle already used elsewhere in this product |
| Profile feels disconnected from results ("I set this, why didn't it matter?") | Why-chips should cite stated staples/flavors explicitly when they're the reason a recipe was chosen |
| Staple/photo-detected provenance gets confused in copy | Explicit FR7 requirement: never imply a staple was seen in the photo |
| Users don't discover User Recommendation Preferences (buried in Account) | Discoverability is intentionally left to organic discovery in v1 (§15); track profile-completion rate (§11.1) to see whether this needs revisiting |
| Fixed taxonomy lists feel limiting vs. freeform | Deliberately scoped to what's actually filterable (§7); freeform dislikes (FR4) is the escape valve for anything not on the fixed lists |
| Retiring `PERSONA` breaks an untouched code path that still imports it | Full-repo audit for `PERSONA` imports before removal, not just the paths this PRD calls out |

---

## 15. Open Questions

### Resolved

- **Discoverability:** No proactive nudge — the assistant never suggests User Recommendation Preferences on its own; discovery relies entirely on the user finding Account (§5.2).
- **Pantry Scan staples visibility:** Implicit only — no separate staples chip row in Pantry Scan results; staples contribute silently to search/ranking and may surface in "why this fits" copy (FR7 unchanged).
- **Extending the fixed taxonomy:** Fast-follow, not a launch blocker — v1 ships with today's 7 parsed diet tags + existing cuisine list (§7 unchanged).
- **Allergy removal confirmation:** No special handling — removing an Allergy-tier restriction is the same one-tap action as any other entry (§8.2).

### Still open

1. **Cross-device sync:** local-only persistence (FR9) means a profile set on one device doesn't follow the user to another. Is that acceptable for the POC, or does it need a production-track answer sooner?
2. **Multi-person households:** explicitly deferred (Non-Goals §2.2) — if this becomes a real need, does it become per-profile household members, or a separate "shared household restrictions" concept layered on top of individual profiles?
