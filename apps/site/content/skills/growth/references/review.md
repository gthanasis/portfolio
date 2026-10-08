# Growth review: {{growth.site}}

> **Placeholders:** `{{growth.*}}` values come from the repo's `.claude/tg.json`.
> Resolve them before running anything here; never guess an ID.

This is the synthesis layer. For raw query mechanics, see the three source guides:
`search-console.md`, `analytics.md`, `ads.md`. This one is about how to combine them into an
actual assessment, the way a product owner or growth-minded SEO would read the business,
not just a metrics dump.

## The three lenses, and what each one alone can't tell you

- **GSC** tells you what Google *thinks* of your pages (indexing, ranking, impressions),
  but nothing about what happens after someone clicks through.
- **GA4** tells you what real visitors *do* on the site, but says nothing about why they
  arrived, or whether ad spend is efficient.
- **Ads** tells you what you're *paying for* (clicks, cost, campaign-level conversions),
  but its own numbers can't tell you if the landing page those clicks hit is actually good.

The useful insights live in the gaps between these, not within any single one.

## A structured review, step by step

### 1. Acquisition: where is traffic actually coming from, and is it healthy?

- GA4: `sessionSourceMedium` breakdown, last 7/30 days: sessions, engagement rate, key
  events per source
- GSC: `searchAnalytics.query` with `dimensions: ["page"]` or `["query"]`: which pages/terms
  are getting real search impressions, and what's their average position
- Cross-check: does a keyword/page with strong GSC impressions actually show up as organic
  traffic in GA4 in proportion? A big gap (high impressions, low resulting sessions) points
  to a weak title/meta-description not earning the click, not a ranking problem.

### 2. Landing experience: does the page people land on actually work?

- GA4 `pagePath` × `bounceRate` + `averageSessionDuration`, for **each locale/variant
  separately**, not blended. A 90%+ bounce rate on the exact page paid traffic is being sent
  to is a live, spend-wasting problem, not a rounding error. Investigate it (open the page,
  check for a rendering/translation/perf issue) before doing anything else.
- Compare against a same-purpose control page (e.g. the other locale). A stark gap between
  otherwise-identical pages is the single most actionable signal available.

### 3. Funnel: where do real users actually drop off?

- GA4 funnel report (see `analytics.md`, query #3) across the actual product funnel:
  landing → primary action → deeper engagement → auth → core conversion.
- Find the *single biggest* drop-off step, not the average conversion rate. On a small
  site it's almost always concentrated in one place, and fixing that one place matters far
  more than micro-optimizing everything else.
- Break down the weak step by its own dimensions (which button/placement, which device,
  which segment). "People don't convert" is not actionable; "people on `/el/pricing`
  specifically bounce at 92% vs 8% on the English equivalent" is.

### 4. Paid spend: is Ads efficiently buying the thing that actually matters?

- Confirm the Ads Primary conversion action is a real business outcome, not the
  auto-created page-view default (see `ads.md`).
- Check campaign `primary_status_reasons` before anything else. An account-level block
  (verification, billing, policy) means zero performance data is meaningful until it clears.
- Check keyword-level serving status. A campaign can look healthy in aggregate while most
  individual keywords never actually serve.
- Sanity-check GA4's `google / cpc` session count against Ads' own click count for the same
  window. They won't match exactly (different counting methodologies) but should be in the
  same ballpark.

### 5. Ground truth: does the real backend agree with what the dashboards say?

Dashboards can be miswired (see the gtag.js vs GTM trap in `analytics.md`, which can silently
zero out every custom event for weeks before anyone notices). Before trusting a "0
conversions" or "1 conversion" number, and if you have read-only access to the production
database, compare the event count with the real row count for the same window (see "The
database cross-check" in `analytics.md`). Use whatever read-only access is already
configured; never extract or print raw credentials to get there. If GA4 says 1 conversion
and the database also shows exactly 1 new record in that window, the pipeline is
trustworthy; if they disagree, something upstream is broken and every other number in the
review is suspect until that's fixed.

## Reporting the findings

Structure the output as a **product owner would read it**, not as a metrics printout:

1. **One clear headline finding**: the single most actionable thing found (a broken page,
   a mis-set conversion goal, a funnel step nobody survives), not a list of ten equal-weight
   observations.
2. **Supporting numbers**, briefly, only for the headline finding.
3. **What's working**: don't only report problems. Note what's genuinely healthy so the
   human doesn't waste effort "fixing" something that's fine.
4. **Honest caveats on sample size**: a single-digit event count is not a trend, and it
   should read that way (state it explicitly) rather than being dressed up with percentages
   that imply more confidence than the data supports.
5. **A concrete next step**, not just a diagnosis: what would you actually do next given
   this data.

## When traffic is too new/small to conclude anything

Early on (first days of a new campaign, or a low-traffic site generally), most numbers will
be single digits. Say so plainly rather than over-interpreting. "1 conversion from 1
person testing the flow, not yet real signal" is more useful and more honest than a
percentage-based narrative built on n=1. Distinguish clearly between "the pipeline is
verified working" (a real, checkable fact even at low volume) and "the campaign is
performing well" (a claim that needs real volume to support).
