# Structure

Trimmed from a much larger enterprise SEO rulebook down to what a small
product blog actually needs. No word-count targets, no citation-tier
bibliography, no schema generation, no keyword-density math. This is copy
for humans landing from a search result or a share link.

## Title

Formula: `[The scene or stance], not [the topic label]`. Compare:

- Generic (avoid): "Online wedding invitations: the complete guide"
- Better: "The wedding invitation that stops you guessing your own
  numbers"

**This formula is unconfirmed for Greek tutorial titles.** The one
user-corrected example so far replaced a stance-shaped Greek title with a
flat "how to X with Y" ("Πως να φτιάξεις ένα προσκλητήριο γάμου με RSVP"),
no stance clause. See `greek-learnings.md` entry 5. For Greek titles on
straightforward how-to tutorial posts specifically, default to the plain
formula unless told otherwise; the stance formula may still hold for
Greek narrative or angle posts, that hasn't been tested either way.

A good title survives being read alone in a list of ten other titles. It
should make someone want to click *this one*, not describe the category.

## Meta description

This field usually does double duty: it's the `<meta name="description">`
**and** the blurb on the blog index card, so it has to work standalone,
without the title next to it for context in some layouts.

Pattern: name the reader's actual friction point, then promise the
resolution in a way that's specific to this post, not generic.

> "The caterer wants an exact number by Friday. 'I think around 80' isn't
> an answer. See how an online invitation gives you the real number, not a
> guess."

Keep it under ~200 characters. No keyword stuffing, no "Learn everything you
need to know about X".

## Eyebrow

If the design has one: a short all-caps tag above the title (`ΓΙΑ ΤΗΝ ΩΡΑ
ΤΗΣ ΚΡΙΣΗΣ`, "FOR THE LAST-MINUTE HOUR"). It sets tone and angle in 2-4
words; it is not a category label like "WEDDINGS". Write it last, after the
post's angle is locked.

## Intro

1-2 short paragraphs, no heading. This is the scene-setting beat from
`voice.md` rule 1. It should be readable as a stand-alone hook even before
any section loads.

## Sections

- **Heading**: may be optional in the schema but is almost always present
  in practice, and stance-shaped (see voice.md rule 7).
- **Paragraphs**: usually 1, sometimes 2. If you're reaching for a third
  paragraph in a section, it's probably two sections.
- **List**: only when there are genuinely parallel, scannable items (e.g. "5
  things a good invitation covers"). Don't force a list where a sentence
  reads better.
- **Callout**: one per section, at most. See voice.md rule 6. Not every
  section needs one; use it where the section's point compresses into a
  single quotable line. A callout on every single section starts to feel
  mechanical, vary it.

## Heading hierarchy on marketing pages (non-blog)

For pricing, feature and landing pages rather than blog posts: `h1` once
(page title), then section headers in order with no skipped levels. Keep the
same "stance over label" rule for section titles here too (compare "Just
want our branding off it?" to a generic "Add-ons").

## CTA placement

- One primary CTA per page, placed after the reader has seen enough to want
  it, never above all context. On a pricing or landing page this is usually
  the final block; on a blog post it's the natural end, sometimes reinforced
  by one contextual CTA mid-post if the post is long.
- CTA copy names the action, not "click here" or "learn more": "See the
  templates", "Start your invitation", "Δες τα πρότυπα". Prefer a verb the
  reader is about to actually do.
- Make it a real link (your framework's link component, styled as a button
  if needed), not a `<div onClick>`.

## What to skip entirely

- Schema/JSON-LD generation, citation tiers, "8+ sourced statistics"
  requirements, Flesch-Kincaid score targets, image-frequency quotas,
  internal-linking density targets. Those come from an enterprise SEO
  content-scoring rubric a small product blog doesn't need. Link to related
  posts because it's genuinely useful navigation, not to hit a count.
