# Content Manager V4

## Cold-Agent Rebuild Specification

**Version:** 4  
**Date:** 10 August 2026  
**Status:** Rebuild specification

**Purpose:** Give this file to a capable coding agent with no access to the original Content Manager repository, but with access to another product codebase and the instruction: "Add Content Manager to this product."

The agent must be able to reproduce the same capability for that product: find UI wording without requiring the user to understand how it is stored, see where it is used, inspect it, edit managed content, and promote hardcoded content into a managed store.

This is a rebuild specification. The final section records implementation evidence from the inspected React/Vite/YAML version; those paths and filenames are reference details, not requirements for every future stack.

**V4 focus:** Storage-agnostic content discovery. Users search using wording visible in the interface. Content Manager traces that wording to managed keys/string IDs, hardcoded literals, shared references, or dynamically assembled content and makes the implementation and change impact visible when it can do so confidently.

# 1. Product purpose

Content Manager is an internal product UI for people who need to know what wording exists on a product interface and change it safely.

**Who it is for:** Design, content, engineering, and AI-assisted writers working on the same product UI strings.

**Primary job:** Find UI wording -> see where it is used -> inspect it -> edit managed content OR promote hardcoded content into the managed store.

Users begin with the wording they can see. They do not need to know its file, component, managed key/string ID, or storage method before searching.

It is not traveler-facing. It is an internal tooling surface mounted inside the host product app, typically under a route such as `/glossary`.

# 2. Product boundaries

## Content Manager does

- Search managed copy and hardcoded UI string literals through one search experience.
- Let users search by visible UI wording without knowing whether it is hardcoded, managed, shared, or dynamically assembled.
- Show where wording appears: files, lines, page counts, and preview links when configured.
- Identify how matching content is implemented when the source can be traced confidently.
- Show detail for managed catalog entries and hardcoded strings.
- Expose wider change impact when one managed value or shared reference is used across several surfaces.
- Edit glossary terms and content-guideline rules through a local write-back path or equivalent host mechanism.
- Promote/index a hardcoded string into the managed copy store and return a code reference for engineering to wire.
- Optionally show advisory glossary-check findings on detail pages.

## Content Manager does not

- Automatically rewrite product UI copy.
- Provide an approvals, roles, or permissions CMS.
- Treat glossary checking as enforcement; findings are advisory only.
- Replace the source literal when indexing/promoting hardcoded copy.
- Automatically rewire host pages after promotion; engineering must use the returned managed key/reference.
- Claim an exact source or safe change path when dynamically assembled or runtime content cannot be traced confidently.
- Encode one host product's page taxonomy, journey modules, brands, dashboards, pain modules, or equivalent into the portable core.

Host-specific copy modules may be registered through configuration extensions. They are optional host adapters, not part of the portable product core.

## Navigation boundary

Content Manager is reachable at its configured route or as a separate internal app (for example, `glossaryRoute`). It must not be linked from the host product UI.

`productHomeRoute` is used only by Content Manager's own product-name control to take the user from Content Manager -> product home for context. It is not a product -> Content Manager entry point.

# 3. Core user experience

A rebuild does not need identical visual styling. It must reproduce the same functional experience.

## Required routes

| Route | Purpose |
|---|---|
| `{glossaryRoute}` | Search home |
| `{glossaryRoute}/term/:termId` | Managed entry detail |
| `{glossaryRoute}/term/:termId/edit` | Edit glossary term |
| `{glossaryRoute}/copy/:copyId` | Hardcoded string detail |
| `{glossaryRoute}/guidelines` | Content guidelines: rules + terms |
| `{glossaryRoute}/add` | Add term or rule (`?type=term|rule`) |
| `{glossaryRoute}/guidelines/rule/:title/edit` | Edit / remove rule |

Optional compatibility redirects may map legacy rule/term/add routes to the routes above.

## 3.1 Search home

**Purpose:** Find UI wording regardless of how it is implemented.

Users search using the wording they can see in the product. They do not need to know whether it is hardcoded, stored against a managed key/string ID, shared across several surfaces, or assembled dynamically.

**Information displayed:**

- Product name from `product identity/product_name`.
- Manager title and subtitle from UI config.
- Search field; placeholder uses the product name.
- Link to content guidelines.
- After a submitted non-empty query: results table with **Text** and **Used in** columns.
- An implementation label or equivalent detail that distinguishes managed, hardcoded, shared, and traceable dynamic content without requiring a separate search mode.

**Actions:**

- Enter a query and submit; the reference UI submits on Enter and stores the query in URL parameter `q`.
- Open a managed result to managed detail.
- Open a hardcoded result to hardcoded detail.
- Open a traceable dynamic result to implementation detail or engineering guidance supplied by the host adapter.
- Open content guidelines.

**Resulting behaviour / states:**

- No results are shown until a non-empty query is submitted.
- The same search covers managed and hardcoded content without requiring the user to choose a content type first.
- Managed and hardcoded matches are merged and sorted alphabetically by displayed text.
- Traceable dynamic matches may be included when the scanner or host adapter can reconstruct the visible wording confidently.
- Results identify whether wording is managed, hardcoded, shared, or dynamically assembled when that classification can be determined.
- Managed rows may show badges such as **In glossary** or **Do not use**.
- **Used in** shows a page/usage count when available.
- Where content is shared, results make the wider impact of changing it visible.
- Dynamically assembled content shows its traceable component parts; if the source cannot be identified confidently, Content Manager flags it for engineering review rather than proposing an automatic edit.
- Show an empty state when the submitted query has no matches.

## 3.2 Managed detail

**Purpose:** Inspect a catalog entry: wording, usage, how to edit, optional term metadata, and optional advisory glossary check.

**Information displayed:**

- Copy text.
- Implementation classification: managed, plus shared-reference status when the same key is used in multiple places.
- Where it appears, with preview links when `pageRoutes` map files to routes.
- How-to-edit guidance.
- For glossary-term entries: definition, usage example, and do-not-use values.
- Technical details: code reference, internal id, YAML snippet, file/line usage rows.
- Optional glossary-check findings.

**Actions:**

- Back to previous glossary location when navigation state provides one, otherwise search.
- Follow preview links.
- Edit the managed value when write-back is available.
- Edit term metadata when the entry maps to glossary-term metadata.
- Expand/collapse technical details and glossary-check guidance.

**Resulting behaviour / states:**

- Unknown `termId` shows not-found detail.
- Glossary check may run; findings display only when enabled and present.
- When a managed key is shared, the detail view shows every detected usage and warns that editing the value affects all those usages.

## 3.3 Hardcoded detail

**Purpose:** Inspect a hardcoded UI string and optionally promote it into managed content.

**Information displayed:**

- Copy text; `copyId` is the URL-encoded string.
- Implementation classification: hardcoded.
- Every recorded file, line, and prop occurrence.
- Preview links from occurrence files when configured.
- How-to-edit page-file guidance.
- Index/promote panel.
- Optional glossary-check findings.

**Actions:**

- Reveal index form, choose or edit a key, and save.
- Copy the returned engineering reference.
- Use back/preview navigation as on managed detail.

**Resulting behaviour / states:**

- No matching occurrences shows not-found.
- Index success returns a managed code reference; source literals are not rewritten.
- Already-indexed text shows the existing reference.
- Save may be unavailable outside the local write-back environment.

## 3.4 Content guidelines

**Purpose:** Manage rules and glossary terms.

**Information displayed:**

- Collapsible Rules section.
- Collapsible Terms section.
- Reorder hint for rules.

**Actions:**

- Expand/collapse sections; hashes such as `#rules`, `#terms`, and `#term={text}` may open and scroll.
- Add rule or term.
- Expand and edit a rule.
- Drag-reorder rules when write-back is available.
- Expand and edit a term.

**Resulting behaviour / states:**

- Navigation from search home and to add/edit routes.

## 3.5 Add content

**Purpose:** Create a term or a rule.

**Information displayed:**

- Type toggle **Term | Rule**; Term is default and `?type=rule` selects Rule.
- Term fields: term, definition required, usage example optional, do not use optional/comma-separated.
- Rule fields: title and body, both required.

**Actions:**

- Save term to terms store and redirect to `guidelines#term-{text}`.
- Save rule by appending it and redirect to `guidelines#rules`.

**Resulting behaviour / states:**

- Save disabled until required fields are filled.
- Validation/server errors are displayed.
- Show a save-unavailable hint when local write-back is unavailable.

## 3.6 Edit term

**Purpose:** Update glossary-term metadata.

**Information displayed:**

- Term may be read-only in the reference UI.
- Definition is required.
- Usage example and do-not-use aliases are editable.

**Actions:**

- Save updates the terms store and may sync do-not-use aliases into `deprecated_terms`.
- Redirect to term detail on success.

## 3.7 Edit rule

**Purpose:** Update or remove a guideline rule.

**Information displayed:**

- Title and body are required to save.

**Actions:**

- Save changes.
- Remove asks for confirmation.
- Redirect to `guidelines#rules`.

# 4. End-to-end flows

## Flow A - Search managed -> detail -> usage -> preview -> edit

1. Open `{glossaryRoute}`.
2. Submit a query that matches managed copy or a glossary term.
3. Open the managed result.
4. On detail, view **Where it appears** and any preview links from `pageRoutes`.
5. Open technical details for file/line usage if needed.
6. If the entry is a glossary term, open **Edit**, change definition / usage / do not use, and save.
7. Confirm the detail reflects the saved metadata after navigation/reload.

## Flow B - Search hardcoded -> detail -> index/promote

8. Open `{glossaryRoute}`.
9. Submit a query matching a hardcoded UI literal from the usage index.
10. Open the hardcoded result.
11. Confirm file/line/prop occurrences and preview links.
12. Choose **Add to managed content**, accept or edit the suggested key, and save.
13. Receive a managed code reference, e.g. `PRODUCT_GLOSSARY.indexed.<key>`.
14. Confirm the page source literal is unchanged.
15. Engineering wires the returned reference into the host page in a later change and reruns the usage index.

## Flow C - Guidelines -> terms/rules -> add/edit/reorder

16. Open `{glossaryRoute}/guidelines`.
17. Expand Rules; expand a rule; edit and save.
18. Drag to reorder rules when write-back is available; order persists.
19. Add a rule and confirm it appears under Rules.
20. Expand Terms; add a term with a definition; confirm it appears and is searchable.
21. Edit the term; confirm definition remains required and `do_not_use` may sync into `deprecated_terms`.

## Flow D - Search visible UI copy without knowing its storage method

1. Copy or enter wording visible in the host product UI.
2. Submit the wording in Content Manager without selecting a content type.
3. Content Manager searches managed values, hardcoded literals, shared references, and traceable dynamic content.
4. Open the relevant result and inspect its implementation, definition point, usages, and change impact.
5. If the source is managed, edit the managed value through the required ship path.
6. If the source is hardcoded, inspect or promote it.
7. If the content is dynamic or cannot be traced confidently, stop automatic editing and request engineering review.

# 5. Functional contracts

## 5.1 Search

- Query is submitted before results appear; reference behaviour uses Enter and `?q=`.
- Users search by displayed wording and are not required to know a managed key/string ID, file, component, or storage type.
- Managed search matches catalog entry text using case-insensitive substring matching.
- Managed search also matches `termMetadata.do_not_use` phrases.
- Deprecated catalog entries match their deprecated label (old phrase), not the preferred replacement text used as `entry.text`.
- If both a preferred managed entry and its deprecated alias match, drop the deprecated row from results.
- Hardcoded search matches UI copy occurrence text using case-insensitive substring matching and groups by identical text.
- Traceable dynamic search may match a reconstructed visible value and/or its indexed component values when the host adapter can determine them confidently.
- Merge managed and hardcoded results, include traceable dynamic results where supported, and sort alphabetically by displayed text.
- Search must not silently omit managed matches merely because users enter the visible value rather than its key.

## 5.2 Result presentation

- Columns are **Text** and **Used in**.
- Managed rows link to term detail by stable catalog id.
- Hardcoded rows link to copy detail by URL-encoded text.
- Results expose implementation type (managed, hardcoded, shared, or dynamic) through a badge, row metadata, or the linked detail view.
- Shared managed rows expose the detected usage count so editors can understand the impact before changing the value.
- Show **Do not use** when the match is via deprecated source or `do_not_use`.
- Show **In glossary** when the row has term metadata and is not a do-not-use match display.
- If a dynamic or runtime source cannot be traced confidently, label the result as requiring engineering review and do not present it as safely editable.

## 5.3 Usage indexing

- A build/index step scans host source and generates a usage artifact.
- The generated usage index connects visible UI wording to its underlying implementation, regardless of whether it is a hardcoded literal or referenced through a managed key/string ID.
- Track references to the managed-copy export, optional additional copy-module scan patterns, and selected string literals in page files.
- For managed content, record where the value is defined and every detected place its key/reference is used.
- For hardcoded content, record every detected source occurrence.
- For shared content, preserve the shared key/reference and all detected consumers so change impact can be calculated.
- Where visible wording is assembled from multiple values or runtime logic, record the traceable component parts and classify it as dynamic. Do not claim an exact source when it cannot be determined confidently.
- Reference JSX prop names scanned: `text`, `label`, `heading`, `subheading`, `placeholder`, `title`, `description`.
- Reference object-property names scanned: `description`, `infoBody`, `summary`, `meta`, `title`, `label`.
- Skip Content Manager's own UI page filenames from literal scanning, configured skip directories, and the generated usage file itself.
- Never hand-edit the generated usage artifact.

## 5.4 Detail resolution

- Managed detail resolves by catalog id; missing id -> not found.
- Hardcoded detail resolves by exact text against indexed occurrences; missing -> not found.
- Managed usage comes from the generated managed-usage map.
- Module-backed usage may come from an additional module usage map keyed by module file name.
- Dynamic detail resolves only when the generated usage artifact or host adapter can associate the visible value with traceable components and source locations.
- Deprecated entries do not contribute code-usage lists.

## 5.5 Preview routing

- Map source file paths to in-app routes via host `pageRoutes` configuration.
- Show preview links only when a mapping exists.
- Honest empty state is acceptable when no page is linked.

## 5.6 Indexing / promotion

- Suggest a key by lowercasing text, replacing non-alphanumeric runs with underscores, trimming underscores, and truncating to 48 characters.
- Reject empty text, empty key, duplicate key, or duplicate text.
- Write into the managed store under `indexed.<key>` or host equivalent.
- Return a code reference for engineering; do not rewrite page literals.
- Index write-back is only available when a local save environment or equivalent is available.

## 5.7 Glossary checking - advisory

- Run on managed and hardcoded detail when enabled; reference default is on.
- Finding kinds: deprecated phrase; another glossary/catalog term found in displayed copy; similar managed entry; similar hardcoded text.
- Reference similarity threshold is token-overlap score >= 0.45.
- Single-word phrase matching is case-insensitive word-boundary regex; multi-word matching is case-insensitive substring.
- Reference caps: `maxSimilar = 5` and `maxSimilarHardcoded = 5`.
- Surface related similar items when viewing a preferred term whose deprecated aliases still appear elsewhere.
- Never write or rewrite copy.

## 5.8 Preferred / deprecated terminology

- `deprecated_terms` maps old phrase -> preferred phrase or preferred key reference.
- Term records may include `do_not_use: string[]`.
- On term add/update, sync missing `do_not_use` aliases of at least 4 characters into `deprecated_terms` pointing at the term text.
- Reject an alias equal to the term case-insensitively.
- Reject an alias already mapped to a different preferred value.
- Removing an alias from a term does not delete an existing `deprecated_terms` key.
- Aliases shorter than 4 characters are skipped for deprecated sync.

## 5.9 Term management

- Fields: text/term, definition required on save, usage example optional, `do_not_use` optional.
- Create slug/key from term: lowercase, replace non-alphanumeric runs with underscore, trim underscores.
- Reject duplicate keys on create.
- Edit updates the existing metadata key; term display may be read-only.

## 5.10 Rule management

- Fields: title and body, both required.
- Add appends and rejects duplicate title.
- Update by `originalTitle`; reject missing or duplicate replacement title.
- Remove by title with confirmation in the UI.
- Reorder requires a complete permutation of existing titles.

# 6. Data contracts

Portable minimum schemas. Do not copy host-specific taxonomy into the core contract. Host products add their own managed keys and optional modules.

## 6.1 Managed copy store - YAML or equivalent

```yaml
product_name: My Product
deprecated_terms:
  "Legacy label": product_name
indexed: {}
page_overrides: {}
# host adds its own keys, e.g.:
# buttons:
#   save: Save
```

The catalog builder must explicitly expose keys the product wants searchable; adding arbitrary YAML alone is not sufficient unless the catalog enumerates them.

## 6.2 Glossary terms + guidelines

```yaml
guidelines:
  intro: ""
  rules:
    - title: Follow the glossary
      body: Use glossary terms exactly as defined ...

themes:
  text: themes
  definition: "..."
  usage_example: "..."
  do_not_use:
    - topics
```

Definition is required by the save contract. Usage example and `do_not_use` are optional.

## 6.3 Catalog entry - runtime

```yaml
id: string
source: string
section: string
label: string
text: string
editFile: string
editPath: string
codeRef?: string
implementationType: managed | hardcoded | shared | dynamic
termMetadata?: GlossaryTermRecord
```

`id` must be stable. Portable sources include managed/host, metadata, and deprecated; hosts may add module sources via adapters. `implementationType` may be derived at runtime rather than persisted in the managed store.

## 6.4 Usage records - generated

```typescript
ManagedUsageRef:
  file: string
  line: number
  context: string
  renderCount?: number

UiCopyOccurrence:
  text: string
  file: string
  line: number
  prop: string

DynamicCopyOccurrence:
  text?: string
  componentParts: string[]
  file: string
  line: number
  context: string
  confidence: "high" | "medium" | "low"
  requiresEngineeringReview: boolean
```

The generated artifact exports a map of managed key path -> `UsageRef[]`, a map of optional module id -> `UsageRef[]`, an array of `UiCopyOccurrence`, and, when supported, an array of `DynamicCopyOccurrence`.

Only high-confidence reconstructed dynamic text should be returned as an exact visible-copy match. Medium- or low-confidence traces must be presented as engineering guidance, not as safely editable content.

## 6.5 Configuration

```typescript
glossaryExportName: string
srcRoot: string
copyDir: string
yamlFile: string
usageOutputFile: string
glossaryRoute: string
productHomeRoute: string
skipScanDirs: string[]
pageRoutes: { [sourceFile]: route }
ui: { ...labels, showGlossaryCheck?: boolean }
setup?: { glossaryYamlFile, configFile, handoverDocFile? }
additionalCopyModules?: { id: string, scanPatterns: string[] }[]
dynamicCopyAdapters?: { id: string, scanPatterns: string[], resolver?: string }[]
```

`dynamicCopyAdapters` are optional. They let a host register known composition patterns without making dynamic-content reconstruction a requirement for every stack.

# 7. Architecture

**Managed copy store:** Human-editable source of inventoriable UI strings, `deprecated_terms`, and indexed promotions. Loaded into a typed runtime object for the product UI.

**Terminology metadata:** Separate store for glossary terms (definition, examples, `do_not_use`) and content-guideline rules.

**Catalog construction:** Builds the searchable catalog from managed copy, indexed entries, terms not already represented by the same text, deprecated map, and optional host modules registered through configuration.

**Source-code usage scanner:** Static scan of the host source tree producing the generated usage index. It traces managed references and selected hardcoded literals; hosts may add adapters for known dynamic-composition patterns.

**Generated usage index:** Machine-owned artifact consumed by search and detail. Never hand-edited.

**Content Manager UI:** Search, managed detail, hardcoded detail, guidelines, add/edit flows.

**Local write-back mechanism:** Development-time API or equivalent that writes YAML or host store for managed values, terms, rules, reorder, and index-copy. It is not a production CMS.

**Host adapter / configuration:** Product name, paths, `pageRoutes`, export name, optional modules, optional dynamic-copy adapters, and UI labels.

# 8. Host adapter

## Required for the portable core

- `product_name` or equivalent product identity string.
- Managed copy store plus runtime loader/export used in product UI.
- Source root to scan.
- Usage-index command that regenerates the usage artifact.
- `glossaryRoute` mounted in the host router.
- `productHomeRoute` for the product-name link.
- `pageRoutes` map; it may start minimal, but missing previews must be represented honestly.
- Configuration declaring `glossaryExportName`, paths, and usage output file.
- Product code importing managed keys for strings that should appear as managed.
- Search that accepts visible UI wording without requiring the user to know its implementation type.

## Required for full Content Manager parity

- Terminology metadata store: terms plus guideline rules.
- Search home that includes hardcoded occurrences from the usage index.
- Implementation and usage information that distinguishes managed and hardcoded content and exposes shared usage impact.
- Hardcoded detail plus index/promote write-back.
- Guidelines UI: list/add/edit/remove/reorder rules and list/add/edit terms.
- Local write-back mechanism in development.

## Optional

- `additionalCopyModules` with id + `scanPatterns` for host-owned copy modules.
- `dynamicCopyAdapters` for known, traceable runtime-composition patterns.
- Catalog extensions registering those modules.
- UI label overrides and `showGlossaryCheck`.
- `page_overrides` in managed copy.
- Cursor/editor terminology rules.
- Compatibility redirects.

Do not require Customer Empathy Hub journey/pain modules. If a host has analogous modules, register them through `additionalCopyModules` and catalog extensions.

# 9. Rebuild procedure

22. Identify the host app entry: router, source root, package manager. Prefer the host's existing stack; implement equivalent components while preserving the contracts in sections 5-6.
23. Add a managed copy store with at least `product_name`, `deprecated_terms`, `indexed`, and the host's real UI strings. Add a loader exporting a stable object.
24. Add configuration: `glossaryExportName`, `srcRoot`, paths, `glossaryRoute`, `productHomeRoute`, `pageRoutes` for important host pages, `skipScanDirs`, and `usageOutputFile`.
25. Implement the usage scanner and script hook, e.g. `glossary:index`. Run it and commit or generate the usage artifact in CI/build. Ensure the generated index connects visible managed values to their keys/references and records hardcoded occurrences. Register optional dynamic adapters only when the host has known composition patterns that can be traced safely.
26. Incrementally replace selected hardcoded host strings with managed export references so managed search and usage become visible.
27. Build the catalog from managed copy + indexed + terms + deprecated. Register optional host modules only through configuration/extensions.
28. Implement search home according to sections 3.1 and 5.1-5.2. The user must not need to choose managed versus hardcoded before searching.
29. Implement managed detail according to sections 3.2 and 5.4-5.5, including shared-reference impact when a key has multiple consumers.
30. Implement hardcoded detail and index/promote according to sections 3.3 and 5.6. Promotion must never rewrite source literals.
31. Add terms and guidelines stores. Implement guidelines, add, edit term, edit rule, and reorder according to sections 3.4-3.7 and 5.8-5.10.
32. Add local write-back using dev-server middleware or equivalent with the validation rules in section 5.
33. Implement advisory glossary check on detail pages according to section 5.7. Default on; never auto-rewrite.
34. Wire UI chrome strings from config and product name from `product_name`.
35. Run the acceptance tests in section 10 against the host product's own pages and strings.
36. Document for the host team what shipped, how to edit the managed store, how to run the index command, and that index != auto-replace.

# 10. Acceptance tests

## AT-01 Managed search

**GIVEN** a managed string S exists in the managed store and catalog  
**WHEN** the user submits a query matching S at `{glossaryRoute}`  
**THEN** a managed result for S appears in the Text column.

## AT-02 Hardcoded search

**GIVEN** a page contains a string literal L scanned into the usage index  
**WHEN** the user submits a query matching L  
**THEN** a hardcoded result for L appears.

## AT-02b Storage-agnostic search

**GIVEN** visible UI wording exists as a managed value, hardcoded literal, shared reference, or traceable dynamically assembled value  
**WHEN** the user searches using that visible wording  
**THEN** Content Manager returns the relevant result without requiring the user to know its string ID, file, component, or storage method  
**AND** identifies how the content is implemented  
**AND** shows where it is defined and used when that information can be determined  
**AND** flags the result for engineering review when its source cannot be traced confidently.

## AT-02c Shared-reference impact

**GIVEN** managed value S is referenced by more than one component or surface  
**WHEN** a user opens its result or detail  
**THEN** Content Manager shows all detected usages and makes clear that editing S affects each of them.

## AT-03 Usage counts

**GIVEN** results are shown  
**THEN** the Used in column reflects usage/page counts for rows that have usage  
**AND** do-not-use badge rows may omit page count if matching reference behaviour.

## AT-04 Preview links

**GIVEN** `pageRoutes` maps file F to route R  
**AND** a detail page lists F in usage/occurrences  
**WHEN** the user opens the preview control for F  
**THEN** the app navigates to R.

## AT-05 Managed detail

**GIVEN** a managed catalog id T  
**WHEN** opening `{glossaryRoute}/term/T`  
**THEN** wording, usage information, and edit guidance are shown  
**AND** an unknown id shows not-found.

## AT-06 Hardcoded detail

**GIVEN** indexed occurrences for text L  
**WHEN** opening `{glossaryRoute}/copy/{encodeURIComponent(L)}`  
**THEN** file/line/prop rows for L are listed  
**AND** an unknown text shows not-found.

## AT-07 Promote / index

**GIVEN** hardcoded detail for L that is not yet indexed  
**WHEN** the user indexes with key K  
**THEN** the managed store contains `indexed.K = L`  
**AND** the UI returns a code reference including K  
**AND** the original page source still contains literal L unchanged.

## AT-08 Promotion does not silent-rewrite

**GIVEN** AT-07 succeeded  
**WHEN** inspecting the host page file that contained L  
**THEN** no automatic substitution of L with the managed reference has occurred.

## AT-09 Add term

**GIVEN** the guidelines add-term flow  
**WHEN** saving term text plus a non-empty definition  
**THEN** the terms store contains the new record  
**AND** the term appears under Guidelines Terms  
**AND** the term is searchable from the home.

## AT-10 Edit term

**GIVEN** an existing term  
**WHEN** updating definition and optional `do_not_use`  
**THEN** the store updates  
**AND** missing `do_not_use` aliases of at least 4 characters appear in `deprecated_terms`  
**AND** saving without definition is rejected.

## AT-11 Rules CRUD + reorder

**GIVEN** Guidelines Rules  
**WHEN** adding, editing, removing, and reordering rules  
**THEN** each change persists in the guidelines store  
**AND** reorder requires the full set of titles.

## AT-12 Deprecated advisory findings

**GIVEN** `deprecated_terms` contains old phrase P -> preferred  
**AND** detail copy contains P  
**WHEN** glossary check is enabled  
**THEN** an advisory deprecated finding is shown  
**AND** no file is rewritten.

## AT-13 Glossary check never auto-rewrites

**GIVEN** any detail with glossary-check findings  
**WHEN** findings are displayed or guidance is toggled  
**THEN** product UI source files are unchanged by the check itself.

# 11. Reference implementation - React + Vite + YAML

Implementation details of the existing Content Manager inspected 2026-08-09. These are evidence, not requirements that every future stack must copy.

## 11.1 Routes

| Route | Component / behaviour |
|---|---|
| `/glossary` | `GlossaryPage` |
| `/glossary/guidelines` | `GlossaryContentGuidelinesPage` |
| `/glossary/guidelines/rules` | redirect -> `#rules` |
| `/glossary/guidelines/terms` | redirect -> `#terms` |
| `/glossary/add` | `GlossaryAddContentPage` |
| `/glossary/add-terms` | redirect -> `/glossary/add` |
| `/glossary/terms` | redirect -> `/glossary/guidelines` |
| `/glossary/guidelines/rule/:ruleTitle/edit` | `GlossaryEditRulePage` |
| `/glossary/term/:termId/edit` | `GlossaryEditTermPage` |
| `/glossary/term/:termId` | `GlossaryTermPage` |
| `/glossary/copy/:copyId` | `GlossaryCopyPage` |

## 11.2 Key files

```text
pages/GlossaryPage.tsx
pages/GlossaryTermPage.tsx
pages/GlossaryCopyPage.tsx
pages/GlossaryContentGuidelinesPage.tsx
pages/GlossaryAddContentPage.tsx
pages/GlossaryEditTermPage.tsx
pages/GlossaryEditRulePage.tsx
pages/GlossaryDetailSections.tsx
pages/GlossaryIndexCopyPanel.tsx
pages/GlossaryReorderableRules.tsx
pages/ContentGuidelinesTermsList.tsx
pages/glossaryShared.ts
pages/glossaryTermFormShared.tsx
pages/glossaryRuleFormShared.tsx
pages/glossaryEditHelpers.ts
pages/glossaryTermMetadata.ts
copy/hubGlossary.yaml + hubGlossary.ts
copy/glossaryTerms.yaml + glossaryTerms.ts
copy/glossaryCatalog.ts
copy/glossaryExplorerLogic.ts
copy/glossaryUiConfig.ts
copy/glossaryProduct.ts
copy/glossaryUsage.generated.ts
vite-plugin-glossary-save.ts
scripts/build-glossary-index.mjs
copy-glossary.config.json
```

## 11.3 Save API - Vite `configureServer` only

```text
POST /api/glossary/add-term
POST /api/glossary/update-term
POST /api/glossary/add-rule
POST /api/glossary/update-rule
POST /api/glossary/remove-rule
POST /api/glossary/reorder-rules
POST /api/glossary/index-copy

Writes:
  src/copy/glossaryTerms.yaml
  src/copy/hubGlossary.yaml
```

Reference plugin paths are hardcoded rather than read from `copy-glossary.config.json`. Client gate: `import.meta.env.DEV`.

## 11.4 Scripts

| Script | Behaviour |
|---|---|
| `glossary:sync` | sync template-owned files |
| `glossary:index` | sync + `build-glossary-index.mjs` |
| `predev` | `glossary:sync` |
| `build` | `glossary:index && tsc && vite build` |

## 11.5 Scanner skip list

```text
GlossaryPage.tsx
GlossaryTermPage.tsx
GlossaryCopyPage.tsx
GlossaryContentGuidelinesPage.tsx
GlossaryAddContentPage.tsx
GlossaryEditTermPage.tsx
GlossaryEditRulePage.tsx
```

## 11.6 Catalog sources in the inspected host

- `hub` - explicitly listed `hubGlossary` fields + `indexed`.
- `journey` - `journeyPhaseCopy`; host-specific, not portable core.
- `pain` - `painPointThemeCopy`; host-specific, not portable core.
- `metadata` - `glossaryTerms` not already represented by the same text.
- `deprecated` - `deprecated_terms`.

## 11.7 Example managed YAML shape - inspected host

`product_name`, `mentions`, `brands`, `metrics`, `how_it_works`, `deprecated_terms`, `page_overrides`, `indexed`. The loader/catalog enumerates specific fields; arbitrary new YAML keys do not automatically appear in the catalog.

## 11.8 Example terms YAML shape - inspected host

```text
guidelines.intro
guidelines.rules[{title,body}]
<slug>: { text, definition?, usage_example?, do_not_use?[] }
```

The save API requires definition on add/update.

## 11.9 Config keys used

`glossaryExportName`, `srcRoot`, `copyDir`, `yamlFile`, `usageOutputFile`, `glossaryRoute`, `productHomeRoute`, `skipScanDirs`, `pageRoutes`, `ui`, `setup`, `additionalCopyModules[{id, scanPatterns}]`.

## 11.10 Template vs full host Content Manager

The historical `copy-glossary` template ships thinner explorer pieces: search/detail/scanner/config. Full host Content Manager adds guidelines CRUD, hardcoded detail, index panel, terms YAML, save plugin, and a richer detail shell. Prefer host behaviour described in sections 3-5 for full rebuilds.

## 11.11 Sync ownership

Template-owned shared files include `build-glossary-index.mjs` and `glossaryExplorerLogic.ts`. Edit the template source and sync rather than treating host copies as canonical for those files.

# 12. Unknown / implementation-dependent

Do not invent answers for these; choose explicitly when rebuilding.

- Save APIs in production or preview servers: the reference plugin uses `configureServer` only; no production save handler was found.
- Whether Vite HMR always refreshes every YAML-backed view after save without navigation. Index-success messaging tells users to refresh; add/edit flows use full navigation redirects.
- `GLOSSARY_GUIDELINES.intro` is loaded by `glossaryTerms.ts` but is not rendered on the reference guidelines page.
- `GlossaryBackButton.tsx` exists in the reference tree but no import was found.
- The inspected host inlines host modules in `glossaryCatalog.ts` rather than using `glossaryCatalog.extensions.ts`; rebuilds may use either pattern, with extensions cleaner for portability.
- Exact generated usage counts are environment-specific; rerun the scanner.
- Multi-locale or multi-brand copy trees are outside the portable core unless the host defines them as ordinary managed keys.
- Visual design system is implementation-dependent; functional parity is required, pixel parity is not.
- Exact dynamic-content reconstruction is stack- and host-dependent. The portable core must support visible-copy search across managed and hardcoded content; dynamic adapters are optional and must report confidence honestly.

## Cold-agent final check

| Question | Where answered |
|---|---|
| WHY | Section 1 - Product purpose |
| WHAT | Sections 2-4 - Boundaries, UX, flows |
| HOW it behaves | Section 5 - Functional contracts |
| WHAT data | Section 6 - Data contracts |
| HOW it connects | Sections 7-8 - Architecture + host adapter |
| WHAT must not happen | Section 2 and sections 5.6-5.7 |
| HOW to verify | Section 10 - Acceptance tests |
| Evidence / prior art | Section 11 - Reference implementation |
| Open risks | Section 12 - Unknown / implementation-dependent |

If any of these cannot be answered from this document, the specification is incomplete.

# 13. Required ship path

Intended ship path: the editing experience should feel like vibe-coding a string, with Content Manager writing the managed content file.

37. Edit in Content Manager.
38. Save writes the managed copy store and related YAML on the current Git branch.
39. The local/preview app reloads so the editor can verify the change.
40. Request review creates or updates a pull request for engineering review.
41. Engineering reviews the diff, merges it, and the wording ships with the product.

Git remains the source of truth. There is no separate production content-publishing step.

## 13.1 Additional boundaries

### Content Manager does

- Edit managed copy values in the managed store through write-back.
- Request engineering review by creating or updating a Git pull request.

### Content Manager does not

- Automatically rewrite product UI page source as its everyday edit path.
- Push wording directly to production without Git review.
- Provide a separate approvals, roles, or permissions CMS; pull-request review is the approval mechanism.

## 13.2 Revised Flow A - Search managed -> detail -> edit value -> request review

42. Open Content Manager and search managed copy.
43. Open a result and inspect usage / preview.
44. Edit the managed string and save it to the managed store.
45. Confirm the host page updates through HMR/reload.
46. Request review: create/update a pull request and request configured engineering reviewers.
47. Engineering reviews and merges through the normal code-review process.

## 13.3 Flow E - Team ship path

48. Work on a Git branch.
49. Content Manager write-back updates only store files on that branch.
50. Request review creates or updates a pull request containing Content Manager-owned diffs, a clear message, configured engineering reviewers, and returns the pull-request URL.
51. Engineering reviews through normal code review.
52. Merge through normal branch protection and CI.
53. Content Manager does not provide a second in-app approval workflow.

## 13.4 New functional contracts

### 13.4.1 Managed copy value edit - required

- Managed store entries must be editable in Content Manager.
- Save updates only the managed store at `editPath`.
- Host screens using that key update after reload/HMR.
- Do not use find-and-replace in `.tsx`/`.jsx` as the everyday edit mechanism.

### 13.4.2 Request review / ship via pull request - required

- Request review operates on the current branch.
- Include Content Manager-owned diffs.
- Create or update a pull request, request configured engineering reviewers, and return the pull-request URL.
- Content Manager must not merge the pull request or bypass branch protection.
- Pull-request review is the approval mechanism.

## 13.5 Additional acceptance tests

### AT-07b Edit managed value

**GIVEN** a managed value is editable in Content Manager  
**WHEN** the editor saves a changed value  
**THEN** the managed store is updated  
**AND** the host page shows the new text after reload/HMR  
**AND** no silent product page-source rewrite occurs.

### AT-08b Request review

**GIVEN** Content Manager-owned changes exist on the current branch  
**WHEN** the editor requests review  
**THEN** a pull request is created or updated  
**AND** it contains the relevant diffs  
**AND** configured engineering reviewers are requested  
**AND** the editor receives the pull-request URL  
**AND** Content Manager does not merge the pull request.

## 13.6 Reference implementation gap

The inspected reference implementation does not yet provide:

- In-place edit and save of managed copy values.
- Request review / automatic pull-request creation.

Both capabilities are required by this specification for a complete rebuild, even though they are not present in the current reference code.
