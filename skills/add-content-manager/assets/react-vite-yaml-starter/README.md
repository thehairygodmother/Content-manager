# React + Vite + YAML starter

This is the runnable reference asset bundled with the `add-content-manager` skill. It demonstrates storage-agnostic search across managed values, hardcoded strings, shared references, and traceable dynamic content.

```bash
npm install
npm test
npm run build
npm run dev
```

Before integrating it into a real host, update `content-manager.config.json`, map host routes, replace the demo stores, and run `npm run glossary:index`.

The local save endpoint is development-only. Pull-request creation is intentionally handled by the host agent or Git tooling, never by the browser UI.
