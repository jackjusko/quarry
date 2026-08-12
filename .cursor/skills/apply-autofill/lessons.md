# Application fill lessons (living log)

**Always append** when you solve (or hard-fail) a fill challenge. Required by `.cursor/rules/document-application-fills.mdc`.

Also keep ATS-wide procedures in [`SKILL.md`](SKILL.md) and [`boards/`](boards/).

---

## Cross-cutting (all ATS)

### PDF upload via DataTransfer chunks

- **Problem:** Cursor CDP denies `Page.setFileInputFiles`; https ATS pages cannot `fetch` `http://127.0.0.1` (mixed content).
- **Fix:**
  1. `node .cursor/skills/apply-autofill/scripts/prepare-upload-chunks.js <resume.pdf> <cover.pdf> pipeline/prep/upload-chunks-<slug>`
  2. `browser_cdp` `Runtime.evaluate` **sequentially**: `r-00…r-NN` → `c-00…c-NN` → `apply.js`
  3. Optional: concatenate chunk files into one `oneshot.js` and eval once, or use a dedicated subagent that evals chunks one-at-a-time
- **Verify:** UI shows filename / **Remove file** for both attachments. Do **not** require `input.files.length` after Greenhouse ingests — it often clears the file input and swaps UI.
- **Do not:** parallelize chunk CDP calls (races `window.__r` / `window.__c`); ask human to Attach when DataTransfer works.

### Dedicated tab + single browser worker

- **Problem:** Navigating without `newTab` stomps an in-progress form on a shared tab. Concurrent upload agent / MyGreenhouse wipes filled fields. Upload-only subagents get `No browser tab available` when the parent’s locked `viewId` is gone.
- **Fix:** Always open apply URL with `newTab: true`. One agent owns the `viewId` until unlock. No parallel CDP workers on the same form. Upload subagent: `browser_tabs` list first; if the handed `viewId`/URL is missing, **abort** (do not eval `__r`/`__c` onto another tab). Parent re-opens with `newTab:true`, re-locks, refills contact, then re-dispatches chunks.
- **Verify:** `browser_tabs` list shows the intended ATS URL on the locked viewId before any upload `Runtime.evaluate`.
- **Do not:** reuse a shared tab for the next employer mid-fill; run a second browser Task against the same viewId while filling; continue chunk eval when the target viewId is absent.

### Completion gate (false “form complete”)

- **Problem:** Agents marked forms filled after aborts / without reading verify JSON.
- **Fix:** Before unlock / “form filled” notes, CDP (or snapshot) must show: contact filled, uploads visible where required, every known screening/EEO select has a value (no bare `Select…`), auth answers set.
- **Verify:** Read the verify result **before** updating meta/tracker. Abort mid-fill → re-snapshot and resume; never mark filled from intent.
- **Do not:** fire verify in parallel with unlock/meta updates and ignore the output.

### Years-of-experience bands

- **Problem:** Under-answering (e.g. **0–1** on a required stack) screens out when the JD bar is higher but the pool can stretch.
- **Fix:** Meet or beat JD bar with lowest defensible band (see SKILL.md Years-of-experience). Use overlapping roles, adjacent tools, and related frameworks — document stretch in handoff.
- **Verify:** Each years select matches form-answers + JD bar; note stretch in handoff.
- **Do not:** pick 0–1 on a required skill when a higher band is interview-defensible.

### Location hard rule (from config)

- **Problem:** Agents skipped eligible hybrid roles or answered local-presence screeners against user policy.
- **Fix:** Read `pipeline/config.md` location allow-list + `candidate-profile.md`. Resume header, typeahead, and “live local / in-office” answers follow that policy — never a hardcoded universal city.
- **Verify:** Form answers match config; meta/handoff notes location intent.
- **Do not:** invent “already local” unless setup configured it; use mailing city on commute screeners.

### Listing gone / careers hub only

- **Problem:** Packet URL pointed at a careers hub or stale link; exact req missing on the live board.
- **Fix:** Open live ATS board, search title. If gone → `skipped` in tracker + meta note + move to next packet. Do not invent a substitute title without user ask.
- **Verify:** Tracker status `skipped` with reason; regenerated materials optional.
- **Do not:** fill a different role under the same packet id silently.

### React controlled inputs reject browser_fill

- **Problem:** `browser_fill` / `browser_type` on some React contact fields throws or prepends literal `undefined` to values.
- **Fix:** Contact text via CDP label lookup + `HTMLInputElement` native value setter + `input`/`change`/`blur` events. Re-verify via CDP, not stale snapshot text.
- **Verify:** CDP read-back shows correct values; no `undefined` prefix in DOM value.
- **Do not:** rely on `browser_fill` alone for stubborn React inputs.

### Phone country react-select empty

- **Problem:** Phone **Country*** react-select stays empty after combobox click; fuzzy CDP `includes('No')` can hit country list instead of Yes/No screening menus.
- **Fix:** Focus country listbox input, `InputEvent` type **United States**, click **United States+1** (or profile `YOUR_PHONE_COUNTRY`). Screening/EEO: `browser_click` each combobox → fresh snapshot → click exact `role: option`.
- **Verify:** Country shows United States +1; no empty required comboboxes.
- **Do not:** bulk CDP option pick across whole document while country portal is open.

---

## Greenhouse

### Standard max-fill + react-select

- **Problem:** React-select comboboxes require interaction pattern; Race hidden until Hispanic answered; GH may clear `#resume.files` after ingest.
- **Fix:** Simplify → Apply manually → Greenhouse `newTab`. Contact → uploads (chunk method) → screening → Hispanic then Race → other EEO. Each combobox: click → snapshot → click exact option → confirm `.select__single-value`.
- **Verify:** **Remove file** ×2; all screening/EEO selects set; `requiredEmpty` [] or listed leftovers.
- **Do not:** stop after contact+uploads; leave EEO blank when profile answers exist; trust `#resume.files` after UI swap.

### Embedded careers site (non-boards host)

- **Problem:** Form lives on company domain, not `job-boards.greenhouse.io` — custom radio UI intercepts `browser_click`; cover field often absent.
- **Fix:** `newTab: true`; contact via `browser_fill`; radios via CDP `label.click()` by question name; resume-only DataTransfer on `#resume`.
- **Verify:** Required radio groups checked; upload UI shows filename; empty required radios [].
- **Do not:** expect `#cover_letter`; parallel-click radios through intercepted spans without CDP.

### Tab loss mid-chunk upload

- **Problem:** Parent handed locked `viewId` with partial chunk state; subagent sees wrong tab — `No browser tab available`; copying base64 chunk JS can corrupt PDFs.
- **Fix:** Abort uploads. Parent `browser_navigate` apply URL with `newTab: true` → lock new `viewId` → refill contact → sequential CDP from **exact** on-disk chunk files. Expect oneshot length to match file bytes.
- **Verify:** Tabs list shows correct Greenhouse URL; chunk eval lengths match PDF size; filenames + Remove file visible.
- **Do not:** eval chunks on missing viewId; hand-edit chunk strings; unlock before verify.

### Extra demographic blocks

- **Problem:** Some GH forms add employer-specific demographic survey before/after standard OFCCP EEO; NYC onsite may have three-way answer (Yes / No relocating / No).
- **Fix:** Fill demographic block from profile where applicable; standard EEO from profile; onsite screener per config location policy. Toggle-flyout + option click per field — do not bulk-select while country menu open.
- **Verify:** Two **Remove file** buttons; Clear-selections on screening selects; consent checked if required.
- **Do not:** use country-code listbox options for Yes/No screening; submit unless submit policy allows.

### Prior-employment / referral long labels

- **Problem:** “Have you worked here before?” uses long option labels, not Yes/No; dual sponsorship (now + future).
- **Fix:** Click exact option text from form-answers; sponsorship **No** on both when profile says no sponsorship needed.
- **Verify:** `.select__single-value` shows intended prior-employment option; both sponsorship No.
- **Do not:** pick generic Yes/No for prior-employment when custom labels exist.

---

## Ashby

### Resume upload — `#_systemfield_resume`

- **Problem:** Greenhouse `#resume` / `#cover_letter` selectors miss Ashby; cover often absent.
- **Fix:** DataTransfer onto `input#_systemfield_resume` with sequential or oneshot `__r` chunks; skip cover unless a file field exists. See `boards/ashby.md`.
- **Verify:** Filename + Delete/Replace; `input.files.length === 1`.
- **Do not:** fetch chunks from localhost on https Ashby; invent a cover upload.

### Location typeahead + Yes/No button pairs

- **Problem:** Ashby uses `_active_*` button pairs; clicking sponsorship can clear in-progress location typeahead. Hidden radios (opacity 0) fail `browser_click`.
- **Fix:** Set location **after** sponsorship Yes/No, or re-set if cleared. Type city → wait past **Loading…** → click exact option from profile/config. Radios: click visible **label text** via CDP.
- **Verify:** Location combobox value set; intended buttons `_active`; no “Your form needs corrections” banner.
- **Do not:** click invisible radio refs; use wrong city for onsite roles per config.

### Phone validation on React fields

- **Problem:** `browser_fill` on phone may not update React state; Yes/No can look clicked but still flagged missing.
- **Fix:** CDP `HTMLInputElement.prototype.value` setter + `input`/`change`/`blur`. Re-click Yes/No via `browser_click` until correction banner clears.
- **Verify:** Phone validates; `_active` on intended buttons; `requiredEmpty` [].
- **Do not:** rely on `browser_fill` alone for phone; trust `_active` alone without re-checking correction list.

### Resume parse autofill

- **Problem:** Upload triggers “Parsing your resume…” which may overwrite fields.
- **Fix:** Fill contact first; upload; re-check all fields after parse completes; re-fill essays/screeners if wiped.
- **Verify:** All required textareas non-empty post-parse.
- **Do not:** skip re-verify after autofill settles.

### Invisible reCAPTCHA

- **Problem:** Some Ashby forms use invisible reCAPTCHA on submit — no checkbox/images.
- **Fix:** Fix all field validation first; human submit may pass automatically after corrections.
- **Verify:** No corrections banner pre-submit.
- **Do not:** assume visible captcha challenge.

### Custom diversity survey (non-OFCCP)

- **Problem:** Some reqs replace standard EEO with age/gender/ethnicity/community checkboxes.
- **Fix:** Use label/radio CDP clicks (opacity-0 pattern); answer from profile or Decline where offered.
- **Verify:** Required survey fields set; `requiredEmpty` [].
- **Do not:** fill optional essay triplet when form says answer **one** only.

### Custom essays — React onChange sync (2026-08-12)

- **Problem:** Custom essay textareas can show text in the DOM after CDP `.value=` / bulk fill while Ashby React state stays empty → “Missing entry for required field” / “Your form needs corrections” on submit.
- **Fix:** `browser_type` with `clear: true` on each required essay, then `browser_cdp` eval [`.cursor/skills/apply-autofill/scripts/ashby-react-sync.js`](scripts/ashby-react-sync.js) (walk `__reactFiber*`, call `onChange`). Set location typeahead **after** Yes/No screeners (sponsorship/years clicks can wipe location). If the form offers three choice essays and says answer **one**, leave the other two blank. Prose: write-well essay length + application-essay theater bans.
- **Verify:** Sync log lists essay field ids/lengths; no corrections banner; intended Yes/No `_active`; only the required essays filled.
- **Do not:** trust visible textarea text alone; fill all three choice essays when the JD says one; skip React sync when Missing entry persists.

### Yes/No buttons are toggles (2026-08-12)

- **Problem:** Ashby Yes/No `onClick` is a **toggle** — a second native `.click()` clears `_active`. Fake React `onClick({preventDefault})` does not stick; `className.includes('_active')` is the gate.
- **Fix:** After essays + React sync, **one** native `.click()` (or `browser_click`) on each intended Yes/No after `scrollIntoView`. Re-check `_active` before unlock.
- **Verify:** Intended buttons `_active`; no corrections banner.
- **Do not:** double-click Ashby Yes/No pairs; trust fiber `onClick` fakes without `_active` confirmation.

### Essay archive — `essay-answers.md` (2026-08-12)

- **Problem:** Submitted essay text lived only in `form-answers.md` or the browser — hard to find for interview prep.
- **Fix:** After every fill with essay textareas, write `pipeline/packets/<id>/essay-answers.md` (prompt + exact answer from CDP read-back). Template: `pipeline/packets/_template/essay-answers.md`. Point `form-answers.md` at it; interview-prep reads it from the packet.
- **Verify:** File exists alongside `resume.pdf` / `cover-letter.txt`; handoff mentions it.
- **Do not:** duplicate long essay text in two packet files; skip archive when form had essays.

---

## Lever

### Resume-only upload + comments cover

- **Problem:** Lever uses `input[name=resume]`, not GH `#resume`; no cover PDF slot — **Additional information** textarea only.
- **Fix:** DataTransfer on `input[name=resume]`; paste cover in `textarea[name=comments]`. Bulk-fill card fields via CDP `cards[uuid][fieldN]` from DOM inspection.
- **Verify:** Resume link + **Success!**; contact + essays non-empty; EEO selects set.
- **Do not:** use Greenhouse `#cover_letter` apply.js; click Submit unless allowed.

### Card UUIDs vary by posting

- **Problem:** Long supplementary sections use `cards[uuid][fieldN]` names that differ between early-talent and mid-level reqs; some cards appear only on certain postings (clearance, HS, product pick).
- **Fix:** Inspect DOM per req before bulk fill; map UUIDs from live form; use form-answers + profile for HS/university when required.
- **Verify:** All visible required cards filled; only optional cards blank when intentional.
- **Do not:** reuse card UUIDs from a different posting blindly.

### Disability CC-305 signature fields

- **Problem:** After disability status select, Lever shows public-burden **Name** + **Date** fields.
- **Fix:** Fill from candidate-profile CC-305 row (name + DOB or today’s date per profile).
- **Verify:** Name and date populated; `requiredEmpty` [].
- **Do not:** skip CC-305 after answering disability status.

### Text vs textarea on start-date fields

- **Problem:** Some card fields are `<input type=text>` — CDP `setTextarea` silently misses them.
- **Fix:** Use native value setter + events for both input and textarea card fields.
- **Verify:** Start date and short answers non-empty in CDP.
- **Do not:** assume all card fields are textareas.

### Listing 404

- **Problem:** Job URL and company Lever board both 404 when req is closed; aggregators may still cache JD.
- **Fix:** Confirm in browser → skip packet; tracker `skipped`.
- **Verify:** Live Lever 404; do not fill cached-only listings.
- **Do not:** invent substitute Lever posting.

---

## Simplify

### Entry pattern

- **Problem:** Simplify wraps Greenhouse; Easy Apply may not expose full form.
- **Fix:** Apply → **I'll Apply Manually** → Greenhouse tab → lock that viewId → full fill per greenhouse playbook.
- **Verify:** Host is employer ATS (often `job-boards.greenhouse.io`) before filling.
- **Do not:** stop on Simplify confirmation if the real ATS form never opened; fill Simplify marketing upsells as the application.

---

## Workable

### Dynamic file input + textarea cover

- **Problem:** Resume uses dynamic `input[type=file]` (not `#resume`); cover is **textarea**; cookie banner blocks clicks; address may autofill wrong city.
- **Fix:** `newTab: true` → Accept cookies → contact/LinkedIn; address from profile location typeahead text. Resume: sequential `r-*.js` → DataTransfer on `document.querySelector('input[type=file]')`. Cover: paste `cover-letter.txt` into `#cover_letter`.
- **Verify:** Visa **No**; country **United States**; essays non-empty; `Resume.pdf` (or configured name) visible; cover textarea has greeting.
- **Do not:** use Greenhouse file apply.js; leave wrong autofill city.

---

## Jobvite

### Angular wizard + hidden file inputs

- **Problem:** Multi-step wizard; `#file-input-0` / `#file-input-1` hidden; radios `pointer-events: none`; double `change()` duplicates cover row.
- **Fix:** Open `/apply` with `newTab: true`. Contact via `browser_fill`; State via `browser_select_option`. Oneshot `__r`/`__c` → DataTransfer on file inputs — **single** Angular change trigger. Screening via label clicks.
- **Verify:** Step 1 filenames + remove; after Next, cover in Angular `resources[]` with S3 URL; `#file-input-0.files[0].name` matches upload name; `errors.resume === false`; **Send Application** unclicked.
- **Verify base64 length:** `window.__r.length` must equal `ceil(pdfBytes/3)*4` — stale chunks → `atob` InvalidCharacterError.
- **Do not:** use GH apply.js; double-call `scope.change()`; click **Send Application** unless submit allowed.

### LinkedIn Apply With widget

- **Problem:** Step 1 shows LinkedIn OAuth widget, not URL field.
- **Fix:** Leave as leftover unless user signs in; fill other contact fields from profile.
- **Verify:** Required non-OAuth fields set.
- **Do not:** assume OAuth fill replaces packet resume.

---

## Teamtailor

### Dropzone uploads in modal

- **Problem:** Apply modal; Dropzone on `#upload_resume_field` — `window.Dropzone` undefined; instance on Stimulus element `.dropzone`. Cover is textarea + optional extra file. Empty `ctoken` until submit.
- **Fix:** Accept cookies → **Apply now!** → screening from form-answers. Chunks → `element.dropzone.addFile(file)` on resume + extra-files field. Paste cover body into textarea. Wait for S3 `*_remote_url` hidden inputs.
- **Verify:** Thanks URL `/applications/<uuid>/thanks/`; filenames visible pre-submit.
- **Do not:** use GH `#resume` apply.js; block on empty `ctoken`; skip post-submit Connect unless asked.

---

## Work at a Startup

### Apply is a message modal

- **Problem:** Apply opens conversation textarea (50+ chars), not file-upload ATS. Profile wizard holds experience.
- **Fix:** Draft from `cover-letter.txt` / `form-answers.md`. **Always** close with interest in talking. Onsite/hybrid per config; fully remote → no local coffee line. Sign from profile.
- **Verify:** **Send** enabled; after submit, confirm Inbox or **Applied** state. API: `fetch('/api/conversations', {credentials:'include'})` if UI hydrates slowly.
- **Do not:** run Greenhouse upload chunks; omit talk-close; overwrite human-edited textarea.

### YC login gate

- **Problem:** Unauthenticated users redirect to `account.ycombinator.com/authenticate`; CDP denies cookie export.
- **Fix:** Human logs in once in Cursor browser. Backup: `python3 scripts/browser-auth.py save ycombinator`. Restore: `python3 scripts/browser-auth.py restore ycombinator`. Record in `browser-auth.md`.
- **Verify:** Sign Out visible; `workatastartup.com/application/personal` loads without redirect.
- **Do not:** create accounts or guess passwords; commit auth JSON; clear cookies without restore.

### Profile wizard before apply

- **Problem:** First apply may require profile sections (personal, location, experience).
- **Fix:** Complete wizard from `candidate-profile.md` + form-answers, then return to job apply message.
- **Verify:** Profile fields match profile; apply modal reachable.
- **Do not:** hardcode identity fields — read profile.

### Senior years mismatch warning

- **Problem:** UI may warn qualifications mismatch when JD asks more years than calendar history supports.
- **Fix:** Stage with honest form-answers framing; handoff documents stretch; apply when user staged the packet.
- **Verify:** handoff notes years framing.
- **Do not:** invent calendar years on screening dropdowns without defense.

---

## LinkedIn Easy Apply

### Session + login

- **Problem:** Discovery skipped — Google OAuth hangs in Cursor embedded browser; no session.
- **Fix:** Human signs in at `https://www.linkedin.com/login` with **email + password** (not Google). Backup: `python3 scripts/browser-auth.py save linkedin`. Restore: `python3 scripts/browser-auth.py restore linkedin`. Record in `browser-auth.md`.
- **Verify:** `linkedin.com/feed` loads; **Me** / avatar; saved file includes `li_at`.
- **Do not:** Sign in with Google; commit `pipeline/browser-auth/*.json`.

### Multi-step modal + saved resume

- **Problem:** Easy Apply is multi-step (contact → resume → screening → review). Resume step may default to saved profile PDF, not packet-tailored PDF.
- **Fix:** Click **Easy Apply** link; verify/select packet resume on resume step; fill screening from form-answers; numeric experience fields required when shown.
- **Verify:** Application submitted confirmation on job page when user requested submit.
- **Do not:** assume packet `resume.pdf` attached unless selected on resume step; skip numeric screening fields.

### SDUI loader hang (empty modal)

- **Problem:** Easy Apply modal opens (“Apply to …”, 0% progress) but **no form fields ever render** — `.artdeco-loader` stays visible 20s+; CDP finds zero `input`/`textarea` in the modal. May be posting-specific or transient SDUI failure (other Easy Apply postings can work the same day).
- **Fix:** None in-session. **Fallback:** contact email from posting/JD with packet PDFs, or human retry after browser cookie refresh / different LinkedIn session.
- **Verify:** Modal shows contact/resume/screening steps with inputs before reporting filled.
- **Do not:** click **Next** on empty 0% modal and report filled; assume Easy Apply works because another posting did earlier.

---

## Email / non-ATS

### Email-only apply path

- **Problem:** Careers page has no ATS form; apply via email address only.
- **Fix:** Write `pipeline/packets/<id>/apply-email.md` with To/Subject/Body + attach resume+cover PDFs; human sends.
- **Verify:** apply-email.md present; PDFs exist; tracker notes email-ready.
- **Do not:** invent a web ATS URL; agent-send email without explicit ask.
