# Quarry

Local Cursor project for a job search. Not a web app. Nothing runs in the cloud on the user’s behalf.

## First rule

If setup is incomplete (`YOUR_NAME` in `pipeline/candidate-profile.md`, `SETUP_INCOMPLETE` in config/tailor-policy, or missing `pipeline/.setup-complete`), run the **setup** skill. Do not stage packets or open application forms until setup finishes.

## What this repo does

1. **setup** — occupation, discovery boards + logins, profile, experience pool, tailor policy
2. **job-hunt** — discover and stage packets (enabled sources only)
3. **tailor-resume** / **cover-letter** — materials into packets
4. **apply-autofill** — fill forms on request (`disable-model-invocation`; user must ask)
5. **interview-prep** / **follow-up** — on request

Submit stays **off** unless the user turns it on (`when-verified` or an explicit “submit” ask). Completeness check before any submit. Captcha, login, and leftovers always stop the run.

After a non-trivial fill, append `.cursor/skills/apply-autofill/lessons.md` and update board playbooks when the quirk is ATS-wide.

## Model

Composer 2.5 at regular speed can run this workflow. On Cursor’s current pricing, that model’s tokens are cheap (Cursor subsidizes them), so a $20/month plan can run a lot of hunts. Prices can change.

## Paths

| Path | Role |
| --- | --- |
| `pipeline/config.md` | Hunt filters, sources, scoring, submit mode |
| `pipeline/candidate-profile.md` | Autofill identity |
| `experience/pool.md` | Experience source of truth |
| `experience/tailor-policy.md` | Core roles, weave, sections |
| `pipeline/tracker.md` | Status |
| `pipeline/browser-auth.md` | Login registry |
| `.cursor/skills/` | Agent skills |

Prose for letters and docs: **write-well** under `.cursor/skills/write-well/`.
