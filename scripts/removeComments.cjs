#!/usr/bin/env node
/**
 * removeComments.cjs
 * Strips JS/TS/TSX single-line (// ...) and block (/* ... * /) comments from source files.
 * - Preserves comment-like content inside strings & template literals.
 * - Skips node_modules, dist, assets (images), json, css.
 * NOTE: This is a heuristic; for 100% safety use a parser (Babel/TS).
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');

const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

function stripComments(code) {
  // Quick exit if no comment markers at all
  if (!/\/\//.test(code) && !/\/*/.test(code)) return code;

  let out = '';
  let i = 0;
  const len = code.length;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inBlockComment = false;
  let inLineComment = false;
  let prevChar = '';

  while (i < len) {
    const ch = code[i];
    const next = i + 1 < len ? code[i + 1] : '';

    // End of line comment
    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false;
        out += ch; // keep newline
      }
      i++;
      prevChar = ch;
      continue;
    }

    // End of block comment
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 2;
        prevChar = '';
        continue;
      }
      i++;
      prevChar = ch;
      continue;
    }

    // String/template state toggles (ignore if escaping)
    if (!inSingle && !inDouble && !inTemplate) {
      if (ch === '/' && next === '/') {
        inLineComment = true;
        i += 2;
        prevChar = '';
        continue;
      }
      if (ch === '/' && next === '*') {
        inBlockComment = true;
        i += 2;
        prevChar = '';
        continue;
      }
    }

    if (!inDouble && !inTemplate && ch === "'" && prevChar !== '\\') {
      inSingle = !inSingle;
      out += ch;
      prevChar = ch;
      i++;
      continue;
    }

    if (!inSingle && !inTemplate && ch === '"' && prevChar !== '\\') {
      inDouble = !inDouble;
      out += ch;
      prevChar = ch;
      i++;
      continue;
    }

    if (!inSingle && !inDouble && ch === '`' && prevChar !== '\\') {
      inTemplate = !inTemplate;
      out += ch;
      prevChar = ch;
      i++;
      continue;
    }

    out += ch;
    prevChar = ch;
    i++;
  }
  return out;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'dist' || e.name === 'assets' || e.name === 'Assets') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (exts.has(path.extname(e.name))) {
      const original = fs.readFileSync(full, 'utf8');
      const stripped = stripComments(original);
      if (original !== stripped) {
        fs.writeFileSync(full, stripped, 'utf8');
        console.log('Stripped comments:', path.relative(root, full));
      }
    }
  }
}

walk(root);
