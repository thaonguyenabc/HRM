# HRM-API Automation

Framework API automation cho HRM theo pattern data-driven (Cucumber + TypeScript + Axios + AJV).
Cach viet test: chi sua file `.feature` + JSON, khong dung vao code engine.

## Setup

```bash
npm install
cp .env.example .env      # roi dien HRM_TOKEN / token tai khoan
```

## Chay

```bash
npm test                  # chay tat ca
npm run test:weekly       # chi tag @weeklyReport
```

## Cau truc

- `src/features/`  → noi VIET test (Gherkin)
- `src/steps/`     → glue code (authSteps, apiSteps)
- `src/api/endpoints/apiEndpoints.ts` → bang ten ngan → path
- `src/api/header|queryParams|restApi/` → builder + executor (axios)
- `src/api/response/validator.ts` + `schemas/*.json` → validate response bang AJV
- `src/common/utils/` → engine {{...}} + parse kieu
- `src/support/world.ts` → state 1 scenario + resolveValue()
- `src/support/config.ts` → doc .env

## 3 thu PHAI sua cho khop API HRM that (dang la gia dinh)

1. `apiEndpoints.ts` — path that cua weekly report
2. `authSteps.ts` — co che auth that (header name, cach lay token)
3. `getWeeklyReport.feature` + `schemas/weeklyReportList.json` — query param & shape response that

## Cu phap {{...}} dung duoc o moi builder

- `{{tenBien}}`   — bien da luu trong dynamicValues
- `{{$uuid}}`     — sinh uuid
- `{{$now}}` / `{{$today}}` / `{{$today+7d}}` — ngay gio dong
