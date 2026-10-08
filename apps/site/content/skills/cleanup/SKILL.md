---
name: cleanup
description: >-
  Check whether existing code comments still describe the code, or only the road
  that led to it. Use when the user asks to "check comment health", "review the
  comments", asks whether a comment "belongs here" or "describes this file", says
  a comment reads oddly or defensively, or after a refactor when comments written
  during the work are still in place. Catches comments that argue with deleted
  alternatives, state rules belonging on the type they describe, or have gone
  stale against the code around them.
---

# Comment health

Comments rot differently from code. Code that no longer works fails a test;
a comment that no longer describes anything just sits there being believed.
This skill is for reading comments the way a stranger would: someone who
never saw the version being argued with.

## The one test

**Does this comment describe the code, or the road to the code?**

A comment written during a fix tends to argue with the thing being fixed.
That is right in a commit message, where the before-state is in the diff
beside it. It is misleading in a file, where it is not: the reader sees a
defence of a decision against an alternative they have never encountered,
and has to reconstruct a history they do not have in order to parse a
sentence about the present.

The commit message is where the road goes. The file gets the destination.

## Symptoms, in rough order of how often they show up

**Ghost arguments.** The comment defines the code by what it is not:
"rather than X", "not a Y sitting on top", "X was never required here",
"and not merely to avoid Z". If X is not visible from the file, the reader
is being argued at about nothing. Ask: would this sentence survive someone
who has never seen X? If not, rewrite it to state what the code does, and
keep the alternative ONLY if a reader is likely to reach for it themselves
(then it is a trap warning, which is forward-looking and earns its place).

The distinction is worth holding precisely:
- *"`background-blend-mode`, not `mix-blend-mode`, because we had a wrapper
  element before"*: ghost. The wrapper is gone.
- *"`background-blend-mode` blends only a box's own layers, where
  `mix-blend-mode` would reach past the element"*: trap warning.
  `mix-blend-mode` is what someone would plausibly switch to.

**History voice.** "used to", "once", "any more", "was the mistake", "before
this". Reliable tells. Some of these are load-bearing (a migration note on
a schema boundary genuinely needs to say what the old shape was), but most
are the author talking to their past self.

**Stacked blocks.** Two comment blocks in a row with no code between them
almost always means two moments in time, neither reconciled with the other.
Read them as a pair and ask what one thing they are trying to say.

**Misplaced rules.** A comment at a call site that states a rule about the
whole system. Rules belong on the thing they constrain (the type, the
field, the schema), where they are found by anyone who touches it and where
they cannot silently disagree with a second copy. What stays at the call
site is only the part that call site decides.

**Staleness.** The nastiest ones reference an escape hatch or a field that
was removed, often in the very commit that wrote the comment. Grep any
identifier a comment names. If it does not exist, the comment is lying.

**Density.** Count the lines that carry information someone would need to
change the code safely, against the total. Thirteen lines carrying four is a
rewrite, not a trim.

## How to run one

1. **Read the file whole.** Comments are judged in context; a paragraph that
   reads fine alone can be redundant with the one above it.
2. **For each comment, ask in order:**
   - Is it TRUE of the code as it stands right now?
   - Does it belong at this line, or on the type/field it describes?
   - Would it survive a reader who has never seen what it argues against?
   - What fraction of it is load-bearing?
3. **Verify before deciding.** Grep identifiers it mentions. Check whether
   the rule is already documented on the type. Do not trust the comment's
   own account of the code; read the code.
4. **Rewrite, do not just delete.** Most bad comments have a real fact
   buried in them. Lead with what the code does; keep the *why* only where
   it stops someone breaking it.
5. **Run typecheck and tests anyway.** Comment edits are usually safe, but
   these passes tend to travel with small code changes, and it is cheap.

## What good looks like

Lead with the fact. Follow with the constraint that is not visible from the
code. Stop.

```
/*
 * The grain is one of the surface's own background layers, multiplied over
 * its fill. Two CSS facts hold this up: a background clips to the box's
 * `border-radius` for free, so a rounded card keeps its paper inside the
 * curve with nothing extra; and `background-blend-mode` blends only a box's
 * own layers, where `mix-blend-mode` would reach past the element and
 * composite against the whole page behind it.
 */
```

Nothing there describes a previous attempt. The `mix-blend-mode` clause
survives because it is the property a reader might reasonably switch to,
not because it is what the code used to use.

## Watch yourself

The failure mode of this review is performing it and reproducing it: the
rewrite comes out shorter and still argues with the ghost. After rewriting,
read your own version against the same test before moving on.
