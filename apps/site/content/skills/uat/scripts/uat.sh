#!/usr/bin/env bash
#
# uat.sh: drive the app's API to build a UAT scenario end to end.
#
# Every subcommand prints the one id/token you need for the next step on stdout,
# so steps compose:  ID=$(uat.sh create 'My thing'); uat.sh urls "$ID"
#
# Config (env, with defaults for a local dev stack):
#   UAT_API     API base URL                (default http://localhost:3001)
#   UAT_WEB     frontend base URL           (default http://localhost:3000)
#   UAT_JAR     cookie jar path             (default a temp file, reused per shell)
#   UAT_LOGIN   dev-login path on UAT_API   (default /auth/login/demo?userId=)
#
# Requires: curl, python3.

set -euo pipefail

API="${UAT_API:-http://localhost:3001}"
WEB="${UAT_WEB:-http://localhost:3000}"
JAR="${UAT_JAR:-${TMPDIR:-/tmp}/uat-cookies-$(id -u).txt}"
LOGIN_PATH="${UAT_LOGIN:-/auth/login/demo?userId=}"

die() { echo "uat: $*" >&2; exit 1; }

# Extract a value from a JSON document on stdin via a python expression over `d`.
#   echo '{"res":{"id":"x"}}' | jget "d['res']['id']"
# Empty input means the request before it already failed and printed why: exit quietly.
jget() { local in; in="$(cat)"; [ -n "$in" ] || exit 1; printf '%s' "$in" | python3 -c "import json,sys;d=json.load(sys.stdin);print($1)"; }

# Build a JSON object from key=value pairs, safely quoted.
#   jobj name="Rooftop Dinner" visibility=unlisted
jobj() {
    python3 -c 'import json,sys;print(json.dumps(dict(a.split("=",1) for a in sys.argv[1:])))' "$@"
}

# api METHOD PATH [curl args...]
# Sends the cookie jar, stores any new cookies, and fails loudly on HTTP >= 400
# so a broken step never silently yields an empty id that poisons the next one.
api() {
    local method="$1" path="$2"; shift 2
    local body out code
    out="$(curl -s -w '\n%{http_code}' -b "$JAR" -c "$JAR" \
        -X "$method" "$API$path" -H 'Content-Type: application/json' "$@")" \
        || die "$method $path: cannot reach $API"
    code="${out##*$'\n'}"; body="${out%$'\n'*}"
    if [ "$code" -ge 400 ]; then
        echo "uat: $method $path -> HTTP $code" >&2
        echo "$body" >&2
        exit 1
    fi
    printf '%s' "$body"
}

cmd_login() {
    local user="${1:-}"
    [ -n "$user" ] || die "usage: uat.sh login <seededUserId>"
    rm -f "$JAR"
    local code
    code="$(curl -s -o /dev/null -w '%{http_code}' -c "$JAR" "$API$LOGIN_PATH$user" || true)"
    [ "$code" != "000" ] || die "cannot reach $API. Is the backend running?"
    [ "$code" -lt 400 ] || die "dev login -> HTTP $code. Is the dev-login flag set, and does user $user exist?"
    # Cookie lines have 7 tab-separated fields (HttpOnly ones start with #HttpOnly_).
    awk -F'\t' 'NF >= 7' "$JAR" 2>/dev/null | grep -q . \
        || die "no session cookie set. Check the dev-login route and its env flags."
    echo "$user"
}

# TODO: one subcommand per scenario step. Read the route definition first for
# required fields and the response envelope, and check the auth middleware for
# role-specific rules (e.g. a query param one role needs and another rejects).
cmd_create() {
    local name="${1:-UAT thing}"
    api POST /api/things -d "$(jobj name="$name")" | jget "d['id']"   # TODO: real path/fields
}

# TODO: act as a second user or guest. Either log in again with a different jar
# (UAT_JAR=... uat.sh login <otherUserId>) or pass the app's guest token header.
cmd_respond() {
    local id="${1:-}" token="${2:-}"
    [ -n "$id" ] && [ -n "$token" ] || die "usage: uat.sh respond <id> <guestToken>"
    api POST "/api/things/$id/respond" -H "x-guest-token: $token" \
        -d "$(jobj response=yes)" >/dev/null                          # TODO: real path/header
    echo ok
}

cmd_urls() {
    local id="${1:-}"
    [ -n "$id" ] || die "usage: uat.sh urls <id>"
    echo "public page : $WEB/things/$id"           # TODO: real pages
    echo "owner view  : $WEB/dashboard/things/$id"
}

# TODO: chain the steps for a state you reach often.
cmd_scenario_basic() {
    local user="${1:-}"
    [ -n "$user" ] || die "usage: uat.sh scenario-basic <seededUserId>"
    cmd_login "$user" >/dev/null
    local id; id="$(cmd_create "UAT $(date +%H%M%S)")"
    cmd_urls "$id"
}

case "${1:-}" in
    login)          shift; cmd_login "$@" ;;
    create)         shift; cmd_create "$@" ;;
    respond)        shift; cmd_respond "$@" ;;
    urls)           shift; cmd_urls "$@" ;;
    scenario-basic) shift; cmd_scenario_basic "$@" ;;
    *) cat >&2 <<'USAGE'
usage: uat.sh <command>

  login <seededUserId>        dev login, store the session cookie
  create <name>               create an entity            -> id      (TODO)
  respond <id> <guestToken>   act as a guest on it                   (TODO)
  urls <id>                   print the pages to open
  scenario-basic <userId>     login + create + urls in one go

env: UAT_API, UAT_WEB, UAT_JAR, UAT_LOGIN (see header)
USAGE
       exit 1 ;;
esac
