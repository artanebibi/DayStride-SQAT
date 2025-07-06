// playwright.config.js


/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
  testDir: './tests/ui-e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000, // 5 sec for expect()
  },
  fullyParallel: true,
  retries: 0,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:80',
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  }
};

