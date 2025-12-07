# Lesson 1 Structure Analysis

## Current URL
https://ai-literacy-biases-n828.vercel.app/lesson1-ai-intro.html

## Learn Mode Content Structure

### Header Section
- Title: "Lesson 1: Prompt Wizardry Warm-Up ⚡️"
- Breadcrumb: Home / Lesson 1: Prompt Wizardry Warm-Up
- Progress indicators: XP 80/110, Lesson Progress: 2/3 activities, Total XP: 0 · 0/7 lessons
- Mode toggles: 🎮 Game Mode | 📚 Learn
- Restart button (↺)

### Main Content Sections (Learn Mode)

#### Section 1: Introduction
- **Title:** "Lesson 1 · Understanding AI Personalities"
- **Description:** "This is your fun, witty crash course in what AI actually is, why tone is the secret sauce, and how prediction math runs the whole show. Think science fair meets improv club."

#### Section 2: Interactive Example - "Do you have to be polite to the AI?"
- **Subheading:** "Toggle one word and track how probability weights, tone, and even cloud costs shift."
- **Content:**
  - Two-column comparison of Prompt A vs Prompt B
  - Prompt A: "Write a loving message to my spouse that I'll be late tonight."
  - Prompt B: Same + "please"
  - Shows model replies with token confidence percentages
  - Explanation of how "please" affects probability
  - **Token cost reality callout box** (yellow background) explaining compute costs

#### Section 3: "Pick a beat to expand"
- **Subheading:** "Tap each pill and get a guided breakdown of what to watch for."
- **Interactive pills (4 buttons):**
  1. Pattern engine
  2. Probability radar
  3. Tone switches
  4. Bias spotter
- **Expanded content when clicked:**
  - "AI = Predictive Pattern Engine" section with bullet points
  - Explains LLMs, token-by-token prediction, context narrowing

#### Section 4: "Tone dial sandbox"
- **Subheading:** "Click a tone to preview how a single adjective alters the vibe."
- **Interactive tone buttons (4 options):**
  1. Friendly
  2. Urgent
  3. Dramatic
  4. Skeptical
- **Example prompt shown:** "Hey team! I'm testing prompts today and want a cheerful 'camp counselor' vibe. Keep it upbeat, sprinkle emojis, and stay concise."
- **Hint text:** "stack tone word + audience + intent. Ex: 'Give me a confident note for anxious parents.'"

#### Section 5: "First-lesson energy" (Conclusion)
- Motivational text encouraging experimentation
- **CTA:** "Ready for hands-on practice? Switch to Game Mode with any button labeled 'Start mini-games.'"

#### Section 6: CTAs
- **Two buttons:**
  1. "Go to game warm-ups"
  2. "Review the curriculum map"

#### Section 7: Key Takeaways
- **3 numbered takeaways:**
  1. "LLMs remix probability" - explanation
  2. "Tone is a control knob" - explanation
  3. "Log the weird stuff" - explanation

#### Footer Navigation
- "Main Menu" link
- "Next: Lesson 2 →" link

---

## Scrolling Analysis

**Total scrollable height:** Approximately 1500-2000px (requires 2-3 full scrolls to see all content)

**Content density:** HIGH - lots of text, interactive elements, examples, and explanations all on one page

**Scroll points:**
1. Top: Header + Introduction + Interactive example (Prompt A/B)
2. Middle: Pills section + Tone dial sandbox
3. Bottom: Conclusion + CTAs + Key Takeaways + Navigation

---

## Issues with Current Structure

1. **Too much scrolling required** - Users must scroll 2-3 full pages to see all Learn mode content
2. **No clear progression** - All content is presented at once rather than step-by-step
3. **Interactive elements buried** - The tone dial and pills are in the middle, requiring scrolling to discover
4. **Redundant CTAs** - "Go to game warm-ups" appears both mid-page and at the end
5. **Mode confusion** - Learn mode shows all educational content, then users must switch to Game mode separately
6. **No natural break points** - Content flows continuously without clear stopping points

---

## Next: Need to check Game Mode structure


## Observation: Both URLs have identical Learn mode structure

The GitHub Pages site (https://unnamedmistress.github.io/AiLiteracyBiases/) and the Vercel site (https://ai-literacy-biases-n828.vercel.app/) have the same Lesson 1 Learn mode content.

**Key finding:** The current implementation does NOT have separate Game Mode activities visible. The "Game Mode" button exists but clicking it doesn't reveal separate interactive activities like the previous audit mentioned (Activity 1: Word Prediction, Activity 2: Voice Mimic, Activity 3: Tone Selection).

**Current behavior:**
- Learn mode shows all educational content
- Game Mode button exists but appears to show the same content (or the game activities are not implemented yet)
- The "Go to game warm-ups" button suggests games should exist but they're not visible

**This means:** I need to work with the CURRENT structure which is Learn-mode-only, and create a reorganization plan that assumes Game Mode will be developed separately.
