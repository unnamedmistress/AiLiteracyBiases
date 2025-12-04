const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SKIP_ENTRIES = new Set([
    'node_modules',
    'dist',
    '.git',
    '.github',
    '.vercel',
    '.vscode',
    'build-tools'
]);

function shouldSkip(relativePath) {
    if (!relativePath) return false;
    const normalized = relativePath.replace(/\\/g, '/');
    for (const entry of SKIP_ENTRIES) {
        if (normalized === entry || normalized.startsWith(`${entry}/`)) {
            return true;
        }
    }
    return false;
}

function copyEntry(source, target) {
    const relative = path.relative(ROOT, source);
    if (relative && shouldSkip(relative)) {
        return;
    }
    const stats = fs.statSync(source);
    if (stats.isDirectory()) {
        fs.mkdirSync(target, { recursive: true });
        for (const child of fs.readdirSync(source)) {
            copyEntry(path.join(source, child), path.join(target, child));
        }
        return;
    }
    if (stats.isFile()) {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(source, target);
    }
}

function build() {
    console.log('Cleaning dist directory...');
    fs.rmSync(DIST, { recursive: true, force: true });
    fs.mkdirSync(DIST, { recursive: true });

    console.log('Copying static assets...');
    for (const entry of fs.readdirSync(ROOT)) {
        copyEntry(path.join(ROOT, entry), path.join(DIST, entry));
    }

    console.log('Static export complete.');
}

build();
