import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const exec = promisify(execFile);
const root = resolve('.');

test('scanner indexes managed, hardcoded, and dynamic copy', async () => {
  await exec(process.execPath, ['scripts/build-content-index.mjs'], { cwd: root });
  const index = JSON.parse(await readFile('src/copy/contentUsage.generated.json', 'utf8'));
  assert.ok(index.managed['buttons.save']);
  assert.ok(index.hardcoded.some(item => item.text === 'Your recent activity'));
  assert.ok(index.dynamic.some(item => item.expression.includes('Welcome')));
});

test('scanner excludes Content Manager interface copy', async () => {
  const index = JSON.parse(await readFile('src/copy/contentUsage.generated.json', 'utf8'));
  assert.equal(index.hardcoded.some(item => item.file.includes('/content-manager/')), false);
});
