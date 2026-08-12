# Getting started (no prior Cursor experience)

This guide assumes you can use email and a web browser. It does not assume you know git or a terminal.

Quarry is a **folder of files** you open in the Cursor app. An agent in Cursor chat runs your job search. It is not a website.

## 1. Install Cursor

1. Go to [https://cursor.com](https://cursor.com) and create an account.
2. Download Cursor for Mac, Windows, or Linux and install it.
3. Open Cursor and sign in.
4. Use a **Cursor Pro** plan at about **$20/month** (check Cursor’s current pricing).
5. In chat model settings, pick **Composer 2.5** at **regular** speed.

Composer 2.5 can run this project. Cursor currently prices that model’s tokens cheaply (they subsidize them), so a $20/month plan can run a lot of hunts. Prices can change.

## 2. Install Node.js and Python

**Node.js** builds resume and cover PDFs.

1. Go to [https://nodejs.org](https://nodejs.org).
2. Download the **LTS** installer.
3. Run it (Next, Next, Finish). Keep “Add to PATH” if you see that option.

**Python 3** saves and restores job-board logins.

- Mac / Linux: often already installed. In Cursor’s terminal, try `python3 --version`.
- Windows: install from [https://www.python.org](https://www.python.org). Check **Add Python to PATH**.

## 3. Get Quarry onto your computer

### Option A — ZIP (simplest)

1. Open [https://github.com/jackjusko/quarry](https://github.com/jackjusko/quarry).
2. Click **Code → Download ZIP**.
3. Unzip the file. You should see a folder that contains `README.md`.

### Option B — git

If you already use git:

```bash
git clone https://github.com/jackjusko/quarry.git
cd quarry
npm install
```

If you used the ZIP, open a terminal in that folder (in Cursor: **Terminal → New Terminal**) and run:

```bash
npm install
```

## 4. Open Quarry in Cursor

1. In Cursor: **File → Open Folder**.
2. Select the Quarry folder (the one with `README.md`).
3. Open the chat panel.

## 5. Run setup

Type:

```text
run setup
```

Answer the questions one section at a time:

1. What kind of work you want (any field).
2. Which job sites to search. When the agent opens a login page, **you** sign in. LinkedIn: email and password (not Google). The agent saves the session so it survives a cookie refresh.
3. Your contact and work-auth answers. Street, date of birth, and EEO questions are optional — skip if you prefer.
4. Your work history (paste a resume or point at a PDF).
5. How you want resumes tailored.

Filled profile and resume data stay on your machine. Do not publish a public GitHub copy of a filled hunt.

## What you type after setup

Copy and paste these into chat:

| Say this | What it does |
| --- | --- |
| `run job hunt` | Find and stage applications |
| `run job hunt, N=10, focus: remote registered nurse in Texas` | Override count and focus |
| `fill the packet for <company>` | Fill the form; **does not submit** |
| `fill the packet for <company> and submit if the completeness check passes` | Opt-in apply for that one |
| `for this session, submit after verification. Stop on leftovers, captcha, or login.` | Opt-in apply until you turn it off |
| `turn submit off` | Back to review-only |
| `mark <company> applied` | After a submit (yours or the agent’s) |
| `skip <company>, reason: …` | Drop a role |
| `restore my job board logins` | After Cursor wiped cookies |
| `remember this for the next fill` | Save an ATS quirk to lessons |

## How the agent is supposed to behave

**Submit is off unless you turn it on.** `fill` never clicks Submit by itself.

**Application memory:** board playbooks and `lessons.md` are standing notes for Greenhouse, Lever, Ashby, and the rest. The agent should use them on every fill. You should not re-explain the same quirk each time. If a new quirk shows up, tell it to record it (`remember this for the next fill`).

**Completeness check:** the agent must not say a form is filled until it has scrolled the page, read the fields back, and checked uploads. If it says “done” and you still see blanks, paste:

```text
This is not complete. Re-run the verification gate, list empty required fields, and fill them. Do not say filled until the check passes.
```

If submit is on, that check must still pass before Submit.

## If something is wrong

| What happened | What to type |
| --- | --- |
| Packet already filled | `This packet is already filled. Do not refill. Open the next staged packet.` |
| You already submitted | `I already submitted this. Mark it applied.` |
| Empty required fields | Use the verification-gate prompt above. Do not click Submit until leftovers are listed. |
| Form asks for SSN / sample / extra essay | Agent should list leftovers and stop. Fill those yourself, or `update my candidate profile with … then finish the form`. |
| No resume/cover attached | `Resume and cover are not attached. Run the upload chunk steps again. Do not report filled.` |
| Login or captcha | `Stop. I will sign in / solve the captcha. Wait.` Then `continue filling` or `save this board login`. |
| Logged out mid-hunt | `Restore my job board logins and continue.` If that fails: `I will sign in again on <site>. Save it when I am done.` |
| Wrong company tab | `Stop. You are on the wrong page. Unlock, open <url> in a new tab, and fill that packet only.` |
| Listing gone | `Skip this packet. Mark skipped: listing gone. Next packet.` |
| Invented job or date | `That is not in my experience pool. Remove it. Do not invent employers or dates.` |
| Wrong city or occupation in the hunt | `Stop staging. Re-run setup for the hunt config only.` |
| Filling without being asked | `Do not fill forms unless I ask. Unlock the browser.` |
| Submitted when you did not ask | `Do not submit unless I say so. Turn submit off.` |
| Form looks right and you want it sent | `The form looks right. Submit it.` |

## Next reading

- [README.md](../README.md) — what Quarry is, why use it, capabilities, then the search loop and what to type
- `.cursor/skills/apply-autofill/boards/` — notes for common application hosts
- `.cursor/skills/apply-autofill/lessons.md` — living fill notes
