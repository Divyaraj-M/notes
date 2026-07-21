import { Page, Locator, expect } from '@playwright/test';

/**
 * Generic import flow page object shared by Contacts, Companies and Deals.
 *
 * The import wizard is assumed to be:
 *   1. Open the entity list page
 *   2. Click "Import"
 *   3. Upload a CSV/XLSX file
 *   4. Map file columns -> app fields
 *   5. Submit and read the result summary (created / skipped / errors)
 *
 * ⚠️ SELECTORS ARE PLACEHOLDERS. Update the `sel` map below to match your DOM.
 * Everything else keys off these, so you only edit selectors in one place.
 */
export class ImportPage {
  readonly page: Page;
  readonly listPath: string;

  constructor(page: Page, listPath: string) {
    this.page = page;
    this.listPath = listPath;
  }

  // ---- Locators -----------------------------------------------------------
  get importButton(): Locator {
    return this.page.getByRole('button', { name: /import/i });
  }

  get fileInput(): Locator {
    // A hidden <input type="file"> works with setInputFiles even if not visible.
    return this.page.locator('input[type="file"]');
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: /next|continue/i });
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /^(import|finish|submit|start import)$/i });
  }

  get successSummary(): Locator {
    return this.page.getByTestId('import-success')
      .or(this.page.getByText(/import(ed| complete|ing done)/i));
  }

  get errorBanner(): Locator {
    return this.page.getByRole('alert')
      .or(this.page.getByTestId('import-error'));
  }

  /** A row-level error list rendered by the wizard for bad rows. */
  get rowErrors(): Locator {
    return this.page.getByTestId('row-error');
  }

  // ---- Actions ------------------------------------------------------------
  async goto() {
    await this.page.goto(this.listPath);
  }

  async openImportDialog() {
    await this.importButton.click();
  }

  async uploadFile(absolutePath: string) {
    await this.fileInput.setInputFiles(absolutePath);
  }

  /**
   * Map file columns to app fields.
   * @param mapping e.g. { "Email Address": "email", "First Name": "firstName" }
   *   key   = column header as shown in the wizard
   *   value = the app field option text to pick
   */
  async mapColumns(mapping: Record<string, string>) {
    for (const [column, field] of Object.entries(mapping)) {
      const row = this.page.getByTestId(`map-row-${column}`)
        .or(this.page.getByRole('row', { name: new RegExp(column, 'i') }));
      const select = row.getByRole('combobox');
      // Native <select>; swap for click+option if it's a custom dropdown.
      await select.selectOption({ label: field }).catch(async () => {
        await select.click();
        await this.page.getByRole('option', { name: field }).click();
      });
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  /** Full happy-path convenience wrapper. */
  async runImport(filePath: string, mapping?: Record<string, string>) {
    await this.openImportDialog();
    await this.uploadFile(filePath);
    if (mapping) {
      if (await this.nextButton.isVisible().catch(() => false)) {
        await this.nextButton.click();
      }
      await this.mapColumns(mapping);
    }
    await this.submit();
  }

  // ---- Assertions ---------------------------------------------------------
  async expectSuccess() {
    await expect(this.successSummary).toBeVisible();
  }

  async expectError(message?: string | RegExp) {
    await expect(this.errorBanner).toBeVisible();
    if (message) {
      await expect(this.errorBanner).toContainText(message);
    }
  }

  /** Reads the "N records created" number from the success summary. */
  async createdCount(): Promise<number> {
    const text = (await this.successSummary.innerText()) ?? '';
    const m = text.match(/(\d[\d,]*)\s+(?:record|contact|company|deal)s?\s+(?:created|imported|added)/i);
    return m ? Number(m[1].replace(/,/g, '')) : 0;
  }
}
