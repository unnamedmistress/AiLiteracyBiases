#!/usr/bin/env node
/**
 * Navigation audit: scans HTML files for broken local links and validates data-next-lesson destinations.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LESSON_SEQUENCE = [
  { id: 'lesson1', path: 'lesson1/l1-p1-learn-intro.html' },
  { id: 'lesson2', path: 'lesson2/l2-p1-learn-intro.html' },
  { id: 'quiz1', path: 'quiz1.html' },
  { id: 'lesson3', path: 'lesson3/l3-p1-learn-intro.html' },
  { id: 'lesson4', path: 'lesson4/l4-p1-learn-intro.html' },
  { id: 'lesson5', path: 'lesson5/l5-p1-learn-intro.html' },
  { id: 'lesson6', path: 'lesson6-capstone.html' },
  { id: 'lesson7-placeholder', path: null }
];
const CUSTOM_NEXT = {
  lesson1: { href: 'lesson2/l2-p1-learn-intro.html' },
  lesson2: { href: 'quiz1.html' },
  quiz1: { href: 'lesson3/l3-p1-learn-intro.html' },
  lesson6: { href: 'certificate.html' }
};

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      // Skip node_modules and build artifacts
      if (entry === 'node_modules' || entry.startsWith('.git')) continue;
      files = files.concat(walk(full));
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function getLessonById(id) {
  return LESSON_SEQUENCE.find((item) => item.id === id) || null;
}

function getAutoNextDestination(lessonId) {
  if (!lessonId) return null;
  const override = CUSTOM_NEXT[lessonId];
  if (override) return { id: null, href: override.href };
  const idx = LESSON_SEQUENCE.findIndex((item) => item.id === lessonId);
  if (idx === -1) return null;
  const next = LESSON_SEQUENCE[idx + 1];
  if (!next || !next.path) return null;
  return { id: next.id, href: next.path };
}

function collectLinks(html) {
  const links = [];
  const hrefRegex = /href="([^"]+)"/gi;
  let match;
  while ((match = hrefRegex.exec(html))) {
    links.push(match[1]);
  }
  return links;
}

function getLessonIdFromHtml(html) {
  const match = html.match(/data-lesson-id="([^"]+)"/i);
  return match ? match[1] : null;
}

function collectNextLessonDirectives(html) {
  const regex = /data-next-lesson(?:="([^"]*)")?/gi;
  const directives = [];
  let m;
  while ((m = regex.exec(html))) {
    directives.push(m[1] || 'auto');
  }
  return directives;
}

function isExternal(href) {
  return /^([a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

function auditLinks(htmlFile, issues) {
  const relDir = path.dirname(path.relative(ROOT, htmlFile));
  const html = fs.readFileSync(htmlFile, 'utf8');
  const links = collectLinks(html);
  links.forEach((href) => {
    if (!href || href === '#' || href.startsWith('#')) return;
    if (isExternal(href)) return;
    if (!href.endsWith('.html') && !href.includes('.html?')) return;
    const resolved = path.resolve(path.dirname(htmlFile), href);
    if (!fs.existsSync(resolved)) {
      issues.push({ type: 'broken-link', file: path.relative(ROOT, htmlFile), href: `${relDir}/${href}`, note: 'Target missing' });
    }
  });
}

function auditNextLesson(htmlFile, issues) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const lessonId = getLessonIdFromHtml(html);
  const directives = collectNextLessonDirectives(html);
  if (!directives.length) return;
  directives.forEach((directive) => {
    let destination = null;
    if (directive && directive !== 'auto') {
      const targetLesson = getLessonById(directive);
      destination = targetLesson ? { href: targetLesson.path } : null;
    } else {
      destination = getAutoNextDestination(lessonId);
    }
    if (!destination || !destination.href) {
      issues.push({ type: 'next-lesson-missing', file: path.relative(ROOT, htmlFile), lessonId, directive });
      return;
    }
    const resolved = path.resolve(ROOT, destination.href);
    if (!fs.existsSync(resolved)) {
      issues.push({ type: 'next-lesson-missing-file', file: path.relative(ROOT, htmlFile), lessonId, directive, target: destination.href });
    }
  });
}

function main() {
  const htmlFiles = walk(ROOT);
  const issues = [];
  htmlFiles.forEach((file) => {
    auditLinks(file, issues);
    auditNextLesson(file, issues);
  });

  if (!issues.length) {
    console.log('✅ Navigation audit passed: no missing targets.');
    return;
  }

  console.log('⚠️  Navigation audit found issues:\n');
  issues.forEach((issue) => {
    if (issue.type === 'broken-link') {
      console.log(`- [broken-link] ${issue.file} → ${issue.href} (${issue.note})`);
    } else if (issue.type === 'next-lesson-missing-file') {
      console.log(`- [next-lesson] ${issue.file} (${issue.lessonId}) expects ${issue.directive || 'auto'} → ${issue.target} (missing file)`);
    } else {
      console.log(`- [next-lesson] ${issue.file} (${issue.lessonId}) directive=${issue.directive || 'auto'} unresolved`);
    }
  });
  process.exitCode = 1;
}

main();
