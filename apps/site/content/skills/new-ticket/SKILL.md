---
name: new-ticket
description: >-
  Turn a raw note, bug report, or half-formed idea into a properly shaped GitHub
  issue: investigated, evidenced, and labelled to the repo's taxonomy. Use
  whenever the user hands over something to file rather than discuss: "open a
  ticket for this", "file this", "log a bug", "add this to the backlog", or
  pastes a note and asks where it goes. Investigates the cause before writing,
  assigns type/priority/area/size labels, and assigns a milestone only when an
  active delivery phase covers it. Creates issues and labels via `gh`, so this
  is not read-only.
---

# File a ticket

Specs live in GitHub issues, not in the repo. The issue body **is** the spec, so
the investigation happens here, at filing time, not later when someone picks it
up.

Read `references/conventions.md` before writing anything. It defines the label
axes, the label-vs-milestone rule, and the required body shape.

## Step 0: Load the repo's taxonomy

Read `.claude/tg.json` for `tickets`:

```jsonc
{
  "tickets": {
    "repo": "acme/app",
    "areaPrefix": "project:",
    "topicPrefix": "topic:",
    "requireSize": true,
    "activeMilestones": ["Checkout v2 · Payments", "Search · POC"]
  }
}
```

If the key is missing, derive it: `gh label list` for the taxonomy, `gh api
repos/:owner/:repo/milestones` for phases, `git remote` for the repo. Show what
you found, ask the user to confirm, and offer to write `.claude/tg.json` so this
step never runs again.

**If the repo has no taxonomy at all** (default GitHub labels only), stop and
offer to bootstrap it: the five axes from `references/conventions.md`, created
with `gh label create`. Don't file a well-formed issue into a repo that can't
route it.

## Step 1: Investigate before writing

This is the step that makes the ticket worth having.

For a **bug**: reproduce the claim against the code. Find the mechanism, not the
symptom. Name the commit that introduced it (`git log -S`, `git blame`) and the
exact line that is wrong or missing. If the code says the bug can't happen, say
so and ask rather than filing a fiction.

For an **enhancement**: read the code that would change, so the acceptance
criteria describe something buildable.

If investigation shows the thing is already fixed, or is a duplicate of an open
issue (`gh issue list --search`), say so and stop. Don't file it.

## Step 2: Decide where it belongs

Three outcomes, same as any triage:

1. **Fits an existing area**: file it, labelled. No permission needed.
2. **Needs a new `topic:` tag**: cross-cutting work that isn't an area.
   Propose the tag and what else would carry it; wait for a yes.
3. **Needs a new `project:` area or milestone**: a product decision. Stop and
   ask explicitly before creating anything.

Apply the label-vs-milestone rule from `references/conventions.md`: assign a
milestone **only** if one of the `activeMilestones` genuinely contains this work
and can close with it. An epic never gets a milestone. Most issues get none.

## Step 3: Write the body

Symptom -> Cause (with evidence) -> Fix -> Why it wasn't caught. Enhancements:
Symptom -> Acceptance criteria as a checklist. Full format and a worked example
in `references/conventions.md`.

Title format: `[area/feature] what is wrong, in plain words`. Match the
existing titles in the repo rather than inventing a scheme.

## Step 4: File it

    gh issue create --title "..." --body-file <tmp> \
      --label "bug,priority:p1,project:x,size:m"

Show the user the rendered body and the label set **before** creating it. After
creating, print the URL.

If you judged it `size:xl`, don't file one issue; propose the split into
several, each independently shippable, and file them only once the user agrees.

## Things that will bite you

- **Filing the symptom as the cause.** "Button does nothing" is a title, not a
  cause. If you can't name the mechanism, say the investigation was inconclusive
  rather than dressing up a guess.
- **Two area labels.** An issue belongs to one area. Spanning work is two issues
  or one issue plus a `topic:`.
- **Inventing a milestone** because the work feels big. Big is `size:l`, not a
  new phase.
