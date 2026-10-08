---
name: uat
description: >-
  Get the app into a specific state for manual UAT, and verify a feature's
  acceptance criteria live in the browser. Use when you need to "see X in the
  browser", reproduce a failing e2e test locally, check a variant, verify a
  ticket's acceptance criteria actually hold, or reach a state that takes many
  UI steps (a guest who already replied, a poll with votes, an order halfway
  through checkout). Drives the app's control API where one exists, otherwise
  Playwright.
---

# UAT scenario setup

Clicking through the UI to reach a specific state is slow and error-prone. A control
API can build the same state in seconds, then you open the resulting URL in a browser
and look at the thing you actually care about.

## Step 0: Config and mode

Read `.claude/tg.json`:

```jsonc
{
  "uat": {
    "controlApi": "http://localhost:3000/__control",
    "baseUrl": "http://localhost:3000",
    "login": "/dev-login"
  },
  "parallel": { "dev": "yarn dev:instance", "instanceFile": ".instance" }
}
```

**Two modes.** If the repo exposes a control API, drive that: it reaches a
state in one call that takes a dozen UI steps. If it doesn't, drive the UI with
Playwright and verify against the issue's acceptance criteria; see
`references/verify-acs.md`.

**In a worktree, UAT the worktree.** If `.instance` exists, use its `URL` and
its own database, never `http://localhost`, which is the primary checkout and
someone else's code. If `parallel` is missing from the config and you are in a
worktree, stop and offer to set the repo up for parallel instances before
testing anything.

## What a control API for UAT should offer

You don't need a dedicated service. Most apps already have the pieces; you need
enough of them to script a scenario end to end:

- **Log in as a seeded user** without a password or OAuth screen: a dev-only
  login route that takes a user id or email and sets the session cookie.
- **Create the entities a scenario needs** (the parent object, its children, the
  settings or variant under test) through the same endpoints the UI uses.
- **Act as a second user or a guest**: log in as another seeded user, or use
  whatever token the app issues to anonymous or invited participants. Many
  scenarios are only interesting once two people have touched them.
- **Print the URLs to open**, so the last step of every scenario is "open this
  page" rather than "now navigate to…".

## Finding it in the repo

1. Look for a dev login: grep the backend routes for `demo`, `dev-login`,
   `impersonate`, `loginAs`. Note the env flag that enables it and anything else
   it depends on (a redirect URL, a dev-mode switch that returns verification
   codes in the response instead of emailing them). A missing flag usually shows
   up as a 404 or a 500 *after* the cookie would have been set.
2. Find the seeded users in the fixture or seed scripts, and their roles. A
   long-lived dev database drifts from its fixtures: users get renamed, deleted,
   or have their role changed by hand. If dev login fails, check the user still
   exists in the database before assuming the endpoint is broken.
3. Read the e2e suite's support commands. Whatever helper it uses to log in and
   create data is the control API, already proven to work.
4. Read the route definitions for the entities your scenario needs: required
   fields, response envelope, which id the next step needs.

Record what you found under `uat` in `.claude/tg.json` so the next session starts
there.

## Check the auth middleware before scripting requests

Roles can resolve the acting user differently. An admin token might take the
target user from a query parameter while a normal user token rejects that same
parameter, or a guest endpoint might accept either a session cookie or a header
token. The same request then succeeds for one role and fails for another with an
error that doesn't explain why. Read the auth middleware once before writing any
requests and encode the rule in the script, so callers never have to think about
it. Doing this by hand with curl is where most of the wasted time goes.

## The helper script

`scripts/uat.sh` is a starting point: an `api METHOD PATH` wrapper with a cookie
jar that fails loudly on HTTP errors, a `jget` JSON helper, and a `login`
subcommand. Copy it into the repo and add one subcommand per scenario step.

Each subcommand prints the id or token the next one needs, so steps compose:

```bash
U=scripts/uat.sh

$U login <seededUserId>                 # stores the session cookie
PARENT=$($U create "Rooftop Dinner")    # -> id
$U urls "$PARENT"                       # pages to open
```

Then add a `scenario-<name>` subcommand that chains the steps for a state you
reach often, so the whole setup is one command.

Point it at your stack with `UAT_API` and `UAT_WEB` (defaults are localhost).
In a worktree, set them from `.instance`.

## Browsing the result

To browse as the logged-in user, hit the dev login in the same browser you open
the printed URLs in, so the session cookie lands on the frontend origin. To browse
as an anonymous visitor, use a private window or clear cookies for the frontend
origin.

## Cleaning up

Scenario data is ordinary data. Delete it by id through the API when a dev
database gets noisy, or reset the instance's database if it has its own.

## Reproducing a failing e2e test

The e2e suite usually drives the same API through its support commands. When a
spec fails, read the spec, build its end state with the script, and open the page
to inspect it, rather than re-running the whole suite. Note that this reaches the
state through the API, so it will *not* reproduce UI-timing failures (hydration
races, click-before-hydrate); it is for inspecting state and rendering, and for
confirming the backend behaves as the test expects.
