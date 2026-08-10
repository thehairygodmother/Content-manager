---
name: add-content-manager
description: Add, install, rebuild, or configure Content Manager in a React + Vite product repository using YAML-managed copy. Use when Codex must add storage-agnostic UI-copy search, usage tracing, glossary and guideline management, safe managed-copy editing, hardcoded-copy promotion, or a Git pull-request review workflow.
---

# Add Content Manager

Install Content Manager into a supported host repository. Treat the host's Git workflow as the publishing and approval system.

## Required references

Read [references/content-manager-specification-v4.md](references/content-manager-specification-v4.md) before implementation. Use it as the source of truth for product behaviour, data contracts, boundaries, and acceptance tests.

Use the bundled `assets/react-vite-yaml-starter/` only for React + Vite + YAML hosts. Do not claim support for other stacks.

## Workflow

1. Inspect the host before editing. Identify its package manager, Vite config, router, source root, copy storage, test setup, and Git conventions.
2. Confirm that React + Vite + YAML is compatible. If not, stop and explain that the current release does not support the host.
3. Produce a short plan naming the files and integration points that will change.
4. Run `node scripts/install-content-manager.mjs <host-root>` from this skill directory, or copy the bundled starter selectively when the host already has conflicting structure.
5. Adapt `content-manager.config.json`, the managed-copy loader, routes, UI labels, and host page route mappings. Keep host-specific taxonomies out of the portable core.
6. Wire the Content Manager routes into the host router without linking them from the customer-facing navigation.
7. Incrementally replace only selected hardcoded strings with managed references. Never bulk-rewrite product copy.
8. Run the host's `glossary:index` command. Inspect uncertain dynamic findings rather than inventing source mappings.
9. Run the bundled tests, host tests, build, and every applicable V4 acceptance test.
10. Work on the current branch. Create or update a pull request and request configured engineering reviewers when repository tools allow it. Otherwise provide the exact title, description, changed-file summary, and commands needed.

## Safety boundaries

- Edit managed content only at its configured managed-store path.
- Promotion adds a key and returns a reference; it never replaces the original source literal.
- Glossary findings are advisory and never rewrite files.
- Never merge, deploy, bypass branch protection, or publish wording directly to production.
- Never claim that a pull request or source mapping exists unless it was actually created or traced.
- Flag untraceable runtime content for engineering review.

## Completion report

Report what was installed, files changed, commands run, test/build results, untraceable content, and any remaining manual integration or pull-request action.
