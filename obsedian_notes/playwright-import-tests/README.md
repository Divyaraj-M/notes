# Import E2E + UAT Tests

Playwright test suite for the **Contacts, Companies and Deals** import feature.
Covers the four requested areas: happy path, validation errors, large file /
limits, and column mapping.

## Quick start

```bash
cd playwright-import-tests
npm install
npx playwright install chromium      # one-time browser download

cp .env.example .env                 # then fill in BASE_URL + test creds
npm run gen:data                     # create large-file fixtures (git-ignored)

npm test                             # run everything
npm run test:contacts                # or a single entity
npm run test:ui                      # interactive UI mode
npm run report                       # open the HTML report
```

## What you must customise

The scaffold is complete and compiles, but selectors are **placeholders** —
no one but you can see your real DOM. Update these three spots:

1. **`pages/LoginPage.ts`** — how login works + a "logged-in" marker.
2. **`pages/ImportPage.ts`** — the `Locator` getters for the import button,
   file input, mapping rows, submit button, and the success/error elements.
   Everything else is built on these, so this is the main edit.
3. **`utils/entities.ts`** — list-page paths, the valid column→field mapping,
   and fixture file names per entity.

Tip: run `npm run codegen` against your app to capture real selectors fast.

## Layout

```
playwright.config.ts      base URL, reporters, auth reuse
tests/
  global.setup.ts         logs in once, saves .auth/user.json
  contacts.import.spec.ts  } thin specs — each calls importSuite()
  companies.import.spec.ts }
  deals.import.spec.ts     }
pages/
  LoginPage.ts            login POM
  ImportPage.ts           generic import-wizard POM (edit selectors here)
utils/
  entities.ts             per-entity config (paths, mappings, files)
  importSuite.ts          the shared, data-driven test scenarios
  generate-large-files.mjs  builds large CSVs on demand
test-data/                sample CSVs (valid + every error variant)
docs/
  UAT-test-cases.md       manual UAT checklist; IDs match the automated tests
```

## Test IDs

Automated test titles carry IDs like `[C-12]`, `[Co-20]`, `[D-31]` that map
1:1 to `docs/UAT-test-cases.md` (C=Contacts, Co=Companies, D=Deals). Failing
test → find the row → know exactly which UAT case broke.
