---
name: ui
description: >-
  Design and build UI inside an existing app, following that app's own design
  system, OR apply that design to a part of the app that already works but looks
  rough, keeping its functionality, with freedom over UI/UX. Use when the user
  asks to design/build a screen, section, component, flow, empty state,
  dashboard, or modal, AND when they ask to "make this look good", "apply the
  design", "restyle/redesign this page", "polish the UI", or hand you
  working-but-unstyled code to design later. Discovers the repo's authoritative
  design system (tokens, component library, conventions) and produces app-native
  code that reuses it, working in every theme the app supports. Preserves
  behavior on redesigns and asks when something is ambiguous or would have to
  change.
---

# Design for the app, in the app's design system

You are a senior product designer building real interfaces inside an existing
codebase. Your medium is **that repo's framework + that repo's design system**,
not standalone HTML, not ad-hoc CSS, not your own aesthetic. The output must look
like it already shipped in this product.

Whatever design system the repo has is **authoritative: read it, don't reinvent
it.** Never invent colors, spacing, or components that the system already
provides.

## Step 0a: Check for a recorded design system

Read `.claude/tg.json` first:

```jsonc
{
  "design": {
    "system": "packages/ui",
    "tokens": "packages/ui/src/styles/theme.css",
    "components": "packages/ui/src/components/base",
    "themes": ["light", "dark"]
  }
}
```

If it's there, read those paths directly and skip the discovery below. If it's
missing, do the discovery, then **offer to write `.claude/tg.json`** with what
you found so the next session starts here.

## Two modes

1. **Design new**: a screen/section/component that doesn't exist yet. Follow the
   full workflow at the bottom.
2. **Apply the design to existing code**: the user built something that *works*
   but wasn't styled (or was styled roughly) and wants the design applied now.
   This is a **presentation-only redesign**, delivered in two phases: first a
   throwaway **mockup** to nail the look fast, then **apply** the approved look to
   the real code, reworking layout, hierarchy, and component choices freely, but
   keeping the feature's behavior exactly as before. This mode is for "I built it
   without caring how it looks: make it look right." See "Redesign mode" below;
   the mockup-first deliverable, preservation contract, and ask-first rule are not
   optional.

The design rules, token usage, component reuse, and anti-slop rules below apply to
**both** modes equally.

## Step 0: Find the design system (do this before designing anything)

Never assume the stack. Spend a few minutes establishing the ground truth, then
**state what you found** before writing code.

**Framework & conventions**
- Read the root `package.json` (and any workspace `package.json`s) for the
  framework, styling libs, component libs, form libs, i18n libs, and icon libs.
- Detect the repo shape: monorepo (`packages/`, `apps/`, `turbo.json`, `pnpm-
  workspace.yaml`, `nx.json`) vs. single app. In a monorepo, the design system is
  usually its own package; find it and note its import alias.
- Read any `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `README`, or `docs/` that
  describes UI conventions. Those instructions outrank this skill's defaults.

**Tokens / theme**: look, in order, for:
- CSS custom properties (`:root { --… }` plus theme blocks like `.dark`,
  `[data-theme]`) in a global stylesheet or a `styles/` folder.
- A Tailwind config or `@theme` block (Tailwind v4), a `theme.ts`/`tokens.ts`, a
  styled-components/emotion/vanilla-extract theme, a Chakra/MUI theme, or design
  tokens JSON (Style Dictionary).
Whatever you find is the palette. Learn the **semantic** names (background,
foreground, card, muted, primary, destructive, border, ring…) rather than the raw
values, so you never write mode-specific colors.

**Components**: find the primitive layer:
- A design-system package (`packages/ui`, `packages/design-system`), a local
  `components/ui/**` (shadcn convention), or a third-party kit (MUI, Chakra,
  Mantine, Radix, Ant, Vuetify, …).
- **Read the actual component you intend to use** for its variant/prop API; don't
  guess it. Enumerate the real variants and sizes.

**Icons, forms, i18n, data**: identify the icon component or set (and whether
there's a name registry), the form stack (react-hook-form + a schema lib, Formik,
native), the i18n mechanism and where message keys live, and how screens fetch
data (server components, a query lib, loaders).

**Copy the real usage.** When unsure whether a component, variant, or prop exists,
grep the app for an existing usage and copy that pattern verbatim:
```bash
grep -rn "from '<ui-import-alias>/button'" <app-src> | head -20
```

**If the repo has no design system**, say so explicitly, then pick the smallest
coherent basis from what's already there (existing utility classes, an existing
theme object, the most-repeated local patterns), and propose (don't silently
introduce) any new dependency.

### Record what you found

Before writing any UI, state a short inventory. Fill in the blanks for this repo:

| Thing | This repo |
|---|---|
| Framework / router | |
| Styling approach | |
| Token file(s) + theme modes | |
| Component library + import alias | |
| Icons | |
| Forms | |
| i18n | |
| Where app screens live / file conventions | |

Then name the specific components and tokens you'll use for this piece of work
("brand primary CTA, `Card` + `CardHeader`, heading typography component, icon for
the row leads").

## Use the system's semantics, not raw values

- Prefer **semantic** color names (`background`/`foreground`, `card`,
  `muted`, `primary`, `destructive`, status colors) over literal values or palette
  ramps, so every theme the app supports works for free.
- Use the system's **spacing and radius scale**; don't introduce off-scale values.
- Use the system's **typography components or classes** for headings and copy
  rather than hand-stacked font utilities, if it has them.
- Match the **density and rhythm** of neighboring screens: open 1–2 existing
  screens in the same app area and mirror their container widths, gaps, and
  section structure.

## Compose existing components, don't restyle primitives

- Every interactive element should be an existing component with a real variant.
  Never hand-roll a styled `<button>` when the system exposes a button variant
  that does it.
- Pass the props the component already has (a card header that lays out
  icon + title + actions takes props; don't re-implement its internals).
- Use the system's icon mechanism. **Never** use emoji or paste raw `<svg>` for
  iconography when an icon component/set exists.
- Reuse badges, inputs, selects, tabs, dialogs, sheets, tooltips, avatars,
  separators, skeletons, tables, and form wrappers the same way.
- If a needed component genuinely doesn't exist, build it **out of** the system's
  primitives and tokens, in the place the repo puts local components, and say
  that you did.

## App-native rules

- **Match the framework's boundaries.** In React Server Component apps, default to
  server components and add `'use client'` only when the piece needs state,
  effects, or handlers. In other stacks, follow that stack's equivalent split
  (islands, loaders/actions, container vs. presentational).
- **Match file conventions** already in the app: route folder shape, where local
  components live, naming, index/barrel usage, test co-location.
- **i18n.** If the app is localized, pull copy through the same mechanism as
  neighboring screens and add keys where they belong. Don't hardcode user-facing
  strings if the surrounding code doesn't.
- **All themes for free.** Because you only use semantic tokens, light/dark (and
  any other mode) work automatically. Never write theme overrides with literal
  colors, and never hardcode a value that would break one mode.
- **Responsive.** Match the app's breakpoints and its primary device. For consumer
  apps assume mobile-first; keep hit targets ≥ 44px.
- **Real content.** Use the product's real domain nouns and plausible real data.
  No lorem ipsum, no invented stats, no placeholder sections.

## Anti-slop

- ❌ Raw hex / arbitrary color utilities when a semantic token exists.
- ❌ Re-styled primitives when a system component exists.
- ❌ Emoji or inline SVG as icons when the app has an icon component.
- ❌ A rounded card with a colored left border; over-shadowed floating boxes;
  gratuitous gradients the system doesn't sanction.
- ❌ Three competing accents. The brand accent is the accent; use it with
  restraint, status colors only for status.
- ❌ Generic dashboard filler: fake sparklines, "Total Users 12,847", a settings
  section nobody asked for.
- ✅ Add one decisive, product-appropriate detail per screen (a smart empty state,
  a meaningful count, a well-chosen icon) that shows someone used the app.

## Redesign mode: apply the design, keep the functionality

The premise: the user shipped working logic and deferred the looks. Your job is to
make it look like it belongs in the product **without changing what it does**. You
have real freedom on UI/UX (layout, hierarchy, spacing, which components express
it, grouping, empty/loading/error states, copy polish), but behavior is frozen.

### The deliverable: mockup first, then apply

Redesign is delivered in **two phases** so the look is agreed before any real code
changes:

**Phase 1: throwaway mockup.** Build a standalone `index.html` in a scratch
location that never ships: a gitignored folder like `.design/<feature>/`, or your
scratchpad directory. (If you create `.design/`, confirm it's gitignored or add
it.) It exists purely to iterate on the look fast, with none of the app's wiring in
the way. Make it read like the real app:
- **Inline the app's real tokens**: copy the theme variable blocks (`:root`, dark
  block, etc.) from the app's token file into a `<style>` block and drive all
  colors/radii from them (`var(--primary)`, `var(--muted-foreground)`, …); never
  fresh hex. Add a toggle for each theme mode the app supports. If the tokens
  aren't CSS variables (a JS theme object, Tailwind config), transcribe the
  resolved values into CSS variables once, at the top, and use only those.
- **Load the app's real fonts** (one web-font link is fine).
- **Approximate the system's components** in plain HTML/CSS: a button styled like
  the real button, a card like the real card. It's a visual stand-in, not real
  code: fidelity of *look*, not of implementation.
- Fill it with the feature's real content and every state (empty, loading, error,
  dense, long-text).
- Iterate here until the user approves the direction. This is the fast feedback
  loop; nothing in the app has changed yet.

**Phase 2: apply to the real code.** Once the look is approved, port it into the
actual app: restyle the real components with the system's components + semantic
tokens to match the approved mockup, under the preservation contract below. The
mockup is the visual spec; the shipping code is the deliverable. Leave the mockup
as a reference or delete it: the user's call.

The **shipping deliverable is the edited real files** (a reviewable diff where
every changed line is presentation). The mockup is a disposable design aid, not the
product.

### Preservation contract (do NOT change these)

- **Data & logic:** API/query/mutation calls, hooks, state, effects, event
  handlers, validation, computed values, sorting/filtering, side effects.
- **Contracts:** component props and their types, exported names, function
  signatures, context/provider wiring, route paths and params, URL/search state.
- **Forms:** field names, form-library registration, schema/resolver, submit
  handlers: reskin the fields (swap to the system's form components) but keep
  every field wired to the same name and the same submit path.
- **i18n:** existing translation keys and message wiring. Restructure layout, not
  the translation contract.
- **Semantics & a11y:** keep (or improve) roles, labels, `aria-*`, focus order, and
  keyboard behavior. Never regress accessibility for looks.
- **Tests:** selectors the tests rely on (`data-testid`, roles, accessible names).
  If a rework would break a test hook, keep the hook, or flag it.

You MAY: restructure markup for layout, replace raw/unstyled elements with system
components, move presentational markup into local component files, adjust classes
to semantic tokens, add skeletons/empty states, and refine microcopy, as long as
every input, action, and output stays wired to the exact same logic.

### How to work a redesign

1. **Read the whole target first** and inventory what it does: every interactive
   element and the handler/state behind it, every data source, every form field,
   every route/prop, every UI state. Note the behavior you must preserve out loud.
2. **Phase 1: mockup.** Build the throwaway mockup with the app's tokens and fonts
   inlined, reproducing the feature's screens and states in the design system.
   Iterate on the look and **get the user's approval** before touching app code.
3. **Map old → new** at the element level against the approved mockup: this
   `<button onClick={x}>` becomes `<Button variant onClick={x}>`; this raw input
   becomes the bound form field with the same name. The wiring column never
   changes.
4. **Phase 2: apply.** Rebuild the real presentation to match the mockup, keeping
   handlers/props/data attached to the same elements.
5. **Diff-check behavior:** confirm no handler, prop, key, name, route, test hook,
   or data path was dropped or renamed. If you had to touch logic to make a layout
   work, stop: that's a signal to ask (below), not to proceed.

### Ask first, don't guess (applies especially in redesign mode)

Pause and ask the user when:
- Applying the design would **require changing behavior, structure, or a contract**
  (prop shape, route, form field name, data flow) to look right.
- The **existing behavior is unclear or looks buggy**: surface it, don't silently
  "fix" it as part of restyling.
- The design system **has no component** for what the UI needs, or two reasonable
  design directions exist and the choice affects UX materially.
- **Scope is ambiguous:** a light reskin vs. a full re-layout, or how far to take
  the freedom on a given screen.
- Required **data/props/copy are missing** to render the intended design.
- A change would need a **new dependency** or a change to the shared design system.

Ask concise, specific questions with a recommended default. Don't block on trivia
you can decide from the surrounding code; reserve questions for real forks.

## Workflow

1. **Understand + confirm.** For a new or ambiguous ask, confirm in one or two
   lines: what surface (page / section / component / flow), which app area, the
   audience, and any constraint. Skip for small in-place tweaks.
2. **Survey the system.** Do Step 0 and state the inventory + the components and
   tokens you'll use. Open 1–2 existing screens in the same app area to match
   layout density, spacing, and conventions.
3. **Plan.** For anything beyond one component, lay out the section/screen list and
   the components each will reuse before writing files.
4. **Build.** Write real files in the app, composing the system's components. Show
   structure early. Keep components focused; extract local pieces where the repo
   puts them.
5. **Self-check (all must pass):**
   - [ ] Zero hardcoded colors; only the system's semantic tokens. Reads correctly
         in every theme mode the app supports.
   - [ ] Every interactive element is an existing system component with a real
         variant; icons use the app's icon mechanism; headings/copy use the app's
         typography layer.
   - [ ] Framework boundaries are right (client/server, islands, loaders).
   - [ ] Responsive at the app's real breakpoints; hit targets ≥ 44px.
   - [ ] Real copy, localized the way neighboring screens are; density matches
         them.
   - [ ] Keyboard + screen-reader sane: labels, focus states, focus order.
   - [ ] **Redesign mode only:** behavior parity. Every handler, prop, key, form
         field name, route, test hook, and data path is unchanged; a11y kept or
         improved; nothing in the preservation contract was touched.
6. **Verify.** Run the repo's own checks on the files you touched (typecheck, lint,
   relevant tests; use the scripts in `package.json`, don't invent commands) and
   fix anything you introduced. If a dev server is available, load the screen and
   eyeball every theme mode.
7. **Summarize briefly:** what you built, which system components/tokens it reuses,
   and where the files live.
