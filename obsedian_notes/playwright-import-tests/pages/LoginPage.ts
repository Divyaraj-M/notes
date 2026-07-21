import { Page, Locator } from '@playwright/test';

/**
 * Login page object.
 *
 * ⚠️ SELECTORS ARE PLACEHOLDERS. Replace them with your app's real selectors.
 * Prefer role/label/test-id locators over CSS where possible.
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loggedInMarker: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /log ?in|sign ?in/i });
    // Something only visible after a successful login:
    this.loggedInMarker = page.getByTestId('app-shell')
      .or(page.getByRole('navigation'));
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
