import { test, expect } from '@playwright/test';
import { test_user } from '../Data/user.js';
import { loginUser } from '../Data/authHelpers.js';
import { populateAddTaskForm } from "../Data/todoTaskForm.js";

test('Taskflow1 - login, add habit, add todo, add goal, check on dashboard, complete todo and verify', async ({ page }) => {
    await loginUser(page, test_user);
    await page.waitForURL('/dashboard');
    await page.waitForTimeout(300);

    const uniqueId = Date.now();

    // add habit
    await page.click('a[href="/habits"]');
    await page.waitForURL("/habits");
    await page.waitForTimeout(300);

    await page.click("button.mantine-focus-auto:nth-child(2)");
    await page.fill('input[name=name]', "Habit" + uniqueId);
    await page.fill('textarea[name=description]', "Habit description" + uniqueId);
    await page.click("button.MuiButtonBase-root:nth-child(2)");
    await page.waitForURL("/habits");
    await page.waitForTimeout(500);

    const habitCardContainer = page.locator(".m_2415a157");
    await expect(habitCardContainer.locator(`h4:text("Habit${uniqueId}")`)).toBeVisible();

    // add todo
    await populateAddTaskForm(page, "Test Task" + uniqueId, "Test Task category" + uniqueId, "Description for Test Task" + uniqueId);
    await page.click("button.MuiButtonBase-root:nth-child(2)");
    await page.waitForURL("/todos");
    await page.waitForTimeout(500);

    const taskCardContainer = page.locator(".m_2415a157");
    await expect(taskCardContainer.locator(`h4:text("Test Task${uniqueId}")`)).toBeVisible();

    // add goal
    await page.click('a[href="/goals"]');
    await page.waitForURL("/goals");
    await page.waitForTimeout(300);

    await page.click('section.flex > button:nth-child(3)');
    await page.fill('input[name=name]', "Goal" + uniqueId);
    await page.fill('textarea[name=description]', "Goal description" + uniqueId);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const formatted = futureDate.toISOString().split('T')[0];

    await page.fill("input[name=end_date]", formatted);
    await page.fill("input[name=location]", "Skopje");
    await page.click("button.MuiButtonBase-root:nth-child(2)");
    await page.waitForTimeout(500);

    const goalCardContainer = page.locator(".m_2415a157");
    await expect(goalCardContainer.locator(`h4:text("Goal${uniqueId}")`)).toBeVisible();

    // dashboard
    await page.click('a[href="/dashboard"]');
    await page.waitForURL("/dashboard");
    await page.waitForTimeout(500);

    const todosContainer = page.locator("div.p-4:nth-child(1)");
    const habitsContainer = page.locator(".border-green-500");
    const goalsContainer = page.locator(".border-indigo-600");

    await expect(todosContainer.locator(`ul:nth-child(2) > div:last-child:has(section h5:text("Test Task${uniqueId}"))`)).toBeVisible();
    await expect(habitsContainer.locator(`div:last-child:has(section h5:text("Habit${uniqueId}"))`)).toBeVisible();
    await expect(goalsContainer.locator(`div:last-child:has(section h5:text("Goal${uniqueId}"))`)).toBeVisible();

    // mark todo as completed
    const lastTodoCard = todosContainer.locator('div.mantine-Card-root').last();
    const completedSwitch = lastTodoCard.locator('section:nth-child(1) > div:nth-child(2) > div:nth-child(1) > label:nth-child(1) > span:nth-child(2)');
    await completedSwitch.click();
    await page.waitForTimeout(500);

    // check updated status on /todos
    await page.click('a[href="/todos"]');
    await page.waitForURL("/todos");
    await page.waitForTimeout(500);

    const todosPageTaskContainer = page.locator(".m_2415a157");
    const completedTaskCard = todosPageTaskContainer.locator('div.bg-white').last();

    await expect(
        completedTaskCard.locator('section:nth-child(1) > div:nth-child(2) > div:nth-child(2) > span:nth-child(2):has-text("Completed")')
    ).toBeVisible();
});
