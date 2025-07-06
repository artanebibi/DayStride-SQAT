import {test, expect} from '@playwright/test';
import {test_user} from '../Data/user.js';
import {loginUser, registerUser} from '../Data/authHelpers.js'
import {populateAddTaskForm} from '../Data/todoTaskForm.js'

test('Dropdown menu cancel button navigates back to /todos', async ({page}) => {
    loginUser(page, test_user)

    const todoButton = 'a[href="/todos"]'
    await page.click(todoButton)
    await page.waitForURL("/todos")

    const addTaskButton = "button.mantine-focus-auto:nth-child(5)"
    await page.click(addTaskButton)
    // await new Promise(resolve => setTimeout(resolve, 2000));

    const cancelButton = "button.MuiButtonBase-root:nth-child(1)"
    await page.click(cancelButton)
    await page.waitForURL("/todos")
})


test('Dropdown priority options are visible, clickable and alphabetically ordered', async ({page}) => {
    await page.goto('/');

    loginUser(page, test_user)

    const todoButton = 'a[href="/todos"]'
    await page.click(todoButton)
    await page.waitForURL("/todos")

    const addTaskButton = "button.mantine-focus-auto:nth-child(5)"
    await page.click(addTaskButton)

    const combobox = '[role="combobox"]';
    await page.click(combobox);

    const priorityOptions = await page.locator('li[role="option"][data-value]');
    const count = await priorityOptions.count();

    const texts = [];
    for (let i = 0; i < count; i++) {
        const option = priorityOptions.nth(i);
        await expect(option).toBeVisible();
        texts.push(await option.textContent());
    }

    const sorted = [...texts].sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
    expect(texts).not.toEqual(sorted); // the dropdown was not alphabetically ordered

});

test('TodoTask Add-Form Validation.', async ({page}) => {
    await loginUser(page, test_user);
    await page.waitForURL("/dashboard");

    const todoButton = 'a[href="/todos"]';
    await page.click(todoButton);
    await page.waitForURL("/todos");

    const openFormButton = "button.mantine-focus-auto:nth-child(5)";
    await page.waitForSelector(openFormButton, {state: 'visible'});
    await page.click(openFormButton);

    // wait for form fields to appear
    await page.waitForSelector('input[name="name"]', {state: 'visible'});
    await page.waitForSelector('input[name="category"]', {state: 'visible'});
    await page.waitForSelector('textarea[name="description"]', {state: 'visible'});
    await page.waitForSelector('input[name="due_date"]', {state: 'visible'});

    const submit = async () => {
        const submitButton = 'button.MuiButtonBase-root:nth-child(2)';
        await page.waitForSelector(submitButton, {state: 'visible'});
        await page.click(submitButton);
        await page.waitForTimeout(200); // allow error to appear
    };

    // Case 1: name is blank
    await page.fill('input[name="name"]', '');
    await submit();
    await expect(page.locator('#error-name')).toContainText("Task name cannot be blank");

    // Case 2: name is one digit
    await page.fill('input[name="name"]', '1');
    await submit();
    await expect(page.locator('#error-name')).toContainText("Task name cannot be only one digit");

    // Case 3: name is all digits
    await page.fill('input[name="name"]', '12345');
    await submit();
    await expect(page.locator('#error-name')).toContainText("Task name cannot contain only numbers");

    // Case 4: category is blank
    await page.fill('input[name="category"]', '');
    await submit();
    await expect(page.locator('#error-category')).toContainText("Category name cannot be blank");

    // Case 5: category is one digit
    await page.fill('input[name="category"]', '1');
    await submit();
    await expect(page.locator('#error-category')).toContainText("Category name cannot be only one digit");

    // Case 6: category is all digits
    await page.fill('input[name="category"]', '12345');
    await submit();
    await expect(page.locator('#error-category')).toContainText("Category name cannot contain only numbers");

    // Case 7: description is blank
    await page.fill('textarea[name="description"]', '');
    await submit();
    await expect(page.locator('#error-description')).toContainText("Description cannot be blank");

    // Case 8: due_date is before today
    const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    await page.fill('input[name="due_date"]', pastDate);
    await submit();
    await expect(page.locator('#error-due_date')).toContainText("Due date must not be earlier than the current day");
});
;






