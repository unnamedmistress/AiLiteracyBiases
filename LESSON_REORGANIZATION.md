# Lesson Reorganization Documentation

## Overview

This reorganization transforms the AI Literacy course from long, scrollable single-page lessons into a micro-learning flow with sequential, focused pages. The new structure alternates between "Learn" and "Game/Apply" content to improve engagement and reduce cognitive load.

## Changes Implemented

### Lesson 1: Complete Reorganization (6 Pages)

The original `lesson1-ai-intro.html` (1,169 lines) has been split into 6 focused pages:

#### Page Structure

1. **l1-p1-learn-intro.html** - Introduction & Politeness Example
   - Hook: "Do you have to be polite to the AI?"
   - Prompt A/B comparison showing how "please" affects AI responses
   - Token cost reality callout
   - **Navigation:** → Next: Play the Prediction Game

2. **l1-p2-game-prediction.html** - Word Prediction Radar Game
   - Interactive game: Complete "Honesty is the best ___"
   - Probability visualization bars
   - Goal: Choose the correct word based on AI probability patterns
   - **Progress Tracking:** Enables next button upon completion
   - **Navigation:** → Next: Learn About AI Tone

3. **l1-p3-learn-tone.html** - Understanding Tone Control
   - "Pick a beat to expand" interactive pills (Pattern engine, Probability radar, Tone switches, Bias spotter)
   - "Tone dial sandbox" with 4 tone examples (Friendly, Urgent, Dramatic, Skeptical)
   - **Navigation:** → Next: Play the Voice Mimic Game

4. **l1-p4-game-voice.html** - Voice Mimic Chat Game
   - Goal: Try 3 different character voices
   - 9 character options (Mickey Mouse, Yoda, Shakespeare, etc.)
   - Progress tracking: "Voices tried: X/3"
   - **Progress Tracking:** Enables next button after 3 voices tried
   - **Navigation:** → Next: Play the Tone Lab Game

5. **l1-p5-game-tone.html** - Tone Lab Game
   - Interactive tone selection with 10 tone words
   - Click/drag/keyboard accessible tone selection
   - Real-time AI response preview showing how tone changes output
   - **Progress Tracking:** Tracks multiple tone uses
   - **Navigation:** → Next: Lesson 1 Summary

6. **l1-p6-summary.html** - Key Takeaways & Next Steps
   - 3 key takeaways cards
   - Completion badge (shown when all activities complete)
   - Next Mission: Link to Lesson 2
   - **Progress Tracking:** Marks lesson as complete
   - **Navigation:** → Finish Lesson 1 & Start Lesson 2

#### Benefits
- **Zero scrolling** within each page (or minimal)
- **Immediate feedback loop:** Learn → Apply → Learn → Apply
- **Clear progress indicators:** "Page X of 6"
- **Gamification:** Each game must be completed to proceed
- **Progress persistence:** Uses ProgressTracker to save state across pages

### Lesson 2: Partial Implementation (3 Pages - Pattern Demonstration)

The original `presentation.html` + `game.html` (3,908 lines combined) requires a similar Learn→Game pattern. Three example pages demonstrate the structure:

1. **l2-p1-learn-intro.html** - Introduction
   - Hero section: "AI's Bad Habits"
   - Learning journey agenda with 8 topics
   - **Navigation:** → Begin: Learn about Hallucinations

2. **l2-p2-learn-hallucinations.html** - Hallucination Pathologies
   - Category header with icon and description
   - 5 expandable pathology cards:
     - Fabrication
     - Confabulation
     - Synthetic Psychosis
     - Making Up Sources
     - Citation Invention
   - **Interactive:** Click cards to expand descriptions
   - **Navigation:** → Apply Your Knowledge: Play the Hallucination Case

3. **l2-p3-game-hallucinations.html** - Scenario Detective Game
   - Scenario: AI citing a fake research paper
   - 4 multiple choice options
   - Instant feedback with explanation
   - **Progress Tracking:** Enables next button after answering
   - **Navigation:** → Next: Learn About Confidence Pathologies

#### Full Lesson 2 Structure (Planned)

The complete implementation would follow this pattern:

```
l2-p1-learn-intro.html (Introduction)
l2-p2-learn-hallucinations.html → l2-p3-game-hallucinations.html
l2-p4-learn-confidence.html → l2-p5-game-confidence.html
l2-p6-learn-values.html → l2-p7-game-values.html
l2-p8-learn-memory.html → l2-p9-game-memory.html
l2-p10-learn-facts.html (F.A.C.T.S. Framework)
l2-p11-game-disasters.html (Real-World Disasters matching game)
l2-p12-summary.html (Key Takeaways & Quiz link)
```

Approximately 12 pages total, covering all 4 pathology categories + F.A.C.T.S. framework + disasters + summary.

## Technical Implementation

### Progress Tracking

Each page uses the `ProgressTracker` API to save and restore state:

```javascript
const tracker = window.ProgressTracker || null;
const LESSON_ID = 'lesson1'; // or 'lesson2'
const PAGE_ID = 'l1-p1'; // unique page identifier

// Save progress
tracker.setCheckpoint(LESSON_ID, PAGE_ID, true);
tracker.setCheckpoint(LESSON_ID, 'wordComplete', true);

// Load progress
const saved = tracker.getCheckpoints(LESSON_ID);
if (saved.wordComplete) {
    // Restore completed state
}
```

### Accessibility Features

- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **ARIA Labels:** Screen reader friendly with role="button", aria-label, aria-live
- **Focus Management:** Proper tabindex and focus states
- **Color Contrast:** Maintains WCAG AA standards

### Responsive Design

All pages include mobile-friendly breakpoints:
- Desktop: Full layouts, side-by-side grids
- Tablet (< 768px): Stacked layouts, adjusted font sizes
- Mobile (< 480px): Single column, compact spacing

## File Organization

```
/lesson1/
  l1-p1-learn-intro.html
  l1-p2-game-prediction.html
  l1-p3-learn-tone.html
  l1-p4-game-voice.html
  l1-p5-game-tone.html
  l1-p6-summary.html

/lesson2/
  l2-p1-learn-intro.html
  l2-p2-learn-hallucinations.html
  l2-p3-game-hallucinations.html
  [Additional pages to be created following the same pattern]

/styles/
  shared.css (shared across all pages)
  lesson-responsive.css (responsive utilities)

/scripts/
  shared.js (common utilities)
  progress.js (progress tracking)
  nav.js (navigation helpers)
```

## Original Files

Original files are preserved for reference:
- `lesson1-ai-intro.html` (original)
- `presentation.html` (Lesson 2 original learn content)
- `game.html` (Lesson 2 original game content)

## Next Steps for Complete Implementation

### Lesson 2 Remaining Work

1. **Create Confidence Pathologies Pages**
   - l2-p4-learn-confidence.html (Artificial Narcissism, Overconfidence, False Authority, Blind Spots)
   - l2-p5-game-confidence.html (Scenario focusing on overconfidence)

2. **Create Value & Alignment Pathologies Pages**
   - l2-p6-learn-values.html (Value Drift, Hypernormalization, Ethical Inconsistency, etc.)
   - l2-p7-game-values.html (Scenario focusing on value misalignment)

3. **Create Memory & Behavior Pathologies Pages**
   - l2-p8-learn-memory.html (Machine DID, Context Amnesia, etc.)
   - l2-p9-game-memory.html (Scenario focusing on memory issues)

4. **Create F.A.C.T.S. Framework Page**
   - l2-p10-learn-facts.html (Teach the full F.A.C.T.S. safety checklist)

5. **Create Disasters Game Page**
   - l2-p11-game-disasters.html (Match real-world AI disasters to pathology types)

6. **Create Summary Page**
   - l2-p12-summary.html (Key takeaways, link to Quiz 1)

### Integration Work

1. **Update index.html**
   - Change Lesson 1 link to point to `/lesson1/l1-p1-learn-intro.html`
   - Change Lesson 2 link to point to `/lesson2/l2-p1-learn-intro.html`

2. **Update Cross-References**
   - Update any internal links in other lessons that reference old structure
   - Update breadcrumb navigation
   - Update progress tracking integration

3. **Testing**
   - Test full navigation flow for both lessons
   - Verify progress persistence across page transitions
   - Test on mobile, tablet, and desktop
   - Verify all interactive elements work correctly
   - Test with screen readers for accessibility

## Benefits of This Approach

1. **Reduced Cognitive Load:** Each page focuses on 1-2 concepts instead of 32
2. **Improved Engagement:** Active learning through immediate application
3. **Better Retention:** Learn → Apply loop reinforces concepts
4. **Clear Progress:** Visual indicators show advancement
5. **Mobile Friendly:** Each page is optimized for small screens
6. **Accessibility:** Keyboard navigation and screen reader support throughout
7. **Gamification:** Completion requirements create motivation
8. **Lower Friction:** No overwhelming walls of text

## Design Principles Applied

1. **Micro-learning:** Bite-sized content chunks
2. **Progressive disclosure:** Information revealed as needed
3. **Active learning:** Hands-on practice follows theory
4. **Immediate feedback:** Game responses confirm understanding
5. **Clear wayfinding:** Progress indicators and navigation always visible
6. **Consistent patterns:** Similar structure across all pages
7. **Accessibility first:** WCAG AA compliance throughout
