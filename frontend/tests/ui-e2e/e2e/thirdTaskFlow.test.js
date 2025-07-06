import { test, expect } from '@playwright/test';
import { test_user } from '../Data/user.js';
import { loginUser } from '../Data/authHelpers.js';

test('Taskflow3 - Public goal shared/joined/left between users', async ({ page }) => {
  const uniqueId = Date.now();
  const goalTitle = `Public Goal${uniqueId}`;

  await test.step('Login as user:user and create public goal', async () => {
    await loginUser(page, { username: 'user', password: 'user' });
    await page.waitForURL('/dashboard');

    await page.click('a[href="/goals"]');
    await page.waitForURL('/goals');
    await page.click('section.flex > button:nth-child(3)');

    await page.fill('input[name=name]', goalTitle);
    await page.fill('textarea[name=description]', `Public Goal description${uniqueId}`);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const formatted = futureDate.toISOString().split('T')[0];

    await page.fill('input[name=end_date]', formatted);
    await page.fill('input[name=location]', 'Skopje');
    await page.click('input[name=is_public]');

    await page.click('button.MuiButtonBase-root:nth-child(2)');

    const goalCardContainer = page.locator('.m_2415a157');
    await expect(goalCardContainer.locator(`h4:text("${goalTitle}")`)).toBeVisible();
  });

  await test.step('Logout and login as test_user', async () => {
    await page.click('button.mantine-focus-auto'); // logout button
    await loginUser(page, test_user);
    await page.waitForURL('/dashboard');
  });

  await test.step('Search for public goal in GoalHub and join it', async () => {
    await page.click('a[href="/goalhub"]');
    await page.waitForURL('/goalhub');

    await page.getByPlaceholder('Search goals by name...').fill(`Goal${uniqueId}`);
    await page.waitForSelector(`h4:text("${goalTitle}")`, { state: 'visible', timeout: 5000 });

    const goalCard = page.locator('.m_2415a157').filter({
      has: page.locator(`h4:text("${goalTitle}")`)
    });
    await goalCard.locator('button:has-text("Join")').click();
  });

  await test.step('Verify goal appears in user goals and then leave it', async () => {
    await page.click('a[href="/goals"]');
    await page.waitForURL('/goals');

    const lastGoalCard = page.locator('.m_2415a157 > div').last();
    await expect(lastGoalCard).toBeVisible();
    await expect(lastGoalCard.getByText('Shared')).toBeVisible();

    await lastGoalCard.locator('button:has-text("Leave")').click();
    await expect(page.locator(`h4:text("${goalTitle}")`)).toHaveCount(0);
  });
});
