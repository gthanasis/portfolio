# Verifying acceptance criteria live with Playwright

Verify a ticket's acceptance criteria against the live, running app, not against
the source code. Reading code tells you what should happen; doing the thing a user
would do catches a different class of problem (broken data flow, wrong routing,
silent runtime failures, things that only show up once you click).

## Step 0: Read the ACs

Read the ticket (or whatever document holds the acceptance criteria). List every
AC, and note which are must-haves and which are nice-to-haves if the ticket says
so. Read enough of the code to know which routes, endpoints and components each AC
touches: that tells you where to navigate and what to click.

## Step 1: Work out which app to drive, then make sure it is running

**Check for a `.instance` file in the working directory first.**

```bash
cat .instance 2>/dev/null || echo "primary checkout"
```

- **`.instance` exists**: you are in a parallel worktree. Use the `URL` from
  that file as the base URL for everything below, and start the app with the
  `parallel.dev` command from `.claude/tg.json`. This instance has its own
  database, so resetting it is safe and affects nobody else.
- **No `.instance` file**: you are in the primary checkout. Use `uat.baseUrl`.
  Resetting the database here affects the shared one, so check with the user
  first.

**Never drive the primary checkout's URL from inside a worktree.** That is a
different checkout running different code, and your UAT result would be
meaningless.

Check that any shared services the app depends on (database, proxy, queues) are up,
then that the app answers:

```bash
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/"
```

If the app itself isn't answering, start it yourself rather than asking the user:
run it in the background, writing to a log, and poll the URL until it returns 200.

## Step 2: Load Playwright and get oriented

Load the Playwright MCP tools if they're not already available (they're often
deferred: use ToolSearch for `browser_navigate`, `browser_snapshot`,
`browser_click`, `browser_fill_form`, `browser_console_messages`,
`browser_network_requests`, and any other interaction tool the feature needs, such
as `browser_type` or `browser_select_option`).

Navigate to the feature's primary route and take a snapshot before doing anything
else, so you have a baseline of what's actually there versus what the ticket
assumes is there.

**If the feature needs a signed-in user**, don't stop at a real OAuth consent
screen just to get a session. Use the repo's dev login (`uat.login` in
`.claude/tg.json`, or find it: see the main skill). It gives a real authenticated
session for role-gated pages with no consent screen involved. If it 404s, the env
flag that enables it probably isn't set for the running stack; ask the user rather
than assuming real OAuth is the only path.

## Step 3: Work through the ACs, must-haves first

For each AC:

1. Navigate and interact as needed to put the app in the state the AC describes.
   If a control API can build that state faster, use it (see the main skill).
2. Check `browser_console_messages` (at least `warning` level) after any
   navigation or action. A clean UI with console errors underneath is still a bug
   worth catching.
3. Take a snapshot or check network requests as needed to confirm the AC's actual
   claim, not just that the page loaded.
4. Record a pass or fail verdict with a short, specific note of the evidence: what
   you did and what the app did.

**When an AC can't be verified by Playwright alone** (it needs the real
third-party OAuth consent screen itself rather than just a session, a file picker
for an actual file, access to a real inbox, a physical device notification, or
genuinely subjective judgment such as whether this looks right or the copy is
good), stop and ask the user directly. Tell them exactly what to do and in which
browser (they can drive the same session Playwright has open, or their own if
that's easier), then wait for their answer before recording that AC and moving to
the next one. Don't guess or skip silently: an AC marked as verified that wasn't
actually checked defeats the point.

Don't record a verdict for ACs you didn't actually get to. Leave them as
unverified rather than guessing.

## Step 4: Report

List every AC you checked with its verdict and evidence, called out separately from
ACs you couldn't reach this pass (and why: blocked on a dependency, needed user
input that wasn't available, out of scope). Call out anything you had to ask the
user to do by hand, and what they reported back. If you found bugs, list them so
they can be filed. Don't just say "looks good": name what you actually clicked and
what it did.
