# EN <-> EL translation

These rules cover a site with two locales, `en` and `el`. Don't build for more
than the site actually ships. The rules cover both directions since content
sometimes starts in Greek.

## Principles

1. **Localize, don't transliterate.** Translate the *beat*, not the words.
   If a literal translation of a callout sounds flat or awkward in the
   target language, rewrite it to land the same punch differently. Good
   Greek posts are not word-for-word renderings of the English ones (or vice
   versa); check the shipped content before assuming otherwise.
2. **Preserve structure, never content shape.** Same number of sections,
   roughly the same paragraphs per section, same presence of lists and
   callouts. Different words, same skeleton. If posts are stored as one
   record with a separate full content object per locale, the objects should
   be index-for-index parallel.
3. **No mixed-language sentences** other than genuinely established
   loanwords people actually use in speech (e.g. Greek speakers say
   "group chat", "catering", "link" untranslated; that's fine, it's how
   people talk, not a translation shortcut).
4. **Never translate slugs or hrefs.** Slugs, route hrefs and related-post
   references are locale-independent identifiers; only the per-locale
   content changes.
5. **Idioms get replaced with local equivalents, never translated
   literally.** "Buried under dog photos" needs a Greek image that lands the
   same way, not a literal rendering if that reads oddly.

## Greek locale profile

The SEO tooling this skill's structure was adapted from ships locale profiles
for German, French, Spanish, and Japanese, but not Greek. This profile is
original.

- **Formality**: pick one and keep it site-wide. A consumer product for
  people organizing their own lives usually wants informal (`εσύ`, not
  `εσείς`), peer-to-peer tone, not corporate-to-customer. Match the register
  of the site's existing Greek copy, and if it's inconsistent, flag that
  rather than adding a third voice.
- **Currency**: EUR, formatted `123,45€` or `0€` (comma decimal, symbol
  after the number). Don't use `EUR 123.45` US-style formatting in Greek
  copy.
- **Dates in body copy**: day-month-year, spelled with the Greek month name
  when written out ("7 Αυγούστου"), numeric `DD/MM/YYYY` when compact.
  Never `MM/DD/YYYY`.
- **Quotes**: prefer «...» (guillemets) for quoted speech in formal
  contexts, but good copy mostly avoids quoting altogether in favor of
  direct statement. When quoting a literal message someone might send,
  use "...", but see the calque case study below: a quoted fake text
  message is the single easiest place for this to read as translated.
- **Numbers**: comma as decimal separator, period or space as thousands
  separator (`1.234,56`).
- **CTA tone**: direct, warm, imperative on the reader's action: "Δες τα
  πρότυπα", "Φτιάξε την πρόσκλησή σου", not a softened "Μπορείς να
  φτιάξεις...". A Greek CTA should feel just as direct as its English
  counterpart; don't add hedging politeness that isn't in the English
  version's tone.
- **No brand-example substitution** if the product is itself aimed at the
  Greek market. Guidance from other locale profiles about swapping in local
  retailers, banks and brands (DACH, Francophone, etc.) doesn't apply;
  ignore that entire category.

## Calque case study: read this before writing any Greek scene-setting copy

A shipped blog post's Greek intro was flagged by a native speaker as
something "a Greek product would never write": grammatically correct but
structurally translated. This is the actual passage, and it is a documented
**bad** example, not a style reference:

> "Είναι Τρίτη, το πάρτι είναι Σάββατο, και ακόμα δεν έχεις στείλει τίποτα.
> Ξέρεις τον τύπο μηνύματος που πρόκειται να στείλεις: «Ελάτε Σάββατο σπίτι,
> γενέθλια της Μαρίας, θα σας πω ώρα». Κανείς δεν απαντάει σε αυτό. Θα το
> δεις μετά από τρεις μέρες, θαμμένο κάτω από φωτογραφίες σκύλων."

What's wrong with it, specifically:

1. **Clause-order calque.** "Είναι Τρίτη, το πάρτι είναι Σάββατο" mirrors
   English's "It's Tuesday, the party is Saturday" stacked-clause rhythm.
   Greek scene-setting doesn't open by stacking two bare day-labels like
   that. Restructure the whole sentence in Greek word order; don't map
   clause-for-clause onto the English original.
2. **Register calque.** "πρόκειται να στείλεις" is written/formal register
   ("is about to send"). Casual consumer copy in Greek uses θα ("θα
   στείλεις"), plain and colloquial. Any sentence that reads more like a
   news article or a contract than a text to a friend is a register calque,
   even if the grammar is flawless. Watch for "πρόκειται να", "καθώς",
   "ωστόσο", "συνεπώς" showing up in casual copy; they're markers of
   translated-from-English formal register, not organic spoken Greek.
3. **The quoted fake message calques the English SMS shorthand.** "Ελάτε
   Σάββατο σπίτι, γενέθλια της Μαρίας, θα σας πω ώρα" reproduces the
   English original's comma-listed telegram style ("Come over Saturday,
   Maria's birthday, will tell you the time later") almost clause for
   clause. A fake quoted text message has to be *imagined* as something a
   Greek person would actually type, independent of what the English
   version's fake text says.
4. **The image itself doesn't translate.** "θαμμένο κάτω από φωτογραφίες
   σκύλων" ("buried under dog photos") is an Anglo internet/group-chat
   in-joke; it carries no meaning in a Greek context. This is the clearest
   tell: when an idiom or cultural image gets carried over even though the
   words are correctly translated, the sentence was assembled by
   translating the English original, not by imagining the scene in Greek
   from scratch.

**The fix isn't a wording polish, it's a process fix**: Greek scene-setting
copy (intros, quoted messages, anything with a concrete image or cultural
reference) must be **imagined directly in Greek**, not translated from an
English draft. Read the English version once for the *beat* it's hitting
(what moment, what emotional note), then close it and write the Greek
version as if the English never existed. Only after both exist
independently, check them against each other for structural parity
(section count, callout presence), never for phrase-level correspondence.

If you (the model) are unsure whether a Greek sentence you just wrote is
calque or native, that uncertainty is itself the signal: flag it to the
user rather than shipping it. Native-speaker register judgment is exactly
the thing that failed here; don't rely on your own confidence as
verification. See SKILL.md's "Greek requires a human pass" note.

## Quality checklist before calling a translation done

- [ ] No untranslated English sentences left in the Greek version (loanwords
      like "link", "group chat", "catering" are fine, full sentences are
      not).
- [ ] No Greek sentences left partially in English in the reverse direction.
- [ ] Both locale versions have matching section counts, and matching
      list/callout presence per section, index for index.
- [ ] Currency, date, and number formatting match the Greek locale profile
      above, not a literal carry-over of English formatting.
- [ ] Read both versions once each without comparing to the other. Do they
      both sound like something a person would actually say, not like a
      translation? If either sounds stilted, rewrite that direction, don't
      just polish the wording.
- [ ] The callout in each language lands as a standalone quotable line. If
      one direction's callout reads flat, it was translated too literally;
      rewrite it in that language directly.
