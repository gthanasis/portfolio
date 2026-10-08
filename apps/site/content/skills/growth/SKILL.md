---
name: growth
description: >-
  Query Google Analytics 4, Search Console, and Google Ads for a configured
  site, or run the full growth review that combines all three. Use when the user
  asks about traffic, sessions, funnels, key events, indexing, coverage, crawl
  errors, search queries, impressions, campaign or keyword performance,
  conversions, ad spend, or asks a broad question like "how are we doing",
  "what's working", "why did traffic drop". Read-only reporting.
---

# Growth

Four data sources behind one entry point. **Ask which one before running
anything** unless the request already names it.

> Which do you want?
> 1. **Analytics** (GA4): sessions, funnels, key events, custom dimensions
> 2. **Search Console**: indexing, coverage, queries, crawl errors
> 3. **Ads**: campaigns, keywords, conversions, spend
> 4. **Full growth review**: all three, read together. What's working, what's
>    broken, what to do next

A request that clearly names its source ("did the sitemap get indexed") skips
the question. A vague one ("how's the site doing") does not. Ask, because the
full review is much slower than a single lookup and often isn't what's wanted.

## Step 0: Load config

Read `.claude/tg.json`:

```jsonc
{
  "growth": {
    "site": "example.com",
    "gcpProject": "my-gcp-project",
    "ga4Properties": { "production": "000000000", "staging": "", "localhost": "" },
    "serviceAccount": "ga4-readonly@my-gcp-project.iam.gserviceaccount.com",
    "gscSiteUrl": "sc-domain:example.com",
    "gscSiteUrlEncoded": "sc-domain%3Aexample.com",
    "gscAccount": "owner@example.com",
    "adsManagerCustomerId": "0000000000",
    "adsCustomerId": "0000000000",
    "credentials": {
      "ga4Key": "/path/to/ga4-service-account.json",
      "adsYaml": "/path/to/google-ads.yaml"
    }
  }
}
```

If it's missing, try to derive it: the site from the git remote or the app's
own config, the property and customer IDs from whatever credentials are already
on the machine. Show what you found and confirm before querying. If you can't
derive it, ask, and offer to write `.claude/tg.json`.

**Never guess a property or customer ID.** Querying the wrong property returns
confident, wrong numbers.

The reference files use `{{growth.*}}` placeholders throughout. Resolve every one
from config before running a command; if a key is absent, ask rather than
substituting a plausible value.

**Credentials stay in files.** The config names *paths* to the GA4 service
account key and the Ads `google-ads.yaml`; those files hold live tokens with real
spend behind them. Never print their contents or any individual field into chat
or logs, and keep them out of the repo.

## Then read the source guide

- Analytics -> `references/analytics.md`
- Search Console -> `references/search-console.md`
- Ads -> `references/ads.md`
- Full review -> `references/review.md` (which uses the other three)

Each carries the auth setup, the query shapes, and the traps specific to that
API.

## Reporting

Report what the data says, including when it says nothing useful. A flat week is
a finding. Sampling, thresholded rows, and `(not set)` buckets are real limits:
name them rather than reporting around them. Never present a modelled or
extrapolated figure as measured.
