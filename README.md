## AI Detective Academy — Implementation Plan & Tracker

This README is the single source of truth for completing the full UX, learning-design, and gamification upgrade outlined across the audit documents in `/audit`. It unifies goals, scope, phases, owners, and acceptance criteria so we can ship in an organized, testable sequence.

### Live Links (current)
- Landing: https://unnamedmistress.github.io/AiLiteracyBiases/
- Lesson 2 (legacy): https://unnamedmistress.github.io/AiLiteracyBiases/game.html
- Lesson 3: https://unnamedmistress.github.io/AiLiteracyBiases/lesson3/l3-p1-learn-intro.html
- Lesson 4: https://unnamedmistress.github.io/AiLiteracyBiases/lesson4/l4-p1-learn-intro.html
- Lesson 5: https://unnamedmistress.github.io/AiLiteracyBiases/lesson5/l5-p1-learn-intro.html
- Lesson 6: https://unnamedmistress.github.io/AiLiteracyBiases/lesson6-capstone.html

---

## Objectives (from audit)
- Fix 25 UX issues (critical → low) including game state persistence, reset confirmation, XP feedback, answer feedback, titles, progress bars, unlock criteria, time estimates, hover/active states, ARIA labels, wording fixes, nav active state, and breadcrumb links.
- Add working XP event bus + toast and consistent progress tracking.
- Add chat API endpoint and in-browser chatboxes for all interactive activities (Lessons 1–5); remove reliance on external tools for grading.
- Break Lessons 2–5 into microlearning flows with retrieval quizzes and visual progress indicators; preserve all original content while reorganizing.
- Deliver visual polish per `UI & Visual Design Improvements.md` (colors, typography, spacing, hover states, card hierarchy, XP/badge animations).

## Phase Plan (execution order)
1) **Stabilize Core UX (Week 1)**
	- Ship all Priority 1–2 fixes from the 25-item list (state init, reset confirm, XP toast, correct/incorrect, titles, progress bars, unlock hints, time estimates, hover/focus, toggle active, breadcrumb Home links, ARIA labels, lock messaging, wording fixes, prev/next nav, nav active state).
2) **Shared Infrastructure**
	- Build `/api/chat` serverless endpoint; implement XP global state + `xpUpdated` event + toast in `shared.js/nav.js`.
3) **Lesson 1 Upgrades**
	- Drag-drop Prompt A/B, live tone dial chatbox, live voice mimic chatbox with XP gating; add retrieval mini-quizzes and visual progress bar/dots.
4) **Lesson 2 Microlearning Split**
	- Create 11+ pages (learn/apply cycles for 32 pathologies + F.A.C.T.S. + disasters + summary) with chatbox-graded scenarios, progress bar, prev/next.
5) **Lessons 3–5 In-App Conversion**
	- L3: Image Prompt Analyzer chatbox + ethics quiz; split into 8 pages.
	- L4: Prompt Lab chatbox (CoT validator, role-play tester, few-shot builder); split into 10 pages.
	- L5: Workflow builder/conditional simulator/debugger chatbox; split into 9 pages.
6) **Learning Features**
	- “Quick Glance” flashcards (spaced repetition) on dashboard; retrieval quizzes on every learn page.
7) **Visual & Interaction Polish**
	- Apply color/spacing/type system, gradients, card hover, button states, XP bar animation, badge micro-animations, mode toggle active styling, lesson card hierarchy/icons/time estimates/unlock hints.

## Acceptance Criteria (high level)
- All 25 audit tasks pass their stated acceptance criteria.
- Every activity is completable in-browser with immediate feedback and XP toast; XP totals update globally.
- Every learn page ends with a retrieval quiz gating “Next”; every page shows visual progress + prev/next.
- Lessons 2–5 are micro-split with preserved content and chatbox grading; no required external tools for core flows.
- Navigation, lock states, and breadcrumbs are consistent and accessible; icon-only buttons have ARIA labels.
- Visual polish applied per the UI improvements checklist.

## File Map (working set)
- `/api/chat` (new) — serverless endpoint for chatboxes.
- `/scripts/shared.js`, `/scripts/nav.js`, `/scripts/progress.js` — XP state, events, nav active state, toasts.
- `/styles/shared.css`, `/styles/home.css` — hover/active, correct/incorrect, progress bars, card hierarchy.
- `/lesson1/*`, `/lesson2/*`, `/lesson3/*`, `/lesson4/*`, `/lesson5/*` — micro-pages, quizzes, chatboxes, prev/next, progress.
- `/data/flashcards.json` (new) — spaced repetition content.

## Tracking: 25-Item UX Fix List (snapshot)
- Critical (4): game state init, reset confirm, XP reward message, answer feedback.
- High (10): title consistency, token cost copy simplification, visual progress bars, unlock criteria text, display mode copy, time estimates, lesson card hierarchy, hover effects, prev/next nav, wording fixes (“in the wild” → “real-world AI examples”, “Pick a beat” → “Choose a Topic…”).
- Medium (6): toggle active state, nav status icons, breadcrumb Home link, redundant instructions removal, prompt A/B color coding, label icon-only buttons.
- Low (5): sentence-case progress text, lock state messaging, tooltip on restart, nav active highlighting per page, XP/active states polish.

## Working Agreement
- Preserve all original educational content; reorganize and enhance only.
- Land Phase 1 before new features to avoid compounding UX debt.
- Reuse Lesson 1 patterns for Lessons 2–5 to minimize duplication.

## Dev Notes
- Stack: HTML/CSS/JS, GitHub Pages. LocalStorage for state.
- Run locally: `npm install` then `npm start` (if a local server is configured) or open `landing.html` via `serve`.
- Deploy: GitHub Pages from `main`; ensure index redirects to `landing.html` (already in place).

## Next Actions
- Start Phase 1: implement reset confirm, fix game state init, XP toast/event bus wiring, correct/incorrect states, title/ARIA/hover/time/unlock/progress/nav fixes.
