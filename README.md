# Content Manager

Content Manager is an agent skill that adds a searchable, Git-based UI-copy manager to a React + Vite product.

It helps content, design, and engineering teams find wording exactly as it appears in a product—even when they do not know the file, component, string ID, managed key, or storage method behind it.

## What it solves

Product wording is often split between managed copy stores, hardcoded components, shared references, and runtime expressions. That makes a simple question—“Where is this text used?”—surprisingly expensive and risky.

Content Manager adds an internal interface that:

- Searches managed and hardcoded wording in one place.
- Connects visible UI text to its definition and detected usages.
- Makes shared change impact visible.
- Shows traceable parts of dynamically assembled content.
- Flags uncertain runtime content for engineering review.
- Lets teams edit managed values through local write-back.
- Promotes hardcoded wording into the managed store without silently rewriting source.
- Manages glossary terms and content guidelines.
- Ships wording through the existing Git branch and pull-request workflow.

Git remains the source of truth. Content Manager is not a production CMS and does not merge, deploy, or bypass engineering review.

## Who it is for

- Product content designers and UX writers
- Designers auditing product language
- Engineers maintaining UI-copy infrastructure
- Teams using coding agents to manage and govern product wording

## Storage-agnostic content discovery

Users search with the words they can see. Content Manager identifies, where it can do so confidently, whether a result is:

- **Managed** — defined in the configured YAML store.
- **Hardcoded** — found as a UI string literal in source.
- **Shared** — one managed reference used in several places.
- **Dynamic** — assembled from traceable static and runtime parts.

When the source cannot be traced confidently, it says so and routes the item to engineering review. It does not invent an edit path.

## Current support

The first release supports **React + Vite + YAML** repositories.

Other frameworks, hosted CMSs, multi-locale pipelines, production write APIs, and direct deployment are not yet supported.

## Use the skill

Make the folder [`skills/add-content-manager`](skills/add-content-manager) available to a skill-compatible coding agent, then open the React/Vite product repository and prompt:

> Add Content Manager to this product.

The agent will inspect the host first, confirm compatibility, install the starter selectively, adapt configuration and routes, generate the usage index, run tests, and prepare the change for engineering review.

The agent should work on a branch and create or update a pull request when its GitHub tools permit it. If they do not, it provides an exact handoff instead of pretending a pull request exists.

## What gets added

- A managed-copy YAML store and loader pattern.
- A generated UI-copy usage index.
- A configurable source scanner.
- Internal search and detail views.
- Local development write-back for managed values.
- Hardcoded-copy promotion guidance.
- Glossary terms and guideline rules.
- Host route and preview configuration.
- Tests for core safety and indexing contracts.

The detailed behaviour and acceptance criteria live in the [Content Manager V4 specification](skills/add-content-manager/references/content-manager-specification-v4.md).

## Run the example

```bash
cd examples/demo-product
npm install
npm test
npm run build
npm run dev
```

Open the local Vite URL. The example includes managed wording, hardcoded wording, a shared value, a traceable dynamic expression, a deprecated term, glossary metadata, and a guideline rule.

## Repository structure

```text
content-manager/
├── README.md
├── LICENSE
├── skills/
│   └── add-content-manager/
│       ├── SKILL.md
│       ├── agents/openai.yaml
│       ├── references/content-manager-specification-v4.md
│       ├── scripts/install-content-manager.mjs
│       └── assets/react-vite-yaml-starter/
├── examples/demo-product/
└── .github/workflows/test.yml
```

## Safety model

- Managed edits write only to the configured managed store.
- Promoting hardcoded copy creates a managed entry but leaves the source literal unchanged.
- Glossary checking is advisory and never rewrites copy.
- The browser interface does not merge or deploy.
- Pull-request review is the approval mechanism.

## Status

This is an early open-source release. The bundled interface and scanner are functional and tested against the included example, but host integration still requires an agent and engineering review because every product structures routes and copy differently.

## Licence

[MIT](LICENSE)
