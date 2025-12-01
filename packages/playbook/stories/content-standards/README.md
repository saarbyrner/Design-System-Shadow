# Content Standards Documentation

## Purpose

Structured, Storybook-ready guidelines for Content Standards: terminology, grammar, word choices, component microcopy, patterns, and contribution processes.

## Taxonomy

- `foundations/`: Core principles, glossary, inclusive & plain language anchors.
- `language-mechanics/`: Formal grammar, structure, formatting and syntactic rules.
- `word-choices/`: Decision guides for similar verbs/labels to ensure consistent UI wording.
- `components/`: Microcopy guidance for common UI elements (buttons, links, confirmations).
- `patterns/`: Flow-level guidance (forms, date pickers, empty states, notifications, onboarding, deletion).
- `contributing/`: Process, changelog, and extended handoff references.
- `images/`: Approved images/icons used (if any) by MDX pages; ensure correct relative paths if used in future examples.
- `scripts/`: Validation and future automation (run `validate-content.sh` in CI/pre-commit).
- Root `README.md`: High-level orientation; do not surface inside Storybook unless desired.
- Root `index.mdx`: Authoritative navigation entry with relative links for all active pages.

## Page Contract

Each active `.mdx` page contains frontmatter (title, description, category, order, keywords), a single H1, `<Meta title="Content Standards/[Category]/[Page]" />`, structured sections, examples, and related links.
