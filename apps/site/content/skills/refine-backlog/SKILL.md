---
name: refine-backlog
description: >-
  Walk an aging GitHub backlog ticket by ticket, verify each one against the
  code as it is now, and decide with the user whether to close, keep, repurpose,
  split or re-home it. Use when the user says "let's refine the backlog", "go
  through the open issues", "the backlog is stale", "clean up the tickets", or
  pulls one ticket and asks whether it's still worth keeping. Oldest first, one
  at a time, the user decides. Closes, rewrites and relabels issues via `gh` —
  this is not read-only.
---

# Refine the backlog

A backlog does not rot evenly. It rots **by age**, because the product moved and
the tickets didn't. So this is not a triage sweep over everything — it is a walk
from the oldest ticket forward, and the yield drops off sharply once you reach
tickets written against the current shape of the product.

Two things make it work, and both are easy to skip:

**Verify every ticket against the code before summarising it.** The ticket is a
claim about the product made weeks ago. Treat it as a hypothesis. A real share
of them are already done, already fixed by something else, or describe a
mechanism that no longer exists.

**The user decides.** You investigate, explain and recommend. Keep or remove is
theirs. Never close a ticket they haven't ruled on.

## Step 0 — Load config and take the snapshot

Read `.claude/tg.json` for `tickets.repo` and the label axes. If it's missing,
derive the repo from `git remote` and the taxonomy from `gh label list`.

Read `references/conventions.md` in the `new-ticket` skill — the same taxonomy
governs rewrites. In particular: **exactly one `project:` area label**, and
milestones are for things that end.

Then establish the ground truth, and say the number out loud:

    gh issue list --state open --limit 300 \
      --json number,title,createdAt,labels,milestone \
      --jq 'sort_by(.createdAt)[] | "\(.number)\t\(.createdAt[0:10])\t\(.title)"'

Note the opening count. You will report progress against it, and it is the one
number the user cares about at the end.

**Check out the current release branch first**, not `main`. Work merged into a
release has not reached `main` yet, so a ticket that looks open against `main`
may already be fixed. Issues labelled `in-release` are *done*.

## Step 1 — Pull one ticket

Oldest unrefined first. One at a time, unless the user asks for a cluster —
offer a cluster when three or four tickets are the same build or the same
decision, and let them choose.

Read the full issue body. Then **go and look at the code it describes.**

## Step 2 — Verify, and expect to be surprised

This is the step that earns the session. Check, in roughly this order:

**Is it already done?** Find the code that would exist if it were. Work finishes
and tickets stay open — this is the single most common finding. When it is done,
say so and recommend closing as *done*, with the file and line as evidence.

**Has something superseded it?** Search for a newer ticket covering the same
ground before rewriting anything (`gh issue list --search`). Rewriting a ticket
that another one already replaced wastes the work and confuses the trail.

**Do the paths and symbols still exist?** Ticket bodies name files, components
and spec paths. Directories get flattened, components get deleted, wizards get
replaced. A ticket pointing at something gone is usually describing a product
that no longer exists.

**Did a neighbouring ticket solve half of it?** A transport, a pattern, a
primitive built for another feature often answers the design question this
ticket was still asking. Say which ticket, and cut the obsolete half.

**Does the premise still hold?** Sometimes the thing it complains about was
fixed as a side effect. Check the actual claim, not the title.

**Is it in the right place?** Wrong milestone, wrong labels, no priority,
`spike` on something already decided. A ticket in the wrong milestone is
invisible; one labelled `question` when it has acceptance criteria and a
reproduction is live breakage filed as an open question.

## Step 3 — Explain it, in the fewest possible lines

Then, and only then, present it. Every time, in this shape:

1. **What it is**, in plain terms. Not the title reworded — what a person would
   actually experience.
2. **How old it is.** Say the age in weeks or days. This is what makes "remove"
   easy to say, and it is the one fact the user asks for if you leave it out.
3. **What the code says now** — including, explicitly, where the ticket is wrong.
4. **Your recommendation**, and the reason in one sentence.
5. **Keep or remove?**

Then stop and wait. Do not pull the next ticket in the same message.

Be brief. A refinement session is dozens of these; a wall of text per ticket
makes the user stop reading by the fifth one.

## Step 4 — Act on the decision

Five outcomes, not two:

**Close.** Comment with *why* before closing — what you verified, what no longer
holds. The comment is the record; a bare close loses the reasoning. When it was
already built, say so and name the evidence.

**Keep.** Usually means rewriting the body so it describes the current product,
and fixing the labels. A kept ticket that still lies is worse than a closed one.

**Repurpose.** The area is real, the described work isn't. Rewrite it into the
ticket the code actually needs — same number, new content, and a line saying
what it used to be.

**Split or fold.** Split when one ticket holds two decisions with different
risk (reversible vs irreversible, ship-now vs legally loaded). Fold when two
tickets are one build — close one, absorb it into the other, and say so on both.

**Re-home.** Right work, wrong place. Change the milestone, the labels, the
priority. Comment on what moved and why; a silent relabel reads as a mistake.

Whichever it is: **write the decision on the ticket.** Product decisions made in
chat and not recorded anywhere are the reason the backlog drifted.

## Step 5 — Carry the decision into the specs

When the user settles something that contradicts a spec — a concept removed, a
strategy abandoned, a mechanism cut — the spec is now wrong, and it is what the
next person or agent reads first.

Either edit the spec in the same pass, or file a documentation ticket naming the
exact lines. Do not leave a decision living only in a closed issue.

## Step 6 — Watch for the cross-cutting pattern

Some findings are invisible from any single ticket and only appear across a
session. Collect them as you go and raise them separately:

- **The same missing dependency** behind several tickets — they are one piece of
  infrastructure and should be landed together. Cross-link them both ways.
- **Silent failures**: config that, when unset, degrades to a stub, a default or
  a no-op instead of refusing to start. Each looks healthy and does nothing.
- **A feature with no spec.** If the largest thing in flight appears nowhere in
  `specs/`, that is a finding, not a chore.
- **Write-only state** — a field, toggle or preference that persists and has no
  consumer. A control that lies to the person using it.
- **A ratio that is a product signal**, not a bug: where almost all feedback is
  an error, or a tier's tickets all ship before the tier that supposedly
  precedes it.

Offer these as new tickets. Don't file them without being asked.

## Rules

- **Never close a ticket the user hasn't decided on.** Not even an obviously
  dead one.
- **Say when you were wrong.** If you reported something and the code says
  otherwise, correct it on the ticket with a comment, plainly, and move on. A
  wrong claim left standing on an issue becomes someone's next bad decision.
- **Re-verify after a gap.** If the session resumes days later, re-check against
  the current branch rather than trusting earlier findings. Merges land in
  between.
- **Use `Refs #N`, never a closing keyword** when cross-referencing — GitHub
  closes on "does not close #N" too.
- **Don't propose merging the release branch.** Report what is in it and move on.
- **Report the count.** Opening number, closing number, and how many closed
  because the work was already done. That last figure is the argument for doing
  this again.

## Finishing

When the backlog is walked, give the user the tally — closed, kept, repurposed,
split, filed — and the decisions recorded. Then offer, once, the cross-cutting
tickets from Step 6 that they haven't already taken.

If they want the result as something to look at or share, a roadmap grouped by
what blocks what is far more useful than a list grouped by milestone.
