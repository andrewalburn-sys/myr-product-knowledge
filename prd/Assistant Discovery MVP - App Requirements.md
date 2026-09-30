---
kb_id: assistant-discovery-app-requirements
title: Assistant Discovery MVP — App Requirements
authority: release
status: draft-release-requirements
owner: Andrew Alburn
audience:
  - product
  - design
  - frontend-engineering
  - qa
applies_to:
  - q4-release
  - production
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code:
  - src/components/assistant/AssistantOverlay.tsx
  - src/components/assistant/AssistantSheet.tsx
related_docs:
  - prd/PRD - Assistant Discovery MVP (Backend).md
  - prd/Assistant Conversation and Interaction Behavior.md
---

# Assistant Discovery MVP — App Requirements

**Status:** Draft release requirements
**Audience:** Smart Labs, and our frontend developer
**Author:** Andrew Alburn
**Release:** Q4 — MyRecipes app, React Native
**Backend counterpart:** `PRD - Assistant Discovery MVP (Backend).md` — what the services do, and what a response carries
**Detailed interaction contract:** `Assistant Conversation and Interaction Behavior.md`
**Last updated:** September 30, 2026

**What this is:** the app-side requirements for the assistant, separated from the backend document so neither team reads the other's detail. The detailed behavior shared across features—turns, context, navigation, response presentation, and history—lives in `Assistant Conversation and Interaction Behavior.md`.

**The one thing to know before reading:** the app renders what the service sends. It doesn't decide how many results appear, what a follow-up suggestion says, or whether a constraint was applied. Those are service decisions. What's below is what the app owns outright.

---

## 1. The entry point

- One recognizable entry point on Home and on Saves, in the same place with the same affordance on both, so there's one thing to learn.
- **It never opens itself.** No auto-open, no interruption, no badge, no notification, no first-run takeover.
- With the assistant closed, both screens behave exactly as they do today. Removing the entry point entirely should leave the rest of the experience unchanged.

This last point isn't decoration. Roughly half our audience experiences an always-present AI as intrusive, and the release has a guardrail on their experience not getting worse.

---

## 2. Opening and dismissing

- Opening overlays the current screen rather than navigating away from it.
- Dismissing returns the user to that screen exactly as they left it — scroll position, active filters, any interaction in progress.
- The conversation survives being dismissed and reopened within a session.
- Opening a recipe from an assistant result temporarily hides the assistant; Back restores the same conversation and scroll position. Opening content must not remount or reset the chat.

---

## 3. Rendering results

The service sends a result set and the information needed to display it. The app's job is presentation.

- **Recipe cards use the app's existing component.** Not a parallel design.
- Cards show what they show everywhere else: image, title, rating, review count, total time, source brand. We don't strip information to look more like AI.
- Render the number of results that arrive. Two is a valid answer and shouldn't look like a broken row of three.
- Tapping a result goes to the recipe the same way it does anywhere else in the app.
- When the service returns partial ingredient matches as a fallback, they appear after complete matches in a clearly separate treatment. The app shows which requested ingredient is missing and never presents a partial as satisfying the original request.

### Result formats to support

The service declares which format a response uses. Building these five covers this release and most of what comes after:

| Format | Used for |
|---|---|
| Recipe card carousel | Discovery results |
| Ranked recipe list | Saves results |
| Short text response | Honest misses, unanswerable questions, interpretation statements |
| Suggestion buttons | Follow-ups |
| Working state | Any request in flight |

**Why this matters more than it looks.** If the app learns these five formats and renders whatever the service declares, new capabilities ship without another app release. If each feature gets bespoke rendering, we're back negotiating capacity every quarter. This is the highest-leverage decision on the app side and worth validating early.

---

## 4. Input

- Typing is always available, and never the only way through.
- **Every flow in this release can be completed by tapping alone.** Opening suggestions and follow-ups have to be tappable.
- Tapping **Dinner Tonight** returns results immediately. There is no ingredient intake before the first set.
- After dinner results, the app may show an optional prompt asking whether the user wants to include any ingredients in the next set. Common ingredients are tappable, with free entry available for anything else.

---

## 5. Suggestions

- The service sends up to three, already validated. The app displays them.
- **The app never invents, substitutes, or pads suggestions.** If two arrive, two are shown. If none arrive, none are shown, and the absence shouldn't read as a broken layout.
- Labels are authored to fit. If one would truncate, that's a bug to report rather than a string to cut — truncation makes the assistant look careless.

---

## 6. Working and failure states

- Every request shows something is happening. Nothing ever hangs silently.
- **An honest miss is content, not an error state.** When the service says it couldn't find something, that's a normal response and should be presented as the assistant talking, not as a failure screen.
- An empty result set should never render as an empty rail. The service always sends a reason; show it.
- Failures offer a way forward — retry, or rephrase.

---

## 7. Scope indicator

When the assistant is open from Saves, the user should be able to see that their question will search their saves, and change it.

An earlier prototype used a small removable “Saves” chip next to the input. The current demo preserves Saves scope internally but does not show the chip. That is a known presentation gap, not a change to the requirement. The final design can use a chip or another treatment, but scope must be understandable and adjustable without requiring special phrasing.

---

## 8. Carrying context through navigation

A temporary navigation step must not reset the conversation. Dismissing and reopening the assistant, opening a recipe result, and returning from that recipe all preserve the same feed, active constraints, and position.

The production goal is also to let a conversation continue across top-level surfaces, so a user does not repeat themselves when moving from Home to Saves. The deliberate interaction for carrying a chat into another surface is still open. The current demo instead mounts separate section-scoped chats and must not be treated as the production decision. See `Assistant Conversation and Interaction Behavior.md`, §14.

---

## 9. Open

1. Is the ingredient-refinement prompt always shown after dinner results, or only when the inferred makability signal is weak?
2. Does the interpretation statement ("Looking for crowd-friendly snacks kids will eat") get its own treatment, or sit as ordinary text above the results?
3. What's the character ceiling on a suggestion label? The service needs the number to author the pool against.
4. What happens to the conversation when the app is backgrounded and returns?
5. What explicit action carries an active conversation into a different top-level surface?
6. How long is chat history retained, where is it synced, and how does the user delete it?
7. Is there an empty state for the assistant on Saves when someone has no saves at all?
