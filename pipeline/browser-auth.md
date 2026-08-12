# Browser authentication registry

Tracks which job boards are logged in inside the **Cursor embedded browser**. Agents read this before discovery or apply flows that need an account.

## How sessions persist

- Login cookies live in the Cursor browser profile (not in git).
- **Backup / restore:** `scripts/browser-auth.py` copies board cookies to `pipeline/browser-auth/<board>.json` (gitignored). After a cookie wipe, restore — no full re-login if the saved session is still valid.
- CDP cookie export/import is blocked in the embedded browser — use the Python script instead.
- **Do not** clear browser data unless you plan to restore or re-login.
- If a board redirects to login, restore (`python3 scripts/browser-auth.py restore <board>`) or sign in again, then `save`.

### Save / restore commands

```bash
python3 scripts/browser-auth.py save linkedin
python3 scripts/browser-auth.py save ycombinator
python3 scripts/browser-auth.py save <custom_id>

python3 scripts/browser-auth.py restore all
python3 scripts/browser-auth.py list
```

Cookie store paths (auto-detected by the script):

- Linux: `~/.config/Cursor/Partitions/cursor-browser/Cookies`
- macOS: `~/Library/Application Support/Cursor/Partitions/cursor-browser/Cookies`
- Windows: `%APPDATA%/Cursor/Partitions/cursor-browser/Cookies`

**Never commit** `pipeline/browser-auth/*.json` — they contain live session tokens.

## Selected discovery sources

Filled by setup. Match `pipeline/config.md` enabled sources.

| Board id | Label | Domains | Verified | Saved file | Notes |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | Run setup to add boards |

## Login tips

- **LinkedIn:** use email + password. Google OAuth often hangs in the Cursor embedded browser.
- After human login, agent verifies feed/account page (not a login wall), then runs `save`.
- Never store passwords in this repo.
