#!/usr/bin/env node

/**
 * Navigation Test Script
 * Verifies that all navigation links in the reorganized lessons point to existing files
 */

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

// Define the expected navigation flow for Lesson 1
const lesson1Flow = [
    { file: 'lesson1/l1-p1-learn-intro.html', nextLink: 'l1-p2-game-prediction.html' },
    { file: 'lesson1/l1-p2-game-prediction.html', nextLink: 'l1-p3-learn-tone.html' },
    { file: 'lesson1/l1-p3-learn-tone.html', nextLink: 'l1-p4-game-voice.html' },
    { file: 'lesson1/l1-p4-game-voice.html', nextLink: 'l1-p5-game-tone.html' },
    { file: 'lesson1/l1-p5-game-tone.html', nextLink: 'l1-p6-summary.html' },
    { file: 'lesson1/l1-p6-summary.html', nextLink: '../lesson2/l2-p1-learn-intro.html' }
];

// Define the expected navigation flow for Lesson 2
const lesson2Flow = [
    { file: 'lesson2/l2-p1-learn-intro.html', nextLink: 'l2-p2-learn-hallucinations.html' },
    { file: 'lesson2/l2-p2-learn-hallucinations.html', nextLink: 'l2-p3-game-hallucinations.html' },
    { file: 'lesson2/l2-p3-game-hallucinations.html', nextLink: 'l2-p4-learn-confidence.html' },
    { file: 'lesson2/l2-p4-learn-confidence.html', nextLink: 'l2-p5-game-confidence.html' },
    { file: 'lesson2/l2-p5-game-confidence.html', nextLink: 'l2-p6-learn-values.html' },
    { file: 'lesson2/l2-p6-learn-values.html', nextLink: 'l2-p7-game-values.html' },
    { file: 'lesson2/l2-p7-game-values.html', nextLink: 'l2-p8-learn-memory.html' },
    { file: 'lesson2/l2-p8-learn-memory.html', nextLink: 'l2-p9-game-memory.html' },
    { file: 'lesson2/l2-p9-game-memory.html', nextLink: 'l2-p10-learn-facts.html' },
    { file: 'lesson2/l2-p10-learn-facts.html', nextLink: 'l2-p11-game-disasters.html' },
    { file: 'lesson2/l2-p11-game-disasters.html', nextLink: 'l2-p12-summary.html' },
    { file: 'lesson2/l2-p12-summary.html', nextLink: '../quiz1.html' }
];

let passed = 0;
let failed = 0;

console.log('🧪 Testing Lesson Reorganization Navigation...\n');

function testNavigationFlow(flow, lessonName) {
    console.log(`📚 Testing ${lessonName}:`);
    
    flow.forEach(({ file, nextLink }) => {
        const filePath = path.join(baseDir, file);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`  ❌ FAIL: File does not exist: ${file}`);
            failed++;
            return;
        }
        
        // Read file content
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the expected next link is present
        const hasNextLink = content.includes(nextLink);
        
        if (hasNextLink) {
            console.log(`  ✅ PASS: ${file} → ${nextLink}`);
            passed++;
        } else {
            console.log(`  ❌ FAIL: ${file} missing link to ${nextLink}`);
            failed++;
        }
    });
    
    console.log('');
}

// Test Lesson 1
testNavigationFlow(lesson1Flow, 'Lesson 1');

// Test Lesson 2
testNavigationFlow(lesson2Flow, 'Lesson 2');

// Check that legacy files still exist
console.log('📦 Checking Legacy Files:');
const legacyFiles = [
    'lesson1-ai-intro.html',
    'presentation.html',
    'game.html'
];

legacyFiles.forEach(file => {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ PASS: Legacy file preserved: ${file}`);
        passed++;
    } else {
        console.log(`  ❌ FAIL: Legacy file missing: ${file}`);
        failed++;
    }
});

console.log('');

// Summary
console.log('═══════════════════════════════════════');
console.log(`📊 Test Summary:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Total:  ${passed + failed}`);
console.log('═══════════════════════════════════════');

if (failed === 0) {
    console.log('\n🎉 All tests passed! Navigation structure is correct.\n');
    process.exit(0);
} else {
    console.log('\n⚠️  Some tests failed. Please review the output above.\n');
    process.exit(1);
}
