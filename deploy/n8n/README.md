# Contact intake (n8n)

`contact-intake.workflow.json` receives the gthanasis.com contact form and stores
each request in an n8n Data Table, where an agent can pick them up later.

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
| status | string | `new` on arrival; the reviewing agent moves it on |

## Where it lives

Live on n8n since 2026-09-27: workflow `i7OlyzmdzOVfPbtz`, data table
`contact_requests` (`uXIdrY6j1V0AfL2M`). The site build reads the webhook URL
from the `CONTACT_ENDPOINT` repository variable.

## Recreating it

1. Create the Data Table `contact_requests` with the columns above.
2. Import the workflow and point **Save to contact_requests** at the new table.
3. Activate it, and update `CONTACT_ENDPOINT` if the path changed.
