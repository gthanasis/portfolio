# Contact intake and review (n8n)

Two workflows around the gthanasis.com contact form:

- `contact-intake.workflow.json` receives the form and stores each request in
  the `contact_requests` Data Table with `status: new`.
- `contact-review.workflow.json` is the agent: every 15 minutes it reads the new
  requests, has Claude sort each into spam, not a fit, or a lead, writes the
  verdict back, and sends leads to Telegram with a draft reply.

```
POST https://n8n-webhooks.gthanasis.com/webhook/gthanasis-contact
{ "idea": "...", "email": "...", "name": "...", "source": "gthanasis.com", "website": "" }
```

- Only `https://gthanasis.com` may call it from a browser (CORS on the webhook).
- `website` is a honeypot the form hides from people. When it is filled the
  request gets a normal 200 and is dropped.
- Invalid input (no email, idea under 8 characters) gets a 400.

## Data table: `contact_requests`

| column | type | notes |
|---|---|---|
| received_at | date | ISO timestamp |
| email | string | lower-cased |
| name | string | optional |
| idea | string | up to 5000 characters |
| source | string | `gthanasis.com` |
| country | string | from Cloudflare's `cf-ipcountry` |
| status | string | `new` on arrival, then `spam`, `not_fit`, `lead` or `needs_review` (model reply unparseable). `test` rows are ignored |
| summary | string | one line from the agent |
| reply_draft | string | leads only: a draft reply in the sender's language |
| reviewed_at | date | when the agent looked at it |

## Where it lives

Live on n8n since 2026-09-27: intake `i7OlyzmdzOVfPbtz`, review
`gk66byW4XZ6CrwqO`, data table `contact_requests` (`uXIdrY6j1V0AfL2M`). The site build reads the webhook URL
from the `CONTACT_ENDPOINT` repository variable.

## Recreating it

1. Create the Data Table `contact_requests` with the columns above.
2. Import the workflow and point **Save to contact_requests** at the new table.
3. Activate it, and update `CONTACT_ENDPOINT` if the path changed.

## The review agent

- Model: `claude-sonnet-5` via the "Anthropic account" credential.
- The visitor's text is passed as data inside `<message>` tags and the system
  prompt says never to follow instructions found there. The agent has no tools;
  the worst a hostile message can do is get itself mislabelled.
- Spam is marked `spam` and stays silent. Anything the agent cannot classify
  becomes `needs_review`, so nothing is dropped on a model error.
- Leads go to the Telegram chat the cluster alerts use (`-5444251559`).
- Failures (for example the Anthropic API being down) leave rows at `new`, so
  the next run retries them.
- At most 10 requests are reviewed per run. The webhook is public, so a flood of
  submissions can only cost 40 model calls an hour; the rest wait their turn.
