#!/usr/bin/env node
/** Removes leading blank lines at the start of each source file in src/. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);

function trimLeadingBlank(content) {
  return content.replace(/^(\s*\n)+/,'');
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!exts.has(path.extname(entry.name))) continue;
    const original = fs.readFileSync(full, 'utf8');
    const trimmed = trimLeadingBlank(original);
    if (original !== trimmed) {
      fs.writeFileSync(full, trimmed, 'utf8');
      console.log('Trimmed leading blank lines:', path.relative(root, full));
    }
  }
}
walk(root);
