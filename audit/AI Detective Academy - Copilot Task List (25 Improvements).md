# AI Detective Academy - Copilot Task List (25 Improvements)

This document outlines 25 specific, actionable tasks to improve the UX, learning value, and visual polish of the AI Detective Academy. Each item is designed to be implemented by GitHub Copilot.

---

## 🔴 Priority 1: Critical Bugs & UX Blockers

These issues break the core user experience and must be fixed first.

### 1. Fix Game State Persistence Bug
- **File(s):** `lesson1/l1-p2-game-prediction.html` (and all other game pages)
- **Problem:** The game shows "COMPLETE" on first page load, preventing new users from playing.
- **Task:** Modify the JavaScript to only load game state from `localStorage` if it exists. If not, initialize a fresh game state. The game should only be marked complete *after* the user successfully finishes the activity.
- **Acceptance Criteria:** Opening a game page in a fresh browser session (or after clearing `localStorage`) shows the game in its initial, unplayed state.

### 2. Add Confirmation to Reset Progress Button
- **File(s):** `index.html`
- **Problem:** The "Reset Progress" button can be clicked accidentally, causing irreversible data loss without warning.
- **Task:** Add a `window.confirm()` dialog to the button's `onclick` event. The dialog should say: "Are you sure you want to reset all your progress? This action cannot be undone."
- **Acceptance Criteria:** Clicking the "Reset Progress" button triggers a confirmation popup. Progress is only reset if the user clicks "OK".

### 3. Show XP Reward & Feedback After Games
- **File(s):** All game pages (e.g., `lesson1/l1-p2-game-prediction.html`)
- **Problem:** Completing a game provides no feedback on XP earned, breaking the gamification loop.
- **Task:** After a game is successfully completed, display a prominent success message. This message should include the XP earned (e.g., "🎉 +10 XP Earned!") and update the total XP visible to the user.
- **Acceptance Criteria:** Finishing a game shows an XP reward notification. The user's total XP score updates correctly.

### 4. Add Correct/Incorrect Answer Feedback
- **File(s):** All game pages.
- **Problem:** Users don’t get clear visual feedback on whether their answer was correct or incorrect.
- **Task:** When a user selects an answer, apply a class to the selected button. Use `.correct` (green border/check) for the right answer and `.incorrect` (red border/X) for wrong answers. Show the explanation text *after* the selection.
- **Acceptance Criteria:** Clicking the correct answer turns it green. Clicking a wrong answer turns it red and highlights the correct answer in green.

---

## 🟡 Priority 2: High-Impact UX & Learning Improvements

These changes significantly improve usability and educational value.

### 5. Standardize All Page Titles
- **File(s):** All HTML files in `/lesson1/` and `/lesson2/`.
- **Problem:** A single page has three different titles (browser tab, breadcrumb, H1), causing confusion.
- **Task:** Choose one clear, consistent title for each page and apply it to the `<title>` tag, the breadcrumb, and the main `<h1>` heading. For example, for `l1-p1-learn-intro.html`, use "Lesson 1: Understanding AI Personalities" for all three.
- **Acceptance Criteria:** Every page in the course has consistent titles across the tab, breadcrumb, and H1.

### 6. Simplify the "Token Cost" Explanation
- **File(s):** `lesson1/l1-p1-learn-intro.html`
- **Problem:** The explanation of token pricing is too technical for a beginner audience.
- **Task:** Replace the detailed cost breakdown with a simpler, more engaging fun fact. Change the text to: "**Fun Fact:** Being polite to AI isn't free! At a massive scale, those extra words can add up to real-world server costs for companies."
- **Acceptance Criteria:** The complex pricing details are gone and replaced with the simplified fun fact.

### 7. Add a Visual Progress Bar to Lessons
- **File(s):** All HTML files in `/lesson1/` and `/lesson2/`.
- **Problem:** The "Page X of Y" text is easy to miss. A visual indicator is needed.
- **Task:** At the top of each lesson page (near the breadcrumb), add a visual progress bar. It can be a series of dots or a thin bar that fills up. For "Page 2 of 6", two out of six dots should be filled.
- **Acceptance Criteria:** Every lesson page displays a clear visual indicator of the user's progress through that specific lesson.

### 8. Add Unlock Criteria to Locked Lessons
- **File(s):** `index.html`
- **Problem:** Users don't know how to unlock the next lesson.
- **Task:** Below the title of each locked lesson card, add a small text label explaining the requirement. For Lesson 2, it should say: "Complete Lesson 1 to unlock". For Lesson 3, it should say: "Score 75% on Quiz 1 to unlock".
- **Acceptance Criteria:** Every locked lesson card clearly states its unlock condition.

### 9. Clarify Display Mode Functionality
- **File(s):** `index.html`
- **Problem:** The explanation for Display Mode only describes "Learner Mode".
- **Task:** Update the text to explain both modes. Suggested text: "Switch between **Learner Mode** (shows all gamification elements) and **Professional Mode** (provides a cleaner, content-focused view)."
- **Acceptance Criteria:** The Display Mode section clearly explains the purpose of both Learner and Professional modes.

### 10. Add Time Estimates to Lessons
- **File(s):** `index.html`
- **Problem:** Users cannot plan their learning without knowing how long each lesson takes.
- **Task:** On each lesson card, add a small icon and text with an estimated completion time (e.g., "⏱️ 10 min").
- **Acceptance Criteria:** Every lesson card on the homepage displays an estimated time to complete.

---

## 🟢 Priority 3: Medium-Impact Polish & Gamification

These items improve the overall look, feel, and motivational aspects of the app.

### 11. Improve Lesson Card Visual Hierarchy
- **File(s):** `index.html`
- **Problem:** All lesson cards look the same, making it hard to scan.
- **Task:** Add small, distinct icons to each lesson card that represent the topic (e.g., a brain for Literacy, a pen for Content Creation). Add a subtle background gradient or border color to differentiate them.
- **Acceptance Criteria:** Lesson cards are visually distinct and easier to tell apart at a glance.

### 12. Add Hover Effects to Interactive Elements
- **File(s):** `styles/shared.css`
- **Problem:** Elements like the "Pick a beat" pills don't indicate they are clickable.
- **Task:** Add a CSS `:hover` effect to all clickable elements that don't already have one. A subtle `transform: translateY(-2px);` or a change in `border-color` is sufficient.
- **Acceptance Criteria:** Hovering over the pills, tone dial buttons, and other interactive elements produces a visual effect.

### 13. Add "Back" Button for Consistent Navigation
- **File(s):** All lesson pages.
- **Problem:** Users can only navigate forward, which is frustrating if they want to review.
- **Task:** On all lesson pages (except the very first), add a "← Previous" button next to the "Next →" button. It should be disabled on page 1 of each lesson.
- **Acceptance Criteria:** All lesson pages have both a Previous and Next button, allowing for two-way navigation.

### 14. Make Lesson Progress Icons
- **File(s):** `index.html` (navigation menu)
- **Problem:** The icons for lesson status (🔄, 🔒) are not intuitive.
- **Task:** Replace the emojis with a consistent icon set: `✓` (check mark) for completed, `⏳` (hourglass) for in-progress, and `🔒` (lock) for locked.
- **Acceptance Criteria:** The navigation menu uses the new, clearer icon set for lesson statuses.

### 15. Clarify Wording: "in the wild"
- **File(s):** `index.html`
- **Problem:** The subtitle's phrase "in the wild" is jargon.
- **Task:** Change "spot hallucinations in the wild" to "spot hallucinations in real-world AI examples".
- **Acceptance Criteria:** The homepage subtitle uses the clearer, more descriptive phrase.

### 16. Clarify Wording: "Pick a beat"
- **File(s):** `lesson1/l1-p3-learn-tone.html`
- **Problem:** "Pick a beat to expand" is confusing slang.
- **Task:** Change the heading to "Choose a Topic to Explore".
- **Acceptance Criteria:** The confusing heading is replaced with the clearer version.

### 17. Improve Active State on Toggles
- **File(s):** `index.html`
- **Problem:** The Learner/Professional toggle buttons lack a clear active state.
- **Task:** Add a distinct visual style for the active button, such as a solid background color or a prominent border, to make it obvious which mode is selected.
- **Acceptance Criteria:** The currently selected display mode is clearly and visually indicated.

---

## 🔵 Priority 4: Low-Effort Quick Wins & Visual Polish

These are smaller tasks that add a layer of professionalism.

### 18. Use Sentence Case for Progress Message
- **File(s):** `lesson1/l1-p2-game-prediction.html`
- **Problem:** "WORD RADAR PROGRESS: COMPLETE! 🎉" uses aggressive all-caps.
- **Task:** Change the text to use sentence case: "Word radar progress: Complete! 🎉".
- **Acceptance Criteria:** The completion message is in sentence case.

### 19. Add Color Coding to Prompt A/B Comparison
- **File(s):** `lesson1/l1-p1-learn-intro.html`
- **Problem:** The two prompt examples look identical, making them hard to compare.
- **Task:** Add a subtle, colored `border-left` to each prompt block. For example, a blue border for Prompt A and a green border for Prompt B.
- **Acceptance Criteria:** The two prompt blocks are visually differentiated with color.

### 20. Remove Redundant Instructions
- **File(s):** `lesson1/l1-p2-game-prediction.html`
- **Problem:** The same instructions are repeated twice on the page.
- **Task:** Remove the second, redundant instance of the instruction text inside the main activity card.
- **Acceptance Criteria:** The game page contains only one set of instructions.

### 21. Add Labels to Icon-Only Buttons
- **File(s):** `index.html` (and others)
- **Problem:** The hamburger menu icon is unlabeled, which is an accessibility issue.
- **Task:** Add an `aria-label="Menu"` to the hamburger button. For visually hidden but screen-reader-accessible text, use a `<span>` with a class like `.sr-only`.
- **Acceptance Criteria:** All icon-only buttons have appropriate ARIA labels for screen readers.

### 22. Standardize Lock State Messaging
- **File(s):** `index.html`
- **Problem:** Locked lessons have inconsistent messaging ("Locked" vs. "Coming Soon").
- **Task:** Use `🔒 Locked` for lessons that can be unlocked and `🚧 Coming Soon` for lessons that are not yet released. Ensure this is consistent across the homepage and navigation menu.
- **Acceptance Criteria:** All locked and unreleased lessons have clear, consistent status indicators.

### 23. Make "Home" Breadcrumb Clickable
- **File(s):** All lesson pages.
- **Problem:** The "Home" link in the breadcrumb navigation is not always a clickable `<a>` tag.
- **Task:** Ensure the "Home" part of the breadcrumb on every sub-page is wrapped in an `<a>` tag pointing to `index.html`.
- **Acceptance Criteria:** Users can click "Home" in the breadcrumb from any lesson page to return to the homepage.

### 24. Add Tooltip to Restart Button
- **File(s):** `lesson1-ai-intro.html` (and other lesson pages with a restart button)
- **Problem:** The `↺` icon's purpose isn't immediately clear.
- **Task:** Add a `title="Restart Lesson"` attribute to the restart button to provide a tooltip on hover.
- **Acceptance Criteria:** Hovering over the restart button displays a helpful tooltip.

### 25. Add Current Page Indicator in Menu
- **File(s):** All pages.
- **Problem:** The "YOU'RE HERE" indicator only works for the Home link.
- **Task:** Implement logic to detect the current page URL and apply an `active` class to the corresponding link in the main navigation menu. The `.active` class should make the link visually distinct (e.g., background color, bold text).
- **Acceptance Criteria:** When on the Glossary page, the "Glossary" link in the navigation menu is highlighted. When on Lesson 1, the "Lesson 1" link is highlighted.
