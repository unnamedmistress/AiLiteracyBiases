# QA Plan Execution · December 1, 2025

This document captures how the previously proposed six-step audit plan was implemented, what to verify manually, and where issues remain. Use it as the canonical checklist before the final polish sprint.

## 1. Global Navigation Injection
- **What to test**: Load every HTML file (home, landing, glossary, updates, all lessons, game, certificate) and confirm `scripts/nav.js` injects the fixed nav, applies the active state, and avoids duplicate local nav markup.
- **Verification**: All public pages now import `scripts/nav.js`; redundant `<nav>` markup has been removed. `styles/shared.css` adds the `with-global-nav` body padding plus pill styling for the lesson links.
- **Outstanding**: Landing/glossary/updates still carry unused `.primary-nav` CSS blocks; remove when inline styles move to external CSS.

## 2. Dashboard + Progress Overview (`index.html`)
- **What to test**: After clearing `localStorage`, load `index.html` and ensure `scripts/home.js` renders cards, locks later lessons, updates the XP/lesson counters, and that hero CTAs jump to the next unlocked item or scroll the modules list.
- **Verification**: `home.js` pulls from `window.AppProgress` → renders `DASHBOARD_ITEMS`, enforces `requires`, updates progress meter text, and handles hero buttons. `ProgressTracker` overview drives the stats widgets.
- **Outstanding**:
  - `quiz1.html` is still missing, so the quiz slot will always be “Locked”/“Pending”.
  - Lessons 2–6 never mark completion via `AppProgress`, so the dashboard can only reflect Lesson 1 activity.

## 3. Lesson 1 Warm‑Up Integration
- **What to test**: Complete the three mini-games, reload the page, and verify XP totals, checkpoint persistence, and dashboard stats all update. Use `AppProgress.reset()` to simulate new learners.
- **Verification**: Lesson 1 reads/writes checkpoints + XP via `ProgressTracker`, updates the global pill, and exposes CTA buttons that link back to the dashboard.
- **Outstanding**: There is no automatic `markLessonComplete` call tied to finishing all three activities; add once completion criteria is finalized.

## 4. Lessons 2–6 & Game Mode
- **What to test**: For each lesson/panel pair:
  1. Toggle Learn/Game modes via `scripts/shared.js` helper.
  2. Exercise every interactive widget (sliders, quizzes, workflow canvas, capstone checklist).
  3. Confirm navigation footer uses shared buttons (Prev/Main/Next) and matches the nav active state.
- **Verification**: Mode toggle + footer nav come from `shared.js`. Lesson content still relies on inline scripts/styles.
- **Outstanding**:
  - None of these pages read/write `ProgressTracker`, so the dashboard never registers their completion.
  - Several widgets (Lesson 5 canvas, Lesson 6 certificate unlock) reinitialize on refresh, creating inconsistent UX against the new persistent dashboard.

## 5. Capstone & Certificate Flow
- **What to test**: Run through `lesson6-capstone.html`, complete the checklist, trigger certificate generation (`certificate.html`), and ensure share/print controls work.
- **Verification**: Capstone page already includes checklist logic; certificate page is stand-alone.
- **Outstanding**: Certificate unlock does not set any progress state, and there is no back-link to resume the dashboard. Needs tighter integration with `AppProgress`.

## 6. Cross-Cutting Polish & Regression Suite
- **Responsive**: QA on <768 px, 768–1200 px, and >1200 px to verify new nav padding does not hide content. Cards and XP bars still use fixed widths; log any wrapping issues.
- **Performance**: Ensure loading `shared.css`, `home.css`, `nav.js`, and `progress.js` does not block render. Inline CSS on landing/glossary/updates is still heavy and should move to the shared bundle.
- **Accessibility**: Lesson cards use `<button>` elements but lack focus styling; many interactive divs elsewhere remain missing ARIA labels. Record findings per WCAG checklist.
- **Data Reset**: Document the `localStorage` key (`aiLiteracyProgress_v1`) and the `AppProgress.reset()` helper so QA can reset between runs.

---
**Next Actions**
1. Hook Lessons 2–6 (and future quizzes) into `AppProgress` to unlock accurate dashboard stats.
2. Build `quiz1.html` or temporarily hide the quiz slot so the guided path is achievable.
3. Externalize inline CSS/JS that still lives inside landing/glossary/updates/lesson pages, reducing drift and improving maintainability.
