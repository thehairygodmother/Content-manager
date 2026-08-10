#!/usr/bin/env node
import { cp, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(skillRoot, 'assets', 'react-vite-yaml-starter');
const host = resolve(process.argv[2] || '.');

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

if (!(await exists(join(host, 'package.json')))) {
  throw new Error(`No package.json found at ${host}`);
}

const destination = join(host, 'content-manager-starter');
if (await exists(destination)) {
  throw new Error(`Refusing to overwrite ${destination}`);
}

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

const packagePath = join(host, 'package.json');
const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
pkg.scripts ||= {};
pkg.scripts['content-manager:starter'] ||= 'npm --prefix content-manager-starter run dev';
await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

console.log(`Content Manager starter copied to ${destination}`);
console.log('Next: adapt its config and source paths, then wire its routes into the host router.');
