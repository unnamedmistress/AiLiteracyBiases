# Lesson 2 Reorganization Plan: Taming the 32 Pathologies

**Objective:** To deconstruct the two massive, multi-thousand-line files for Lesson 2 (`presentation.html` and `game.html`) into a logical, sequential micro-learning path. This will break down the overwhelming amount of content into manageable chunks, alternating between learning a concept and applying it in a game.

---

## 1. Current State Analysis

- **Files:** `presentation.html` (Learn Mode), `game.html` (Game Mode)
- **Total Size:** A staggering **3,908 lines** of code combined.
- **Structure:** Two separate, monolithic files. The user is expected to read through a nearly 2,000-line "presentation" and then switch to a separate 2,000-line "game" file.
- **Problem:** This is the definition of cognitive overload. The 32 AI pathologies are introduced all at once, making them impossible to remember. The connection between the learned theory in `presentation.html` and the practical scenarios in `game.html` is completely severed by the file separation and sheer volume of content.

## 2. Proposed New Structure: A Multi-Part "Learn & Apply" Flow

Lesson 2 will be broken into a series of smaller, focused pages. The core strategy is to introduce a small group of related AI pathologies, then immediately have the user play a game scenario that tests their ability to spot those specific failures.

| Part | New Filename                       | Page Title                          | Content Focus                                                               | User Experience Goal                                                    |
| :--- | :--------------------------------- | :---------------------------------- | :-------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| 1    | `l2-p1-learn-intro.html`           | Lesson 2: AI's Bad Habits         | Introduction, "Your Learning Journey" agenda.                               | Set expectations and provide a roadmap for the lesson.                  |
| 2    | `l2-p2-learn-hallucinations.html`  | Learn: Hallucination Pathologies  | Teach the first category of pathologies (Fabrication, Confabulation, etc.). | Introduce a small, digestible chunk of theory.                          |
| 3    | `l2-p3-game-hallucinations.html`   | Game: Scenario Detective (Case 1) | A game scenario from `game.html` focused on spotting hallucinations.        | Immediately apply the learned theory in a practical, low-stakes game.   |
| 4    | `l2-p4-learn-bias.html`            | Learn: Bias Pathologies           | Teach the second category of pathologies (Stereotyping, etc.).              | Introduce the next chunk of theory.                                     |
| 5    | `l2-p5-game-bias.html`             | Game: Scenario Detective (Case 2) | A game scenario focused on spotting bias.                                   | Reinforce the new concepts through another interactive challenge.       |
| ...  | *(...continue for all pathology categories...)* | ...                               | ...                                                                         | Repeat the "Learn -> Apply" loop for all pathology groups.            |
| 9    | `l2-p9-learn-facts.html`           | Learn: The F.A.C.T.S. Framework   | Teach the full F.A.C.T.S. safety checklist.                                 | Provide a master framework for evaluating all AI output.                |
| 10   | `l2-p10-game-disasters.html`       | Game: Real-World Disasters        | The "Real-World AI Disasters" matching game.                                | Test the user's knowledge of all pathologies in a final challenge.      |
| 11   | `l2-p11-summary.html`              | Lesson 2: Summary & Next Steps    | Key takeaways and link to Quiz 1 / Lesson 3.                                | Consolidate all learning and guide the user to the next course milestone. |

---

## 3. Detailed Page-by-Page Content Plan

This plan maps content from `presentation.html` (Learn) and `game.html` (Game) to the new, smaller pages.

### **Part 1: `l2-p1-learn-intro.html`**

*   **Content to Move (from `presentation.html`):**
    *   The "Hero" slide (lines 1066-1074) with the title "AI's Bad Habits".
    *   The "Your Learning Journey" agenda grid (lines 1077-1112).
*   **Navigation:**
    *   A single CTA button: `[ Begin: Learn about Hallucinations → ]` linking to `l2-p2-learn-hallucinations.html`.

### **Part 2: `l2-p2-learn-hallucinations.html`**

*   **Content to Move (from `presentation.html`):**
    *   The "Hallucination Pathologies" section (lines 1120-1150+), including the expandable cards for Fabrication, Confabulation, etc.
*   **Navigation:**
    *   A single CTA button: `[ Apply Your Knowledge: Play the Hallucination Case → ]` linking to `l2-p3-game-hallucinations.html`.

### **Part 3: `l2-p3-game-hallucinations.html`**

*   **Content to Move (from `game.html`):**
    *   Select one or two scenarios from the `scenarios` array in the JavaScript that specifically demonstrate fabrication or confabulation.
    *   Isolate this single scenario on its own page.
*   **Navigation:**
    *   Upon correct completion, a CTA button appears: `[ Next: Learn about Bias Pathologies → ]` linking to `l2-p4-learn-bias.html`.

### **Parts 4-8: Repeat the Cycle**

This "Learn -> Apply" cycle should be repeated for the remaining pathology categories found in `presentation.html`:

*   **Bias Pathologies** (Learn) -> Relevant Scenario (Game)
*   **Amnesia Pathologies** (Learn) -> Relevant Scenario (Game)
*   **Overconfidence Pathologies** (Learn) -> Relevant Scenario (Game)
*   ...and so on for all 8 categories.

### **Part 9: `l2-p9-learn-facts.html`**

*   **Content to Move (from `presentation.html`):**
    *   The section dedicated to explaining the **F.A.C.T.S. Framework**.
*   **Navigation:**
    *   A CTA button: `[ Final Challenge: Real-World Disasters → ]` linking to `l2-p10-game-disasters.html`.

### **Part 10: `l2-p10-game-disasters.html`**

*   **Content to Move (from `game.html`):**
    *   The "Real-World AI Disasters" section, which can be framed as a matching game (match the news headline to the pathology type).
*   **Navigation:**
    *   Upon completion, a CTA button appears: `[ Finish: View Lesson 2 Summary → ]` linking to `l2-p11-summary.html`.

### **Part 11: `l2-p11-summary.html`**

*   **Content to Move (from `presentation.html`):**
    *   The "Key Takeaways" slide.
*   **Navigation:**
    *   A final CTA: `[ Complete Lesson 2 & Proceed to Quiz 1 → ]`.

---

## 4. Implementation & Benefits

*   **Technical Lift:** Medium. This requires more careful separation of content and logic than Lesson 1. The JavaScript in `game.html` that manages scenarios will need to be adapted to load individual scenarios on separate pages.
*   **User Benefit:** Transformative. This is the single most impactful change to improve learning and reduce user frustration. It turns an intimidating wall of text into a guided, interactive, and rewarding experience.
*   **Mastery & Retention:** By learning a concept and immediately applying it, users are far more likely to understand and retain the information. The 32 pathologies become memorable because they are tied to specific, hands-on experiences. 
-on experiences.
