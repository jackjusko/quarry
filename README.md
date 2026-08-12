# Quarry

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Quarry is a job hunt engine.** You tell it what you want. It discovers matching roles, builds a tailored application for each one, and fills the employer’s form when you ask.

It runs on your computer inside [Cursor](https://cursor.com) — a desktop app with a chat panel. You open this folder, talk to an **assistant** (the AI in Cursor) in plain English, and Quarry does the hunt work: search, score, draft, stage, fill. Your contact info, work history, job-site logins, and applications stay on your machine. Nothing is sent to a Quarry cloud.

Setup asks what kind of work you want. Nursing, trades, product, design, research, operations, software — same engine; your titles, boards, and scoring change with your answers.

**New to Cursor?** Install steps are in [docs/getting-started.md](docs/getting-started.md). This page is what Quarry does and how to run it.

## Why use it

Job hunting is a loop: scan boards, decide if a posting fits, rewrite the resume, write a cover letter, type the same answers into another online form, track what you sent. That loop repeats for every role.

Quarry is the engine for that loop. You set the target once. Then you say `run job hunt` and it discovers roles, stages a ready-to-review application packet for each match, and — when you ask — fills the tailored materials into the live form. You keep the judgment: which roles to keep, whether the drafts are honest, when to hit Submit, and how to handle captchas, logins, and leftover questions.

Use it if you want a hunt that runs to your rules, on your machine, without a black-box auto-apply service inventing bullets and firing applications for you.

## What it can do

1. **Discover jobs that match what you want.** You say `run job hunt`. Quarry searches only the sites you enabled, scores openings against your titles, location, pay floor, and other rules, and keeps the strong matches. It does not wander onto boards you never turned on.

2. **Build a tailored application for each match.** For every role it keeps, it stages a **packet** — one folder with the posting, a role-targeted resume and cover letter (PDFs included), draft form answers, and a short handoff note. Materials come from your real work history (`experience/pool.md`) and your tailor rules. It does not invent employers or dates. You can ask it to rewrite a resume or cover letter for a packet.

3. **Fill those applications in the browser.** When you ask, it opens the apply page in Cursor’s browser, uploads the tailored resume and cover letter, and fills contact fields, work-auth answers, dropdowns, and other questions from your profile and packet. Submit stays off unless you turn it on. It checks the page before calling a form filled. It also keeps notes on common application hosts (Greenhouse, Lever, Ashby, and others), so the next fill on that host is less of a re-teach.

4. **Configure the engine once for your field.** Setup is a short interview in chat: occupation and titles, which boards to search (and login when a site needs it), contact and optional EEO answers, work history, and how resumes should be shaped. After that, hunts follow your config.

5. **Track the hunt and help after you apply.** A tracker lists each role (staged, filled, applied, skipped, interview). On request, it can draft follow-up notes or interview prep from your experience pool.

What it does **not** do by default: click Submit, run unattended overnight, invent experience, or search boards you never turned on. Captchas, login walls, and leftover fields always stop the run so you can take over.

## What a hunt looks like

1. **Setup (once).** Type `run setup`. Answer one section at a time. You can edit the resulting files by hand later.

2. **Discover.** Type `run job hunt`. Quarry stages packets under `pipeline/packets/` and updates `pipeline/tracker.md`.

3. **Review.** Open the packets. Drop roles you do not want. Fix drafts before anyone fills a form.

4. **Fill (when you ask).** Type `fill the packet for <company>`. Quarry fills the tailored application into the live form. By default it does **not** click Submit. You check the form, then submit yourself — or turn submit on for that packet or session (see [What to type](#what-to-type)).

5. **Track.** After a real submit, tell it to mark the company applied (or skipped, or interview).

## What you do and what Quarry does

You install Cursor, answer setup, keep the work history truthful, sign in on job sites when asked, solve captchas, review packets, and decide when something is ready to send. Every application is yours.

Quarry writes config and materials from what you gave it, discovers and stages packets, fills forms when you ask, updates the tracker when you say so, and records form quirks for the next fill on that host. If it misses a quirk, say `remember this for the next fill`.

## What you need

- **Cursor** — the app where you open this folder and chat. A Cursor Pro plan (about $20/month; check current pricing) is enough. In chat model settings, pick **Composer 2.5** at **regular** speed. That model can run setup, hunt, resume, cover letter, and fill. Cursor currently prices those tokens cheaply; prices can change.
- **Node.js (LTS)** — builds resume and cover letter PDFs.
- **Python 3** — saves and restores job-site login sessions so you are not signing in from scratch after every cookie wipe.

Step-by-step install (including ZIP download if you do not use git): [docs/getting-started.md](docs/getting-started.md).

When the folder is open in Cursor, type:

```text
run setup
```

Do not run a hunt or fill forms until setup finishes. The assistant will refuse if placeholders like your name are still missing.

## The files that matter

You do not need to memorize the whole tree. These are the ones you will open or edit:

| File or folder | What it is for |
| --- | --- |
| `pipeline/config.md` | Hunt rules: titles, location, pay, which sites to search, whether submit is allowed |
| `pipeline/candidate-profile.md` | Name, contact, work authorization, optional address and EEO answers for forms |
| `experience/pool.md` | Your real work history — employers, dates, outcomes. Source of truth for resumes |
| `experience/tailor-policy.md` | Which roles always appear, how to weave keywords, which resume sections to keep |
| `pipeline/tracker.md` | Status of each job (staged, filled, applied, skipped, interview) |
| `pipeline/packets/` | One folder per staged application |

Login session files under `pipeline/browser-auth/` stay on your machine and are not meant for public GitHub. Packet contents and generated PDFs are also kept out of normal commits.

## What to type

The assistant follows instructions stored as **skills** inside this project. You steer them in chat. There is no full-auto loop that discovers, fills, and submits everything while you sleep.

### Hunt

```text
run job hunt
```

Finds roles and builds packets from your enabled sources. Override count or focus when you need to:

```text
run job hunt, N=10, focus: remote registered nurse in Texas
stage these URLs: https://…
skip LinkedIn this run, public ATS only
```

(“ATS” means the employer’s online application system — Greenhouse, Lever, and similar hosts.)

### Materials

```text
tailor the resume for packet …
rewrite the cover letter, shorter
```

### Fill (default — review only)

```text
fill the packet for <company>
fill the next staged packet. Do not submit.
```

### Fill and submit (only when you opt in)

```text
fill the packet for <company> and submit if the completeness check passes
for this session, submit after verification. Stop on leftovers, captcha, or login.
submit this form
turn submit off
```

Even with submit on, leftovers, captcha, and login walls stop the run. The assistant must pass a completeness check (scroll the page, read fields back, confirm uploads) before it may click Submit.

### Status and memory

```text
mark <company> applied
skip <company>, reason: …
restore my job board logins
remember this for the next fill
```

Use `restore my job board logins` after Cursor clears cookies. Use `remember this…` when a form quirk should stick for the next fill on that host.

## Limits

- **Submit is off unless you turn it on.** Typing `fill` never clicks Submit by itself.
- **No inventing.** Dates, employers, and outcomes must come from your experience pool. If the assistant makes something up, tell it to remove it.
- **Completeness before “filled.”** The assistant must not call a form done until the check above passes. If you still see blank required fields, paste:

```text
This is not complete. Re-run the verification gate, list empty required fields, and fill them. Do not say filled until the check passes.
```

More corrections (wrong tab, listing gone, already submitted): [docs/getting-started.md](docs/getting-started.md#if-something-is-wrong).

- **You stay in the loop.** Sign-ins, captchas, and odd leftover questions (SSN, custom essays, samples) need you. Prompt one step at a time when something blocks.

## Privacy

Filled profile, pool, packets, and saved login files stay on your computer. Do not push a public copy of a live hunt to GitHub.

## Cost

Composer 2.5 at regular speed is enough. A hunt still takes many chat turns (each packet is several steps). On Cursor’s current pricing, that model’s tokens are cheap enough that a $20/month plan can run this often. Cursor’s prices can change. Bigger or slower models are optional, not required.

## Disclaimer

Respect employer and application-site terms of use. You are responsible for the accuracy of claims on your materials and for any submit you enable. The assistant fills; you own the application.

## Credits

The **write-well** skill uses George Orwell’s essay [*Politics and the English Language*](https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/politics-and-the-english-language/) (Horizon, 1946). Credit to Orwell for that part of the prose guidance. The rest of Quarry is separate work.
