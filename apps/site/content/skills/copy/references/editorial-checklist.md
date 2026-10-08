# Editorial checklist

Run this before presenting a draft as done. It's a pass/fail read-through,
not a scored rubric. A small product blog doesn't need a 100-point score, it
needs copy that doesn't sound like everything else on the internet.

## Hard rules (fix, don't just flag)

- [ ] No em dash (`—`, U+2014) anywhere. Split the sentence, or use a
      comma, colon or period instead.
- [ ] No banned phrases from `voice.md` ("unlock", "seamless",
      "game-changer", "leverage" as a verb, "in today's [x] landscape",
      "dive into" / "delve", "comprehensive guide", "furthermore" /
      "moreover", "cutting-edge", "robust", "tapestry").
- [ ] No sentence starting with "At [Product], we...". The product is
      never grammatically the subject of a sentence about itself.
- [ ] No fabricated statistics or made-up numbers presented as fact. If a
      number can't be verified against the actual product or pricing, cut
      it or make it a stated assumption ("say roughly 80 guests").
- [ ] All locale versions have the same number of sections, and the same
      sections have a list or callout present or absent. Only the words
      differ, never the shape (see SKILL.md).
- [ ] **Greek calque check** (see `translation.md`'s case study for the
      real example this rule exists because of): read every Greek sentence
      on its own, no English next to it. Flag anything that (a) stacks
      clauses in English word order instead of Greek word order, (b) uses
      written or formal verbs like "πρόκειται να", "καθώς", "ωστόσο" in
      casual copy instead of θα + plain phrasing, (c) quotes a fake text
      message or DM that reads like a translated English text rather than
      something a Greek person would actually type, or (d) carries over an
      idiom or cultural image (like "buried under dog photos") that means
      nothing in a Greek context. This is a hard rule, not an optional
      pass: if you can't confidently rule out calque, say so to the user
      instead of shipping it.

## Structural repetition (the two-tier check)

Adapted from a much larger "AI slop" methodology: phrase-level cleanup
catches obvious tells, but a draft can pass a phrase check and still read
generic because of *structural* repetition a vocabulary swap doesn't fix.
Read the whole draft once for each:

**First pass, phrasing**: the banned-phrase list above, plus any
"Furthermore/Moreover/Additionally" used as a transition crutch, and hedge
stacking (several of "may", "often", "typically", "generally", "usually"
within one paragraph).

**Second pass, structure and rhythm**: read for these, they survive a
word swap.

- Every section heading ends in a question (question-cadence overload).
  Mix declarative, question, and stance headings.
- Every paragraph opens with the same construction ("Here's why...", "Here's
  how...") repeated across the post.
- A `[clause], [clause], [clause]` three-part rhythm repeated sentence after
  sentence; it starts to sound metronomic. Vary sentence length.
- "While X, also Y" or "On one hand X, on the other Y" framing where there's
  no real contrast. It's padding disguised as nuance. Cut it.
- Every list item is suspiciously the same length (symmetric list bloat).
  Vary detail to match what each point actually needs.
- A closing rhetorical question on every single post ("So, what are you
  waiting for?"). Earn a question if you use one, don't default to it.

## Concreteness check

- [ ] Every section has at least one specific, sensory, or numeric detail
      (see voice.md rule 4). A section with zero concrete details reads as
      filler, even if grammatically fine. Rewrite it or cut it.
- [ ] The callout (if present) is a quotable single line, not a summary
      sentence restating the paragraph above it.

## Facts check

- [ ] Any claim about pricing, plan names, limits, or feature availability
      is verified against the actual code (the payments catalog, the
      pricing page, the relevant feature), or flagged to the user as
      unverified rather than stated as fact.
- [ ] Links (CTA hrefs, related-post links) point to routes that actually
      exist.

## Attribution

The two-tier phrase/structure methodology above is adapted from the
MIT-licensed `AgriciDaniel/claude-blog` skill (itself adapting a UI-design
"design slop" methodology from Paul Bakaus's `impeccable` plugin, Apache
2.0). The specific banned-phrase list and rules here are trimmed and
rewritten for this voice, not copied verbatim.
