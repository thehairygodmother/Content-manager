import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, writeFile } from 'node:fs/promises';
import YAML from 'yaml';

function contentManagerWriteback(): Plugin {
  return {
    name: 'content-manager-writeback',
    configureServer(server) {
      server.middlewares.use('/api/content-manager/save', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed'); }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
          try {
            const { file, path, value } = JSON.parse(body);
            if (!['src/copy/managed.yaml', 'src/copy/terms.yaml'].includes(file)) throw new Error('File is not writable');
            const document = YAML.parse(await readFile(file, 'utf8'));
            const parts = String(path).split('.');
            let cursor = document;
            for (const part of parts.slice(0, -1)) cursor = cursor[part];
            cursor[parts.at(-1)!] = value;
            await writeFile(file, YAML.stringify(document));
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Save failed' }));
          }
        });
      });
    }
  };
}

export default defineConfig({ plugins: [react(), contentManagerWriteback()] });
