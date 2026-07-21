import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { ImportPage } from '../pages/ImportPage';
import type { EntityConfig } from './entities';

const abs = (p: string) => path.resolve(p);

/**
 * Shared, data-driven import test suite. Each entity spec calls this with its
 * config, producing an identical set of scenarios (happy path, validation
 * errors, large file / limits, column mapping).
 *
 * Test IDs (UAT-C-01 etc.) map 1:1 to docs/UAT-test-cases.md.
 */
export function importSuite(cfg: EntityConfig) {
  const prefix = { contacts: 'C', companies: 'Co', deals: 'D' }[cfg.name]; // see UAT doc

  test.describe(`${cfg.name} import`, () => {
    let importPage: ImportPage;

    test.beforeEach(async ({ page }) => {
      importPage = new ImportPage(page, cfg.listPath);
      await importPage.goto();
    });

    // ---------------------------------------------------------------- HAPPY
    test.describe('happy path', () => {
      test(`[${prefix}-01] imports a valid file successfully`, async () => {
        await importPage.runImport(abs(cfg.files.valid), cfg.validMapping);
        await importPage.expectSuccess();
        expect(await importPage.createdCount()).toBeGreaterThan(0);
      });
    });

    // ---------------------------------------------------------- VALIDATION
    test.describe('validation errors', () => {
      test(`[${prefix}-10] rejects a non-CSV / wrong file type`, async () => {
        await importPage.openImportDialog();
        await importPage.uploadFile(abs(cfg.files.wrongType));
        await importPage.expectError(/csv|xlsx|file type|unsupported|invalid/i);
      });

      test(`[${prefix}-11] flags unrecognised / missing column headers`, async () => {
        await importPage.openImportDialog();
        await importPage.uploadFile(abs(cfg.files.invalid));
        // Either the wizard blocks, or required fields cannot be mapped.
        await importPage.expectError(/column|header|map|required field/i);
      });

      test(`[${prefix}-12] reports rows with a missing required field`, async () => {
        await importPage.runImport(abs(cfg.files.missingRequired), cfg.validMapping);
        // App should show row-level errors and NOT silently import bad rows.
        await expect(
          importPage.rowErrors.first().or(importPage.errorBanner),
        ).toBeVisible();
      });

      test(`[${prefix}-13] handles duplicate records per de-dupe rules`, async () => {
        await importPage.runImport(abs(cfg.files.duplicate), cfg.validMapping);
        // Expect a skipped/merged notice — adjust to your product's behaviour.
        await expect(
          importPage.page.getByText(/duplicate|skipped|merged|already exists/i),
        ).toBeVisible();
      });
    });

    // ------------------------------------------------------ LARGE / LIMITS
    test.describe('large file & limits', () => {
      // Longer budget — big uploads take time.
      test.slow();

      test(`[${prefix}-20] handles a large file (limit / partial import)`, async () => {
        const large = abs(cfg.files.large);
        test.skip(
          !fs.existsSync(large),
          'Large fixture missing — run `npm run gen:data` first.',
        );

        await importPage.runImport(large, cfg.validMapping);
        // Accept EITHER a clean success OR a graceful "limit exceeded" message,
        // but never a crash / hang.
        await expect(
          importPage.successSummary.or(
            importPage.page.getByText(/limit|maximum|too many rows|too large/i),
          ),
        ).toBeVisible();
      });
    });

    // ---------------------------------------------------- COLUMN MAPPING
    test.describe('column mapping', () => {
      test(`[${prefix}-30] shows every uploaded column in the mapping step`, async () => {
        await importPage.openImportDialog();
        await importPage.uploadFile(abs(cfg.files.valid));
        if (await importPage.nextButton.isVisible().catch(() => false)) {
          await importPage.nextButton.click();
        }
        for (const column of Object.keys(cfg.validMapping)) {
          await expect(
            importPage.page.getByText(column, { exact: false }).first(),
          ).toBeVisible();
        }
      });

      test(`[${prefix}-31] blocks submit until required fields are mapped`, async () => {
        await importPage.openImportDialog();
        await importPage.uploadFile(abs(cfg.files.valid));
        if (await importPage.nextButton.isVisible().catch(() => false)) {
          await importPage.nextButton.click();
        }
        // With nothing mapped, submit should be disabled or produce an error.
        const submit = importPage.submitButton;
        if (await submit.isEnabled().catch(() => true)) {
          await submit.click();
          await importPage.expectError(/map|required/i);
        } else {
          await expect(submit).toBeDisabled();
        }
      });
    });
  });
}
