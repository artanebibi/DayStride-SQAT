import {test, expect} from '@playwright/test';
import {test_user} from '../Data/user.js';
import {loginUser, registerUser} from '../Data/authHelpers.js'

test('Login Successful', async ({page}) => {

    await loginUser(page, test_user)
    await page.waitForURL('/dashboard');

    const hello_user = page.locator('.text-blue-400');
    await expect(hello_user).toContainText(test_user.username);
});

test('Login Unsuccessful', async ({page}) => {

    await loginUser(page, {username: "INVALID_USERNAME", password: "INVALID_PASSWORD"})
    const errorField = await page.locator(".text-red-500");

    await expect(errorField).toContainText("Invalid credentials or server error");
});

test('Register Successful', async ({page}) => {

    await registerUser(page, {username: test_user.username + Date.now(), password: test_user.password + Date.now()})

    await page.waitForURL("/login") // no other indicator for now
});

test('Register Unsuccessful', async ({page}) => {

    await registerUser(page, test_user)

    const error_message = await page.locator(".text-red-500")
    await expect(error_message).toContainText("Registration failed. Try a different username or check your connection.")
});


test('Logout', async ({page}) => {
    await loginUser(page, test_user)
    await page.waitForURL('/dashboard');

    await page.click("button.mantine-focus-auto")
    await page.waitForURL("/login")
});