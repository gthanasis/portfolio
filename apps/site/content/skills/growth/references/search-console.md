# Google Search Console: {{growth.site}}

> **Placeholders:** `{{growth.*}}` values come from the repo's `.claude/tg.json`.
> Resolve them before running anything here; never guess an ID.

## Prerequisites

- `gcloud` installed and on `PATH`
- ADC authenticated: `gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters.readonly`
- Quota project set: `gcloud auth application-default set-quota-project {{growth.gcpProject}}`

**Use curl, not Python, as the default approach.** `gcloud` already hands you a
working token (`print-access-token`), so there's no need for Python's
`google-auth` at all; curl gets the same result with one fewer moving part. Only
fall back to Python if curl is unavailable.

## Key constants

```
SITE_URL    = {{growth.gscSiteUrl}}
GCP_PROJECT = {{growth.gcpProject}}
ACCOUNT     = {{growth.gscAccount}}  (siteOwner)
```

## Auth (reuse in every call)

```bash
TOKEN=$(gcloud auth application-default print-access-token)
SITE_ENC="{{growth.gscSiteUrlEncoded}}"   # URL-encoded siteUrl for path segments
SITE="{{growth.gscSiteUrl}}"              # unencoded, for JSON bodies
```

Every curl call below needs these two headers:
```
-H "Authorization: Bearer ${TOKEN}"
-H "x-goog-user-project: {{growth.gcpProject}}"
```

## Common queries

### 1. URL Inspection (indexing status for specific URLs)

```bash
for url in "https://{{growth.site}}/" "https://{{growth.site}}/pricing"; do
  curl -s -X POST "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \
    -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
    -H "x-goog-user-project: {{growth.gcpProject}}" \
    -d "{\"inspectionUrl\":\"${url}\",\"siteUrl\":\"${SITE}\"}"
done
```

Fields available under `inspectionResult.indexStatusResult`: `verdict` (PASS/NEUTRAL/FAIL),
`coverageState`, `robotsTxtState`, `indexingState`, `pageFetchState`, `lastCrawlTime`,
`googleCanonical`, `userCanonical`, `sitemap`, `referringUrls`

### 2. Search Analytics (clicks, impressions, position by page/query)

```bash
curl -s -X POST "https://www.googleapis.com/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query" \
  -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
  -H "x-goog-user-project: {{growth.gcpProject}}" \
  -d '{"startDate":"2026-03-01","endDate":"2026-05-09","dimensions":["page"],"rowLimit":50,"dataState":"all"}'
```

Swap `"dimensions":["page"]` for `["query"]`, `["country"]`, `["device"]`, or `[]` for
property-wide totals. Sort rows by `impressions` descending yourself: the API returns them
in its own order, not ranked.

### 3. List sitemaps

```bash
curl -s "https://www.googleapis.com/webmasters/v3/sites/${SITE_ENC}/sitemaps" \
  -H "Authorization: Bearer ${TOKEN}" -H "x-goog-user-project: {{growth.gcpProject}}"
```

## Troubleshooting

| Error | Fix |
|-------|-----|
| `403 quota project` | Run `gcloud auth application-default set-quota-project {{growth.gcpProject}}` |
| `401 invalid credentials` | Run `gcloud auth application-default login --scopes=...webmasters.readonly` again |
| `Token expired` | Re-run `gcloud auth application-default print-access-token`. Tokens are short-lived; fetch a fresh one per script/session rather than caching it |
| GSC won't accept a service account email | GSC only accepts verified Google accounts; use ADC with a personal account that owns the property |
| `google-auth` or `requests` fails to import in Python | Don't sink time into reinstalling packages. Skip Python and use the curl-based auth and queries above with a gcloud access token. |
| Sitemap `sitemaps` endpoint reports `indexed: 0` (or a suspiciously low count) while individual pages clearly rank and get impressions | This aggregate stat lags and is unreliable. Cross-check with per-URL `urlInspection` instead of trusting the sitemap summary; report the per-URL result as ground truth and just note the discrepancy if asked. |

Note this ADC trick (ordinary `gcloud auth application-default login` with the webmasters
scope) is specific to Search Console. It does **not** work for GA4's `analytics.*` scopes,
which Google has locked out of the shared gcloud CLI client. See `analytics.md`, which uses a
dedicated service account instead.

## The goal every time this is invoked

Answer these two questions, in this order, in an easy-to-digest format (a small table beats
a wall of numbers; rank pages and queries by impressions, not alphabetically):

### 1. How good is our ranking? (current state)

- Pull `searchAnalytics` by `page` and by `query`, last 28 days: clicks, impressions, CTR,
  average position. Lead with a short summary (e.g. "X clicks, Y impressions, top query is
  Z at position P"), then the table.
- Pull `urlInspection` on the handful of pages that actually matter to the business right
  now (not every page in the sitemap). Report `coverageState` and `verdict` plainly:
  indexed / discovered-not-yet-indexed / unknown-to-Google / blocked.
- State the branded vs non-branded query split explicitly. If every query with impressions
  is a variant of the brand name, say so plainly ("zero product-intent organic traffic yet");
  don't bury it in a table.

### 2. What do we need to improve?

- **High impressions, low CTR** on a page/query → the ranking is fine, the
  title/meta-description isn't earning the click. Name the specific page/query.
- **High impressions, position > ~15** → ranking is the bottleneck, not the snippet.
- **A page you expect to be indexed showing "Discovered, not indexed" or "unknown to
  Google"** → note it, but check *when the page shipped* before calling it a problem. A
  page a few days old with no indexing yet is expected, not broken. A page weeks old still
  unindexed is a real issue (check `robotsTxtState`, sitemap inclusion, internal linking).
- **Sitemap health**: pending/error states, and whether recently shipped pages actually
  appear in it.
- Only recommend action a human can actually take (rewrite a title, fix a `noindex`, add
  internal links). "Wait for Google to crawl it" is a valid answer when that's genuinely
  the state; say so instead of manufacturing a task.
- Cross-reference against GA4: see `review.md` for combining this with actual on-site
  behavior instead of search visibility in isolation.
