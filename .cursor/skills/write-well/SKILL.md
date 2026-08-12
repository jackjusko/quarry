---
name: write-well
description: Enforces clear, concrete, matter-of-fact prose and strictly avoids AI writing patterns. Bans "reads like"-style phrasing and flowery language. Use when the user invokes write-well, asks for polished writing, docs, READMEs, emails, blog posts, explanations, or PR bodies free of AI slop, or wants Orwell-style clarity and Wikipedia Signs of AI writing avoided.
disable-model-invocation: true
---

# Write Well

## Before you write

For any **substantial prose** (docs, READMEs, emails, blog posts, explanations, PR bodies, long chat replies):

1. **Read** [politics-and-the-english-language.md](politics-and-the-english-language.md) in full.
2. **Read** [signs-of-ai-writing.md](signs-of-ai-writing.md) in full.
3. Do not rely on memory or a summary of either file.

Skip this skill’s style rules for micro-outputs only: one-line commit subjects, code identifiers, CLI flags, and similar non-prose tokens.

## Positive rules (Orwell)

Apply the guidance in `politics-and-the-english-language.md`, especially:

1. Never use a metaphor, simile, or other figure of speech you are used to seeing in print.
2. Never use a long word where a short one will do.
3. If it is possible to cut a word out, always cut it out.
4. Never use the passive where you can use the active.
5. Never use a foreign phrase, a scientific word, or a jargon word if you can think of an everyday English equivalent.
6. Break any of these rules sooner than say anything outright barbarous.

Prefer concrete nouns, short sentences, and meaning that chooses the word—not the reverse.

**Orwell rule 3 nuance:** “If it is possible to cut a word out, always cut it out” applies to **filler and ornament**, not to facts, steps, tradeoffs, or outcomes the reader needs. Shorter is not automatically clearer.

## Brevity vs. adequate length

Research note (2026-08-12): write-well’s Orwell defaults were over-applied to application essays—answers became telegraphic and underdeveloped while cover letters (with an explicit ~220–320 word target) stayed strong.

**What brevity means here:** cut empty words, flowery phrasing, AI theater, and redundancy.

**What brevity does not mean:** compress a four-paragraph essay into one dense block; drop context to “play it safe”; or write resume-bullet telegrams in free-text fields.

| Context | Length target |
| --- | --- |
| Cover letter | ~220–320 words — medium, full sentences (see cover-letter skill) |
| Application essays with a paragraph cap | **Use the space.** Up to the stated cap (e.g. ≤4 paragraphs): situation → what you noticed → what you did (specifics) → outcome |
| Form short answers (salary, auth, yes/no) | One line or one sentence |
| Resume bullets | Tight; tailor-resume skill |

**Too short (avoid):** one paragraph when the form allows four; skipping tradeoffs, timeline, or implementation detail that proves you did the work; choppy fragments that read informal or lazy.

**Too long (avoid):** hollow contrast, rule-of-three padding, mirroring the employer’s JD back at them to fill space.

When a prompt gives a paragraph budget, **meet it with substance**, not filler. Cover-letter density (full sentences, natural flow) is the model for essays—not clipped telegram style.

## Negative rules (AI patterns)

Treat every pattern in `signs-of-ai-writing.md` as **forbidden** in your output.

Translate Wikipedia-specific notes into general prose rules. Ignore encyclopedia process (diffs, templates, speedy deletion, wikitext markup quirks) that does not apply to agent writing.

In particular, do not:

- Puff significance (“pivotal,” “underscores,” “broader landscape,” present-participle importance tails)
- Use AI vocabulary (delve, tapestry, testament, vibrant, nestled, etc. as catalogued in the source)
- Pad with rule-of-three, negative parallelisms, or section-ending “In summary” / “Overall”
- Use promotional or travel-brochure adjectives
- Leave chatbot residue (“I hope this helps,” “Certainly!”)
- Overuse bold, emoji, em dashes, or bullet stacks where paragraphs would do
- Use **hollow contrast** or **values-upsell theater** (see below)—especially common in cover letters and “why us” paragraphs
- Use **research-dump hooks** or **press-release openers** (see below)—common when the draft starts from company news + JD stack
- Use **application-essay theater** (see below)—common in short “tell us about a time” answers
## Hollow contrast and values upsell (hard ban)

Research note (2026-08-11): flagged in a real cover-letter draft. Same family as Wikipedia “negative parallelisms” and Erigo’s “hollow negation” ([Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing); [Erigo on hollow negation](https://erigo.se/en/articles/is-your-colleague-writing-or-is-it-chatgpt-and-does-it-matter)).

The model fakes depth by (1) declaring the experience special, (2) aligning to employer “values,” then (3) contrasting a shallow reading the reader never made against a deeper one.

**Banned shapes (including close variants):**

| Shape | Examples to refuse |
| --- | --- |
| Hollow negation / Not X, but Y | “not only as policy language… but in practice”; “not just words on a careers page”; “It’s not about X, it’s about Y” |
| Self-puffed rarity | “uncommon in tech hiring”; “uniquely positioned”; “sets me apart”; “rare combination” |
| Values-alignment template | “fits an employer that takes X seriously”; “aligns with your commitment to…”; “resonates with your culture of…” |
| Practice-vs-policy sermon | “real people, not only as policy”; “beyond the mission statement”; “more than a checkbox” |
| Stagey transitions into the sermon | “Separately,” / “Beyond the technical work,” leading into the values paragraph |

**Do instead:** name the concrete experience in plain sentences. One short clause can tie it to something the employer actually wrote (ERGs, equal opportunity, named program). Stop. Do not narrate how rare or deep it is—the facts do that work.

| Bad | Better |
| --- | --- |
| “That background is uncommon in tech hiring, and it fits an employer that takes inclusivity seriously. I already know what those standards look like in practice with real people, not only as policy language on a careers page.” | “I worked for years at a youth program and completed required safeguarding training for that role. The posting stresses inclusivity and equal opportunity; that experience matters for this application.” |

If the user asks for “uniquely positioned” language, translate the **intent** into concrete facts. Do not ship the slogan.

## Research-dump hooks and press-release openers (hard ban)

Research note (2026-08-11): flagged twice on a cover-letter hook built from company press + JD stack. Same family as Wikipedia “promotional / press-release tone,” rule-of-three catalogs, and even sentence rhythm ([Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing); [TechBullion on beige AI prose](https://techbullion.com/why-ai-writing-sounds-robotic-and-how-to-fix-it-with-real-editing/); [TextSight on cover-letter openers](https://www.textsight.ai/blog/recruiters-ai-detectors-cover-letters-2026/)).

Models turn research into a polished briefing, then “humanize” it into stiff JD restatement + an orphan metric. Recruiters still hear ChatGPT.

**Banned shapes (including close variants):**

| Shape | Examples to refuse |
| --- | --- |
| Corporate metaphor lead | “X is Y’s growth engine,” “crown jewel,” “north star,” “secret sauce,” “force multiplier” |
| Press-release narration | “the brand posted,” “delivered strong results,” “continues to accelerate,” “at a pivotal moment” |
| Orphan / decorative metric | A Q2 % or headcount with no personal stake—looks glued on to prove you “researched” |
| Metric stack as theater | Two+ percentages in one breath; earnings summary as the opener |
| Balanced while-clause | “…growth, while the web team ships A, B, and C on X, Y, and Z” |
| JD restatement as jargon | “The X role is on the Vue.js web app for A and B, with MySQL and AWS underneath” |
| Company Wikipedia opener | Opening by defining their product/team back at them (“X is the job board for… and this role is on the web team that builds…”) with no applicant stake |
| Catalog / rule-of-three dump | Feature list + stack list in one breath to sound thorough |
| Empty closer | “I want that kind of product work”; “That is the product shape and stack I already know how to ship”; “That is exactly the kind of work I do” |

**Do instead:** open with **you**—why you want the role and what you have actually shipped. They already know what their product is. One short clause of product context is fine; a definition paragraph is not. Prove fit in the next paragraph with concrete work.

| Bad | Better |
| --- | --- |
| “Company X is Y’s growth engine… the brand posted 24% bookings… while the web team ships… That is the product shape and stack I already know how to ship.” | “I am interested in the web role. I have been shipping Vue and Node apps with MySQL and AWS for a few years—marketplace and SaaS work end to end—and I want to keep doing that for a product people use every day.” |
| “The Software Engineer role is on the Vue.js web app… the company also just reported a strong Q2—bookings up 24%. I want that kind of product work.” | Same better column—skip the earnings line; do not narrate the posting back at them. |
| “Company X is the job board for a niche audience, and this role is on the web team that builds the recruiter side of it—search, matching, messaging, the daily tools hiring managers use.” | Same better column—do not open with a company blurb. |
**Speak-aloud test (required for cover hooks):** read the first paragraph out loud. If you would not say it to a hiring manager in the first thirty seconds, rewrite. If a sentence only exists to show you found a press release, cut it.

## Application essay theater (hard ban)

Research note (2026-08-12): flagged on an ATS “one-of-three” product essay. Same family as Wikipedia “Not X, but Y,” “X rather than Y,” and Erigo hollow negation—but models reach for these **more** in 150–500 word application answers because the prompt asks for initiative, empathy, and stakes.

The model writes a **mini hero arc**: vague pain → contrast with what a PM would do → countdown deadline → virtue tagline. It reads like a behavioral-interview template, not a person recounting one week at work.

**Banned shapes (including close variants):**

| Shape | Examples to refuse |
| --- | --- |
| Not-X-but-Y initiative | “not because a PM asked, but because I sat in user calls”; “not from a ticket, but from customer empathy” |
| Abstract pain | “saw the pain,” “felt their frustration,” “understood their struggle” — with no concrete symptom |
| Performative push | “I pushed to rebuild,” “I drove alignment,” “I championed” — without the first actual action (spec, bug, call quote) |
| Countdown stakes | “before our accelerator demo,” “with 48 hours until launch” — unless the deadline changed what you shipped |
| X rather than Y closer | “I advocated with user evidence rather than title”; “led with data, not authority” |
| Mirror-the-employer tail | “That mirrors [Company]’s product-engineer model…” — restates their JD back at them |
| Engineer jargon / postmortem voice | “The failure mode was double-booking.”; “full loop”; “UTC key underneath”; “regression check”; “normalized every slot to UTC” — labels you would not say aloud to a colleague |

**Do instead:** open on the **bug or user symptom** (two people booked the same hour, wrong slot, rebooking by hand). Use the full paragraph budget: context → how you noticed → what you did (spec, tradeoffs, ship) → observable outcome. End on facts—not a moral or “X rather than Y” tagline. If you would not say the sentence to a non-engineer teammate, rewrite it as the symptom and the action (keep the real time in one place; show each person their local clock).

| Bad | Better |
| --- | --- |
| “I pushed to rebuild scheduling rules before our accelerator demo, not because a PM asked, but because I sat in user calls and saw the pain.” | “At Example Org we had no PM. Coaches in different US time zones kept double-booking because our matcher treated 9am Eastern and 9am Pacific as the same slot. I heard them rebooking by hand on support calls while we had an investor demo coming up.” |
| One compressed paragraph (~80 words) when the form allows four | Four short paragraphs: team/context; symptom + how you found it; spec + tradeoffs + ship; outcome |
| “The demo landed because operators stopped workarounds. I advocated with user evidence rather than title.” | “I wrote a one-page spec, walked the founder through two options, updated the tables and matching query, and shipped in two days. Coaches stopped rebooking by hand before the demo.” |
| “The failure mode was double-booking.” / “owning the full loop on payments” | “A client in New York and a coach in California could both pick what looked like a 9am slot, and we stored those as the same time.” / “The work I am proudest of is getting coaches paid.” |

**Speak-aloud test (required for application essays):** read the answer as if a teammate asked “what happened that week?” If you would not use “saw the pain,” “not because X but because Y,” “failure mode,” or “full loop” out loud, cut them. Conversational tone means concrete symptoms a hiring manager can picture—not engineer shorthand. If the answer feels like a Slack one-liner but the form allows four paragraphs, expand with concrete detail—not filler.

## Matter-of-fact prose

Professional writing states facts and moves on. Two hard rules:

1. **Never say how writing “reads.”** Banned: “reads like,” “reads as,” “read like,” “comes across as,” “sounds like,” “feels like,” and any phrase that describes a text, resume, cover letter, or product in terms of how it appears. State what it is or what it does. Say “this lists X” or “this covers Y,” never “this reads like Z.”
2. **No flowery or ornamental language.** Banned in all professional output: metaphors that dress up a fact (“home turf,” “wins that moment,” “muscle”), aphorisms (“the mission is the part I cannot fake”), scene-setting, and rhetorical flourish. If a phrase would look odd in a work email, cut it.

Test every sentence: does it name a fact, an action, or a date? If not, rewrite it in plain terms.

## Edit loop

1. Draft.
2. Check the draft against both companion files.
3. Check against the Matter-of-fact prose rules above.
4. Rewrite until it complies.
5. Ship plain, specific, human cadence—not balanced hedging, grandeur, or filler. For essays with a paragraph budget, also check you used **adequate length** (see Brevity vs. adequate length)—not telegram compression.
