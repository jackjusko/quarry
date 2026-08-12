# LinkedIn discovery playbook

For on-demand **job-hunt** runs when `linkedin` is **enabled** in [`../config.md`](../config.md). Agent uses browser tools. **You** submit applications.

## Auth prerequisite

Before LinkedIn discovery or Easy Apply, read [`../browser-auth.md`](../browser-auth.md):

- If LinkedIn is in **Active sessions** → proceed with browser tools (session cookies live in the Cursor browser profile).
- If LinkedIn is under **Boards needing login** → restore cookies (`python3 scripts/browser-auth.py restore linkedin`) or ask the human to sign in at https://www.linkedin.com/login using **email + password** (Google OAuth often fails in Cursor browser). After login, human updates `browser-auth.md`.

If LinkedIn is **disabled** in config, do not use this playbook.

## Goals

- Find roles matching **title allow-list** and **location filter** from [`../config.md`](../config.md)
- Score against config weights
- Avoid duplicates in [`../tracker.md`](../tracker.md)
- Never submit an application during discovery/staging unless the user explicitly asks in a separate apply session

## Search seeds (from config)

Build queries from config — do not hardcode occupation or city:

- Primary titles from **Title allow** in config
- Location filters from **Location hard filter** (e.g. remote US, preferred metro)
- Junior / Associate variants when volume is low

Also pull public ATS boards when links appear (Greenhouse, Lever, Ashby) — often cleaner JD text.

## Rate and account safety

- Cap LinkedIn browsing actions per run: aim for **discovery for ~20–40 listings**, not hundreds of rapid scrolls
- Pause between searches; do not open dozens of tabs in a burst
- If LinkedIn shows a checkpoint, captcha, or restriction warning: **stop LinkedIn**, finish with ATS/public pages already collected, note the block in the handoff
- Do not install unofficial LinkedIn scrapers or steal session cookies into scripts
- Do not auto-message recruiters in bulk during discovery

## Deduping

Before staging, check `pipeline/tracker.md` for the same company+title or the same job URL. Skip duplicates.

## What to capture per role

- Company, title, location, easy-apply vs external URL
- Salary if shown
- Full JD text (or best available)
- Why it scored (one line, using config weights)

## Hard rules

1. **No auto-submit** during job-hunt — stage packets only
2. **No password or 2FA bypass**
3. Prefer quality shortlist over maximum Easy Apply spam
4. Comp below [`../config.md`](../config.md) floor → mark `skipped` with reason (unless comp unknown and config keeps unknown)
5. Senior/stretch titles → skip unless user enabled stretch mode in chat or config
