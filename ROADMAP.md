# Roadmap

## v0.1 — Schema foundation (current)

- [x] Monorepo scaffold (pnpm + Turborepo)
- [ ] `@deckohq/core`: all 10 block type Zod schemas
- [ ] `@deckohq/core`: Deck, Slide, Meta schemas
- [ ] `@deckohq/core`: Template, Theme schemas
- [ ] `@deckohq/core`: BlockRegistry, TemplateRegistry
- [ ] `@deckohq/core`: 22 built-in template definitions
- [ ] `@deckohq/core`: `validateDeck()`, `validateContent()`
- [ ] `@deckohq/core`: `parseGenerationStream()` SSE utility
- [ ] `@deckohq/core`: `deck.schema.json` build artifact

## v0.2 — Renderer

- [ ] `decko`: HTML renderer for all 22 templates
- [ ] `decko`: All 10 block type renderers
- [ ] `decko`: RichText → HTML (string + InlineNode[])
- [ ] `decko`: midnight theme tokens → CSS custom properties
- [ ] `decko`: Self-contained HTML output with inline CSS

## v0.3 — Browser runtime

- [ ] `decko`: Browser runtime bundle (keyboard nav, fullscreen)
- [ ] `decko`: Presenter mode (speaker notes, slide sync)
- [ ] `decko`: CSS fallback transitions (fade, pan, wipe, cut)
- [ ] `decko`: GSAP transition engine (optional peer dep)

## v0.4 — CLI

- [ ] `decko`: `decko render` — JSON → HTML
- [ ] `decko`: `decko validate` — validate deck JSON
- [ ] `decko`: `decko init` — scaffold a new deck.json
- [ ] `decko`: `decko watch` — re-render on file change
- [ ] `decko`: `decko generate` — calls decko-agent (requires agent server)

## v1.0 — Release

- [ ] All v0.x milestones complete
- [ ] ≥90% test coverage on all packages
- [ ] `SCHEMA.md` complete and reviewed
- [ ] `CONTRIBUTING.md` reviewed by at least one external contributor
- [ ] At least one community theme published using only the docs
- [ ] TypeScript strict mode passing throughout
- [ ] `registerBlock()` and `registerTemplate()` verified with published example plugin

## v1.1 — Themes

- [ ] Additional built-in themes: paper, terminal, bold
- [ ] Theme inheritance (`extends` chain)
- [ ] Per-block style overrides

## v2 — Editor and export

- [ ] `decko-editor`: embeddable React editor
- [ ] PPTX export
- [ ] PDF export
- [ ] Web editor UI
