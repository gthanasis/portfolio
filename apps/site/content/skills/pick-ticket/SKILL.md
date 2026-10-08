---
name: pick-ticket
description: >-
  Recommend what to work on next from GitHub issues, or work named issues
  through to a merged PR inside a parallel worktree. Use when the user says
  "what should I work on", "what's next", "start working on #N", "work on #N and
  #M", "pick up <issue>", or opens a conversation in a worktree and names
  tickets. Implements the fix, adds a regression test, UATs against the
  instance's own URL and database, then ships and watches CI.
---

# Pick and work a ticket

Two modes. **No issues named -> recommend.** **Issues named -> work them.**

Almost every step of the working mode is a script. **Run the script; do not
reimplement it.** The scripts own what has an exact right answer: which slot is
free, which release branch is current, what CI said. You own the judgement: the
fix, the test, and reading a UAT result.

## Step 0: Load config

Read `.claude/tg.json`:

```jsonc
{
  "tickets": { "repo": "acme/app", "areaPrefix": "project:" },
  "parallel": {
    "new":     "npm run wt:new",        // claims a slot, creates worktree + db, assigns + labels the issues
    "done":    "npm run wt:done",       // drops db, frees slot, removes worktree and branch
    "dev":     "npm run dev:instance",  // serves on this instance's own URL and database
    "ship":    "npm run ship",          // checks, rebase, push, PR with Closes #N, watch CI
    "reset":   "npm run db:reset",
    "instanceFile": ".instance",
    "login":   "/dev-login"
  }
}
```

**If `parallel` is missing or incomplete, stop before starting work** and offer
to set the repo up so several worktrees can run at once without colliding:

- a deterministic port and hostname derived from the worktree name
- a database per instance, created and dropped with the worktree
- isolated caches, uploads and any other shared resource (Redis namespace,
  storage bucket, mail catcher)
- a written record in `.claude/tg.json` so this never has to be asked again

Get the user's approval before changing the repo. Without isolation, two
worktrees share a database and quietly corrupt each other's UAT.

---

# Mode A: Recommend

The backlog is GitHub issues. Rank open issues and propose **3-4 independent**
tasks, then stop. This is a report: don't write code or edit anything.

    gh issue list --state open --limit 100 \
      --json number,title,labels,milestone,assignees

Exclude: `blocked`, `in-progress`, anything already assigned, `ideation`,
`manual-only`, and `size:xl` (propose splitting those instead).

Rank by, in order: `priority:p0` before `p1` before `p2`; issues in an active
milestone before ones without; bodies that already carry real evidence
(file:line, a commit SHA) before thin ones. Those are ready to start, the
others need investigation first.

Prefer a set that touches **different areas**, so the tasks can run in parallel
worktrees without conflicting. Say for each: what it is, why now, rough size,
and whether it's ready or needs investigation first.

---

# Mode B: Work the tickets

## Step 1: Find your instance

    cat .instance

That file is the whole context: `INSTANCE`, `ISSUES`, `BRANCH`, `BASE`, `URL`,
`DB`.

**If there is no `.instance` file**, you are not in a prepared worktree. Go to
the primary checkout, run the `parallel.new` command with the issue numbers, and
start again in the directory it prints. Do not `git worktree add` by hand: you
would skip the env files, the database and the slot claim.

`parallel.new` has already assigned the issues to the current GitHub user and
labelled them `in-progress`. Don't do it again.

## Step 2: Read the tickets and the code

    gh issue view <N>

for each issue in `ISSUES`. Then read the actual code before planning. Issue
bodies here carry real file:line evidence; follow it rather than searching from
scratch.

If the issues need incompatible changes, or one is already fixed on `BASE`, say
so and stop rather than inventing scope.

## Step 3: Prove the bug first

For a bug, write the failing test **before** the fix, and run it to confirm it
fails for the reason the ticket describes. A regression test that passes before
your change proves nothing.

For an enhancement, write the test alongside the change.

## Step 4: Implement

Match the surrounding code. If several issues share this worktree, make one
commit per issue so the history stays readable.

## Step 5: UAT against your own instance

Run `parallel.dev`. It serves at the `URL` from `.instance` (e.g.
`http://wt2.localhost`) with its own database. **Never UAT against
`http://localhost`**: that is the primary checkout, someone else's code.

Drive it with the Browser tools. Sign in through the `parallel.login` path, not
the real OAuth provider: real OAuth usually only accepts `http://localhost` as a
redirect URI.

Need clean data? `parallel.reset`. Inside a worktree it resets only this
instance's database.

Check the issue's acceptance criteria actually hold in the browser. If they
don't, fix and repeat. A passing unit test is not a UAT.

When a UAT passes, label the issue `uat-passed` and comment with the commit SHA
you verified. The label means nothing without the commit named.

## Step 6: Ship

Run `parallel.ship`. It runs format/lint/check-types/test, rebases onto the
current release branch, pushes, opens a PR with `Closes #N` for every issue, and
blocks watching CI.

Read its exit code:

- **0**: green. Tell the user the PR is ready and stop. **Do not merge it.**
- **2**: a check or CI failed; the output is already printed. Fix, commit, ship
  again. After three failed attempts on the same failure, stop and report.
- **1**: something needs a decision (rebase conflict, uncommitted changes).
  Handle it, then re-run.

## Step 7: Stop

Merging is the user's call. When they say it's merged, run `parallel.done`,
which drops the instance database, frees the slot, removes the worktree and
deletes the branch. Merging the PR closes the issues by itself; the PR merging
to a release branch is what earns the `in-release` label.

## Things that will bite you

- **The release branch moves.** Other sessions push to it constantly. Ship
  rebases for you; don't hand-merge it.
- **Never run a root build** while a dev server is up: it clobbers the running
  build output.
- **Don't touch files outside your tickets' scope.** Parallel worktrees all land
  on the same release branch; unrelated edits become someone else's conflict.
- **Don't set `in-progress` or `in-release` by hand**: the scripts and the
  merge own those. `uat-passed` is yours, and only with a commit named.
