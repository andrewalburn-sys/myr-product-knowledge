<!-- GENERATED FILE — NON-AUTHORITATIVE. Rebuild with knowledge-base/scripts/generate-drift-reports.mjs. -->
# Documentation Drift Report

**Authority:** Generated diagnostic; not a product requirement.

- **Knowledge source fingerprint:** `65e16b827042d5684c13742519652f011824c84e14fbd02f4a5e9a7d9e2c1f78`
- **Knowledge ref:** `HEAD`
- **App state:** `working tree from 323755456097`
- **As of:** `2026-09-30`

## Summary

| Severity | Findings |
|---|---:|
| Blocking | 0 |
| Conflict | 0 |
| Review | 17 |
| Stale | 0 |
| Informational | 0 |

## Findings

### 1. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [corpus/FIELD_INVENTORY.md](https://github.com/andrewalburn-sys/myr/blob/main/corpus/FIELD_INVENTORY.md), [corpus/schema-v1.json](https://github.com/andrewalburn-sys/myr/blob/main/corpus/schema-v1.json), [public/recipe-data/scale-v1/coverage-report.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/coverage-report.json), [public/recipe-data/scale-v1/details/recipes-000.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-000.json), [public/recipe-data/scale-v1/details/recipes-001.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-001.json), [public/recipe-data/scale-v1/details/recipes-002.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-002.json), [public/recipe-data/scale-v1/details/recipes-003.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-003.json), [public/recipe-data/scale-v1/details/recipes-004.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-004.json), and 38 more
- **Sources:** [prd/Assistant Backend Capability Map.md](<../../prd/Assistant Backend Capability Map.md>)
- **Map rules:** `assistant-core-contracts`, `recipe-search-and-corpus`
- **Source authority:** `supporting`

### 2. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [App.tsx](https://github.com/andrewalburn-sys/myr/blob/main/App.tsx), [src/assistant/AssistantProvider.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/AssistantProvider.tsx), [src/assistant/chatHistory.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/chatHistory.ts), [src/assistant/chatTitle.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/chatTitle.ts), [src/assistant/orchestrator.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/orchestrator.ts), [src/assistant/session.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/session.ts), [src/assistant/types.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/types.ts), [src/components/HorizontalCarousel.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/HorizontalCarousel.tsx), and 13 more
- **Sources:** [prd/Assistant Conversation and Interaction Behavior.md](<../../prd/Assistant Conversation and Interaction Behavior.md>)
- **Map rules:** `assistant-core-contracts`, `assistant-shell`, `conversation-state-history`, `grounded-cooking-answers`, `meal-planning`, `recommendation-card-presentation`
- **Source authority:** `canonical`

### 3. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [scripts/assistantDiscovery/smokeUi.mjs](https://github.com/andrewalburn-sys/myr/blob/main/scripts/assistantDiscovery/smokeUi.mjs), [scripts/assistantDiscovery/verifyContracts.mjs](https://github.com/andrewalburn-sys/myr/blob/main/scripts/assistantDiscovery/verifyContracts.mjs), [scripts/assistantDiscovery/verifyFollowUps.mjs](https://github.com/andrewalburn-sys/myr/blob/main/scripts/assistantDiscovery/verifyFollowUps.mjs), [src/assistant/discovery/demoPersonalization.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/demoPersonalization.ts), [src/assistant/discovery/followUpValidation.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/followUpValidation.ts), [src/assistant/discovery/ingredientConcepts.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/ingredientConcepts.ts), [src/assistant/discovery/ingredientEvidence.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/ingredientEvidence.ts), [src/assistant/discovery/miss.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/miss.ts), and 10 more
- **Sources:** [prd/Assistant Discovery - Golden Sequences.csv](<../../prd/Assistant Discovery - Golden Sequences.csv>)
- **Map rules:** `discovery-tools`, `semantic-planning-and-constraints`
- **Source authority:** `release`

### 4. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [App.tsx](https://github.com/andrewalburn-sys/myr/blob/main/App.tsx), [src/assistant/AssistantProvider.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/AssistantProvider.tsx), [src/assistant/chatHistory.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/chatHistory.ts), [src/assistant/chatTitle.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/chatTitle.ts), [src/assistant/orchestrator.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/orchestrator.ts), [src/assistant/session.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/session.ts), [src/components/HorizontalCarousel.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/HorizontalCarousel.tsx), [src/components/RecipeCard.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/RecipeCard.tsx), and 10 more
- **Sources:** [prd/Assistant Discovery MVP - App Requirements.md](<../../prd/Assistant Discovery MVP - App Requirements.md>)
- **Map rules:** `assistant-shell`, `conversation-state-history`, `recommendation-card-presentation`
- **Source authority:** `release`

### 5. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [src/assistant/contextualFollowUps.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/contextualFollowUps.ts), [src/assistant/discovery/followUpValidation.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/followUpValidation.ts), [src/assistant/followUps/dimensions.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/followUps/dimensions.ts), [src/assistant/followUps/generate.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/followUps/generate.ts), [src/assistant/followUps/indexProbe.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/followUps/indexProbe.ts), [src/assistant/followUps/pool.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/followUps/pool.ts), [src/assistant/followUps/rank.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/followUps/rank.ts), [src/assistant/followUps/resolve.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/followUps/resolve.ts), and 4 more
- **Sources:** [prd/Assistant Follow-Up Suggestions - Relevance Rules.md](<../../prd/Assistant Follow-Up Suggestions - Relevance Rules.md>)
- **Map rules:** `follow-up-suggestions`
- **Source authority:** `canonical`

### 6. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [corpus/FIELD_INVENTORY.md](https://github.com/andrewalburn-sys/myr/blob/main/corpus/FIELD_INVENTORY.md), [corpus/schema-v1.json](https://github.com/andrewalburn-sys/myr/blob/main/corpus/schema-v1.json), [public/recipe-data/scale-v1/coverage-report.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/coverage-report.json), [public/recipe-data/scale-v1/details/recipes-000.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-000.json), [public/recipe-data/scale-v1/details/recipes-001.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-001.json), [public/recipe-data/scale-v1/details/recipes-002.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-002.json), [public/recipe-data/scale-v1/details/recipes-003.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-003.json), [public/recipe-data/scale-v1/details/recipes-004.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-004.json), and 55 more
- **Sources:** [prd/Assistant Semantic Retrieval - Elasticsearch Execution Spec.md](<../../prd/Assistant Semantic Retrieval - Elasticsearch Execution Spec.md>)
- **Map rules:** `discovery-tools`, `recipe-search-and-corpus`, `semantic-planning-and-constraints`
- **Source authority:** `canonical`

### 7. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [src/assistant/dinner/why.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/dinner/why.ts), [src/assistant/tools/dinnerDecision.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/tools/dinnerDecision.ts)
- **Sources:** [prd/Dinner Tonight - Data Science Problem Statement.md](<../../prd/Dinner Tonight - Data Science Problem Statement.md>)
- **Map rules:** `dinner-tonight`
- **Source authority:** `supporting`

### 8. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [src/components/assistant/responses/VibeResultView.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/assistant/responses/VibeResultView.tsx)
- **Sources:** [prd/poc/Build Plan - Catch a Vibe.md](<../../prd/poc/Build Plan - Catch a Vibe.md>)
- **Map rules:** `catch-a-vibe`
- **Source authority:** `poc`

### 9. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [src/components/assistant/responses/VibeResultView.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/assistant/responses/VibeResultView.tsx)
- **Sources:** [prd/poc/Figma Handoff - Catch a Vibe.md](<../../prd/poc/Figma Handoff - Catch a Vibe.md>)
- **Map rules:** `catch-a-vibe`
- **Source authority:** `poc`

### 10. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [src/components/assistant/responses/VibeResultView.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/assistant/responses/VibeResultView.tsx)
- **Sources:** [prd/poc/PRD - Catch a Vibe.md](<../../prd/poc/PRD - Catch a Vibe.md>)
- **Map rules:** `catch-a-vibe`
- **Source authority:** `poc`

### 11. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [src/assistant/dinner/why.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/dinner/why.ts), [src/assistant/tools/dinnerDecision.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/tools/dinnerDecision.ts)
- **Sources:** [prd/poc/PRD - Dinner Decision Engine.md](<../../prd/poc/PRD - Dinner Decision Engine.md>)
- **Map rules:** `dinner-tonight`
- **Source authority:** `poc`

### 12. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [src/components/assistant/PhotoInspirationChooser.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/assistant/PhotoInspirationChooser.tsx)
- **Sources:** [prd/poc/PRD - Photo-Based Recipe Discovery.md](<../../prd/poc/PRD - Photo-Based Recipe Discovery.md>)
- **Map rules:** `photo-discovery`
- **Source authority:** `poc`

### 13. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [src/assistant/discovery/demoPersonalization.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/demoPersonalization.ts)
- **Sources:** [prd/poc/PRD - User Recommendation Preferences.md](<../../prd/poc/PRD - User Recommendation Preferences.md>)
- **Map rules:** `personalization-and-profile`
- **Source authority:** `poc`

### 14. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [corpus/FIELD_INVENTORY.md](https://github.com/andrewalburn-sys/myr/blob/main/corpus/FIELD_INVENTORY.md), [corpus/schema-v1.json](https://github.com/andrewalburn-sys/myr/blob/main/corpus/schema-v1.json), [public/recipe-data/scale-v1/coverage-report.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/coverage-report.json), [public/recipe-data/scale-v1/details/recipes-000.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-000.json), [public/recipe-data/scale-v1/details/recipes-001.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-001.json), [public/recipe-data/scale-v1/details/recipes-002.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-002.json), [public/recipe-data/scale-v1/details/recipes-003.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-003.json), [public/recipe-data/scale-v1/details/recipes-004.json](https://github.com/andrewalburn-sys/myr/blob/main/public/recipe-data/scale-v1/details/recipes-004.json), and 66 more
- **Sources:** [prd/PRD - Assistant Discovery MVP (Backend).md](<../../prd/PRD - Assistant Discovery MVP (Backend).md>)
- **Map rules:** `discovery-tools`, `follow-up-suggestions`, `recipe-search-and-corpus`, `semantic-planning-and-constraints`
- **Source authority:** `release`

### 15. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [scripts/assistantDiscovery/smokeUi.mjs](https://github.com/andrewalburn-sys/myr/blob/main/scripts/assistantDiscovery/smokeUi.mjs), [scripts/assistantDiscovery/verifyContracts.mjs](https://github.com/andrewalburn-sys/myr/blob/main/scripts/assistantDiscovery/verifyContracts.mjs), [scripts/assistantDiscovery/verifyFollowUps.mjs](https://github.com/andrewalburn-sys/myr/blob/main/scripts/assistantDiscovery/verifyFollowUps.mjs), [src/assistant/discovery/demoPersonalization.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/demoPersonalization.ts), [src/assistant/discovery/followUpValidation.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/followUpValidation.ts), [src/assistant/discovery/ingredientConcepts.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/ingredientConcepts.ts), [src/assistant/discovery/ingredientEvidence.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/ingredientEvidence.ts), [src/assistant/discovery/miss.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/miss.ts), and 10 more
- **Sources:** [prd/PRD - Assistant Semantic Query Planner.md](<../../prd/PRD - Assistant Semantic Query Planner.md>)
- **Map rules:** `discovery-tools`, `semantic-planning-and-constraints`
- **Source authority:** `canonical`

### 16. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [src/assistant/dinner/why.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/dinner/why.ts), [src/assistant/discovery/demoPersonalization.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/discovery/demoPersonalization.ts), [src/assistant/tools/dinnerDecision.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/tools/dinnerDecision.ts), [src/assistant/types.ts](https://github.com/andrewalburn-sys/myr/blob/main/src/assistant/types.ts), [src/components/assistant/PhotoInspirationChooser.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/assistant/PhotoInspirationChooser.tsx), [src/components/assistant/responses/AIAnswerCard.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/assistant/responses/AIAnswerCard.tsx), [src/components/assistant/responses/WeekPoolPlan.tsx](https://github.com/andrewalburn-sys/myr/blob/main/src/components/assistant/responses/WeekPoolPlan.tsx)
- **Sources:** [prd/PRD - MyRecipes Assistant.md](<../../prd/PRD - MyRecipes Assistant.md>)
- **Map rules:** `assistant-core-contracts`, `dinner-tonight`, `grounded-cooking-answers`, `meal-planning`, `personalization-and-profile`, `photo-discovery`
- **Source authority:** `canonical`

### 17. Review: Mapped implementation changed without a corresponding working-tree change to this governed source.

- **Code:** [scripts/recipeQuestions/verifyContracts.mjs](https://github.com/andrewalburn-sys/myr/blob/main/scripts/recipeQuestions/verifyContracts.mjs)
- **Sources:** [prd/Recipe-Specific Suggested Questions - Relevance Rules.md](<../../prd/Recipe-Specific Suggested Questions - Relevance Rules.md>)
- **Map rules:** `recipe-specific-questions`
- **Source authority:** `canonical`

## Interpretation

- **Blocking:** a governed assistant path has no source mapping.
- **Conflict:** active source metadata is internally inconsistent.
- **Review:** implementation changed and the mapped source needs review.
- **Stale:** an authoritative source exceeded the 90-day review interval.
- **Informational:** implementation and its mapped source both changed; human approval is still required for normative content.
