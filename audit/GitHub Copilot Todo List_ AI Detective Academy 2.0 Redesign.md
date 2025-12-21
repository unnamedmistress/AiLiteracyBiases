# GitHub Copilot Todo List: AI Detective Academy 2.0 Redesign

This document outlines a comprehensive, phased implementation plan to transform the AI Detective Academy into a world-class learning experience. Each task is designed to be actionable by a developer using GitHub Copilot.

---

## Phase 1: Core Infrastructure & API Setup (Critical Path)

**Goal:** Establish the backend and foundational code for all new interactive features.

### Task C-01: Set Up Chat API Endpoint
- **Priority:** 🔴 Critical
- **File(s):** Create `/api/chat.js` (or similar serverless function)
- **Problem:** The app has no backend to process chat requests.
- **Solution:**
  1. Create a new serverless function that accepts a `prompt` and `system_prompt` from the client.
  2. Use the `openai` npm package to call a chat model (e.g., `gpt-4.1-mini`).
  3. Implement robust error handling for API timeouts, rate limits, and content filtering.
  4. Return the AI-generated response as a JSON object.
  5. Secure the endpoint with an API key stored in environment variables.
- **Acceptance Criteria:** A `POST` request to `/api/chat` with a prompt returns a valid AI response.

### Task C-02: Implement Global State Management for XP
- **Priority:** 🔴 Critical
- **File(s):** `/scripts/progress.js`, `/scripts/shared.js`
- **Problem:** XP is not consistently tracked or displayed across the app.
- **Solution:**
  1. Create a global `updateXP(points)` function in `shared.js`.
  2. This function should:
     a. Read the current XP from `localStorage`.
     b. Add the new `points`.
     c. Write the new total back to `localStorage`.
     d. Trigger a custom event (e.g., `xpUpdated`) on the `document`.
  3. Create a `showXPNotification(points)` function that displays a temporary toast/notification (e.g., "🎉 +25 XP").
  4. Add an event listener in `nav.js` or `shared.js` that listens for `xpUpdated` and calls `showXPNotification`.
- **Acceptance Criteria:** Calling `updateXP(25)` from any page correctly updates `localStorage` and shows a "+25 XP" notification.

---

## Phase 2: Lesson 1 Interactivity Upgrade

**Goal:** Convert static examples in Lesson 1 into fully interactive components.

### Task L1-01: Create Interactive Prompt A/B Drag-and-Drop
- **Priority:** 🟡 High
- **File(s):** `/lesson1/l1-p1-learn-intro.html`
- **Problem:** The "politeness" example is a static text comparison.
- **Solution:**
  1. Create a draggable `<span>` element for the word "please".
  2. Create a drop zone within the Prompt B text area.
  3. When "please" is dropped, use JavaScript to:
     a. Update the text of Prompt B.
     b. Animate the change in the "Top token confidence" percentages to match the example.
     c. Highlight the new words in the model reply (e.g., "so sorry", "hug").
- **Acceptance Criteria:** Dragging "please" into the prompt box visually updates the AI response and token confidence stats.

### Task L1-02: Implement Live Tone Dial Chatbox
- **Priority:** 🟡 High
- **File(s):** `/lesson1/l1-p3-learn-tone.html`
- **Problem:** The tone dial shows static examples.
- **Solution:**
  1. Add a `<textarea>` for user input and a `<div id="ai-response">` for the output.
  2. When a user types in the textarea and clicks a tone button (e.g., "Formal"), call the `/api/chat` endpoint.
  3. The `system_prompt` should be: `You are a helpful assistant. Rewrite the user's text in a [TONE] tone.` where `[TONE]` is the selected tone.
  4. Display the AI response in the `ai-response` div.
- **Acceptance Criteria:** User can type a sentence, click "Urgent", and see the sentence rewritten in an urgent tone.

### Task L1-03: Implement Live Voice Mimic Chatbox
- **Priority:** 🟡 High
- **File(s):** `/lesson1/l1-p4-game-voice.html`
- **Problem:** The voice mimic game is not interactive.
- **Solution:**
  1. Connect the character dropdown and "Send" button to the `/api/chat` endpoint.
  2. The `system_prompt` should be: `You are a helpful assistant. Rewrite the user's text in the voice and style of [CHARACTER].`
  3. Add a client-side check to ensure the user has successfully generated responses for at least 3 different characters before enabling the "Next" button.
  4. After each successful generation, call `updateXP(15)`.
- **Acceptance Criteria:** User can select "Pirate", type "Hello", and get a response like "Ahoy there, matey!"

---

## Phase 3: Lesson 2 Microlearning Decomposition

**Goal:** Break the massive `presentation.html` and `game.html` files into a sequential, 11+ page micro-learning experience.

### Task L2-01: Create Lesson 2 Page Structure
- **Priority:** 🟡 High
- **File(s):** Create new folder `/lesson2/` with `l2-p1-intro.html`, `l2-p2-learn-hallucination.html`, `l2-p3-game-hallucination.html`, etc.
- **Problem:** Lesson 2 is a single, long page.
- **Solution:**
  1. Create 11+ new HTML files based on the redesign plan.
  2. Copy the shared header/footer/nav structure into each file.
  3. Implement "Previous" and "Next" buttons for linear navigation.
- **Acceptance Criteria:** A folder `/lesson2/` exists with 11+ linked HTML pages.

### Task L2-02: Implement "Spot the Hallucination" Chatbox
- **Priority:** 🟡 High
- **File(s):** `/lesson2/l2-p3-game-hallucination.html`
- **Problem:** The scenario detective game is not interactive.
- **Solution:**
  1. Present a short scenario where an AI hallucinates (e.g., cites a fake legal case).
  2. Provide a chatbox where the user must explain what went wrong.
  3. Call the `/api/chat` endpoint with a `system_prompt`: `The user is trying to identify an AI pathology. The correct answer is "hallucination". Analyze the user's response. If they correctly identify the issue, respond with "CORRECT". Otherwise, respond with "INCORRECT".`
  4. If the API returns "CORRECT", call `updateXP(25)` and show a success message.
- **Acceptance Criteria:** User types "The AI made up a source", and the app responds with "Correct!" and awards XP.

### Task L2-03: Port All 32 Pathologies to Micro-Lesson Pages
- **Priority:** 🟢 Medium
- **File(s):** `/lesson2/*.html`
- **Problem:** All 32 pathologies are in one file.
- **Solution:**
  1. Group the pathologies into their 8 categories.
  2. Create a `learn` page for each category, explaining the 3-4 pathologies within it.
  3. Create a `game` page after each `learn` page with a chatbox scenario testing one of the pathologies from that group.
- **Acceptance Criteria:** All 32 pathologies are present in the new `/lesson2/` pages, each followed by an interactive exercise.

---

## Phase 4: Lessons 3-5 In-App Activity Conversion

**Goal:** Remove external dependencies by building in-app, chatbox-powered versions of all activities.

### Task L3-01: Build Image Prompt Analyzer Chatbox
- **Priority:** 🟡 High
- **File(s):** `/lesson3-content-creation.html`
- **Problem:** The image creation challenge requires an external tool (DALL-E 3).
- **Solution:**
  1. Replace the current activity with a "Prompt Builder" interface.
  2. User writes an image prompt in a `<textarea>`.
  3. On "Analyze", call `/api/chat` with a `system_prompt`: `Analyze the user's image prompt. Check for the presence of these components: Subject, Style, Mood, Lighting, Quality. Respond with a JSON object: {"score": X, "feedback": "[SUGGESTION]"}, where X is the number of components found.`
  4. Display the score and feedback to the user. Award XP if the score is 3 or higher.
- **Acceptance Criteria:** User writes a prompt, and the app scores it and provides suggestions for improvement.

### Task L4-01: Build Chain-of-Thought Validator Chatbox
- **Priority:** 🟡 High
- **File(s):** `/lesson4-advanced-prompting.html`
- **Problem:** The CoT challenge requires an external tool (ChatGPT).
- **Solution:**
  1. Present a logic puzzle (e.g., "If 3 apples cost $6, how much do 5 apples cost?").
  2. User must write a CoT prompt to solve it, showing the steps.
  3. Call `/api/chat` with a `system_prompt`: `The user is solving a logic puzzle using Chain-of-Thought. The final answer is $10. Check if the user's response shows logical steps (e.g., finding the cost of one apple first). If yes, respond with "CORRECT".`
  4. Award XP for a correct response.
- **Acceptance Criteria:** User shows their work to solve the puzzle and gets positive feedback.

### Task L5-01: Build Workflow Diagram Builder
- **Priority:** 🟢 Medium
- **File(s):** `/lesson5-ai-workflows.html`
- **Problem:** Workflow concepts are purely theoretical.
- **Solution:**
  1. Use a simple JS library (like `leader-line`) or pure CSS to create a drag-and-drop interface.
  2. Provide nodes like "Get Email", "Summarize with AI", "Save to Notion".
  3. User must drag and connect the nodes in the correct order for a sequential pipeline.
  4. Use JavaScript to validate the connections. If correct, call `updateXP(30)`.
- **Acceptance Criteria:** User can drag and connect three nodes in the correct order to complete the challenge.

---

## Phase 5: New Feature Implementation

**Goal:** Add evidence-based learning features to improve retention and engagement.

### Task F-01: Implement "Quick Glance" Flashcard System
- **Priority:** 🟢 Medium
- **File(s):** `/index.html` (or `/dashboard.html`), `/scripts/flashcards.js`
- **Problem:** No mechanism for spaced repetition.
- **Solution:**
  1. Create a JSON file (`/data/flashcards.json`) containing question/answer pairs for key concepts from all lessons.
  2. In `flashcards.js`, write a function to randomly select 5 flashcards from the user's completed lessons.
  3. Display these on the main dashboard. Clicking a card flips it to reveal the answer.
- **Acceptance Criteria:** The dashboard shows 5 random, clickable flashcards from completed lessons.

### Task F-02: Implement Retrieval Practice Quizzes
- **Priority:** 🟡 High
- **File(s):** Add to all `learn` pages (e.g., `/lesson1/l1-p1-learn-intro.html`)
- **Problem:** Learning is passive; no recall practice.
- **Solution:**
  1. At the end of every `learn` page, add a 2-question multiple-choice quiz.
  2. The questions should test the core concept just explained.
  3. Provide immediate correct/incorrect feedback.
  4. The "Next" button should only be enabled after the user answers both questions correctly (they can retry).
- **Acceptance Criteria:** Every `learn` page has a short, mandatory quiz at the end.

---

## Phase 6: Universal Polish & Bug Fixes (10+ items)

- **Task P-01:** Fix `localStorage` initialization bug.
- **Task P-02:** Add confirmation dialog to "Reset Progress" button.
- **Task P-03:** Standardize all page titles (browser tab, breadcrumb, H1).
- **Task P-04:** Add visual progress bars to all lesson pages.
- **Task P-05:** Add time estimates to all lesson cards on the dashboard.
- **Task P-06:** Add hover effects to all interactive elements.
- **Task P-07:** Ensure "Home" breadcrumb is always clickable.
- **Task P-08:** Add ARIA labels to all icon-only buttons.
- **Task P-09:** Replace jargon like "in the wild" with clearer language.
- **Task P-10:** Add a "Previous" button to all lesson pages for two-way navigation.
- **Task P-11:** Add tooltips explaining what each badge represents.
- **Task P-12:** Implement a search bar for the Glossary page.
