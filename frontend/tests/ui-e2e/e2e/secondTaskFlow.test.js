import {test, expect} from '@playwright/test';
import {test_user} from '../Data/user.js';
import {loginUser} from '../Data/authHelpers.js';

test('Taskflow2 - login, add habit, edit habit, delete habit', async ({page}) => {
    await loginUser(page, test_user);
    await page.waitForURL('/dashboard');

    const uniqueId = Date.now();

    // add habit
    const habitButton = 'a[href="/habits"]';
    await page.click(habitButton);
    await page.waitForURL('/habits');

    const addHabitButton = 'button.mantine-focus-auto:nth-child(2)';
    await page.click(addHabitButton);

    const habitNameSelector = 'input[name=name]';
    const habitDescriptionSelector = 'textarea[name=description]';

    await page.fill(habitNameSelector, 'Habit' + uniqueId);
    await page.fill(habitDescriptionSelector, 'Habit description' + uniqueId);

    const submitHabitButton = 'button.MuiButtonBase-root:nth-child(2)';
    await page.click(submitHabitButton);
    await page.waitForURL('/habits');

    const habitCardContainer = await page.locator('.m_2415a157');
    await expect(habitCardContainer.locator(`h4:text("Habit${uniqueId}")`)).toBeVisible();

    // get the habit card which was just added
    const habitCard = page.locator('div.bg-white').last();

    // click edit button inside habit card
    await habitCard.locator('section:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button:nth-child(1)').click();

    // wait for the form to appear
    await page.waitForSelector(habitNameSelector);

    // get current values from the form inputs
    const currentName = await page.locator(habitNameSelector).inputValue();
    const currentDescription = await page.locator(habitDescriptionSelector).inputValue();

    // prepend "EDITED " to current values and fill the form
    await page.fill(habitNameSelector, 'EDITED ' + currentName);
    await page.fill(habitDescriptionSelector, 'EDITED ' + currentDescription);

    // submit the edited habit form
    await page.click(submitHabitButton);
    await page.waitForURL('/habits');

    // verify the habit name is updated with "EDITED " prefix
    const updatedHabitCardContainer = await page.locator('.m_2415a157');
    await expect(updatedHabitCardContainer.locator(`h4:text("EDITED Habit${uniqueId}")`)).toBeVisible();

    const deleteButton = habitCard.locator('section:nth-child(1) > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)');
    await deleteButton.click();
    await page.click("button.MuiButtonBase-root:nth-child(2)") // the second delete button
    await expect(habitCardContainer.locator(`h4:text("Habit${uniqueId}")`)).not.toBeVisible();
});
