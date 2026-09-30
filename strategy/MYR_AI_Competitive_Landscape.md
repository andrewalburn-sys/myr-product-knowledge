# MyRecipes AI — Competitive Landscape Reference

**Last updated:** March 2026  
**Purpose:** Reference source for sharpening MyRecipes AI strategy. Covers competitor profiles, a cross-stage coverage matrix, and strategic implications for positioning and build decisions.

---

## The Market Bifurcation Thesis

The cooking app market has split into two distinct categories: **Recipe Destinations** and **Cooking Companions**. The Destination category is mature, well-funded, and effectively claimed by incumbents. The Companion category — apps that stay with you through the act of cooking itself — has been attempted by several small players but has no clear leader. This is the structural opening.

Every competitor profiled below sits clearly in one of these two camps, or in a supporting utility role. None of them bridge the full journey.

---

## Category A — Recipe Destinations

These players compete on content quality, catalog depth, and passive discovery. They win on editorial trust and cultural relevance. They stop at the moment you close the app to go cook.

---

### NYT Cooking

**What it does**  
Subscription-based recipe platform (part of the NYT bundle) with 25,000+ editor-tested recipes, personalized recommendations, recipe organization into folders, and a grocery list builder.

**Strengths / Moat**  
- 12.3 million total NYT digital subscribers as of Q3 2025; Cooking is a key bundle driver
- Deep editorial trust — every recipe is tested and reviewed by professional staff
- Personality-led video content (1M+ YouTube subscribers); individual creators build audience loyalty, which AI cannot easily replicate
- AI recipe scaling launched January 2026 — all 25,000+ recipes scaled using generative AI with editorial review, including cookware adjustments, egg weight specifications, and seasoning guidance
- Personalized homepage with "We Think You'll Love" carousel (launched August 2023)

**What it doesn't do**  
- No voice companion or execution guidance
- No constraint-based meal planning
- No "what to cook tonight" decision support
- No substitution help mid-cook
- Search within saved recipes does not exist — users cannot filter their own saved library
- Grocery list crashes on item removal (documented user complaint)
- Cannot mark recipes as cooked to track cooking history
- Cannot filter by ingredient exclusions
- A developer built an unofficial "NYT Sous Chef" AI companion on Devpost — the need was apparent enough that a third party tried to fill it; NYT has not

**Strategic relevance to MyRecipes**  
NYT Cooking has drawn a sharp, intentional line: they are a recipe *destination*, not a cooking *companion*. This is not a gap they accidentally missed — it reflects a strategic choice to compete on editorial authority and content trust. Competing with NYT Cooking on passive discovery or editorial depth is a fight against a well-funded incumbent on its own terms. The companion category is what they've left unclaimed.

---

### Pinterest

**What it does**  
Visual discovery and bookmarking platform. Users save recipe images and links into themed boards. Content circulates for months or years after posting, unlike typical social feeds.

**Strengths / Moat**  
- Enormous catalog of food and recipe imagery with long content lifespan
- Strong save-and-return behavior — boards function as persistent visual cookbooks
- 500M+ monthly active users; high intent for food content among home cooks
- Strong for recipe research in a lean-back, low-pressure mode

**What it doesn't do**  
- No structured recipe format — saves are images/links, not usable recipe data
- No cooking execution support
- No meal planning or shopping list
- No personalization beyond recommendation feed
- Content quality is unvetted — viral ≠ reliable

**Strategic relevance to MyRecipes**  
Pinterest owns the passive inspiration moment for many home cooks, especially women 25–54. Users may discover on Pinterest and save to MyRecipes — this is a *complementary* user flow, not a head-to-head fight. The risk is if Pinterest or a future platform adds structured recipe capture and becomes the library, not just the feed.

---

### TikTok / Instagram Reels

**What they do**  
Short-form video platforms where food content drives massive organic discovery. Food is among the highest-performing content categories on both platforms.

**Strengths / Moat**  
- TikTok engagement rate: 3.70% for food content — 7x Instagram's 0.48% (2025 benchmark data)
- Gen Z specifically: 84% actively try food trends seen on TikTok; 70% name it as their most valuable food recommendation source
- Trend velocity is unmatched — a dish can go from unknown to culturally ubiquitous in days
- Instagram Reels is the primary social marketing channel for restaurants and food brands

**What they don't do**  
- No structured recipe data — content is video, not usable recipe format
- No personalization tied to diet, constraints, or cooking history
- No path from inspiration to execution
- Content quality completely unvetted

**Strategic relevance to MyRecipes**  
Social platforms define the passive inspiration moment for younger audiences. MyRecipes cannot and should not compete here. The strategic question is whether MyRecipes can capture the handoff — when someone sees something on TikTok and wants to save and cook it. Apps like Flavorish and Allspice already do "save from social URL" as their core UX; this is a table-stakes feature worth evaluating as an entry point, not a strategic battleground.

---

## Category B — Cooking Companions (Early Stage)

These players have identified the same gap MyRecipes is targeting — the execution layer — and have begun building into it. None of them have cracked the core intelligence problem. The space is being attempted, not won.

---

### Sprig

**What it does**  
iOS-only AI chef companion app featuring hands-free voice guidance (powered by ElevenLabs), real-time cooking Q&A, AI recipe generation, meal planning, and shopping list sync to Apple/Google Calendar. Subscription with 7-day free trial.

**Strengths**  
- Voice interface is polished; ElevenLabs integration gives it a natural-sounding response quality
- Recipe import from URLs, PDFs, and photos
- Real-time substitution requests in plain language ("swap the pasta for rice")

**Limitations**  
- iOS only at launch, Android pending
- As with most voice cooking apps, substitution intelligence is shallow — it processes the language request but does not reason about downstream consequences (liquid ratios, cooking time, seasoning balance)
- Small catalog; no personal save library depth
- No connection to a user's existing recipe collection

**Strategic relevance to MyRecipes**  
Sprig is the most direct early-stage competitor. It is attempting to build exactly what MyRecipes should build — a voice companion alongside the recipe. Its current limitation is that it generates or imports recipes fresh; it has no personal library to reason against. MyRecipes' structural advantage is that the library already exists.

---

### Sous

**What it does**  
Recipe extraction from any source (URL, photo, social media) with step-by-step guided cooking, smart timers, and the ability to ask for help mid-cook including substitutions and fixes.

**Strengths**  
- Broad recipe import capability — any source, not a walled garden
- Mid-cook Q&A is the core feature promise
- Smart timers are a genuine utility

**Limitations**  
- Same intelligence gap as the category broadly — substitution answers are generic
- No personal save history or cooking track record
- No meal planning

**Strategic relevance to MyRecipes**  
Sous is building on the execution moment without the planning layer. Shallow moat. The intelligence gap is the vulnerability MyRecipes can exploit.

---

### Foodie (thefoodie.menu)

**What it does**  
AI sous chef feature focused on answering questions about ingredient swaps, cooking techniques, and substitutions mid-cook without requiring web searches. Hands-free voice cooking with step-by-step guidance.

**Strengths**  
- Specifically targets the mid-cook rescue use case
- Hands-free mode reduces the friction of using a screen while cooking

**Limitations**  
- Ingredient swap intelligence remains surface-level
- No integration with meal planning, shopping, or a personal recipe library

**Strategic relevance to MyRecipes**  
Foodie has correctly identified the problem (mid-cook rescue) but has not solved the underlying intelligence requirement. Confirms market demand. Does not represent a durable competitive threat.

---

### Tamarin

**What it does**  
Voice-first cooking navigation — hands-free commands to navigate recipe steps, ask for ingredient lists, and get next steps without screen interaction. Includes meal planning, smart shopping lists, and nutrition tracking.

**Strengths**  
- Hands-free navigation is genuinely useful for messy-hands cooking situations
- Covers more of the journey than most companions (planning + shopping + execution)

**Limitations**  
- Voice navigation is not the same as voice intelligence — reading steps hands-free is mechanical; answering "why did my sauce break" is magical
- No personal recipe library connection

**Strategic relevance to MyRecipes**  
Tamarin is the closest to a full-journey companion in this category, which makes it worth monitoring. Still in early growth. The intelligence gap is the same across the category.

---

### SideChef

**What it does**  
Step-by-step recipe app with 18,000+ recipes, built-in timers, voice command support, one-click grocery shopping integration (Walmart, Instacart, Amazon Fresh, Target), and smart appliance control for 2,000+ recipes.

**Strengths**  
- Step-by-step guidance with photos/video for each step is genuinely useful
- Smart appliance integration (LG, GE, Bosch) is a differentiated hardware play
- Shopping integration is strong and functional
- 4.6 stars on Google Play

**Limitations**  
- Recipe catalog is fixed — not connected to user's personal saves
- Voice command support is navigation (next step, set timer) not intelligence (help me fix this)
- No meal planning layer

**Strategic relevance to MyRecipes**  
SideChef has the most complete execution UI of any companion-category player. The gap is intelligence and personalization. Worth watching for feature parity on the step-by-step and timer UI, which represents a minimum bar for any execution experience MyRecipes ships.

---

## Category C — Large Language Models

LLMs are the most structurally interesting competitive threat because they improve continuously and have broad awareness. They are also the most constrained by a specific set of problems that MyRecipes is positioned to solve.

---

### ChatGPT (OpenAI)

**Cooking capability**  
Strong at one-shot recipe generation and constraint-handling. Users can specify dietary restrictions, time constraints, ingredient availability, and cuisine preference and receive a credible recipe in seconds. Handles fridge-leftovers scenarios well for a single session.

**Hallucination rate on cooking queries:** ~12% (controlled testing, 1,000 prompt sample, 2025)

**Critical limitations**  
- Memory is limited and degrades over time — dietary restrictions from week 1 are forgotten by week 3 even with memory features enabled
- No pantry awareness — generates full shopping lists from scratch regardless of what the user already has
- No personal recipe library — every conversation starts from zero
- Users report having to re-paste preferences into every new chat session
- Recipes become repetitive by week 2–3 of sustained use

**Evolution to watch**  
MCP (Model Context Protocol) integration in 2026 allows ChatGPT to connect directly to external apps — meal planning calendars, shopping carts, calendar scheduling. This is the technical path toward closing the personalization gap.

**Strategic relevance to MyRecipes**  
ChatGPT will continue to improve at one-shot recipe generation. The gap to defend is not recipe quality — it's cooking conviction: knowing the user's history, what they've saved, what they've cooked, and what they trust. ChatGPT can never know what's in your recipe box.

---

### Claude (Anthropic)

**Cooking capability**  
Rated highest for overall recipe quality in comparative testing, with particular strength in interactive, complex cooking scenarios. In March 2026, Claude launched interactive recipe cards with adjustable serving sizes, built-in step timers, and automatic unit conversions — the most complete in-conversation recipe experience of any LLM.

**Hallucination rate on cooking queries:** ~15% (broader than cooking-specific; cooking performance likely better)

**Critical limitations**  
- Same structural memory problem as all general-purpose LLMs
- No personal library or cooking history
- No persistent pantry awareness
- Not purpose-built for the cooking journey — recipe cards are a UI add-on, not a dedicated cooking UX

**Evolution to watch**  
Claude's March 2026 recipe card feature is the clearest signal yet that LLMs are moving toward dedicated cooking surfaces. The gap from "interactive recipe card in a chat interface" to "full cooking companion with personal context" is still large — but the direction is clear.

**Strategic relevance to MyRecipes**  
Claude represents the sophistication ceiling of what LLMs will offer in the near term. Its interactive recipe cards are table stakes for any execution experience. The question is not whether Claude will get better — it will — but whether a dedicated cooking app with personal library depth can build a moat before LLMs close the memory and UX gap.

---

### Gemini (Google)

**Cooking capability**  
Handles recipe queries and meal planning suggestions. Integrated across Google's ecosystem (Search, Assistant, Calendar) which gives it surface-area advantages for multi-step planning flows.

**Hallucination rate on cooking queries:** ~38% — significantly higher than peers in cooking-specific testing

**Critical limitations**  
- Highest hallucination rate of the major LLMs for cooking queries, including citation of non-existent recipes from Bon Appétit and Food & Wine (Source Mirage pattern)
- No personal recipe library
- Planning suggestions lack continuity across sessions

**Evolution to watch**  
Google's ecosystem integration (Search → recipe → calendar → shopping) could become a meaningful workflow if Google builds coherence across these surfaces. Currently fragmented.

**Strategic relevance to MyRecipes**  
Gemini's trust problem (38% hallucination) is actually an opportunity in the near term — users who have had bad experiences with AI-generated recipes are primed to trust a curated, editorially-vetted catalog. MyRecipes' "real recipes, trusted results" positioning benefits from LLM unreliability.

---

### Perplexity

**Cooking capability**  
Strong at search-grounded recipe queries. Low hallucination rate achieved primarily by sourcing and citing existing content rather than generating original recipes.

**Hallucination rate on cooking queries:** ~9% — lowest of the major LLMs, but achieved through content retrieval not culinary reasoning

**Critical limitations**  
- Low hallucination is a function of not generating — it retrieves existing recipes
- Retrieval-based approach means it cannot adapt recipes to user-specific constraints in a nuanced way
- No memory, no personal library

**Strategic relevance to MyRecipes**  
Perplexity is increasingly a "what should I cook tonight" destination for users who want a quick answer without browsing. This is the same entry-point moment MyRecipes targets with active-intent discovery. The gap: Perplexity's answer comes from the open web; MyRecipes' answer can come from your personal saves, your cooking history, your constraints. That personalization delta is the competitive moat.

---

## Category D — Planning & Utility Apps

These apps address specific functional stages of the journey but do not attempt to be full companions. They represent current market quality benchmarks per stage.

---

### Mealime

**What it does**  
Constraint-based weeknight meal planning with a curated recipe library. Supports multiple dietary preferences simultaneously (vegetarian, gluten-free, etc.). Grocery list auto-generation from meal plan. Instacart integration. 7 million users.

**Strengths**  
- Fast and opinionated — generates a weekly meal plan quickly from their curated library
- Grocery integration is smooth
- Strong for the time-constrained weeknight cook persona

**Limitations**  
- Fixed catalog — no ability to plan from recipes you've saved elsewhere
- No AI layer; planning is constraint filtering, not intelligence
- Free tier limits recipe import

**Strategic relevance to MyRecipes**  
Mealime is the benchmark for constraint-based planning UX. It plans from its own catalog of ~1,000 curated recipes — users can save favorites within that catalog and filter to them, but the plan generation is catalog-constrained. MyRecipes' catalog is 250x larger and the planning engine is informed by the user's full save history, including external saves, as a taste signal. The result is a plan that reflects what the user actually cooks rather than a generic rotation.

---

### Kitchendary

**What it does**  
AI-powered meal planning with simultaneous constraint layering — keto, paleo, gluten-free, intermittent fasting windows, specific allergen exclusions, and cuisine preferences all at once. Generates a complete 7-day personalized meal plan with full macronutrient breakdowns in under 60 seconds.

**Strengths**  
- Fastest and most constraint-capable meal planner in the market
- Multi-constraint stacking (dietary + timing + allergens simultaneously) is genuinely impressive
- Macro tracking integration is strong for fitness-focused users

**Limitations**  
- Plans from its own catalog only — no personal recipe library connection
- No voice companion or execution guidance
- No cooking history or preference learning from actual cooking

**Strategic relevance to MyRecipes**  
Kitchendary sets the speed and constraint bar for AI meal planning — but from its own catalog. Like all planning competitors, it is catalog-constrained. The MyRecipes advantage is catalog scale (250,000 recipes vs. Kitchendary's own fixed set) combined with behavioral signal depth: the planning engine is informed by what the user has saved, cooked, and trusted across the full product history, including external saves used as taste signals even if those recipes aren't in the plan pool.

---

### Eat This Much

**What it does**  
Macro and calorie-targeted meal planning. Generates plans to hit specific nutritional goals. Strong for fitness-focused meal preppers.

**Strengths**  
- Best-in-class for calorie/macro targeting
- Can generate meal plans within a specific budget

**Limitations**  
- Nutritional focus narrows its appeal to a specific persona
- No personal recipe library integration
- No execution support

**Strategic relevance to MyRecipes**  
Eat This Much is a deep solution for a specific niche (macro targeting). Not a primary competitive concern for the general home cook persona.

---

### AnyList

**What it does**  
Recipe organization, meal planning calendar, and auto-generated shopping lists. Allows URL recipe import and drag-and-drop meal scheduling. Strong household sharing features.

**Strengths**  
- Best-in-class for household-level meal plan management and grocery list coordination
- Recipe import from web is smooth
- Meal plan → shopping list automation works reliably

**Limitations**  
- No AI layer; planning and organization are entirely manual
- No execution guidance
- No personalization beyond saved filters

**Strategic relevance to MyRecipes**  
AnyList defines the baseline for grocery list UX. MyRecipes' shopping list feature needs to clear this bar. The gap AnyList leaves open: intelligence in the planning step and execution in the cooking step.

---

### Instacart (Smart Shop + Copilot)

**What it does**  
Grocery delivery platform that has invested heavily in AI-powered shopping features. Smart Shop (launched March 2025) uses generative AI and ML to personalize the shopping experience. Copilot converts any recipe directly to a populated Instacart cart. Cart Assistant handles meal planning and shopping list creation through conversational AI.

**Strengths**  
- Recipe → cart conversion is seamless with Copilot
- Smart Shop personalizes across 17 million items using purchase history
- Cart Assistant can plan meals and generate lists through chat — a genuinely functional planning surface
- Health Tags with detailed nutritional information across the full catalog

**Limitations**  
- Instacart's interest is selling groceries, not helping you cook — the planning and execution layers are marketing surfaces, not deep product investment
- No cooking execution or companion features

**Strategic relevance to MyRecipes**  
The shopping stage is more solved than it initially appeared. Instacart's investment here raises the bar for what "good" shopping integration looks like. MyRecipes' opportunity is the *orchestration layer* — taking a user's saved recipe library, generating a week plan from it, and pushing the consolidated list to Instacart in one flow. Instacart is a partner here, not a competitor.

---

## Cross-Reference Matrix: Competitors × Journey Stages

Coverage ratings: **Strong** / **Partial** / **Weak** / **Absent**

| Competitor | Discover (active) | Discover (passive) | Plan | Shop | Cook / Execute | Recover | Reflect / Save |
|---|---|---|---|---|---|---|---|
| **NYT Cooking** | Partial | Strong | Absent | Weak | Absent | Absent | Partial |
| **Pinterest** | Absent | Strong | Absent | Absent | Absent | Absent | Partial |
| **TikTok / Instagram** | Absent | Strong | Absent | Absent | Absent | Absent | Absent |
| **Sprig** | Partial | Absent | Partial | Partial | Partial | Weak | Absent |
| **Sous** | Partial | Absent | Absent | Absent | Partial | Weak | Absent |
| **Foodie** | Absent | Absent | Absent | Absent | Partial | Partial | Absent |
| **Tamarin** | Absent | Absent | Partial | Partial | Partial | Weak | Absent |
| **SideChef** | Weak | Absent | Partial | Strong | Partial | Absent | Absent |
| **ChatGPT** | Partial | Absent | Partial | Absent | Partial | Partial | Absent |
| **Claude** | Partial | Absent | Partial | Absent | Partial | Partial | Absent |
| **Gemini** | Partial | Absent | Partial | Partial | Partial | Partial | Absent |
| **Perplexity** | Partial | Absent | Weak | Absent | Absent | Absent | Absent |
| **Mealime** | Absent | Absent | Strong | Strong | Absent | Absent | Absent |
| **Kitchendary** | Absent | Absent | Strong | Partial | Absent | Absent | Absent |
| **AnyList** | Absent | Absent | Partial | Strong | Absent | Absent | Partial |
| **Instacart** | Partial | Absent | Partial | Strong | Absent | Absent | Absent |

**Reading the matrix:**  
- Cook/Execute and Recover have no Strong ratings anywhere. Partials come from LLMs (chat-based, no UX) and early companion apps (voice chrome without real intelligence).  
- Passive discovery is the most crowded zone — three Strong ratings from dedicated content platforms.  
- Planning is contested but every competitor's plan generator is catalog-constrained. The differentiator is catalog scale (250,000 vs. ~1,000) and behavioral signal depth from save history.  
- Reflect/Save is largely ignored across the board. The rediscovery job — surfacing what you saved 6 months ago in a useful way — is unbuilt.

---

## Strategic Implications for MyRecipes

### 1. The companion category is open. Enter it.

No competitor in the matrix has a Strong rating in Cook/Execute or Recover. The two categories that represent the highest pain and lowest market solution quality have no meaningful competitive pressure. This is not a niche or a future state — it is the present reality. The companion category is the strategic opening.

### 2. Recipe destination is a ceiling, not a direction

NYT Cooking has defined what the recipe destination model looks like at scale — 12M+ subscribers, editorial trust, personality video, AI scaling. That is the ceiling of the category. MyRecipes cannot and should not try to out-NYT NYT Cooking. The path forward is companion, not content. Every resource spent competing on editorial catalog depth is a resource not spent building the companion intelligence that no one else has.

### 3. The voice companion moat is intelligence, not chrome

Six apps have attempted voice-guided cooking execution. A 2025 evaluation found that a large majority of voice interactions across these apps returned either no substitution alternatives or ignored the downstream cooking consequences of the swap. The hardware (voice, timers, hands-free) is not the differentiator. The culinary reasoning is. Shipping a voice companion with shallow intelligence is shipping a feature that confirms the category is hard, not one that wins it. Having a voice button is table stakes. The moat is what it can actually reason about.

### 4. Catalog scale + behavioral signal depth is the planning wedge

Every planning competitor is catalog-constrained — so is MyRecipes. The differentiator is not the concept of planning from saves (Mealime already lets users filter to saved favorites within their catalog) but the scale and signal behind it. Mealime plans from ~1,000 curated recipes. MyRecipes plans from 250,000 — and the engine is informed by the user's complete behavioral history, including external saves that signal taste even when those recipes aren't in the plan pool. A plan generated by MyRecipes reflects what that specific user actually cooks. A Mealime plan reflects a generic rotation shaped by dietary filters.

### 5. The LLM clock is running — build the personalization layer now

LLMs are improving rapidly. Claude launched interactive recipe cards in March 2026. MCP integration enables LLMs to connect to external apps, calendars, and shopping carts. The current structural weakness — no memory, no personal library, personalization decay — will narrow over 12–18 months. The moat to build before that window closes is cooking conviction: a deep understanding of the specific user's history, preferences, saves, and trust signals that a general-purpose LLM cannot access even if its raw recipe capability matches or exceeds a curated catalog. Build the personalization layer before the intelligence gap closes.

### 6. LLM hallucination is a short-term trust opportunity

Gemini hallucinates on 38% of cooking queries. ChatGPT and Claude are in the 12–15% range. Perplexity is lower (9%) but achieves this by retrieving rather than reasoning. Users who have received a confidently-delivered, technically unsafe or completely fabricated recipe from an LLM are primed to trust a product that says "every recipe in this library has been made by real people." MyRecipes' trust advantage is real right now. Use it in positioning. Do not wait for LLMs to fix their hallucination problem before leveraging yours.

### 7. Passive discovery is not the battleground

TikTok's engagement rate on food content is 7x Instagram's. Pinterest is a persistent, high-intent save surface. These platforms have billions in infrastructure and network effects behind them. MyRecipes competing for the passive inspiration moment is competing against a category of products purpose-built for that experience. The right posture is complementary — capture the save when someone arrives from social — not competitive.

### 8. Shopping is a partner play, not a build

Instacart's Smart Shop and Copilot are genuinely strong. The shopping experience itself is solved. MyRecipes' opportunity is the orchestration: saved library → week plan → consolidated shopping list → Instacart push. The cart experience should be Instacart's. The plan that populates it should be MyRecipes'.

---

*Cross-reference this document against `08_MyRecipes_AI_Strategy_Synthesis.md` for build order implications, and `01A_User_Journey_Pain_Density_Synthesis.md` for stage-level pain scoring.*
