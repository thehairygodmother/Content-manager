#!/usr/bin/env node
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] || '.');
const config = JSON.parse(await readFile(join(root, 'content-manager.config.json'), 'utf8'));
const sourceRoot = join(root, config.srcRoot);
const skip = new Set(config.skipScanDirs || []);
const extensions = new Set(config.scanExtensions || ['.tsx', '.jsx']);

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') || skip.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path));
    else if (extensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const managed = {};
const hardcoded = [];
const dynamic = [];
const seenHardcoded = new Set();

function lineOf(source, index) { return source.slice(0, index).split('\n').length; }
function contextAt(source, index) { return source.split('\n')[lineOf(source, index) - 1]?.trim().slice(0, 180) || ''; }
function addHardcoded(text, file, source, index, prop = 'children') {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length < 3 || /^(true|false|null|undefined)$/.test(cleaned)) return;
  const key = `${file}:${index}:${cleaned}`;
  if (seenHardcoded.has(key)) return;
  seenHardcoded.add(key);
  hardcoded.push({ text: cleaned, file, line: lineOf(source, index), context: contextAt(source, index), prop });
}

for (const absolute of await filesUnder(sourceRoot)) {
  const file = relative(root, absolute).split(sep).join('/');
  const source = await readFile(absolute, 'utf8');
  for (const match of source.matchAll(/\bmanaged\.([A-Za-z0-9_.]+)/g)) {
    const path = match[1];
    (managed[path] ||= []).push({ file, line: lineOf(source, match.index), context: contextAt(source, match.index) });
  }
  for (const match of source.matchAll(/>([^<{][^<{]*?)</g)) addHardcoded(match[1], file, source, match.index, 'children');
  for (const match of source.matchAll(/\b(aria-label|placeholder|title|alt|label)\s*=\s*["']([^"']+)["']/g)) addHardcoded(match[2], file, source, match.index, match[1]);
  for (const match of source.matchAll(/`([^`]*\$\{[^`]+)`/g)) {
    const parts = [...match[1].matchAll(/(?:^|\})([^${}]+)/g)].map(item => item[1].trim()).filter(Boolean);
    dynamic.push({ expression: match[1], parts, confidence: parts.length ? 'traceable' : 'review', file, line: lineOf(source, match.index), context: contextAt(source, match.index) });
  }
}

const output = { generated: true, generatedAt: new Date().toISOString(), managed, hardcoded, dynamic };
await writeFile(join(root, config.usageOutputFile), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Indexed ${Object.keys(managed).length} managed references, ${hardcoded.length} hardcoded strings, and ${dynamic.length} dynamic expressions.`);
