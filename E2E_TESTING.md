# í·ª End-to-End Testing Guide

## Overview
This document provides a systematic approach to testing the complete AI Literacy course from start to finish.

---

## í¾¯ Test Scenario 1: New User Journey

### Step 1: Landing Page
**URL**: https://unnamedmistress.github.io/AiLiteracyBiases/

**Test Points**:
- [ ] Page loads successfully
- [ ] Two main cards visible (Game Mode + Learn Mode)
- [ ] Course overview section displays all 6 lessons
- [ ] All lesson links are clickable
- [ ] Design is responsive (test on mobile/tablet)
- [ ] Gradient background displays correctly

### Step 2: Start Game Mode (Lesson 2)
**Click**: "Start Playing" or "Lesson 2" link

**Test Points**:
- [ ] XP bar initializes at 0/200
- [ ] Level shows as 2
- [ ] Points show as 0
- [ ] Six scenario cards are visible
- [ ] Each scenario is clickable
- [ ] Clicking a scenario awards XP
- [ ] XP bar updates visually
- [ ] Notification appears on XP gain

### Step 3: Try Presentation Mode
**Click**: "í³š Presentation" button

**Test Points**:
- [ ] Game mode hides
- [ ] Presentation mode displays
- [ ] 32 pathologies are listed
- [ ] Disaster stories section visible
- [ ] F.A.C.T.S. framework section visible
- [ ] Can switch back to game mode

### Step 4: Navigate to Lesson 3
**Click**: Navigation breadcrumb "L3: Content"

**Test Points**:
- [ ] Lesson 3 loads successfully
- [ ] Mode toggle is visible
- [ ] AI tools showcase displays
- [ ] Ethics quiz is accessible
- [ ] Prompt builder textarea works
- [ ] Can submit prompt for analysis
- [ ] XP system functions
- [ ] Can navigate to other lessons

### Step 5: Explore Lesson 4 (Advanced Prompting)
**Click**: Navigation to "L4: Prompting"

**Test Points**:
- [ ] Purple gradient theme displays
- [ ] Three main challenges visible
- [ ] Prompt tournament arena works
- [ ] Can type in tournament textarea
- [ ] Submit button evaluates prompt
- [ ] Score displays with feedback
- [ ] XP awarded based on score
- [ ] Presentation mode shows techniques grid

### Step 6: Test Lesson 5 (Workflows)
**Click**: Navigation to "L5: Workflows"

**Test Points**:
- [ ] Green/blue gradient theme displays
- [ ] Three workflow challenges visible
- [ ] Interactive workflow builder canvas loads
- [ ] Workflow nodes are positioned correctly
- [ ] SVG connection lines render
- [ ] Learn mode shows workflow patterns
- [ ] Tool grid displays properly

### Step 7: Complete Capstone (Lesson 6)
**Click**: Navigation to "L6: Capstone"

**Test Points**:
- [ ] Purple gradient theme displays
- [ ] Overall progress bar starts at 0%
- [ ] Four deliverables visible
- [ ] Each deliverable has checklist
- [ ] Clicking checklist items toggles state
- [ ] Checkbox shows checkmark when completed
- [ ] Progress counters update (e.g., "2/4")
- [ ] Overall progress bar updates
- [ ] Submit button disabled initially
- [ ] Submit button enables when all complete
- [ ] Clicking submit shows certificate
- [ ] Certificate displays with 500 XP
- [ ] Page scrolls to certificate

---

## í´„ Test Scenario 2: Cross-Navigation

### Test All Navigation Links

**From Lesson 2**:
- [ ] Click "í¿  Home" â†’ Returns to index.html
- [ ] Click "L3: Content" â†’ Goes to lesson3-content-creation.html
- [ ] Click "L4: Prompting" â†’ Goes to lesson4-advanced-prompting.html

**From Lesson 3**:
- [ ] Click "í¿  Home" â†’ Returns to index.html
- [ ] Click "L2: Literacy" â†’ Goes to game.html
- [ ] Click "L4: Prompting" â†’ Goes to lesson4-advanced-prompting.html

**From Lesson 4**:
- [ ] Click "í¿  Home" â†’ Returns to index.html
- [ ] Click "L3: Content" â†’ Goes to lesson3-content-creation.html
- [ ] Click "L5: Workflows" â†’ Goes to lesson5-ai-workflows.html

**From Lesson 5**:
- [ ] Click "í¿  Home" â†’ Returns to index.html
- [ ] Click "L4: Prompting" â†’ Goes to lesson4-advanced-prompting.html
- [ ] Click "L6: Capstone" â†’ Goes to lesson6-capstone.html

**From Lesson 6**:
- [ ] Click "í¿  Home" â†’ Returns to index.html
- [ ] All previous lesson links work

---

## í³± Test Scenario 3: Responsive Design

### Desktop (> 1200px)
- [ ] Three-column layout displays
- [ ] Sidebar, main panel, and side panel visible
- [ ] All content fits properly
- [ ] No horizontal scrolling

### Tablet (768px - 1200px)
- [ ] Layout adjusts to single column
- [ ] Content remains readable
- [ ] Buttons stay clickable
- [ ] Images scale appropriately

### Mobile (< 768px)
- [ ] All text is legible
- [ ] Buttons are tap-friendly (min 44px)
- [ ] No content cut off
- [ ] XP bar visible and functional
- [ ] Navigation wraps correctly

---

## í¾® Test Scenario 4: Gamification Features

### XP System
- [ ] XP starts at 0
- [ ] Completing activities awards XP
- [ ] XP bar fills proportionally
- [ ] XP text updates (e.g., "50/200")
- [ ] Level indicator updates

### Points
- [ ] Points start at 0
- [ ] Points increase with XP
- [ ] Trophy emoji displays

### Notifications
- [ ] Appear on XP gain
- [ ] Auto-hide after 3 seconds
- [ ] Don't block content
- [ ] Show correct XP amount

### Progress Tracking
- [ ] Sidebar shows lesson completion status
- [ ] Completed lessons marked with âœ…
- [ ] Active lesson highlighted in gold
- [ ] Future lessons shown as incomplete

---

## í·© Test Scenario 5: Interactive Elements

### Lesson 2 (Game Mode)
- [ ] Scenario cards hover effect
- [ ] Clicking scenarios triggers alert
- [ ] Quiz questions selectable
- [ ] Correct/incorrect feedback works

### Lesson 3
- [ ] Mode toggle switches views
- [ ] Tool cards display information
- [ ] Ethics quiz radio buttons work
- [ ] Prompt builder analyzes input
- [ ] Score displays with components

### Lesson 4
- [ ] Challenge cards clickable
- [ ] Prompt tournament textarea editable
- [ ] Submit scoring works
- [ ] Feedback displays inline
- [ ] Presentation mode technique cards visible

### Lesson 5
- [ ] Workflow challenge cards clickable
- [ ] Canvas displays nodes
- [ ] SVG lines render between nodes
- [ ] Learn mode shows examples

### Lesson 6
- [ ] All checklist items toggle
- [ ] Progress bars update dynamically
- [ ] Submit button state changes
- [ ] Certificate animation plays

---

## í¼ Test Scenario 6: Browser Compatibility

### Chrome/Edge (Chromium)
- [ ] All features work
- [ ] CSS Grid displays correctly
- [ ] Animations smooth

### Firefox
- [ ] Layout identical
- [ ] No CSS bugs
- [ ] JavaScript functions

### Safari (macOS/iOS)
- [ ] Webkit prefix styles work
- [ ] Backdrop-filter renders
- [ ] Touch events responsive

### Mobile Browsers
- [ ] Touch interactions work
- [ ] Zoom functions properly
- [ ] No layout breaking

---

## âš¡ Test Scenario 7: Performance

### Load Times
- [ ] Landing page loads < 2 seconds
- [ ] Each lesson loads < 2 seconds
- [ ] No blocking JavaScript

### Animations
- [ ] Smooth 60fps animations
- [ ] No jank or stuttering
- [ ] Transitions don't cause reflow

### Interactions
- [ ] Button clicks respond immediately
- [ ] No input lag
- [ ] Smooth scrolling

---

## í°› Known Issues to Check

### Potential Issues
- [ ] Emoji rendering across browsers
- [ ] SVG line positioning in Lesson 5
- [ ] Certificate scroll behavior
- [ ] XP bar percentage calculation
- [ ] Mode toggle state persistence

### Edge Cases
- [ ] Completing all checklists in random order
- [ ] Rapidly clicking XP-awarding elements
- [ ] Navigating mid-activity
- [ ] Resizing window during interaction

---

## âœ… Acceptance Criteria

The course is ready for production if:

- âœ… All 6 lessons load and display correctly
- âœ… Navigation works bidirectionally
- âœ… Gamification systems function
- âœ… Both modes (game/learn) accessible
- âœ… Responsive on all screen sizes
- âœ… No console errors
- âœ… All interactive elements respond
- âœ… Certificate generation works
- âœ… Content is accurate and complete
- âœ… User can complete full journey

---

## í³Š Test Results Log

**Date**: ___________
**Tester**: ___________
**Browser**: ___________
**Device**: ___________

### Issues Found:
1. _______________________
2. _______________________
3. _______________________

### Severity:
- í´´ Critical (blocks completion)
- í¿¡ Major (degrades experience)
- í¿¢ Minor (cosmetic only)

### Status:
- [ ] All tests passed
- [ ] Issues documented
- [ ] Fixes required
- [ ] Ready for production

---

## íº€ Post-Deployment Verification

After each deployment:
- [ ] Check GitHub Pages build status
- [ ] Verify all URLs accessible
- [ ] Test from external network
- [ ] Confirm latest changes visible
- [ ] Test on mobile device
- [ ] Check browser console for errors

---

**Testing Completion Date**: ___________
**Tested By**: ___________
**Final Verdict**: ___________
