# Tailor resume — example (hybrid weave)

## Pool snippet (abbreviated — fictional)

```
Example Org | Remote | Senior Analyst | 2022 – Present
● Led quarterly reporting pipeline for regional operations…
● Built dashboards in the org’s primary BI stack…

Prior Employer Co. | Analyst | 2019 – 2022
● Automated data intake from vendor APIs…
```

## User request

- Job: Operations analyst, reporting + automation
- Posting tech inventory: Excel, SQL, Python, Tableau, REST APIs, ETL, Agile
- Emphasize: reporting ownership, cross-team delivery

## Role selection

- **Core:** Example Org, Prior Employer Co. (per tailor-policy)
- **Optional:** none
- **Order:** chronological (Example Org → Prior Employer Co.)

## Placement (hybrid)

| Posting tech | Where | Notes |
| --- | --- | --- |
| Excel, SQL, reporting, REST | Example Org bullets | Pool-backed |
| Python (light automation) | Example Org bullet (woven, softer) | ≤2 woven on current role |
| Tableau | skills.primary | Adjacent; pool mentions BI stack |
| ETL, Agile | skills | Overflow ATS |

## Resulting Example Org bullets (JSON excerpt)

```json
{
  "company": "Example Org",
  "location": "Remote",
  "title": "Senior Analyst",
  "dates": "2022 – Present",
  "bullets": [
    "Owned quarterly reporting for three regions; delivered executive summaries under fixed deadlines.",
    "Maintained SQL-based datasets and Excel models used by finance and operations leads.",
    "Automated recurring vendor exports with Python scripts, reducing manual prep each cycle."
  ]
}
```

```json
"skills": {
  "primary": ["SQL", "Excel", "Python", "Tableau", "REST APIs", "Reporting"],
  "additional": ["ETL (familiar)", "Agile"]
}
```

## Handoff snippet

- **Bullets:** pool-backed + one woven Python line on Example Org (softer automation language)
- **Skills-only / overflow:** Tableau emphasis, ETL, Agile
- Then: `npm run validate && npm run render` → PDF per tailor-policy page length
