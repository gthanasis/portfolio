# Google Analytics 4: {{growth.site}}

> **Placeholders:** `{{growth.*}}` values come from the repo's `.claude/tg.json`.
> Resolve them before running anything here; never guess an ID.

## Why a service account, not `gcloud auth application-default login`

Google has locked "restricted" scopes (`analytics.readonly`, `analytics.edit`) out of the
shared gcloud CLI OAuth client. The trick that works for Search Console (see
`search-console.md`) does **not** work here; it fails with a scope-blocked error. A
dedicated service account sidesteps this entirely and needs no interactive browser step
once it's set up.

## Prerequisites

- Service account key at `{{growth.credentials.ga4Key}}` (service account:
  `{{growth.serviceAccount}}`)
- The service account must be granted access in the GA4 UI first. **No API can bootstrap
  its own access**: Admin → Property Access Management → add the service account email as
  Editor (Editor, not just Viewer, is needed to create key events / custom dimensions)
- `pip install google-auth requests` in a virtualenv. If `google-auth` fails to import,
  don't fight the Python install: use curl with a gcloud access token for the service
  account instead (e.g. after `gcloud auth activate-service-account --key-file=...`), same
  endpoints and bodies.
- APIs enabled on `{{growth.gcpProject}}`: `analyticsadmin.googleapis.com`,
  `analyticsdata.googleapis.com` (one-time `gcloud services enable`)

## Key constants

```
PRODUCTION property = properties/{{growth.ga4Properties.production}}   (production)
STAGING property    = properties/{{growth.ga4Properties.staging}}      (staging)
LOCALHOST property  = properties/{{growth.ga4Properties.localhost}}    (localhost)
GCP_PROJECT         = {{growth.gcpProject}}
```

## Auth snippet (reuse in every script)

```python
import google.auth.transport.requests
import requests
from google.oauth2 import service_account

creds = service_account.Credentials.from_service_account_file(
    "{{growth.credentials.ga4Key}}",
    scopes=["https://www.googleapis.com/auth/analytics.readonly"],  # or .edit for mutations
)
creds.refresh(google.auth.transport.requests.Request())
H = {"Authorization": f"Bearer {creds.token}", "Content-Type": "application/json"}
```

**Do not set `x-goog-user-project`.** A freshly created service account lacks the
`serviceusage.serviceUsageConsumer` role needed for that header to work, and granting it
requires an IAM policy change. Omitting the header lets the service account use its own
project implicitly, which just works.

## Common queries

### 1. Realtime report (last ~30 min; use this to verify a just-fired event)

```python
resp = requests.post(
    f"https://analyticsdata.googleapis.com/v1beta/{PROP}:runRealtimeReport",
    headers=H,
    json={"dimensions": [{"name": "eventName"}], "metrics": [{"name": "eventCount"}]},
)
```

### 2. Standard report (any date range, richer dimensions)

```python
resp = requests.post(
    f"https://analyticsdata.googleapis.com/v1beta/{PROP}:runReport",
    headers=H,
    json={
        "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "eventName"}],       # or pagePath, sessionSourceMedium,
                                                        # deviceCategory, country, date,
                                                        # newVsReturning, customEvent:<param>
        "metrics": [{"name": "eventCount"}],          # or sessions, activeUsers,
                                                        # engagementRate, bounceRate,
                                                        # averageSessionDuration,
                                                        # screenPageViews, keyEvents
        "orderBys": [{"metric": {"metricName": "eventCount"}, "desc": True}],
        "limit": 20,
    },
)
```

Custom event parameters (things you `gtag('event', name, {param: value})` with) are queried
as `customEvent:<param>`, but **only after the parameter has been registered as a custom
dimension** (see below). Without that, the data exists but is invisible to reporting.

### 3. Funnel report (v1alpha; step-by-step drop-off)

```python
body = {
    "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
    "funnel": {
        "isOpenFunnel": False,
        "steps": [
            {"name": "1. View landing", "filterExpression": {"funnelEventFilter": {"eventName": "page_view"}}},
            {"name": "2. Click CTA", "filterExpression": {"funnelEventFilter": {"eventName": "cta_click"}}},
            # "orGroup" lets a step match any of several events:
            {"name": "3. Auth", "filterExpression": {"orGroup": {"expressions": [
                {"funnelEventFilter": {"eventName": "sign_up"}},
                {"funnelEventFilter": {"eventName": "login"}},
            ]}}},
        ],
    },
}
resp = requests.post(f"https://analyticsdata.googleapis.com/v1alpha/{PROP}:runFunnelReport", headers=H, json=body)
```

**Scoping a step to a custom event parameter (e.g. only `onboarding_step` where
`step == "profile"`) or a standard dimension (e.g. `pagePath`): the field names are NOT
what you'd guess from `runReport`.** This took several failed attempts (400s on `fieldName`,
`funnelFieldFilter` nested wrong, the `customEvent:` prefix) to get right. Fetching the
v1alpha discovery doc (`curl -s
"https://analyticsdata.googleapis.com/\$discovery/rest?version=v1alpha"`) and reading the
`FunnelParameterFilter`/`FunnelFieldFilter` schemas directly is what actually resolved it,
faster than guessing from the `runReport` field-naming conventions. Two different shapes,
don't mix them up:

```python
# Custom event parameter (your own gtag extras, e.g. `step`, `placement`): bare param
# name, no "customEvent:" prefix, and the filter key is funnelParameterFilter with
# eventParameterName (NOT fieldName):
{"funnelEventFilter": {
    "eventName": "onboarding_step",
    "funnelParameterFilterExpression": {
        "funnelParameterFilter": {"eventParameterName": "step", "stringFilter": {"value": "profile"}}
    },
}}

# Standard dimension (e.g. pagePath): this is a SIBLING of funnelEventFilter inside a
# FunnelFilterExpression (combine with andGroup to also match on eventName), and here the
# filter key IS funnelFieldFilter with fieldName:
{"andGroup": {"expressions": [
    {"funnelEventFilter": {"eventName": "page_view"}},
    {"funnelFieldFilter": {"fieldName": "pagePath", "stringFilter": {"matchType": "CONTAINS", "value": "/pricing"}}},
]}}
```

If you just need a parameter-level breakdown of one funnel event rather than scoping a
funnel step by it, it's often simpler to skip the funnel API's parameter filter entirely and
run a plain `runReport` with `dimensions: [{"name": "customEvent:step"}]` filtered to that
`eventName` (see query #2). That's the `customEvent:` prefix form, and it's a separate,
simpler code path from the funnel-step scoping above.

**Reading the response (this trips people up):** `metricHeaders` lists 4 metric names
(`activeUsers`, `funnelStepCompletionRate`, `funnelStepAbandonments`,
`funnelStepAbandonmentRate`) but the array is returned **twice** (8 entries, duplicated).
Harmless API quirk; just read the first 4 positions per row. More importantly:
`funnelStepCompletionRate` at step N is **forward-looking**: the fraction of step N's users
who go on to reach step N+1, not the fraction of all users who reached step N. Step 1's
"completion rate" being a small number is normal and means most viewers never reach step 2,
not that step 1 itself is rare.

### 4. Key events (GA4's name for conversions; what Ads imports as conversion actions)

```python
# List
requests.get(f"https://analyticsadmin.googleapis.com/v1beta/{PROP}/keyEvents", headers=H)
# Create (works even if the event has never fired yet)
requests.post(f"https://analyticsadmin.googleapis.com/v1beta/{PROP}/keyEvents", headers=H,
              json={"eventName": "purchase", "countingMethod": "ONCE_PER_EVENT"})
```

### 5. Custom dimensions (required before a `customEvent:<param>` filter/dimension works in reports)

```python
requests.post(f"https://analyticsadmin.googleapis.com/v1beta/{PROP}/customDimensions", headers=H,
              json={"parameterName": "placement", "displayName": "CTA placement", "scope": "EVENT"})
```

### 6. List properties / confirm access

```python
requests.get("https://analyticsadmin.googleapis.com/v1beta/accountSummaries", headers=H)
```

### 7. Confirm the Ads ↔ GA4 link exists (needed for ad-click-attributed conversions to work at all)

```python
requests.get(f"https://analyticsadmin.googleapis.com/v1beta/{PROP}/googleAdsLinks", headers=H)
```

## Before assuming a custom event isn't firing: check the delivery mechanism first

If custom events show 0 rows in every report despite auto-collected events (`page_view`,
`scroll`, `session_start`) showing real volume over the same window, don't assume it's a
processing delay. Check how the frontend actually sends events. Many sites load **gtag.js
directly**, not Google Tag Manager, even though both live on the confusingly similar
`googletagmanager.com` domain. Direct gtag.js only recognizes events fired through the real
`gtag()` function (`window.gtag('event', name, {...})`), which pushes an `arguments`-shaped
entry onto `dataLayer`. A raw `window.dataLayer.push({event: name, ...})`, the *Google Tag
Manager* custom-event convention, is silently inert with no GTM container present to read
it. This is an easy bug to ship; if you're asked to add a new custom event, use
`window.gtag(...)` (or the repo's existing tracking helper, if it wraps `gtag`), not a
hand-rolled `dataLayer.push`.

## The goal every time this is invoked

Answer these four questions, in this order. Lead with the answer, then the supporting
numbers, not a metrics dump the human has to interpret themselves.

### 1. What's going on in our product?

A plain-language summary of real activity over the period: how many sessions, from where,
how engaged, and what people actually did (which events fired, how many times). This is the
orientation pass before diagnosing anything; establish the baseline first.

### 2. What do we need to pay attention to?

Anomalies and risks, not just numbers: a metric that moved sharply from the prior period, a
source/medium producing disproportionate key events relative to its session count (often
internal/test traffic, see the exclusion note below), a page that's supposed to get traffic
and isn't, a key event that's gone quiet. State sample size honestly: a single-digit event
count is "not yet a trend," say that explicitly rather than dressing it up with percentages.

### 3. What do we need to improve?

Concrete, page/segment-specific findings:
- **Page-level engagement** (`pagePath` × `bounceRate` + `averageSessionDuration`): compare
  pages serving the *same* purpose in different variants (e.g. two locales of the same
  landing page). A stark gap between otherwise-identical pages is the single most actionable
  lead available, not noise.
- **Custom-dimension breakdowns of your own funnel events**: e.g. which CTA `placement`
  actually gets clicked, which onboarding `step` people reach. This tells you *where* to
  focus design/copy effort, not just *that* there's drop-off.
- **Cross-check against the actual backend database**, not just GA4's self-reported
  numbers: does the count of a "record created" key event match real records in the
  database over the same window? See "The database cross-check" below. Run it whenever you
  have the access: GA4 and the database can disagree by a wide margin (one `sign_up`
  reported against 19 real accounts is a real example), and which of the two is wrong is
  the finding.

### 4. Where do users drop off?

Run the funnel report (query #3) across the actual product funnel, in order. Report the
**single biggest drop-off step**, not the average conversion rate. On a small site it's
almost always concentrated in one place (e.g. "page view → first click" dominating
everything downstream), and that one place matters more than optimizing anything else.
Segment the weak step by device/country/new-vs-returning/source-medium if the sample allows;
drop-off often concentrates in one segment and averages hide this.

## The database cross-check

If you have read-only access to the production database, compare event counts with real
rows for the same window. Use access that is already set up for read-only use; never pull
raw credentials into chat or into a command line that gets logged, and never run anything
that writes.

Traps that cost real time (MongoDB shown; the same classes of mistake exist in SQL):

- **Dates are `Date`, not strings.** `{createdAt: {$gte: "2026-08-01"}}` silently
  returns `[]`. Use `new Date("2026-08-01")`.
- **Foreign keys may be strings while `_id` is an ObjectId.** If a collection stores the
  owning user's id as a **string**, `db.orders.countDocuments({userId: user._id})` returns 0
  for everyone and looks like a catastrophic conversion rate. Join with `String(user._id)`.
  Check the stored type before trusting a zero.

The signup → first-core-record cohort is the query worth having:

```js
db.users.find({createdAt:{$gte:new Date("2026-07-01")}}).toArray().map(u => ({
  created: u.createdAt.toISOString(),
  records: db.orders.countDocuments({userId: String(u._id)})
}))
```

**Read the result knowing where the sign-up gate actually is.** If sign-up is required at
the *end* of the core action (e.g. on a publish or checkout button) rather than up front,
accounts are created seconds before the first record, and an account with no record means
somebody did the whole flow and then failed at the last step: a bug signal, not a "users
signed up and never engaged" marketing one. Check the timestamps before concluding anything
about intent.

## Before drawing conclusions: exclude your own testing traffic

`(not set)` source/medium producing a lot of key events relative to its session count is
usually a signal, not noise: often internal/test traffic (referrer-stripped direct hits).
GA4's built-in IP-based Internal Traffic filter (Admin → Data Streams → stream → internal
traffic rules) is the official mechanism but fragile for a team testing from multiple
networks/VPNs. A more robust option: a code-level opt-out, a bookmarked URL with a query
param that sets a persistent cookie telling the analytics init to skip firing for that
browser going forward, regardless of IP.
