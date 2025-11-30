# End-to-End Testing Guide

## Testing Checklist

### Navigation Testing
- [ ] Landing page links to all lessons
- [ ] Each lesson has working navigation breadcrumbs
- [ ] All internal links function correctly
- [ ] External links open properly
- [ ] Mode toggle works on all lessons

### Functionality Testing
- [ ] Game mode XP system calculates correctly
- [ ] Mode toggle switches between game/learn
- [ ] Interactive elements respond to clicks
- [ ] Quizzes provide immediate feedback
- [ ] Progress bars update dynamically
- [ ] Checklists track completion (Lesson 6)
- [ ] Certificate displays on completion

### Responsive Testing
- [ ] Mobile view (< 768px) - all content accessible
- [ ] Tablet view (768px - 1200px) - proper layout
- [ ] Desktop view (> 1200px) - optimal spacing
- [ ] All text readable at different sizes
- [ ] No layout breaking or overflow issues

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium-based)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Manual Test Scenarios

### Scenario 1: Complete User Journey
1. Visit landing page
2. Click "Lesson 2: AI Literacy"
3. Complete one scenario in game mode
4. Toggle to learn mode
5. Navigate to Lesson 3
6. Complete the ethics quiz
7. Progress through Lessons 4, 5, 6
8. Complete capstone checklist
9. View certificate

### Scenario 2: Navigation Flow
1. Start at landing page
2. Visit each lesson in order
3. Use breadcrumb navigation to return
4. Test direct URL access to each lesson
5. Verify all links work

### Scenario 3: Mode Switching
1. Open any lesson (3, 4, 5, or 6)
2. Toggle between Game and Learn modes
3. Verify content changes appropriately
4. Ensure XP tracking persists in game mode
5. Check that learn mode shows all content

### Scenario 4: Interactive Elements
1. **Lesson 2**: Complete all 6 scenarios
2. **Lesson 3**: Test AI tool cards and ethics quiz
3. **Lesson 4**: Try all 3 prompting challenges
4. **Lesson 5**: Build a workflow using canvas
5. **Lesson 6**: Check all capstone items

---

## Performance Testing

### Page Load Times
- [ ] Landing page loads in < 2 seconds
- [ ] Lesson pages load in < 2 seconds
- [ ] No blocking JavaScript
- [ ] CSS loads efficiently

### Visual Rendering
- [ ] No layout shift on page load
- [ ] Images/icons render properly
- [ ] Gradients display correctly
- [ ] Animations are smooth (60fps)

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Screen Reader
- [ ] All images have alt text
- [ ] Headings are properly structured
- [ ] Links have descriptive text
- [ ] Form inputs have labels

### Color Contrast
- [ ] Text readable on gradient backgrounds
- [ ] Buttons have sufficient contrast
- [ ] Interactive elements visually distinct

---

## Bug Tracking Template

### Bug Report Format
- **Page/Lesson**: [Which page has the issue]
- **Browser**: [Chrome, Firefox, Safari, etc.]
- **Device**: [Desktop, Mobile, Tablet]
- **Steps to Reproduce**: [Detailed steps]
- **Expected Behavior**: [What should happen]
- **Actual Behavior**: [What actually happens]
- **Screenshot**: [If applicable]

---

## Test Results Documentation

### Test Run: [DATE]
- Tester: [NAME]
- Environment: [Production/Staging]
- Browser: [Version]
- Device: [Model]

#### Results
- [ ] All tests passed
- [ ] Issues found: [NUMBER]
- [ ] Critical bugs: [NUMBER]
- [ ] Minor bugs: [NUMBER]

#### Issues List
1. [Issue description]
2. [Issue description]

---

## Continuous Testing

### Before Each Deployment
- [ ] Run full navigation test
- [ ] Test interactive features
- [ ] Verify responsive layouts
- [ ] Check cross-browser compatibility

### After Deployment
- [ ] Wait 2 minutes for GitHub Pages update
- [ ] Clear browser cache
- [ ] Test all critical user paths
- [ ] Verify content updates deployed

---

## Success Criteria

A successful deployment means:
- All pages load without errors
- All links function correctly
- Interactive elements work as expected
- Design renders properly on all devices
- No console errors in browser DevTools
- GitHub Pages build succeeds
- Content is up-to-date

---

## Testing Tools

- **Browser DevTools**: Console, Network, Performance
- **Responsive Testing**: Chrome DevTools device emulator
- **Accessibility**: Lighthouse, WAVE browser extension
- **Performance**: PageSpeed Insights, WebPageTest
- **Cross-Browser**: BrowserStack (if available)

---

## Contact for Issues

If you find bugs or issues:
1. Document using Bug Report Format above
2. Check if issue is reproducible
3. Create GitHub issue with details
4. Tag as bug, enhancement, or documentation
