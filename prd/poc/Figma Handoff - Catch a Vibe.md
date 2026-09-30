# Figma Handoff — Catch a Vibe

**Status:** Draft v0.1  
**Source PRD:** [[PRD - Catch a Vibe]]  
**Implementation plan:** [[Build Plan - Catch a Vibe]]  
**Last updated:** August 27, 2026  
**Target file:** [MyRecipes Assistant — Mockups v1](https://www.figma.com/design/ayz7msvFFdu1Kv66Yf6r1p/MyRecipes-Assistant-%E2%80%94-Mockups--v1-?node-id=0-1&p=f&m=dev)  
**New Figma group:** **J — Catch a Vibe**

---

## 1. Design Objective

Design a photo-to-recipe flow inside the existing assistant. A user taps **Catch a vibe**, uploads any photo, and receives one playful recipe pairing with a clear explanation of why the image inspired it.

This must feel like a natural extension of the assistant already in the file—not a separate campaign, quiz, or mini-app. The delight should come from the pairing and copy, not from a new visual language.

The key design idea is:

> **One photo → one confident recipe → one charming explanation.**

---

## 2. Sources of Truth

Use these in priority order:

1. Existing assistant frames and components in **MyRecipes Assistant — Mockups v1**.
2. `myrapp_guide` for components, variables, iconography, and Mr. Hearty.
3. `myrapp_home` for Home context and bottom navigation.
4. Existing Photo-Based Recipe Discovery frames in group **H** for photo chooser, submitted thumbnail, analyzing state, and photo failure behavior.
5. [[PRD - Catch a Vibe]] for behavior, privacy, safety, and copy rules.

Do not redesign the assistant shell, header, input, bottom navigation, Mr. Hearty, recipe-card anatomy, or suggestion-button system.

---

## 3. Existing Components to Reuse

Reuse the existing components and variants wherever possible:

- Assistant bottom sheet, scrim, drag handle, header, close action, pinned input, and scrolling body.
- Mr. Hearty default asset in the assistant header.
- Home assistant opening-state suggestion rows.
- Existing primary purple and neutral outlined `SuggestionChip` patterns.
- Existing PhotoActionSheet: **Take Photo**, **Choose from Library**, **Cancel**.
- Existing submitted-photo thumbnail in the query-bubble position.
- Existing assistant loading language and skeleton treatment.
- Existing `RecipeCard` anatomy: image, heart, two-line title, rating/time/source metadata.
- Existing magenta pill `Button` for an explicit action.
- Existing neutral filter/chip treatment for the short vibe label.
- Existing error copy and recovery-action pattern.

### One controlled component extension

The result needs one recipe, not a carousel. Create a **single featured assistant recipe** presentation by expanding the existing recipe-card anatomy to the available sheet width. Preserve its border, radius, image treatment, title typography, metadata, heart, and pressed behavior. Do not invent a visually unrelated “AI recommendation” card.

---

## 4. Visual Guardrails

- Stay within the existing white, deep-purple, magenta, black-border, hard-shadow system.
- Use existing spacing, radius, type, color, and elevation variables from `myrapp_theme` / Meridian.
- No gradients, glassmorphism, glowing AI effects, generated illustrations, or new mascot poses.
- Do not add an “AI-generated” label.
- Do not add a second assistant header or a Catch a Vibe sub-brand.
- Do not use purple explanation boxes below the recipe. The explanation is normal, unbolded response text above the card.
- Recipe titles support two lines.
- The Home assistant has no scope chip; keep it that way.
- The assistant input remains visible and pinned throughout the flow unless the native/platform share sheet is open.

---

## 5. Required Frames

Build the following frames as group **J**. Use the same phone size and assistant-sheet geometry as the existing mockups.

### J1 — Home Assistant Opening

Show the current Home assistant opening state with these suggestions in this order:

1. **What’s for dinner tonight?** — existing primary purple row.
2. **Something quick with what I have** — existing neutral row.
3. **Catch a vibe** — new neutral row.
4. **Surprise me with something new** — existing neutral row.

Catch a vibe should be easy to notice through placement and copy, but it must not introduce a special banner, badge, or one-off card. Tapping it immediately opens J2.

### J2 — Photo Chooser

Reuse the existing PhotoActionSheet structure:

- **Take Photo**
- **Choose from Library**
- **Cancel**

Add one quiet privacy line using tertiary utility text:

> Your photo is used for this result and isn’t saved.

Keep the message inside the action-sheet composition without adding a separate consent screen or checkbox.

### J3 — Reading the Photo

Show:

- the real selected image as the submitted-photo thumbnail aligned to the query side;
- existing assistant header and pinned input;
- a photo-specific loading label: **Reading the room…**;
- the existing subtle loading/skeleton language beneath it.

The state should feel quick and playful, not theatrical. Do not show a fake recipe before analysis completes.

### J4b - Result: Editorial Card Treatment

Use a summer countryside photo as the primary example. J4b is the canonical Catch a Vibe result screen.

Content order:

1. Full-width 361 x 260 submitted-photo hero with the vibe chip overlaid at bottom left.
2. Editorial pull quote using 23px heavy type; emphasize the opening phrase in magenta and keep the flavor payoff black.
3. Magenta uppercase eyebrow: **TONIGHT'S PAIRING**.
4. Existing 361 x 160 horizontal featured recipe card, with the source badge on the card's lower-right edge.
5. Magenta **Share my vibe** button with white label; it remains functionally disabled in the POC without muted styling.
6. One paired action row: purple **Try another** on the left and neutral **Use another photo** on the right.
7. Pinned assistant input.

Example explanation:

> The day's gone soft around the edges - fresh herbs and a green, lively finish for the win.

The generated explanation remains subject to the PRD contract: lyrical, vibe-only, flavor-grounded, no dish name, and no more than 140 characters.

### J5 — Result: Person

Use a smiling portrait to demonstrate responsible people-photo copy.

Example vibe chip:

> Celebration energy

Example explanation:

> That big smile gives this photo celebration energy, so I picked Funfetti Cake—subtle? No. Appropriate? Absolutely.

The design must not show age, identity, personality, demographic, attractiveness, health, or emotion labels. The visible expression may be referenced observationally; avoid copy such as “You’re happy.”

### J6 — Result: Neutral Photo

Use a deliberately plain desk, wall, or similarly neutral image. The layout is identical to J4/J5; only the pairing and copy change.

Example vibe chip:

> Quiet confidence

Example explanation:

> This photo is playing it very cool, so I picked a grilled cheese: understated, dependable, and secretly the right answer.

This frame proves that a neutral photo is still a successful state, not an error.

### J7 — Try Another

Show the J4 photo with a different recipe and explanation after **Try another**.

- Keep the same submitted thumbnail and vibe chip.
- Replace only the featured recipe and explanation.
- Do not show the analyzing state again; this action reuses the original interpretation.
- Preserve the same action hierarchy.

Optional transition annotation for prototyping: the old card fades/slides out and the new card enters using the assistant’s existing restrained motion language. No slot-machine or randomizer animation.

### J8 — Share Preview

Show a lightweight preview reached from **Share my vibe**.

- Keep it within the existing modal/sheet language.
- Display the exact shareable card at a legible preview size.
- Primary magenta action: **Share**.
- Secondary neutral action: **Download image** (web fallback).
- Close returns to the Catch a Vibe result without regenerating it.

Also create the standalone export component described in §7.

### J9 — Recovery States

Create two variants using the same error-state layout:

**Technical analysis failure**

> I couldn’t catch the vibe from that one. Want to try again?

Actions:

- **Try again** — primary purple.
- **Use another photo** — neutral.

**No dietary-safe match**

> I caught the vibe, but couldn’t find a recipe that fits your dietary preferences. Try another photo?

Actions:

- **Use another photo** — primary purple.
- **Close** — neutral or header close only; do not offer to relax dietary restrictions.

---

## 6. Result Hierarchy

The result should read in this order:

1. **What the user submitted** — small photo thumbnail.
2. **The assistant’s playful read** — short vibe chip plus explanation.
3. **The useful answer** — one real recipe card.
4. **The growth/delight action** — Share my vibe.
5. **Exploration/recovery** — Try another and Use another photo.

Keep the explanation unbolded and concise. It should never compete visually with the recipe title.

The featured card should fit fully within the sheet width and show:

- food image;
- save heart;
- two-line recipe title;
- rating/review count when available;
- total time;
- source/brand treatment consistent with existing recipe cards.

The full result may scroll, but the assistant header and input remain pinned. Ensure the final action is not clipped by the input or phone safe area.

---

## 7. Share Card

Create one reusable **4:5 portrait social card** component. Suggested export size: **1080 × 1350**.

### Required content

- MyRecipes wordmark.
- Label: **CATCH A VIBE**.
- User’s submitted photo as the dominant visual.
- Short vibe label.
- Label: **YOUR RECIPE MATCH**.
- Recipe image and two-line title.
- The playful explanation.
- Small footer: **Catch yours at myr-assistant.vercel.app**.
- Recipe-source attribution when required by the existing card data.

### Composition guidance

- Use the existing white/purple/magenta visual system.
- Preserve the user photo’s importance; do not make it a tiny thumbnail.
- Keep both photos legible without creating a busy collage.
- Use the existing card border/radius/shadow language.
- Ensure the explanation remains readable in a social feed preview.
- Do not include the user’s name, account details, location, dietary restrictions, analysis metadata, or an AI label.

The share-card frame must make it obvious that sharing is user-initiated. It is generated only after tapping Share my vibe.

---

## 8. Copy Deck

| Context | Copy |
|---|---|
| Home action | Catch a vibe |
| Loading | Reading the room… |
| Privacy | Your photo is used for this result and isn’t saved. |
| Primary share CTA | Share my vibe |
| Follow-up 1 | Try another |
| Follow-up 2 | Use another photo |
| Share preview primary | Share |
| Share preview fallback | Download image |
| Technical failure | I couldn’t catch the vibe from that one. Want to try again? |
| No safe match | I caught the vibe, but couldn’t find a recipe that fits your dietary preferences. Try another photo? |

Tone is warm, observant, light, and occasionally funny. Humor comes from the food pairing, never from judging the person or their surroundings.

---

## 9. Interaction and Prototype Connections

Wire the prototype so a reviewer can complete this path without dead ends:

1. J1 Catch a vibe → J2 photo chooser.
2. J2 Take Photo / Choose from Library → J3 analyzing.
3. J3 → J4 result.
4. J4 Try another → J7.
5. J4 Use another photo → J2.
6. J4 Share my vibe → J8.
7. J8 Close → J4.
8. J8 Share / Download image → success confirmation or platform handoff annotation.
9. J9 recovery actions → J3 or J2 as specified.
10. Featured recipe card → existing recipe-detail frame.

Use the existing assistant open/close, sheet scroll, and recipe navigation prototype behavior.

---

## 10. Responsive and Accessibility Notes

- Design within the same mobile assistant frame used elsewhere in the mockup file; do not create a separate desktop UI.
- On wider web viewports, the existing centered phone frame remains the source of truth.
- Respect existing safe areas and keep bottom actions clear of the pinned input.
- Controls need explicit accessible names, visible focus states, and the existing minimum hit-target treatment.
- Do not rely on color alone to distinguish primary/secondary actions or loading/error states.
- Preserve sufficient contrast over user and recipe photography.
- User photos may be portrait, landscape, square, light, or dark; test crop behavior against each.
- Long recipe titles must wrap to two lines without colliding with metadata or actions.

---

## 11. Figma Deliverables

- Group **J — Catch a Vibe**, containing J1–J9.
- One reusable component for the single featured assistant recipe card, based on the existing recipe card.
- One reusable Catch a Vibe share-card component at 4:5.
- Component variants for share preview, technical failure, and dietary no-match.
- Connected prototype path covering upload → analysis → result → retry/share.
- Brief annotations identifying reused components versus the two controlled extensions.
- No new design tokens unless an existing token demonstrably cannot support the design.

### Design-review checklist

- Does it unmistakably belong to the existing assistant?
- Is one recipe clearly the answer?
- Is the photo-to-recipe logic understandable from the explanation?
- Is the humor fun without making assumptions about the user?
- Are dietary restrictions treated as non-negotiable?
- Is privacy legible without adding friction?
- Can the user try another, use another photo, share, or open the recipe without a dead end?
- Does the full result fit and scroll without controls being cut off?
