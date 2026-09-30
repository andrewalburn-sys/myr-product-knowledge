# Feature Overview — Multi-Recipe Cooking Guidance

**Status:** Early experiment  
**Last updated:** September 9, 2026  

## Overview

A meal is often more than one recipe. Someone may be making a main dish, a side, and a salad, each with its own timing and instructions. The recipes explain how to make each dish individually, but not how to cook them together.

Multi-Recipe Cooking Guidance would use an LLM to turn a set of recipes into one coordinated cooking plan. The plan would tell one cook what to do, in what order, and when to use passive cooking time for another dish so the full meal is ready near the same serving time.

The first step is an internal experiment, not a product build. We want to learn whether an LLM can produce plans that are practical, efficient, and faithful to the source recipes.

## The experiment

We will select several representative recipe combinations and provide the model with:

- two or more complete recipes;
- a desired serving time;
- the assumption of one cook in a standard home kitchen.

The model will return one chronological plan across the full meal. Each step should identify:

- when it happens relative to serving time;
- which recipe it belongs to;
- what the cook should do;
- when a passive period begins or ends;
- any oven, burner, or equipment conflict that needs attention.

For example, the plan might start a long-baking side first, use its oven time to prep the main, and leave a salad until the end rather than asking the cook to follow three separate instruction lists.

## Guardrails

The model may reorder and interleave steps, but it should not change the recipes themselves. Temperatures, cook times, quantities, doneness guidance, and food-safety instructions must remain faithful to the source.

The plan should:

- aim to have every dish ready near the requested serving time;
- account for prep, active cooking, passive cooking, resting, and holding time;
- avoid giving one cook unrealistic simultaneous tasks;
- recognize shared equipment and incompatible oven temperatures;
- call out conflicts it cannot resolve safely rather than improvising.

## What we need to learn

We should test combinations with increasing coordination difficulty:

1. A main, an oven-baked side, and a no-cook salad.
2. Two dishes competing for the oven at different temperatures.
3. Several recipes with overlapping active steps or shared equipment.

For each plan, a human reviewer should assess:

- **Fidelity:** Does it preserve every important instruction from the source recipes?
- **Timing:** Would the dishes finish together, allowing for rest and holding?
- **Feasibility:** Could one person realistically follow the sequence?
- **Conflict handling:** Does it catch oven, burner, and equipment constraints?
- **Clarity:** Is the combined plan easier to follow than the recipes separately?
- **Safety:** Does reordering introduce any food-safety or doneness risk?

The experiment succeeds if the generated plans are consistently more useful than reading each recipe independently without creating new timing, feasibility, or safety problems.

## Not part of this experiment

- Building the user-facing cooking experience
- Live replanning when the cook falls behind
- Voice guidance, timers, or notifications
- Personalization by skill level or kitchen setup
- Changing or optimizing the source recipes themselves

If the approach works, the next step would be to explore how a cook selects recipes, confirms their kitchen constraints and serving time, and follows or adjusts the plan while cooking.
