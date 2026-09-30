# 07 Moments Of Truth

## Purpose

Identify the moments where users either gain confidence and trust in MyRecipes or experience failure that causes abandonment, fallback behavior, or churn.

## Why It Matters Here

Not every touchpoint is equally important. In cooking, a handful of moments determine whether the product feels indispensable or disposable. AI should over-index on these moments because that is where success changes behavior and failure becomes memorable.

## How To Use It

1. List the moments where users must make a choice, commit effort, or recover from disruption.
2. Identify what success feels like and what failure looks like.
3. Note the persona stakes attached to each moment.
4. Decide what kind of product response is required: invisible support, explicit guidance, or full recovery.
5. Prioritize the moments that most strongly affect trust and repeat use.

## Inputs

- Persona pain points and trust thresholds
- Journey stage pain density
- Current user workarounds and failure patterns
- Opportunity set for discovery, planning, shopping, and execution

## Evaluation Lens

For each moment, assess:

- `Stress level`
- `Likelihood of failure`
- `Behavioral consequence if we fail`
- `Trust upside if we succeed`
- `Appropriate AI role`

## MyRecipes Application

### High-Stakes Moments Of Truth

| Moment of truth | Primary personas | If MyRecipes succeeds | If MyRecipes fails | Appropriate AI role |
| --- | --- | --- | --- | --- |
| What should I cook tonight? | Weeknight Reducer, Established Home Cook | The user gets to a confident decision fast | Endless browsing, decision fatigue, fallback to habits or takeout | Decision engine |
| Is this worth making? | Enthusiast, Established Home Cook | The user commits with confidence | Recipe is abandoned or never attempted | Curator with conviction signals |
| Can I make this with what I have? | Weeknight Reducer, System Thinker | Feasibility is clear before commitment | Shopping friction or plan collapse appears late | Constraint optimizer |
| Did the weekly plan actually hold together? | System Thinker | The product feels like a real planning partner | Planning feels brittle and untrustworthy | Planning partner |
| Am I doing this right right now? | Weeknight Reducer, Enthusiast | The user stays calm and in motion | Confusion, hesitation, low-confidence execution | Real-time guide |
| Something went wrong. Now what? | Weeknight Reducer, System Thinker, Enthusiast | The user recovers without restarting | Dinner collapses, week collapses, trust collapses | Recovery engine |
| Does the product understand me better over time? | Established Home Cook, Enthusiast | Recommendations improve and trust compounds | Product feels generic, repetitive, and forgetful | Invisible learning layer |

### MyRecipes Priority Tiers

#### Tier 1: Must-Win Moments

- `What should I cook tonight?`
- `Can I make this with what I have?`
- `Something went wrong. Now what?`

These are the moments where friction is highest and existing alternatives are weakest.

#### Tier 2: Differentiation Moments

- `Is this worth making?`
- `Did the weekly plan actually hold together?`
- `Am I doing this right right now?`

These are the moments where a best-in-class product can feel dramatically better than current tools.

#### Tier 3: Compounding Trust Moments

- `Does the product understand me better over time?`

This moment is quieter, but it determines whether the experience becomes personalized rather than repetitive.

## Strategic Implications

- AI should not attempt to own every touchpoint equally.
- The product should be judged by how well it performs in a small set of critical moments.
- Recovery deserves explicit investment because failure is inevitable in real life.
- Trust-building moments and rescue moments should shape roadmap order more than lower-stakes convenience features.

## Decision Prompts

- If we fail here, what does the user do next?
- Does success here create trust, relief, delight, or loyalty?
- Is this moment better served by invisible AI, contextual UI, or explicit assistance?
- Would solving this moment reduce future friction elsewhere in the journey?

## Output Artifact

A ranked list of critical moments where MyRecipes should focus intelligence, UX polish, and performance standards.
