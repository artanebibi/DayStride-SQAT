import {test, expect} from '@playwright/test';
import {test_user} from '../Data/user.js';
import {loginUser} from '../Data/authHelpers.js';
import {populateAddTaskForm} from "../Data/todoTaskForm.js";

test('Taskflow1 - login, add habit, add todo, add goal, navigate to dashboard and check if they appear, mark the last todo as completed and check in the todos page if the changes were successfully updated.', async ({page}) => {
    await loginUser(page, test_user);
    await page.waitForURL('/dashboard');

    const uniqueId = Date.now();

    // add habit
    const habitButton = 'a[href="/habits"]';
    await page.click(habitButton);
    await page.waitForURL("/habits");

    const addHabitButton = "button.mantine-focus-auto:nth-child(2)";
    await page.click(addHabitButton);

    const habitName = 'input[name=name]';
    const habitDescription = 'textarea[name=description]';

    await page.fill(habitName, "Habit" + uniqueId);
    await page.fill(habitDescription, "Habit description" + uniqueId);

    const submitHabitButton = "button.MuiButtonBase-root:nth-child(2)";
    await page.click(submitHabitButton);
    await page.waitForURL("/habits");

    const habitCardContainer = await page.locator(".m_2415a157");
    await expect(habitCardContainer.locator(`h4:text("Habit${uniqueId}")`)).toBeVisible();

    // add todo task
    await populateAddTaskForm(page, "Test Task" + uniqueId, "Test Task category" + uniqueId, "Description for Test Task" + uniqueId);

    const submitButton = "button.MuiButtonBase-root:nth-child(2)";
    await page.click(submitButton);
    await page.waitForURL("/todos");

    const taskCardContainer = await page.locator(".m_2415a157");
    await expect(taskCardContainer.locator(`h4:text("Test Task${uniqueId}")`)).toBeVisible();

    // add goal
    await page.click('a[href="/goals"]');
    await page.waitForURL("/goals");

    const addGoalButton = 'section.flex > button:nth-child(3)';
    await page.click(addGoalButton);

    const goalName = 'input[name=name]';
    const goalDescription = 'textarea[name=description]';
    const endDateField = "input[name=end_date]";
    const locationField = "input[name=location]";
    const is_public = "input[name=is_public]";

    await page.fill(goalName, "Goal" + uniqueId);
    await page.fill(goalDescription, "Goal description" + uniqueId);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const formatted = futureDate.toISOString().split('T')[0];

    await page.fill(endDateField, formatted);
    await page.fill(locationField, "Skopje");

    const submitGoalButton = "button.MuiButtonBase-root:nth-child(2)";
    await page.click(submitGoalButton);

    const goalCardContainer = await page.locator(".m_2415a157");
    await expect(goalCardContainer.locator(`h4:text("Goal${uniqueId}")`)).toBeVisible();

    // navigate to dashboard
    await page.click('a[href="/dashboard"]');
    await page.waitForURL("/dashboard");

    const todosContainer = await page.locator("div.p-4:nth-child(1)");
    const habitsContainer = await page.locator(".border-green-500");
    const goalsContainer = await page.locator(".border-indigo-600");

    // check if todo, habit, goal are visible on dashboard
    await expect(
        todosContainer.locator(`ul:nth-child(2) > div:last-child:has(section h5:text("Test Task${uniqueId}")):visible`)
    ).toBeVisible();

    await expect(
        habitsContainer.locator(`div:last-child:has(section h5:text("Habit${uniqueId}")):visible`)
    ).toBeVisible();

    await expect(
        goalsContainer.locator(`div:last-child:has(section h5:text("Goal${uniqueId}")):visible`)
    ).toBeVisible();

    // click the todo's completed switch
    const lastTodoCard = todosContainer.locator('div.mantine-Card-root').last();
    const completedSwitch = lastTodoCard.locator('section:nth-child(1) > div:nth-child(2) > div:nth-child(1) > label:nth-child(1) > span:nth-child(2)');
    await completedSwitch.click();

    // navigate to todos page
    await page.click('a[href="/todos"]');
    await page.waitForURL("/todos");

    const todosPageTaskContainer = await page.locator(".m_2415a157");

    const completedTaskCard = todosPageTaskContainer.locator('div.bg-white').last();
    await expect(
        completedTaskCard.locator('section:nth-child(1) > div:nth-child(2) > div:nth-child(2) > span:nth-child(2):has-text("Completed")')
    ).toBeVisible();
});
