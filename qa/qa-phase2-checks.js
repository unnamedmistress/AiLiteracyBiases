#!/usr/bin/env node

/**
 * Phase 2 QA checks for nav/progress/XP scaffolding.
 * - Verifies quick-check pages exist and include answer groups with XP tags.
 * - Ensures progress indicators and body data attributes for nav/progress scripts.
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

/**
 * Pages that should include quick checks and XP hooks.
 */
const quickCheckPages = [
  // Lesson 2 learn + summary
  'lesson2/l2-p2-learn-hallucinations.html',
  'lesson2/l2-p4-learn-confidence.html',
  'lesson2/l2-p6-learn-values.html',
  'lesson2/l2-p8-learn-memory.html',
  'lesson2/l2-p10-learn-facts.html',
  'lesson2/l2-p12-summary.html',
  // Lesson 3 learn
  'lesson3/l3-p2-learn-briefs.html',
  'lesson3/l3-p4-learn-structure.html',
  'lesson3/l3-p6-learn-style.html',
  'lesson3/l3-p8-learn-safety.html',
  // Lesson 4 learn
  'lesson4/l4-p2-learn-fewshot.html',
  'lesson4/l4-p4-learn-cot.html',
  'lesson4/l4-p6-learn-tools.html',
  'lesson4/l4-p8-learn-rag.html',
  'lesson4/l4-p10-learn-safety.html',
  // Lesson 5 learn
  'lesson5/l5-p2-learn-patterns.html',
  'lesson5/l5-p4-learn-bottlenecks.html',
  'lesson5/l5-p6-learn-automation.html',
  'lesson5/l5-p8-learn-guardrails.html'
];

let passed = 0;
let failed = 0;

function fail(msg) {
  console.log(`  ❌ ${msg}`);
  failed++;
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
  passed++;
}

function checkFilePresence(file) {
  const filePath = path.join(baseDir, file);
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${file}`);
    return null;
  }
  return filePath;
}

function contains(content, needle) {
  return content.includes(needle);
}

console.log('🧪 Phase 2 QA: quick checks, progress, nav data');
console.log('');

quickCheckPages.forEach((file) => {
  const filePath = checkFilePresence(file);
  if (!filePath) return;
  const content = fs.readFileSync(filePath, 'utf8');

  // Body data attributes for progress/nav scripts
  const bodyHasData = /<body[^>]*data-lesson-id="[^"]+"[^>]*data-total-pages="\d+"[^>]*data-page-number="\d+"/i.test(content);
  if (bodyHasData) {
    pass(`${file}: body has data-lesson-id/total-pages/page-number`);
  } else {
    fail(`${file}: missing body data attributes for nav/progress`);
  }

  // Progress indicator presence
  if (contains(content, 'progress-indicator')) {
    pass(`${file}: progress indicator present`);
  } else {
    fail(`${file}: progress indicator missing`);
  }

  // Quick check blocks with XP hooks
  const hasAnswerGroup = contains(content, 'data-answer-group');
  const hasXP = contains(content, 'data-xp');
  if (hasAnswerGroup && hasXP) {
    pass(`${file}: quick check with XP hooks present`);
  } else {
    fail(`${file}: quick check/XP hooks missing`);
  }
});

console.log('\n═══════════════════════════════════════');
console.log(`📊 QA Summary: Passed ${passed}, Failed ${failed}, Total ${passed + failed}`);
console.log('═══════════════════════════════════════');

process.exit(failed === 0 ? 0 : 1);
