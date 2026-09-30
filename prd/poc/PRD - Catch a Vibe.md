# PRD — Catch a Vibe

**Status:** Draft v0.1 — POC/demo specification  
**Parent PRD:** [[PRD - Agentic Recipe Assistant]]  
**Author:** Andrew Alburn  
**Last updated:** August 28, 2026  
**User-facing feature name:** Catch a vibe  
**Related:** [[PRD - Photo-Based Recipe Discovery]] · [[PRD - Agentic Recipe Assistant]] · [[PRD - Flavor Profile]] · [[Build Plan - Catch a Vibe]] · [[Figma Handoff - Catch a Vibe]]

---

## 1. Overview

### 1.1 Feature Summary

Catch a Vibe lets a user upload any photo—a selfie, a commute, a room, a landscape, a gathering, or another everyday scene—and receive one real recipe whose character matches the image. The assistant explains the pairing in a light, playful voice.

Examples:

- A morning commute might become a bacon, egg, and cheese sandwich: portable, comforting, and built for forward motion.
- A smiling portrait might become a bright celebration cake or colorful pasta: cheerful food that matches the visible energy.
- A summer countryside scene might become tomato-and-corn pasta: fresh, sunny flavors that feel at home in the setting.

The goal is not to identify the photo literally or claim to know the person in it. The feature uses visible, non-sensitive signals—scene, apparent expression, activity, weather, season, formality, color, and energy—to make an imaginative food pairing.

### 1.2 Product Bet

Most recipe recommendations begin with a functional constraint: ingredient, time, diet, or meal. Catch a Vibe begins with feeling. It gives the assistant a small moment of surprise and personality while remaining grounded in a real, cookable recipe.

The feature succeeds when the recommendation feels:

- **Recognizable:** the explanation clearly connects to visible details in the photo.
- **Unexpected but defensible:** the pairing is fun without feeling random.
- **Shareable:** the result is amusing or charming enough that a user wants to send or post it.
- **Useful:** the recommendation opens a complete recipe from the MyRecipes corpus.

### 1.3 Relationship to Existing Photo Discovery

Catch a Vibe is a child feature of [[PRD - Agentic Recipe Assistant]] and a sibling to [[PRD - Photo-Based Recipe Discovery]].

Photo-Based Recipe Discovery answers, “What food or ingredients are in this picture?” Catch a Vibe answers, “What recipe feels like this picture?” It reuses the existing photo capture, compression, server-side vision, assistant sheet, recipe card, Flavor Profile, and recipe-detail mechanics, but has its own intent, analysis contract, ranking logic, result format, tone, and privacy rules.

---

## 2. Goals and Non-Goals

### 2.1 Goals

- Offer **Catch a vibe** as a suggested action when the assistant first opens from the homepage.
- Accept one uploaded or captured photo with no required text prompt.
- Interpret the photo without asking the user to label its subject or select a meal.
- Select exactly one featured recipe from the approved 10,009-recipe local corpus.
- Consider whether breakfast, lunch, or dinner best fits the image.
- Hard-enforce active dietary restrictions from the user’s Flavor Profile.
- Favor recipes the user has not saved or recently seen.
- Explain the pairing with lyrical, vibe-only flavor copy of no more than 140 characters.
- Let the user try another recipe from the same interpretation or use another photo.
- Offer an explicitly initiated, shareable result card.
- Keep the photo and analysis ephemeral.

### 2.2 Non-Goals

- Identifying a person, place, landmark, brand, or private location.
- Inferring protected or sensitive traits, including ethnicity, religion, health, disability, income, sexuality, politics, or precise age.
- Making claims about personality, mental state, attractiveness, body shape, or health from appearance.
- Diagnosing emotion as fact. Visible expression may inform the playful pairing, but copy must describe the image rather than claim internal knowledge.
- Recognizing ingredients or matching a photographed dish; those jobs belong to Photo-Based Recipe Discovery.
- Persisting photos, creating a photo history, training on uploads, or adding photos to the user profile.
- Using live MCP retrieval. Catch a Vibe uses only the 10K local corpus for consistent local and Vercel behavior.
- Returning a carousel or list of alternatives in the first result.
- Generating a recipe or inventing unavailable recipe details.

---

## 3. Experience Principles

### 3.1 One Photo, One Confident Pick

The assistant returns one featured recipe. The point is a delightful point of view, not a search results page.

### 3.2 Explain the Flavor Match

The image analysis creates a vibe-led food-search plan before a recipe is selected. The result copy then explains how concrete flavors from the selected recipe belong to that vibe.

Good:

> The day has gone soft around the edges. Fresh herbs, ripe tomatoes, and a little citrus belong to this kind of quiet.

Avoid:

> Based on your photo, here is a recipe you may like.

The user-facing line must not literally describe the photo, name the dish, or expose the search process.

### 3.3 Playful, Never Personal at the User’s Expense

Humor should come from the photo-to-food connection—not from judging the person, their appearance, surroundings, possessions, or lifestyle. The voice can be witty, warm, and lightly absurd, but never insulting, creepy, diagnostic, or overconfident.

### 3.4 Constraints Beat Vibes

Dietary restrictions are hard gates. A perfect thematic match that violates the Flavor Profile must never be shown.

### 3.5 Neutral Is Still a Vibe

A visually quiet or ambiguous photo may still receive a playful recommendation. A technical analysis failure must be disclosed honestly and must not be disguised with a fabricated interpretation.

---

## 4. Core User Flow

1. User opens the assistant from the homepage.
2. The opening suggestions include **Catch a vibe**.
3. User taps it and chooses **Take Photo** or **Choose from Library**.
4. The selected photo appears in the assistant as the submitted input.
5. A photo-specific loading state appears, using playful copy such as **Reading the room…**.
6. The assistant analyzes the photo and produces a reusable vibe interpretation.
7. The system searches and ranks eligible recipes from the 10K local corpus.
8. The assistant renders one featured recipe and one short explanation.
9. The user can:
   - open or save the recipe using existing recipe behavior;
   - tap **Try another** to keep the interpretation and choose a different recipe;
   - tap **Use another photo** to reset the flow;
   - tap **Share my vibe** to share or download a result card.
10. Closing the assistant discards the photo, analysis, candidate list, and generated share asset.

---

## 5. Functional Requirements

### FR1 — Homepage Suggested Action

- **Catch a vibe** appears among the suggested actions when the assistant first opens from Home.
- It is not required on Saves, Meal Plans, recipe detail, Search, or Collections in v1.
- Tapping it launches the photo chooser immediately; it does not submit a text query first.

### FR2 — Single-Photo Input

- The user can take a photo or choose one from their device/library.
- Exactly one image is analyzed per Catch a Vibe session.
- No caption, question, or meal selection is required.
- Existing client compression and server-side image limits are reused.

### FR3 — Structured Vibe Analysis

The server-side vision step returns structured analysis suitable for search and explanation. At minimum:

```ts
type VibeAnalysis = {
  visibleSignals: string[];
  vibeLabel: string;
  moodCues: string[];
  energy: 'calm' | 'cozy' | 'playful' | 'energized' | 'elegant' | 'adventurous' | 'neutral';
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
```

- Analysis must be grounded in visible details.
- flavorCues must be concrete, searchable sensory or ingredient concepts rather than abstract moods.
- searchQueries must combine meal context, a plausible format, and at least one flavor, texture, temperature, or pace cue inferred from the vibe.
- The model must not return identity or sensitive-trait inferences.
- Low confidence is allowed and may produce a broader, more playful interpretation.
- `safeToUse: false` routes to the failure state and produces no recommendation.

### FR4 — Meal Context

- The assistant chooses breakfast, lunch, or dinner from the image context.
- It may use time-of-day, activity, setting, apparent formality, or visible environmental cues.
- It must not default every photo to dinner.
- Meal context is a ranking signal and query-planning input, not user-facing certainty.

### FR5 — Dietary Restriction Enforcement

- Active dietary restrictions in Flavor Profile are applied as hard exclusions before ranking.
- Allergy and Preference severities remain equally enforced, matching current product behavior.
- If no safe result is available, the assistant shows an honest no-result state rather than relaxing a restriction.

### FR6 — Local-Corpus Retrieval and Ranking

- Retrieval uses only `scale-v1`, the approved 10,009-recipe local corpus.
- The analysis produces multiple concise search queries rather than one long natural-language sentence.
- Candidate ranking should consider:
  1. dietary eligibility (hard gate);
  2. meal-context fit;
  3. semantic overlap with concrete flavor and format cues derived from the vibe;
  4. recipe quality/completeness;
  5. novelty relative to saved and recently shown recipes.
- Saved or recently shown recipes are soft-demoted, not hard-excluded.
- The selected recipe must have a usable image, title, detail content, and source metadata.
- Ranking must prioritize candidates with ingredient or recipe-text evidence matching the flavor plan; generic corpus rank alone is insufficient when grounded matches exist.

### FR7 — One Featured Result

- The initial result contains exactly one featured recipe card.
- The standard recipe card interaction opens the recipe detail.
- Existing save behavior remains available.
- No secondary carousel appears behind or below it.

### FR8 - Vibe Explanation

- Every result includes one lyrical line of no more than 140 characters, including spaces.
- Voice is observant, restrained, sensory, gently metaphorical, warm, and polished: a lyrical-essay mode without imitating an identifiable writer.
- The line talks only about the vibe and the flavor experience it calls for.
- It must not describe visible objects, people, scenery, weather, or the photo itself.
- It must not name or describe the dish, repeat the recipe title, or expose the search process.
- It must use at least one concrete flavor, ingredient, texture, temperature, or cooking-quality term grounded in the selected recipe.
- It must clearly connect that sensory payoff to the vibe.
- Rerolls must use fresh syntax, metaphor, flavor emphasis, and cadence.

Recommended shape:

> **[Lyrical expression of the vibe]. [Concrete flavors] belong to/call for/meet [that mood].**

### FR9 — Try Another

- **Try another** keeps the original `VibeAnalysis` and searches/ranks again without a second vision call.
- The current recipe ID and all recipes already shown in this Catch a Vibe session are excluded.
- The replacement may emphasize a different valid facet of the same analysis.
- The explanation is regenerated for the new recipe and must remain faithful to the original structured vibe and search plan without literally describing the photo.

### FR10 — Use Another Photo

- **Use another photo** discards the current photo, analysis, candidate history, and share asset.
- It reopens the same photo chooser used at entry.

### FR11 — Share My Vibe

- **Share my vibe** creates a branded, shareable result card containing:
  - the user’s submitted photo;
  - a short vibe label;
  - the recommended recipe image and title;
  - the playful explanation;
  - MyRecipes branding and recipe-source attribution.
- Sharing happens only after explicit user action.
- Prefer the platform share sheet where supported; web must provide a download fallback.
- The share asset is generated for the active session only and is not uploaded to a persistent gallery or retained after the assistant closes.

### FR12 — Failure States

- If image analysis fails technically, say the photo could not be analyzed and offer **Try again** and **Use another photo**.
- If analysis succeeds but no diet-safe corpus recipe is available, explain that no suitable match was found without revealing sensitive or internal analysis.
- If the image is neutral but usable, return a playful recommendation rather than treating neutrality as an error.
- Never fabricate a successful analysis to avoid an empty state.

---

## 6. Privacy and Responsible Use

- Photos and analysis are held only for the active Catch a Vibe session.
- They are not written to local storage, logs, saves, meal plans, analytics payloads, or a user profile.
- Closing the assistant or starting another photo clears them.
- Server logs may record only operational metadata such as endpoint, status class, duration, and anonymous aggregate counts.
- No raw image, base64 payload, vision output, share asset, or explanation prompt may be logged.
- The vision prompt must explicitly prohibit identification and sensitive-trait inference.
- For people, acceptable inputs include visible expression, pose/activity, clothing formality, setting, and image-level energy. Copy must remain observational and non-definitive.

---

## 7. POC Architecture

Catch a Vibe should extend existing infrastructure rather than create a parallel assistant:

- Reuse the Home assistant suggested-action system and photo chooser.
- Reuse client resizing/compression and the server-only `/api/assistant` vision path.
- Add a distinct `catch_a_vibe` assistant intent/tool so pantry scan and dish match behavior do not intercept arbitrary-scene photos.
- Store the active `VibeAnalysis`, shown recipe IDs, and photo preview only in assistant session state.
- Search only through the `scale-v1` offline provider in both local and Vercel modes.
- Reuse the standard recipe-detail and save interactions.
- Generate the share card client-side where practical; no persistent media service is required for the POC.

---

## 8. Success Signals

For the POC, prioritize qualitative proof over production targets:

- Users understand why each recipe was paired with the photo.
- Pairings feel surprising but not random.
- Dietary-restriction checks pass in every tested scenario.
- Users voluntarily tap **Try another** to explore the same vibe.
- Users express an intent to share, or successfully use **Share my vibe**.
- No photo or analysis remains after the assistant session closes.

Suggested instrumentation for a production follow-up:

- Catch a Vibe suggestion tap rate.
- Photo submission and successful-analysis rate.
- Recipe open/save rate.
- Try-another rate and depth.
- Share initiation/completion rate.
- Failure rate by technical, safety, and no-eligible-recipe outcome.

Analytics must not include image content or raw analysis.

---

## 9. Acceptance Scenarios

1. **Morning commute:** chooses a breakfast-appropriate, portable recipe and explains the on-the-go connection.
2. **Smiling portrait:** uses visible celebratory energy without claiming the person’s internal emotional state.
3. **Summer countryside:** chooses a fresh, seasonal-feeling recipe and cites the sunny/open-air cues.
4. **Formal evening setting:** chooses a dinner-appropriate recipe with a polished quality.
5. **Neutral wall or desk:** still returns a playful, defensible recommendation.
6. **Active dietary restriction:** never returns a violating recipe, even when it is the strongest vibe match.
7. **Try another:** returns a different recipe without re-analyzing the photo.
8. **Use another photo:** fully resets the session and opens the chooser.
9. **Share:** generates a complete card only after the user taps Share my vibe.
10. **Technical failure:** returns honest recovery actions and no fabricated vibe.
11. **Close and reopen:** the prior photo and analysis are gone.

---

## 10. Resolved Product Decisions

- Entry is a suggested action on the homepage assistant opening state.
- Input is image-only in v1.
- The first result is one featured recipe.
- Try another reuses the same analysis and avoids previous results.
- Use another photo is always available.
- Breakfast, lunch, or dinner is selected from context.
- Flavor Profile dietary restrictions are hard-enforced.
- People are analyzed only through visible, non-sensitive signals.
- Result copy uses the locked lyrical-essay contract: vibe-only, flavor-grounded, and 140 characters maximum.
- Neutral images still receive a recommendation.
- Technical failures are disclosed honestly.
- New/unseen recipes are preferred.
- Sharing is in scope.
- Photos and analyses are ephemeral.
- Retrieval is limited to the 10K local corpus.

---

## 11. Delivery Documents

- Design specification: [[Figma Handoff - Catch a Vibe]]
- Coder-ready implementation sequence, architecture, safety gates, testing, and definition of done: [[Build Plan - Catch a Vibe]]

The design handoff defines group J, required frames, component reuse, states, copy hierarchy, responsive behavior, prototype connections, and the share-card composition. The design must treat Catch a Vibe as a natural extension of the existing assistant—not a visually separate mini-product.
