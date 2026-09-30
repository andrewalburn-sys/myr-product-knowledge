# POC: Image Vibe Recipe Search

### Overview

Build a one-week proof of concept for an internal stakeholder demo that lets a user upload any photo and receive one recipe recommendation inspired by the photo's vibe, along with an explanation of the connection.

This POC is distinct from the existing Photo-Based Recipe Discovery work, which identifies ingredients or matches a photographed dish. Image Vibe Recipe Search should also work with non-food inputs—such as a person, commute, landscape, gathering, or seasonal scene—and turn their visible mood and context into recipe inspiration.

- **What happens today:** Recipe discovery begins with a food need, ingredient, dish, or text query. Users cannot begin with an arbitrary image and ask MyRecipes to interpret it as inspiration.
- **What users expect:** After uploading a photo, the experience should show that it understood relevant visible cues, interpret the image's mood or context, recommend one recipe, and clearly explain why those cues connect to that recipe. The user should be able to regenerate for a different recommendation without uploading the photo again.
- **Why this matters:** This tests a playful, low-effort entry point into recipe discovery that may help users move from a feeling or moment to a concrete cooking idea without first deciding what to search for. A specific explanation is essential to make the recommendation feel intentional rather than random.
- **Scope (high level):**
  - Upload one JPEG or PNG and display a preview.
  - Analyze visible subjects, setting, activity, expression, season, atmosphere, and other relevant cues using a vision-capable model chosen by the developer.
  - Interpret those cues into a concise mood/context and food association.
  - Recommend one recipe from the live MyRecipes catalog using the fastest available integration path.
  - Display the recipe title, image when available, catalog link when available, and a concise explanation connecting the image cues to the recipe.
  - Let the user regenerate a different recommendation based on the same image.
  - Show simple loading and failure states.
  - Prepare a small, varied evaluation set and record results for the demo.
- **Out of scope for the POC:** Production hardening, scalability, finalized image-retention behavior, comprehensive guardrail design, dietary or account personalization, conversational refinement beyond regeneration, multiple simultaneous recommendations, and pixel-perfect MyRecipes UI integration.
- **Notes:** Keep the work time-boxed to five working days. The core flow is `image upload → vibe interpretation → recipe selection → grounded explanation`. The implementation should remain legible enough to inspect the image interpretation separately from recipe selection when reviewing failures. If live catalog integration threatens the timebox, use a curated subset of real MyRecipes recipes and document that tradeoff rather than delaying the end-to-end demo.

### Acceptance Criteria

- A user can upload a JPEG or PNG and see a preview of the selected image.
- After processing, the POC returns exactly one MyRecipes recipe recommendation.
- The result includes the recipe title, recipe image when available, and a link to the recipe when available.
- The explanation identifies specific visible cues from the uploaded image, describes the mood or context inferred from those cues, and explains why that interpretation connects to the selected recipe.
- The explanation is specific enough that it would not plausibly apply unchanged to an unrelated image.
- A user can select **Regenerate** without uploading the image again.
- Regeneration returns a different recipe when a suitable alternative is available while remaining grounded in the same image.
- The interface shows a loading state while the image is being processed.
- An unsupported image or processing failure produces a clear error state and does not display a fabricated recommendation.
- The complete flow is available as a working internal demo within five working days.
- A 10-image test set is run before the demo. At least 8 of the 10 first recommendations must pass all four plausibility checks in Testing Notes.
- The final handoff includes the test results, known limitations or failure patterns, and a recommendation on whether the concept merits a follow-up experiment.

**Acceptable tradeoffs (if any):**

- A curated subset of real MyRecipes recipes is acceptable if live catalog integration cannot be completed within the one-week timebox.
- A simple internal prototype UI is acceptable; end-to-end functionality and recommendation quality take priority over visual polish.
- The developer may choose the vision model, language model, prompting approach, prototype framework, and hosting approach that provide the fastest path to the demo.
- If no plausible recipe can be produced, a clear failure state is preferable to an arbitrary recommendation.

### Technical Notes

- *(Leave this section intentionally blank for the developer to fill in.)*

### Testing Notes

- **Happy path:** Upload a clear photo; verify that one recipe and a cue-specific explanation appear; select **Regenerate** and verify that a different, still-relevant recipe appears without another upload.
- **Evaluation set:** Test 10 varied images, including a commute/on-the-go scene, a person with a clearly positive expression, a person with a calm or reflective expression, a summer countryside scene, a cold-weather scene, a social gathering, a cozy indoor scene, an energetic activity, an ambiguous scene, and a scene with weak food associations.
- **Plausibility rubric:** Mark a recommendation as passing only when all four are true:
  1. **Image understanding:** The explanation broadly reflects elements visibly present in the image.
  2. **Vibe interpretation:** The inferred mood or context is reasonable given those elements.
  3. **Recipe connection:** The recipe is a coherent response to the interpreted vibe.
  4. **Explanation quality:** The connection is specific and understandable rather than generic.
- **Edge cases:** Unsupported file type, unreadable or corrupt file, failed model request, failed recipe lookup, an image with multiple possible interpretations, an image with no obvious food association, and regeneration when no unseen alternative is available.
- **Regressions to watch:** None for a standalone internal prototype. If the POC reuses an existing recipe-search or assistant environment, confirm that text-based recipe discovery still behaves as expected.
