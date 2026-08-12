# Quarry

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Quarry is a folder of files you open in [Cursor](https://cursor.com), a desktop app with a chat panel. You type what you want in that chat. An **assistant** (the AI in Cursor) runs a job search on your computer: finds roles that match your rules, drafts a resume and cover letter for each one, and fills the online application form when you ask.

It is not a website you log into. Nothing in this project sends your profile or applications to a Quarry server. Your contact info, work history, and job-site logins stay on your machine.

You can use it for any kind of work you set during setup — nursing, trades, product, design, research, operations, software, and so on.

**New to Cursor?** The click-by-click install is in [docs/getting-started.md](docs/getting-started.md). This page explains what Quarry is and how a search goes.

## What a search looks like

1. **Setup (once).** You type `run setup` in chat. The assistant asks, one section at a time: what work you want, which job sites to search, your name and contact answers, your work history, and how you want resumes adjusted for each role. You can edit the resulting files by hand later if you prefer.

2. **Hunt.** You type `run job hunt`. The assistant looks only at the sites you turned on. It scores openings against your titles, location, pay floor, and other rules, then builds a **packet** for each strong match. A packet is a folder for one job. It holds the posting, a tailored resume and cover letter, draft answers for common form questions, and a short handoff note.

3. **Review.** You open the packets under `pipeline/packets/` and check the status list in `pipeline/tracker.md`. Drop roles you do not want. Fix anything wrong in the drafts before anyone fills a form.

4. **Fill (when you ask).** You type something like `fill the packet for <company>`. The assistant opens the application in Cursor’s built-in browser and fills the fields it can. By default it does **not** click Submit or Apply. You look at the form, then submit yourself — or you turn submit on for that packet or session (see [What to type](#what-to-type)).

5. **Track.** After a real submit, tell the assistant to mark the company applied (or skipped, or interview). The tracker stays the running list of where you are.

Captchas, login walls, and leftover fields the assistant cannot answer always stop the run. You handle those, then say continue.

## What you do and what the assistant does

You install Cursor, answer setup, keep your work history truthful, sign in on job sites when asked, solve captchas, review packets, and decide when something is ready to send. Every application is yours.

The assistant writes hunt config and materials from what you gave it, stages packets, fills forms when you ask, updates the tracker when you say so, and writes down quirks it hits on common application hosts (Greenhouse, Lever, Ashby, and others). The next fill on that host can reuse those notes. You should not have to re-explain the same dropdown or upload every time. If it misses a quirk, say `remember this for the next fill`.

## What you need

- **Cursor** — the app where you open this folder and chat. A Cursor Pro plan (about $20/month; check current pricing) is enough for this workflow. In chat model settings, pick **Composer 2.5** at **regular** speed. That model can run setup, hunt, resume, cover letter, and fill. Cursor currently prices those tokens cheaply; prices can change.
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
