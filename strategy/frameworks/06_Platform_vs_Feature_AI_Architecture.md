# 06 Platform Vs Feature AI Architecture

## Purpose

Decide whether MyRecipes should treat AI as a horizontal platform, a set of vertical point solutions, or a hybrid of the two.

## Why It Matters Here

This is the central architecture question behind the strategy. The cooking journey contains multiple high-value pain points, but the personas do not want the same kind of AI interaction. MyRecipes needs a structure that preserves coherence without forcing one surface across all contexts.

## How To Use It

1. Define the core architecture options.
2. Assess them against persona needs, product coherence, implementation complexity, and trust.
3. Choose the model that best supports cross-journey learning and context-specific UX.

## Inputs

- Persona trust and AI comfort profiles
- Journey pain density
- Opportunity set across discovery, planning, shopping, and execution
- Desire for personalization and recovery over time

## Evaluation Lens

Evaluate each option on:

- `Cross-journey coherence`
- `Depth in each use case`
- `Trust fit by persona`
- `Ability to accumulate learning`
- `Risk of fragmentation`
- `Ease of shipping meaningful value`

## MyRecipes Application

### Option A: AI As A Horizontal Platform

**Description:** One assistant or AI layer is visible across the entire journey.

**Pros**

- Feels coherent
- Easier to message externally
- Makes cross-journey continuity obvious

**Cons**

- Risks becoming generic
- Poor fit for the Established Home Cook
- Can feel like a chatbot looking for a problem

### Option B: AI As Vertical Point Solutions

**Description:** Separate AI experiences are built for planning, shopping, cooking, and recovery.

**Pros**

- Can be highly optimized for each stage
- Easier to ship value incrementally
- Each team can design for local context

**Cons**

- Feels fragmented
- Learning does not naturally carry across stages
- Hard to build a consistent user understanding of the product

### Recommended Model: Hybrid Architecture

**Description:** One intelligence layer underneath the product, surfaced through different experiences by context.

#### Shared Intelligence Layer

- Recipe metadata and semantic understanding
- Persistent preference memory
- Pantry and plan state
- Household constraints
- Cooking history and feedback signals

#### Context-Specific Surfaces

- `Planning`: decision engine and weekly planner
- `Shopping`: constraint optimizer and list consolidator
- `Cooking`: real-time guide and substitution assistant
- `Learning`: invisible personalization and better future recommendations

### Why The Hybrid Model Fits MyRecipes

- It protects the largest skeptical segment from unnecessary AI exposure.
- It lets the System Thinker get a real planning partner without turning the entire product into a planner.
- It lets the Weeknight Reducer get one strong answer without opening a bot experience.
- It lets the Enthusiast opt into a more explicit expert companion where that adds value.

## Strategic Implications

- MyRecipes should build one intelligence backbone and multiple UX roles.
- The product should not advertise one persistent AI character across every stage.
- Architecture decisions should prioritize shared state and shared learning before designing every surface.
- Roadmap sequencing should begin with the hidden intelligence layer because the visible experiences depend on it.

## Decision Prompts

- What context does the system need to carry from one stage to the next?
- Which personas benefit from explicit AI, and which should never see it directly?
- Is this a shared capability or a one-off surface solution?
- Are we building a smarter product or a visible assistant?

## Output Artifact

A clear AI architecture decision that defines the shared intelligence layer, the specialized user-facing surfaces, and the rules for when AI should be invisible versus explicit.
