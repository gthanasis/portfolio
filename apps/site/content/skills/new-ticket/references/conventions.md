# Issue conventions: labels, milestones, and the shape of a ticket

This is the house taxonomy. `tg:new-ticket` writes to it; `tg:pick-ticket` reads
from it. A repo overrides any of it in `.claude/tg.json`.

## The one rule that decides label vs milestone

**Milestones are for things that end. Labels are for things that are ongoing.**

Before creating or assigning a milestone, ask: *what has to be true for this to
close?* If you can answer in one sentence, it's a milestone. If you can't, it's
a label.

- "Checkout v2 · Payments" -> closes when the new checkout takes card and
  wallet payments in production. **Milestone.**
- "AI platform" -> closes when the AI is... good? No finish line. **Label.**
- "Payments" -> the payments area is permanent; it never closes. **Label.**
- An epic (`size:xl`) -> spans phases by definition. **Label, never a milestone**:
  an epic in a milestone holds that milestone open forever.

So: **label = which area, milestone = which delivery push.** A milestone that
merely restates an area label is redundant; delete it and let the label carry it.

## The five label axes

Every issue carries **type + priority + area**. Most carry **size**. State labels
are applied by the workflow, not at creation time.

| Axis | Values | Required |
|---|---|---|
| Type | `bug`, `enhancement`, `tech-debt`, `spike`, `documentation` | yes |
| Priority | `priority:p0` urgent / `p1` must-have / `p2` nice-to-have | yes |
| Area | `project:<name>`, exactly one | yes |
| Size | `size:s` / `m` / `l` / `xl` | yes, unless a spike |
| Topic | `topic:<name>`: cross-cutting, optional, any number | no |
| State | `in-progress`, `in-release`, `uat-passed`, `blocked`, `manual-only`, `ideation`, `go-live` | applied by workflow |

**Exactly one area label.** If work spans two areas it is two issues, or one
issue in the area that owns the change plus a `topic:` tag for the theme.

**`topic:` is the escape hatch** for work that is real but isn't an area: AI
machinery, accessibility, i18n. It cuts across areas; it never replaces one.

**`size:xl` means "split this."** Never start an xl; propose the split.

**State labels you must not set by hand:** `in-progress` is set when a worktree
claims the issue, `uat-passed` after a verified UAT names its commit, and
`in-release` when the PR merges to a release branch.

## Never invent taxonomy silently

Creating a new `project:` area, a new `topic:`, or a new milestone is a product
decision. Propose it, say what it would contain, and wait for a yes. Filing an
issue under an existing label never needs permission.

## The body is the spec

There are no spec files. The issue body carries the whole argument, in this
order:

1. **Symptom**: what a user sees, in plain language. No jargon, no file paths.
2. **Cause**: the actual mechanism, with evidence: the commit SHA that
   introduced it, `file.ts:42` references, the exact line that is missing or
   wrong. Investigate before writing; never restate the symptom as the cause.
3. **Fix**: what to change, as code where a snippet is clearer than prose.
4. **Why it wasn't caught**: the missing test or the check that passed anyway.
   This is what stops the same class of bug recurring.

For an enhancement, replace 2-4 with **Acceptance criteria** as a checklist that
a UAT pass can be run against literally, each one observable in the browser.

A ticket whose body is only a symptom is not ready to be picked up. Do the
investigation at filing time. That is the whole point of the format, and it is
why `tg:pick-ticket` can follow evidence instead of searching from scratch.
