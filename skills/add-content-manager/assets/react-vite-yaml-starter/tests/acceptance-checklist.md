# V4 acceptance checklist

Use this after automated tests pass. Record pass, fail, or not applicable with evidence.

- [ ] AT-01 Managed search returns a managed value by visible wording.
- [ ] AT-02 Hardcoded search returns a scanned literal.
- [ ] AT-02b One search covers managed, hardcoded, shared, and traceable dynamic content; uncertain sources are flagged.
- [ ] AT-03 Usage counts match the generated index.
- [ ] AT-04 Configured preview links open the mapped host route.
- [ ] AT-05 Managed detail shows wording, implementation, usage, and not-found state.
- [ ] AT-06 Hardcoded detail shows every recorded file, line, and prop.
- [ ] AT-07 Promotion adds `indexed.K = L` and returns the managed reference.
- [ ] AT-07b Managed edit writes only the configured store and updates after reload/HMR.
- [ ] AT-08 Source literals remain unchanged after promotion.
- [ ] AT-08b Request review creates/updates a pull request when tooling permits, requests configured reviewers, returns its URL, and never merges.
- [ ] AT-09 A term with a definition persists and becomes searchable.
- [ ] AT-10 Term metadata updates; valid aliases sync to deprecated terminology according to the host adapter.
- [ ] AT-11 Rules add, update, remove, and reorder persist; full-set reorder is enforced by the host integration.
- [ ] AT-12 Deprecated terminology produces an advisory finding.
- [ ] AT-13 Glossary findings never rewrite product source.

Also verify that Content Manager is not linked from customer-facing navigation, save endpoints are local/development-only unless the host explicitly implements production write-back, and remaining untraceable content is listed for engineering.
