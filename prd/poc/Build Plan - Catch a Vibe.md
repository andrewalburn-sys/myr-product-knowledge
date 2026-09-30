# Build Plan — Catch a Vibe

**Status:** Implemented locally; automated verification passed  
**Source PRD:** [[PRD - Catch a Vibe]]  
**Design handoff:** [[Figma Handoff - Catch a Vibe]]  
**Parent PRD:** [[PRD - Agentic Recipe Assistant]]  
**Target repository:** `myrecipes-poc`  
**Last updated:** August 27, 2026

---

## 1. Objective

Implement Catch a Vibe as a homepage Assistant action that accepts one ephemeral photo, analyzes only visible non-sensitive signals, chooses one diet-safe recipe from the local `scale-v1` corpus, explains the pairing playfully, and supports **Try another**, **Use another photo**, and **Share my vibe**.

This plan is written for an LLM coder. Follow the packages in order. Keep each package independently testable and, when committing, use one focused commit per package.

The feature is complete only when it behaves the same in local development and the public Vercel build. It must never depend on Keycloak, VPN access, or live MCP retrieval.

---

## 2. Locked Product and Technical Decisions

- Entry appears only in the Assistant’s initial Home suggestions in v1.
- Tapping **Catch a vibe** opens the existing photo chooser immediately; it is not submitted as an ordinary discovery query.
- Input is one image with no required text prompt.
- The first answer is exactly one featured recipe, not a carousel.
- Meal context may be breakfast, lunch, or dinner based on the image.
- Retrieval always calls the `scale-v1` offline provider directly, even when local development is authenticated to live MCP.
- Flavor Profile dietary restrictions and disliked ingredients remain hard exclusions. Never loosen them to obtain a result.
- Saved recipes, homepage recipes, meal-plan recipes, and recipes already shown in the active vibe session are novelty signals, not safety filters.
- **Try another** reuses the structured interpretation and never makes a second vision call.
- The explanation may use a server-side text call after recipe selection. If that call fails, use a grounded deterministic fallback; do not fail the full recommendation.
- Photos, raw base64, structured analysis, candidate IDs, and generated share assets are session-only. Do not write them to local storage, analytics, logs, saves, meal plans, or the Flavor Profile.
- Sharing is initiated only by the user. Prefer the platform share sheet and provide a browser download fallback.
- Do not introduce a parallel assistant shell, a new visual system, or a Catch a Vibe sub-brand.

---

## 3. Existing Architecture to Reuse

| Need | Existing source | Direction |
|---|---|---|
| Home suggestions | `src/assistant/suggestions.ts` | Add Catch a Vibe in the approved order. |
| Assistant orchestration | `src/assistant/orchestrator.ts` | Add structured photo entry and retry methods; keep domain logic out of the general text router. |
| Assistant sheet state | `src/components/assistant/AssistantOverlay.tsx` | Track the active photo flow, loading label, result actions, and cleanup. |
| Photo chooser | `src/components/assistant/PhotoActionSheet.tsx` | Reuse it; add optional privacy copy instead of creating another chooser. |
| Photo capture/compression | `src/assistant/photo/capture.ts` | Reuse unchanged unless a verified defect requires a small fix. |
| Server-only vision | `src/services/assistantApi/` plus `/api/assistant` | Reuse the `vision` operation and existing request-size/security controls. |
| Flavor Profile | `src/assistant/flavorProfile/store.ts` | Read at recommendation time; do not copy it into vibe state. |
| Hard exclusions | `src/assistant/rank.ts` | Reuse `applyExclusions`; send restriction tags into offline retrieval as the first safety gate. |
| Offline recipe retrieval | `src/services/recipeSearch/offlineCorpusProvider.ts` | Call this provider directly so local auth cannot switch the feature to MCP. |
| Recipe conversion/detail | `src/services/recipeSearch/index.ts` | Reuse `toRecipe` and the existing detail hydration path. |
| Saved-library novelty | `src/assistant/library.ts` | Use IDs from `savedRecipes()` as a soft demotion. |
| Other known recipes | frozen Home/collection data and `src/assistant/planStore.ts` | Use IDs as soft novelty demotions only. |
| Recipe UI/navigation | `src/components/RecipeCard.tsx` and Assistant `onOpenRecipe` | Extend existing card anatomy to one full-width featured card. |
| Design tokens | `src/theme/tokens.ts` and shared components | No hardcoded colors, spacing, radii, typography, or shadows. |

Do not overload the existing `photo_recommend` pantry/dish tool. Catch a Vibe interprets arbitrary scenes, so it needs its own intent/tool/result contract.

---

## 4. Target Data Contracts

Add these concepts to the assistant types, using the existing naming and discriminated-union conventions.

```ts
type VibeEnergy =
  | 'calm'
  | 'cozy'
  | 'playful'
  | 'energized'
  | 'elegant'
  | 'adventurous'
  | 'neutral';

type VibeAnalysis = {
  visibleSignals: string[];
  vibeLabel: string;
  moodCues: string[];
  energy: VibeEnergy;
  settingCues: string[];
  seasonWeatherCues: string[];
  mealContext: 'breakfast' | 'lunch' | 'dinner';
  flavorCues: string[];
  formatCues: string[];
  searchQueries: string[];
  humorAngle?: string;
  confidence: 'high' | 'medium' | 'low';
  safeToUse: boolean;
};

type VibeAnalysisOutcome =
  | { ok: true; analysis: VibeAnalysis }
  | { ok: false; reason: 'technical' | 'unsafe' | 'invalid' };
```

Add `catch_a_vibe` to `ToolId`. Add a dedicated `ToolResult` member rather than encoding this as a one-item `recipes` result:

```ts
type VibeResult = {
  kind: 'vibe';
  photoUri: string;
  vibeLabel: string;
  explanation: string;
  recipe: Recipe;
};
```

Keep the full `VibeAnalysis` and shown-recipe history in dedicated session memory, not in the renderable result and not in persisted storage.

Recommended session contract:

```ts
type VibeSession = {
  photoUri: string;
  analysis: VibeAnalysis;
  shownRecipeIds: string[];
};
```

Provide explicit `get`, `start`, `recordShown`, and `reset` functions. `reset` must be called when the Assistant closes and before a replacement photo is opened.

---

## 5. Work Packages

### Package V1 — Contracts and Session Lifecycle

**Goal:** Establish a typed, ephemeral Catch a Vibe state model without changing visible behavior.

Tasks:

1. Extend `src/assistant/types.ts` with `VibeAnalysis`, `VibeAnalysisOutcome`, `catch_a_vibe`, and the `vibe` result.
2. Add `src/assistant/vibe/session.ts` with in-memory state only.
3. Add a session reset call to the Assistant close path in `AssistantOverlay.tsx`.
4. Ensure opening **Use another photo** clears the prior analysis, shown IDs, photo URI, and share preview.
5. Do not add any Catch a Vibe values to local storage or existing `SessionState` persistence.

Exit gate:

- Typecheck passes.
- A unit-level assertion or simple deterministic contract test proves reset removes the full vibe session.
- Repository search confirms no new vibe/photo storage key exists.

### Package V2 — Safe Structured Vision Analysis

**Goal:** Turn an arbitrary photo into validated, non-sensitive, search-ready signals.

Add `src/assistant/vibe/visionAnalysis.ts` rather than modifying the pantry/dish classifier.

The system prompt must:

- describe only visible scene, apparent expression, pose/activity, clothing formality, setting, weather/season, color, and image-level energy;
- prohibit identity, exact location, landmark recognition, protected/sensitive traits, precise age, health, body, attractiveness, personality, politics, income, and definitive internal-emotion claims;
- require the exact JSON contract from the PRD;
- require 3–6 concise `searchQueries`, each phrased for the corpus rather than as prose;
- limit `mealContext` to breakfast, lunch, or dinner;
- set `safeToUse: false` when a safe observational interpretation cannot be made;
- treat an ambiguous but usable image as `energy: 'neutral'`, not as a technical failure.

Parser requirements:

- Validate every enum and string-array field.
- Trim, deduplicate, and cap array lengths.
- Reject empty `vibeLabel`, missing search queries, or invalid meal context.
- Never throw model output into the UI.
- Distinguish a technical/API failure from a valid `safeToUse: false` response.
- Never log the base64 payload or raw model response.

Use the existing server-only `completeAssistantVision`/`llmCompleteVision` path. Do not add a public OpenAI key, new browser-to-OpenAI request, or persistent API route.

Exit gate:

- Valid portrait, landscape, commute, and neutral fixtures parse successfully.
- Malformed JSON returns `invalid` without crashing.
- Network/upstream failure returns `technical`.
- An unsafe model response returns `unsafe` and cannot reach retrieval.
- Prompt-review checklist confirms all prohibited inferences are explicit.

### Package V3 — Offline Retrieval, Safety Gates, and Ranking

**Goal:** Select one high-quality, defensible recipe using only `scale-v1`.

Add `src/assistant/vibe/recommend.ts` with a direct dependency on `searchContentOffline`. Do not call `searchRecipes`, because that function may choose live MCP in authenticated local development.

Retrieval sequence:

1. Read the current Flavor Profile at request time.
2. Convert dietary restrictions to `dietTags` and set `courseTag` from `mealContext`.
3. Run up to six unique `searchQueries` against `searchContentOffline`, with a bounded per-query limit.
4. Deduplicate by recipe/document ID.
5. Require image, title, canonical recipe source, and hydrated ingredients/steps.
6. Apply corpus metadata dietary filtering first.
7. Convert rows with the existing `toRecipe` mapper.
8. Apply `applyExclusions` as defense in depth for dietary restrictions, disliked ingredients, and stated exclusions.
9. Rank the eligible pool and select one.

Recommended ranking model:

| Signal | Treatment |
|---|---|
| Dietary eligibility | Hard gate |
| Disliked ingredient eligibility | Hard gate |
| Meal-context/course fit | Strong positive; already constrained where metadata permits |
| Search-query rank/coverage | Strong positive across multiple planned queries |
| Flavor and format cue overlap | Positive |
| Season, setting, and energy cue overlap | Positive, lower than food-format relevance |
| Usable image + complete details | Required |
| Rating and review confidence | Modest quality tie-breaker |
| Saved/Home/plan appearance | Soft demotion |
| Already shown in this vibe session | Hard exclusion for **Try another**; soft demotion is not sufficient |

Do not invent recipe metadata. Score only corpus fields and structured analysis. Keep scoring deterministic so it can be fixture-tested.

If the constrained pool is empty, return the dietary-safe no-match state. Never drop restrictions or silently fall back to the 13-recipe emergency fixture for this feature.

Exit gate:

- Tests prove the provider remains `offline-corpus` with and without a Keycloak/MCP session.
- Every active dietary restriction fixture excludes violations.
- Disliked ingredients are excluded.
- All returned recipes have image, title, source, ingredients, and steps.
- Repeating selection with prior IDs returns a different recipe when any eligible alternative exists.

### Package V4 — Pairing Explanation

**Goal:** Explain why this specific recipe matches this specific image without making personal claims.

Add `src/assistant/vibe/explanation.ts`.

Preferred flow:

1. Send only the validated `VibeAnalysis` plus selected recipe title, description, course, cuisine, and a small set of ingredient/format facts to the existing server-side text completion route.
2. Ask for one or two short sentences with no Markdown.
3. Require at least one visible signal and one recipe-specific quality.
4. Permit light humor, but prohibit jokes about the person’s body, identity, belongings, location, or perceived status.
5. Never send the photo again for explanation generation.

Validate the output before display. Reject text that is empty, excessively long, generic, or contains prohibited certainty such as “you are,” “you look like,” or “this person is.” On rejection or API failure, use a deterministic fallback:

> This feels [grounded vibe], so I picked [recipe], which brings [specific recipe quality] to match.

The fallback must use actual structured signals and corpus facts. It must not claim that a photographed ingredient or emotion exists unless present in validated analysis.

Exit gate:

- Each acceptance photo category produces a recipe-specific explanation.
- **Try another** produces a new explanation tied to the same visible context and new recipe.
- Text API failure still returns a complete recommendation.
- No raw analysis block or “AI-generated” label appears in the UI.

### Package V5 — Assistant Entry and Orchestration

**Goal:** Connect the Home action to the photo flow without disturbing pantry scan or dish match.

Tasks:

1. Add **Catch a vibe** to Home suggestions after **Something quick with what I have** and before **Surprise me with something new**.
2. Represent the tap as a structured/sentinel action handled by `AssistantOverlay`, following the established photo follow-up pattern. It must bypass typed-intent parsing.
3. Set the active photo flow to `catch_a_vibe` before opening `PhotoActionSheet`.
4. Add optional privacy copy to `PhotoActionSheet`: **Your photo is used for this result and isn’t saved.** Show it only for Catch a Vibe.
5. Branch photo submission by active flow:
   - existing camera button/pantry-dish flow → `runAssistantWithPhoto`;
   - Catch a Vibe entry → new `runAssistantWithVibePhoto`.
6. Add `rerunCatchAVibe` for **Try another**. It reuses session analysis, excludes all shown IDs, selects a new recipe, and regenerates only the explanation.
7. Add **Use another photo** behavior that resets the vibe session and reopens the picker in Catch a Vibe mode.
8. Use **Reading the room…** during the initial vision + retrieval operation. Do not show that analyzing state for **Try another**; use a restrained card-level loading state if needed.
9. On close, clear pending photo state and the entire vibe session.

Keep `runAssistant` free of Catch a Vibe domain logic. The new orchestrator methods may call a `catchAVibe` tool/service directly, as the existing photo entry does.

Exit gate:

- Existing camera upload still routes to pantry scan/dish match.
- Catch a Vibe photos never route to pantry scan/dish match.
- The Home action opens the chooser immediately.
- Closing and reopening the Assistant shows no prior photo or vibe result.
- Existing Home, Saves, Meal Plans, Search, recipe Q&A, and voice paths still work.

### Package V6 — Result UI

**Goal:** Render one featured result that belongs to the existing Assistant.

Add reusable components under `src/components/assistant/responses/`:

- `VibeResultView.tsx`
- `FeaturedAssistantRecipeCard.tsx` as a controlled extension of `RecipeCard`

The response order is:

1. submitted-photo thumbnail;
2. neutral vibe-label chip;
3. one unbolded explanation;
4. one full-width recipe card;
5. magenta **Share my vibe** button;
6. purple **Try another** suggestion row;
7. neutral **Use another photo** row.

Requirements:

- Reuse existing `RecipeCard` anatomy, token values, border, radius, image treatment, save heart, metadata, and recipe-open behavior.
- Recipe title wraps to two lines.
- Do not use the carousel or purple `whyThis` boxes.
- Keep the Assistant header and input pinned using the existing sheet behavior.
- Ensure the final action clears the pinned input and bottom safe area at supported phone heights.
- Add accessible labels and existing focus/pressed treatments to every action.
- Use only values from `src/theme`; do not hardcode new hex values, pixels, fonts, or shadows.

Extend `ResponseView.tsx` with the new discriminated result. Keep existing recipe, ranked, plan, answer, confirmation, and error rendering unchanged.

Exit gate:

- Portrait, landscape, square, very light, and very dark uploaded images crop predictably.
- Long recipe titles occupy no more than two lines and do not collide with metadata.
- One recipe is visually unmistakable as the answer.
- No bottom action is clipped.
- Keyboard and screen-reader navigation reaches the recipe and every action.

### Package V7 — Share Preview and Export

**Goal:** Generate a user-initiated 4:5 branded result image without uploading or retaining it.

Add:

- `src/components/assistant/vibe/VibeSharePreview.tsx`
- `src/components/assistant/vibe/VibeShareCard.tsx`
- `src/assistant/vibe/share.ts`

Behavior:

1. Do nothing until **Share my vibe** is tapped.
2. Render a 1080×1350-equivalent 4:5 card using the current photo, vibe label, recipe image/title, explanation, MyRecipes wordmark, recipe attribution, and `myr-assistant.vercel.app` footer.
3. Open the lightweight preview defined in the Figma handoff.
4. Prefer `navigator.share`/platform sharing when file sharing is supported.
5. Provide **Download image** on web as the guaranteed fallback.
6. Close returns to the unchanged result.
7. Revoke object URLs and discard generated blobs/assets on preview close, replacement photo, Assistant close, and component unmount.

Implementation note: choose the smallest Expo-compatible client-rendering dependency that passes the public export and bundle-size gate. If a new dependency is required, document why existing browser/React Native APIs are insufficient and keep it isolated behind `share.ts`.

Privacy requirements:

- No server upload is needed to generate the card.
- Do not include name, account details, location, restrictions, internal analysis, or an AI label.
- Do not save the generated image automatically.

Exit gate:

- Web share works where supported and download works everywhere else.
- The card is legible at social-feed size and contains source attribution.
- Object URLs/assets are released after dismissal/reset.
- Public production export stays under the existing 100 MB gate.

### Package V8 — Failure States, Regression, and Public Parity

**Goal:** Finish honest recovery behavior and prove the feature is safe to deploy.

Implement distinct states:

- Technical/invalid analysis: **I couldn’t catch the vibe from that one. Want to try again?** with **Try again** and **Use another photo**.
- Unsafe analysis: use the same user-facing recovery treatment; do not expose internal safety labels.
- No diet-safe match: **I caught the vibe, but couldn’t find a recipe that fits your dietary preferences. Try another photo?** with **Use another photo** and Close.
- Neutral but valid image: successful recommendation, never an error.
- Rate limit: preserve the existing friendly “demo is busy” behavior and offer retry.

Run and pass:

```bash
npm run typecheck
npm run verify:vercel
npm run web -- --port 5180
```

Perform the visual/interaction check at `http://127.0.0.1:5180` and on a Vercel preview over HTTPS.

Regression checklist:

- Home dinner and quick-pantry actions still return results.
- Standard photo discovery still supports pantry scan and dish match.
- Saves queries and Meal Plans behavior are unchanged.
- Recipe detail opens from the featured vibe card and back navigation works.
- Save-heart behavior is unchanged.
- Voice and microphone behavior are unchanged.
- Public mode does not show Keycloak/MCP controls.
- No permanent OpenAI key is present in the browser bundle.
- No photo/base64/analysis payload appears in console output, server logs, local storage, or analytics.

---

## 6. Required Acceptance Matrix

| Scenario | Expected result |
|---|---|
| Morning commute | Portable breakfast recommendation; explanation cites visible commute/on-the-go cues. |
| Smiling portrait | Celebratory pairing; observational wording such as “that big smile,” with no internal-emotion claim. |
| Summer countryside | Fresh breakfast/lunch/dinner as context supports; explanation cites sunny/open-air cues. |
| Formal evening setting | Polished dinner pairing; no income, identity, or location inference. |
| Plain wall or desk | Successful playful neutral pairing. |
| Vegan restriction | Only metadata-verified vegan recipes; no fallback relaxation. |
| Nut-free restriction | No nut-containing title/ingredient result. |
| Disliked ingredient | Ingredient is excluded even if it is the best thematic match. |
| Try another | New recipe, same analysis, no second vision request. |
| Use another photo | Full reset followed by the chooser. |
| Share | Asset created only after tap; share/download succeeds. |
| Technical failure | Honest recovery copy; no fabricated vibe. |
| Close/reopen | No prior photo, analysis, result, or share asset remains. |
| Authenticated local app | Still uses `offline-corpus`, never MCP. |
| Public Vercel app | Same user-visible capability as local mode. |

---

## 7. Suggested File Map

Expected new files:

```text
src/assistant/vibe/
  explanation.ts
  recommend.ts
  session.ts
  visionAnalysis.ts
  share.ts

src/components/assistant/responses/
  FeaturedAssistantRecipeCard.tsx
  VibeResultView.tsx

src/components/assistant/vibe/
  VibeShareCard.tsx
  VibeSharePreview.tsx
```

Expected targeted edits:

```text
src/assistant/types.ts
src/assistant/suggestions.ts
src/assistant/orchestrator.ts
src/assistant/tools/index.ts
src/components/assistant/AssistantOverlay.tsx
src/components/assistant/PhotoActionSheet.tsx
src/components/assistant/ResponseView.tsx
```

Only edit shared API/server files if the current validated `vision` and `text` operations cannot support the required structured output. Avoid a new endpoint unless a demonstrated contract limitation requires one.

---

## 8. Definition of Done

Catch a Vibe is done when:

- the full Home → photo → analysis → featured recipe flow works;
- every recipe comes from `scale-v1` and satisfies all hard restrictions;
- the visible explanation is grounded, recipe-specific, playful, and safe;
- Try another reuses analysis and never repeats a shown recipe when an alternative exists;
- Use another photo and Assistant close erase all session material;
- sharing is explicit, ephemeral, and functional on web;
- the UI matches the approved Figma handoff and existing app components;
- all required checks and the acceptance matrix pass locally and on Vercel preview;
- `HANDOFF.md` is updated to mark the feature built and record any intentional deviations;
- the work is committed as focused, reviewable packages without unrelated changes.

---

## 9. Out of Scope for This Build

- Text captions or combined text-and-photo prompts.
- Catch a Vibe entry points outside Home.
- Multiple uploaded photos.
- Saved vibe history or a share gallery.
- Live MCP retrieval.
- Identity, landmark, ingredient, or dish recognition as part of vibe mode.
- Production analytics beyond safe event-name/count scaffolding.
- A new mascot pose, visual theme, or campaign landing page.
