# Phase 2 Work Plan

A decomposed, trackable list of Phase 2 tasks to finish the remaining scope. Use this as the working checklist.

## 1) Lesson 2 Micro-Split (Learn + Apply)
- [ ] Create `/lesson2/` pages per the reorg plan (intro, 8 learn/apply pairs, F.A.C.T.S., disasters, summary). Target 11–12 pages.
- [ ] Move content from `presentation.html` into the new learn pages (group by pathology category).
- [ ] Move relevant scenarios from `game.html` into the matching game pages (hallucination, bias, etc.).
- [ ] Wire page metadata (`data-lesson-id`, `data-total-pages`, `data-page-number`), breadcrumb/footer nav, and progress bar.
- [ ] Ensure `data-next-lesson` on the final summary page points to `quiz1`.

## 2) Retrieval Practice Coverage
- [ ] Add 2–3 question “Quick check” blocks (with `data-answer`/`data-answer-group` and optional `data-xp`) to each Lesson 2 learn page.
- [ ] Add quick checks to remaining Lesson 3–5 learn pages (not just intro/summary) for consistent spacing.
- [ ] Verify XP awards trigger once per group via `shared.js` logic.

## 3) In-App Interactivity Upgrades (Lessons 3–5)
- [ ] Replace external-only tasks with in-page graded interactions (chatbox or structured inputs) where feasible.
- [ ] Hook completions to XP via `updateXP` and show rewards toasts.
- [ ] Ensure activities mark checkpoints/completions in `ProgressTracker` as needed.

## 4) QA + Polish
- [ ] Run through nav/footer on all lessons to confirm prev/next works with new page counts.
- [ ] Spot-check XP toasts on quizzes/games and new quick checks.
- [ ] Clean up any legacy inline nav/progress remnants on new Lesson 2 pages (we already hide `.progress-nav` / `.progress-indicator`).

## Notes
- Use the filename pattern `l2-pX-*.html` with monotonic page numbers.
- Keep each page’s hero, breadcrumb, footer nav, and `data-*` attributes intact for auto-nav and progress bar injection.
- For quick checks, default XP is 10 unless otherwise specified; set `data-xp` on the group/card to override.
- The existing answer-feedback + XP logic lives in `scripts/shared.js`.
