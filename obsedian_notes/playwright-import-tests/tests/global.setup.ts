import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import fs from 'node:fs';

const AUTH_FILE = '.auth/user.json';

/**
 * Runs once before the test projects. Logs in with the test account and
 * saves the authenticated storage state so specs don't log in repeatedly.
 *
 * If you don't have credentials yet, tests will still be *discovered*
 * (`--list`) — this only runs when you actually execute them.
 */
setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_USER_EMAIL / TEST_USER_PASSWORD are not set. Copy .env.example to .env and fill them in.',
    );
  }

  const login = new LoginPage(page);
  await login.goto();
  await login.login(email, password);

  // Adjust to whatever proves you are logged in (avatar, nav item, etc.)
  await expect(login.loggedInMarker).toBeVisible({ timeout: 30_000 });

  fs.mkdirSync('.auth', { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
