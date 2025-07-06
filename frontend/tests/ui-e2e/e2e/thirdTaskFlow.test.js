import {test, expect} from '@playwright/test';
import {test_user} from '../Data/user.js';
import {loginUser} from '../Data/authHelpers.js';
import {populateAddTaskForm} from "../Data/todoTaskForm.js";

test('Taskflow3 - login to user {username: user, password: user} add goal (public), logout, login to test_user, navigate to goalhub, search for the newly added goal, join goal, goal should appear in your list of goals   .', async ({page}) => {
    // login user user
    await loginUser(page, {username: "user", password: "user"});
    await page.waitForURL('/dashboard');

    const uniqueId = Date.now();

    await page.click('a[href="/goals"]');
    await page.waitForURL("/goals");

    // add goal
    const addGoalButton = 'section.flex > button:nth-child(3)';
    await page.click(addGoalButton);

    const goalName = 'input[name=name]';
    const goalDescription = 'textarea[name=description]';
    const endDateField = "input[name=end_date]";
    const locationField = "input[name=location]";
    const is_public = "input[name=is_public]";

    await page.fill(goalName, "Public Goal" + uniqueId);
    await page.fill(goalDescription, "Public Goal description" + uniqueId);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const formatted = futureDate.toISOString().split('T')[0];

    await page.fill(endDateField, formatted);
    await page.fill(locationField, "Skopje");
    await page.click(is_public)

    const submitGoalButton = "button.MuiButtonBase-root:nth-child(2)";
    await page.click(submitGoalButton);

    // check if it was added
    const goalCardContainer = await page.locator(".m_2415a157");
    await expect(goalCardContainer.locator(`h4:text("Public Goal${uniqueId}")`)).toBeVisible();

    await page.click("button.mantine-focus-auto")
    await loginUser(page, test_user)

    await page.waitForURL("/dashboard")
    await page.click('a[href="/goalhub"]')
    await page.waitForURL("/goalhub")

    await page.getByPlaceholder('Search goals by name...').fill("Goal" + uniqueId);

    await page.waitForSelector(`h4:text("Public Goal${uniqueId}")`, {state: 'visible', timeout: 5000});
    const goalCard = page.locator(".m_2415a157").filter({
        has: page.locator(`h4:text("Public Goal${uniqueId}")`)
    });

    await goalCard.locator('button:has-text("Join")').click();

    await page.click('a[href="/goals"]')
    await page.waitForURL("/goals")

    const publicGoal = page.locator(".m_2415a157").filter({
        has: page.locator(`h4:text("Public Goal${uniqueId}")`)
    });

    const lastGoalCard = page.locator('.m_2415a157 > div').last();

    await expect(lastGoalCard).toBeVisible();
    await expect(lastGoalCard.getByText('Shared')).toBeVisible();

    await lastGoalCard.locator('button:has-text("Leave")').click();
    await expect(page.locator(`h4:text("Public Goal${uniqueId}")`)).toHaveCount(0);

});
