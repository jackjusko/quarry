# Work at a Startup (YC) playbook

**Requires login.** Check [`pipeline/browser-auth.md`](../../../../pipeline/browser-auth.md) before applying. Session persists in the Cursor browser profile after human login.

## URLs

- Job listing: `https://www.workatastartup.com/jobs/<id>`
- Apply flow: `https://www.workatastartup.com/application?signup_job_id=<id>` (redirects to login if session missing)
- Profile wizard: `https://www.workatastartup.com/application/personal` (and Location, Role, Experience, Skills, Career, Share steps)

## Workflow

1. Confirm YC session in `browser-auth.md` — if YC is under **Boards needing login**, restore cookies or ask human to sign in at `https://account.ycombinator.com/`.
2. Open listing with `newTab: true` → **Apply now** (or direct apply URL).
3. If profile wizard opens first, complete sections from `candidate-profile.md` + packet `form-answers.md`, then return to job apply.
4. Upload resume/cover if file inputs exist (DataTransfer chunk method; selectors vary — find `input[type=file]` via CDP).
5. Submit only when apply-autofill submit policy allows (config `when-verified` or explicit user ask).

## Profile wizard fields

Map every field from [`pipeline/candidate-profile.md`](../../../../pipeline/candidate-profile.md) + packet `form-answers.md`:

| Field | Source |
| --- | --- |
| First / Last | `YOUR_FIRST` / `YOUR_LAST` |
| Email | `YOUR_EMAIL` |
| LinkedIn | `YOUR_LINKEDIN_URL` |
| Phone | `YOUR_PHONE_COUNTRY` + `YOUR_PHONE` |
| Job search status | form-answers or sensible default (e.g. actively looking) |
| YC company affiliation | form-answers (usually no affiliation) |
| Hidden companies | leave blank unless form-answers says to hide current employer |

Do not hardcode identity values — read profile.

## Apply message (not a PDF upload)

**Apply** opens a modal textarea (“Start a conversation…”), not Greenhouse file fields. Profile data carries resume/experience.

| Rule | Value |
| --- | --- |
| Min length | 50 characters |
| Close | **Always** end with interest in talking (profile prose preference) |
| Onsite/hybrid | Per config location policy + profile (local meet-in-person line when configured) |
| Fully remote | No local coffee line unless profile says so |
| Stretch warning | UI may warn qualifications mismatch — apply when staged; document years framing in handoff |
| Submit | **Send** button (enabled after min length) |

Draft from packet `cover-letter.txt` + `form-answers.md`; sign with full name from profile. Do not overwrite if human edited the textarea.

## Gotchas

- **Login gate:** Unauthenticated users hit `account.ycombinator.com/authenticate?continue=…`. Human must log in once; agents cannot create accounts or use magic links without email access.
- **Email verify:** Account page may show **Verify email** — complete if submission fails.
- **No Greenhouse selectors:** Do not reuse `#resume` / `#cover_letter` apply.js blindly.
- **Senior years mismatch:** JD may ask more years than calendar history — use honest form-answers framing; do not invent calendar years without defense.

Full write-ups: [`../lessons.md`](../lessons.md) Work at a Startup section
