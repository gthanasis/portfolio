# Google Ads: {{growth.site}}

> **Placeholders:** `{{growth.*}}` values come from the repo's `.claude/tg.json`.
> Resolve them before running anything here; never guess an ID.

## Prerequisites

- Config at `{{growth.credentials.adsYaml}}` (developer_token, client_id, client_secret,
  refresh_token, login_customer_id). Never print this file's contents or its individual
  field values into chat/logs; it's a live credential set with real spend behind it.
- `pip install google-ads` in a virtualenv
- Google Cloud project `{{growth.gcpProject}}` has `googleads.googleapis.com` enabled

## Key constants

```
MANAGER (MCC) customer_id  = {{growth.adsManagerCustomerId}}   (this is login_customer_id in the yaml)
TARGET account customer_id = {{growth.adsCustomerId}}   (the target account): query/mutate THIS one, not the MCC
API version = v25   (check periodically; Google deprecates old versions. If you hit
                      "Specified service X does not exist in Google Ads API vY", inspect
                      installed-package-supported versions:
                      `python -c "import google.ads.googleads as g, pkgutil, os; \
                      print([p.name for p in pkgutil.iter_modules([os.path.dirname(g.__file__)]) \
                      if p.name.startswith('v')])"` and use the highest one listed)
```

## Auth snippet (reuse in every script)

```python
from google.ads.googleads.client import GoogleAdsClient

client = GoogleAdsClient.load_from_storage("{{growth.credentials.adsYaml}}", version="v25")
ga = client.get_service("GoogleAdsService")
cid = "{{growth.adsCustomerId}}"  # the target account, not the MCC
```

## Common queries (GAQL via `GoogleAdsService.search`)

### Campaign performance

```python
q = """
    SELECT campaign.name, campaign.status, campaign.primary_status,
           campaign.primary_status_reasons, campaign.serving_status,
           metrics.impressions, metrics.clicks, metrics.cost_micros,
           metrics.conversions, metrics.ctr, metrics.average_cpc
    FROM campaign WHERE segments.date DURING LAST_7_DAYS
"""
```

Valid `DURING` literals: `TODAY`, `YESTERDAY`, `LAST_7_DAYS`, `LAST_14_DAYS`, `LAST_30_DAYS`,
`THIS_MONTH`, `LAST_MONTH`, `THIS_WEEK_SUN_TODAY`, `THIS_WEEK_MON_TODAY`,
`LAST_WEEK_SUN_SAT`, `LAST_WEEK_MON_SUN`. **`LAST_3_DAYS` and similar aren't valid**: GAQL
errors with `INVALID_VALUE_WITH_DURING_OPERATOR`. For an odd number of days, query `TODAY`
and `YESTERDAY` separately and sum, or use an explicit `segments.date BETWEEN 'YYYY-MM-DD'
AND 'YYYY-MM-DD'` range.

`campaign.primary_status` + `primary_status_reasons` is the fastest way to see *why* a
campaign isn't performing. Values seen in practice: `LEARNING`/`LIMITED` with reason
`BIDDING_STRATEGY_LEARNING` (normal, temporary), or a reason indicating an account-level
block (e.g. advertiser identity verification pending; this pauses ALL serving account-wide,
not just one campaign, and can only be resolved by the human account owner submitting
documents in the Ads UI, never programmatically).

### Keyword-level diagnostics (Search campaigns)

```python
q = """
    SELECT ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
           ad_group_criterion.status, ad_group_criterion.system_serving_status,
           ad_group_criterion.approval_status, ad_group_criterion.quality_info.quality_score,
           metrics.impressions, metrics.clicks
    FROM keyword_view WHERE campaign.name = 'Campaign Name'
"""
```

`system_serving_status = RARELY_SERVED` with 0 impressions almost always means the phrase is
too narrow for Google to have confidence matching it, **not** a targeting/quality problem.
Check `approval_status` is `APPROVED` (policy-clean) and `quality_score` is unavailable (not
low) to confirm it's a volume issue. Quality Score genuinely cannot compute with 0
impressions; that's expected, not broken.

**Fixing `RARELY_SERVED`, in order of how invasive it is:**
1. **Broaden match type.** `keyword.match_type` is **immutable on an existing criterion**:
   an `UPDATE` operation errors with `IMMUTABLE_FIELD`. You must **create** a new criterion
   at the broader match type and **remove** the old one:
   ```python
   create_op = client.get_type("AdGroupCriterionOperation")
   create_op.create.ad_group = ad_group_resource_name
   create_op.create.keyword.text = "same text"
   create_op.create.keyword.match_type = client.enums.KeywordMatchTypeEnum.BROAD
   remove_op = client.get_type("AdGroupCriterionOperation")
   remove_op.remove = old_criterion_resource_name
   agc_service.mutate_ad_group_criteria(customer_id=cid, operations=[create_op, remove_op])
   ```
2. **Consolidate thin ad groups.** A single-keyword ad group gives Google the least combined
   signal to build confidence; merging niche ad groups into a broader one often helps more
   than broadening match type alone.
3. Otherwise: it resolves with time once real serving accumulates. Don't over-optimize on
   day one.

### Conversion actions: what's driving bidding

```python
q = """SELECT conversion_action.name, conversion_action.status, conversion_action.category,
       conversion_action.primary_for_goal FROM conversion_action WHERE conversion_action.status = 'ENABLED'"""
```

**Only one action should be `primary_for_goal = True`**: that's what bidding actually
optimizes toward. A fresh Ads account auto-creates a `PAGE_VIEW` conversion and marks it
primary by default; if you later import a real business-outcome event (e.g. from GA4, see
below), demote `PAGE_VIEW` to secondary or bidding keeps chasing pageviews instead of the
thing you actually care about:

```python
op = client.get_type("ConversionActionOperation")
op.update.resource_name = conversion_action_resource_name
op.update.primary_for_goal = False
op.update_mask.CopyFrom(field_mask_pb2.FieldMask(paths=["primary_for_goal"]))
```

**Importing a GA4 key event as a conversion action cannot be done via the API.**
`ConversionActionService.mutate` fails with `CREATION_NOT_SUPPORTED` for the
`GOOGLE_ANALYTICS_4_CUSTOM` type. This is a real, permanent API limitation, not a bug to
route around: the human must do it once in the Ads UI (Goals → Conversions → New conversion
action → **"Conversions on a website" → your site via the linked GA4 property**, or the
bottom-of-page **"Create multiple conversion actions from a linked account"** shortcut,
which lists GA4 key events directly with per-row category dropdowns, much faster than
category-first navigation). After that one-time UI step, the resulting conversion actions
are fully manageable via the API (primary/secondary, status, etc.).

### Asset groups (Performance Max): diagnosing "Poor" ad strength

```python
q = "SELECT asset_group.name, asset_group.ad_strength, asset_group.primary_status FROM asset_group"
q2 = """SELECT asset_group_asset.field_type, asset.type FROM asset_group_asset"""  # counts by type
```

Google wants **3+ assets per image type** (landscape/square/portrait), not 1. A single
image per slot is a common cause of "Poor." Also check headline/description *variety*, not
just count: near-duplicate phrasing scores worse than genuinely distinct angles (benefit,
feature, urgency, brand). After bulk-adding assets, `ad_strength` flips to `PENDING` while
Google recomputes; re-check in a few hours, not immediately.

### Audience & targeting: who a campaign is actually reaching

```python
q = """SELECT campaign.name, campaign_criterion.type, campaign_criterion.location.geo_target_constant,
       campaign_criterion.language.language_constant, campaign_criterion.negative
       FROM campaign_criterion WHERE campaign.name = 'Campaign Name'"""
```

`campaign_criterion.type` covers `LOCATION`, `LANGUAGE`, `DEVICE`, `AGE_RANGE`, `GENDER`,
`AUDIENCE`, `USER_INTEREST`, etc. A campaign with **no** `LOCATION`/`LANGUAGE` rows at all
is running with default broad (often worldwide) targeting, not "no targeting". That's worth
flagging explicitly since it's easy to assume a campaign is scoped when it isn't. Cross-check
actual serving geography against this: pull the GA4 `country` breakdown (see `analytics.md`)
filtered to `sessionSourceMedium = google / cpc` for the same window. Sessions from outside
the targeted geo/language almost always mean the traffic isn't from this campaign at all
(bot/crawler/direct), not a targeting leak, but confirm rather than assume either way.

**`geo_target_constant`/`language_constant` come back as bare resource names** (e.g.
`geoTargetConstants/2300`, `languageConstants/1022`), not human-readable names. Don't guess
the country/language from the numeric ID off memory (`2300` happens to be Greece and `1022`
Greek, but that's not something to rely on recalling correctly next time). Resolve them
properly instead:

```python
q = """SELECT geo_target_constant.id, geo_target_constant.name, geo_target_constant.country_code
       FROM geo_target_constant WHERE geo_target_constant.id IN (2300, 2196)"""
q = """SELECT language_constant.id, language_constant.name, language_constant.code
       FROM language_constant WHERE language_constant.id IN (1000, 1022)"""
```
(Pull the IDs out of the `campaign_criterion` resource names first, then query these two
directly. Both are plain GAQL against the standard `search()` call, same as everything
else here; no separate service needed.)

### Finding the actual landing page a campaign sends traffic to

```python
# Search ads:
q = "SELECT campaign.name, ad_group_ad.ad.final_urls FROM ad_group_ad WHERE campaign.name = 'Campaign Name'"
# Performance Max (no ads, final URL lives on the asset group):
q = "SELECT campaign.name, asset_group.final_urls FROM asset_group WHERE campaign.name = 'Campaign Name'"
```

Do this **before** concluding a campaign's ad copy or targeting needs work. Pull the exact
`final_urls` value, then check that specific page's `pagePath`/`landingPagePlusQueryString`
bounce rate in GA4 (see `analytics.md`) filtered to `sessionSourceMedium = google / cpc`,
for the same date window. This is how a campaign that looks healthy in Ads metrics (good
CTR, cheap CPC, on-topic search terms) can still be failing entirely: the ad is doing its
job and the *page* it points to is what's losing people. Don't optimize keywords/bids when
this cross-check shows the real problem is downstream of the click.

### Campaign creation gotchas hit in practice

- `campaign.contains_eu_political_advertising` became a **required** field on campaign
  creation (mid-2026 EU regulation rollout). Omit it and creation fails with
  `field_error: REQUIRED`. Set explicitly:
  `client.enums.EuPoliticalAdvertisingStatusEnum.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING`
- Setting a bidding strategy needs `client.copy_from(campaign.target_spend,
  client.get_type("TargetSpend"))`, not `campaign.target_spend.CopyFrom(...)`: proto-plus
  objects don't expose a raw `.CopyFrom()`.
- Always create new campaigns **`PAUSED`**, review manually, then enable. Real money starts
  the instant a campaign goes `ENABLED` and clears any pending review.

## The goal every time this is invoked

Answer these five questions, per campaign where it makes sense, in an easy-to-digest format:

### 1. For each campaign, what's the current performance?

Impressions, clicks, cost, CTR, avg CPC, conversions, plus, **before** the numbers,
`primary_status` and `primary_status_reasons`. A campaign stuck at 0 impressions for days
despite correct setup almost always has an account-level blocker (verification, billing,
policy). Say that plainly instead of leading with "0 impressions" as if it were a
performance fact rather than a serving problem.

### 2. What can we do to improve performance? (cross-check GA4 and GSC)

- **Keyword-level `system_serving_status`**: a campaign can look healthy in aggregate while
  most individual keywords never serve. That's a different fix (broaden match, consolidate
  ad groups, see above) than a performance problem.
- **Compare GA4's `sessionSourceMedium = google / cpc` sessions against Ads' own click
  count** for the same window. They won't match exactly (different methodologies), but a
  large gap is worth noting.
- **Check the destination landing page's bounce rate for the traffic this campaign sends**
  (see `analytics.md`). A campaign can be doing its job (delivering clicks cheaply) while
  the page it points to is what's actually failing. Don't optimize the ad when the page is
  the problem.
- **Check GSC** for whether the same keywords/topics are also gaining organic traction. A
  keyword doing well in Ads but invisible in organic search (or vice versa) is worth knowing
  either way.
- Once real traffic exists: identify the worst-performing segment → check the Search Terms
  report for irrelevant matches → add negatives → re-measure after enough volume. Don't
  optimize on single-digit sample sizes.

### 3. Can we optimize the spend?

- Which conversion action is Primary: confirm it's a real business outcome, not the
  default auto-created page-view action (see above). Bidding optimizes toward whatever is
  marked primary, so this is the single highest-leverage spend-efficiency check.
- Budget vs actual daily spend: a campaign consistently spending well under its budget cap
  usually means it's serving-constrained (audience/keywords too narrow), not that it's
  "saving money."
- Asset group ad strength for PMax (see above): "Poor" ad strength directly costs reach.

### 4. Are we targeting the correct audience?

Pull `campaign_criterion` (see above) for location/language/audience per campaign and state
it plainly; don't assume a campaign is scoped the way you expect. Cross-check against GA4's
actual country/device breakdown for `google / cpc` traffic over the same window: does real
serving geography match the intended targeting?

### 5. Is there any other campaign we should run that we don't?

This one isn't purely a query. It needs the account's actual campaign list compared against
whatever the current marketing/keyword strategy document says should exist (e.g. a keyword
tracker or campaign plan the human has, if one exists; ask if unsure where it lives).
Concretely: list all campaigns via `SELECT campaign.name, campaign.advertising_channel_type,
campaign.status FROM campaign`, then check whether any planned vertical/keyword theme from
the strategy has zero corresponding campaign or ad group. Flag gaps, don't silently create
campaigns to fill them. This is a "propose, then get confirmation" finding, not something
to execute unprompted (see Safety notes).

## Safety notes

- Never create campaigns/budgets already `ENABLED` without the human reviewing first.
- Never attempt to fetch or print the developer token, client secret, or refresh token.
  These live only in `{{growth.credentials.adsYaml}}`, read by the client library, never
  surfaced.
- Match-type or budget changes count as "regular" (reversible, no real-world side effect
  beyond Ads' own systems), but campaign status changes to `ENABLED` and anything that
  starts spend should be treated as needing explicit permission even when a broad standing
  instruction like "manage the ads account" exists, unless the human has specifically said
  to turn spend on.
