import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import YAML from 'yaml';

test('portable stores contain required keys', async () => {
  const managed = YAML.parse(await readFile('src/copy/managed.yaml', 'utf8'));
  const terms = YAML.parse(await readFile('src/copy/terms.yaml', 'utf8'));
  assert.equal(typeof managed.product_name, 'string');
  assert.equal(typeof managed.deprecated_terms, 'object');
  assert.equal(typeof managed.indexed, 'object');
  assert.ok(Array.isArray(terms.guidelines.rules));
});

test('promotion boundary is documented in the interface', async () => {
  const source = await readFile('src/content-manager/ContentManager.tsx', 'utf8');
  assert.match(source, /does not replace the source literal/i);
  assert.doesNotMatch(source, /replaceAll\(/);
});
