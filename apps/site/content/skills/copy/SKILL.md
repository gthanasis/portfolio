---
name: copy
description: >-
  Write, rewrite, or translate blog posts, landing pages and marketing copy, in
  English and Greek. Use when the user asks to "write a blog post", "add a blog
  entry", "write landing page copy", "write marketing copy", or to punch up
  existing copy. Detects whether the site ships Greek and produces that version
  too, written natively rather than translated. For reviewing Greek copy that
  already exists, use greek-review instead.
---

# Blog & marketing copy

You are writing product marketing copy, not running a general SEO content mill.
A product page sells one thing (a plan, a feature, a use case) to one person
making a real decision. Every piece of copy should read like it was written by
someone who has actually lived the problem the product solves, not like the
output of a content calendar.

Read these on demand, not all up front:

- [references/voice.md](references/voice.md): the house voice. Read this
  first, every time. It is the single most important file in this skill.
- [references/structure.md](references/structure.md): title, meta
  description, heading, paragraph, and CTA structure.
- [references/editorial-checklist.md](references/editorial-checklist.md):
  the pass before you call a draft done. AI-slop patterns, banned words, the
  no-em-dash rule, a short quality checklist sized for a small product blog
  (not a 100-point SEO scoring machine).
- [references/translation.md](references/translation.md): EN<->EL
  translation rules and the Greek cultural-adaptation profile.
- [references/greek.md](references/greek.md): the rules for Greek copy that
  doesn't read as translated, and the pass for fixing Greek that does.
- [references/greek-learnings.md](references/greek-learnings.md): a
  running log of real Greek corrections, not a predicted rulebook. Skim it
  before writing Greek copy, append to it after every human correction.
  This is the actual mechanism that improves Greek quality over time; the
  written rules in `translation.md` only get partway there.

## Step 0: Languages and content locations

Read `.claude/tg.json`:

```jsonc
{ "copy": { "locales": ["en", "el"], "contentDir": "path/to/messages" } }
```

If it's missing, detect it: an i18n config, a `locales/` or `messages/`
directory, framework i18n settings, or existing translated content. Find where
blog posts live (a content directory, an MDX folder, a TypeScript data file)
and where marketing-page strings live (usually one message file per locale
under `contentDir`). Confirm what you found before writing, and offer to record
it in `.claude/tg.json`.

**If the site ships Greek, write the Greek too.** Not as a translation pass
afterwards, but as its own piece, following `references/greek.md`. A Greek page
that reads as translated English is worse than no Greek page.

## Where content lives

- **Blog posts**: wherever the repo keeps them (see Step 0). If a post has a
  locale-independent structure (slug, dates, related posts) with per-locale
  copy objects, **never let the locale objects drift in structure**: same
  number of sections, same presence or absence of callouts and lists,
  different words only.
- **Marketing page copy** (pricing, feature and use-case landing pages,
  footer, etc.): the per-locale message files under `copy.contentDir`. Keep
  every locale's keys in lockstep: every key added to one gets added to the
  others, same nesting, same interpolation placeholders (`{limit}`,
  `{name}`, etc.).
- Check the repo's own house rules (CLAUDE.md, contributing docs, existing
  lint rules for copy) before writing, and don't contradict them.

## Workflow

1. **Read 2-3 existing posts or the page you're extending first.** Don't
   write from the schema alone; the voice only comes through in examples. If
   the content lives on another branch, `git show <branch>:<path>` works
   without checking it out.
2. **Draft one locale first, but never "translate" the second one
   sentence by sentence.** For any scene-setting copy (intros, quoted
   messages, anything with a concrete image), read the first draft once
   for the beat it hits, then close it and write the other language's
   version from scratch, imagining the scene natively rather than
   rendering the sentences. A real shipped Greek intro read as calque
   ("buried under dog photos" translated literally, English clause order,
   formal "πρόκειται να" register in casual copy) precisely because it was
   produced by translation instead of native drafting. See
   [references/translation.md](references/translation.md)'s calque case
   study before writing any Greek scene-setting copy.
3. **Run the editorial checklist** in
   [references/editorial-checklist.md](references/editorial-checklist.md)
   before presenting the draft.
4. **Ask before inventing product facts.** Pricing, limits, plan names, and
   feature availability must come from the actual code (the pricing page,
   the payments catalog, the feature itself) or from the user, never
   guessed. A blog post that states a wrong price is worse than no blog post.
5. If adding a new blog post and the blog has related-post links, wire the
   new post into 1-2 existing posts too. Posts don't get "Read next" links
   for free.
6. **Greek requires a human pass, and not a same-breath one.** The model's
   own sense of natural Greek register is not reliable enough to
   self-certify. That's precisely the failure mode documented in
   `translation.md`'s calque case study: grammatically correct Greek that
   no native speaker would actually write, and the model didn't catch it,
   twice. Present new or changed Greek copy to the user (or another native
   speaker) before treating it as done. If reviewing your own Greek draft
   without the user in the loop yet, do it as a genuinely separate pass
   (see `greek-learnings.md`'s "fresh eyes" note), not immediately after
   writing it in the same turn. Self-review right after drafting is
   demonstrably unreliable here.

## What this skill deliberately does not do

No keyword-density targets, no 100-point SEO scoring rubric, no citation-tier
bibliography, no schema/JSON-LD generation, no fabricated statistics with
fake sources. This is for a small product blog run by a small team, not an
enterprise content operation; match the effort to the venue. If a claim needs
a statistic, use one you can actually verify or cut it.

## Attribution

The structural guidance in `references/structure.md` and
`references/editorial-checklist.md` was adapted (not copied verbatim) from
the MIT-licensed [`AgriciDaniel/claude-blog`](https://github.com/AgriciDaniel/claude-blog)
skill suite, trimmed to what fits a small product blog, with the scoring
apparatus and enterprise SEO machinery removed. The Greek locale profile in
`references/translation.md` is original; the source repo had no Greek
profile.
