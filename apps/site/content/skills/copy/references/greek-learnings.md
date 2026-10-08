# Greek learnings log

A running log of real corrections, not a predicted rulebook. Web research
and abstract register rules get this skill partway there (see
`translation.md`), but the remaining gap only closes by catching real bad
output and recording the fix, the way a translator's style sheet grows over
years of edits, not from one research pass. Append to this file every time
a human corrects generated Greek; don't just fix the copy and move on.

Each entry: **rejected** (what was generated, why it read as calque or
cringe) -> **verdict** (accepted fix, or still open).

The entries below are the seed log, from a consumer events/invitations
product. Keep them; they're the evidence behind the rules. Add your own
underneath.

## Entries

1. **Rejected**: "Είναι Τρίτη, το πάρτι είναι Σάββατο..." (stacked
   English-order clauses), "πρόκειται να στείλεις" (formal register in
   casual copy), "θαμμένο κάτω από φωτογραφίες σκύλων" (literal English
   idiom, meaningless in Greek). Source: a shipped blog post intro,
   flagged by the user as "something a Greek product would never write."
   **Verdict**: confirmed bad, root-caused (see `translation.md` case
   study). No accepted fix yet at the time of this entry.

2. **Rejected (2nd attempt)**: replaced the dog-photos image with a
   constructed metaphor, "θαμμένο κάτω από δέκα «καλημέρες» με λουλούδια"
   (buried under ten good-morning-flower images), reasoning: this is a
   real, well-documented Greek WhatsApp/family-group-chat joke, so it
   should land. **User verdict**: "still a little cringe." **Why,
   inferred**: the image is culturally accurate but the sentence is still
   doing manufactured-clever copywriter work, reaching for an image
   instead of just stating the thing plainly. Register research (luben.tv)
   suggests Greek casual/youth voice favors blunt, action-driven, unadorned
   phrasing over constructed metaphor. Being *correct* about a cultural
   reference isn't sufficient if the sentence still reads as "trying."

3. **3rd attempt**: dropped the image entirely, "χαμένο μέσα στο chat"
   (lost inside the chat), on the theory that cutting the metaphor beats
   finding a better one. Backed by register research on luben.tv (a Greek
   satire/youth site): its headline style is blunt, action-driven,
   comfortable mixing in English loanwords, and actively avoids
   constructed-clever imagery, preferring ironic understatement. Applied to
   the shipped post. **Status**: applied, still not confirmed by a native
   speaker in this exact context; treat it as the current best attempt,
   not a settled answer. If corrected again, add another entry.

4. **New content** (3 new posts on adjacent occasions) applied the same
   blunt-over-metaphor principle throughout: plain θα, topic-fronted
   sentences, established loanwords (RSVP, story, dress code, catering,
   baby sitter, thread, tap) used freely instead of invented images, no
   constructed metaphors anywhere. Not yet reviewed by the user for this
   batch; flag as pending the same way.

5. **First confirmed accepted rewrite**: the user rewrote a how-to
   tutorial post (making a digital wedding invitation) directly, line by
   line. This is the highest-value entry in this file so far: it's not
   inferred from register research, it's what the user actually wrote.
   Concrete deltas from what the skill generated:
   - **Title**: the skill wrote "Πώς φτιάχνεις ένα ψηφιακό προσκλητήριο
     γάμου, και παίρνεις πραγματικά RSVP" (a two-clause stance-shaped
     title, per `structure.md`'s title formula). The user's rewrite: "Πως
     να φτιάξεις ένα προσκλητήριο γάμου με RSVP", a flat "how to X with
     Y", shorter, no stance clause, not even "ψηφιακό". **This contradicts
     `structure.md`'s title guidance for Greek tutorial posts**: the
     stance-shaped title formula may be an English-voice assumption that
     doesn't hold in Greek. Note also: the user wrote "Πως" without the
     accent (should be "Πώς"), corrected in the shipped version. Fast
     casual typing doesn't accent-mark question words reliably; that's
     not a register signal.
   - **Register is plainer and more commercial than the skill's default
     narrative-blog voice**: no scene-setting, no callouts, direct
     imperative-adjacent instructional Greek close to how a Greek SaaS
     landing page talks, not how the narrative posts talk. Sentences like
     "Το πλεονέκτημα με τα ψηφιακά προσκλητήρια είναι ότι..." are plain
     declarative explainer sentences, not scene/callout constructions.
   - **The user's rewrite uses "!" twice** ("...μείωση του χαρτιού!",
     "...απαντήσουν ζωντανά!"). `voice.md` never licensed exclamation
     points. This may be Greek-specific: casual/marketing Greek copy leans
     on "!" more readily than the equivalent English register does. Don't
     assume this transfers to English copy.
   - **Content, not just phrasing, was cut**: the "share one link" and
     "watch replies come in" steps were deleted outright (not reworded),
     and the detail list shrank from 5 items to 4 blunt nouns ("IBAN"
     instead of "gift registry or bank details, if you want them"). The
     lesson: for Greek tutorial copy, err toward fewer, blunter items over
     the fuller, hedged English phrasing; don't just translate the longer
     English list.
   - **"Ό,τι ερώτηση θες" instead of "whatever your wedding needs to
     know"**: dramatically shorter. Greek tutorial copy compresses more
     than English does for the same instruction; translating English
     list-item length 1:1 into Greek produces bloated items.
   - The English was then mirrored to match the new structure (4 sections
     instead of 6) per the locale-parity rule, but that mirroring is the
     model's inference, not user-confirmed; verify it separately if it
     matters.

6. **Rejected**: an invitation design set the names slot `Δανάη & Άρης`
   over an opener `Παντρεύονται!`, a straight carry-over of English
   "Jessica & Brennan / are tying the knot!". **User verdict**: "not proper
   greek." **Why**: Greek needs the article on proper names in a running
   sentence (`Η Δανάη και ο Άρης παντρεύονται`), and a slot the user fills
   can never carry an article or a case ending. The same fault was on three
   more designs (`{names}` over `σας προσκαλούν στον γάμο τους`).
   **Accepted fix**: first person with the names as a signature,
   `Παντρευόμαστε!` and `Σας προσκαλούμε στον γάμο μας`, with `μας` carried
   through the rest of the card. Promoted to rule 8 in `greek.md`.

7. **Rejected**: "επίσημο ένδυμα" for a black-tie dress code. **User
   verdict**: "does not sound right." **Why**: `ένδυμα` is a single
   garment, formal-register and bureaucratic; a dress code is
   `ενδυμασία`. **Accepted fix**: `επίσημη ενδυμασία`. (The English loan
   `Black tie` / `Dress code: black tie` is also common on Greek cards.)

## How to use this file

- Before writing Greek copy, skim this file for patterns already caught
  (formal-register verbs, stacked English clause order, constructed
  metaphor where blunt statement would read more native).
- After any human correction to generated Greek, add an entry here in the
  rejected -> verdict format, even if the fix seems small. The value is in
  volume over time, not any single entry.
- If a pattern shows up 2-3 times independently, promote it into
  `translation.md`'s Greek locale profile (or `greek.md`'s rules) as a
  stated rule. This file is raw material; those are the distilled version.

## Process fix this file exists to support

**Do not self-review Greek copy in the same pass that generated it.**
Whoever (or whichever agent turn) writes the Greek draft is the worst
judge of whether it reads as native: the phrasing looks fine because it
was just chosen. If working solo in one context, at minimum re-read the
Greek copy in a **separate turn**, after doing something else, not
immediately after drafting it. If spawning a sub-agent for review is an
option, give it only the Greek text and the ask ("does a Greek person
actually talk like this?"), not the English original or the drafting
context. Fresh eyes means genuinely fresh, not primed by the source text.
